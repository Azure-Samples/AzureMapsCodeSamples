//The maximum zoom level to cluster data point data on the map.
var maxClusterZoomLevel = 11;

//The URL to the store location data.
var storeLocationDataUrl = '/tutorials/simple-store-locator/data/ContosoCoffee.txt';

//The URL to the icon image. 
var iconImageUrl = '/tutorials/simple-store-locator/images/CoffeeIcon.png';      

// Azure Maps Geocode API endpoints
var geocodeAutocompleteUrlTemplate = 'https://{azMapsDomain}/geocode:autocomplete?api-version=2025-06-01-preview&query={query}&coordinates={lon},{lat}&bbox={bbox}&top=10&resultTypeGroups=Place&top=10';

// Geocoding API to get coordinates for selected autocomplete item  
var geocodeUrlTemplate = 'https://{azMapsDomain}/geocode?api-version=2025-06-01-preview&query={selectedEntity}';

var map, popup, datasource, iconLayer, centerMarker;
var listItemTemplate = '<div class="listItem" onclick="itemSelected(\'{id}\')"><div class="listItem-title">{title}</div>{city}<br />Open until {closes}<br />{distance} miles away</div>';

function initialize() {
    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: [-90, 40],
        zoom: 2,
        view: 'Auto',

        //Add authentication details for connecting to Azure Maps.
        authOptions: {
            // Use SAS token for authentication 
            authType: 'sas',
            getToken: function (resolve, reject, map) {
                var tokenServiceUrl = 'https://samples.azuremaps.com/api/GetAzureMapsSasToken';
                fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
            }
        }
    });

    //Create a popup but leave it closed so we can update it and display it later.
    popup = new atlas.Popup();

    //If the user presses the search button, geocode the value they passed in.
    document.getElementById('searchBtn').onclick = performSearch;

    //If the user presses enter in the search textbox, perform a search.
    document.getElementById('searchTbx').onkeyup = function (e) {
        if (e.keyCode === 13) {
            performSearch();
        }
    };

    //If the user presses the My Location button, use the geolocation API to get the users location and center/zoom the map to that location.
    document.getElementById('myLocationBtn').onclick = setMapToUserLocation;

    //Wait until the map resources are ready.
    map.events.add('ready', function () {
        //Add the zoom control to the map.
        map.controls.add(new atlas.control.ZoomControl(), {
            position: 'top-right'
        });

        //Add an HTML marker to the map to indicate the center used for searching.
        centerMarker = new atlas.HtmlMarker({
            htmlContent: '<div class="mapCenterIcon"></div>',
            position: map.getCamera().center
        });

        map.markers.add(centerMarker);

        //Create a data source and add it to the map and enable clustering.
        datasource = new atlas.source.DataSource(null, {
            cluster: true,
            clusterMaxZoom: maxClusterZoomLevel - 1
        });

        map.sources.add(datasource);

        //Load all the store data now that the data source has been defined. 
        loadStoreData();

        //Create a bubble layer for rendering clustered data points.
        var clusterBubbleLayer = new atlas.layer.BubbleLayer(datasource, null, {
            radius: 12,
            color: '#007faa',
            strokeColor: 'white',
            strokeWidth: 2,
            filter: ['has', 'point_count'] //Only render data points which have a point_count property, which clusters do.
        });

        //Create a symbol layer to render the count of locations in a cluster.
        var clusterLabelLayer = new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: 'none' //Hide the icon image.
            },
            textOptions: {
                textField: ['get', 'point_count_abbreviated'],
                size: 12,
                font: ['StandardFont-Bold'],
                offset: [0, 0.4],
                color: 'white'
            }
        });

        map.layers.add([clusterBubbleLayer, clusterLabelLayer]);

        //Load a custom image icon into the map resources.
        map.imageSprite.add('myCustomIcon', iconImageUrl).then(function () {

            //Create a layer to render a coffe cup symbol above each bubble for an individual location.
            iconLayer = new atlas.layer.SymbolLayer(datasource, null, {
                iconOptions: {
                    //Pass in the id of the custom icon that was loaded into the map resources.
                    image: 'myCustomIcon',

                    //Optionally scale the size of the icon.
                    font: ['SegoeUi-Bold'],

                    //Anchor the center of the icon image to the coordinate.
                    anchor: 'center',

                    //Allow the icons to overlap.
                    allowOverlap: true
                },
                filter: ['!', ['has', 'point_count']] //Filter out clustered points from this layer.
            });

            map.layers.add(iconLayer);

            //When the mouse is over the cluster and icon layers, change the cursor to be a pointer.
            map.events.add('mouseover', [clusterBubbleLayer, iconLayer], function () {
                map.getCanvasContainer().style.cursor = 'pointer';
            });

            //When the mouse leaves the item on the cluster and icon layers, change the cursor back to the default which is grab.
            map.events.add('mouseout', [clusterBubbleLayer, iconLayer], function () {
                map.getCanvasContainer().style.cursor = 'grab';
            });

            //Add a click event to the cluster layer. When someone clicks on a cluster, zoom into it by 2 levels. 
            map.events.add('click', clusterBubbleLayer, function (e) {
                map.setCamera({
                    center: e.position,
                    zoom: map.getCamera().zoom + 2
                });
            });

            //Add a click event to the icon layer and show the shape that was clicked.
            map.events.add('click', iconLayer, function (e) {
                showPopup(e.shapes[0]);
            });

            //Add an event to monitor when the map has finished moving.
            map.events.add('render', function () {
                //Give the map a chance to move and render data before updating the list.
                updateListItems();
            });

            // Initialize jQuery UI autocomplete for the search textbox
            initializeAutocomplete();
        });
    });
}

