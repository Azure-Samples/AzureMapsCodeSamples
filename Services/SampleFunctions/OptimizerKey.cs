using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace SampleFunctions;

public class OptimizerKey
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "http://localhost:58035/" // For local testing
    ];

    [Function("OptimizerKey")]
    public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValue("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            // Get your NVIDIA cuOpt key from https://developer.nvidia.com/
            var key = Environment.GetEnvironmentVariable("NVIDIA_SUBSCRIPTION_KEY");

            return new OkObjectResult(key);
        }

        // Retrun access denied if the referer domain is not allowed
        return new StatusCodeResult(StatusCodes.Status403Forbidden);
    }
}