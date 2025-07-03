var map, dataSource, routeDataSource, routeLine, fromPin, toPin,
    geojson, pathFinder, vertices, selectedMarker;

var snappingTolerance = 1000; //Max distance from a line in meters in which a point will snap to.

//A flag indicating if paths should cross anti-meridian if it is shorter. If true, will calculate a mid-point between the coordinates that crosses the anti-meridian.
var crossAntiMeridian = true;

var geoJsonFiles = {
    '':'',
    'Ipswich (5.9MB)': '/data/geojson/route-networks/Ipswich-Road-Network.json',
    'Montreal (19.4MB)': '/data/geojson/route-networks/montreal_roads.json',
    'Niagra Region (10.7MB)': '/data/geojson/route-networks/niagra_roads.json',
    'San Diego Transit (3MB)': '/data/geojson/route-networks/transit_routes_datasd.geojson',
    'Maritime trade routes (2.2MB)': '/data/geojson/route-networks/maritime-trade-routes.geojson'
};

function getMap() {

    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        view: 'Auto',

                //Add authentication details for connecting to Azure Maps.
                authOptions: {
                    // Use SAS token for authentication 
                    authType: 'sas',
                    getToken: function (resolve, reject, map) {
                        // URL to your authentication service that retrieves a SAS Token
                        var tokenServiceUrl = 'https://samples.azuremaps.com/api/GetAzureMapsSasToken';

                        fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
                    }

                    //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
                    //authType: 'subscriptionKey',
                    //subscriptionKey: '<Your Azure Maps Key>'
                }
    });

    //Wait until the map resources are ready.
    map.events.add('ready', function () {
        //Create a data source and add it to the map.
        dataSource = new atlas.source.DataSource();
        map.sources.add(dataSource);

        map.layers.add(new atlas.layer.LineLayer(dataSource, null, {
            strokeColor: 'rgb(0, 200, 200)',
            strokeWidth: 3
        }), 'labels');
        
        //Create a seperate data source for the route line and end points as these will be updated more frequently.
        routeDataSource = new atlas.source.DataSource();
        map.sources.add(routeDataSource);
       
        map.layers.add(new atlas.layer.LineLayer(routeDataSource, null, {
            strokeColor: 'blue',
            strokeWidth: 5
        }), 'labels');

        //Create draggable HTML markers for the end points. They drag much smoother than symbols. 
        var fromImg = document.createElement('img');
        fromImg.src = '/images/icons/startPin.png';
        fromImg.id = 'from';

        fromPin = new atlas.HtmlMarker({
            draggable: true,
            htmlContent: fromImg,
            position: [0, 0],
            pixelOffset: [0, 0],
            anchor: 'bottom-left'
        });

        fromImg.onmousedown = function () {
            selectedMarker = fromPin;
        };

        map.markers.add(fromPin);

        var toImg = document.createElement('img');
        toImg.src = '/images/icons/endPin.png';
        toImg.id = 'to';        

        toPin = new atlas.HtmlMarker({
            draggable: true,
            htmlContent: toImg,
            position: [0, 0],
            pixelOffset: [0, 0],
            anchor: 'bottom-left'
        });

        toImg.onmousedown = function () {
            selectedMarker = toPin;
        };

        map.markers.add(toPin);

        map.events.add('mouseup', function (e) {
            if (selectedMarker) {
                if (document.getElementById('snapPins').checked) {
                    var snappedPoint = snapToRouteNetwork(selectedMarker.getOptions().position);

                    if (snappedPoint) {
                        selectedMarker.setOptions({ position: snappedPoint.geometry.coordinates });
                    }
                }

                setWaypoint(selectedMarker);

                //Stop tracking the selected marker.
                selectedMarker = null;

                //Calculate a route.
                calculateRoute();
            }
        });
    });

    var html = [];
    Object.keys(geoJsonFiles).forEach(function(val) {
        html.push('<option value="', val, '">', val, '</option>');
    });

    document.getElementById('GeoJsonFiles').innerHTML = html.join('');

    document.getElementById('fileSelector').addEventListener('change', handleFileSelect, false);
}

