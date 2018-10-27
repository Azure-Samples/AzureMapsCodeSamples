using System.Collections.Generic;
using System.Text;

namespace SampleListBuilder
{
    public class SampleCategory
    {
        public SampleCategory()
        {
            Samples = new List<SampleInfo>();
        }

        public string Title { get; set; }

        public List<SampleInfo> Samples { get; set; }

        public string ToListItem()
        {
            return string.Format("\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#{1}\">{0}</a>\n",
                Title,
                Title.Replace(" ", "-")
                );
        }

        public string ToHtml()
        {
            var sb = new StringBuilder();

            foreach (var s in Samples)
            {
                sb.Append(s.ToHtml());
            }

            return ToHtml(sb.ToString());
        }

        public string ToHtml(string body)
        {
            var sb = new StringBuilder();

            sb.AppendFormat("\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-md-12\"><a name=\"{2}\"></a><h2>{0} <span class=\"sampleCount\">({3})</span></h2><p>{1}</p></div>\n",
                Title,
                SampleListHelper.GetDescription(Title),
                Title.Replace(" ", "-"),
                Samples.Count);

            sb.Append(body);

            sb.Append("\t\t\t\t</div>\n");

            return sb.ToString();
        }

        public string ToJson()
        {
            var sb = new StringBuilder();

            sb.AppendFormat("{{\n\tcategory:'{0}',\n\tdesc:'{1}',\n\tsamples: [", Title, SampleListHelper.GetDescription(Title));

            foreach (var s in Samples)
            {
                sb.Append(s.ToJson());
            }

            sb.Append("\n\t]\n},\n");

            return sb.ToString();
        }
    }
}
