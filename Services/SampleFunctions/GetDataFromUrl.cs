using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using System.Web;

namespace SampleFunctions
{
    public static class GetDataFromUrl
    {
        private static readonly string[] allowed = { "https://samples.azuremaps.com/",
                                                     "http://localhost"};

        private static readonly HttpClient httpClient = new();

        [FunctionName("GetDataFromUrl")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string referer = req.Headers["Referer"];
            if (string.IsNullOrEmpty(referer))
                return new UnauthorizedResult();

            string result = Array.Find(allowed, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
            if (string.IsNullOrEmpty(result))
                return new UnauthorizedResult();

            string url = req.Query["url"];
            if (string.IsNullOrEmpty(url))
                return new BadRequestObjectResult("Please pass a valid URL on the query string.");

            using var response = await httpClient.GetAsync(HttpUtility.UrlDecode(url));

            if (!response.IsSuccessStatusCode)
                return new BadRequestObjectResult("An error occurred. It was not possible to get the data of this URL.");

            var content = await response.Content.ReadAsStringAsync();

            return new OkObjectResult(content);
        }
    }
}
