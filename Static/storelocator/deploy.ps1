# Azure Maps Store Locator (version 1.0-rc.2)
# Copyright (c) Microsoft Corporation. All rights reserved.
# https://github.com/Azure-Samples/Azure-Maps-Locator
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [switch]$Help,

    [string]$Location = "westeurope",
    [string]$Name = "storelocator",
    [string]$DatabaseName = "storelocator"
)

# Help function
function DisplayHelp {
    @"
Usage:
    .\deploy.ps1 [-Location <location>] [-Name <name>] [-DatabaseName <dbname>]

Options:
    -Location       Azure region where resources will be created. Default is 'westeurope'.
    -Name           Base name for the resources. Default is 'storelocator'.
    -DatabaseName   Name for the Cosmos DB database. Default is 'storelocator'.

    -Help           Display this help message.

Example:
    .\deploy.ps1 -Location "northcentralus" -Name "myapp" -DatabaseName "mydb"
"@
    exit
}

# Check if help switch is present
if ($Help.IsPresent) {
    DisplayHelp
}

echo "Starting..."

try {
    # Generate a random suffix for the Cosmos DB and Web App
    $suffix = Get-Random

    # Configuration
    $group = "rg-$Name"
    $azuremaps = "map-$Name"
    $cosmosdb = "db-$Name$suffix"
    $webserverplan = "plan-$Name"
    $webappname = "web-$Name$suffix"

    # Create a resource group
    echo "- Creating a Resource Group named '$group' in the '$Location' location..."
    az group create --name $group --location $Location | Out-Null

    # Create Azure Maps account
    echo "- Creating an Azure Maps account named '$azuremaps'..."
    az maps account create -g $group --account-name $azuremaps --sku G2 --kind Gen2 --accept-tos | Out-Null

    # Create Azure Cosmos DB
    echo "- Creating an Azure Cosmos DB server named '$cosmosdb'..."
    az cosmosdb create -g $group --name $cosmosdb --locations regionName=$Location --capabilities EnableServerless | Out-Null

    #echo "- Creating a database named '$DatabaseName'..."
    #az cosmosdb sql database create -g $group --account-name $cosmosdb --name $DatabaseName | Out-Null

    # Get Cosmos DB connection string
    $connectionString = $(az cosmosdb keys list -g $group --name $cosmosdb --type connection-strings --query 'connectionStrings[0].connectionString' -o tsv)

    # Create Webserver and Website
    echo "Creating a Webserver plan named '$webserverplan' for the Website '$webappname'..."
    az appservice plan create -g $group -n $webserverplan --location $Location | Out-Null
    az webapp create -g $group -p $webserverplan -n $webappname -r "dotnet:8" | Out-Null

    # Use managed identities
    echo "- Utilizing managed identities for Azure Maps..."
    az webapp identity assign -n $webappname -g $group | Out-Null

    Start-Sleep -Seconds 5

    $principal = (az webapp identity show -g $group --name $webappname --query 'principalId' --output tsv)
    $scope = (az maps account show -g $group --name $azuremaps --query 'id' --output tsv)

    az role assignment create --assignee $principal --role "Azure Maps Data Reader" --scope $scope | Out-Null

    # Get the Azure Maps Client Id
    $azuremaps = (az maps account show -n $azuremaps -g $group --query 'properties.uniqueId' --output tsv)

    # Creating AD App registration
    echo "- Creating an Azure AD App registration..."
    az ad app create --display-name "Azure Maps Store Locator for $webappname" --web-redirect-uris https://$webappname.azurewebsites.net/signin-oidc https://localhost:7074/signin-oidc --enable-access-token-issuance true --enable-id-token-issuance true --sign-in-audience AzureADMyOrg | Out-Null

    echo "- Storing App Settings..."
    $clinetId = (az ad app list --display-name "Azure Maps Store Locator for $webappname" --query '[0].appId' -o tsv)
    $tenantId = (az account show --query 'tenantId' -o tsv)
    $email = (az rest --method get --url 'https://graph.microsoft.com/v1.0/me' --query 'userPrincipalName' -o tsv)
    $domain = $email.Split('@')[1]

    az webapp config appsettings set -g $group -n $webappname --settings AzureMaps:ClientId=$azuremaps AzureMaps:TokenUrl=/api/azuremaps/token Database:Name=$DatabaseName Database:ConnectionString=$connectionString AzureAd:Instance=https://login.microsoftonline.com/ AzureAd:Domain=$domain AzureAd:TenantId=$tenantId AzureAd:ClientId=$clinetId AzureAd:CallbackPath=/signin-oidc | Out-Null

    # Deploy Azure Maps Store Locator
    echo "- Initiating the deployment of the Store Locator website..."
    iwr "https://samples.azuremaps.com/storelocator/storelocator.zip" -o storelocator$suffix.zip
    az webapp deployment source config-zip -g $group -n $webappname --src storelocator$suffix.zip | Out-Null
    Remove-Item storelocator$suffix.zip | Out-Null

    # Done
    echo "Open https://$webappname.azurewebsites.net/ to access your Store Locator."
    echo "Done! Your Azure Maps Store Locator infrastructure and website are ready."
}
catch {
    echo "An error occurred: $($_.Exception.Message)"
}