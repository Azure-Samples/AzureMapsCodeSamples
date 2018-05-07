<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AzureMapsCodeSamples.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Azure Maps Code Samples</title>
	<meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <link href="SiteResources/AzureIcon.png" rel="shortcut icon" />
    <link type="text/css" rel="stylesheet" href="SiteResources/default.css" />
    <link rel="stylesheet" href="https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/themes/base/jquery-ui.css"/>

    <script type="text/javascript">
        var WarningMessage = '<%=WarningMessage%>';
        var NumberOfSamples = <%=NumberOfSamples%>;
        var SampleList = <%=SampleList%>;

        //Get your own Azure Maps Subscription Key at azure.com
        //DO NOT USE THIS KEY!!! It will change frequently and your app will break!
        var subscriptionKey = '<%=AzureMapsSubscriptionKey%>';
    </script>

    <style>
    body, html {
        padding: 0;
        margin:0;
        height: 100vh;
    }
    </style>
</head>
<body>  
     <div class="header">
        <img class="logo" src="SiteResources/AzureIcon.png" />
        <span class="subTitle">Azure Maps Code Samples</span>

        <span class="pageLinks">
           <%-- <iframe src="https://ghbtns.com/github-btn.html?user=Microsoft&repo=BingMapsV8CodeSamples&type=star&count=true" frameborder="0" scrolling="0" style="width:100px;height:20px"></iframe>--%>

            <%--<a href="https://social.msdn.microsoft.com/Forums/en-US/home?category=bingmaps" target="_blank">Forums</a>--%>
            <a href="https://docs.microsoft.com/en-us/azure/location-based-services/" target="_blank">Documentation</a>
            <%--<a href="https://github.com/Microsoft/BingMapsV8CodeSamples" target="_blank">GitHub Project</a>--%>
        </span>
    </div>

    <div class="content">
        <div id="sampleTreeContainer">
            <input id="searchTbx"/>

            <form id="form1" runat="server">
                <asp:TreeView ID="SampleTreeView" ExpandDepth="0" 
                    HoverNodeStyle-CssClass="sampleListHover"
                    EnableClientScript="true" runat="server">
                    <LevelStyles>
                        <asp:TreeNodeStyle CssClass="categoryNode"/>
                        <asp:TreeNodeStyle CssClass="sampleNode"/>
                    </LevelStyles>
                </asp:TreeView>
            </form>
        </div>

        <iframe id="displayWindow" src="Welcome.html" allowfullscreen></iframe>

        <div id="sourceCodeLinkPanel" style="display:none;">
            <a id="newWindowLink" class="blueAnchorButton" href="javascript:void(0);" style="display:none">Open in New Window</a>
            <a id="sourceCodeLink" class="blueAnchorButton" href="http://bing.com" target="_blank">Source code</a>
        </div>
    </div>

    <div class="footer">
        <span><a href="http://go.microsoft.com/fwlink/?LinkId=521839&CLCID=0409">Privacy</a></span>
        <span><a href="http://go.microsoft.com/fwlink/?LinkID=246338&CLCID=0409">Legal</a></span>
        <span class="copyrights">&copy; Microsoft <%= DateTime.Now.Year.ToString() %></span>
    </div>

    <asp:Label ID="ErrorLabel" runat="server"></asp:Label>

    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="SiteResources/default.js"></script>
</body>
</html>

