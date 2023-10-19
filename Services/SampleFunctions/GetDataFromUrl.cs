using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace SampleFunctions
{
    public static class GetDataFromUrl
    {
        private static readonly HttpClient _HttpClient = new();
        private static readonly string[] _HeadersToSkip =
        {
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

        [Function("GetDataFromUrl")]
        public static async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);

            // Get the URL from the query string
            var url = Uri.UnescapeDataString(req.Query["url"]);
            if (string.IsNullOrEmpty(url))
            {
                badRequest.WriteString("Please pass a valid URL address on the query string.");
                return badRequest;
            }

            // Download the content from the URL
            var result = await _HttpClient.GetAsync(url);
            if (!result.IsSuccessStatusCode)
            {
                badRequest.WriteString("The URL you specified was unable to download.");
                return badRequest;
            }

            // Create a new response
            var response = req.CreateResponse(HttpStatusCode.OK);

            // Copy the headers from the result to the response, except for the ones we want to skip
            foreach (var header in result.Content.Headers)
            {
                if (!_HeadersToSkip.Contains(header.Key))
                {
                    foreach (var value in header.Value)
                    {
                        response.Headers.Add(header.Key, value);
                    }
                }
            }

            // Add the CORS header to the response
            response.Headers.Add("Access-Control-Allow-Origin", "*");

            // Copy the content from the result to the response
            byte[] bytes = await result.Content.ReadAsByteArrayAsync();
            response.Headers.Add("Content-Type", result.Content.Headers.ContentType.MediaType);
            response.WriteBytes(bytes);

            return response;
        }
    }
}