using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace SampleFunctions;

public class GetAzureMapsToken()
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "https://demo.azuremaps.com/",
        "https://www.microsoft.com/",
        "https://microsoft.com/",
        "https://msmaps.azurewebsites.net/", // For local testing
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

    // The scopes for the access token
    private readonly string[] _Scopes =
    [
        "https://atlas.microsoft.com/.default"
    ];

    [Function("GetAzureMapsToken")]
    public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            // Managed identities for Azure resources and Azure Maps
            // For the Web SDK to authorize correctly, you still must assign Azure role based access control for the managed identity
            // https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-authentication
            AccessToken accessToken = await _TokenProvider.GetTokenAsync(new TokenRequestContext(_Scopes));

            return new OkObjectResult(accessToken.Token);
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}