function loadStoreData() {
    //Download the store location data.
    fetch(storeLocationDataUrl)
        .then(response => response.text())
        .then(function (text) {

            //Parse the Tab delimited file data into GeoJSON features.
            var features = [];

            //Split the lines of the file.
            var lines = text.split('\n');

            //Grab the header row.
            var row = lines[0].split('\t');

            //Parse the header row and index each column, so that when our code for parsing each row is easier to follow.
            var header = {};
            var numColumns = row.length;
            var i;

            for (i = 0; i < row.length; i++) {
                header[row[i]] = i;
            }

            //Skip the header row and then parse each row into a GeoJSON feature.
            for (i = 1; i < lines.length; i++) {
                row = lines[i].split('\t');

                //Ensure that the row has the right number of columns.
                if (row.length >= numColumns) {

                    features.push(new atlas.data.Feature(new atlas.data.Point([parseFloat(row[header['Longitude']]), parseFloat(row[header['Latitude']])]), {
                        AddressLine: row[header['AddressLine']],
                        City: row[header['City']],
                        Municipality: row[header['Municipality']],
                        AdminDivision: row[header['AdminDivision']],
                        Country: row[header['Country']],
                        PostCode: row[header['PostCode']],
                        Phone: row[header['Phone']],
                        StoreType: row[header['StoreType']],
                        IsWiFiHotSpot: (row[header['IsWiFiHotSpot']].toLowerCase() === 'true') ? true : false,
                        IsWheelchairAccessible: (row[header['IsWheelchairAccessible']].toLowerCase() === 'true') ? true : false,
                        Opens: parseInt(row[header['Opens']]),
                        Closes: parseInt(row[header['Closes']])
                    }));
                }
            }

            //Add the features to the data source.
            datasource.add(features);

            //Initially update the list items.
            updateListItems();
        });
}

