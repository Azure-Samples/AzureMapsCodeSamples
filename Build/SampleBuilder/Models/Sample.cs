using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SampleBuilder.Models
{
    public class Sample
    {
        public string Id
        {
            get { return Title.ToLower().Replace(" ", "-"); }
        }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Path { get; set; }

        public string Source { get; set; }

        public string Screenshot { get; set; }

        public string Keywords { get; set; }

        public string Author { get; set; }

        public string Version { get; set; }

        public DateTime LastChangeDate { get; set; }
    }
}
