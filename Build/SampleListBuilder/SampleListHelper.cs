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
            { "Controls", "Add UI controls to the map to create an enhanced user experience." },
            { "Custom Modules", "Use custom modules to extend the functionality of the Azure Maps Web Control." },
            { "Demos", "These samples demonstrate real-life scenarios or highlight key topics." },
            { "Device Sensors", "See how to access sensors from a devices browser and use them with Azure Maps." },
            { "Geospatial Files", "Examples of how to import and export common geospatial file formats with Azure Maps." },
            { "Layers", "Learn how to visualize data using the different types of rendering layers." },
            { "Map", "These samples show how to use the many different features of the map." },
            { "Shapes", "Gain insights into working with various shapes such as geospatially accurate circles, polygons, linestrings, and multi-geometries." },
            { "Popups", "See how to display information in a popup on the map." },
            { "REST Services", "Learn how to directly access the Azure Maps REST services from JavaScript." },
            { "Services Module", "Take advantage of the Services module to simplify integration of the REST services with the Azure Maps Web Control." },
            { "Spatial Math", "Learn how to use the spatial math library that is built into the Azure Maps Web Control." },
            { "Spatial Math with Turf.js", "Perform advanced spatial math operations using the open source <a href=\"http://turfjs.org/\" target=\"_blank\">Turf.js</a> library." },
            { "Symbols and Markers", "Render lots of styled points on the map in a Symbol layer with good performance. If working with smaller data sets use HTML based markers and take advantage of CSS for styling." },
            { "Third Party Map Controls", "As good as the Azure Maps Web Control is, there are many 3rd party map controls in which you can import Azure Maps data into which is a great option if you have an existing app built on one of these." },
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
                        Title = "Azure Maps .NET UWP IoT Remote Control",
                        Href = "https://github.com/Azure-Samples/azure-maps-dotnet-webgl-uwp-iot-remote-control"
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
            }            
        };
    }
}