//Updates the waypoint information in the from/to textboxes.
function setWaypoint(marker) {
    var opt = marker.getOptions();
    var waypointId = opt.htmlContent.id;
    document.getElementById(waypointId + 'Tbx').value = positionToString(opt.position);
}

function reset() {
    routeDataSource.clear();
    dataSource.clear();
    pathFinder = null;
    routeLine = null;
    selectedMarker = null;
    document.getElementById('fromTbx').value = '';
    document.getElementById('toTbx').value = '';
}

//Loads a GeoJSON file of lines and creates a route network.
function loadGeoJSON() {
    reset();
    document.getElementById("fileSelector").value = '';
    document.getElementById('loadingIcon').style.display = '';

    var elm = document.getElementById('GeoJsonFiles');
    var fileId = elm.options[elm.selectedIndex].value;

    var url = geoJsonFiles[fileId];

    if (url && url !== '') {
        //Download the data.
        fetch(url)
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                initNetwork(data);
            });
    } else {
        document.getElementById('loadingIcon').style.display = 'none';
    }
}

function handleFileSelect(e) {
    reset();
    document.getElementById('GeoJsonFiles').selectedIndex = 0;

    document.getElementById('loadingIcon').style.display = '';

    var files = e.target.files;
    if (files.length > 0) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var fc = JSON.parse(e.target.result);

            if (fc.type && fc.type === 'FeatureCollection') {
                initNetwork(fc);
            } else {
                alert('Route network must be a GeoJSON file containing a feature collection of linestrings.');
                document.getElementById('loadingIcon').style.display = 'none';
            }
        };

        reader.onerror = function (e) {
            alert(e);
            document.getElementById('loadingIcon').style.display = 'none';
        };

        reader.readAsText(files[0]);
    }
}

function initNetwork(fc) {
    var features = [];

    //Clean data, and flatten MultiLineStrings into LineStrings.
    for (var i = 0, len = fc.features.length; i < len; i++) {
        if (fc.features[i].geometry.type === 'LineString') {
            features.push(fc.features[i]);
        } else if (fc.features[i].geometry.type === 'MultiLineString') {
            for (var j = 0; j < fc.features[i].geometry.coordinates.length; j++) {
                features.push(new atlas.data.Feature(new atlas.data.LineString(fc.features[i].geometry.coordinates[j])));
            }
        }
    }

    if (features.length === 0) {
        alert('No linestring data found.');
    } else {

        geojson = new atlas.data.FeatureCollection(features);

        //Add the geojson data to the data source.
        dataSource.add(geojson);

        map.setCamera({
            bounds: atlas.data.BoundingBox.fromData(geojson)
        });

        pathFinder = new PathFinder(geojson, {
            precision: 1e-6
        });

        //Store the vertices of the path finder graph as a feature colleciton for fast snapping.l
        var v = pathFinder._graph.vertices;
        vertices = new atlas.data.FeatureCollection(Object.keys(v)
            .filter(function (nodeName) {
                return Object.keys(v[nodeName]).length;
            })
            .map(function (nodeName) {
                var vertice = pathFinder._graph.sourceVertices[nodeName];
                return new atlas.data.Feature(new atlas.data.Point(vertice), {
                    nodeName: nodeName
                });
            }.bind(this)));

        //Set the initial position of the start/end points to the first and last vertices in the route network.
        var vKeys = Object.keys(pathFinder._graph.sourceVertices);

        fromPin.setOptions({ position: pathFinder._graph.sourceVertices[vKeys[0]] });
        setWaypoint(fromPin);

        toPin.setOptions({ position: pathFinder._graph.sourceVertices[vKeys[vKeys.length - 1]] });
        setWaypoint(toPin);

        calculateRoute();
    }

    document.getElementById('loadingIcon').style.display = 'none';
}

