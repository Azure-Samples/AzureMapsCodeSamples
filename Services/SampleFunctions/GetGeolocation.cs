using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using SampleFunctions.Models;

namespace SampleFunctions
{
    public static class GetGeolocation
    {
        private static readonly string[] allowd = { "https://samples.azuremaps.com/",
                                                    "http://localhost"};

        private static readonly HttpClient httpClient = new();

        [FunctionName("GetGeolocation")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowd, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            string ip = req.Query["ip"];
            if (string.IsNullOrEmpty(ip))
                return new BadRequestObjectResult("Please pass a valid IP address on the query string.");

            // Azure Maps Shared Key authentication
            // https://docs.microsoft.com/en-us/azure/azure-maps/azure-maps-authentication#shared-key-authentication
            // We recommend that you use the primary key as the subscription key when you use Shared Key authentication to call Azure Maps.
            // It's best to use the secondary key in scenarios like rolling key changes.
            string key = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");

            // Azure Maps Geolocation API, see for details: https://docs.microsoft.com/en-us/rest/api/maps/geolocation/get-ip-to-location
            string url = $"https://atlas.microsoft.com/geolocation/ip/json?subscription-key={key}&api-version=1.0&ip={ip}";
            using var response = await httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return new BadRequestObjectResult("An error occurred. It was not possible to get the location of this IP address.");

            // {"countryRegion":{"isoCode":"US"},"ipAddress":"2001:4898:80e8:b::189"}
            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<Geolocation>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            RegionInfo region = new(data.CountryRegion.IsoCode);
            var json = JsonSerializer.Serialize(region);

            return new OkObjectResult(json);
        }
    }
}
