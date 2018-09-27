var specialCharRx = /[-,]*/;

window.onload = function () {
    //Ensure that user is on https endpoint, if not redirect them. Ignore if on localhost or file path.
    if (location.protocol != 'https:' && location.href.indexOf('//localhost') === -1 && location.href.indexOf('file:///' === -1)) {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    document.getElementById('copyrights').innerHTML += new Date().getFullYear();

    var defaultSampleImage = 'MapsSampleIcon.png';

    var categoryListItemTemplate = '<a class="dropdown-item" href="#{categoryName}">{category}</a>';
    var categoryHeaderTemplate = '<div class="col-md-12"><a name="{categoryName}"></a><h2>{category}</h2><p>{desc}</p></div>';
    var sampleCardTemplate = '<div class="col-md-4" rel="{title}"><div class="card mb-4 shadow-sm"><img class="card-img-top" src="SiteResources/screenshots/{screenshot}" alt="{title}"><div class="card-body"><h3>{title}</h3><p class="card-text">{desc}</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" onclick="openSample(\'{title}\')" class="btn btn-sm btn-outline-secondary">Run Sample</button><a target="_blank" href="/{path}" class="btn btn-sm btn-outline-secondary">Open In New Tab</a><a target="_blank" href="https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/{sourcePath}" class="btn btn-sm btn-outline-secondary">Source Code</a></div></div></div></div></div>';    

    var sampleHtml = [];
    var categoryListHtml = [];
    
    for (var i = 0, len = sampleList.length; i < len; i++) {
        if (sampleList[i].samples.length > 0) {
            var categoryName = sampleList[i].category.replace(/\s/g, '-').toLocaleLowerCase();

            categoryListHtml.push(
                categoryListItemTemplate
                    .replace('{categoryName}', categoryName)
                    .replace('{category}', sampleList[i].category));

            sampleHtml.push('<div class="row">');

            sampleHtml.push(
                categoryHeaderTemplate
                    .replace('{categoryName}', categoryName)
                    .replace('{category}', sampleList[i].category)
                    .replace('{desc}', sampleList[i].desc || ''));

            for (var j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                sampleHtml.push(
                    sampleCardTemplate
                        .replace(/{title}/g, sampleList[i].samples[j].title)
                        .replace('{desc}', sampleList[i].samples[j].desc || '')
                        .replace('{screenshot}', (sampleList[i].samples[j].screenshoot && sampleList[i].samples[j].screenshoot !== '') ? sampleList[i].samples[j].screenshoot : defaultSampleImage)
                        .replace(/{path}/g, sampleList[i].samples[j].path)
                        .replace(/{sourcePath}/g, sampleList[i].samples[j].sourcePath));
            }

            sampleHtml.push('</div>');
        }
    }

    //Add list of external samples
    categoryListHtml.push(
        categoryListItemTemplate
            .replace('{categoryName}', 'ExternalSamples')
            .replace('{category}', 'External Samples'));

    sampleHtml.push('<div class="row"><div class="col-md-12"><a name="ExternalSamples"></a><h2>External Samples</h2><p>');

    var keys = Object.keys(externalSamples).sort();

    keys.forEach(function (key) {
        var samples = externalSamples[key].sort(function(a, b) {
            return a.name - b.name;
        });

        sampleHtml.push('<b>', key, '</b><ul>');

        for (var i = 0; i < samples.length; i++) {
            sampleHtml.push('<li><a href="', samples[i].href, '" target="_blank">', samples[i].title, '</a>');

            if (samples[i].description && samples[i].description != '') {
                sampleHtml.push(' - ', samples[i].description);
            }

            sampleHtml.push('</li>');
        }

        sampleHtml.push('</ul>');
    });

    sampleHtml.push('</p></div></div>');

    document.getElementById('sampleListContainer').innerHTML = sampleHtml.join('');
    document.getElementById('categoryListDropdown').innerHTML = categoryListHtml.join('');

    document.getElementById('numberOfSamples').innerText = numberOfSamples;

    $('form').keydown(function (event) {
        if (event.keyCode == 13 ) {
            event.preventDefault();
            search();
            return false;
        }
    });

    //Check to see if a legacy URL is being used to access a sample.
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
        hash = hash.replace('#', '');
        window.location.hash = null;

        //File name redirects. Use this if you rename a sample file name and you want links to the old name to still work.
        var sampleRedirects = {
            'Customized%20Pin': 'Styled%20Symbol%20Layer',
            'Animate%20a%20Pin': 'Simple%20Symbol%20Animation',
            'Create%20Pins%20from%20Custom%20JSON': 'Create%20Symbols%20from%20Custom%20JSON',
            'HTML%20Marker': 'CSS%20Styled%20HTML%20Marker',
            'Custom%20Pin%20Image%20Icon': 'Custom%20Symbol%20Image%20Icon',
            'Pin%20Layer%20Options': 'Symbol%20Layer%20Options',
            'Simple%20directions': 'Calculate%20Route%with%20Services%20Module',
            'Basic%20Geocoding%20Request': 'Simple%20REST%20Geocoding%20Request',
        };

        var redirect = sampleRedirects[hash];

        if (redirect) {
            hash = redirect;
        }

        var sampleName = decodeURIComponent(hash);

        openSample(sampleName);
    } else {
        var sampleQuery = getParameterByName('sample');

        if (sampleQuery && sampleQuery !== '') {
            openSample(sampleQuery);
        }
    }

    var searchQuery = getParameterByName('search');

    if (searchQuery && searchQuery !== '') {
        document.getElementById('searchTbx').value = searchQuery;
        search();
    }

    $("#myModal").on('hide.bs.modal', function () {
        removeQString('sample');
    });
};

