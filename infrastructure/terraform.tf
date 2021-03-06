######################################################################
# Terraform init
######################################################################

terraform {
  required_providers {
    azurerm = {
      # The "hashicorp" namespace is the new home for the HashiCorp-maintained
      # provider plugins.
      #
      # source is not required for the hashicorp/* namespace as a measure of
      # backward compatibility for commonly-used providers, but recommended for
      # explicitness.
      source  = "hashicorp/azurerm"
      version = "~> 2.44.0"
    }
  }
}

provider "azurerm" {
  features {}
}

######################################################################
# Resources
######################################################################

resource "azurerm_resource_group" "rg" {
  name     = var.rgName
  location = var.location

  tags = var.tags
}

resource "azurerm_storage_account" "storage" {
  name                     = var.mainStorageAccountName
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  tags = var.tags
}

resource "azurerm_storage_account" "dataStorage" {
  name                     = var.dataStorageAccountName
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "ZRS" // Use zonal redundancy to protect data
  min_tls_version          = "TLS1_2"

  tags = var.tags
}

resource "azurerm_storage_table" "LabeledTweets" {
  name                 = "LabeledTweets"
  storage_account_name = azurerm_storage_account.dataStorage.name
}

### Shared app configuration ###

//TODO: Use ARM template to store hashtags in shared configuration  
# resource "azurerm_app_configuration" "sharedAppconf" {
#   name                = "appConf1"
#   resource_group_name = azurerm_resource_group.rg.name
#   location            = azurerm_resource_group.rg.location

#   sku = "free"

# }

### Fetch tweets function app ###

# Storage account resources used by Fetch tweets function app

resource "azurerm_storage_queue" "tweetsque" {
  name                 = "tweetsque"
  storage_account_name = azurerm_storage_account.storage.name
}

resource "azurerm_storage_table" "LastTweetForHashtag" {
  name                 = "LastTweetForHashtag"
  storage_account_name = azurerm_storage_account.storage.name
}

# Main function app resources
resource "azurerm_app_service_plan" "fetchTweetsASP" {
  name                = var.fetchTweetsServicePlanName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "FunctionApp"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_application_insights" "fetchTweetsAI" {
  name                = var.FetchTweetsAppInsightsName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_function_app" "fetchTweetsFA" {
  name                       = var.FetchTweetsFunctionAppName
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  app_service_plan_id        = azurerm_app_service_plan.fetchTweetsASP.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  os_type                    = "linux"
  version                    = "~3"

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.fetchTweetsAI.instrumentation_key
    "TweeterAPIKey" = var.TweeterAPIKey
    "TweeterAPISecret" = var.TweeterAPISecret
    "TwitterAPIBearerToken" = var.TweeterAPIBearerToken
    "Hashtags" = jsonencode(var.hashtags)
    "LastTweetTableName" = azurerm_storage_table.LastTweetForHashtag.name
  }

  connection_string {
    name = "mainStorage"
    type = "Custom"
    value = azurerm_storage_account.storage.primary_connection_string
  }

  site_config {
    http2_enabled = true
  }
}

#############################################
######### Lable tweets function app #########
#############################################

resource "azurerm_cognitive_account" "textAnalytics" {
  name                = var.textAnalyticsName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "TextAnalytics"

  sku_name = "F0"
}

# Main function app resources
resource "azurerm_app_service_plan" "processTweetsASP" {
  name                = var.processTweetsServicePlanName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "FunctionApp"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_application_insights" "processTweetsAI" {
  name                = var.processTweetsAppInsightsName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_function_app" "processTweetsFA" {
  name                       = var.processTweetsFunctionAppName
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  app_service_plan_id        = azurerm_app_service_plan.processTweetsASP.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  os_type                    = "linux"
  version                    = "~3"

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.processTweetsAI.instrumentation_key
    "TextAnalyticsApiKey" = azurerm_cognitive_account.textAnalytics.primary_access_key
    "TextAnalyticsEndpoint" = azurerm_cognitive_account.textAnalytics.endpoint
    "LabeledTweetsTableName" = azurerm_storage_table.LabeledTweets.name
    "QueueStorageConnection" = azurerm_storage_account.storage.primary_connection_string
    "DataStorageConnection" = azurerm_storage_account.dataStorage.primary_connection_string
  }

  site_config {
    http2_enabled = true
  }
}


#############################################
############ Backend Python App #############
#############################################

resource "azurerm_app_service_plan" "backendAppServicePlan" {
  name                = var.backendAppServicePlanName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind = "Linux"
  reserved = true

  sku {
    tier = "Free"
    size = "F1"
  }
}

resource "azurerm_app_service" "backendAppService" {
  name                = var.backendAppServiceName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.backendAppServicePlan.id

  site_config {
    use_32_bit_worker_process = true
    linux_fx_version = "PYTHON|3.8"
  }

  app_settings = {
    "CONNECTION_STRING" = azurerm_storage_account.dataStorage.primary_connection_string
  }
}

#############################################
################ Databricks #################
#############################################

resource "azurerm_databricks_workspace" "databricks" {
  name                = var.databricksName
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "standard"
}

######################################################################
# Outputs
######################################################################

output "fetchTweetsFunctionAppName" {
  value = azurerm_function_app.fetchTweetsFA.name
}

output "tweetsQueName" {
  value = azurerm_storage_queue.tweetsque.name
}

output "lastTweetForHashtagTableName" {
  value = azurerm_storage_table.LastTweetForHashtag.name
}

output "processTweetsFunctionAppName" {
  value = azurerm_function_app.fetchTweetsFA.name
}

output "labeledTweetsTableName" {
  value = azurerm_storage_table.LabeledTweets.name
}