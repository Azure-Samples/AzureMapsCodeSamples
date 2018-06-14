var githubProjectUrl = 'https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/';
var currentSampleElm;

function loadSample(name, path, sourcePath) {
    var sampleNode = getSampleNode(name);
    if (sampleNode) {
        if (currentSampleElm) {
            currentSampleElm.classList.remove('selectedNode');
        }
        currentSampleElm = sampleNode;
        currentSampleElm.classList.add('selectedNode');
    }
    window.location.hash = encodeURIComponent(name);

    //Download HTML for sample.
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", path, false);

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            var sampleHtml = xmlHttp.responseText;

            sampleHtml = sampleHtml.replace(/<subscriptionKey>/gi, subscriptionKey);

            var iframe = document.getElementById('displayWindow');

            var doc = iframe.document;

            if (iframe.contentDocument) {
                doc = iframe.contentDocument; // For NS6
            } else if (iframe.contentWindow) {
                doc = iframe.contentWindow.document; // For IE5.5 and IE6
            }

            doc.open();
            doc.writeln(sampleHtml);
            doc.close();

            if (sourcePath && sourcePath != '') {
                //TODO: Uncomment to show source code link.
                document.getElementById('sourceCodeLinkPanel').style.display = '';
                document.getElementById('newWindowLink').onclick = function () {
                    var win = window.open();
                    win.document.write(sampleHtml);
                };
                document.getElementById('sourceCodeLink').href = githubProjectUrl + sourcePath;
            }
            else {
                document.getElementById('sourceCodeLinkPanel').style.display = 'none';
            }

            iframe.focus();            
        }
    }

    xmlHttp.send();  
}

var spaceRx = /\s/g;

function getSampleNode(name) {
    name = decodeURIComponent(name);
    var sampleLinks = document.getElementById('SampleTreeView').getElementsByTagName('a');
    for (var i = 0; i < sampleLinks.length; i++) {
        if (sampleLinks[i].innerText === name) {
            return sampleLinks[i];
        }
    }
    return null;
}

function getSamplesParent(sampleElm) {
    return sampleElm.parentNode.parentNode.parentNode.parentNode.parentNode.id;
}

function loadSampleByHash(hash) {
    var redirect = sampleRedirects[hash];
    if (redirect) {
        hash = redirect;
    }
    var sampleNode = getSampleNode(hash);
    if (sampleNode) {
        currentSampleElm = sampleNode;
        currentSampleElm.classList.add('selectedNode');
        window.location = sampleNode.href;
        var childNodesArg = getSamplesParent(sampleNode);
        var parentId = childNodesArg.replace('Nodes', '');
        var nodeIndex = parentId.charAt(parentId.length - 1);
        if (/[0-9]+/.test(nodeIndex)) {
            TreeView_ToggleNode(SampleTreeView_Data, nodeIndex, document.getElementById(parentId), ' ', document.getElementById(childNodesArg));
        }
    }
}

window.onload = function () {
    if (WarningMessage) {
        alert(WarningMessage);
    }

    var hash = window.location.hash;
    if (hash) {
        hash = hash.replace('#', '');
        loadSampleByHash(hash);
    }
    return false;
};

$(function () {
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this, currentCategory = "";
            $.each(items, function (index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        }
    });

    SampleList.sort(function (a, b) {
        var nameA = a.label.toLowerCase(), nameB = b.label.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });

    $("#searchTbx").autocomplete({
        delay: 0,
        source: SampleList,
        delay: 0,
        select: function (event, ui) {
            if (ui && ui.item && ui.item.action) {
                ui.item.action();
            }
        }
    }).click(function () {
        $(this).val('');
        });

    $("#searchTbx").val('Search the samples');
});

//File name redirects. Use this if you rename a sample file name and you want links to the old name to still work.
var sampleRedirects = {
    //'CustomOverlay_HtmlPushpinLayer': 'Html%20Pushpin%20Layer'
};
