using System;
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace GeolocationSampleAPI
{
    public static class GeolocationSampleAPI
    {
        //Authentication required to consume the Azure Maps Geolocation API.
        static readonly string mapsSubscriptionKey = Environment.GetEnvironmentVariable("AzureMapsKey");    

        [Function("GeolocationSampleAPI")]
        public static async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req, FunctionContext executionContext)
        {
            //Get IP address from the HTTP Request to the Azure Function.
            var ip = System.Web.HttpUtility.ParseQueryString(req.Url.Query)["ip"];
            //If the IP is null a bad request will be sent as a response.
            if (ip == null)
            {
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                badResponse.WriteString("Please pass a valid IP address on the query string.");
                return badResponse;
            }
            else
            { 
                using (var client = new HttpClient())
                {
                    //Request to the Azure Maps Geolocation API.
                    var url = "https://atlas.microsoft.com/geolocation/ip/json?" + "&" + "subscription-key=" + mapsSubscriptionKey + "&" + "api-version=" + "1.0" + "&" + "ip=" + ip;
                    HttpResponseMessage request = await client.GetAsync(url);
                    // Verification of the response from the Azure Maps Geolocation service.  
                    if (request.IsSuccessStatusCode)
                    {
                        var content = JObject.Parse(request.Content.ReadAsStringAsync().Result);
                        //Get the ISO Code of the country from the IP Address.
                        var country = (string)content["countryRegion"]["isoCode"];
                        //Provide as a response the Region Info from the Globalization class in .NET
                        RegionInfo region = new RegionInfo(country);
                        var response = req.CreateResponse(HttpStatusCode.OK);
                        response.WriteString(JsonConvert.SerializeObject(region, Formatting.Indented));
                        return response;
                    }
                    else
                    {
                        //If the response from the Azure Maps Geolocation service failed a bad request will be send as a response.
                        var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                        badResponse.WriteString("An error occurred. It was not possible to get the location of this IP address.");
                        return badResponse;
                    }
                }
            }
        }
    }
}