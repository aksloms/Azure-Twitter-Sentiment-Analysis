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
}

variable "dataStorageAccountName" {
  type = string
}

# Shared App Congiguration

variable "sharedAppConfigurationName" {
  type = string
}

variable "hashtags" {
  type = list(string)
  description = "Hashtags that will be processed by application"
}

# Fetch tweets Function App

variable "fetchTweetsServicePlanName" {
  type = string
}

variable "FetchTweetsAppInsightsName" {
  type = string
}

variable "FetchTweetsFunctionAppName" {
  type = string
}

variable "TweeterAPIKey" {
  type = string
  description = "API key used to fetch data from Twitter API v2"
}

variable "TweeterAPISecret" {
  type = string
  description = "Secret used to fetch data from Twitter API v2"
  sensitive = true
}

variable "TweeterAPIBearerToken" {
  type = string
  description = "Bearer token used to fetch data from Twitter API v2"
  sensitive = true
}

# Process tweets Function App

variable "textAnalyticsName" {
  type = string
}

variable "processTweetsServicePlanName" {
  type = string
}

variable "processTweetsAppInsightsName" {
  type = string
}

variable "processTweetsFunctionAppName" {
  type = string
}

# Backend Python App

variable "backendAppServicePlanName" {
  type = string
}

variable "backendAppServiceName" {
  type = string
}