function search() {
    var query = document.getElementById('searchTbx').value;

    if (query === '') {
        removeQString('search');
        $('.container .row .col-md-4').css('display', '');
        $('.container .row .col-md-12').css('display', '');
    } else {
        $('.container .row .col-md-12').css('display', 'none');

        changeUrl('search', encodeURIComponent(query));

        //Remove special characters from query
        query = query.toLowerCase().replace(specialCharRx,'');

        var matchedSamples = [];

        for (var i = 0, len = sampleList.length; i < len; i++) {
            for (var j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                //Check to see if query matches title, description or keywords.
                if (sampleList[i].samples[j].title.replace(specialCharRx, '').toLowerCase().indexOf(query) >= 0 ||
                    sampleList[i].samples[j].desc.replace(specialCharRx, '').toLowerCase().indexOf(query) >= 0 ||
                    sampleList[i].samples[j].keywords.indexOf(query) >= 0) {
                    matchedSamples.push(sampleList[i].samples[j].title);
                }
            }
        }

        if (matchedSamples.length === 0) {
            //Do a more agressive search by breaking the query into individual words and checking the keywords.
            var queryParts = query.split(/[\s]+/);

            if (queryParts.length > 1) {
                for (var i = 0, len = sampleList.length; i < len; i++) {
                    for (var j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                        for (var k = 0, knt = queryParts.length; k < knt; k++) {
                            //Check to see if query matches title, description or keywords.
                            if (queryParts[k].length > 2 && sampleList[i].samples[j].keywords.indexOf(queryParts[k]) >= 0) {
                                matchedSamples.push(sampleList[i].samples[j].title);
                                break;
                            }
                        }
                    }
                }
            }
        }

        $('.container .row .col-md-4').each(function (index, obj) {
            var title = $(obj).attr('rel');

            if (matchedSamples.indexOf(title) >= 0) {
                $(obj).css('display', '');
            } else {
                $(obj).css('display', 'none');
            }
        });
    }
}

function openSample(sampleName) {
    var sample;

    sampleName = sampleName.replace(specialCharRx, '').toLowerCase();

    for (var i = 0, len = sampleList.length; i < len; i++) {
        for (var j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
            if (sampleList[i].samples[j].title.replace(specialCharRx, '').toLowerCase() === sampleName) {
                sample = sampleList[i].samples[j];
                break;
            }
        }
    }

    if (sample) {
        changeUrl('sample', encodeURIComponent(sample.title));

        $('.modal-title').text(sample.title);
        $('#modelSourceCode').attr('href', 'https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/' + sample.sourcePath);
        $('.modal-body').html('<iframe src="' + sample.path + '" frameborder="0" scrolling="0" width="99.6%" height="700px"></iframe>');
        $("#myModal").modal('show');
    }
}

//Define variable
var objQueryString = {};

//Get querystring value
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function changeUrl(key, value) {
    //Get query string value
    var searchUrl = location.search;
    if (searchUrl.indexOf("?") == "-1") {
        var urlValue = '?' + key + '=' + value;
        history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
    }
    else {
        //Check for key in query string, if not present
        if (searchUrl.indexOf(key) == "-1") {
            var urlValue = searchUrl + '&' + key + '=' + value;
        }
        else {	//If key present in query string
            oldValue = getParameterByName(key);
            if (searchUrl.indexOf("?" + key + "=") != "-1") {
                urlValue = searchUrl.replace('?' + key + '=' + oldValue, '?' + key + '=' + value);
            }
            else {
                urlValue = searchUrl.replace('&' + key + '=' + oldValue, '&' + key + '=' + value);
            }
        }
        history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
        //history.pushState function is used to add history state.
        //It takes three parameters: a state object, a title (which is currently ignored), and (optionally) a URL.
    }
    objQueryString.key = value;
}

//Function used to remove querystring
function removeQString(key) {
    var urlValue = document.location.href;

    //Get query string value
    var searchUrl = location.search;

    if (key != "") {
        oldValue = encodeURIComponent(getParameterByName(key));
        removeVal = key + "=" + oldValue;
        if (searchUrl.indexOf('?' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('?' + removeVal + '&', '?');
        }
        else if (searchUrl.indexOf('&' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('&' + removeVal + '&', '&');
        }
        else if (searchUrl.indexOf('?' + removeVal) != "-1") {
            urlValue = urlValue.replace('?' + removeVal, '');
        }
        else if (searchUrl.indexOf('&' + removeVal) != "-1") {
            urlValue = urlValue.replace('&' + removeVal, '');
        }
    }
    else {
        var searchUrl = location.search;
        urlValue = urlValue.replace(searchUrl, '');
    }
    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
}