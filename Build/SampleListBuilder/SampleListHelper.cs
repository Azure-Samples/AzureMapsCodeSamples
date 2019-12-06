using System.Collections.Generic;

namespace SampleListBuilder
{
    public static class SampleListHelper
    {
        public static bool ScanFolder(string name)
        {
            return (!FoldersToIgnore.Contains(name) && !name.Contains("- Private"));
        }

        public static string GetDescription(string name)
        {
            if (CategoryFolders.ContainsKey(name) && !string.IsNullOrWhiteSpace(CategoryFolders[name]))
            {
                return CategoryFolders[name].Replace("'", "\\'");
            }

            return string.Empty;
        }

        public static List<string> ScreenshotsToIgnore = new List<string>()
        {
            "Lazy Load the Map",
            "Get Users Timezone with Prompt",
            "Continuous User Position Tracking",
            "Show a Users Position"
        };

        private static List<string> FoldersToIgnore = new List<string>() { "Experimental", "Common", "SiteResources", "bin", "obj", "Properties" };

        private static Dictionary<string, string> CategoryFolders = new Dictionary<string, string>()
        {
            { "Animations", "Learn how to animate data on the map." },
            { "Bubble Layer", "These samples demonstrate different ways to implement the bubble layer to render point based data." },
            { "Controls", "Add UI controls to the map to create an enhanced user experience." },
            { "Custom Modules", "Use custom modules to extend the functionality of the Azure Maps Web Control." },
            { "Demos", "These samples demonstrate real-life scenarios or highlight key topics." },
            { "Device Sensors", "See how to access sensors from a devices browser and use them with Azure Maps." },
            { "Drawing Tools Module", "Add mouse and touch based drawing capabilities to the map." },
            { "Geospatial Files", "Examples of how to import and export common geospatial file formats with Azure Maps." },
            { "Heat Map Layer", "Heat maps are a type of data visualization used to represent the density of data using a range of colors. They're often used to show the data \"hot spots\" on a map and are a great way to render large point data sets." },
            { "HTML Markers", "Use traditional HTML and CSS to represent point based data on the map as markers." },
            { "Image Layer", "See how to overlay images on the map as a layer." },
            { "Layers", "Learn how to visualize data using the different types of rendering layers." },
            { "Line Layer", "Learn how to visualize line and path data on the map using the line layer." },
            { "Map", "These samples show how to use the many different features of the map." },
            { "Polygon and Polygon Extrusion Layers", "Learn how to overlay geospatially accurate circles, polygons, and multi-polygons on the map using the polygon and polygon extrusion layers." },
            { "Popups", "See how to display information in a popup on the map." },
            { "REST Services", "Learn how to directly access the Azure Maps REST services from JavaScript." },
            { "Services Module", "Take advantage of the Services module to simplify integration of the REST services with the Azure Maps Web Control." },
            { "Spatial Math", "Learn how to use the spatial math library that is built into the Azure Maps Web Control." },
            { "Symbol Layer", "Render lots of styled points on the map in a Symbol layer with good performance. If working with smaller data sets use HTML based markers and take advantage of CSS for styling." },
            { "Third Party Map Controls", "As good as the Azure Maps Web Control is, there are many 3rd party map controls in which you can import Azure Maps data into which is a great option if you have an existing app built on one of these." },
            { "Tile Layers", "Overlay raster tile layers on top the map using the same tiling system used by the base maps." },
            { "Traffic", "Overlay real-time traffic data on the map." },
            { "Tutorials", "These are the finished code samples for the tutorials in the Azure Maps documentation. You can find the full tutorial walkthroughs <a href=\"https://docs.microsoft.com/azure/azure-maps/\" target=\"_blank\">here</a>." }
        };