//Calculates a route between the from/to positions.
function calculateRoute() {
    if (routeLine && routeDataSource.getShapeById(routeLine.getId())) {
        routeDataSource.remove(routeLine);
        routeLine = null;
    }

    if (!geojson) {
        alert('No route newtork loaded.');
        return;
    }

    var fromPos = parsePosition(document.getElementById('fromTbx').value);
    var toPos = parsePosition(document.getElementById('toTbx').value);

    if (!fromPos) {
        alert('Invalid "From" waypoint.');
        return;
    }

    if (!toPos) {
        alert('Invalid "To" waypoint.');
        return;
    }

    var fromVertice = snapToVertice(fromPos);
    var toVertice = snapToVertice(toPos);

    if (!fromVertice) {
        alert('"From" waypoint too far from route network.');
        return;
    }

    if (!toVertice) {
        alert('"To" waypoint too far from route network.');
        return;
    }

    //Update the route input with the snapped coordinates.
    document.getElementById('fromTbx').value = positionToString(fromPos);
    document.getElementById('toTbx').value = positionToString(toPos);

    var path;

    //Check to see if path should cross anti-meridian.
    if (crossAntiMeridian && Math.abs(fromPos[0] - toPos[0]) > 180) {
        var l1, l2;

        var rightMostPos = toPos;
        var leftMostPos = fromPos;
        var rightVertice = toVertice;
        var leftVertice = fromVertice;

        if (fromPos[0] > toPos[0]) {
            rightMostPos = fromPos;
            leftMostPos = toPos;
            rightVertice = fromVertice;
            leftVertice = toVertice;
        }

        //Wrap the left most coordinate to a value between 180 and 540, then split on anti-meridian.
        var fc = turf.lineSplit(
            //Line to split.
            turf.lineString([rightMostPos, [leftMostPos[0] + 360, leftMostPos[1]]]),

            //Line to split with.
            turf.lineString([[180, 90], [180, -90]]));

        //Handle right most part of path.
        var midPos = fc.features[0].geometry.coordinates[1];
        
        var midVertice1 = snapToNearestMeridianVertice(midPos);

        midPos[0] = -180;

        var midVertice2 = snapToNearestMeridianVertice(midPos);

        if (!midVertice1 && !midVertice2) {
            //Unable to calculate mid point vertice, fallback to standard calculation. 
            calculateSimplePath(fromVertice, toVertice, fromPos, toPos);
            return;
        }

        path = pathFinder.findPath(rightVertice, midVertice1);

        if (path) {
            l1 = createRouteLine(path.path, rightMostPos, midPos, false, true);
        }

        path = pathFinder.findPath(midVertice2, leftVertice);

        if (path) {
            l2 = createRouteLine(path.path, midPos, leftMostPos, true, false);
        }

        if (l1 && l2) {
            var path1 = l1.getCoordinates();    //Ends with longitude of 180.
            var path2 = l2.getCoordinates();    //Starts with longitude of -180.

            //Ensure the ends of the lines meet at an average latitude on the anti-meridian.
            var avgLat = (path1[path1.length - 1][1] + path2[0][1]) / 2;
            
            path1.push([180, avgLat]);
            path2.unshift([-180, avgLat]);
            
            //Create a multi-linestring from the two lines.
            routeLine = new atlas.Shape(new atlas.data.MultiLineString([
                path1, path2
            ]));

            routeDataSource.add(routeLine);
        } else {
            //Unable to calculate path, fallback to standard calculation. 
            calculateSimplePath(fromVertice, toVertice, fromPos, toPos);
        }
    } else {
        calculateSimplePath(fromVertice, toVertice, fromPos, toPos);
    }
}

//Calculate a path, ignore anti-meridian.
function calculateSimplePath(fromVertice, toVertice, fromPos, toPos) {
    var path = pathFinder.findPath(fromVertice, toVertice);

    if (path) {
        routeDataSource.add(createRouteLine(path.path, fromPos, toPos));
    }
}

