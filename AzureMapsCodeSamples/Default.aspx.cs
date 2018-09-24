using System;

namespace AzureMapsCodeSamples
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Redirect("index.html", false);
        }
    }
}