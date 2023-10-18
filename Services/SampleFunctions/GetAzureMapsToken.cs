using System.Net;
using Azure.Core;
using Azure.Identity;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace SampleFunctions
{
    public class GetAzureMapsToken
    {
        /// <summary>
        /// This token provider simplifies access tokens for Azure Resources. It uses the Managed Identity of the deployed resource.
        /// For instance if this application was deployed to Azure App Service or Azure Virtual Machine, you can assign an Azure AD
        /// identity and this library will use that identity when deployed to production.
        /// </summary>
        /// <remarks>
        /// This tokenProvider will cache the token in memory, if you would like to reduce the dependency on Azure AD we recommend
        /// implementing a distributed cache combined with using the other methods available on tokenProvider.
        /// </remarks>
        private readonly DefaultAzureCredential TokenProvider = new();

        private readonly string[] Scopes =
        {
            "https://atlas.microsoft.com/.default"
        };

        [Function("GetAzureMapsToken")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            // Managed identities for Azure resources and Azure Maps
            // For the Web SDK to authorize correctly, you still must assign Azure role based access control for the managed identity
            // https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-authentication
            AccessToken accessToken = await TokenProvider.GetTokenAsync(new TokenRequestContext(Scopes));

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString(accessToken.Token);

            return response;
        }
    }
}