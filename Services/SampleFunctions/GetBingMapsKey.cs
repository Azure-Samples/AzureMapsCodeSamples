using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace SampleFunctions
{
    public static class GetBingMapsKey
    {
        private static readonly string[] allowd = { "https://samples.bingmapsportal.com/",
                                                    "http://localhost"};

        [FunctionName("GetBingMapsKey")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowd, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            // Get your Bing Maps key from https://www.bingmapsportal.com/
            string key = Environment.GetEnvironmentVariable("BING_MAPS_SUBSCRIPTION_KEY");

            return new OkObjectResult(key);
        }
    }
}
