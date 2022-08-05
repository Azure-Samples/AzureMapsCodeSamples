using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Azure.Core;
using Azure.Identity;

namespace SampleFunctions
{
    public static class GetAzureMapsToken
    {
        private static readonly string[] allowed = { "https://samples.azuremaps.com/",
                                                     "https://demo.azuremaps.com/",
                                                     "http://localhost"};

        [FunctionName("GetAzureMapsToken")]
        public static async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowed, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            // Managed identities for Azure resources and Azure Maps
            // For the Web SDK to authorize correctly, you still must assign Azure role based access control for the managed identity
            // https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-authentication
            var tokenCredential = new DefaultAzureCredential();
            var accessToken = await tokenCredential.GetTokenAsync(
                new TokenRequestContext(new[] { "https://atlas.microsoft.com/.default" })
            );

            return new OkObjectResult(accessToken.Token);
        }
    }
}
