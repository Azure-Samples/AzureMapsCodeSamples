using HtmlAgilityPack;
using Microsoft.Extensions.Configuration;
using SampleBuilder.Models;
using System.Reflection;
using System.Text.Json;
using X.Web.Sitemap;

namespace SampleBuilder
{
    class Program
    {
        static IConfiguration config = null;
        static readonly Database database = new("Azure Sample Builder");

        static void Main()
        {
            var version = Assembly.GetExecutingAssembly().GetName().Version;
            Print($"{database.Name} ({version.Major}.{version.Minor})", ConsoleColor.Blue);

            LoadConfiguration("appsettings.json");

            database.GitHub = config["GitHub"];

            CopyStaticFiles();
            CopySamples();

            WriteDatabase("samples.json");
            WriteSiteMap("sitemap.xml");
            WriteStartPage("index.html");

            Print($"{database.NumberOfSamples} samples ready to publish.", ConsoleColor.White);
        }

        static void LoadConfiguration(string filename)
        {
            Console.Write("Loading Configuration...");

            if (!File.Exists(filename))
                Exit($"The configuration file '{filename}' was not found.");

            config = new ConfigurationBuilder()
                .AddJsonFile(filename)
                .Build();

            if (string.IsNullOrWhiteSpace(config["SamplesFolder"]))
                Exit("SamplesFolder is required in configuarion file.");

            if (string.IsNullOrWhiteSpace(config["StaticFolder"]))
                Exit("StaticFolder is required in configuarion file.");

            if (string.IsNullOrWhiteSpace(config["PublishFolder"]))
                Exit("PublishFolder is required in configuarion file.");

            if (string.IsNullOrWhiteSpace(config["SiteUrl"]))
                Exit("SiteUrl is required in configuarion file.");

            if (string.IsNullOrWhiteSpace(config["GitHub"]))
                Exit("GitHub is required in configuarion file.");

            Print("done");
        }

        static void CopyStaticFiles()
        {
            Console.Write("Copying static files to publish folder...");

            CopyFolder(config["StaticFolder"], config["PublishFolder"]);

            Print("done");
        }

        static void CopySamples()
        {
            Console.Write("Copying samples to publish folder...");

            Category category = null;
            CopySamplesFolder(config["SamplesFolder"], config["PublishFolder"], ref category);

            Print("done");
        }

        static void WriteDatabase(string filename, bool indented = false)
        {
            Console.Write($"Writing '{filename}' to publish folder...");

            var oprions = new JsonSerializerOptions
            {
                WriteIndented = indented
            };

            string json = JsonSerializer.Serialize(database, oprions);
            File.WriteAllText($"{config["PublishFolder"]}{Path.DirectorySeparatorChar}{filename}", json);

            Print("done");
        }

        static void WriteSiteMap(string filename)
        {
            Console.Write($"Writing '{filename}' to publish folder...");

            var sitemap = new Sitemap
            {
                new Url
                {
                    ChangeFrequency = ChangeFrequency.Weekly,
                    Location = config["SiteUrl"],
                    Priority = 1.0,
                    TimeStamp = DateTime.Now
                }
            };

            foreach (var category in database.Categories)
            {
                foreach(var sample in category.Samples)
                {
                    sitemap.Add(new Url
                    {
                        ChangeFrequency = ChangeFrequency.Monthly,
                        Location = config["SiteUrl"].TrimEnd(new[] { '/' }) + sample.Path,
                        Priority = 0.5,
                        TimeStamp = sample.LastChangeDate
                    });
                }
            }

            sitemap.Save($"{config["PublishFolder"]}{Path.DirectorySeparatorChar}{filename}");

            Print("done");
        }

        static void WriteStartPage(string filename)
        {
            Console.Write($"Writing '{filename}' to publish folder...");

            string file = Path.Combine(config["PublishFolder"], filename);
            string template = File.ReadAllText(file);

            string categoryList = "";
            foreach(var category in database.Categories)
            {
                categoryList += $"<li><a class=\"dropdown-item\" href=\"#{category.Id}\">{category.Title}</a></li>";
            }

            string sampleList = "";
            foreach (var category in database.Categories)
            {
                sampleList += $"<div class=\"w-100\"><a name=\"{category.Id}\"></a><h3 class=\"fw-light\">{category.Title} <small class=\"text-muted\">({category.NumberOfSamples})</small></h3><p>{category.Description}</p></div>";

                foreach(var sample in category.Samples)
                {
                    sampleList += $"<div class=\"col\"><div class=\"card shadow-sm\"><img class=\"card-img-top\" src=\"{sample.Path}/{sample.Screenshot}\" loading=\"lazy\" alt=\"{sample.Title}\" /><div class=\"card-body\"><h5 class=\"card-title\">{sample.Title}</h5><p class=\"card-text\">{sample.Description}</p><div class=\"d-flex justify-content-between align-items-center\"><div class=\"btn-group\"><button type=\"button\" class=\"btn btn-sm btn-outline-secondary\" data-bs-toggle=\"modal\" data-bs-target=\"#sampleModal\" data-bs-id=\"{sample.Id}\" data-bs-title=\"{sample.Title}\" data-bs-path=\"{sample.Path}\" data-bs-source=\"{database.GitHub}{sample.Source}\"><small>Run Sample</small></button><a href=\"{sample.Path}\" target=\"_blank\" class=\"btn btn-sm btn-outline-secondary\" role=\"button\"><small>Open In New Tab</small></a><a href=\"{database.GitHub}{sample.Source}\" target=\"_blank\" class=\"btn btn-sm btn-outline-secondary\" role=\"button\"><small>Source Code</small></a></div></div></div></div></div>";
                }
            }

            string html = template.Replace("{numberOfSamples}", database.NumberOfSamples.ToString())
                .Replace("{sampleList}", sampleList)
                .Replace("{categoryList}", categoryList);

            File.WriteAllText(file, html);

            Print("done");
        }

