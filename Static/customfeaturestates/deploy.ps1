#Requires -Version 7.0

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [switch]$Help,

    [string]$Location = "eastus2",
    [string]$Name = "featurestates",
    [string]$ResourceGroup = "",
    [string]$DatabaseName = "featurestatesdb",
    [AllowNull()]$ResourceSuffix = $null,
    [string]$DrawingPackageUri = ""
)

# Help function
function DisplayHelp
{
    @"
Usage:
    .\deploy.ps1 [-Location <location>] [-Name <name>] [-ResourceGroup <rgname>] [-DatabaseName <dbname>] [-ResourceSuffix <suffix>] [-DrawingPackageUri <packageuri>]

Options:
    -Location           Azure region where resources will be created. Default is 'eastus2'.
    -Name               Base name for the resources. Default is 'featurestates'.
    -ResourceGroup      Name of resource group. Default is 'rg-$Name'.
    -DatabaseName       Name for the Cosmos DB. Default is 'featurestatesdb'.
    -ResourceSuffix     If set, Azure resources are given this suffix; otherwise, a random suffix is used.
    -DrawingPackageUri  URI for the map being visualized. Default is an Azure sample.
    -Help               Display this help message.

Example:
    .\deploy.ps1 -Location "northcentralus" -Name "myapp" -DatabaseName "mydb"
"@
    exit
}

function Test-LastExitCode
{
  if ($LastExitCode -ne 0 )
  {
    Write-Err "Operation failed with exit code $LastExitCode" -ErrorAction 'Stop'
    exit $LastExitCode
  }
}

function Process-LRO
{
    param ($uri, $filePath, $contentType, $responseHeader, $authPartUri, $operationName)

    Write-Log -Message "- Processing LRO '$operationName' at '$uri'" -Logfile $logLocation -Severity Information

    $uri = $uri+$authPartUri

    if ($PSBoundParameters.ContainsKey("filePath"))
    {
        $response = Invoke-RestMethod -Uri $uri -Method Post -InFile $filePath -ContentType $contentType -StatusCodeVariable scv -ResponseHeadersVariable responseHeader -SkipHttpErrorCheck
    }
    else
    {
        $response = Invoke-RestMethod -Uri $uri -Method Post -StatusCodeVariable scv -ResponseHeadersVariable responseHeader -ContentType 'Application/json' -SkipHttpErrorCheck
    }

    # Check if the response status code is 202 - Accepted
    if ($scv -ne 202)
    {
        Write-Err "Failed to send $operationName request. Status code: $scv Response: $(ConvertTo-Json $response)"
        exit 1
    }

    # Read the response header named "Location" for UDID; "Operation-Location" for everything else
    $location = If ($responseHeader.Location -like '') {$responseHeader["Operation-Location"]} Else {$responseHeader.Location}
    if ($location -like '')
    {
        Write-Err "Failed to determine location from response for $operationName request. Response header: $responseHeader"
        exit 1
    }

    $location = $location.Trim() + $authPartUri

    # Issue GET requests to the new Location URI with a delay until either a failed response or a 201 Created response is received
    $counter = 0
    do
    {
        $counter++
        Start-Sleep -Milliseconds 1000
        $statusResponse = Invoke-RestMethod -Uri $location -Method Get -StatusCodeVariable scv -ResponseHeadersVariable rh -SkipHttpErrorCheck
        $status = $statusResponse.status
    } while (($status -eq "Running") -and ($counter -le 30 * 60))

    # Check if the response JSON has a "status" field set to "Failed" for failed responses
    if ($status -eq "Failed")
    {
        Write-Err "Failed to create artifact for $operationName request. Status: $($statusResponse.statusMessage), Code: $scv, Response: $(ConvertTo-Json $statusResponse)"
        exit 1
    }

    $resourceLocation = If ($statusResponse.resourceLocation -like '') {$rh["Resource-Location"]} Else {$statusResponse.resourceLocation}

    if ($resourceLocation -like '')
    {
        Write-Err "Failed to determine resource location from response for $operationName request. Response: $(ConvertTo-Json $statusResponse)"
        exit 1
    }

    # Report the GUID after the last "/" as an output. That is the ID of the artifact that was created by this long running operation.
    $artifactId = $resourceLocation.Split("/")[-1].Split("?")[0]
    return $artifactId
}

