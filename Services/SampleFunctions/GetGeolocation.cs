using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SampleFunctions.Models;

namespace SampleFunctions
{
    public static class GetGeolocation
    {
        private static readonly HttpClient _HttpClient = new();

        [Function("GetGeolocation")]
        public static async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);

            // Get the IP address from the query string
            var ip = req.Query["ip"];
            if (string.IsNullOrEmpty(ip))
            {
                badRequest.WriteString("Please pass a valid IP address on the query string.");
                return badRequest;
            }

            // Get the Azure Maps key from the environment variables
            var azureMapsKey = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");
            var url = $"https://atlas.microsoft.com/geolocation/ip/json?subscription-key={azureMapsKey}&api-version=1.0&ip={ip}";

            // Get the geolocation from Azure Maps
            var result = await _HttpClient.GetFromJsonAsync<Geolocation>(url);
            if (result == null)
            {
                badRequest.WriteString("An error occurred. It was not possible to get the location of this IP address.");
                return badRequest;
            }

            // Get the region from the geolocation
            var region = new RegionInfo(result.CountryRegion.IsoCode);
            var json = JsonSerializer.Serialize(region);

            // Create a new response
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/json; charset=utf-8");
            response.WriteString(json);

            return response;
        }
    }
}