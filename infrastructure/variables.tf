######################################################################
# Variables
######################################################################

variable "tags" {
  type = object({
    environment = string
  })
  default = {
    environment = "Terraform Training"
  }
}

variable "location" {
  type = string
  default = "West Europe"
  description = "Location in which to create resources"
}

variable "rgName" {
  type = string
  default = "training-azure-fuctions-tweeter-rg"
  description = "Name of resource group"
}

variable "storageName" {
  type = string
  default = "trainingafstorage"
  description = "Name of storage account"
}

# Function App

variable "servicePlanName" {
  type = string
  default = "functionServicePlan"
}

variable "functionAppName" {
  type = string
  default = "twitterTrainingFunctionPW"
}