        public static List<ExternalSampleCategory> ExternalSamples = new List<ExternalSampleCategory>()
        {
            new ExternalSampleCategory()
            {
                Title = "Angular",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Angular Azure Maps",
                        Href = "https://github.com/Acaisoft/angular-azure-maps"
                    },
                    new ExternalSample()
                    {
                        Title = "Angular Azure Map Wrapper",
                        Href = "https://github.com/srednicki95/am_samples"
                    }
                }
            },
            new ExternalSampleCategory()
            {
                Title = "Internet of Things (IoT)",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Implement IoT spatial analytics using Azure Maps",
                        Href = "https://github.com/Azure-Samples/iothub-to-azure-maps-geofencing"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps + Time Series Insights + IoT Hub Hands On Lab",
                        Href = "https://github.com/rangv/MarchWorkshop/tree/master/AzureMaps"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure IoT Real-time asset tracking workshop",
                        Href = "http://aka.ms/iot-workshop/asset-tracking"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps .NET UWP IoT Remote Control",
                        Href = "https://github.com/Azure-Samples/azure-maps-dotnet-webgl-uwp-iot-remote-control"
                    },
                    new ExternalSample()
                    {
                        Title = "AirMap Azure Maps plugin",
                        Href = "https://github.com/airmap/js-azure-maps-plugin"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps Bus Demo",
                        Href = "https://github.com/DibranMulder/Azure-Maps-Bus-Demo"
                    },
                 }
            },
            new ExternalSampleCategory()
            {
                Title = "PowerApps",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Azure Maps PowerApps PCF Search component",
                        Href = "https://github.com/mkcgphy/Azure-Maps-Get-Search-Address-TypeAhead"
                    },
                    new ExternalSample()
                    {
                        Title = "A PowerApps PCF control that displays a dataset as pins on Azure Map",
                        Href = "https://github.com/Azure-Samples/azure-maps-dotnet-webgl-uwp-iot-remote-control"
                    }
                 }
            },
            new ExternalSampleCategory()
            {
                Title = "Python",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Azure Maps Jupyter Notebook samples",
                        Href = "https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps for Retail, Jupyter Notebooks",
                        Href = "https://github.com/5h15h/Azure-Maps-Jupyter-Notebooks",
                    },                    
                     new ExternalSample()
                    {
                        Title = "Azure Maps Python Sample",
                        Href = "https://github.com/eavanvalkenburg/azuremaps-python-sample"
                    },
                }
            },
            new ExternalSampleCategory()
            {
                Title = "Vue.js",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Vue Azure Maps - Integrate Azure Maps in your Vue application.",
                        Href = "https://github.com/rickyruiz/vue-azure-maps"
                    }
                }
            },
            new ExternalSampleCategory()
            {
                Title = "Xamarin",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Using Azure Maps with a Xamarin Forms app",
                        Href = "http://patrickgoode.com/using-azure-maps-with-a-xamarin-forms-app",
                    }
                }
            },
            new ExternalSampleCategory()
            {
                Title = "Other",
                Samples = new List<ExternalSample>()
                {
                    new ExternalSample()
                    {
                        Title = "Azure Maps & Azure Active Directory Samples",
                        Href = "https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples"
                    },
                    new ExternalSample()
                    {
                        Title = "Real-time flight map with Azure functions, CosmosDB and SignalR",
                        Href = "https://github.com/davetheunissen/Global-Azure-Bootcamp-2019-Workshop"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps .NET REST Client",
                        Href = "https://github.com/perfahlen/AzureMapsRestServices"
                    },
                    new ExternalSample()
                    {
                        Title = "A-Maps - A QGIS plugin for the Azure Maps REST services.",
                        Href = "https://github.com/riccardoklinger/amaps"
                    },
                    new ExternalSample()
                    {
                        Title = "Flutter_map - Use Azure Maps with the flutter UI toolkit.",
                        Href = "https://github.com/johnpryan/flutter_map"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Web Services - A collection of clients for Azure & Microsoft Web Services - Azure Cognitive Services, Azure Maps",
                        Href = "https://github.com/cjoakim/azure-web-services"
                    },
                    new ExternalSample()
                    {
                        Title = "Azure Maps GeoJSON Admin Portal",
                        Href = "https://github.com/richorama/azure-maps-admin-portal"
                    }
                }
            }
        };
    }
}
