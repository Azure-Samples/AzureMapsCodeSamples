var map, dataSource, routeDataSource, routeLine, fromPin, toPin,
    geojson, pathFinder, vertices, selectedMarker;

var snappingTolerance = 1000; //Max distance from a line in meters in which a point will snap to.

var geoJsonFiles = {
    '':'',
    'Ipswich (10.7MB)': '/Common/data/geojson/route-networks/Ipswich Road Network.geojson',
    'Montreal (32.5MB)': '/Common/data/geojson/route-networks/montreal_roads.json',
    'Niagra Region (18MB)': '/Common/data/geojson/route-networks/niagra_roads.json',
    'San Diego Transit (3.7MB)': '/Common/data/geojson/route-networks/transit_routes_datasd.geojson',
    'Martime trade routes (600kb)': '/Common/data/geojson/route-networks/maritime-trade-routes.geojson'
};

function GetMap() {

    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        view: 'Auto',

        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '<Your Azure Maps Key>'
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
        fromImg.src = '/Common/images/icons/startPin.png';
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
        toImg.src = '/Common/images/icons/endPin.png';
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
}

//Updates the waypoint information in the from/to textboxes.
function setWaypoint(marker) {
    var opt = marker.getOptions();
    var waypointId = opt.htmlContent.id;
    document.getElementById(waypointId + 'Tbx').value = positionToString(opt.position);
}

//Loads a GeoJSON file of lines and creates a route network.
function loadGeoJSON() {
    routeDataSource.clear();
    dataSource.clear();
    pathFinder = null;
    routeLine = null;
    selectedMarker = null;
    document.getElementById('fromTbx').value = '';
    document.getElementById('toTbx').value = '';

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
                geojson = data;

                //Add the geojson data to the data source.
                dataSource.add(data);

                map.setCamera({
                    bounds: atlas.data.BoundingBox.fromData(geojson)
                })

                pathFinder = new PathFinder(data, {
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
                                
                document.getElementById('loadingIcon').style.display = 'none';

                calculateRoute();
            });
    } else {
        document.getElementById('loadingIcon').style.display = 'none';
    }
}

//Calculates a route between the from/to positions.
function calculateRoute() {
    if (routeLine) {
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

    var path = pathFinder.findPath(fromVertice, toVertice);

    if (path) {
        routeDataSource.add(createRouteLine(path.path, fromVertice, toVertice, fromPos, toPos));
    }
}

//Snaps a position to the route network. 
//Tolerance is a min distance in meters that point needs to be away from a line in order for it to be allowed to snap.
function snapToRouteNetwork(position, tolerance) {
    var nearestPoint = null;
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
}

//Creates a route line from the path information. 
//Tries to clip / extend the line such that it aligns with the from / to positions. 
function createRouteLine(path, fromVertice, toVertice, fromPoint, toPoint) {
    var pos;

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

    if (turf.pointsWithinPolygon([fromPoint], buffer).features.length === 0) {
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

    if (turf.pointsWithinPolygon([toPoint], buffer).features.length === 0) {
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

window.onload = GetMap;