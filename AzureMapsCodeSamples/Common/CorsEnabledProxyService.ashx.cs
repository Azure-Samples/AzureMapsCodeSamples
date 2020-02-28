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
                context.Response.StatusCode = (int)r.StatusCode;
                context.Response.Status = r.StatusDescription;
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                context.Response.Status = "Unknown server error";
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
    }
}