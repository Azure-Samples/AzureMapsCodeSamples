using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SampleListBuilder
{
    class Program
    {
        private static int NumberOfSamples = 0;
        private static string sampleListJsonPath = "SiteResources/SampleList.js";
        private static string indexTemplatePath = "SiteResources/index_template.html";
        private static string indexPath = "index.html";
        private static string screenshotFolderDir;

        static void Main(string[] args)
        {
            NumberOfSamples = 0;

            var dir = Directory.GetCurrentDirectory();
            dir = dir.Substring(0, dir.LastIndexOf("AzureMapsCodeSamples") + 21) + "AzureMapsCodeSamples\\";

            var dirInfo = new DirectoryInfo(dir);
            var categoryDir = dirInfo.GetDirectories();

            screenshotFolderDir = dir + "SiteResources\\screenshots";
            var imageDirInfo = new DirectoryInfo(screenshotFolderDir);
            var imgFiles = imageDirInfo.GetFiles();

            var existingImgNames = new List<string>();

            foreach (var img in imgFiles)
            {
                if (string.CompareOrdinal(img.Extension, ".png") == 0 ||
                    string.CompareOrdinal(img.Extension, ".jpg") == 0 ||
                    string.CompareOrdinal(img.Extension, ".jpeg") == 0 ||
                    string.CompareOrdinal(img.Extension, ".gif") == 0)
                {
                    existingImgNames.Add(img.Name.Replace(img.Extension, ""));
                }
            }

            var categories = new List<SampleCategory>();
            var sampleNameList = new List<string>();

            foreach (var c in categoryDir)
            {
                if (SampleListHelper.ScanFolder(c.Name))
                {
                    var cat = new SampleCategory()
                    {
                        Title = c.Name
                    };

                    AddSamples(c, null, cat, sampleNameList, existingImgNames, imgFiles);

                    if (cat.Samples.Count > 0)
                    {
                        categories.Add(cat);
                    }
                }
            }

            var sampleHtml = new StringBuilder();
            var sampleCatListHtml = new StringBuilder();
            var sampleJson = new StringBuilder();
            sampleJson.AppendLine("var sampleList = [");

            foreach (var c in categories)
            {
                sampleHtml.Append(c.ToHtml());
                sampleCatListHtml.Append(c.ToListItem());
                sampleJson.Append(c.ToJson());
            }

            //Create Sample List JSON

            sampleJson.Length--;
            sampleJson.Length--;

            sampleJson.AppendLine("];var numberOfSamples = " + NumberOfSamples + ";");

            using (var writer = new FileStream(dir + sampleListJsonPath, FileMode.Create, FileAccess.Write))
            {
                using (var sWriter = new StreamWriter(writer))
                {
                    sWriter.Write(sampleJson.ToString());
                }
            }

            //Create External Samples List HTML
            sampleCatListHtml.AppendLine("<a class=\"dropdown-item\" href=\"#ExternalSamples\">External Samples</a>");
            sampleHtml.AppendLine("\t\t\t\t<div class=\"row\"><div class=\"col-md-12\"><a name=\"ExternalSamples\"></a><h2>External Samples</h2><p>");

            foreach (var exc in SampleListHelper.ExternalSamples)
            {
                sampleHtml.AppendFormat("\t\t\t\t\t<b>{0}</b><ul>\n", exc.Title);

                foreach (var exs in exc.Samples)
                {
                    sampleHtml.AppendFormat("\t\t\t\t\t\t<li><a href=\"{0}\" target=\"_blank\">{1}</a>",
                        exs.Href,
                        exs.Title);

                    if (!string.IsNullOrWhiteSpace(exs.Description))
                    {
                        sampleHtml.Append(" - ");
                        sampleHtml.Append(exs.Description);
                    }

                    sampleHtml.Append("</li>\n");
                }

                sampleHtml.Append("\t\t\t\t\t</ul>\n");
            }

            sampleHtml.Append("\t\t\t\t</p></div></div>");

            using (var reader = new StreamReader(new FileStream(dir + indexTemplatePath, FileMode.Open, FileAccess.Read)))
            {
                var doc = reader.ReadToEnd();
                doc = doc.Replace("{categoryListDropdownItems}", sampleCatListHtml.ToString())
                    .Replace("{sampleListPlaceholder}", sampleHtml.ToString())
                    .Replace("{NumberOfSamples}", NumberOfSamples.ToString());

                using (var writer = new FileStream(dir + indexPath, FileMode.Create, FileAccess.Write))
                {
                    using (var sWriter = new StreamWriter(writer))
                    {
                        sWriter.Write(doc);
                    }
                }

                Console.WriteLine("Complete!\nNumber of samples: " + NumberOfSamples);
                Console.ReadLine();
            }
        }

        private static void AddSamples(DirectoryInfo catDir, DirectoryInfo subCatDir, SampleCategory sampleList, List<string> sampleNameList, List<string> existingImgNames, FileInfo[] screenshots)
        {
            FileInfo[] files;

            if (subCatDir != null)
            {
                files = subCatDir.GetFiles("*.html");
            }
            else
            {
                files = catDir.GetFiles("*.html");
            }

            if (files.Length > 0)
            {
                string path, sourcePath, fileName;

                foreach (var f in files)
                {
                    if (!f.Name.Contains("- Private"))
                    {
                        if (subCatDir != null)
                        {
                            path = catDir.Name + "/" + subCatDir.Name + "/" + f.Name.ToString();
                            sourcePath = catDir.Name + "/" + subCatDir.Name;
                        }
                        else
                        {
                            path = catDir.Name + "/" + f.Name.ToString();
                            sourcePath = path;
                        }

                        path = path.Replace(" ", "%20");
                        sourcePath = sourcePath.Replace(" ", "%20");

                        fileName = f.Name.Replace(".html", "");

                        var sample = new SampleInfo()
                        {
                            Path = path,
                            SourcePath = sourcePath,
                            Created = f.CreationTime.Date.ToShortDateString()
                        };

                        using (var reader = new StreamReader(f.OpenRead()))
                        {
                            var doc = reader.ReadToEnd();

                            int idx = 0;
                            idx = doc.IndexOf("<title>");

                            if (idx >= 0)
                            {
                                sample.Title = doc.Substring(idx + 7, doc.IndexOf("</title>", idx) - idx - 7);

                                if (!string.IsNullOrWhiteSpace(sample.Title))
                                {
                                    sample.Title = sample.Title.Replace("Azure Maps Web Control Samples - ", "");
                                }
                            }

                            if (string.IsNullOrWhiteSpace(sample.Title))
                            {
                                idx = doc.IndexOf("<label>");

                                if (idx > 0)
                                {
                                    sample.Title = doc.Substring(idx + 7, doc.IndexOf("</label>", idx) - idx - 7);

                                    if (sample.Title.EndsWith(" sample", StringComparison.OrdinalIgnoreCase))
                                    {
                                        sample.Title = sample.Title.Replace(" Sample", "").Replace(" sample", "");
                                    }
                                }
                            }

                            if (string.IsNullOrWhiteSpace(sample.Title))
                            {
                                sample.Title = fileName;
                            }

                            idx = doc.IndexOf("<meta name=\"description\" content=\"");

                            if (idx >= 0)
                            {
                                sample.Description = doc.Substring(idx + 34, doc.IndexOf("/>", idx) - idx - 34);

                                if (!string.IsNullOrWhiteSpace(sample.Description))
                                {
                                    sample.Description = sample.Description.Trim();
                                    if (sample.Description.EndsWith("\""))
                                    {
                                        sample.Description = sample.Description.Remove(sample.Description.LastIndexOf("\""), 1);
                                    }
                                }
                            }

                            idx = doc.IndexOf("<meta name=\"keywords\" content=\"");

                            if (idx >= 0)
                            {
                                sample.Keywords = doc.Substring(idx + 31, doc.IndexOf("/>", idx) - idx - 31);

                                if (!string.IsNullOrWhiteSpace(sample.Keywords))
                                {
                                    sample.Keywords = sample.Keywords.Trim().ToLowerInvariant();
                                    if (sample.Keywords.EndsWith("\""))
                                    {
                                        sample.Keywords = sample.Keywords.Remove(sample.Keywords.LastIndexOf("\""), 1);
                                    }
                                }
                            }
                        }

                        if (!sampleNameList.Contains(sample.Title))
                        {
                            sample.Screenshot = sample.Title.Replace(" ", "-");

                            foreach (var ss in screenshots)
                            {
                                if (string.Compare(ss.Name.Replace(ss.Extension, ""), sample.Screenshot) == 0)
                                {
                                    sample.Screenshot = ss.Name;
                                    break;
                                }
                            }

                            if (!sample.Screenshot.Contains("."))
                            {
                                sample.Screenshot = fileName.Replace(" ", "-");

                                foreach (var ss in screenshots)
                                {
                                    if (string.Compare(ss.Name.Replace(ss.Extension, ""), sample.Screenshot) == 0)
                                    {
                                        sample.Screenshot = ss.Name;
                                        break;
                                    }
                                }
                            }

                            if (!sample.Screenshot.Contains("."))
                            {
                                sample.Screenshot = string.Empty;
                            }

                            sampleList.Samples.Add(sample);

                            NumberOfSamples++;

                            Console.WriteLine(sample.Title);
                        }
                        else
                        {
                            Console.WriteLine("Error: File name used multiple times: " + fileName);
                        }
                    }
                }
            }

            if (subCatDir == null)
            {
                var subDirs = catDir.GetDirectories();

                foreach (var subDir in subDirs)
                {
                    if (SampleListHelper.ScanFolder(subDir.Name))
                    {
                        AddSamples(catDir, subDir, sampleList, sampleNameList, existingImgNames, screenshots);
                    }
                }
            }

            //if (sampleList[sampleList.Length - 1] == ',')
            //{
            //    sampleList.Length--;
            //}
        }
    }
}
