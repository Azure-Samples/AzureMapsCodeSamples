using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SampleFunctions;

public class GetBingMapsKey(ILogger<GetBingMapsKey> logger)
{
    private readonly ILogger<GetBingMapsKey> _logger = logger;

    [Function("GetBingMapsKey")]
    public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Get your Bing Maps key from https://www.bingmapsportal.com/
        var bingMapsKey = Environment.GetEnvironmentVariable("BING_MAPS_SUBSCRIPTION_KEY");

        // Create a new response
        return new OkObjectResult(bingMapsKey);
    }
}