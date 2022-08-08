using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Web;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Web.Http;

namespace SampleFunctions
{
    // This is a very simple proxy for the sample site, do not use in production
    // Please use YARP, see https://microsoft.github.io/reverse-proxy/
    public static class GetDataFromUrl
    {
        private static readonly HttpClient httpClient = new();

        //private static readonly string[] allowed = { "https://samples.azuremaps.com/",
        //                                             "http://localhost" };

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
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req)
        {
            try
            {
                //string referer = req.Headers["Referer"];
                //if (string.IsNullOrEmpty(referer))
                //    return new UnauthorizedResult();

                //string result = Array.Find(allowed, site => referer.StartsWith(site, StringComparison.OrdinalIgnoreCase));
                //if (string.IsNullOrEmpty(result))
                //    return new UnauthorizedResult();

                string url = HttpUtility.UrlDecode(req.Query["url"]);
                if (string.IsNullOrEmpty(url))
                    return new BadRequestObjectResult("Please pass a valid url address on the query string.");

                using var response = await httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return new NotFoundObjectResult("The url your specified was unable to download.");

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

                req.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");

                // read the remote file
                var bytes = await response.Content.ReadAsByteArrayAsync();

                req.HttpContext.Response.ContentLength = bytes.Length;
                req.HttpContext.Response.ContentType = response.Content.Headers.ContentType.MediaType;

                // write the remote file back to the requster
                await req.HttpContext.Response.Body.WriteAsync(bytes, 0, bytes.Length);

                return new OkResult();
            }
            catch (Exception ex)
            {
                return new StatusCodeObjectResult(HttpStatusCode.InternalServerError, ex);
            }

        }

        public class StatusCodeObjectResult : ObjectResult
        {
            public StatusCodeObjectResult(HttpStatusCode httpStatusCode, object value = null)
                : base(value)
            {
                base.StatusCode = (int)httpStatusCode;
            }
        }
    }
}