        static void CopySamplesFolder(string sourceFolder, string destFolder, ref Category category)
        {
            bool isCategory = false;

            destFolder = destFolder.ToLower().Replace(" ", "-");

            if (destFolder.Contains("experimental")) return;

            if (!Directory.Exists(destFolder))
                Directory.CreateDirectory(destFolder);

            string[] files = Directory.GetFiles(sourceFolder);
            foreach (string file in files)
            {
                string name = Path.GetFileName(file);
                string extention = Path.GetExtension(file);

                if (name == "category.json")
                {
                    isCategory = true;

                    var json = File.ReadAllText(file);
                    category = JsonSerializer.Deserialize<Category>(json);

                    if (string.IsNullOrWhiteSpace(category.Title))
                        Exit($"Title is required in category file '{file}'");

                    if (string.IsNullOrWhiteSpace(category.Description))
                        Exit($"Description is required in category file '{file}'");
                }

                if (extention == ".html")
                {
                    var sample = GetSampleDetails(file);
                    sample.Path = destFolder.Replace(config["PublishFolder"].ToLower(), "").Replace("\\", "/");
                    sample.Source = Path.Combine(sourceFolder, name).Replace(config["SamplesFolder"], "").Replace("\\", "/").Replace(" ", "%20");
                    sample.LastChangeDate = File.GetLastWriteTime(file);

                    sample.Title = sample.Title.Replace(config["RemoveFromTitle"], "");

                    if (category != null)
                        category.Samples.Add(sample);

                    name = "index.html";
                }

                string dest = Path.Combine(destFolder, name);
                File.Copy(file, dest, true);

                Console.Write(".");
            }

            string[] folders = Directory.GetDirectories(sourceFolder);
            foreach (string folder in folders)
            {
                string name = Path.GetFileName(folder);
                string dest = Path.Combine(destFolder, name);
                CopySamplesFolder(folder, dest, ref category);
            }

            if (category != null && isCategory)
                database.Categories.Add(category);
        }

        static Sample GetSampleDetails(string filename)
        {
            var sample = new Sample();

            var doc = new HtmlDocument();
            doc.Load(filename);

            var title = doc.DocumentNode.SelectSingleNode("//head/title");
            if (title == null)
                Exit($"Missing title in file '{filename}'");
            else
                sample.Title = title.InnerText;

            var description = doc.DocumentNode.SelectSingleNode("//meta[@name='description']");
            if (description == null)
                Exit($"Missing description in file '{filename}'");
            else
                sample.Description = description.Attributes["content"].Value;

            var keywords = doc.DocumentNode.SelectSingleNode("//meta[@name='keywords']");
            if (keywords == null)
                Exit($"Missing keywords in file '{filename}'");
            else
                sample.Keywords = keywords.Attributes["content"].Value;

            var author = doc.DocumentNode.SelectSingleNode("//meta[@name='author']");
            if (author == null)
                Exit($"Missing author in file '{filename}'");
            else
                sample.Author = author.Attributes["content"].Value;

            var screenshot = doc.DocumentNode.SelectSingleNode("//meta[@name='screenshot']");
            if (screenshot == null)
                Exit($"Missing screenshot in file '{filename}'");
            else
                sample.Screenshot = screenshot.Attributes["content"].Value;

            return sample;
        }

        static void CopyFolder(string sourceFolder, string destFolder)
        {
            if (!Directory.Exists(destFolder))
                Directory.CreateDirectory(destFolder);

            string[] files = Directory.GetFiles(sourceFolder);
            foreach (string file in files)
            {
                string name = Path.GetFileName(file);
                string dest = Path.Combine(destFolder, name);
                File.Copy(file, dest, true);

                Console.Write(".");
            }

            string[] folders = Directory.GetDirectories(sourceFolder);
            foreach (string folder in folders)
            {
                string name = Path.GetFileName(folder);
                string dest = Path.Combine(destFolder, name);
                CopyFolder(folder, dest);
            }
        }

        static void Exit(string message)
        {
            Console.WriteLine();
            Print(message, ConsoleColor.Red);

            Environment.Exit(1);
        }

        static void Print(string message, ConsoleColor color = ConsoleColor.Green)
        {
            var temp = Console.ForegroundColor;
            Console.ForegroundColor = color;
            Console.WriteLine(message);
            Console.ForegroundColor = temp;
        }
    }
}