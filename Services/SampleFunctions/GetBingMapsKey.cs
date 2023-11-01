using System;
using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace SampleFunctions;

public class GetBingMapsKey
{
    [Function("GetBingMapsKey")]
    public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
    {
        // Get your Bing Maps key from https://www.bingmapsportal.com/
        var bingMapsKey = Environment.GetEnvironmentVariable("BING_MAPS_SUBSCRIPTION_KEY");

        // Create a new response
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
        response.WriteString(bingMapsKey);

        return response;
    }
}