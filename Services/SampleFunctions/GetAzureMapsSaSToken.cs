using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Maps;
using Azure.ResourceManager.Maps.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using System;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SampleFunctions;

public class GetAzureMapsSaSToken()
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "http://localhost:58035/" // For local testing
    ];

    /// <summary>
    /// This token provider simplifies access tokens for Azure Resources. It uses the Managed Identity of the deployed resource.
    /// For instance if this application was deployed to Azure App Service or Azure Virtual Machine, you can assign an Azure AD
    /// identity and this library will use that identity when deployed to production.
    /// </summary>
    /// <remarks>
    /// This tokenProvider will cache the token in memory, if you would like to reduce the dependency on Azure AD we recommend
    /// implementing a distributed cache combined with using the other methods available on tokenProvider.
    /// </remarks>
    private readonly DefaultAzureCredential _TokenProvider = new();

    private ArmClient armClient;

    [Function("GetAzureMapsSaSToken")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            armClient = new ArmClient(_TokenProvider);

            // Generate SAS token for Azure Maps
            string sasToken = GenerateAzureMapsSasToken(armClient);

            return new OkObjectResult(sasToken);
        }

        // Return access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }

    /// <summary>
    /// Generates a Shared Access Signature (SAS) token for Azure Maps authentication.
    /// </summary>
    /// <param name="armClient">The ArmClient instance to use for authentication</param>
    /// <param name="expiryInMinutes">Token expiry time in seconds (default: 600)</param>
    /// <param name="maxRatePerSecond">Maximum rate per second (default: 100)</param>
    /// <returns>The SAS token string</returns>
    private string GenerateAzureMapsSasToken(ArmClient armClient, int expiryInSeconds = 600, int maxRatePerSecond = 50)
    {
        string subscriptionId = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_ID");
        string resourceGroupName = Environment.GetEnvironmentVariable("AZURE_MAPS_RESOURCE_GROUP_NAME");
        string accountName = Environment.GetEnvironmentVariable("AZURE_MAPS_ACCOUNT_NAME");

        // Get maps account resource
        ResourceIdentifier mapsAccountResourceId = MapsAccountResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, accountName);
        MapsAccountResource mapsAccount = armClient.GetMapsAccountResource(mapsAccountResourceId);

        // Assign SAS token information
        // Every time you want to SAS token, update the principal ID, max rate, start and expiry time
        string principalId = Environment.GetEnvironmentVariable("AZURE_MAPS_PRINCIPAL_ID");

        // Set start and expiry time for the SAS token in round-trip date/time format
        DateTime start = DateTime.Now;
        DateTime expiry = start.AddSeconds(expiryInSeconds);

        // Create the SAS token content
        // The MapsSigningKey is used to specify the type of signing key to use for the SAS token
        // In this case, we are using primary key as the signing key
        MapsAccountSasContent sasContent = new MapsAccountSasContent(
            MapsSigningKey.PrimaryKey,
            principalId,
            maxRatePerSecond,
            start.ToString("O"),
            expiry.ToString("O"));

        // Get SAS token
        Response<MapsAccountSasToken> sas = mapsAccount.GetSas(sasContent);

        // Create a SearchClient that will authenticate via SAS token
        AzureSasCredential sasCredential = new(sas.Value.AccountSasToken);

        // Return SAS token signature in string format
        return sasCredential.Signature;
    }
}