# Check if help switch is present
if ($Help.IsPresent)
{
    DisplayHelp
}

function CreateLogDirectory
{ 	
    $TARGETDIR = If ($null -eq $env:AZUREPS_HOST_ENVIRONMENT) {"$env:HOMEDRIVE\Logs"} Else {"$env:HOME\Logs"}
    if ( -Not (Test-Path -Path $TARGETDIR ) ) {
        New-Item -ItemType directory -Path $TARGETDIR | Out-Null
    }
   
   $TARGETDIR = $TARGETDIR + "\" + "customfeaturestates_deploy_log.tsv"

   return $TARGETDIR
}

function GetTempFile([string]$fileName)
{
    return [System.IO.Path]::GetTempPath() + "\" + $fileName
}

filter Out-Stream
{
     if ( $DebugPreference -eq 'Continue' )
     {
        "$_" | Out-Default
     }
     else
     {
        "$_" | Out-Null
     }
}

filter Out-Debug
{
     if ( $DebugPreference -eq 'Continue' )
     {
        "$_" | Out-Default
     }

    Write-Log -Message "$_" -Logfile $logLocation -Severity Information
}

function Write-Err([string]$message)
{
    Write-Output $message
    Write-Log -Message "$message" -Logfile $logLocation -Severity Error
}

function Write-Info([string]$message)
{
    Write-Output $message
    Write-Log -Message "$message" -Logfile $logLocation -Severity Information
}

function Write-Log
{
    [CmdletBinding()]
    param(
        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [string]$Message,

        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [string]$LogFile,
 
        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [ValidateSet('Information', 'Warning', 'Error')]
        [string]$Severity = 'Information'
    )
     
    [pscustomobject]@{
        Time     = (Get-Date -f g)
        Message  = $Message
        Severity = $Severity
    } | ConvertTo-Csv -Delimiter "`t" -NoTypeInformation | Select-Object -Skip 1 | Out-File -Append -FilePath $LogFile
}

Write-Output "Starting..."
$ErrorActionPreference = "Stop"
$logLocation = CreateLogDirectory
Write-Output "- Logs written to $logLocation"

