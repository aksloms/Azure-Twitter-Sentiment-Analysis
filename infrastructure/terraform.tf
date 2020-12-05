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
  name                     = var.storageName
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  tags = var.tags
}

resource "azurerm_app_service_plan" "asp" {
  name                = var.servicePlanName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "functionApp" {
  name                       = var.functionAppName
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  app_service_plan_id        = azurerm_app_service_plan.asp.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
}
