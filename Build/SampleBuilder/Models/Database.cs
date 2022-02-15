using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SampleBuilder.Models
{
    public class Database
    {
        public Database(string name)
        {
            Name = name;
            Categories = new List<Category>();
        }

        public string Name { get; set; }

        public List<Category> Categories { get; set; }

        public string GitHub { get; set; }

        public int NumberOfSamples
        {
            get
            {
                int numberOfSamples = 0;

                foreach (var category in Categories)
                    numberOfSamples += category.NumberOfSamples;

                return numberOfSamples;
            }
        }
    }
}
