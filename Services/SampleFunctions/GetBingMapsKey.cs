using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace SampleFunctions;

public class GetBingMapsKey()
{
    private static readonly string[] AllowedDomains = [
        "https://samples.bingmapsportal.com/",
        "http://localhost:58035/" // For local testing
    ];

    [Function("GetBingMapsKey")]
    public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            // Bing Maps for Enterprise is now Azure Maps, get your key from https://azuremaps.com/
            var key = Environment.GetEnvironmentVariable("BING_MAPS_SUBSCRIPTION_KEY");

            return new OkObjectResult(key);
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}