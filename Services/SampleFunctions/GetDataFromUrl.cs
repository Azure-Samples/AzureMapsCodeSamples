using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Web;
using System.Linq;
using System.IO;

namespace SampleFunctions
{
    // This is a very simple proxy for the sample site, do not use in production
    // Please use YARP, see https://microsoft.github.io/reverse-proxy/
    public static class GetDataFromUrl
    {
        private static readonly HttpClient httpClient = new();

        private static readonly string[] allowed = { "https://samples.azuremaps.com/",
                                                     "http://localhost" };

        private static readonly string[] headersToSkip = new string[] {
            "Cache-Control",
            "Connection",
            "Accept",
            "Accept-Encoding",
            "Host",
            "Referer",
            "User-Agent",
            "Sec-Fetch-Mode",
            "Sec-Fetch-Site"
        };

        [FunctionName("GetDataFromUrl")]
        public static async Task Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            string url = HttpUtility.UrlDecode(req.Query["url"]);
            if (string.IsNullOrEmpty(url))
            {
                req.HttpContext.Response.StatusCode = 400;
                return;
            }

            using var response = await httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                req.HttpContext.Response.StatusCode = 400;
                return;
            }

            // Pass on request headers that may have been added
            foreach (var header in response.Content.Headers)
            {
                if (!headersToSkip.Contains(header.Key))
                {
                    foreach (var value in header.Value)
                    {
                        req.HttpContext.Response.Headers.Add(header.Key, value);
                    }
                }
            }

            var bytes = await response.Content.ReadAsByteArrayAsync();

            req.HttpContext.Response.StatusCode = 200;
            req.HttpContext.Response.ContentLength = bytes.Length;
            req.HttpContext.Response.ContentType = response.Content.Headers.ContentType.MediaType;

            await req.HttpContext.Response.Body.WriteAsync(bytes, 0, bytes.Length);
        }
    }
}