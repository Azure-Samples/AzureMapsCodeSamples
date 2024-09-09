using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace SampleFunctions;

public class GetDataFromUrl()
{
    private static readonly string[] AllowedDomains = [
        "https://samples.azuremaps.com/",
        "http://localhost:58035/" // For local testing
    ];

    private static readonly HttpClient _HttpClient = new();

    [Function("GetDataFromUrl")]
    public static async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
    {
        // Check if the referer header is present and if the domain is allowed
        if (req.Headers.TryGetValues("Referer", out var referer) && AllowedDomains.Any(domain => referer.ToString().StartsWith(domain)))
        {
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);

            // Get the URL from the query string
            var url = Uri.UnescapeDataString(req.Query["url"]);
            if (string.IsNullOrEmpty(url))
            {
                badRequest.WriteString("Please pass a valid URL address in the query string.");
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
            foreach (var header in result.Headers)
            {
                if (!IsHeaderToSkip(header.Key))
                {
                    response.Headers.Add(header.Key, header.Value.First());
                }
            }

            // Set the 'Content-Type' header in the response
            response.Headers.Add("Content-Type", result.Content.Headers.ContentType.MediaType);

            // Add the CORS header to the response
            response.Headers.Add("Access-Control-Allow-Origin", "*");

            // Copy the content from the result to the response
            var content = await result.Content.ReadAsByteArrayAsync();
            await response.Body.WriteAsync(content);

            return response;
        }

        // Return access denied if the referer domain is not allowed
        var forbidden = req.CreateResponse(HttpStatusCode.Forbidden);
        return forbidden;
    }

    private static bool IsHeaderToSkip(string headerName)
    {
        string[] headersToSkip =
        {
            "Content-Type",
            "Access-Control-Allow-Origin",
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

        return headersToSkip.Contains(headerName);
    }
}