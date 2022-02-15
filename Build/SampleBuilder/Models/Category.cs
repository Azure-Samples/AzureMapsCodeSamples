using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SampleBuilder.Models
{
    public class Category
    {
        public Category()
        {
            Samples = new List<Sample>();
        }

        public string Id
        {
            get { return Title.ToLower().Replace(" ", "-"); }
        }

        public string Title { get; set; }

        public string Description { get; set; }

        public List<Sample> Samples { get; set; }

        public int NumberOfSamples
        {
            get { return Samples.Count; }
        }
    }
}
