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
        private static readonly HttpClient HttpClient = new();

        [Function("GetGeolocation")]
        public static async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);

            string ip = req.Query["ip"];
            if (string.IsNullOrEmpty(ip))
            {
                badRequest.WriteString("Please pass a valid IP address on the query string.");
                return badRequest;
            }

            string azureMapsKey = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");
            string url = $"https://atlas.microsoft.com/geolocation/ip/json?subscription-key={azureMapsKey}&api-version=1.0&ip={ip}";

            var result = await HttpClient.GetFromJsonAsync<Geolocation>(url);
            if (result == null)
            {
                badRequest.WriteString("An error occurred. It was not possible to get the location of this IP address.");
                return badRequest;
            }

            RegionInfo region = new RegionInfo(result.CountryRegion.IsoCode);
            var json = JsonSerializer.Serialize(region);

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/json; charset=utf-8");
            response.WriteString(json);

            return response;
        }
    }
}