//Snaps a position to the route network. 
//Tolerance is a min distance in meters that point needs to be away from a line in order for it to be allowed to snap.
function snapToRouteNetwork(position, tolerance) {
    tolerance = tolerance || snappingTolerance;

    if (geojson) {
        var minDistance = Infinity;
        var nearestLine = null;

        //Create a very simple circle around the position to create a tolerance area. 
        var toleranceArea = turf.circle(position, tolerance, { units: 'meters', steps: 4 });

        //Find the line that is closest to the position.
        for (var i = 0, len = geojson.features.length; i < len; i++) {
            //Filter out lines that don't cross the tolerance area. 
            if (turf.booleanCrosses(toleranceArea, geojson.features[i])) {

                //Calculate the distance from the position to the line to find the closest line.
                var d = turf.pointToLineDistance(position, geojson.features[i], { units: 'meters' });
                if (d < minDistance) {
                    minDistance = d;
                    nearestLine = geojson.features[i];
                }
            }
        }
      
        if (nearestLine) {
            //Calculate the actual point on the nearest line to snap to.
            return turf.nearestPointOnLine(nearestLine, position, { units: 'meters' });
        }
    }

    return null;
}

//Finds the closest vertice in the route network to a position.
function snapToVertice(position) {
    if (vertices) {
        return turf.nearestPoint(new atlas.data.Point(position), vertices);
    }

    return null;
}

//Finds the closest vertice in the route network to a position, but on the correct side of the anti-meridian.
function snapToNearestMeridianVertice(position) {
    if (vertices) {
        var minDis = Number.MAX_VALUE, d, closestVertice = null, p;

        var isNeg = position[0] < 0;

        for (var i = 0, len = vertices.features.length; i < len; i++) {
            p = vertices.features[i].geometry.coordinates;

            //Only look at positions that are on the same longitudinal hemisphere (positive or negative).
            if ((isNeg && p[0] < -179.9) || (!isNeg && p[0] >= 179.9)) {
                d = atlas.math.getDistanceTo(position, p);

                if (d < minDis) {
                    closestVertice = vertices.features[i];
                    minDis = d;
                }
            }
        }

        if (!closestVertice) {
            return snapToVertice(position);
        }
        
        return closestVertice;
    }

    return null;
}

//Creates a route line from the path information. 
//Tries to clip / extend the line such that it aligns with the from / to positions. 
function createRouteLine(path, fromPoint, toPoint, skipFromSnapping, skipToSnapping) {

    if (path.length === 0) {
        return new atlas.data.LineString([fromPoint, toPoint]);
    } else if (path.length === 1) {
        var b1 = turf.bearing(fromPoint, path[0]);
        var b2 = turf.bearing(toPoint, path[0]);

        if (Math.abs(b1 - b2) < 5) {
            path = [fromPoint, toPoint];
        } else {
            path = [fromPoint, path[0], toPoint];
        }
    }

    var line = new atlas.data.LineString(path);
    var buffer = turf.buffer(line, 1, { units: 'meters' });
    var d1, d2;

    if (!skipFromSnapping && turf.pointsWithinPolygon([fromPoint], buffer).features.length === 0) {
        d1 = turf.distance(fromPoint, path[0]);
        d2 = turf.distance(fromPoint, path[path.length - 1]);

        if (d1 !== 0 && d2 !== 0) {
            if (d1 < d2) {
                path.splice(0, 0, fromPoint);
            } else {
                path.push(fromPoint);
            }
        }
    }

    if (!skipToSnapping && turf.pointsWithinPolygon([toPoint], buffer).features.length === 0) {
        d1 = turf.distance(toPoint, path[0]);
        d2 = turf.distance(toPoint, path[path.length - 1]);

        if (d1 !== 0 && d2 !== 0) {
            if (d1 < d2) {
                path.splice(0, 0, toPoints);
            } else {
                path.push(toPoint);
            }
        }
    }

    routeLine = new atlas.Shape(turf.lineSlice(fromPoint, toPoint, new atlas.data.LineString(path)));
    return routeLine;
}

//Converts a position into a string with 6 decimal places at most.
function positionToString(position) {
    if (position.geometry) {
        position = position.geometry.coordinates;
    }

    return Math.round(position[0] * 100000) / 100000 + ',' + Math.round(position[1] * 100000) / 100000;
}

//Parses a position value from a string.
function parsePosition(posString) {
    var v = posString.split(/\s*,\s*/);

    if (v.length >= 2) {
        return [parseFloat(v[0]), parseFloat(v[1])];
    }

    return null;
}

window.onload = getMap;

//TODO: 
// - split out route code into seperate class to make more reusable. 
// - Use spatial IO module to support more file formats.