function initializeAutocomplete() {
    $("#searchTbx").autocomplete({
        minLength: 3,
        source: function (request, response) {
            const normalizeLongitude = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;

            var center = map.getCamera().center;
            var bbox = map.getCamera().bounds;
            var bboxStr = `${normalizeLongitude(bbox[0])},${bbox[1]},${normalizeLongitude(bbox[2])},${bbox[3]}`;

            var requestUrl = geocodeAutocompleteUrlTemplate
                .replace('{query}', encodeURIComponent(request.term))
                .replace('{azMapsDomain}', atlas.getDomain())
                .replace('{lon}', center[0])
                .replace('{lat}', center[1])
                .replace('{bbox}', bboxStr);

            processRequest(requestUrl, {
                headers: {
                    'Accept-Language': 'en-US'
                }
            }).then(data => {
                response(data.features);
            });
        },
        select: function (event, ui) {
            var selectedEntity = ui.item.properties.address.formattedAddress;
            geocodeSelectedLocation(selectedEntity, ui.item);
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        var suggestionLabel = item.properties.address.formattedAddress;
        if (item.properties.name) {
            suggestionLabel = item.properties.name + ' (' + suggestionLabel + ')';
        }

        return $("<li>")
            .append("<a>" + suggestionLabel + "</a>")
            .appendTo(ul);
    };
}

async function geocodeSelectedLocation(selectedEntity, autocompleteItem) {
    try {
        var geocodeUrl = geocodeUrlTemplate
            .replace('{selectedEntity}', encodeURIComponent(selectedEntity))
            .replace('{azMapsDomain}', atlas.getDomain());
        
        const json = await processRequest(geocodeUrl, {
            headers: {
                'Accept-Language': 'en-US'
            }
        });

        if (json.features && json.features.length > 0) {
            var result = json.features[0];
            var coordinates = result.geometry.coordinates;
            
            var radius = 0.1;
            var bbox = [
                coordinates[0] - radius,
                coordinates[1] - radius,
                coordinates[0] + radius,
                coordinates[1] + radius
            ];
            
            map.setCamera({
                bounds: bbox,
                padding: 50
            });

            centerMarker.setOptions({
                position: coordinates
            });

            updateListItems();
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
}

function performSearch() {
    var query = document.getElementById('searchTbx').value;
    
    if (!query || query.trim().length === 0) {
        return;
    }

    var camera = map.getCamera();
    var center = camera.center;
    var bbox = camera.bounds;
    
    const normalizeLongitude = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;
    var bboxStr = `${normalizeLongitude(bbox[0])},${bbox[1]},${normalizeLongitude(bbox[2])},${bbox[3]}`;
    
    var autocompleteUrl = geocodeAutocompleteUrlTemplate
        .replace('{query}', encodeURIComponent(query))
        .replace('{azMapsDomain}', atlas.getDomain())
        .replace('{lon}', center[0])
        .replace('{lat}', center[1])
        .replace('{bbox}', bboxStr);

    processRequest(autocompleteUrl, {
        headers: {
            'Accept-Language': 'en-US'
        }
    }).then((autocompleteResponse) => {
        if (Array.isArray(autocompleteResponse.features) && autocompleteResponse.features.length > 0) {
            var firstSuggestion = autocompleteResponse.features[0];
            var selectedEntity = firstSuggestion.properties.address.formattedAddress;
            
            document.getElementById('searchTbx').value = selectedEntity;
            geocodeSelectedLocation(selectedEntity, firstSuggestion);
        }
    });
}

function setMapToUserLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        map.setCamera({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: maxClusterZoomLevel + 1
        });
    }, function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Position information is unavailable.');
                break;
            case error.TIMEOUT:
                alert('The request to get user position timed out.');
                break;
            case error.UNKNOWN_ERROR:
                alert('An unknown error occurred.');
                break;
        }
    });
}

