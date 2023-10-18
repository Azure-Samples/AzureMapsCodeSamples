using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace SampleFunctions
{
    public static class GetDataFromUrl
    {
        private static readonly HttpClient HttpClient = new();
        private static readonly string[] HeadersToSkip =
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

            string url = Uri.UnescapeDataString(req.Query["url"]);
            if (string.IsNullOrEmpty(url))
            {
                badRequest.WriteString("Please pass a valid URL address on the query string.");
                return badRequest;
            }


            var result = await HttpClient.GetAsync(url);

            if (!result.IsSuccessStatusCode)
            {
                badRequest.WriteString("The URL you specified was unable to download.");
                return badRequest;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);

            foreach (var header in result.Content.Headers)
            {
                if (!HeadersToSkip.Contains(header.Key))
                {
                    foreach (var value in header.Value)
                    {
                        response.Headers.Add(header.Key, value);
                    }
                }
            }

            response.Headers.Add("Access-Control-Allow-Origin", "*");

            byte[] bytes = await result.Content.ReadAsByteArrayAsync();
            response.Headers.Add("Content-Type", result.Content.Headers.ContentType.MediaType);
            response.WriteBytes(bytes);

            return response;
        }
    }
}