namespace SampleListBuilder
{
    public class SampleInfo
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public string Path { get; set; }

        public string SourcePath { get; set; }

        public string Screenshot { get; set; }

        public string Keywords { get; set; }

        public string Created { get; set; }

        public string ToHtml()
        {
            return string.Format("\t\t\t\t\t<div class=\"col-md-4\" rel=\"{0}\"><div class=\"card mb-4 shadow-sm\"><div class=\"card-img-top\"><img class=\"lozad\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-src=\"SiteResources/screenshots/{2}\" alt=\"{0}\"></div><div class=\"card-body\"><h3>{0}</h3><p class=\"card-text\">{1}</p><div class=\"d-flex justify-content-between align-items-center\"><div class=\"btn-group\"><button type=\"button\" onclick=\"openSample('{0}')\" aria-label=\"Run {0} sample\" class=\"btn btn-sm btn-outline-secondary\">Run Sample</button><a target=\"_blank\" href=\"/{3}\" aria-label=\"Open {0} sample in new tab\" class=\"btn btn-sm btn-outline-secondary\">Open In New Tab</a><a target=\"_blank\" href=\"https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/{4}\" aria-label=\"Go to source code for {0} sample\" class=\"btn btn-sm btn-outline-secondary\">Source Code</a></div></div></div></div></div>\n",
                Title,
                Description,
                (string.IsNullOrWhiteSpace(Screenshot)) ? "MapsSampleIcon.png" : Screenshot,
                Path,
                SourcePath);
        }

        public string ToJson()
        {
            return string.Format("\n\t\t{{\n\t\t\ttitle:'{0}',\n\t\t\tdesc:'{1}',\n\t\t\tpath:'{2}',\n\t\t\tsourcePath:'{3}',\n\t\t\tscreenshot:'{4}',\n\t\t\tkeywords:'{5}',\n\t\t\tcreated:'{6}'\n\t\t}},",
                Title.Replace("'", "\\'"),
                (Description != null) ? Description.Replace("'", "\\'"): "",
                Path,
                SourcePath,
                Screenshot,
                Keywords,
                Created);
        }
    }
}
