using Microsoft.Azure.Services.AppAuthentication;
using System.Threading.Tasks;
using System.Web;

namespace AzureMapsCodeSamples.Common
{
    public class TokenService : HttpTaskAsyncHandler
    {
        /// <summary>
        /// This token provider simplifies access tokens for Azure Resources. It uses the Managed Identity of the deployed resource.
        /// For instance if this application was deployed to Azure App Service or Azure Virtual Machine, you can assign an Azure AD
        /// identity and this library will use that identity when deployed to production.
        /// </summary>
        /// <remarks>
        /// For the Web SDK to authorize correctly, you still must assign Azure role based access control for the managed identity
        /// as explained in the readme.md. There is significant benefit which is outlined in the the readme of the Azure-Maps-AzureAD-Samples project: https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples.
        /// This sample makes use of the client grant method.
        /// </remarks>
        private static readonly AzureServiceTokenProvider tokenProvider = new AzureServiceTokenProvider();

        public override async Task ProcessRequestAsync(HttpContext context)
        {
             //Ensure the request for a token is coming from this sample site or the Azure Maps codepen samples.
             if (context.Request.UrlReferrer != null &&
                 (context.Request.UrlReferrer.AbsoluteUri.StartsWith("https://azuremapscodesamples.azurewebsites.net/") ||
                 context.Request.UrlReferrer.AbsoluteUri.StartsWith("https://cdpn.io") ||
                 context.Request.UrlReferrer.AbsoluteUri.StartsWith("https://codepen.io")))
             {
                 context.Response.ContentType = "text/plain";
                try
                {
                    // tokenProvider will cache the token in memory, if you would like to reduce the dependency on Azure AD we recommend
                    // implementing a distributed cache combined with using the other methods available on tokenProvider.
                    string accessToken = await tokenProvider.GetAccessTokenAsync("https://atlas.microsoft.com/");
                    context.Response.Write(accessToken);
                } 
                catch
                {
                    context.Response.StatusCode = 401;
                }
             } 
             else
             {
                 context.Response.StatusCode = 401;
             }
        }
    }
}