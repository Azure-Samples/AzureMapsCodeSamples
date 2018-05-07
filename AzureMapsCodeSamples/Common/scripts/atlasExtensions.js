/// <reference path="../../Common/types/atlas.d.ts" />
var atlas;
(function (atlas) {
    var layerIdCounter = 0;
    var shapeIdCounter = 0;
    function _layerIdGenerator() {
        return 'layer_' + (layerIdCounter++);
    }
    function _shapeIdGenerator() {
        return 'shape_' + (shapeIdCounter++);
    }
    var ShapeLayer = /** @class */ (function () {
        /**
         * @constructor
         * @param options Shape layer options used for rendering.
         */
        function ShapeLayer(options) {
            this._options = {
                minZoom: 0,
                maxZoom: 22
            };
            this._shapes = [];
            this._id = _layerIdGenerator();
            this._geojson = new atlas.data.FeatureCollection([]);
        }
        /**
         * Adds shapes to the layer.
         * @param shapes The shapes to be added to the layer.
         */
        ShapeLayer.prototype.addShapes = function (shapes) {
            if (shapes && shapes instanceof Array && shapes.length > 0) {
            }
        };
        /**
         * Adds features to the layer.
         * @param features The features to be added to the layer.
         */
        ShapeLayer.prototype.addFeatures = function (features) {
            if (features && features instanceof Array && features.length > 0) {
                for (var i = 0, len = features.length; i < len; i++) {
                    switch (features[i].type) {
                        case 'FeatureCollection':
                            this._geojson.features = this._geojson.features.concat(features[i].features);
                            break;
                        case 'Feature':
                            this._geojson.features.push(features[i]);
                            break;
                        case 'Point':
                        case 'LineString':
                        case 'Polygon':
                        case 'MultiPoint':
                        case 'MultiLineString':
                        case 'MultiPolygon':
                        case 'GeometryCollection':
                            this._geojson.features.push(new atlas.data.Feature(features[i]));
                            break;
                    }
                }
                this._shapeUpdated();
            }
        };
        /**
         * Clears all the shapes from the layer.
         */
        ShapeLayer.prototype.clear = function () {
            this._shapes = [];
            this._geojson.features = [];
            this._geojson.bbox = null;
            this._shapeUpdated();
        };
        /**
         * Cleans up any resources this object is consuming
         */
        ShapeLayer.prototype.dispose = function () {
            this.clear();
            //TODO: remove layer from map.
            this._setMap(null);
            this._shapes = null;
            this._geojson = null;
            this._options = null;
            this._map = null;
            this._id = null;
        };
        /**
        * Gets an array of shapes that are in the layer. This can be used to iterate over the individual shapes.
        * @returns An array of shapes that are in the layer.
        */
        ShapeLayer.prototype.getShapes = function () {
            return this._shapes;
        };
        /**
         * Gets the options used by the shape layer.
         * @returns The options used by the shape layer.
         */
        ShapeLayer.prototype.getOptions = function () {
            return this._options;
        };
        /**
         * Removes a shape(s) from the layer.
         * @param shape The shape(s) that needs to be removed.
         */
        ShapeLayer.prototype.remove = function (shape) {
            if (shape) {
                var ids = [];
                //Generate an array of shape ids to remove.
                if (shape instanceof Array) {
                    for (var i = 0, len = shape.length; i < len; i++) {
                        ids.push(shape[i]._getId());
                    }
                }
                else {
                    ids.push(shape._getId());
                }
                if (ids.length > 0) {
                    this._shapes.filter(function (val) {
                        return ids.indexOf(val._getId()) >= 0;
                    });
                    this._geojson.features.filter(function (val) {
                        return ids.indexOf(val.id) >= 0;
                    });
                    //Update rendering.
                    this._shapeUpdated();
                }
            }
            return null;
        };
        /**
         * Sets whether the layer is visible or not.
         * @param value A value indicating if the layer should be displayed or not.
         */
        ShapeLayer.prototype.setOptions = function (options) {
        };
        ShapeLayer.prototype._setMap = function (map) {
            if (map) {
                this._map.map.addSource(this._id, {
                    type: 'geojson',
                    data: this._geojson
                });
            }
            else if (this._map) {
                this._map.map.removeSource(this._id);
                this._map = null;
            }
        };
        ShapeLayer.prototype._shapeUpdated = function () {
            var s = this._map.map.getSource(this._id);
            if (s) {
                s.setData(this._geojson);
            }
        };
        ShapeLayer.prototype._shapePaintUpdated = function () {
        };
        ShapeLayer.prototype._updateShapeRendering = function (shape) {
            //map.getSource('trace').setData(data);
        };
        return ShapeLayer;
    }());
    atlas.ShapeLayer = ShapeLayer;
    var Circle = /** @class */ (function () {
        function Circle(center, radius, properties) {
            this._id = _layerIdGenerator();
            this._center = center;
            this._radius = radius;
            this._properties = properties;
        }
        /** An internal function for accessing the internal id of the shape. */
        Circle.prototype._getId = function () {
            return this._id;
        };
        Circle.prototype.getCenter = function () {
            return this._center;
        };
        Circle.prototype.getRadius = function () {
            return this._radius;
        };
        //TODO: add getters
        Circle.prototype.toJson = function () {
            throw new Error("Method not implemented.");
        };
        return Circle;
    }());
    atlas.Circle = Circle;
    var Polygon = /** @class */ (function () {
        function Polygon(rings, radius, properties) {
            var id = _layerIdGenerator();
            this._geoJson = new atlas.data.Feature(new atlas.data.Polygon(properties), properties, id);
        }
        Polygon.prototype.getRings = function () {
            return (this._geoJson.geometry).coordinates;
        };
        Polygon.prototype.setRings = function (rings) {
            (this._geoJson.geometry).coordinates = rings;
            this._updateRendering();
        };
        //TODO: add getters
        Polygon.prototype.toJson = function () {
            return;
        };
        /** An internal function for accessing the internal id of the shape. */
        Polygon.prototype._getId = function () {
            return this._geoJson.id;
        };
        Polygon.prototype._setShapeLayer = function (layer) {
            this._shapeLayer = layer;
        };
        Polygon.prototype._updateRendering = function () {
            if (this._shapeLayer) {
                this._shapeLayer._updateShapeRendering(this);
            }
        };
        return Polygon;
    }());
    atlas.Polygon = Polygon;
    var utils;
    (function (utils) {
        /**
         * A set of useful common spatial math calculations. For more advance spatial math operations, consider using [Turf.js](http://turfjs.org/docs#distance).
         */
        var SpatialMath;
        (function (SpatialMath) {
            //////////////////////
            /// Constants
            //////////////////////
            /**
            * Earth Radius Semi Major Axis in meters
            **/
            var EARTH_RADIUS_SEMI_MAJOR_AXIS = 6378137;
            /**
            * A constant for Math.PI/180. Using this constant is upto 3 times faster than always doing the calculation.
            **/
            var PI_BY_180 = Math.PI / 180;
            /**
            * A constant for 180 / Math.PI. Using this constant is upto 3 times faster than always doing the calculation.
            **/
            var INV_PI_BY_180 = 180 / Math.PI;
            //////////////////////
            /// Private Functions
            //////////////////////
            /**
            * Converts an angle that is in degrees to radians. Angle * (PI / 180).
            * @param angle An angle in degrees.
            * @returns An angle in radians.
            **/
            function _toRadians(angle) {
                return angle * PI_BY_180;
            }
            /**
            * Converts an angle that is in radians to degress. Angle * (180 / PI).
            * @param angle An angle in radians.
            * @returns An angle in degrees.
            **/
            function _toDegrees(angle) {
                return angle * INV_PI_BY_180;
            }
            /**
            * Clips a number to the specified minimum and maximum values.
            * @param val The number to clip.
            * @param minValue Minimum allowable value.
            * @param maxValue Maximum allowable value.
            * @returns The clipped value.
            **/
            function _clip(val, minValue, maxValue) {
                return Math.min(Math.max(val, minValue), maxValue);
            }
            /**
             * Normalizes a number in the range of a polar coordinate between some -maxValue and maxValue.
             * @param val
             * @param maxValue The maximum value in the range -maxValue to maxValue.
             * @returns A nromailzed polar number between some -maxValue and maxValue.
             */
            function _normalizePolar(val, maxValue) {
                return val > maxValue ? ((val + maxValue) % (maxValue + maxValue)) - maxValue :
                    val < -maxValue ? ((val - maxValue) % (maxValue + maxValue)) + maxValue :
                        val;
            }
            /**
            * Calculates geodetic distance between two Position objects using Haversine forumla in meters.
            * @param origin Position to calculate distance from.
            * @param destination Position to calculate distance to.
            * @returns A distance in meters between the two positions.
            **/
            function _haversineDistance(origin, destination) {
                //https://en.wikipedia.org/wiki/Haversine_formula
                var dLat = _toRadians(destination[1] - origin[1]), dLon = _toRadians(destination[0] - origin[0]);
                var a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(_toRadians(origin[1])) * Math.cos(_toRadians(destination[1])) * Math.pow(Math.sin(dLon / 2), 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return Math.round(EARTH_RADIUS_SEMI_MAJOR_AXIS * c * 100) / 100; //Round to 1cm percision.
            }
            /**
             * Normailzes a distance unit string. Defaults to meters.
             * @param units The distance units to normalize.
             * @returns A normailzed distance unit string.
             */
            function _normailizeDistanceUnit(units) {
                if (units) {
                    switch (units.toLowerCase()) {
                        case 'feet':
                        case 'foot':
                        case 'ft':
                            return 'feet';
                        case 'kilometers':
                        case 'kilometer':
                        case 'kilometres':
                        case 'kilometre':
                        case 'km':
                        case 'kms':
                            return 'kilometers';
                        case 'miles':
                        case 'mile':
                        case 'mi':
                            return 'miles';
                        case 'nauticalmiles':
                        case 'nauticalmile':
                        case 'nms':
                        case 'nm':
                            return 'nauticalMiles';
                        case 'yards':
                        case 'yard':
                        case 'yds':
                        case 'yrd':
                        case 'yrds':
                            return 'yards';
                        case 'meters':
                        case 'metres':
                        case 'm':
                        default:
                            return 'meters';
                    }
                }
            }
            //////////////////////
            /// Public Methods
            //////////////////////
            /**
            * Converts a distance from one distance units to another. Supported units: miles, nauticalMiles, yards, meters, kilometers, feet
            * @param distance A number that represents a distance to convert.
            * @param fromUnits The distance units the original distance is in.
            * @param toUnits The disired distance units to convert to.
            * @param decimals Specifies the number of decimal places to round the result to. If undefined, no rounding will occur.
            * @returns A distance in the new units.
            **/
            function convertDistance(distance, fromUnits, toUnits, decimals) {
                //Convert the distance to kilometers
                switch (_normailizeDistanceUnit(fromUnits)) {
                    case 'meters':
                        distance /= 1000;
                        break;
                    case 'feet':
                        distance /= 3280.8399;
                        break;
                    case 'miles':
                        distance /= 0.62137119;
                        break;
                    case 'yards':
                        distance /= 1093.6133;
                        break;
                    case 'nauticalMiles':
                        distance /= 0.5399568;
                        break;
                    case 'kilometers':
                        break;
                }
                //Convert from kilometers to output distance unit
                switch (_normailizeDistanceUnit(toUnits)) {
                    case 'meters':
                        distance *= 1000;
                        break;
                    case 'feet':
                        distance *= 3280.8399;
                        break;
                    case 'miles':
                        distance *= 0.62137119;
                        break;
                    case 'yards':
                        distance *= 1093.6133;
                        break;
                    case 'nauticalMiles':
                        distance *= 0.5399568;
                        break;
                    case 'kilometers':
                        break;
                }
                if (typeof decimals === 'number' && decimals >= 0) {
                    var power = Math.pow(10, decimals);
                    distance = Math.round(distance * power) / power;
                }
                return distance;
            }
            SpatialMath.convertDistance = convertDistance;
            /**
             * Calculates an array of positions that form a cardinal spline between the specified array of positions.
             * @param positions The array of positions to calculate the spline through.
             * @param tension A number that indicates the tightness of the curve. Can be any number, although a value between 0 and 1 is usually used. Default: 0.5
             * @param nodeSize Number of nodes to insert between each position. Default: 15
             * @param close A boolean indicating if the spline should be a closed ring or not. Default: false
             * @returns An array of positions that form a cardinal spline between the specified array of positions.
             */
            function getCardinalSpline(positions, tension, nodeSize, close) {
                //Resources:
                //http://www.cubic.org/docs/hermite.htm
                //http://codeplea.com/introduction-to-splines
                //https://msdn.microsoft.com/en-us/library/windows/desktop/ms536358(v=vs.85).aspx
                if (!positions || positions.length <= 2) {
                    return locs;
                }
                if (typeof tension !== 'number') {
                    tension = 0.5;
                }
                if (typeof nodeSize !== 'number' || nodeSize <= 0) {
                    nodeSize = 15;
                }
                //Get the number of locations the spline passs through.
                var len = positions.length;
                //Create a copy of the array of locations so that we don't alter the original array.
                var locs = positions.slice(0);
                //Add additional locations to array so that tangents can be calculated for end points.
                if (close) {
                    //If the location array forms a closed ring, remove the last location.
                    if (atlas.data.Position.areEqual(locs[0], locs[len - 1])) {
                        locs.pop();
                        len--;
                    }
                    //Insert the last coordinate as the first point.
                    locs.unshift(positions[len - 1]);
                    //Add the first two points to the end of the array. 
                    locs.push(positions[0]);
                    locs.push(positions[1]);
                    //Increase index so that spline wraps back around to starting location.
                    len++;
                }
                else {
                    //In this case the spline is not closed, so tanget of end points will be 0.
                    //Buffer the end-points so that tanget calculations can be performed.
                    locs.unshift(positions[0]);
                    locs.push(positions[len - 1]);
                }
                //Precalculate the hermite basis function steps along the spline. 
                var hermiteSteps = [];
                //Force the first step between two locations to be the first location.
                hermiteSteps.push([1, 0, 0, 0]);
                var step;
                var step2;
                var step3;
                //Calculate the steps along the spline between two locations.
                for (var i = 1; i < nodeSize - 1; i++) {
                    step = i / nodeSize; //Scale step to go from 0 to 1.
                    step2 = step * step; //s^2
                    step3 = step * step2; //s^3
                    hermiteSteps.push([
                        2 * step3 - 3 * step2 + 1,
                        -2 * step3 + 3 * step2,
                        step3 - 2 * step2 + step,
                        step3 - step2
                    ]); //Calculate hermite basis function 4.
                }
                //Force the last step between two locations to be the last location.
                hermiteSteps.push([0, 1, 0, 0]);
                var splineLocs = [];
                var hermiteStep;
                //Tangents
                var t1x;
                var t1y;
                var t2x;
                var t2y;
                var lat;
                var lon;
                //Loop through and calculate the spline path between each location pair. 
                for (var i = 1; i < len; i++) {
                    t1x = tension * (locs[i + 1][0] - locs[i - 1][0]);
                    t1y = tension * (locs[i + 1][1] - locs[i - 1][1]);
                    t2x = tension * (locs[i + 2][0] - locs[i][0]);
                    t2y = tension * (locs[i + 2][1] - locs[i][1]);
                    for (step = 0; step < nodeSize; step++) {
                        hermiteStep = hermiteSteps[step];
                        lon = hermiteStep[0] * locs[i][0] + hermiteStep[1] * locs[i + 1][0] + hermiteStep[2] * t1x + hermiteStep[3] * t2x;
                        lat = hermiteStep[0] * locs[i][1] + hermiteStep[1] * locs[i + 1][1] + hermiteStep[2] * t1y + hermiteStep[3] * t2y;
                        lat = _clip(lat, -85, 85);
                        splineLocs.push([lon, lat]);
                    }
                }
                return splineLocs;
            }
            SpatialMath.getCardinalSpline = getCardinalSpline;
            /**
            * Calculates a destination position based on a starting position, a heading, a distance, and a distance unit type.
            * @param origin Position that the destination is relative to.
            * @param heading A heading angle between 0 - 360 degrees. 0 - North, 90 - East, 180 - South, 270 - West.
            * @param distance Distance that destination is away.
            * @param units Unit of distance measurement. Default is meters.
            * @returns A position that is the specified distance away from the origin.
            **/
            function getDestination(origin, heading, distance, units) {
                units = units || 'meters';
                var radius = getEarthRadius(units);
                heading = _normalizePolar(heading, 180) + 180;
                //convert latitude, longitude and heading into radians
                var latRad = _toRadians(origin[1]);
                var lonRad = _toRadians(origin[0]);
                var headingRad = _toRadians(heading);
                var centralAngle = distance / radius;
                var desLatRad = Math.asin(Math.sin(latRad) * Math.cos(centralAngle) + Math.cos(latRad) * Math.sin(centralAngle) * Math.cos(headingRad));
                var desLonRad = lonRad + Math.atan2(Math.sin(headingRad) * Math.sin(centralAngle) * Math.cos(latRad), Math.cos(centralAngle) - Math.sin(latRad) * Math.sin(desLatRad));
                var lat = _clip(_toDegrees(desLatRad), -85, 85);
                var lon = _clip(_toDegrees(desLonRad), -180, 180);
                return [lon, lat];
            }
            SpatialMath.getDestination = getDestination;
            /**
            * Calculate the distance between two position objects on the surface of the earth using the Haversine formula.
            * @param origin First position to calculate distance between.
            * @param destination Second position to calculate distance between.
            * @param units Unit of distance measurement. Default is meters.
            * @returns The shortest distance between two positions in the specifed units.
            **/
            function getDistanceTo(origin, destination, units) {
                var d = _haversineDistance(origin, destination);
                return convertDistance(d, 'meters', units || 'meters');
            }
            SpatialMath.getDistanceTo = getDistanceTo;
            /**
            * Retrieves the radius of the earth in a specific distance unit for WGS84.
            * @param units Unit of distance measurement. Default: meters
            * @returns A number that represents the radius of the earth in a specific distance unit.
            **/
            function getEarthRadius(units) {
                switch (units) {
                    case 'feet':
                        return convertDistance(EARTH_RADIUS_SEMI_MAJOR_AXIS, 'meters', 'feet');
                    case 'kilometers':
                        return EARTH_RADIUS_SEMI_MAJOR_AXIS / 1000;
                    case 'miles':
                        return convertDistance(EARTH_RADIUS_SEMI_MAJOR_AXIS, 'meters', 'miles');
                    case 'nauticalMiles':
                        return convertDistance(EARTH_RADIUS_SEMI_MAJOR_AXIS, 'meters', 'nauticalMiles');
                    case 'yards':
                        return convertDistance(EARTH_RADIUS_SEMI_MAJOR_AXIS, 'meters', 'yards');
                    case 'meters':
                    default:
                        return EARTH_RADIUS_SEMI_MAJOR_AXIS;
                }
            }
            SpatialMath.getEarthRadius = getEarthRadius;
            /**
            * Takes an array of positions objects and fills in the space between them with accurately positioned positions to form an approximated Geodesic path.
            * @param path Array of position objects that form a path to fill in.
            * @param nodeSize Number of nodes to insert between each position. Default: 15
            * @returns An array of position objects that form a geodesic paths.
            **/
            function getGeodesicPath(path, nodeSize) {
                if (!nodeSize || nodeSize <= 0) {
                    nodeSize = 15;
                }
                var locs;
                if (path instanceof Array) {
                    locs = path;
                }
                else if (path.type && path.type === 'LineString') {
                    locs = path.coordinates;
                }
                var len = locs.length - 1;
                var outputLocs = [];
                var dx, heading;
                var lat1 = _toRadians(locs[0][1]);
                var lon1 = _toRadians(locs[0][0]);
                var lat2 = _toRadians(locs[1][1]);
                var lon2 = _toRadians(locs[1][0]);
                for (var i = 0; i < len; i++) {
                    // Convert positions from degrees to Radians           
                    lat1 = lat2;
                    lon1 = lon2;
                    lat2 = _toRadians(locs[i + 1][1]);
                    lon2 = _toRadians(locs[i + 1][0]);
                    // Calculate the total extent of the route           
                    var d = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin((lon1 - lon2) / 2)), 2)));
                    // Calculate positions at fixed intervals along the route
                    for (var k = 0; k <= nodeSize; k++) {
                        var f = (k / nodeSize);
                        var A = Math.sin((1 - f) * d) / Math.sin(d);
                        var B = Math.sin(f * d) / Math.sin(d);
                        // Obtain 3D Cartesian coordinates of each point             
                        var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
                        var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
                        var z = A * Math.sin(lat1) + B * Math.sin(lat2);
                        // Convert these to latitude/longitude             
                        var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                        var lon = Math.atan2(y, x);
                        // Add this to the array             
                        outputLocs.push([_toDegrees(lon), _toDegrees(lat)]);
                    }
                }
                return outputLocs;
            }
            SpatialMath.getGeodesicPath = getGeodesicPath;
            /**
            * Calculates the heading from one position object to another.
            * @param origin Point of origin.
            * @param destination Destination to calculate relative heading to.
            * @returns A heading in degrees between 0 and 360. 0 degrees points due North.
            **/
            function getHeading(origin, destination) {
                if (origin && origin.length >= 2 && destination && destination.length >= 2) {
                    var radianLat1 = _toRadians(origin[1]), radianLat2 = _toRadians(destination[1]), dLon = _toRadians(destination[0] - origin[0]);
                    var dy = Math.sin(dLon) * Math.cos(radianLat2);
                    var dx = Math.cos(radianLat1) * Math.sin(radianLat2) - Math.sin(radianLat1) * Math.cos(radianLat2) * Math.cos(dLon);
                    return (_toDegrees(Math.atan2(dy, dx)) + 360) % 360;
                }
                return NaN;
            }
            SpatialMath.getHeading = getHeading;
            /**
            * Calculates the distance between all position objects in an array.
            * @param path The array of position objects that make up the path to calculate the length of.
            * @param units Unit of distance measurement. Default: meters
            * @returns The distance between all positions in between all position objects in an array on the surface of a earth in the specifed units.
            **/
            function getLengthOfPath(path, units) {
                var totalLength = 0;
                var locs;
                if (path instanceof Array) {
                    locs = path;
                }
                else if (path.type && path.type === 'LineString') {
                    locs = path.coordinates;
                }
                for (var i = 0, len = locs.length - 1; i < len; i++) {
                    totalLength += _haversineDistance(path[i], path[i + 1]);
                }
                return convertDistance(totalLength, 'meters', units || 'meters');
            }
            SpatialMath.getLengthOfPath = getLengthOfPath;
            /**
            * Calculates the position object on a path that is a specified distance away from the start of the path. If the specified distance is longer
            * than the length of the path, the last position of the path will be returned.
            * @param path A polyline or array of position cooridnates that form a path.
            * @param distance The distance along the path (from the start) to calculate the position for.
            * @param units Unit of distance measurement. Default is meters.
            * @returns A position object that is the specified distance away from the start of the path when following the path.
            **/
            function getPositionAlongPath(path, distance, units) {
                units = units || 'meters';
                var travelled = 0;
                var dx;
                var locs;
                if (path instanceof Array) {
                    locs = path;
                }
                else if (path.type && path.type === 'LineString') {
                    locs = path.coordinates;
                }
                if (locs.length >= 2) {
                    for (var i = 1, len = locs.length; i < len; i++) {
                        dx = getDistanceTo(locs[i - 1], locs[i], units);
                        if (travelled + dx >= distance) {
                            //Overshot
                            var heading = getHeading(locs[i - 1], locs[i]);
                            return getDestination(locs[i - 1], heading, distance - travelled, units);
                        }
                        travelled += dx;
                    }
                    if (distance >= travelled) {
                        return locs[len - 1];
                    }
                    return locs[0];
                }
                return null;
            }
            SpatialMath.getPositionAlongPath = getPositionAlongPath;
            /**
            * Calculates an array of position objects that are an equal distance away from a central point to create a regular polygon.
            * @param origin Center of the regular polygon.
            * @param radius Radius of the regular polygon.
            * @param numberOfPositions Number of positions the polygon should have.
            * @param units Unit of distance measurement. Default is meters.
            * @param offset An offset to rotate the polygon. When 0 the first position will align with North.
            * @returns An array of position objects that form a regular polygon.
            **/
            function getRegularPolygonPath(origin, radius, numberOfPositions, units, offset) {
                units = units || 'meters';
                offset = (offset) ? offset : 0;
                var points = [];
                var centralAngle = 360 / numberOfPositions;
                for (var i = 0; i <= numberOfPositions; i++) {
                    points.push(getDestination(origin, (i * centralAngle + offset) % 360, radius, units));
                }
                //Close the polygon ring.
                if (points.length > 0) {
                    points.push([points[0], points[1]]);
                }
                return points;
            }
            SpatialMath.getRegularPolygonPath = getRegularPolygonPath;
            /**
            * Calculates a position object that is a fractional distance between two position objects.
            * @param origin First position to calculate mid-point between.
            * @param destination Second position to calculate mid-point between.
            * @param fraction The fractional parameter to calculate a mid-point for. Default 0.5.
            * @returns A position that lies a fraction of the distance between two position objects, relative to the first position object.
            **/
            function interpolate(origin, destination, fraction) {
                fraction = (typeof fraction === 'undefined') ? 0.5 : fraction;
                var arcLength = getDistanceTo(origin, destination, 'kilometees');
                var brng = getHeading(origin, destination);
                return getDestination(origin, brng, arcLength * fraction, 'kilometees');
            }
            SpatialMath.interpolate = interpolate;
            /**
            * Normalizes a latitude value between -85 and 85 degrees.
            * @param lat The latitude value to normalize.
            */
            function normalizeLatitude(lat) {
                return this.normalize(lat, 85);
            }
            SpatialMath.normalizeLatitude = normalizeLatitude;
            /**
            * Normalizes a longitude value between -180 and 180 degrees.
            * @param lng The longitude value to normalize.
            */
            function normalizeLongitude(lng) {
                return this.normalize(lng, 180);
            }
            SpatialMath.normalizeLongitude = normalizeLongitude;
        })(SpatialMath = utils.SpatialMath || (utils.SpatialMath = {}));
        //TODO: Provide a web work option for better performance.
        var TestDataGenerator;
        (function (TestDataGenerator) {
            function _processBoundingBox(bounds) {
                if (bounds && bounds instanceof Array && (bounds.length === 4 || bounds.length === 6)) {
                    return bounds;
                }
                //return 2d world bounds: [minLon, minLat, maxLon, maxLat]
                //Clip latitude to 85 degrees as many mercator math calculations grow become less accurate and fail as you approach 90 degrees.
                return [-180, -85, 180, 85];
            }
            function _getRandomPosition(bounds) {
                var south = bounds[1];
                var west = bounds[0];
                var height = atlas.data.BoundingBox.getHeight(bounds);
                var width = atlas.data.BoundingBox.getWidth(bounds);
                var minAltitude = 0;
                var altitudeDiff;
                if (bounds.length >= 6) {
                    minAltitude = bounds[2];
                    altitudeDiff = bounds[5] - bounds[2];
                }
                var lat = atlas.utils.SpatialMath.normalizeLatitude(Math.random() * height + south);
                var lon = atlas.utils.SpatialMath.normalizeLongitude(Math.random() * width + west);
                if (!isNaN(altitudeDiff)) {
                    return [lon, lat, minAltitude + altitudeDiff];
                }
                return [lon, lat];
            }
            function _generateSimplePolygonPoints(centerPoint, maxRadius, size) {
                var locs = [];
                var centralAngle = 360 / size;
                var offset = 360 * Math.random();
                //Count backwards. This will generate points that are in CCW rotation which is OGC compliant.
                for (var i = size; i > 0; i--) {
                    locs.push(_calculateCoord(centerPoint, (i * centralAngle + offset) % 360, maxRadius * Math.max(Math.random(), 0.3)));
                }
                return locs;
            }
            function _generateHoledPolygonPoints(centerPoint, maxRadius, size) {
                var locs = [];
                var hole = [];
                var centralAngle = 360 / size;
                var offset = 360 * Math.random(), brg, len;
                //Count backwards. This will generate points that are in CCW rotation which is OGC compliant.
                for (var i = size; i > 0; i--) {
                    len = maxRadius * Math.max(Math.random(), 0.3);
                    brg = (i * centralAngle + offset) % 360;
                    locs.push(_calculateCoord(centerPoint, brg, len));
                    hole.push(_calculateCoord(centerPoint, brg, len * Math.random()));
                }
                return [locs, hole.reverse()];
            }
            function _calculateCoord(origin, brng, arcLength) {
                var lat1 = origin[1] * Math.PI / 180;
                var lon1 = origin[0] * Math.PI / 180;
                var centralAngle = arcLength / 6378100;
                var lat2 = Math.asin(Math.sin(lat1) * Math.cos(centralAngle) + Math.cos(lat1) * Math.sin(centralAngle) * Math.cos(brng * Math.PI / 180));
                var lon2 = lon1 + Math.atan2(Math.sin(brng * Math.PI / 180) * Math.sin(centralAngle) * Math.cos(lat1), Math.cos(centralAngle) - Math.sin(lat1) * Math.sin(lat2));
                return [lon2 * 180 / Math.PI, lat2 * 180 / Math.PI];
            }
            /**
            * Generates a random color string.
            * @param alpha A number between 0 and 1 indicating the transparency of the color.
            * If specified and greater than 0, an RGBA color string will be returned with the specified alpha value.
            * If equal to 0 or undefined a hex color string will be returned.
            * @returns A random color string.
            **/
            function getColor(alpha) {
                if (typeof alpha === 'number' && alpha >= 0) {
                    return 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
                        Math.floor(Math.random() * 255) + ',' + alpha + ')';
                }
                //Generate a hex value color
                return '#' + (Math.random().toString(16) + "000000").slice(2, 8);
            }
            TestDataGenerator.getColor = getColor;
            /**
            * Generates random Position objects.
            * @param num The number of positions to generate.
            * @param bounds The bounding box in which all the positions should fall within.
            * @returns An array of random positions.
            **/
            function getPositions(num, bounds) {
                if (!num || num <= 0) {
                    num = 1;
                }
                bounds = _processBoundingBox(bounds);
                var locs = [];
                for (var i = 0; i < num; i++) {
                    locs.push(_getRandomPosition(bounds));
                }
                return locs;
            }
            TestDataGenerator.getPositions = getPositions;
            /**
            * Generates random pushpins.
            * @param num The number of Point to generate.
            * @param bounds The bounding box in which all the points should fall within.
            * @returns An array of random Points.
            **/
            function getPoints(num, bounds) {
                if (!num || num <= 0) {
                    num = 1;
                }
                bounds = _processBoundingBox(bounds);
                var pins = [];
                for (var i = 0; i < num; i++) {
                    pins.push(new atlas.data.Point(_getRandomPosition(bounds)));
                }
                return pins;
            }
            TestDataGenerator.getPoints = getPoints;
            /**
            * Generates random LineStrings.
            * @param num The number of LineStrings to generate.
            * @param bounds The bounding box in which all the positions of the LineStrings should fall within.
            * @param size The number of positions each LineStrings should have. Default: random between 3 and 10.
            * @param scaleFactor A number that scales the size of the LineStrings based on size of the bounding box.
            * A value of 0.1 would generate LineStrings that are no larger than 10% of the width/height of the map. Default: 0.1
            * @returns An array of random LineStrings.
            **/
            function getLineStrings(num, bounds, size, scaleFactor) {
                if (!num || num <= 0) {
                    num = 1;
                }
                if (size && size <= 1) {
                    size = 2;
                }
                if (!scaleFactor || scaleFactor <= 0) {
                    scaleFactor = 0.1;
                }
                bounds = _processBoundingBox(bounds);
                //Calculate a radii that is a fraction of the smallest bounding box dimension in degrees.
                var radii = Math.min(atlas.data.BoundingBox.getWidth(bounds) / 2, atlas.data.BoundingBox.getHeight(bounds)) * scaleFactor;
                //Reduce size of bounds to account for radius of line string area.
                var bbox = [
                    bounds[0] + radii,
                    bounds[1] + radii,
                    0,
                    0
                ];
                if (bounds.length === 4) {
                    bbox.push(bounds[2] - radii, bounds[3] - radii);
                }
                else if (bounds.length === 6) {
                    bbox.push(bounds[3] - radii, bounds[4] - radii);
                }
                //Turn radii into approximate meters value. At equator 1 degree of longitude ~= 111km.
                radii *= 111000;
                var numLocs = size;
                var lines = [];
                for (var i = 0; i < num; i++) {
                    if (!size) {
                        numLocs = Math.ceil(Math.random() * 7 + 3);
                    }
                    lines.push(new atlas.data.LineString(_generateSimplePolygonPoints(_getRandomPosition(bbox), radii, numLocs)));
                }
                return lines;
            }
            TestDataGenerator.getLineStrings = getLineStrings;
            /**
            * Generates random simlpe polygons.
            * @param num The number of polygons to generate. If set to one a single Polygon will be returned. If greater than one and array will be returned.
            * @param bounds The bounding box in which all the positions of the polygon should fall within.
            * @param size The number of positions each polygon should have. Default: random between 3 and 10.
            * @param scaleFactor A number that scales the size of the polygons based on the size of the bounding box.
            * A value of 0.1 would generate polygons that are no larger than 10% of the width/height of the map. Default: 0.1
            * @param addHole A boolean indicating if the generated polygon should have a hole or not. Note that this will double the number of positions objects that are in the Polygon.
            * @returns An array of random polygons.
            **/
            function getPolygons(num, bounds, size, scaleFactor, addHole) {
                if (!num || num <= 0) {
                    num = 1;
                }
                if (size && size <= 2) {
                    size = 3;
                }
                if (!scaleFactor || scaleFactor <= 0) {
                    scaleFactor = 0.1;
                }
                bounds = _processBoundingBox(bounds);
                //Calculate a radii that is a fraction of the smallest bounding box dimension in degrees.
                var radii = Math.min(atlas.data.BoundingBox.getWidth(bounds) / 2, atlas.data.BoundingBox.getHeight(bounds)) * scaleFactor;
                //Reduce size of bounds to account for radius of line string area.
                var bbox = [
                    bounds[0] + radii,
                    bounds[1] + radii,
                    0,
                    0
                ];
                if (bounds.length === 4) {
                    bbox.push(bounds[2] - radii, bounds[3] - radii);
                }
                else if (bounds.length === 6) {
                    bbox.push(bounds[3] - radii, bounds[4] - radii);
                }
                //Turn radii into approximate meters value. At equator 1 degree of longitude ~= 111km.
                radii *= 111000;
                var numLocs = size;
                var polys = [];
                for (var i = 0; i < num; i++) {
                    if (!size) {
                        numLocs = Math.ceil(Math.random() * 7 + 3);
                    }
                    if (addHole) {
                        polys.push(new atlas.data.Polygon(_generateHoledPolygonPoints(_getRandomPosition(bbox), radii, numLocs)));
                    }
                    else {
                        polys.push(new atlas.data.Polygon([_generateSimplePolygonPoints(_getRandomPosition(bbox), radii, numLocs)]));
                    }
                }
                return polys;
            }
            TestDataGenerator.getPolygons = getPolygons;
        })(TestDataGenerator = utils.TestDataGenerator || (utils.TestDataGenerator = {}));
    })(utils = atlas.utils || (atlas.utils = {}));
    var data;
    (function (data_1) {
        /*
         * A set of helpful static functions for working with bounding boxes.
         */
        var BoundingBox;
        (function (BoundingBox) {
            /* Bounding boxes can be defined with and without altitude information.
             * [west, south, east, north]
             * [west, south, minAltitude, east, north, maxAltitude]
             * However, Mapbox doesn't support altitude in bounding boxes currently.
             * So lets understand and handle it, but avoid returning bound objects that contain altitude for now.
             */
            /**
             * Returns a boolean indicating if the bounding box crosses the antimerdian or not.
             * @param bounds The bounding box to check.
             * @returns A boolean indicating if the bounding box crosses the antimerdian or not.
             */
            function crossesAntimerdian(bounds) {
                return (atlas.data.BoundingBox.getEast(bounds) - atlas.data.BoundingBox.getWest(bounds)) < 0;
            }
            BoundingBox.crossesAntimerdian = crossesAntimerdian;
            /**
             * Gets the height of a bounding box in degrees.
             * @param bounds The bounding box to check.
             * @returns The height of the bounding box in degrees.
             */
            function getHeight(bounds) {
                var north = atlas.data.BoundingBox.getNorth(bounds);
                var south = atlas.data.BoundingBox.getSouth(bounds);
                var height = north - south;
                return isNaN(height) ? 0 : height;
            }
            BoundingBox.getHeight = getHeight;
            /**
             * Gets the width of a bounding box in degrees.
             * @param bounds The bounding box to check.
             * @returns The width of the bounding box in degrees.
             */
            function getWidth(bounds) {
                var east = atlas.data.BoundingBox.getEast(bounds);
                var west = atlas.data.BoundingBox.getWest(bounds);
                var width = east - west;
                if (isNaN(width)) {
                    return 0;
                }
                //Check to see if bounds crosses antimerdian.
                if (east < west) {
                    width += 360;
                }
                return width;
            }
            BoundingBox.getWidth = getWidth;
            /**
             * Returns the south west position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south west position of the bounding box.
             */
            function getSouthWest(bounds) {
                if (bounds && bounds.length >= 4) {
                    return [bounds[0], bounds[1]];
                }
                return null;
            }
            BoundingBox.getSouthWest = getSouthWest;
            /**
             * Returns the north east position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north east position of the bounding box.
             */
            function getNorthEast(bounds) {
                if (bounds) {
                    if (bounds.length === 4) {
                        return [bounds[2], bounds[3]];
                    }
                    else if (bounds.length === 6) {
                        return [bounds[3], bounds[4]];
                    }
                }
                return null;
            }
            BoundingBox.getNorthEast = getNorthEast;
            /**
             * Returns the north west position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north west position of the bounding box.
             */
            function getNorthWest(bounds) {
                if (bounds) {
                    if (bounds.length === 4) {
                        return [bounds[0], bounds[3]];
                    }
                    else if (bounds.length === 6) {
                        return [bounds[0], bounds[4]];
                    }
                }
                return null;
            }
            BoundingBox.getNorthWest = getNorthWest;
            /**
             * Returns the south east position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south east position of the bounding box.
             */
            function getSouthEast(bounds) {
                if (bounds) {
                    if (bounds.length === 4) {
                        return [bounds[2], bounds[1]];
                    }
                    else if (bounds.length === 6) {
                        return [bounds[3], bounds[1]];
                    }
                }
                return null;
            }
            BoundingBox.getSouthEast = getSouthEast;
            /**
             * Returns the south position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south position value of the bounding box.
             */
            function getSouth(bounds) {
                if (bounds && bounds.length >= 4) {
                    return bounds[1];
                }
                return NaN;
            }
            BoundingBox.getSouth = getSouth;
            /**
             * Returns the west position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The west position value of the bounding box.
             */
            function getWest(bounds) {
                if (bounds && bounds.length >= 4) {
                    return bounds[0];
                }
                return NaN;
            }
            BoundingBox.getWest = getWest;
            /**
             * Returns the north position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north position value of the bounding box.
             */
            function getNorth(bounds) {
                if (bounds) {
                    if (bounds.length === 4) {
                        return bounds[3];
                    }
                    else if (bounds.length === 6) {
                        return bounds[4];
                    }
                }
                return NaN;
            }
            BoundingBox.getNorth = getNorth;
            /**
             * Returns the east position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The east position value of the bounding box.
             */
            function getEast(bounds) {
                if (bounds) {
                    if (bounds.length === 4) {
                        return bounds[2];
                    }
                    else if (bounds.length === 6) {
                        return bounds[3];
                    }
                }
                return NaN;
            }
            BoundingBox.getEast = getEast;
            /**
             * Calculates the center of a bounding box.
             * @param bounds A bounding box to calculate the center of.
             * @returns A position that represents the center of the bounding box.
             */
            function getCenter(bounds) {
                //[west, south, east, north]
                var east = atlas.utils.SpatialMath.normalizeLongitude(atlas.data.BoundingBox.getEast(bounds));
                var west = atlas.utils.SpatialMath.normalizeLongitude(atlas.data.BoundingBox.getWest(bounds));
                if (west > east) {
                    east += 360.0;
                }
                var centerLongitude = atlas.utils.SpatialMath.normalizeLongitude(((west + east) / 2.0));
                var south = atlas.data.BoundingBox.getSouth(bounds);
                var north = atlas.data.BoundingBox.getNorth(bounds);
                var centerLatitude = (south + north) / 2.0;
                return [centerLongitude, centerLatitude];
            }
            BoundingBox.getCenter = getCenter;
            /**
             * Determines if a position is within a bounding box.
             * @param bounds The bounding box to see if the position is in.
             * @param position The position to see if it is in the bounding box.
             * @returns True if the position is within the bounding box.
             */
            function contains(bounds, position) {
                // Allow a small difference to account for arithmetic accuracy errors.
                // This is important for points on the edge of the bounding box which is the case when using BoundingBox.fromLocations
                var accuracyAllowance = 0.00000001;
                // Use the distance between the position and center of the bounding box to determine if they intersect.
                var center = atlas.data.BoundingBox.getCenter(bounds);
                var diffLatitude = Math.abs(center[1] - position[1]);
                var diffLongitude = Math.abs(center[0] - position[0]);
                if (diffLongitude > 180.0) {
                    // We want the shortest distance between the 2 points.
                    diffLongitude = 360 - diffLongitude;
                }
                var height = atlas.data.BoundingBox.getHeight(bounds);
                var width = atlas.data.BoundingBox.getWidth(bounds);
                return (diffLatitude <= (height / 2) + accuracyAllowance) && (diffLongitude <= (width / 2) + accuracyAllowance);
            }
            BoundingBox.contains = contains;
            /**
            * Determines if a bounding box crosses the antimerdian (-180/180 longitude).
            * @returns True if the bounding box crosses the antimerdian (-180/180 longitude).
            */
            function crossesAntiMerdian(bounds) {
                var east = atlas.data.BoundingBox.getEast(bounds);
                var west = atlas.data.BoundingBox.getWest(bounds);
                return (east < west);
            }
            BoundingBox.crossesAntiMerdian = crossesAntiMerdian;
            /**
             * Determines is two bounding boxes intersect.
             * @param bounds1 The first bounding box to compare with.
             * @param bounds2 The second bounding box to compare with.
             * @returns true if the provided bounding boxes intersect.
             */
            function intersect(bounds1, bounds2) {
                var center1 = atlas.data.BoundingBox.getCenter(bounds1);
                var center2 = atlas.data.BoundingBox.getCenter(bounds2);
                // Use the distance between the 2 centers to determine if they intersect.
                var diffLatitude = Math.abs(center1[1] - bounds2[1]);
                var diffLongitude = Math.abs(center1[0] - bounds2[0]);
                if (diffLongitude > 180.0) {
                    // We want the shortest distance between the 2 points.
                    diffLongitude = 360 - diffLongitude;
                }
                var height1 = atlas.data.BoundingBox.getHeight(bounds1);
                var width1 = atlas.data.BoundingBox.getWidth(bounds1);
                var height2 = atlas.data.BoundingBox.getHeight(bounds2);
                var width2 = atlas.data.BoundingBox.getWidth(bounds2);
                return (diffLatitude <= (height1 / 2 + height2 / 2) && diffLongitude <= (width1 / 2 + width2 / 2));
            }
            BoundingBox.intersect = intersect;
            /**
            * Merges two bounding boxes together.
            * @param bounds1 The first bounding box to merge with.
            * @param bounds2 The second bounding box to merge with.
            * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
            */
            function merge(bounds1, bounds2) {
                var bb1Valid = bounds1 && bounds1.length === 4;
                var bb2Valid = bounds2 && bounds2.length === 4;
                if (bb1Valid && !bb2Valid) {
                    return bounds1;
                }
                else if (bb2Valid && !bb1Valid) {
                    return bounds2;
                }
                else if (!bb1Valid && !bb2Valid) {
                    return null;
                }
                var n1, s1, e1, w1, n2, s2, e2, w2;
                if (bounds1.length === 4) {
                    w1 = bounds1[0];
                    s1 = bounds1[1];
                    e1 = bounds1[2];
                    n1 = bounds1[3];
                }
                else if (bounds1.length === 6) {
                    w1 = bounds1[0];
                    s1 = bounds1[1];
                    e1 = bounds1[3];
                    n1 = bounds1[4];
                }
                if (bounds2.length === 4) {
                    w2 = bounds2[0];
                    s2 = bounds2[1];
                    e2 = bounds2[2];
                    n2 = bounds2[3];
                }
                else if (bounds2.length === 6) {
                    w2 = bounds2[0];
                    s2 = bounds2[1];
                    e2 = bounds2[3];
                    n2 = bounds2[4];
                }
                //TODO: make this more robust so that it handles antimerdian.
                return [Math.min(w1, w2), Math.min(s1, s2), Math.max(e1, e2), Math.max(n1, n2)];
            }
            BoundingBox.merge = merge;
            /**
             * Creates a BoundingBox that contains all provided Position objects.
             * @param positions An array of locations to use to generate the bounding box.
             * @returns A bounding box that contains all given positions.
             */
            function fromPositions(positions) {
                var north = NaN;
                var south = NaN;
                var west = NaN;
                var east = NaN;
                var position;
                var i = positions.length;
                var longitudes = new Array(i);
                var longCount = 0;
                while (i--) {
                    position = positions[i];
                    if (position && position.length >= 2) {
                        north = (north === undefined) ? position[1] : Math.max(north, position[1]);
                        south = (south === undefined) ? position[1] : Math.min(south, position[1]);
                        longitudes[longCount++] = atlas.utils.SpatialMath.normalizeLongitude(position[0]);
                    }
                }
                if (longCount) {
                    // Find largest gap between longitudes
                    longitudes.length = longCount;
                    longitudes.sort(function (a, b) { return a - b; });
                    var maxGap = (longitudes[0] + 360) - longitudes[longCount - 1];
                    var maxGapIndex = 0;
                    for (i = 1; i < longCount; i++) {
                        var gap = longitudes[i] - longitudes[i - 1];
                        if (gap > maxGap) {
                            maxGap = gap;
                            maxGapIndex = i;
                        }
                    }
                    west = longitudes[maxGapIndex];
                    east = longitudes[(maxGapIndex || longCount) - 1];
                }
                if (isNaN(west) || isNaN(south) || isNaN(east) || isNaN(north)) {
                    return null;
                }
                return [west, south, east, north];
            }
            BoundingBox.fromPositions = fromPositions;
            /**
             * Creates a BoundingBox from any array of objects that contain coordinate information.
             * Each object is either an array in the format; [lat, lng] or [lat, lng, elv], or an object with the any combination of the following properties:
             * Longitude: lng, longitude, lon, x
             * Latitude: lat, latitude, y
             * Elevation: elv, elevation, alt, altitude, z
             * @param latLngs The objects that contain coordinate information.
             * @returns A BoundingBox that contains all the provided coordinate information.
             */
            function fromLatLngs(latLngs) {
                return atlas.data.BoundingBox.fromPositions(atlas.data.Position.fromLatLngs(latLngs));
            }
            BoundingBox.fromLatLngs = fromLatLngs;
            //TODO: Finish and make more robust.
            /**
             * Calculates the bounding box of features, geometries, array of features, geometries, or points.
             * @param data The features, geometries, array of features, geometries, or points to calculate the bounding box for.
             * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
             */
            function fromData(data) {
                if (data instanceof Array && data.length > 0) {
                    if (data[0] instanceof Array) {
                        if (data[0].length > 0 && typeof (data[0][0]) === 'number') {
                            if (data[0].length === 4) {
                                //data is a bounding box.
                                return data[0];
                            }
                            else if (data[0].length >= 2) {
                                //data is an array of Positions.
                                var minLat = data[0][1], maxLat = data[0][1], minLon = data[0][0], maxLon = data[0][0];
                                for (var i = 1; i < data.length; i++) {
                                    if (data[i][0] < minLon) {
                                        minLon = data[i][0];
                                    }
                                    if (data[i][0] > maxLon) {
                                        maxLon = data[i][0];
                                    }
                                    if (data[i][1] < minLat) {
                                        minLat = data[i][1];
                                    }
                                    if (data[i][1] > maxLat) {
                                        maxLat = data[i][1];
                                    }
                                }
                                return [minLon, minLat, maxLon, maxLat];
                            }
                        }
                    }
                    else if (data[0].type || data[0][0] instanceof Array) {
                        //data is an array of features or array of data.
                        var bbox = atlas.data.BoundingBox.fromData(data[0]);
                        for (var i = 1; i < data.length; i++) {
                            bbox = atlas.data.BoundingBox.merge(bbox, atlas.data.BoundingBox.fromData(data[i]));
                        }
                        return bbox;
                    }
                    else if (typeof (data[0][0]) === 'number') {
                        if (data[0].length === 4) {
                            //data is a bounding box.
                            return data;
                        }
                        else if (data[0].length >= 2) {
                            //data is a coordinate. 
                            return [data[0][0], data[0][1], data[0][0], data[0][1]];
                        }
                    }
                }
                else if (data.type) {
                    //data is a feature.
                    if (data.bbox && data.bbox.length === 4) {
                        return data.bbox;
                    }
                    else {
                        var dataArray = null;
                        switch (data.type) {
                            case 'FeatureCollection':
                                //features: Array<Feature<Geometry>>
                                if (data.features && data.features.length > 0) {
                                    dataArray = data.features;
                                }
                                break;
                            case 'Feature':
                                //geometry: G
                                return atlas.data.BoundingBox.fromData(data.geometry);
                            case 'GeometryCollection':
                                //geometries: Geometry[]
                                if (data.geometries && data.geometries.length > 0) {
                                    dataArray = data.geometries;
                                }
                                break;
                            case 'Point':
                                //coordinates: Position
                                if (data.coordinates && data.coordinates.length >= 2) {
                                    return [data[0], data[1], data[0], data[1]];
                                }
                                break;
                            case 'LineString':
                            case 'MultiPoint':
                                //coordinates: Position[]
                                return BoundingBox.fromData(data.coordinates);
                            case 'Polygon':
                            case 'MultiLineString':
                            case 'MultiPolygon':
                                //coordinates: Position[][] || Position[][][]
                                if (data.coordinates && data.coordinates.length > 0) {
                                    dataArray = data.coordinates;
                                }
                                break;
                        }
                        if (dataArray) {
                            var bbox = BoundingBox.fromData(dataArray[0]);
                            for (var i = 1; i < dataArray.length; i++) {
                                bbox = BoundingBox.merge(bbox, BoundingBox.fromData(dataArray[i]));
                            }
                            return bbox;
                        }
                    }
                }
                return null;
            }
            BoundingBox.fromData = fromData;
        })(BoundingBox = data_1.BoundingBox || (data_1.BoundingBox = {}));
        var Position;
        (function (Position) {
            /**
             * Compares the longitude and latitude values of two positions to see if they are equal at an accuracy of 6 decimal places.
             * @param pos1 First position to compare.
             * @param pos2 Second position to compare.
             * @returns A boolean indicating if two positions to see if they are equal at an accuracy of 6 decimal places.
             */
            function areEqual(pos1, pos2) {
                if (pos1 && pos1.length >= 2 && pos2 && pos2.length >= 2) {
                    var offset = 1000000;
                    return (Math.round(pos1[0] * offset) / offset) === (Math.round(pos2[0] * offset) / offset) &&
                        (Math.round(pos1[1] * offset) / offset) === (Math.round(pos2[1] * offset) / offset);
                }
                return false;
            }
            Position.areEqual = areEqual;
            function fromLatLng(y, x, z) {
                var position = [];
                //TODO: Consider normalizing/validating values.
                if (typeof y === 'number') {
                    position.push(y);
                    if (typeof x === 'number') {
                        position.push(x);
                    }
                    if (typeof z === 'number') {
                        position.push(z);
                    }
                }
                else if (y instanceof Array) {
                    //Assume array is in the form [lat, lng] or [lat, lng, elv]
                }
                else if (typeof y === 'object') {
                    //Consider pulling these out into static variable so that we don't constantly create instances of these.
                    var latNames = ['lat', 'latitude', 'y'];
                    var lngNames = ['lng', 'longitude', 'lon', 'x'];
                    var elvNames = ['elv', 'elevation', 'alt', 'altitude', 'z'];
                    var lat = NaN, lng = NaN, elv = NaN;
                    //Do a case insensitive search through the object properties.
                    Object.keys(y).forEach(function (key, idx, arr) {
                        var smallKey = key.toLowerCase();
                        if (isNaN(lat) && latNames.indexOf(smallKey) >= 0 && typeof y[key] === 'number') {
                            lat = y[key];
                        }
                        else if (isNaN(lng) && lngNames.indexOf(smallKey) >= 0 && typeof y[key] === 'number') {
                            lng = y[key];
                        }
                        else if (isNaN(elv) && elvNames.indexOf(smallKey) >= 0 && typeof y[key] === 'number') {
                            elv = y[key];
                        }
                    });
                    if (!isNaN(lat) && !isNaN(lng)) {
                        position.push(lng, lat);
                        if (!isNaN(elv)) {
                            position.push(elv);
                        }
                    }
                }
                if (position.length >= 2) {
                    return position;
                }
                return null;
            }
            Position.fromLatLng = fromLatLng;
            /**
             * Converts an array of objects that contain coordinate information into an array of Positions. Objects that can't be converted are discarded.
             * Each object is either an array in the format; [lat, lng] or [lat, lng, elv], or an object with the any combination of the following properties:
             * Longitude: lng, longitude, lon, x
             * Latitude: lat, latitude, y
             * Elevation: elv, elevation, alt, altitude, z
             * @param latLngs The objects that contain coordinate information.
             * @returns An array of Position objects that contain all the provided coordinate information.
             */
            function fromLatLngs(latLngs) {
                var positions = [];
                for (var i = 0, len = latLngs.length; i < len; i++) {
                    var p = atlas.data.Position.fromLatLng(latLngs[i]);
                    //skip undetermined positions. 
                    if (p) {
                        positions.push(p);
                    }
                }
                return positions;
            }
            Position.fromLatLngs = fromLatLngs;
        })(Position = data_1.Position || (data_1.Position = {}));
    })(data = atlas.data || (atlas.data = {}));
})(atlas || (atlas = {}));
//# sourceMappingURL=atlasExtensions.js.map