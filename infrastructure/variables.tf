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
  description = "Name of resource group"
}

variable "storageName" {
  type = string
  default = "trainingafstorage"
}

# Function App

variable "servicePlanName" {
  type = string
}

variable "appInsightsName" {
  type = string
}

variable "functionAppName" {
  type = string
}
