using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;

namespace SampleFunctions
{
    public static class GetAzureMapsKey
    {
        private static readonly string[] allowed = { "https://samples.azuremaps.com/",
                                                     "https://demo.azuremaps.com/",
                                                     "http://localhost"};

        [FunctionName("GetAzureMapsKey")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowed, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            // Azure Maps Shared Key authentication
            // https://docs.microsoft.com/en-us/azure/azure-maps/azure-maps-authentication#shared-key-authentication
            // We recommend that you use the primary key as the subscription key when you use Shared Key authentication to call Azure Maps.
            // It's best to use the secondary key in scenarios like rolling key changes.
            string key = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");
            if (string.IsNullOrEmpty(key))
                return new NotFoundResult();

            return new OkObjectResult(key);
        }
    }
}