try
{
    # Version check
    [version]$azcliversion = $(-join (az version) | convertFrom-Json).'azure-cli'
    [version]$minversion = '2.52.0'
    if ($azcliversion -lt $minversion)
    {
        Write-Err "Script requires Azure CLI Version $minversion or later, used version is $azcliversion"
        exit 1
    }

    $Name = $Name.ToLower()

    # Generate a random suffix for resources
    $suffix = If ($null -ne $ResourceSuffix) {$ResourceSuffix} Else {Get-Random}

    # General Configuration
    $group = If ($ResourceGroup -ne "") {$ResourceGroup} Else {"rg-$Name"}
    $signalr = "signalr-$Name$suffix"
    $azuremaps = "map-$Name"
    $azuremapsCreator = "mapcreator-$Name"
    $cosmosdb = "db-$Name$suffix"
    $webserverplan = "plan-$Name"
    $webappname = "web-$Name$suffix"

    # Azure Maps Configuration
    $azuremapsDrawingPackageUri = If ($DrawingPackageUri -ne "") {$DrawingPackageUri} Else {"https://github.com/Azure-Samples/am-creator-indoor-data-examples/raw/master/Drawing%20Package%202.0/Sample%20-%20Contoso%20Drawing%20Package.zip"}
    $azuremapsSourceLayer = "room" # this may be different for your own map
    $azuremapsAPIVersion = "2023-03-01-preview"

    # Geography
    $geography = $(az account list-locations --query "[?name == '$Location'].{GG:metadata.geographyGroup}" -o tsv)
    $azuremapsGeography = If($geography -like  "*Europe*") {"eu"} Else {"us"}
    Write-Info "- Assuming Azure maps geography '$azuremapsGeography' based on location '$location', geography '$geography' "

    # Create a resource group
    if ($(az group exists --name $group) -eq 'true')
    {
        Write-Info "- Not creating a Resource Group named '$group' as it already exists"
    }
    else
    {
        Write-Info "- Creating a Resource Group named '$group' in the '$Location' location..."
        az group create --name $group --location $Location | Out-Stream
        Test-LastExitCode
    }

    # Create Azure Maps account
    Write-Info "- Creating an Azure Maps account named '$azuremaps'..."
    az maps account create -g $group --account-name $azuremaps --sku G2 --kind Gen2 --accept-tos | Out-Stream
    Test-LastExitCode
    $azuremapssubscriptionkey = $(az maps account keys list -g $group --account-name $azuremaps --query "primaryKey" -o tsv)
    Test-LastExitCode

    # Create Azure Maps creator account
    if ($( az maps creator list -g $group --account-name $azuremaps --query '[] | length(@)' -o tsv) -ne '0')
    {
        Write-Info "- Not creating an Azure Maps creator account for '$azuremaps' as it already exists"
    }
    else
    {
        Write-Info "- Creating an Azure Maps creator account named '$azuremapsCreator'..."
        az maps creator create -g $group --account-name $azuremaps --creator-name $azuremapsCreator --storage-units 2 | Out-Stream
        Test-LastExitCode
    }
    
    # Upload package
    $azuremapsDomain = "https://$azuremapsGeography.atlas.microsoft.com"
    Write-Info "- Uploading drawing package using creator account from '$azuremapsDrawingPackageUri' to '$azuremapsDomain'..."
    Write-Info "- This operation may take several minutes; please wait..."
    $packageFilePath = GetTempFile("drawing_package_$Name.zip")
    Invoke-WebRequest "$azuremapsDrawingPackageUri" -OutFile $packageFilePath
    $authPart = "&subscription-key=$azuremapssubscriptionkey"
    $uduri = "$azuremapsDomain/mapData/upload?api-version=1.0&dataFormat=zip"
    $conversionUri = "$azuremapsDomain/conversions?api-version=$azuremapsAPIVersion&dwgPackageVersion=2.0"
    $datasetUri = "$azuremapsDomain/datasets?api-version=$azuremapsAPIVersion"
    $tilesetUri = "$azuremapsDomain/tilesets?api-version=$azuremapsAPIVersion"

    $udId = Process-LRO -responseHeader $rh -authPartUri $authPart -uri $uduri -filePath $packageFilePath -contentType "application/octet-stream" -operationName "UserDataUpload"
    $conversionId = Process-LRO -responseHeader $rh -authPartUri $authPart  -uri $conversionUri"&udid=$udId" -operationName "Conversion"
    $datasetId = Process-LRO -responseHeader $rh -authPartUri $authPart  -uri $datasetUri"&conversionId=$conversionId" -operationName "Dataset"
    $tilesetId = Process-LRO -responseHeader $rh -authPartUri $authPart  -uri $tilesetUri"&datasetId=$datasetId" -operationName "Tileset"
    $mapConfigurationId = "default_$tilesetId"

    # Create SignalR service
    Write-Info "- Creating an Azure SignalR service named '$signalr'..."
    az signalr create -g $group --name $signalr --sku Standard_S1 --service-mode Default --location $Location | Out-Stream
    Test-LastExitCode
    $signalrconnectionstring = $(az signalr key list -g $group --name $signalr --query 'primaryConnectionString' -o tsv)
    Test-LastExitCode

    # Create Azure Cosmos DB
    Write-Info "- Creating an Azure Cosmos DB server named '$cosmosdb'..."
    az cosmosdb create -g $group --name $cosmosdb --locations regionName=$Location --capabilities EnableServerless | Out-Stream
    Test-LastExitCode
    
    Write-Info "- Creating a database named '$DatabaseName'..."
    az cosmosdb sql database create -g $group --account-name $cosmosdb --name $DatabaseName | Out-Stream
    Test-LastExitCode
    az cosmosdb sql container create -g $group --account-name $cosmosdb --database-name $DatabaseName --name FeatureStates --partition-key-path /partitionKey | Out-Stream
    Test-LastExitCode

    # Get Cosmos DB connection string
    $connectionString = $(az cosmosdb keys list -g $group --name $cosmosdb --type connection-strings --query 'connectionStrings[0].connectionString' -o tsv)

    # Create Webserver and Website
    Write-Info "- Creating a Webserver plan named '$webserverplan' for the Website '$webappname'..."
    az appservice plan create -g $group -n $webserverplan --location $Location | Out-Stream
    Test-LastExitCode
    az webapp create -g $group -p $webserverplan -n $webappname -r "dotnet:7" | Out-Stream
    Test-LastExitCode

    # Use managed identities
    Write-Info "- Utilizing managed identities for Azure Maps..."
    az webapp identity assign -n $webappname -g $group | Out-Stream
    Test-LastExitCode

    Start-Sleep -Seconds 5

    $principal = (az webapp identity show -g $group --name $webappname --query 'principalId' --output tsv)
    $scope = (az maps account show -g $group --name $azuremaps --query 'id' --output tsv)

    Write-Info "- Assigning Azure Maps Data Reader role to principal..."
    az role assignment create --assignee $principal --role "Azure Maps Data Reader" --scope $scope | Out-Stream
    Test-LastExitCode

    # Get the Azure Maps Client Id
    $azuremapsClientId = (az maps account show -n $azuremaps -g $group --query 'properties.uniqueId' --output tsv)

    # Creating AD App registration
    Write-Info "- Creating an Azure AD App registration..."
    az ad app create --display-name "Azure Maps Custom Feature States for $webappname" --web-redirect-uris https://$webappname.azurewebsites.net/signin-oidc https://localhost:7239/signin-oidc --enable-access-token-issuance true --enable-id-token-issuance true --sign-in-audience AzureADMyOrg | Out-Stream
    Test-LastExitCode

    Write-Info "- Storing App Settings..."
    $clientId = (az ad app list --display-name "Azure Maps Custom Feature States for $webappname" --query '[0].appId' -o tsv)
    $tenantId = (az account show --query 'tenantId' -o tsv)
    $email = (az rest --method get --url 'https://graph.microsoft.com/v1.0/me' --query 'userPrincipalName' -o tsv)
    $domain = $email.Split('@')[1]

    az webapp config appsettings set -g $group -n $webappname --settings Azure:SignalR:ConnectionString=$signalrconnectionstring AzureMaps:Domain=$azuremapsDomain AzureMaps:ClientId=$azuremapsClientId AzureMaps:TokenUrl=/api/azuremaps/token AzureMaps:APIVersion=$azuremapsAPIVersion AzureMaps:MapConfigurationId=$mapConfigurationId AzureMaps:DatasetId=$datasetId AzureMaps:SourceLayer=$azuremapsSourceLayer Database:Name=$DatabaseName Database:ConnectionString=$connectionString AzureAd:Instance=https://login.microsoftonline.com/ AzureAd:Domain=$domain AzureAd:TenantId=$tenantId AzureAd:ClientId=$clientId AzureAd:CallbackPath=/signin-oidc | Out-Stream
    Test-LastExitCode

    # Deploy Azure Maps Custom Feature States
    Write-Info "- Initiating the deployment of the Custom Feature States website..."
    $deploymentPath = GetTempFile("customfeaturestates_binaries.zip")
    if ($(Test-Path -path '.\FeatureStateService\Properties\PublishProfiles\FolderProfile.pubxml' -PathType Leaf))
    {
        Write-Info "- Building deployment zip from local sources..."
        $tempPublishPath = GetTempFile("customfeaturestates_publish")
        dotnet publish FeatureStateService -o $tempPublishPath -p:PublishProfile=FolderProfile | Out-Debug
        Test-LastExitCode
        Compress-Archive $tempPublishPath\* $deploymentPath -Force | Out-Debug
        Test-LastExitCode
        Remove-Item $tempPublishPath -Recurse | Out-Debug
    }
    else
    {
        Write-Info "- Downloading deployment zip..."
        Invoke-WebRequest "https://samples.azuremaps.com/install/customfeaturestates.zip" -OutFile $deploymentPath
        Test-LastExitCode
    }
    az webapp deployment source config-zip -g $group -n $webappname --src $deploymentPath | Out-Stream
    Test-LastExitCode
    Remove-Item $deploymentPath | Out-Debug

    # Done
    Write-Info "Azure Resources created: $group, $signalr, $azuremaps, $azuremapsCreator, $cosmosdb, $webserverplan, $webappname"
    Write-Info "Azure Maps resources created: udId: $udId, conversionId: $conversionId, datasetId: $datasetId, tilesetId: $tilesetId, mapConfigurationId: $mapConfigurationId"
    Write-Info "Open https://$webappname.azurewebsites.net/ to access your website."
    Write-Info "Done! Your Azure Maps Custom Feature States infrastructure and website are ready."
}
catch
{
    Write-Err "An error occurred: $($_.Exception)"
}
