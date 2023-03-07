/*
azure-maps-html-marker-layer Version: 0.0.1

MIT License

    Copyright (c) Microsoft Corporation.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE
*/

(function (exports, azmaps) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * Helper class for merging namespaces.
     */
    var Namespace = /** @class */ (function () {
        function Namespace() {
        }
        Namespace.merge = function (namespace, base) {
            var context = window || global;
            var parts = namespace.split(".");
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (context[part]) {
                    context = context[part];
                }
                else {
                    return base;
                }
            }
            return __assign(__assign({}, context), base);
        };
        return Namespace;
    }());

    /**
     * A layer that renders point data from a data source as HTML elements on the map.
     */
    var HtmlMarkerLayer = /** @class */ (function (_super) {
        __extends(HtmlMarkerLayer, _super);
        /*********************
         * Constructor
         *********************/
        /**
        * Constructs a new HtmlMarkerLayer.
        * @param source The id or instance of a data source which the layer will render.
        * @param id The id of the layer. If not specified a random one will be generated.
        * @param options The options of the Html marker layer.
        */
        function HtmlMarkerLayer(source, id, options) {
            var _this = _super.call(this, source, id) || this;
            /*********************
             * Private Properties
             *********************/
            _this._options = {
                minZoom: 0,
                maxZoom: 24,
                visible: true,
                updateWhileMoving: false,
                filter: ['==', ['geometry-type'], 'Point'],
                markerCallback: function (id, position, properties) {
                    if (properties.cluster) {
                        return new azmaps.HtmlMarker({
                            position: position,
                            text: properties.point_count_abbreviated
                        });
                    }
                    else {
                        return new azmaps.HtmlMarker({
                            position: position
                        });
                    }
                }
            };
            _this._markers = [];
            _this._markerIds = [];
            _this._markerCache = {};
            /** Events supported by the HTML Marker Layer */
            _this._supportedEvents = ["click", "contextmenu", "dblclick", "drag", "dragstart", "dragend", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"];
            /*********************
             * Private methods
             *********************/
            /** Event handler for when the map moves. */
            _this._mapMoved = function () {
                if (_this._options.updateWhileMoving) {
                    _this._updateMarkers();
                }
            };
            /**
             * Event handler for when a data source in the map changes.
             */
            _this._sourceUpdated = function (e) {
                var s = _this._getSourceClass();
                if (s && s.getId() === e.source.id) {
                    //this._clearCache(true);
                    //Check to see if there is a timer already waiting, if so, remove it.
                    if (_this._timer) {
                        clearTimeout(_this._timer);
                    }
                    //Wait 33ms (~30 frames per second) before processing the update. This will help throttle updates.
                    //@ts-ignore
                    _this._timer = setTimeout(_this._sourceUpdater, 33);
                }
            };
            /**
             * Throttled event handler for updating the clearing cache.
             */
            _this._sourceUpdater = function () {
                //Clear the timer.
                _this._timer = null;
                //Clear the cache and force an update if the data source has changed.
                _this._clearCache(true);
            };
            /**
             * Main function that updates all displayed markers on the map.
             */
            _this._updateMarkers = function () { return __awaiter(_this, void 0, void 0, function () {
                var self, map, markers, opt, zoom, source, sourceId, shapes, newMarkers, newMarkerIds, id, properties, position, shape, feature, marker, i, len, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            map = self._map;
                            markers = self._markers;
                            opt = self._options;
                            zoom = (map) ? map.getCamera().zoom : undefined;
                            if (!(opt.visible && zoom !== undefined && zoom >= opt.minZoom && zoom <= opt.maxZoom)) return [3 /*break*/, 5];
                            source = self.getSource();
                            sourceId = (typeof source === 'string') ? source : source.getId();
                            shapes = map.map.querySourceFeatures(sourceId, {
                                sourceLayer: self.getOptions().sourceLayer,
                                filter: opt.filter
                            });
                            newMarkers = [];
                            newMarkerIds = [];
                            id = void 0;
                            properties = void 0;
                            position = void 0;
                            shape = void 0;
                            feature = void 0;
                            marker = void 0;
                            i = 0, len = shapes.length;
                            _a.label = 1;
                        case 1:
                            if (!(i < len)) return [3 /*break*/, 4];
                            marker = null;
                            id = null;
                            if (shapes[i] instanceof azmaps.Shape) {
                                shape = shapes[i];
                                if (shape.getType() === 'Point') {
                                    position = shape.getCoordinates();
                                    properties = shape.getProperties();
                                    id = shape.getId();
                                }
                            }
                            else {
                                feature = shapes[i];
                                if (feature.geometry.type === 'Point') {
                                    position = feature.geometry.coordinates;
                                    properties = feature.properties;
                                    //Check to see if the point represents a clustered point from a GeoJSON data source. Vector tile sources may have cluster data, but may not align with the same property schema.
                                    if (properties && properties.cluster) {
                                        id = 'cluster_' + feature.properties.cluster_id;
                                    }
                                    else if (feature.id) {
                                        id = feature.id;
                                    }
                                }
                            }
                            if (!position) return [3 /*break*/, 3];
                            return [4 /*yield*/, self._getMarker(id, position, properties)];
                        case 2:
                            marker = _a.sent();
                            //Add marker events to wrap layer events.
                            if (!marker._eventsAttached) {
                                self._addEvents(marker);
                                marker._eventsAttached = true;
                            }
                            if (marker) {
                                if (marker.id) {
                                    newMarkerIds.push(marker.id);
                                }
                                if (!marker.id || self._markerIds.indexOf(marker.id) === -1) {
                                    newMarkers.push(marker);
                                    map.markers.add(marker);
                                }
                            }
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4:
                            //Remove all markers that are no longer in view. 
                            for (i = markers.length - 1; i >= 0; i--) {
                                if (!markers[i].id || newMarkerIds.indexOf(markers[i].id) === -1) {
                                    map.markers.remove(markers[i]);
                                    markers.splice(i, 1);
                                }
                            }
                            self._markers = markers.concat(newMarkers);
                            self._markerIds = newMarkerIds;
                            return [3 /*break*/, 6];
                        case 5:
                            if (self._markers.length > 0) {
                                map.markers.remove(self._markers);
                                self._markers = [];
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            /**
             * A simple event handler wrapper.
             * @param e Event arg. Will be a TargetedEvent from an HTML Marker.
             */
            _this._wrappedEvent = function (e) {
                _this.map.events.invoke(e.type, _this, e);
            };
            _super.prototype.setOptions.call(_this, {
                color: 'transparent',
                radius: 0,
                strokeWidth: 0
            });
            _this.setOptions(options || {});
            return _this;
        }
        /*********************
         * Public methods
         *********************/
        /**
        * Gets the options of the Html Marker layer.
        */
        HtmlMarkerLayer.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /**
        * Sets the options of the Html marker layer.
        * @param options The new options of the Html marker layer.
        */
        HtmlMarkerLayer.prototype.setOptions = function (options) {
            var self = this;
            var opt = self._options;
            var newBaseOptions = {};
            var cc = false;
            if (options.source && opt.source !== options.source) {
                opt.source = options.source;
                newBaseOptions.source = options.source;
                cc = true;
            }
            if (options.sourceLayer && opt.sourceLayer !== options.sourceLayer) {
                opt.sourceLayer = options.sourceLayer;
                newBaseOptions.sourceLayer = options.sourceLayer;
                cc = true;
            }
            if (options.filter && opt.filter !== options.filter) {
                opt.filter = options.filter;
                newBaseOptions.filter = options.filter;
                cc = true;
            }
            if (typeof options.minZoom === 'number' && opt.minZoom !== options.minZoom) {
                opt.minZoom = options.minZoom;
                newBaseOptions.minZoom = options.minZoom;
            }
            if (typeof options.maxZoom === 'number' && opt.maxZoom !== options.maxZoom) {
                opt.maxZoom = options.maxZoom;
                newBaseOptions.maxZoom = options.maxZoom;
            }
            if (typeof options.visible !== 'undefined' && opt.visible !== options.visible) {
                opt.visible = options.visible;
                newBaseOptions.visible = options.visible;
            }
            if (options.markerCallback && opt.markerCallback != options.markerCallback) {
                opt.markerCallback = options.markerCallback;
                cc = true;
            }
            if (typeof options.updateWhileMoving === 'boolean' && opt.updateWhileMoving !== options.updateWhileMoving) {
                opt.updateWhileMoving = options.updateWhileMoving;
            }
            if (cc) {
                self._clearCache(true);
            }
            else {
                self._updateMarkers();
            }
            _super.prototype.setOptions.call(this, newBaseOptions);
        };
        /** Force the layer to refresh and update. */
        HtmlMarkerLayer.prototype.update = function () {
            this._clearCache(true);
            this._updateMarkers();
        };
        /***************************
         * Public override methods
         ***************************/
        //Override the layers onAdd function. 
        HtmlMarkerLayer.prototype.onAdd = function (map) {
            var self = this;
            var mapEvents = map.events;
            if (map) {
                mapEvents.remove('moveend', self._updateMarkers);
                mapEvents.remove('move', self._mapMoved);
                mapEvents.remove('sourcedata', self._sourceUpdated);
            }
            self._map = map;
            mapEvents = map.events;
            mapEvents.add('moveend', self._updateMarkers);
            mapEvents.add('move', self._mapMoved);
            mapEvents.add('sourcedata', self._sourceUpdated);
            //Call the underlying functionaly for this.
            _super.prototype.onAdd.call(this, map);
        };
        //Override the layers onRemove function.
        HtmlMarkerLayer.prototype.onRemove = function () {
            var self = this;
            var map = self._map;
            if (map) {
                var mapEvents = map.events;
                mapEvents.remove('moveend', self._updateMarkers);
                mapEvents.remove('move', self._mapMoved);
                mapEvents.remove('sourcedata', self._sourceUpdated);
            }
            self._clearCache(false);
            self._map = null;
            _super.prototype.onRemove.call(this);
        };
        /**
         * Gets the source class of the layer.
         */
        HtmlMarkerLayer.prototype._getSourceClass = function () {
            var self = this;
            var s = self.getSource();
            if (typeof s === 'string' && self._map !== null) {
                return self._map.sources.getById(s);
            }
            else if (s instanceof azmaps.source.Source) {
                return s;
            }
            return null;
        };
        /**
         * Clears the marker cache.
         * @param update A boolean indicating if the layer should rerender/update after clearing the cache.
         */
        HtmlMarkerLayer.prototype._clearCache = function (update) {
            var self = this;
            self._markerCache = {}; //Clear marker cache. 
            if (self._map) {
                for (var i = 0, len = self._markers.length; i < len; i++) {
                    var m = self._markers[i];
                    //Remove wrapped events from marker.
                    self._removeEvents(m);
                    m._eventsAttached = false;
                    //Remove marker from map.
                    self._map.markers.remove(m);
                }
            }
            self._markers = [];
            self._markerIds = [];
            if (update) {
                self._updateMarkers();
            }
        };
        /**
         * Gets a marker either from cache or from the rendering callback.
         * @param id The id of the marker.
         * @param position The position of the marker.
         * @param properties The properties of the marker.
         */
        HtmlMarkerLayer.prototype._getMarker = function (id, position, properties) {
            var self = this;
            var markerCache = self._markerCache;
            var opt = self._options;
            if (!id) {
                //If no id, create an ID based on the position and properties.
                id = position.join(',') + JSON.stringify(properties || {});
            }
            //Check cache for existing marker.
            if (markerCache[id]) {
                return markerCache[id];
            }
            else {
                var callbackResult_1 = opt.markerCallback(id, position, properties);
                if (callbackResult_1 instanceof azmaps.HtmlMarker) {
                    var m = self._getExtendedMarker(callbackResult_1, id, position, properties);
                    if (m) {
                        markerCache[id] = m;
                        return Promise.resolve(m);
                    }
                }
                else {
                    return new Promise(function (resolve) {
                        callbackResult_1.then(function (marker) {
                            var m = self._getExtendedMarker(marker, id, position, properties);
                            if (m) {
                                markerCache[id] = m;
                                resolve(m);
                            }
                        });
                    });
                }
                return null;
            }
        };
        HtmlMarkerLayer.prototype._getExtendedMarker = function (marker, id, position, properties) {
            var result = marker;
            if (result) {
                result.properties = properties;
                result.id = id;
                //Make sure position is set.
                result.setOptions({
                    position: position
                });
                return result;
            }
            return null;
        };
        /**
         * Wraps all events on a marker.
         * @param marker Marker to wrap events on.
         */
        HtmlMarkerLayer.prototype._addEvents = function (marker) {
            var self = this;
            self._supportedEvents.forEach(function (e) {
                //@ts-ignore
                self.map.events.add(e, marker, self._wrappedEvent);
            });
        };
        /**
         * Removes all wrapped events on a marker.
         * @param marker Marker to remove events from.
         */
        HtmlMarkerLayer.prototype._removeEvents = function (marker) {
            var self = this;
            self._supportedEvents.forEach(function (e) {
                //@ts-ignore
                self.map.events.remove(e, marker, self._wrappedEvent);
            });
        };
        return HtmlMarkerLayer;
    }(azmaps.layer.BubbleLayer));



    var baseLayer = /*#__PURE__*/Object.freeze({
        __proto__: null,
        HtmlMarkerLayer: HtmlMarkerLayer
    });

    /**
     * A class for creating Pie Charts as HTML Markers on a map.
     */
    var PieChartMarker = /** @class */ (function (_super) {
        __extends(PieChartMarker, _super);
        /********************
        * Constructor
        ********************/
        /**
         * Creates an HTML Marker in the shape of a pie chart.
         * @param options Options for rendering the Pie Chart marker.
         */
        function PieChartMarker(options) {
            var _this = _super.call(this, options) || this;
            /********************
            * Private Properties
            ********************/
            _this._options = {
                values: [],
                radius: 40,
                colors: ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
                fillColor: 'transparent',
                strokeWidth: 0,
                strokeColor: '#666666',
                innerRadius: 0
            };
            /** The total of all values. */
            _this._total = 0;
            /** Any additional properties that you want to store with the marker. */
            _this.properties = {};
            _super.prototype.setOptions.call(_this, {
                htmlContent: document.createElement('div'),
                pixelOffset: [0, 0],
                anchor: 'center'
            });
            _this.setOptions(options);
            return _this;
        }
        /**
         * Gets the total value of all slices summed togehter.
         * @returns The total value of all slices summed togehter.
         */
        PieChartMarker.prototype.getTotalValue = function () {
            return this._total;
        };
        /**
         * Gets the value of a slice of the pie based on it's index.
         * @param idx The index of the slice.
         * @returns The value of a slice of the pie based on it's index.
         */
        PieChartMarker.prototype.getSliceValue = function (idx) {
            var vals = this._options.values;
            return (idx >= 0 && idx < vals.length) ? vals[idx] : 0;
        };
        /**
         * Gets the percentage value of a slice of the pie based on it's index.
         * @param idx The index of the slice.
         * @returns The percentage value of a slice of the pie based on it's index.
         */
        PieChartMarker.prototype.getSlicePercentage = function (idx) {
            var self = this;
            return (self._total > 0) ? Math.round(self.getSliceValue(idx) / self._total * 10000) / 100 : 0;
        };
        /**
         * Gets the options of the pie chart marker.
         * @returns The options of the pie chart marker.
         */
        PieChartMarker.prototype.getOptions = function () {
            return Object.assign({}, _super.prototype.getOptions.call(this), this._options);
        };
        /**
         * Sets the options of the pie chart marker.
         * @param options The options to set on the marker.
         */
        PieChartMarker.prototype.setOptions = function (options) {
            var self = this;
            var opt = self._options;
            var stringify = JSON.stringify;
            var rerender = false;
            if (options.radius && options.radius > 0 && options.radius != opt.radius) {
                opt.radius = options.radius;
                rerender = true;
            }
            if (options.innerRadius >= 0 && options.innerRadius != opt.innerRadius) {
                opt.innerRadius = options.innerRadius;
                rerender = true;
            }
            if (options.colors && stringify(options.colors) !== stringify(opt.colors)) {
                opt.colors = options.colors;
                rerender = true;
            }
            if (options.fillColor && stringify(options.fillColor) !== stringify(opt.fillColor)) {
                opt.fillColor = options.fillColor;
                rerender = true;
            }
            if (options.strokeColor && options.strokeColor !== opt.strokeColor) {
                opt.strokeColor = options.strokeColor;
                rerender = true;
            }
            if (options.strokeWidth >= 0 && options.strokeWidth != opt.strokeWidth) {
                opt.strokeWidth = options.strokeWidth;
                rerender = true;
            }
            if (options.tooltipCallback !== undefined && opt.tooltipCallback != options.tooltipCallback) {
                opt.tooltipCallback = options.tooltipCallback;
                rerender = true;
            }
            if (options.values && stringify(options.values) !== stringify(opt.values)) {
                opt.values = options.values;
                rerender = true;
            }
            if (options.text !== undefined && options.text !== opt.text) {
                //opt.text = options.text;
                _super.prototype.setOptions.call(this, { text: options.text });
                rerender = true;
            }
            if (options.textClassName !== undefined && options.textClassName !== opt.textClassName) {
                opt.textClassName = options.textClassName;
                rerender = true;
            }
            if (rerender) {
                self._render();
            }
            _super.prototype.setOptions.call(this, options);
        };
        /********************
        * Private Methods
        ********************/
        /**
         * Method that generates the SVG pie chart for the marker.
         */
        PieChartMarker.prototype._render = function () {
            var self = this;
            var opt = self._options;
            var data = opt.values;
            var radius = opt.radius;
            var startAngle = 0, angle = 0;
            if (data) {
                self._total = data.reduce(function (a, b) {
                    return a + b;
                }, 0);
                //Ensure that there are enough colors defined.
                var moreColors = PieChartMarker._moreColors;
                var random = Math.random;
                var round = Math.round;
                var mIdx = 0;
                while (data.length > opt.colors.length) {
                    //Generate additional random colors, but try and stagger them such that there is a good variation between agenct colors.
                    if (moreColors.length < data.length) {
                        moreColors.push("hsl(" + round(random() * 360) + "," + (round(random() * 20) + 70) + "%," + (round(random() * 40) + 30) + "%)");
                    }
                    //Grab the next additional color from the global pallet.
                    opt.colors.push(moreColors[mIdx]);
                    mIdx++;
                }
                //Origin for cx/cy
                var o = radius + opt.strokeWidth;
                var svg = ["<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + 2 * o + "px\" height=\"" + 2 * o + "px\">"];
                var tooltip = '';
                var maskId = void 0;
                if (opt.innerRadius > 0 && opt.innerRadius <= opt.radius) {
                    maskId = 'piechart-innercircle-' + round(random() * 10000000);
                    svg.push("<defs><mask id=\"" + maskId + "\"><rect width=\"100%\" height=\"100%\" fill=\"white\"/><circle r=\"" + opt.innerRadius + "\" cx=\"" + o + "\" cy=\"" + o + "\" fill=\"black\"/></mask></defs>\n                    <circle r=\"" + opt.innerRadius + "\" cx=\"" + o + "\" cy=\"" + o + "\" style=\"fill:" + opt.fillColor + ";stroke:" + opt.strokeColor + ";stroke-width:" + opt.strokeWidth * 2 + "px;\"/>");
                }
                if (self._total > 0) {
                    var ttc = opt.tooltipCallback;
                    var ratio = Math.PI * 2 / self._total;
                    for (var i = 0; i < data.length; i++) {
                        angle = ratio * data[i];
                        if (ttc) {
                            tooltip = ttc(self, i);
                        }
                        var c = (i < opt.colors.length) ? opt.colors[i] : moreColors[i];
                        svg.push(self._createSlice(o, o, radius, startAngle, angle, c, tooltip, maskId));
                        startAngle += angle;
                    }
                }
                var text = self.getOptions().text;
                if (text) {
                    svg.push("<text x=\"" + o + "\" y=\"" + (o + 7) + "\" style=\"font-size:16px;font-family:arial;fill:#000;font-weight:bold;\" class=\"" + (opt.textClassName || '') + "\" text-anchor=\"middle\">" + text + "</text>");
                }
                svg.push('</svg>');
                _super.prototype.getOptions.call(this).htmlContent.innerHTML = svg.join('');
            }
        };
        /**
         * Generates the SVG path for an arc slice of a pie.
         * @param cx Center x-origin of the arc.
         * @param cy Center y-origin of the arc.
         * @param r Radius of arc.
         * @param startAngle The start angle of the arc (0 = up, PI/2 = right, PI = down, 3/2 PI = left)
         * @param angle The angle width of the arc.
         * @param fillColor The fill color of the path.
         * @param tooltip The tooltip text to display when hovered.
         */
        PieChartMarker.prototype._createSlice = function (cx, cy, r, startAngle, angle, fillColor, tooltip, maskId) {
            var opt = this._options;
            var pi = Math.PI;
            var mask = '';
            if (maskId) {
                mask = " mask=\"url(#" + maskId + "\"";
            }
            if (angle > 2 * pi * 0.99) {
                //If the shape is nearly a complete circle, create a circle instead of an arc.
                return "<circle r=\"" + r + "\" cx=\"" + cx + "\" cy=\"" + cy + "\" style=\"fill:" + fillColor + ";stroke:" + opt.strokeColor + ";stroke-width:" + opt.strokeWidth + "px;\"" + mask + "><title>" + tooltip + "</title></circle>";
            }
            var sin = Math.sin;
            var cos = Math.cos;
            var x1 = cx + r * sin(startAngle);
            var y1 = cy - r * cos(startAngle);
            var x2 = cx + r * sin(startAngle + angle);
            var y2 = cy - r * cos(startAngle + angle);
            var x21 = cx + opt.innerRadius * sin(startAngle);
            var y21 = cy - opt.innerRadius * cos(startAngle);
            var x22 = cx + opt.innerRadius * sin(startAngle + angle);
            var y22 = cy - opt.innerRadius * cos(startAngle + angle);
            //Flag for when arcs are larger than 180 degrees in radians.
            var big = 0;
            if (angle > pi) {
                big = 1;
            }
            return "<path d=\"M" + cx + " " + cy + " L " + x1 + " " + y1 + " A " + r + "," + r + " 0 " + big + " 1 " + x2 + " " + y2 + "z\" style=\"fill:" + fillColor + ";stroke:" + opt.strokeColor + ";stroke-width:" + opt.strokeWidth + "px;\"" + mask + "><title>" + tooltip + "</title></path>";
        };
        /** Additional colors to use when enough haven't been specified. */
        PieChartMarker._moreColors = [];
        return PieChartMarker;
    }(azmaps.HtmlMarker));

    var layer = Namespace.merge("atlas.layer", baseLayer);

    exports.PieChartMarker = PieChartMarker;
    exports.layer = layer;

}(this.atlas = this.atlas || {}, atlas));