function updateListItems() {
    //Hide the center marker.
    centerMarker.setOptions({
        visible: false
    });

    //Get the current camera/view information for the map.
    var camera = map.getCamera();

    var listPanel = document.getElementById('listPanel');

    //Check to see if the user is zoomed out a lot. If they are, tell them to zoom in closer, perform a search or press the My Location button.
    if (camera.zoom < maxClusterZoomLevel) {
        //Close the popup as clusters may be displayed on the map. 
        popup.close();

        listPanel.innerHTML = '<div class="statusMessage">Search for a location, zoom the map, or press the "My Location" button to see individual locations.</div>';
    } else {
        centerMarker.setOptions({
            position: camera.center,
            visible: true
        });

        var html = [], properties;

        var data = map.layers.getRenderedShapes(map.getCamera().bounds, [iconLayer]);

        var distances = {};

        data.forEach(function (shape) {
            if (shape instanceof atlas.Shape) {
                distances[shape.getId()] = Math.round(atlas.math.getDistanceTo(camera.center, shape.getCoordinates(), 'miles') * 100) / 100;
            }
        });

        //Sort the data by distance.
        data.sort(function (x, y) {
            return distances[x.getId()] - distances[y.getId()];
        });

        data.forEach(function (shape) {
            properties = shape.getProperties();

            html.push('<div class="listItem" onclick="itemSelected(\'', shape.getId(), '\')"><div class="listItem-title">',
                properties['AddressLine'],
                '</div>',

                //Get a formatted address line 2 value that consists of City, Municipality, AdminDivision, and PostCode.
                getAddressLine2(properties),
                '<br />',

                //Convert the closing time into a nicely formated time.
                getOpenTillTime(properties),
                '<br />',

                //Get the distance of the shape.
                distances[shape.getId()],
                ' miles away</div>');
        });
        
        listPanel.innerHTML = html.join('');

        //Scroll to the top of the list panel incase the user has scrolled down.
        listPanel.scrollTop = 0;
    }
}

//This converts a time in 2400 format into an AM/PM time or noon/midnight string.
function getOpenTillTime(properties) {
    var time = properties['Closes'];
    var t = time / 100;

    var sTime;

    if (time === 1200) {
        sTime = 'noon';
    } else if (time === 0 || time === 2400) {
        sTime = 'midnight';
    } else {
        sTime = Math.round(t) + ':';

        //Get the minutes.
        t = (t - Math.round(t)) * 100;

        if (t === 0) {
            sTime += '00';
        } else if (t < 10) {
            sTime += '0' + t;
        } else {
            sTime += Math.round(t);
        }

        if (time < 1200) {
            sTime += ' AM';
        } else {
            sTime += ' PM';
        }
    }

    return 'Open until ' + sTime;
}

function itemSelected(id) {
    var shape = datasource.getShapeById(id);
    showPopup(shape);

    var center = shape.getCoordinates();
    var offset;

    if (map.getCanvas().width < 700) {
        offset = [0, -80];
    }

    map.setCamera({
        center: center,
        centerOffset: offset
    });
}

function showPopup(shape) {
    var properties = shape.getProperties();

    var distance = Math.round(atlas.math.getDistanceTo(map.getCamera().center, shape.getCoordinates(), 'miles') * 100)/100;

    var html = ['<div class="storePopup">'];

    html.push('<div class="popupTitle">',
        properties['AddressLine'],
        '<div class="popupSubTitle">',
        getAddressLine2(properties),
        '</div></div><div class="popupContent">',

        //Convert the closing time into a nicely formated time.
        getOpenTillTime(properties),

        //Add the distance information.  
        '<br/>', distance,
        ' miles away',
        '<br /><img src="/tutorials/simple-store-locator/images/PhoneIcon.png" title="Phone Icon"/><a href="tel:',
        properties['Phone'],
        '">', 
        properties['Phone'],
        '</a>'
    );

    if (properties['IsWiFiHotSpot'] || properties['IsWheelchairAccessible']) {
        html.push('<br/>Amenities: ');

        if (properties['IsWiFiHotSpot']) {
            html.push('<img src="/tutorials/simple-store-locator/images/WiFiIcon.png" title="Wi-Fi Hotspot"/>');
        }

        if (properties['IsWheelchairAccessible']) {
            html.push('<img src="/tutorials/simple-store-locator/images/WheelChair-small.png" title="Wheelchair Accessible"/>');
        }
    }

    html.push('</div></div>');

    popup.setOptions({
        content: html.join(''),
        position: shape.getCoordinates()
    });

    popup.open(map);
}

function getAddressLine2(properties) {
    var html = [properties['City']];

    if (properties['Municipality']) {
        html.push(', ', properties['Municipality']);
    }

    if (properties['AdminDivision']) {
        html.push(', ', properties['AdminDivision']);
    }

    if (properties['PostCode']) {
        html.push(' ', properties['PostCode']);
    }

    return html.join('');
}

//Initialize the application when the page is loaded.
window.onload = initialize;