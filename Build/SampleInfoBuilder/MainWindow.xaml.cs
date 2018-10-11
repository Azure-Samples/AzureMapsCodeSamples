using CefSharp.WinForms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Forms;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace SampleInfoBuilder
{
    public partial class MainWindow : Window
    {
        private int sampleImageWidth = 350;
        private int sampleImageHeight = 225;
        private int sampleLoadTime = 5000;
        private bool webPageLoaded = false;
        private int NumberOfSamples = 0;
        private ChromiumWebBrowser SampleWebView;
        private string sampleListJsonPath = "SiteResources/SampleList.js";
        private string screenshotFolderDir;
        private int scaling = 3;

        public MainWindow()
        {
            this.InitializeComponent();

            Host.Loaded += (s, e) =>
            {
                SampleWebView = new ChromiumWebBrowser("https://bing.com");
                Host.Child = SampleWebView;

                SampleWebView.LoadingStateChanged += (s1, e1) =>
                {
                    if (!e1.IsLoading)
                    {
                        webPageLoaded = true;
                    }
                };
            };
        }

        private async void GenerateSampleResources()
        {
            NumberOfSamples = 0;

            var dir = Directory.GetCurrentDirectory();
            dir = dir.Substring(0, dir.LastIndexOf("AzureMapsCodeSamples") + 21) + "AzureMapsCodeSamples\\";

            var dirInfo = new DirectoryInfo(dir);
            var categories = dirInfo.GetDirectories();

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

            var sb = new StringBuilder();
            sb.AppendLine("var sampleList = [");

            var sampleNameList = new List<string>();

            foreach (var c in categories)
            {
                if (SampleListHelper.ScanFolder(c.Name))
                {
                    sb.AppendFormat("{{\n\tcategory:'{0}',\n\tdesc:'{1}',\n\tsamples: [", c.Name, SampleListHelper.GetDescription(c.Name));

                    await AddSamples(c, null, sb, sampleNameList, existingImgNames, imgFiles);

                    sb.Append("\n\t]\n},\n");
                }
            }

            sb.Length--;
            sb.Length--;

            sb.AppendLine("];var numberOfSamples = " + NumberOfSamples  + ";");

            using (var writer = new FileStream(dir + sampleListJsonPath, FileMode.Create, FileAccess.Write))
            {
                using (var sWriter = new StreamWriter(writer))
                {
                    sWriter.Write(sb.ToString());
                }
            }

            Status.Text += "Complete!\nNumber of samples: " + NumberOfSamples + "\n";
        }

        private async Task AddSamples(DirectoryInfo catDir, DirectoryInfo subCatDir, StringBuilder sb, List<string> sampleNameList, List<string> existingImgNames, FileInfo[] screenshots)
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
                string path, sourcePath, fileName, title, description, imageSrc, screenshotPath, keywords, created;

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
                        title = string.Empty;
                        description = string.Empty;
                        screenshotPath = string.Empty;
                        keywords = string.Empty;
                        created = f.CreationTime.Date.ToShortDateString();

                        using (var reader = new StreamReader(f.OpenRead()))
                        {
                            var doc = reader.ReadToEnd();

                            int idx = 0;
                            idx = doc.IndexOf("<title>");

                            if (idx >= 0)
                            {
                                title = doc.Substring(idx + 7, doc.IndexOf("</title>", idx) - idx - 7);

                                if (!string.IsNullOrWhiteSpace(title))
                                {
                                    title = title.Replace("Azure Maps Web Control Samples - ", "");
                                }
                            }

                            if (string.IsNullOrWhiteSpace(title))
                            {
                                idx = doc.IndexOf("<label>");

                                if (idx > 0)
                                {
                                    title = doc.Substring(idx + 7, doc.IndexOf("</label>", idx) - idx - 7);

                                    if(title.EndsWith(" sample", StringComparison.OrdinalIgnoreCase))
                                    {
                                        title = title.Replace(" Sample", "").Replace(" sample", "");
                                    }
                                }
                            }

                            if (string.IsNullOrWhiteSpace(title))
                            {
                                title = fileName;
                            }

                            idx = doc.IndexOf("<meta name=\"description\" content=\"");

                            if (idx >= 0)
                            {
                                description = doc.Substring(idx + 34, doc.IndexOf("/>", idx) - idx - 34);

                                if (!string.IsNullOrWhiteSpace(description))
                                {
                                    description = description.Trim();
                                    if (description.EndsWith("\""))
                                    {
                                        description = description.Remove(description.LastIndexOf("\""), 1);
                                    }
                                }
                            }

                            idx = doc.IndexOf("<meta name=\"keywords\" content=\"");

                            if (idx >= 0)
                            {
                                keywords = doc.Substring(idx + 31, doc.IndexOf("/>", idx) - idx - 31);

                                if (!string.IsNullOrWhiteSpace(keywords))
                                {
                                    keywords = keywords.Trim().ToLowerInvariant();
                                    if (keywords.EndsWith("\""))
                                    {
                                        keywords = keywords.Remove(keywords.LastIndexOf("\""), 1);
                                    }
                                }
                            }
                        }


                        if (!sampleNameList.Contains(title))
                        {
                            imageSrc = fileName.Replace(" ", "-");

                            if (CaptureImages.IsChecked == true && !existingImgNames.Contains(imageSrc) && SampleListHelper.ScreenshotsToIgnore.IndexOf(title) == -1)
                            {
                                webPageLoaded = false;
                                SampleWebView.Load(f.FullName);

                                while (!webPageLoaded)
                                {
                                    await Task.Delay(sampleLoadTime);
                                }

                                await Task.Delay(sampleLoadTime);

                                User32.RECT windowRect = new User32.RECT();
                                User32.GetWindowRect(SampleWebView.Handle, ref windowRect);

                                using (var newBmp = new Bitmap((int)sampleImageWidth * scaling, (int)sampleImageHeight * scaling, System.Drawing.Imaging.PixelFormat.Format24bppRgb))
                                {
                                    System.Drawing.Point topLeftPoint = new System.Drawing.Point((int)(windowRect.left + SampleWebView.Left + 250), (int)(windowRect.top + SampleWebView.Top + 200));
                                    var graphics = Graphics.FromImage(newBmp);
                                    graphics.CopyFromScreen(topLeftPoint, System.Drawing.Point.Empty, new System.Drawing.Size((int)sampleImageWidth * scaling, (int)sampleImageHeight * scaling));
                                    //newBmp.Save(screenshotFolderDir + "\\" + imageSrc + ".jpg", ImageFormat.Jpeg);

                                    Bitmap resized = new Bitmap(newBmp, new System.Drawing.Size(sampleImageWidth, sampleImageHeight));

                                    imageSrc += ".png";
                                    screenshotPath = screenshotFolderDir + "\\" + imageSrc;                                    

                                    resized.Save(screenshotPath, ImageFormat.Png);
                                }

                                await Task.Delay(sampleLoadTime);
                            }
                            else
                            {
                                foreach(var ss in screenshots)
                                {
                                    if(string.Compare(ss.Name.Replace(ss.Extension, ""), imageSrc) == 0)
                                    {
                                        imageSrc = ss.Name;
                                        break;
                                    }
                                }

                                if (!imageSrc.Contains("."))
                                {
                                    imageSrc = string.Empty;
                                }
                            }

                            sb.AppendFormat("\n\t\t{{\n\t\t\ttitle:'{0}',\n\t\t\tdesc:'{1}',\n\t\t\tpath:'{2}',\n\t\t\tsourcePath:'{3}',\n\t\t\tscreenshoot:'{4}',\n\t\t\tkeywords:'{5}',\n\t\t\tcreated:'{6}'\n\t\t}},",
                                title.Replace("'", "\\'"),
                                description.Replace("'","\\'"),
                                path,
                                sourcePath,
                                imageSrc,
                                keywords,
                                created
                            );

                            NumberOfSamples++;

                            Status.Text += title + "\n";
                        }
                        else
                        {
                            Status.Text += "Error: File name used multiple times: " + fileName + "\n";
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
                        await AddSamples(catDir, subDir, sb, sampleNameList, existingImgNames, screenshots);
                    }
                }
            }

            if (sb[sb.Length - 1] == ',')
            {
                sb.Length--;
            }
        }

        /// <summary>
        /// Helper class containing User32 API functions
        /// </summary>
        private class User32
        {
            [StructLayout(LayoutKind.Sequential)]
            public struct RECT
            {
                public int left;
                public int top;
                public int right;
                public int bottom;
            }
            [DllImport("user32.dll")]
            public static extern IntPtr GetDesktopWindow();
            [DllImport("user32.dll")]
            public static extern IntPtr GetWindowDC(IntPtr hWnd);
            [DllImport("user32.dll")]
            public static extern IntPtr ReleaseDC(IntPtr hWnd, IntPtr hDC);
            [DllImport("user32.dll")]
            public static extern IntPtr GetWindowRect(IntPtr hWnd, ref RECT rect);
        }

        private void RunBtn_Click(object sender, RoutedEventArgs e)
        {
            RunBtn.IsEnabled = false;

            GenerateSampleResources();

            RunBtn.IsEnabled = true;
        }
    }
}