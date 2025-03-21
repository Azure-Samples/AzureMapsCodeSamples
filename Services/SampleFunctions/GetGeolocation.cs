using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using SampleFunctions.Models;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace SampleFunctions;

public static class GeolocationService
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "http://localhost:58035/" // For local testing
    ];

    private static readonly HttpClient HttpClient = new();

    [Function("GetGeolocation")]
    public static async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            string ip = req.Query["ip"];
            if (string.IsNullOrWhiteSpace(ip))
            {
                return new BadRequestObjectResult("Please pass a valid IP address on the query string.");
            }

            string azureMapsKey = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");
            if (string.IsNullOrWhiteSpace(azureMapsKey))
            {
                return new BadRequestObjectResult("Azure Maps Subscription Key is missing.");
            }

            string url = $"https://atlas.microsoft.com/geolocation/ip/json?subscription-key={azureMapsKey}&api-version=1.0&ip={ip}";
            Geolocation result = await GetGeolocationFromAzureMaps(url);

            if (result?.CountryRegion?.IsoCode == null)
            {
                return new BadRequestObjectResult("An error occurred. It was not possible to get the location of this IP address.");
            }

            RegionInfo region = new(result.CountryRegion.IsoCode);
            string json = JsonSerializer.Serialize(region);

            return new OkObjectResult(json);
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }

    private static async Task<Geolocation> GetGeolocationFromAzureMaps(string url)
    {
        try
        {
            return await HttpClient.GetFromJsonAsync<Geolocation>(url);
        }
        catch
        {
            return null;
        }
    }
}