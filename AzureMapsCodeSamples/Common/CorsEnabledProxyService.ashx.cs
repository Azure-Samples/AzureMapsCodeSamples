using System;
using System.Linq;
using System.Net;
using System.Web;

namespace AzureMapsCodeSamples.Common
{
    /// <summary>
    /// A simple proxy service that retrieves files from other domains and enables CORs on them. 
    /// </summary>
    public class CorsEnabledProxyService : IHttpHandler
    {
        //A list of request headers to not copy over from the requested file.
        private static string[] _headersToSkip = new string[] {
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

        public void ProcessRequest(HttpContext context)
        {
            string url = context.Request.QueryString["url"];

            //Only process URL's that are whitelisted.
            bool processUrl = IsUrlAllowed(url);

            //Only allow requests that originated on local host or the code sample site.
            if (!(context.Request.IsLocal || 
                context.Request.UrlReferrer == null || 
                context.Request.UrlReferrer.AbsoluteUri.StartsWith("https://azuremapscodesamples.azurewebsites.net/") ||
                context.Request.UrlReferrer.AbsoluteUri.StartsWith("https://azuremapscodesamples.azurewebsites.us/")))
            {
                processUrl = false;
            }

            if (processUrl)
            {
                //Add CORs allowed origin.
                context.Response.AppendHeader("Access-Control-Allow-Origin", "*");

                //Generate response
                var request = (HttpWebRequest)HttpWebRequest.Create(url);
                try
                {
                    //Pass on request headers that may have been added.
                    if (context.Request.Headers != null)
                    {
                        foreach (var k in context.Request.Headers.AllKeys)
                        {
                            if (!CorsEnabledProxyService._headersToSkip.Contains(k))
                            {
                                request.Headers.Add(k, context.Request.Headers[k]);
                            }
                        }
                    }

                    var response = (HttpWebResponse)request.GetResponse();

                    var contentType = response.Headers["Content-Type"];
                    context.Response.ContentType = contentType;

                    using (var stream = response.GetResponseStream())
                    {
                        context.Response.BufferOutput = false;
                        byte[] buffer = new byte[1024];
                        int bytesRead = 0;
                        while ((bytesRead = stream.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            context.Response.OutputStream.Write(buffer, 0, bytesRead);
                        }
                    }
                }
                catch (WebException ex)
                {
                    var r = (HttpWebResponse)ex.Response;
                    context.Response.StatusCode = 500;
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = 500;
                }
            }
            else
            {
                context.Response.StatusCode = 403;
            }

            context.ApplicationInstance.CompleteRequest();
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        /// Check to see if URL is whitelisted.
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        private bool IsUrlAllowed(string url)
        {
            if (url != null)
            {
                for (int i = 0; i < UrlDomainWhitelist.Length; i++)
                {
                    if (url.StartsWith(UrlDomainWhitelist[i]))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// Whitelist of URL paths/domains that we are willing to allow the proxy service to access.
        /// </summary>
        private static string[] UrlDomainWhitelist = new string[] {
            #if DEBUG
            "http://localhost:50921/Common/data",
            "http://localhost:50921/Common/images/",
            #endif

            //Self hosted data and images.
            "https://azuremapscodesamples.azurewebsites.net/Common/data",
            "https://azuremapscodesamples.azurewebsites.us/Common/data",
            "https://azuremapscodesamples.azurewebsites.net/Common/images/",
            "https://azuremapscodesamples.azurewebsites.us/Common/images/",

            //OGC services
            "https://basemap.nationalmap.gov/arcgis/rest/services/",
            "https://carto.nationalmap.gov/arcgis/services/",
            "https://www.coast.noaa.gov/arcgis/rest/services/",
            "https://data.geus.dk/geusmap/ows/4258.jsp",
            "https://data.gns.cri.nz/webmaps/",
            "https://gis.dnr.alaska.gov/terrapixel/",
            "https://gis1.dnr.alaska.gov/terrapixel/",
            "https://gis2.dnr.alaska.gov/terrapixel/",
            "https://gis3.dnr.alaska.gov/terrapixel/",
            "https://gis4.dnr.alaska.gov/terrapixel/",
            "https://gispub4.epa.gov/arcgis/services/",
            "https://giswebservices.massgis.state.ma.us/geoserver/",
            "https://hydro.nationalmap.gov/arcgis/services/",
            "https://idpgis.ncep.noaa.gov/arcgis/services/",
            "https://index.nationalmap.gov/arcgis/services/",
            "https://maps.google.com/mapfiles/",
            "https://maps.gstatic.com/mapfiles/",
            "https://maps.iowa-city.org/sslarcgis/rest/services/",
            "https://maps.wien.gv.at/basemap/",
            "https://mrdata.usgs.gov/mapcache/wmts/",
            "https://mrdata.usgs.gov/services/",
            "https://mrdata.usgs.gov/wfs/",
            "https://nowcoast.noaa.gov/arcgis/services/",
            "https://openapi.aurin.org.au//public/wfs",
            "https://openmaps.gov.bc.ca/geo/pub/",
            "https://sedac.ciesin.columbia.edu/geoserver/",
            "https://services.nationalmap.gov/arcgis/services/",
            "https://smallscale.nationalmap.gov/arcgis/services/",
            "https://tigerweb.geo.census.gov/arcgis/services/",
            "https://tpwd.texas.gov/arcgis/rest/services/",
            "https://wmts1.geoportail.lu/opendata/service/",
            "https://www.basemap.at/wmts",
            "https://www.fws.gov/wetlands/arcgis/services/",
            "https://www.nhc.noaa.gov/",
            "https://hazards.fema.gov",
            
            //KML resources
            "https://virtualglobetrotting.com/thumbll/",
            "https://fwspublicservices.wim.usgs.gov/server/services/",
            "https://earthquake.usgs.gov/earthquakes/feed/",
            "https://www.brianabbott.net/media/kml/NYC-Transit.kmz",
            "http://brianabbott.net/media/images/",
            "https://brianabbott.net/media/images/"
        };
    }
}