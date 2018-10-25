using System.Collections.Generic;
using System.Text;

namespace SampleListBuilder
{
    public class ExternalSampleCategory
    {
        public string Title { get; set; }

        public List<ExternalSample> Samples { get; set; }

        public string ToHtml()
        {
            return null;
        }
    }
}
