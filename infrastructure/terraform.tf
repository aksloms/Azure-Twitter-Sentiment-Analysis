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
        version = "~> 2.39.0"
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

### Function app ###

resource "azurerm_app_service_plan" "fetchTweetsASP" {
  name                = var.fetchTweetsServicePlanName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "FunctionApp"

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
  version                    = "~3"

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.fetchTweetsAI.instrumentation_key
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
