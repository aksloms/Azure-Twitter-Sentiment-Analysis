######################################################################
# Variables
######################################################################

variable "tags" {
  type = object({
    environment = string
  })
  default = {
    organization = "PW"
    environment = "Develop"
    managedBy = "Terraform"
  }
}

variable "location" {
  type = string
  default = "West Europe"
  description = "Location in which to create resources"
}

variable "rgName" {
  type = string
  description = "Name of resource group"
}

variable "mainStorageAccountName" {
  type = string
  default = "trainingafstorage"
}

# Function App

variable "fetchTweetsServicePlanName" {
  type = string
}

variable "FetchTweetsAppInsightsName" {
  type = string
}

variable "FetchTweetsFunctionAppName" {
  type = string
}
