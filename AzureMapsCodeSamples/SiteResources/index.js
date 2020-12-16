var specialCharRx = /[-,]*/;

window.onload = function () {
    const observer = lozad();
    observer.observe();

    //Ensure that user is on https endpoint, if not redirect them. Ignore if on localhost or file path.
    if (location.protocol !== 'https:' && location.href.indexOf('//localhost') === -1 && location.href.indexOf('file:///' === -1)) {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    document.getElementById('copyrights').innerHTML += new Date().getFullYear();

    $('form').keydown(function (event) {
        if (event.keyCode === 13 ) {
            event.preventDefault();
            search();
            return false;
        }
    });

    $('form').mouseup(function () {
        setTimeout(function () {
            if (document.getElementById('searchTbx').value === '') {
                search();
            }
        }, 1);        
    });

    //Check to see if a legacy URL is being used to access a sample.
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
        hash = hash.replace('#', '');
        window.history.replaceState(null, null, ' ');

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
            'Layer%20Events': 'Symbol%20layer%20events',
            'Census%20group%20block%20analysis': 'Census%20block%20group%20analysis',

            'Animated%20Tile%20Layer': 'Animated%20tile%20layer',
            'Animate%20a%20Symbol%20along%20a%20Path': 'Animate%20along%20a%20path',
            'Animate%20a%20LineString': 'Animate%20a%20snakeline',
            'Animate%20a%20point': 'Animate%20to%20new%20position%20of%20point',
            'Animate%20a%20Choropleth%20Map': 'Animate%20a%20choropleth%20map',
            'Geolocation%20Control%20Options': 'Geolocation%20control%20options',
            'Geolocation%20Control': 'Geolocation%20control',
            'Create%20a%20Geolocation%20Control': 'Geolocation%20control',
            'Continuous%20User%20Position%20Tracking': 'Continuous%20user%20position%20tracking',
            'Show%20a%20Users%20Position': 'Show%20a%20users%20position',
            'User%20Position%20Accuracy%20Circle': 'User%20position%20accuracy%20circle',
            'Create%20a%20Fullscreen%20Control': 'Fullscreen%20Control',
            'Fullscreen%20Control': 'Fullscreen%20control',
            'Create%20a%20Traffic%20Control': 'Traffic%20controls',
            'Merge%20Two%20Polygons%20Together': 'Merge%20two%20polygons%20together',
            'Azure%20Maps%20Raster%20Tiles%20in%20Leaflet%20JS': 'Raster%20Tiles%20in%20Leaflet%20JS',
            'Mini%20Overview%20Map': 'Mini%20overview%20map'
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

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction(); };
};

function toggleDescriptions(elm) {
    var displayState = (elm.checked) ? '': 'none';

    var i, elements = document.getElementsByClassName('card-text');

    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = displayState;
    }

    elements = document.getElementsByClassName('card-img-top');

    if (displayState === '') {
        for (i = 0; i < elements.length; i++) {
            elements[i].style.height = '225px';
            elements[i].firstChild.style.top = '0';
        }
    } else {
        for (i = 0; i < elements.length; i++) {
            elements[i].style.height = '120px';
            elements[i].firstChild.style.top = '-50%';
        }
    }
}

function toggleShowLatest(elm) {
    document.getElementById('searchTbx').value = (elm.checked) ? 'latest' : '';
    search();
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function search() {
    var recentDayLimit = 45;

    var query = document.getElementById('searchTbx').value;
    document.getElementById('showLatestCbx').checked = false;

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
        var i, j, len, cnt; 

        if (query === 'new' || query === 'latest' || query === 'newest' || query === 'recent') {
            var today = new Date();

            for (i = 0, len = sampleList.length; i < len; i++) {
                for (j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                    if (dateDiffInDays(new Date(Date.parse(sampleList[i].samples[j].created)), today) <= recentDayLimit) {
                        matchedSamples.push(sampleList[i].samples[j].title);
                    }
                }
            }

            document.getElementById('showLatestCbx').checked = true;
        } else if (query === 'no-image') {
            for (i = 0, len = sampleList.length; i < len; i++) {
                for (j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                    if (sampleList[i].samples[j].screenshot === '') {
                        matchedSamples.push(sampleList[i].samples[j].title);
                    }
                }
            }
        } else {
            for (i = 0, len = sampleList.length; i < len; i++) {
                for (j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
                    //Check to see if query matches title, description or keywords.
                    if (sampleList[i].samples[j].title.replace(specialCharRx, '').toLowerCase().indexOf(query) >= 0 ||
                        sampleList[i].samples[j].desc.replace(specialCharRx, '').toLowerCase().indexOf(query) >= 0 ||
                        sampleList[i].samples[j].keywords.indexOf(query) >= 0) {
                        matchedSamples.push(sampleList[i].samples[j].title);
                    }
                }
            }
        }

        if (matchedSamples.length === 0) {
            //Do a more agressive search by breaking the query into individual words and checking the keywords.
            var queryParts = query.split(/[\s]+/);

            if (queryParts.length > 1) {
                for (i = 0, len = sampleList.length; i < len; i++) {
                    for (j = 0, cnt = sampleList[i].samples.length; j < cnt; j++) {
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

const _MS_PER_DAY = 1000 * 3600 * 24;

function dateDiffInDays(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / _MS_PER_DAY); 
}

var iframe;

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
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', '0');
            iframe.setAttribute('lang', 'en');
            iframe.setAttribute('aria-label', 'Live code sample window');
            iframe.setAttribute('width', '99.6%');
            iframe.onload = () => {
                var s = iframe.contentDocument.body.style;
                s.fontFamily = 'Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';
                s.fontSize = '14px';
            };
            document.getElementsByClassName('modal-body')[0].appendChild(iframe);
        }

        iframe.setAttribute('height', ($(window).height() - 190) + 'px');
        iframe.src = sample.path;

        changeUrl('sample', encodeURIComponent(sample.title));

        $('.modal-title').text(sample.title);
        $('#modelSourceCode').attr('href', 'https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/' + sample.sourcePath);
        
        //$('.modal-body').html('<iframe src="' + sample.path + '" frameborder="0" scrolling="0" width="99.6%" height="' + ($(window).height() - 190) + 'px" aria-label="Live code sample window" lang="en"></iframe>');
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
    var urlValue;

    if (searchUrl.indexOf("?") === -1) {
        urlValue = '?' + key + '=' + value;
        history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
    }
    else {
        //Check for key in query string, if not present
        if (searchUrl.indexOf(key) === -1) {
            urlValue = searchUrl + '&' + key + '=' + value;
        }
        else {	//If key present in query string
            oldValue = getParameterByName(key);
            if (searchUrl.indexOf("?" + key + "=") !== -1) {
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

    if (key !== "") {
        oldValue = encodeURIComponent(getParameterByName(key));
        removeVal = key + "=" + oldValue;
        if (searchUrl.indexOf('?' + removeVal + '&') !== -1) {
            urlValue = urlValue.replace('?' + removeVal + '&', '?');
        }
        else if (searchUrl.indexOf('&' + removeVal + '&') !== -1) {
            urlValue = urlValue.replace('&' + removeVal + '&', '&');
        }
        else if (searchUrl.indexOf('?' + removeVal) !== -1) {
            urlValue = urlValue.replace('?' + removeVal, '');
        }
        else if (searchUrl.indexOf('&' + removeVal) !== -1) {
            urlValue = urlValue.replace('&' + removeVal, '');
        }
    }
    else {
        searchUrl = location.search;
        urlValue = urlValue.replace(searchUrl, '');
    }

    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
}
