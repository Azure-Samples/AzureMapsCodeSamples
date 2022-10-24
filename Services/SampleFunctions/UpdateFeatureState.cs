using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace SampleFunctions
{
    public static class UpdateFeatureState
    {
        const string geography = "us";
        const string featureStateSetId = "f972e790-f6dd-e305-0cad-6559343e64e3";

        private static readonly string[] allowed = { "https://samples.azuremaps.com/",
                                                     "http://localhost"};

        private static readonly HttpClient httpClient = new();

        [FunctionName("UpdateFeatureState")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowed, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            // TODO: add input validation
            string featureId = req.Query["featureId"];
            if (string.IsNullOrEmpty(featureId))
                return new BadRequestObjectResult("Please pass a valid featureId on the query string.");

            // TODO: add input validation
            string state = req.Query["state"];
            if (string.IsNullOrEmpty(state))
                return new BadRequestObjectResult("Please pass a valid state on the query string.");

            // Azure Maps Shared Key authentication
            // https://docs.microsoft.com/en-us/azure/azure-maps/azure-maps-authentication#shared-key-authentication
            // We recommend that you use the primary key as the subscription key when you use Shared Key authentication to call Azure Maps.
            // It's best to use the secondary key in scenarios like rolling key changes.
            string key = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");

            // Azure Maps Creator API, see for details: https://learn.microsoft.com/en-us/rest/api/maps/v2/feature-state/update-stateset
            string url = $"https://{geography}.atlas.microsoft.com/featurestatesets/{featureStateSetId}/featureStates/{featureId}?api-version=2.0&subscription-key={key}";

            // Update the maps feature stateset
            var postcontent = new JObject(
                new JProperty(
                    "States",
                    new JArray(
                        new JObject(
                            new JProperty("keyName", "occupied"),
                            new JProperty("value", state),
                            new JProperty("eventTimestamp", DateTime.UtcNow.ToString("s"))))));

            using var response = await httpClient.PutAsync(url, new StringContent(postcontent.ToString()));

            if (!response.IsSuccessStatusCode)
                return new BadRequestObjectResult("An error occurred. It was not possible to update the state.");

            return new OkObjectResult($"State updated for feature {featureId}");
        }
    }
}
