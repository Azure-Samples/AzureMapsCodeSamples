using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SampleFunctions.Models;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace SampleFunctions;

public class GetGeolocation(ILogger<GetGeolocation> logger)
{
    private readonly ILogger<GetGeolocation> _logger = logger;

    private static readonly HttpClient _HttpClient = new();

    [Function("GetGeolocation")]
    public static async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Get the IP address from the query string
        var ip = req.Query["ip"];
        if (string.IsNullOrEmpty(ip))
        {
            return new BadRequestObjectResult("Please pass a valid IP address on the query string.");
        }

        // Get the Azure Maps key from the environment variables
        var azureMapsKey = Environment.GetEnvironmentVariable("AZURE_MAPS_SUBSCRIPTION_KEY");
        var url = $"https://atlas.microsoft.com/geolocation/ip/json?subscription-key={azureMapsKey}&api-version=1.0&ip={ip}";

        // Get the geolocation from Azure Maps
        var result = await _HttpClient.GetFromJsonAsync<Geolocation>(url);
        if (result == null)
        {
            return new BadRequestObjectResult("An error occurred. It was not possible to get the location of this IP address.");
        }

        // Get the region from the geolocation
        var region = new RegionInfo(result.CountryRegion.IsoCode);
        var json = JsonSerializer.Serialize(region);

        return new OkObjectResult(json);
    }
}