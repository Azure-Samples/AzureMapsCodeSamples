/*
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

    var azmaps__default = 'default' in azmaps ? azmaps['default'] : azmaps;

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

    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * Retrieves a string from a localized resource, the string value passed in, or an empty string.
         * @param val The string value to either retrieve from resources or return as the string.
         * @param resx A localization resource.
         * @param locales Local languages to convert number to a string.
         * @param numberFormat Number format options to use when converting a number to a string.
         * @returns A string.
         */
        Utils.getString = function (val, resx, locales, numberFormat) {
            if (typeof val !== 'undefined') {
                if (typeof val === 'number') {
                    return val.toLocaleString(locales, numberFormat);
                }
                if (val !== '') {
                    Number.toString();
                    return (resx && resx[val]) ? resx[val] : val;
                }
            }
            return '';
        };
        /** Generates a unique GUID. */
        Utils.uuid = function () {
            //@ts-ignore
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
        };
        /**
         * Gets a layer instance from an id or instance.
         * @param layer A layer ID or instance.
         * @param map A map instance.
         * @returns A layer instance from an id or instance.
         */
        Utils.getLayer = function (layer, map) {
            if (typeof layer === 'string') {
                return map.layers.getLayerById(layer);
            }
            return layer;
        };
        /**
         * Get the RGBA color values from a color string.
         * @param sColor A color string.
         * @returns The RGBA color values from a color string.
         */
        Utils.colorToRGBA = function (sColor) {
            var offScreenCanvas = document.createElement('canvas');
            offScreenCanvas.setAttribute('width', '1');
            offScreenCanvas.setAttribute('height', '1');
            var ctx = offScreenCanvas.getContext("2d");
            ctx.fillStyle = sColor; //set fill color
            ctx.fillRect(0, 0, 1, 1);
            var p = ctx.getImageData(0, 0, 1, 1).data;
            return [p[0], p[1], p[2], p[3]];
        };
        /**
         * Gets the theme; 'light', 'dark' from a color string.
         * @param sColor A color string.
         * @returns The theme; 'light', 'dark' from a color string.
         */
        Utils.getColorTheme = function (sColor) {
            var rgb = Utils.colorToRGBA(sColor);
            var brightness = Math.sqrt(.299 * rgb[0] * rgb[0] + .587 * rgb[1] * rgb[1] + .114 * rgb[2] * rgb[2]);
            return (brightness > 127) ? 'light' : 'dark';
        };
        /**
         * Retrieves an HTMLElement based on ID, query selector string, or HTML Element instance.
         * @param elmInfo An elements ID, query selector string, or HTML Element instance.
         * @returns An HTMLElement based on ID, query selector string, or HTML Element instance.
         */
        Utils.getElement = function (elmInfo) {
            if (elmInfo) {
                if (typeof elmInfo === 'string') {
                    //Try getting by id.
                    var elm = document.getElementById(elmInfo);
                    //Try getting by using a query selector.
                    if (!elm) {
                        elm = document.querySelector(elmInfo);
                    }
                    return elm;
                }
                return elmInfo;
            }
            return null;
        };
        /**
         * Replaces a placeholder value within a JSON object.
         * @param obj The object to replace the placeholder in.
         * @param placeholder The placeholder string.
         * @param value The value to pass into the placeholder.
         * @param removeQutes A boolean indicating if quotes (single or double) around the placeholder should be removed. If false, the value will likely be wrapped with quotes and thus be a string. Setting to true will result in the raw value being exposed.
         * @returns A copy of the object with the placeholders replaced.
         */
        Utils.replacePlaceholder = function (obj, placeholder, value, removeQutes) {
            if (removeQutes) {
                placeholder = "[\"']?" + placeholder + "[\"']?";
            }
            var rx = RegExp(placeholder, 'gi');
            return JSON.parse(JSON.stringify(obj).replace(rx, value + ''));
        };
        /**
         * Adds zoom range attributes to an element.
         * @param item The layer group or state to set the elements zoom range on.
         * @param elm The element to set the zoom range on.
         * @param elm2 A secondary element that the min/max zoom info should be added to, such as the dots of a carousel.
         */
        Utils.setZoomRangeAttr = function (item, baseOptions, elm, elm2) {
            var minAttr = 'data-min-zoom';
            var maxAttr = 'data-max-zoom';
            var zoomBehaviorAttr = 'data-zoom-behavior';
            var min = item.minZoom + '';
            var max = item.maxZoom + '';
            var zoomBehavior = item.zoomBehavior || baseOptions.zoomBehavior || '';
            elm.setAttribute(minAttr, min);
            elm.setAttribute(maxAttr, max);
            elm.setAttribute(zoomBehaviorAttr, zoomBehavior);
            if (elm2) {
                elm2.setAttribute('data-min-zoom', min);
                elm2.setAttribute('data-max-zoom', max);
                elm2.setAttribute(zoomBehaviorAttr, zoomBehavior);
            }
        };
        /**
         * Processes the zoom range attributes of a set of elements based on a zoom level and the desired behavior.
         * @param elms The elements to process.
         * @param zoom The zoom level to process for.
         */
        Utils.processZoomRangeAttr = function (elms, zoom) {
            var minAttr = 'data-min-zoom';
            var maxAttr = 'data-max-zoom';
            var zoomBehaviorAttr = 'data-zoom-behavior';
            var disabledCss = 'atlas-carousel-disabled-text';
            for (var i = 0; i < elms.length; i++) {
                var elm = elms[i];
                if (elm.hasAttribute(minAttr)) {
                    var minZoom = parseInt(elm.getAttribute(minAttr));
                    var maxZoom = parseInt(elm.getAttribute(maxAttr));
                    var behavior = elm.getAttribute(zoomBehaviorAttr);
                    var inRange = (zoom >= minZoom && Math.ceil(zoom) <= maxZoom);
                    if (behavior === 'hide') {
                        elm.style.display = inRange ? '' : 'none';
                    }
                    else {
                        //Get child items that can be disabled.
                        var children = elm.querySelectorAll('input, option');
                        for (var j = 0; j < children.length; j++) {
                            children[j].disabled = !inRange;
                        }
                        //Set a disabled CSS class on the element which will make text a shaded grey color.
                        if (inRange) {
                            elm.classList.remove(disabledCss);
                        }
                        else {
                            elm.classList.add(disabledCss);
                        }
                    }
                }
            }
        };
        /**
         * Gets the zoom level range of a group of layers.
         * @param layers Azure Maps layers to extract zoom level ranges from.
         * @returns The zoom level range of a group of layers.
         */
        Utils.getZoomRange = function (layers) {
            if (layers && layers.length > 0) {
                var zr_1 = { minZoom: 24, maxZoom: 0 };
                layers.forEach(function (l) {
                    if (l['getOptions']) {
                        var opt = l['getOptions']();
                        zr_1.minZoom = Math.min(opt.minZoom || 0, zr_1.minZoom);
                        zr_1.maxZoom = Math.max(opt.maxZoom || 24, zr_1.maxZoom);
                    }
                });
                if (zr_1.minZoom > zr_1.maxZoom) {
                    var t = zr_1.maxZoom;
                    zr_1.maxZoom = zr_1.minZoom;
                    zr_1.minZoom = t;
                }
                return zr_1;
            }
            return { minZoom: 0, maxZoom: 24 };
        };
        /**
         * Adds a div with a `clear:both` style to a element container.
         * @param container The container to add the clear div too.
         */
        Utils.addClearDiv = function (container) {
            var d = document.createElement('div');
            d.className = 'atlas-control-clear';
            container.appendChild(d);
        };
        /**
         * Measures the size of a text string.
         * @param text The text string to measure.
         * @param fontSize The font size.
         * @param font The font family.
         * @returns Text size metrics.
         */
        Utils.measureText = function (text, fontSize, font) {
            var c = document.createElement("canvas");
            var ctx = c.getContext("2d");
            ctx.font = fontSize + "px " + (font || 'Arial');
            //Replace hexadecimal characters with capital W (largest single character) for measuring as special the canvas does not condense these characters.
            if (Utils.HexCharRx.test(text)) {
                text = text.replace(Utils.HexCharRx, 'W');
            }
            return ctx.measureText(text);
        };
        /**
        * Wraps text/HTML string with a div, adds it to a container, and adds a clear div underneath.
        * @param container The HTML element to add the text element to.
        * @param text The text/HTML string to add.
        * @param cssClass TA css class to add to the element.
        * @param resx A resource file for localization of strings.
        * @param addClear Specifies is a `clear:both` div should be added at the end.
        */
        Utils.addStringDiv = function (container, text, cssClass, resx, addClear, skipMeasure) {
            if (text && text !== '') {
                //Add legend subtitle.
                text = Utils.getString(text, resx);
                if (text !== '') {
                    var textElm = document.createElement('div');
                    textElm.className = cssClass;
                    textElm.innerHTML = text;
                    textElm.setAttribute('aria-label', text);
                    container.appendChild(textElm);
                    if (!skipMeasure) {
                        //Ensure there is enough space for the title and the expanding button.
                        var size = Utils.measureText(text, 14);
                        textElm.style.minWidth = Math.ceil(size.width + 20) + 'px';
                    }
                    if (addClear) {
                        Utils.addClearDiv(container);
                    }
                }
                return text;
            }
            return '';
        };
        /**
         * Retrieves a number from an object.
         * @param obj Object to get the number from.
         * @param property The property the number value is stored in.
         * @param minValue The min value.
         * @param defaultValue The default value to return if no number found.
         * @returns A number from an object.
         */
        Utils.getNumber = function (obj, property, minValue, defaultValue) {
            var val = obj[property];
            if (typeof val === 'number') {
                return Math.max(minValue, val);
            }
            return defaultValue;
        };
        /**
         * Retrieves a number from an object, or a secondary object.
         * @param obj Object to get the number from.
         * @param obj2 Second object to get the number from.
         * @param property The property the number value is stored in.
         * @param minValue The min value.
         * @param defaultValue The default value to return if no number found.
         * @returns A number from an object.
         */
        Utils.getNumber2 = function (obj, obj2, property, minValue, defaultValue) {
            var val = obj[property];
            if (typeof val === 'number') {
                return Math.max(minValue, val);
            }
            val = obj2[property];
            if (typeof val === 'number') {
                return Math.max(minValue, val);
            }
            return defaultValue;
        };
        /**
         * Gets all user defined layers from the map.
         * @param map The map instance.
         * @param layerFiler An array of layers to limit the search to.
         * @returns All user defined layers from the map.
         */
        Utils.getMapLayers = function (map, layerFilter) {
            var userLayers = [];
            if (map) {
                var mapLayers = map.layers.getLayers();
                var layers_1 = [];
                var filter_1 = [];
                if (layerFilter && layerFilter.length > 0) {
                    layerFilter.forEach(function (l) {
                        filter_1.push((typeof l === 'string') ? l : l.getId());
                    });
                }
                //Look for a drawing toolbar on the map. If there is one, grab it's drawing manager and filter out it's layers.
                var dt_1 = azmaps.control['DrawingToolbar'];
                if (dt_1) {
                    map.controls.getControls().forEach(function (c) {
                        if (c instanceof dt_1) {
                            var l = dt_1.drawMgr.getLayers();
                            filter_1.push(l.lineLayer.getId());
                            filter_1.push(l.pointLayer.getId());
                            filter_1.push(l.polygonLayer.getId());
                            filter_1.push(l.polygonOutlineLayer.getId());
                        }
                    });
                }
                var simpleDataLayer_1 = azmaps.layer['SimpleDataLayer'];
                mapLayers.forEach(function (l) {
                    //@ts-ignore
                    var id = (l.layers && l.layers.length > 0) ? l.layers[0].id : l.getId();
                    //Handle simple data layer - filter out it's sublayers.
                    if (simpleDataLayer_1 && l instanceof simpleDataLayer_1) {
                        layers_1.push(l);
                        //Remove/filter out any sub layers.
                        var sublayers = l['getLayers']();
                        Object.keys(sublayers).forEach(function (key) {
                            var sl = sublayers[key];
                            var idx = layers_1.indexOf(sl);
                            if (idx > -1) {
                                layers_1.splice(idx, 1);
                            }
                            filter_1.push(sl.getId());
                        });
                    }
                    else if (!id.startsWith('microsoft.maps.')) { //Filter out all microsoft.maps layers.
                        layers_1.push(l);
                    }
                });
                //Finalize filter.
                layers_1.forEach(function (l) {
                    //@ts-ignore
                    var id = (l.layers && l.layers.length > 0) ? l.layers[0].id : l.getId();
                    if (filter_1.indexOf(id) === -1) {
                        userLayers.push(l);
                    }
                });
            }
            return userLayers;
        };
        /**
         * Determines the number of decimal places in a number.
         * @param num Number to get decimal places for.
         */
        Utils.decimalPlaces = function (num) {
            var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) {
                return 0;
            }
            return Math.max(0, 
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
                - (match[2] ? +match[2] : 0));
        };
        /**
         * Rounds a number to a specified number of decimal places.
         * @param num The number to round.
         * @param decimals The number of decimal places.
         */
        Utils.round = function (num, decimals) {
            var factorOfTen = Math.pow(10, decimals);
            return Math.round(num * factorOfTen) / factorOfTen;
        };
        Utils.HexCharRx = /&#x[0-9a-zA-Z]+;/g;
        return Utils;
    }());

    /** Tools for processing dynamic legends. */
    var DynamicLegend = /** @class */ (function () {
        function DynamicLegend() {
        }
        /**
         * Serializes the options of a layer used by dynamic legends as a string.
         * @param layer Layer serialize options for.
         */
        DynamicLegend.serializeLayerOptions = function (layer) {
            if (layer['getOptions']) {
                var opt_1 = layer['getOptions']();
                var o = {
                    radius: opt_1.radius,
                    color: opt_1.color,
                    fillColor: opt_1.fillColor,
                    fillPattern: opt_1.fillPattern,
                    strokeColor: opt_1.strokeColor,
                    strokeWidth: opt_1.strokeWidth,
                    strokeGradient: opt_1.strokeGradient,
                    image: (opt_1.iconOptions) ? opt_1.iconOptions.image : 0,
                    minZoom: opt_1.minZoom,
                    maxZoom: opt_1.maxZoom,
                    visible: opt_1.visible,
                    //OgcMapLayer
                    activeLayers: opt_1.activeLayers
                };
                if (azmaps.layer['SimpleDataLayer'] && layer instanceof azmaps.layer['SimpleDataLayer']) {
                    var s_1 = [o];
                    var subLayers_1 = layer['getLayers']();
                    var subLayerTypes = ['bubbleLayer', 'extrudedPolygonLayer', 'lineLayer', 'polygonLayer', 'symbolLayer'];
                    subLayerTypes.forEach(function (sl) {
                        var l = subLayers_1[sl];
                        var isExtrusion = sl === 'extrudedPolygonLayer';
                        if (l && (!isExtrusion || (isExtrusion && opt_1.allowExtrusions))) {
                            s_1.push(DynamicLegend.serializeLayerOptions(l));
                        }
                    });
                    return JSON.stringify(s_1);
                }
                return JSON.stringify(o);
            }
            return;
        };
        /**
         * Parses a dynamic legend type into one or more simple legend types (Category, Gradient, or Image).
         * @param legendType The legend type settings.
         * @param legendControl The legend control the legend type is being used with.
         * @returns An array of legend types
         */
        DynamicLegend.parse = function (legendType, legendControl) {
            var self = DynamicLegend;
            var legends = [];
            var layer = Utils.getLayer(legendType.layer, legendControl._map);
            if (layer) {
                var azLayers = azmaps.layer;
                var parseStyle = self._parseStyle;
                var overrideCategoryValue = self._overrideCategoryValue;
                var opt = {};
                if (layer['getOptions']) {
                    opt = layer['getOptions']();
                }
                if (opt.visible) {
                    //Only create legends when there are multiple possible values for a style property (expression).
                    if (layer instanceof azLayers.BubbleLayer) {
                        //color
                        parseStyle(layer, 'color', 'color', legendType, legendControl, legends);
                        //radius
                        var radiusLegend = parseStyle(layer, 'radius', 'scale', legendType, legendControl, legends);
                        //If a scale legend was created for radius, double the scale size since thats a diameter.
                        if (radiusLegend) {
                            if (radiusLegend.type === 'category') {
                                radiusLegend.items.forEach(function (item) {
                                    item.shapeSize *= 2;
                                });
                            }
                            //If there is a single color string set on the layer, modify the color of category.
                            if (typeof opt.color === 'string') {
                                overrideCategoryValue(radiusLegend, 'color', opt.color);
                            }
                        }
                    }
                    else if (layer instanceof azLayers.LineLayer) {
                        //strokeGradient
                        var strokeGradientLegend = parseStyle(layer, 'strokeGradient', 'color', legendType, legendControl, legends, true);
                        //If stroke gradient is specified, stroke color is ignored by Azure Maps.
                        if (strokeGradientLegend) {
                            overrideCategoryValue(strokeGradientLegend, 'shape', 'line');
                        }
                        else {
                            //strokeColor
                            overrideCategoryValue(parseStyle(layer, 'strokeColor', 'color', legendType, legendControl, legends, true), 'shape', 'line');
                        }
                        //strokeWidth
                        var strokeWidthLegend = parseStyle(layer, 'strokeWidth', 'scale', legendType, legendControl, legends);
                        overrideCategoryValue(strokeWidthLegend, 'shape', 'line');
                        if (strokeWidthLegend && !strokeGradientLegend && typeof opt.strokeColor === 'string') {
                            overrideCategoryValue(strokeWidthLegend, 'color', opt.strokeColor);
                        }
                    }
                    else if (layer instanceof azLayers.PolygonLayer || layer instanceof azLayers.PolygonExtrusionLayer) {
                        //fillPattern
                        var fillPatternLegend = parseStyle(layer, 'fillPattern', 'image', legendType, legendControl, legends);
                        //If fill pattern is specified, fill color is ignored by Azure Maps.
                        if (fillPatternLegend) {
                            overrideCategoryValue(fillPatternLegend, 'shape', 'square');
                        }
                        else {
                            //fillColor - If category legend, override shape with square if not already specified.
                            overrideCategoryValue(parseStyle(layer, 'fillColor', 'color', legendType, legendControl, legends), 'shape', 'square');
                        }
                    }
                    else if (layer instanceof azLayers.HeatMapLayer) {
                        //color
                        parseStyle(layer, 'color', 'color', legendType, legendControl, legends, true);
                    }
                    else if (layer instanceof azLayers.SymbolLayer) {
                        var iconOptions = opt.iconOptions;
                        if (iconOptions) {
                            //If the image is a string, then there is only one image for the layer. 
                            if (typeof iconOptions.image === 'string') {
                                //Check to see if the image is scaled.
                                if (iconOptions.size && Array.isArray(iconOptions.size)) {
                                    //Try retrieving the image.
                                    var img = self._getValue(iconOptions.image, 'image', legendControl);
                                    if (img && img.shape) {
                                        overrideCategoryValue(parseStyle(layer, 'size', 'scale', legendType, legendControl, legends), 'shape', img.shape);
                                    }
                                }
                            }
                            else {
                                //image
                                parseStyle(layer, 'image', 'image', legendType, legendControl, legends);
                            }
                        }
                    }
                    else if (azLayers['OgcMapLayer'] && layer instanceof azLayers['OgcMapLayer']) {
                        //https://docs.microsoft.com/en-us/azure/azure-maps/spatial-io-add-ogc-map-layer
                        //https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Spatial%20IO%20Module/OGC%20Web%20Map%20Service%20explorer.html
                        var l = layer;
                        //Monitor for when the active layers change.
                        l.onActiveLayersChanged = function (ogcLayer) {
                            if (!ogcLayer._client._capabilities) {
                                ogcLayer.getCapabilities().then(function (cap) {
                                    if (cap) {
                                        legendControl._rebuildContainer();
                                    }
                                });
                            }
                            else {
                                legendControl._rebuildContainer();
                            }
                        };
                        var defaultImage_1 = legendType.defaultImage || {};
                        var activeLayers = opt.activeLayers;
                        var client = l._client;
                        //If there is no client or capabilities, these need to be loaded.
                        if (client && client._capabilities && activeLayers) {
                            var sublayers_1 = client._capabilities.sublayers;
                            if (sublayers_1) {
                                activeLayers.forEach(function (al) {
                                    for (var i = 0; i < sublayers_1.length; i++) {
                                        if ((typeof al === 'string' && al === sublayers_1[i].id) || al.id === sublayers_1[i].id) {
                                            var styles = al.styles;
                                            if (styles && styles.length > 0 && styles[0].legendUrl && styles[0].legendUrl !== '') {
                                                legends.push({
                                                    type: 'image',
                                                    url: styles[0].legendUrl.replace(/\&amp;/g, '&'),
                                                    subtitle: al.title || al.subtitle || sublayers_1[i].id || '',
                                                    footer: al.description || al.abstract || '',
                                                    minZoom: al.minZoom,
                                                    maxZoom: al.maxZoom,
                                                    maxHeight: defaultImage_1.maxHeight,
                                                    maxWidth: defaultImage_1.maxWidth
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                    else if (azLayers['SimpleDataLayer'] && layer instanceof azLayers['SimpleDataLayer']) ;
                }
            }
            return legends;
        };
        /**
         * Generates a legend type settings for a layers style property.
         * @param property The style property to parse.
         * @param type The type of style property being parsed.
         * @param legendType The parent legend type.
         * @param legendControl The legend control.
         * @param legends The array of legends that have been created.
         * @param overrideLabels Specifies if labels should be overriden
         * @returns The generated legend incase any post-processing is needed.
         */
        DynamicLegend._parseStyle = function (layer, property, type, legendType, legendControl, legends, overrideLabels) {
            if (layer['getOptions']) {
                var self_1 = DynamicLegend;
                var opt = layer['getOptions']();
                var exp = opt[property];
                if (!exp && opt.iconOptions && property === 'image' && type === 'image') {
                    exp = opt.iconOptions[property];
                }
                if (self_1._isExp(exp)) {
                    var l = void 0;
                    switch (exp[0]) {
                        case 'step':
                            l = self_1._parseStep(layer, exp, type, legendType, legendControl);
                            break;
                        case 'match':
                            l = self_1._parseMatch(layer, exp, type, legendType, legendControl);
                            break;
                        case 'interpolate': //color, scale
                            l = self_1._parseInterpolation(layer, exp, type, legendType);
                            break;
                    }
                    if (l) {
                        switch (l.type) {
                            case 'category':
                                if (legendType.defaultCategory) {
                                    Object.assign(l, legendType.defaultCategory);
                                }
                                break;
                            case 'gradient':
                                if (overrideLabels) {
                                    var lg = l;
                                    lg.stops.forEach(function (stop) {
                                        stop.label = undefined;
                                    });
                                    lg.stops[0].label = 'low';
                                    lg.stops[lg.stops.length - 1].label = 'high';
                                }
                                if (legendType.defaultGradient) {
                                    Object.assign(l, legendType.defaultGradient);
                                }
                                break;
                            case 'image':
                                if (legendType.defaultImage) {
                                    Object.assign(l, legendType.defaultImage);
                                }
                                break;
                        }
                        if (typeof opt.minZoom === 'number') {
                            l.minZoom = opt.minZoom;
                        }
                        if (typeof opt.maxZoom === 'number') {
                            l.maxZoom = opt.maxZoom;
                        }
                        l.cssClass = legendType.cssClass;
                        legends.push(l);
                        return l;
                    }
                }
            }
            return;
        };
        /**
          * Parses a `step` expression into a legend type.
          * @param exp Expression to parse.
          * @param type The type of style property the expression is for.
          * @param legendType The dynamic legend type settings.
          * @param legendControl The legend control the legend is for.
          * @returns A legend type or null.
          */
        DynamicLegend._parseStep = function (layer, exp, type, legendType, legendControl) {
            /*
             ["step",
                input: number,
                base_output: number | string,
                stop_input_1: number, stop_output_1: number | string,
                stop_input_n: number, stop_output_n: number | string, ...
            ]

            [
                'step',
                ['get', 'traffic_level'],
                '#6B0512', //Dark red
                0.01, '#EE2F53', //Red
                0.8, 'orange', //Orange
                1, "#66CC99" //Green
            ]
            */
            //type == color -> stepped gradient, type == scale -> category, type == image -> category  
            if (exp.length >= 5 && exp.length % 2 === 1) {
                var self_2 = DynamicLegend;
                var getString = Utils.getString;
                //Category legend.
                var items = [];
                var len = exp.length;
                var base = exp[2];
                var opt = legendControl.getOptions();
                var resx = opt.resx;
                if (((type === 'color' || type === 'image') && typeof base !== 'string') ||
                    (type === 'scale' && typeof base !== 'number')) {
                    return;
                }
                //Base item.
                var baseItem = self_2._getValue(base, type, legendControl);
                if (!baseItem) {
                    return;
                }
                var defaultCategory = legendType.defaultCategory;
                var numberFormat = void 0;
                var numberFormatLocales = void 0;
                if (defaultCategory) {
                    numberFormat = defaultCategory.numberFormat;
                    numberFormatLocales = defaultCategory.numberFormatLocales;
                }
                var lastLabel = getString(exp[3], resx, numberFormatLocales, numberFormat);
                baseItem.label = '<' + lastLabel;
                items.push(baseItem);
                //Stop items.
                for (var i = 3; i < len; i += 2) {
                    var stop_1 = self_2._getValue(exp[i + 1], type, legendControl);
                    if (!stop_1) {
                        return;
                    }
                    stop_1.label = getString(exp[i], resx, numberFormatLocales, numberFormat);
                    if (i === len - 2) {
                        stop_1.label = '>' + lastLabel;
                    }
                    else {
                        var l = getString(exp[i + 2], resx, numberFormatLocales, numberFormat);
                        stop_1.label = lastLabel + " - " + l;
                        lastLabel = l;
                    }
                    items.push(stop_1);
                }
                return {
                    type: 'category',
                    items: items,
                    subtitle: legendType.subtitle || self_2._getSubtitle(legendType.subtitleFallback, exp[1], layer),
                    footer: legendType.footer || self_2._getFooter(legendType.footerFallback, layer),
                    //Prefer descending order when displaying colors or scales, as it looks nicer.
                    layout: type !== 'image' ? 'column-reverse' : 'column',
                    //Prefer to collapse the space around the shapes when displaying color.
                    collapse: type === 'color'
                };
            }
        };
        /**
         * Parses a `match` expression into a legend type.
         * @param exp Expression to parse.
         * @param type The type of style property the expression is for.
         * @param legendType The dynamic legend type settings.
         * @param legendControl The legend control the legend is for.
         * @returns A legend type or null.
         */
        DynamicLegend._parseMatch = function (layer, exp, type, legendType, legendControl) {
            /*
                Partial, labels with number/string arrays not supported.

                "no data" value will be used as label for fallback. Add a "no data" key to the resx to override label text.

                [
                    'match',
                    input: number | string,
                    label1: number | string,
                    output1: value,
                    label2: number | string,
                    output2: value,
                    ...,
                    fallback: value
                ]
        
                [
                    'match',
                    ['get', 'magnitude'],
                    1, 'green',
                    2, 'orange',
                    3, 'red',
                    'gray'
                ]
        
                [
                    'match',
        
                    ['get', 'EntityType'],
        
                    //For each entity type, specify the icon name to use.
                    'Gas Station', 'gas_station_icon',
                    'Grocery Store', 'grocery_store_icon',
                    'Restaurant', 'restaurant_icon',
                    'School', 'school_icon',
        
                    //Default fallback icon.
                    'marker-blue'
                ]
            */
            if (exp.length >= 5 && exp.length % 2 === 1) {
                //Category legend for all types.
                var self_3 = DynamicLegend;
                var items = [];
                //Stop items.
                for (var i = 2, len = exp.length - 1; i < len; i += 2) {
                    var stop_2 = self_3._getValue(exp[i + 1], type, legendControl);
                    if (!stop_2) {
                        return;
                    }
                    stop_2.label = exp[i];
                    items.push(stop_2);
                }
                //Fallback item.
                var fallback = self_3._getValue(exp[exp.length - 1], type, legendControl);
                if (!stop) {
                    return;
                }
                fallback.label = 'no data';
                items.push(fallback);
                return {
                    type: 'category',
                    items: items,
                    subtitle: legendType.subtitle || self_3._getSubtitle(legendType.subtitleFallback, exp[1], layer),
                    footer: legendType.footer || self_3._getFooter(legendType.footerFallback, layer),
                    //Prefer to collapse the space around the shapes when displaying color.
                    collapse: type === 'color'
                };
            }
        };
        /**
         * Parses an `interpolation` expression into a legend type.
         * @param exp Expression to parse.
         * @param type The type of style property the expression is for.
         * @param legendType The dynamic legend type settings.
         * @returns A legend type or null.
         */
        DynamicLegend._parseInterpolation = function (layer, exp, type, legendType) {
            /*
                Supports only linear and exponential interpolation. "cubic-bezier" interpolation not supported.

                type == color -> gradient
                type == scale -> category

                ["interpolate",
                    interpolation: ["linear"] | ["exponential", base],
                    input: number,
                    stop_input_1: number, stop_output_1: OutputType,
                    stop_input_n: number, stop_output_n: OutputType, ...
                ]

                [
                    'interpolate',
                    ['linear'],
                    ['get', 'PopChange' + i],
                    -maxScale, 'rgb(255,0,255)',       // Magenta
                    -maxScale / 2, 'rgb(0,0,255)',     // Blue
                    0, 'rgb(0,255,0)',                 // Green
                    maxScale / 2, 'rgb(255,255,0)',    // Yellow
                    maxScale, 'rgb(255,0,0)'           // Red
                ]
        
                 [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    0, 'green',
                    5, 'yellow',
                    6, 'orange',
                    7, 'red'
                ]
            */
            if (exp.length >= 7 && exp.length % 2 === 1) {
                var self_4 = DynamicLegend;
                var subtitle = legendType.subtitle || self_4._getSubtitle(legendType.subtitleFallback, exp[2], layer);
                var footer = legendType.footer || self_4._getFooter(legendType.footerFallback, layer);
                var minLabel = exp[3];
                var maxLabel = exp[exp.length - 2];
                if (type === 'color') { //Gradient legend
                    var interpFn = self_4._getInterpFn(exp[1], minLabel, maxLabel);
                    if (interpFn) {
                        var stops = [];
                        var lastOffset = -1;
                        //The minimum offset space required between labels. Doing this to reduce label collision.
                        var minLabelOffset = 0.05;
                        for (var i = 3, len = exp.length; i < len; i += 2) {
                            //Get a value between 0 and 1.
                            var label = exp[i];
                            var output = exp[i + 1];
                            if (typeof output !== 'string') {
                                return;
                            }
                            var offset = interpFn(label);
                            //If the space between offsets is too small, don't add the label.
                            if (offset - lastOffset < minLabelOffset) {
                                label = undefined;
                                lastOffset = offset;
                            }
                            stops.push({
                                offset: offset,
                                label: label,
                                color: output
                            });
                        }
                        return {
                            type: 'gradient',
                            stops: stops,
                            subtitle: subtitle,
                            footer: footer
                        };
                    }
                }
                else if (type === 'scale') { //Category legend
                    var items = [];
                    for (var i = 3, len = exp.length; i < len; i += 2) {
                        //Get a value between 0 and 1.
                        var label = exp[i];
                        var output = exp[i + 1];
                        if (typeof output !== 'number') {
                            return;
                        }
                        items.push({
                            shapeSize: (output === 0) ? 0.01 : output,
                            label: label
                        });
                    }
                    //When there are only two items in the scale, add a mid-point otherwise there is no way to know the difference between linear and exponential.
                    if (exp.length === 7) {
                        //Calculate mid-point.
                        var dx = maxLabel - minLabel;
                        var midLabel = minLabel + dx / 2;
                        var interpFn = self_4._getInterpFn(exp[1], minLabel, maxLabel);
                        var minOutput = exp[4];
                        var maxOutput = exp[6];
                        var midOutput = interpFn(midLabel) * (maxOutput - minOutput) + minOutput;
                        //Allow one extra decimal place from existing labels since we divided by two earlier.
                        midLabel = Utils.round(midLabel, Math.max(Utils.decimalPlaces(minLabel), Utils.decimalPlaces(maxLabel)) + 1);
                        //Insert before last item.
                        items.splice(items.length - 1, 0, {
                            shapeSize: midOutput,
                            label: midLabel
                        });
                    }
                    //Prefer that when displaying scales, should in descending order as it looks nicer.
                    return {
                        type: 'category',
                        items: items,
                        layout: 'column-reverse',
                        subtitle: subtitle,
                        footer: footer,
                        fitItems: true
                    };
                }
                //type = image - not supported.
            }
            return;
        };
        /**
         * Parses a simple input getter of an expression.
         * @param input The input expression.
         * @returns The getter property name.
         */
        DynamicLegend._parseInputGetter = function (input) {
            if (Array.isArray(input) && input[0] === 'get' && typeof input[1] === 'string') {
                return input[1];
            }
            return;
        };
        /**
         * Returns a function that processes an interpolation on a value.
         * @param interpExp The interpolation expression.
         * @param values The data range values.
         * @returns A function that processes an interpolation on a value.
         */
        DynamicLegend._getInterpFn = function (interpExp, minValue, maxValue) {
            //["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2]
            var type = interpExp[0];
            var difference = maxValue - minValue;
            if (difference === 0) {
                return function (x) {
                    return 0;
                };
            }
            if (type === 'linear') {
                return function (x) {
                    var progress = (x - minValue);
                    return progress / difference;
                };
            }
            else if (type === 'exponential') {
                var base_1 = interpExp[1];
                return function (x) {
                    var progress = (x - minValue);
                    return (Math.pow(base_1, progress) - 1) / (Math.pow(base_1, difference) - 1);
                };
            }
            return;
        };
        /**
         * Determines if an object is possibly an expression.
         * @param obj An object to check.
         * @returns Boolean indicating if object likely an expression or not.
         */
        DynamicLegend._isExp = function (obj) {
            return (obj && Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'string');
        };
        /**
         * Overrides a property on a category legend type.
         * @param legend The legend type.
         * @param property The property of the legend type to override.
         * @param value The value to set.
         */
        DynamicLegend._overrideCategoryValue = function (legend, property, value) {
            //Check if legend exists, is category type, and doesn't already have the property value defined.
            if (legend && legend.type === 'category' && !legend[property]) {
                legend[property] = value;
            }
        };
        /**
         * Takes a raw value, validates, and sets it correctly on the appropriate CategoryItem property depending on the type of style property the value is for.
         * @param val The raw value to retrieve.
         * @param type The type of style property the value is for.
         * @param legendControl The legend control.
         * @returns A simple CategoryItem or null.
         */
        DynamicLegend._getValue = function (val, type, legendControl) {
            var value;
            var isString = typeof val === 'string';
            if (type === 'color' && isString) {
                value = { color: val };
            }
            else if (type === 'scale' && typeof val === 'number') {
                value = { shapeSize: val === 0 ? 0.01 : val };
            }
            else if (type === 'image' && isString && legendControl._map) {
                var img = this._getImage(legendControl._map, val);
                if (img) {
                    value = { shape: img };
                }
            }
            return value;
        };
        /**
         * Tries to retrieve the image source for an image in the maps image sprite.
         * @param map A map instance.
         * @param imgName The name of the image.
         * @returns Image source string, or null.
         */
        DynamicLegend._getImage = function (map, imgName) {
            if (map && imgName !== 'none') {
                //Check user defined images.
                if (map.imageSprite.hasImage(imgName)) {
                    //@ts-ignore
                    return map.imageSprite.userImages.get(imgName).src;
                }
                //Try built in images. 
                var template = void 0;
                var color = void 0;
                if (imgName.startsWith('marker')) {
                    template = 'marker';
                    color = imgName.replace('marker-', '');
                }
                else if (imgName.startsWith('pin-round')) {
                    template = 'pin-round';
                    color = imgName.replace('pin-round-', '');
                }
                else if (imgName.startsWith('pin')) {
                    template = 'pin';
                    color = imgName.replace('pin-', '');
                }
                if (template) {
                    var defaultColors = {
                        'black': '#231f20',
                        'blue': '#1a73aa',
                        'darkblue': '#003963',
                        'red': '#ef4c4c',
                        'yellow': '#f2c851'
                    };
                    color = defaultColors[color];
                    if (color) {
                        return azmaps.getImageTemplate(template, 1).replace(/{color}/g, color).replace(/{secondaryColor}/g, '#fff').replace(/{text}/g, '');
                    }
                }
            }
            return;
        };
        /**
         * Gets a subtitle string value.
         * @param method The extraction method.
         * @param expression An expression to try and extract the property name from.
         * @param layer The layer.
         * @returns
         */
        DynamicLegend._getSubtitle = function (method, exp, layer) {
            method = method || 'auto';
            if (method === 'none') {
                return;
            }
            var metadata = layer.metadata || {};
            var id = layer.getId();
            if (method === 'auto') {
                return metadata['title'] || metadata['subtitle'] || id;
            }
            else if (method === 'expression') {
                return this._parseInputGetter(exp) || id;
            }
            return metadata[method] || '';
        };
        /**
         * Gets a footer string value.
         * @param method The extraction method.
         * @param layer The layer.
         */
        DynamicLegend._getFooter = function (method, layer) {
            method = method || 'auto';
            var metadata = layer.metadata || {};
            if (method === 'auto') {
                return metadata['footer'] || metadata['description'] || metadata['abstract'] || '';
            }
            else if (method !== 'none') {
                return metadata[method] || '';
            }
            return;
        };
        return DynamicLegend;
    }());

    var BaseControl = /** @class */ (function (_super) {
        __extends(BaseControl, _super);
        /****************************
         * Constructor
         ***************************/
        /**
         * A control that displays a legend.
         * @param nameIdx The localization index of the controls name; 0 - Legend control, 1 - Layer control
         * @param cssClass The root CSS class for the control.
         * @param btnCSS The CSS for the button icon to display when control collapsed into a button.
         */
        function BaseControl(nameIdx, cssClass, btnCSS) {
            var _this = _super.call(this) || this;
            _this._needsRebuild = false;
            _this._rebuildOnStyleChange = false;
            _this._darkColor = '#011c2c';
            _this._baseOptions = {
                layout: 'carousel',
                style: 'light',
                visible: true,
                zoomBehavior: 'hide',
                showToggle: true,
                minimized: false
            };
            _this._currentIdx = 0;
            _this._hasZoomableContent = false;
            _this._btnRotation = 0;
            _this._controlCount = 0;
            /****************************
             * Private Methods
             ***************************/
            _this._checkControlCount = function () {
                var self = _this;
                var map = self._map;
                if (map) {
                    var cnt = map.controls.getControls().length;
                    if (self._controlCount !== cnt) {
                        self._controlCount = cnt;
                        //Ensure control fits.
                        self._adjustSize();
                    }
                }
            };
            /**
             * Event handler for when the map zoom level has changed.
             * Layer options are disabled when zoom outside of their min/max zoom level.
             */
            _this._mapZoomChanged = function (e) {
                var self = _this;
                var content = self._content;
                var opt = self._baseOptions;
                if (content) {
                    if (self._hasZoomableContent) {
                        var zoom = self._map.getCamera().zoom;
                        //Will either be the first visible legend, or the current index.
                        var fallbackIdx = void 0;
                        var cards = content.querySelectorAll('.atlas-layer-legend-card');
                        var handles = content.querySelectorAll('.atlas-carousel-dot, .atlas-accordion-button');
                        for (var i = 0; i < cards.length; i++) {
                            var card = cards[i];
                            var idx = parseInt(card.getAttribute('rel'));
                            var minZoom = parseInt(card.getAttribute('data-min-zoom'));
                            var maxZoom = parseInt(card.getAttribute('data-max-zoom'));
                            var zoomBehavior = card.getAttribute('data-zoom-behavior');
                            var inRange = (zoom >= minZoom && Math.ceil(zoom) <= maxZoom);
                            var display = (inRange) ? '' : 'none';
                            if (zoomBehavior === 'hide') {
                                if (opt.layout === 'carousel' || opt.layout === 'accordion') {
                                    if (handles.length > 0) {
                                        //Handles only exist in carousel and accordion mode.
                                        handles[i].style.display = display;
                                    }
                                }
                                else {
                                    //Hide cards when list layout. 
                                    card.style.display = display;
                                }
                            }
                            if (inRange && (typeof fallbackIdx === 'undefined' || idx === self._currentIdx)) {
                                fallbackIdx = idx;
                            }
                            //Need to apply similar logic to state items which are wrapped as a label or option.
                            var elms = card.querySelectorAll('label, option');
                            Utils.processZoomRangeAttr(elms, zoom);
                        }
                        if (opt.zoomBehavior === 'hide') {
                            //Case when there is no layers visible, hide the layer control, but only if it is meant to be visible.
                            if (opt.visible && !opt.minimized) {
                                content.style.display = (typeof fallbackIdx === 'undefined') ? 'none' : '';
                            }
                            if (self._currentIdx !== fallbackIdx) {
                                self._setItemIndex(fallbackIdx, true);
                            }
                        }
                    }
                    else if (opt.visible && !opt.minimized) {
                        //Ensure legend if visible.
                        content.style.display = '';
                    }
                }
            };
            /**
             * Rebuilds the container.
             */
            _this._rebuildContainer = function () {
                var self = _this;
                var opt = self._baseOptions;
                var container = self._container;
                self._createContent();
                self._setStyle(opt.style);
                var content = self._content;
                if (!opt.visible) {
                    container.style.display = 'none';
                    content.style.display = 'none';
                }
                if (!opt.container) {
                    if (self._btn) {
                        self._btn.remove();
                    }
                    //Create expansion button.
                    var btnStyle = {
                        display: opt.showToggle ? '' : 'none',
                        backgroundColor: self._bgColor
                    };
                    var rotation = 90;
                    var position = self._controlPosition;
                    if (!position || position === 'non-fixed') {
                        position = 'top-left';
                    }
                    var isLeft = position.indexOf('left') > -1;
                    var isTop = position.indexOf('top') > -1;
                    if (isTop) {
                        btnStyle.bottom = '0';
                        rotation = isLeft ? 180 : 270;
                    }
                    else {
                        btnStyle.top = '0';
                        rotation = isLeft ? 90 : 0;
                    }
                    if (isLeft) {
                        btnStyle.right = '0';
                    }
                    else {
                        btnStyle.left = '0';
                    }
                    btnStyle.transform = "rotate(" + rotation + "deg)";
                    self._btnRotation = rotation;
                    container.onclick = self._contentBtnClicked;
                    var btn = document.createElement("button");
                    btn.setAttribute('type', 'button');
                    btn.classList.add('atlas-layer-legend-expand-btn');
                    Object.assign(btn.style, btnStyle);
                    btn.addEventListener('click', self._toggle);
                    container.appendChild(btn);
                    var ariaLabel = self._localization[self._nameIdx] + ' - ' + self._localization[3]; //Collapse
                    btn.setAttribute('title', ariaLabel);
                    btn.setAttribute('alt', ariaLabel);
                    self._btn = btn;
                    self._setBtnState();
                }
                self._mapZoomChanged(null);
                self._adjustSize();
            };
            /**
            * An event handler for when the map style changes. Used when control style is set to auto.
            */
            _this._mapStyleChanged = function () {
                _this._setColorFromMapStyle();
                if (_this._rebuildOnStyleChange) {
                    _this._rebuildContainer();
                }
            };
            /**
             * Event handler for a dot in a carousel is clicked.
             * @param e Event args
             */
            _this._handledClicked = function (e) {
                var self = _this;
                var elm = e.target;
                var idx = parseInt(elm.getAttribute('rel'));
                //If an active accordion button is pressed, closed it.
                if (self._baseOptions.layout === 'accordion' && elm.classList.contains('active')) {
                    idx = -1;
                }
                self._setItemIndex(idx, true);
            };
            /**
             * Toggle event handler for expand/collapse button.
             */
            _this._toggle = function (e) {
                var self = _this;
                var opt = self._baseOptions;
                opt.minimized = !opt.minimized;
                self._setBtnState();
                e.stopPropagation();
                e.preventDefault();
                return false;
            };
            /** Event handler for when collapsed container is clicked. */
            _this._contentBtnClicked = function (e) {
                if (_this._baseOptions.minimized) {
                    _this._toggle(e);
                }
            };
            var self = _this;
            self._nameIdx = nameIdx;
            self._cssClass = cssClass;
            self._btnCSS = btnCSS;
            return _this;
        }
        /****************************
         * Public Methods
         ***************************/
        /**
         * Action to perform when the control is added to the map.
         * @param map The map the control was added to.
         * @param options The control options used when adding the control to the map.
         * @returns The HTML Element that represents the control.
         */
        BaseControl.prototype.onAdd = function (map, options) {
            var self = this;
            self._map = map;
            var lang = map.getStyle().language || azmaps__default.getLanguage();
            if (lang && lang.indexOf('-') > 0) {
                lang = lang.substring(0, lang.indexOf('-'));
            }
            var t = BaseControl._translations;
            var localization = t[lang];
            if (!localization) {
                localization = t['en'];
            }
            self._localization = localization;
            if (options) {
                self._controlPosition = options.position;
            }
            var container = document.createElement('div');
            container.classList.add('azure-maps-control-container');
            if (self._cssClass) {
                container.classList.add(self._cssClass);
            }
            var controlName = localization[self._nameIdx];
            if (controlName) {
                container.setAttribute('aria-label', controlName);
            }
            self._container = container;
            var mcl = map.getMapContainer().classList;
            if (mcl.contains("high-contrast-dark")) {
                self._hclStyle = 'dark';
            }
            else if (mcl.contains("high-contrast-light")) {
                self._hclStyle = 'light';
            }
            self._setStyle(self._baseOptions.style);
            self._rebuildContainer();
            if (typeof self._baseOptions.visible !== 'undefined') {
                var display = (self._baseOptions.visible) ? '' : 'none';
                if (container) {
                    container.style.display = display;
                }
                if (self._content) {
                    self._content.style.display = display;
                }
            }
            self._controlWatcher = setInterval(self._checkControlCount, 1000);
            map.events.add('zoomend', self._mapZoomChanged);
            self._mapZoomChanged(null);
            return container;
        };
        /**
        * Action to perform when control is removed from the map.
        */
        BaseControl.prototype.onRemove = function () {
            var self = this;
            if (self._content) {
                self._content.remove();
                self._content = null;
            }
            if (self._container) {
                self._container.remove();
                self._container = null;
            }
            if (self._controlWatcher) {
                clearInterval(self._controlWatcher);
                self._controlWatcher = null;
            }
            var map = self._map;
            if (map) {
                if (self._baseOptions.style.startsWith('auto')) {
                    map.events.remove('styledata', self._mapStyleChanged);
                }
                map.events.remove('zoomend', self._mapZoomChanged);
            }
            self._map = null;
        };
        /**
         * Sets the base options of the control.
         * @param options The options to set.
         */
        BaseControl.prototype.setOptions = function (options) {
            options = options || {};
            var self = this;
            var opt = self._baseOptions;
            var container = self._container;
            var content = self._content;
            var needsZoomFilter = false;
            if (options.style !== undefined) {
                opt.style = options.style;
                self._setStyle(options.style);
            }
            if (options.zoomBehavior !== undefined) {
                opt.zoomBehavior = options.zoomBehavior;
                self._needsRebuild = true;
            }
            if (options.visible !== undefined) {
                opt.visible = options.visible;
                var display = (options.visible) ? '' : 'none';
                if (container) {
                    container.style.display = display;
                }
                if (content) {
                    content.style.display = display;
                }
                needsZoomFilter = true;
            }
            if (options.minimized !== undefined && opt.minimized !== options.minimized) {
                opt.minimized = options.minimized;
                self._setBtnState();
            }
            if (options.container !== undefined) {
                opt.minimized = false;
                self._setBtnState();
                opt.container = options.container;
                self._needsRebuild = true;
            }
            if (options.layout !== undefined && opt.layout !== options.layout) {
                opt.layout = options.layout;
                self._needsRebuild = true;
            }
            if (options.showToggle !== undefined && opt.showToggle !== options.showToggle) {
                opt.showToggle = options.showToggle;
                if (!options.showToggle) {
                    //If no toggle displayed, don't minimize control.
                    options.minimized = false;
                }
                self._setBtnState();
            }
            if (self._needsRebuild && self._map) {
                self._rebuildContainer();
            }
            else if (needsZoomFilter) {
                self._mapZoomChanged(null);
            }
        };
        /** Adds a card to the container. */
        BaseControl.prototype._addCard = function (card, dotContainer, item, handleText) {
            var self = this;
            var content = self._content;
            var layout = self._baseOptions.layout;
            var handle;
            if (layout === 'carousel') {
                handle = document.createElement('button');
                handle.className = 'atlas-carousel-dot';
                dotContainer.appendChild(handle);
                content.appendChild(card);
            }
            else if (layout === 'accordion') {
                handle = document.createElement('button');
                handle.className = 'atlas-accordion-button';
                handle.innerHTML = handleText;
                content.appendChild(handle);
                content.appendChild(card);
            }
            else {
                //Ensure to fallback incase user passed in bad value.
                self._baseOptions.layout = 'list';
                content.appendChild(card);
            }
            if (handle) {
                var idx = card.getAttribute('rel');
                handle.setAttribute('rel', idx);
                handle.setAttribute('aria-label', handleText);
                handle.setAttribute('title', handleText);
                handle.setAttribute('aria-controls', card.id);
                handle.onclick = self._handledClicked.bind(self);
                if (self._currentIdx === parseInt(idx)) {
                    card.style.display = '';
                    handle.setAttribute('aria-expanded', 'true');
                    handle.classList.add('active');
                }
                else {
                    handle.setAttribute('aria-expanded', 'false');
                    card.style.display = 'none';
                }
            }
            //Store min/max zoom info as attributes.
            Utils.setZoomRangeAttr(item, self._baseOptions, card, handle);
        };
        BaseControl.prototype._adjustSize = function () {
            var self = this;
            var opt = self._baseOptions;
            var container = self._container;
            if (self._map) {
                var maxWidth_1 = 'unset';
                var maxHeight_1 = 'unset';
                //When legend is displayed within the map, need to restrict the size of the legend content.
                if (!opt.container) {
                    var rect = self._map.getCanvasContainer().getClientRects()[0];
                    //Subtract 20 pixels to account for padding around controls in the map.
                    maxWidth_1 = (rect.width - 20) + 'px';
                    var maxContainerHeight = rect.height - 20;
                    var cp = self._controlPosition;
                    if (cp && cp !== '' && cp !== 'non-fixed') {
                        var side_1 = (cp.indexOf('left') > -1) ? 'left' : 'right';
                        //Determine how many controls exist in the same position.
                        var cnt_1 = 0;
                        //@ts-ignore
                        var controlContainers = self._map.controls.controlContainer.children;
                        Array.from(controlContainers).forEach(function (c) {
                            if (c.className.indexOf(side_1) > -1) {
                                cnt_1 += c.children.length;
                            }
                        });
                        if (cnt_1 > 1) {
                            //Account for this control.
                            cnt_1--;
                            //Account for legend control which we know uses a non-fixed position but is in the bottom right corner of the map.
                            if (cp.indexOf('right') > -1) {
                                cnt_1++;
                            }
                            //Give all other controls 35px space (button size), and 20px map padding.
                            maxContainerHeight = Math.min(maxContainerHeight, rect.height - cnt_1 * 35 - 20);
                        }
                    }
                    //Set the max height of the container to 75% of the maps height, or the height minus 20 pixels, whichever is smaller.
                    Object.assign(container.style, {
                        maxHeight: maxContainerHeight + 'px',
                        maxWidth: maxWidth_1
                    });
                    if (opt.layout === 'accordion') {
                        //Need to account for additional height to account fro button size. Give 30px per button and 20px for the title.
                        var accordBtns = container.querySelectorAll('.atlas-accordion-button');
                        maxContainerHeight = (maxContainerHeight - accordBtns.length * 30 - 20);
                        maxHeight_1 = maxContainerHeight + 'px';
                    }
                    else if (opt.layout === 'carousel') {
                        //Need to account for legend title and dot container height (height - 110px).
                        maxContainerHeight = rect.height - 110;
                        maxHeight_1 = maxContainerHeight + 'px';
                    }
                    if (maxContainerHeight <= 40) {
                        maxHeight_1 = 'unset';
                    }
                    var cardContainers = container.querySelectorAll('.atlas-layer-legend-card');
                    cardContainers.forEach(function (cc) {
                        Object.assign(cc.style, {
                            maxHeight: maxHeight_1,
                            maxWidth: maxWidth_1
                        });
                    });
                }
            }
        };
        /** Sets the style of the control. */
        BaseControl.prototype._setStyle = function (style) {
            if (style) {
                var self_1 = this;
                var map = self_1._map;
                if (map) {
                    if (style.startsWith('auto') && !self_1._hclStyle) {
                        map.events.add('styledata', self_1._mapStyleChanged);
                        self_1._setColorFromMapStyle();
                    }
                    else {
                        map.events.remove('styledata', self_1._mapStyleChanged);
                        self_1._setControlColor(style);
                    }
                }
            }
        };
        /**
         * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
         */
        BaseControl.prototype._setColorFromMapStyle = function () {
            var self = this;
            var theme = 'light';
            //When the style is dark (i.e. satellite, night), show the dark colored theme.
            if (['satellite', 'satellite_road_labels', 'grayscale_dark', 'night', 'high_contrast_dark'].indexOf(self._map.getStyle().style) > -1) {
                theme = 'dark';
            }
            else if (['road', 'grayscale_light', 'road_shaded_relief', 'blank', 'blank_accessible', 'high_contrast_light'].indexOf(self._map.getStyle().style) === -1) {
                //If the map style name isn't known.
                //Check the background color style. Typically dark map styles will have a dark background so that there isn't a flash when tiles are loading.
                var styles = self._map['map'].getStyle();
                for (var i = 0; i < styles.length; i++) {
                    var s = styles[i];
                    if (s.type === 'background') {
                        if (s.paint && typeof s.paint['background-color'] === 'string') {
                            theme = Utils.getColorTheme(s.paint['background-color']);
                        }
                        break;
                    }
                }
            }
            if (self._baseOptions.style === 'auto-reverse') {
                theme = ((theme === 'light') ? 'dark' : 'light');
            }
            self._setControlColor(theme);
        };
        /**
         * Sets the color of the control.
         * @param theme The theme to set.
         */
        BaseControl.prototype._setControlColor = function (theme) {
            var self = this;
            if (self._container || self._content) {
                theme = self._hclStyle || theme;
                var darkColor = self._darkColor;
                var backgroundColor = 'white';
                var color = darkColor;
                //If not a named theme, must be a CSS color. Get it's theme. 
                if (theme !== 'light' && theme !== 'dark' && !theme.startsWith('auto')) {
                    backgroundColor = theme;
                    theme = Utils.getColorTheme(theme);
                    color = (theme === 'dark') ? 'white' : darkColor;
                }
                else if (theme === 'dark') {
                    backgroundColor = darkColor;
                    color = 'white';
                }
                var style = {
                    backgroundColor: backgroundColor,
                    color: color
                };
                if (self._content) {
                    Object.assign(self._content.style, style);
                }
                if (self._container) {
                    Object.assign(self._container.style, style);
                }
                if (self._btn) {
                    self._btn.style.backgroundColor = backgroundColor;
                }
                self._fontColor = color;
                self._bgColor = backgroundColor;
            }
        };
        /**
        * Sets the index of the focused item in the carousel or list.
        * @param idx The index of the item, stored in the 'rel' property.
        * @param focus If the item should have tab focus.
        */
        BaseControl.prototype._setCardIdx = function (idx, focus) {
            var self = this;
            if (self._content) {
                var cards = self._content.getElementsByClassName('atlas-layer-legend-card');
                var handles = self._content.querySelectorAll('.atlas-carousel-dot, .atlas-accordion-button');
                var layout = self._baseOptions.layout;
                var numCards = cards.length;
                if (handles.length === 0) {
                    handles = null;
                }
                if (idx >= numCards) {
                    idx = numCards - 1;
                }
                if (idx < 0 && layout !== 'accordion') {
                    idx = 0;
                }
                self._currentIdx = idx;
                for (var i = 0; i < numCards; i++) {
                    var card = cards[i];
                    var rel = parseInt(card.getAttribute('rel'));
                    if (layout === 'carousel') {
                        if (rel !== idx) {
                            card.style.display = 'none';
                            if (handles) {
                                handles[i].classList.remove('atlas-carousel-dot-active');
                                handles[i].setAttribute('aria-expanded', 'false');
                            }
                        }
                        else {
                            card.style.display = 'block';
                            if (handles) {
                                handles[i].classList.add('atlas-carousel-dot-active');
                                handles[i].setAttribute('aria-expanded', 'true');
                            }
                            if (focus) {
                                self._setItemFocus(card);
                            }
                        }
                    }
                    else if (layout === 'accordion') {
                        if (rel !== idx) {
                            card.style.display = 'none';
                            if (handles) {
                                handles[i].classList.remove('active');
                                handles[i].setAttribute('aria-expanded', 'false');
                            }
                        }
                        else {
                            card.style.display = 'block';
                            if (handles) {
                                handles[i].classList.add('active');
                                handles[i].setAttribute('aria-expanded', 'true');
                            }
                            if (focus) {
                                self._setItemFocus(card);
                            }
                        }
                    }
                    else { //List view.
                        if (rel === idx) {
                            card.scrollIntoView();
                            if (focus) {
                                self._setItemFocus(card);
                            }
                            break;
                        }
                    }
                }
            }
        };
        /**
         * Sets the focus on the first focusable item within an HTML container.
         * @param container A container to focus on.
         */
        BaseControl.prototype._setItemFocus = function (container) {
            //Find focusable elements within the container.
            var elms = container.querySelectorAll('input, button, select, a');
            //Focus on the first item.
            if (elms.length > 0) {
                elms[0].focus();
            }
        };
        /**
         * Sets the minimized state of the expansion button.
         */
        BaseControl.prototype._setBtnState = function () {
            var self = this;
            var btn = self._btn;
            var opt = self._baseOptions;
            if (btn && !opt.container) {
                var btnCss = self._btnCSS;
                var w = '32px';
                var h = '32px';
                var display = 'none';
                var showBtnBg = false;
                var ariaLabel = self._localization[self._nameIdx];
                //If toggle button isn't being to be displayed, then don't allow minimizing.
                var minimized = (opt.minimized && opt.showToggle);
                if (minimized) {
                    ariaLabel += ' - ' + self._localization[2]; //Expand 
                }
                else {
                    showBtnBg = opt.showToggle;
                    display = '';
                    h = 'unset';
                    w = 'unset';
                }
                btn.setAttribute('aria-expanded', !minimized + '');
                var container = self._container;
                if (container) {
                    //Hide/show the content.
                    if (self._content && opt.visible) {
                        self._content.style.display = display;
                    }
                    container.setAttribute('aria-expanded', !minimized + '');
                    var classList = container.classList;
                    if (showBtnBg) {
                        if (!classList.contains(btnCss)) {
                            classList.add(btnCss);
                        }
                        btn.style.display = '';
                        container.style.cursor = '';
                    }
                    else {
                        classList.remove(btnCss);
                        btn.style.display = 'none';
                        if (minimized) {
                            container.style.cursor = 'pointer';
                        }
                    }
                    container.setAttribute('title', ariaLabel);
                    container.setAttribute('alt', ariaLabel);
                    //Resize the container to be the size of a button.
                    Object.assign(container.style, {
                        height: h,
                        width: w
                    });
                }
                if (opt.minimized !== minimized) {
                    //@ts-ignore
                    self._invokeEvent('toggled', {
                        minimized: minimized,
                        type: 'toggled'
                    });
                }
            }
        };
        /** 0 - Legend control, 1 - Layer control, 2 - Expand, 3 - Collapse */
        BaseControl._translations = {
            'en': ['Legend control', 'Layer control', 'Expand', 'Collapse'],
            'af': ['Legende beheer', 'Laagbeheer', 'Uitbrei', 'Inval'],
            'ar': ['السيطرة على الأسطورة', 'التحكم في الطبقة', 'وسعت', 'انهيار'],
            'eu': ['Kondaira kontrol', 'Geruzaren kontrola', 'Hedatu', 'Erroiztu'],
            'bg': ['Контрол на легендата', 'Контрол на слоя', 'Разширяване', 'С колапс'],
            'zh': ['传说控制', '层控制', '扩张', '坍塌'],
            'hr': ['Legenda kontrola', 'Kontrola sloja', 'Proširiti', 'Kolaps'],
            'cs': ['Kontrola legendy', 'Řízení vrstvy', 'Rozšířit', 'Kolaps'],
            'da': ['Legend Control.', 'Lagstyring', 'Udvide', 'Falde sammen'],
            'nl': ['Legend Control', 'Laagregeling', 'Uitbreiden', 'Instorten'],
            'et': ['Legendikontroll', 'Kihi juhtimine', 'Laiendama', 'Kollaps'],
            'fi': ['Legend Control', 'Kerrosohjaus', 'Laajentaa', 'Romahdus'],
            'fr': ['Lutte contre la légende', 'Contrôle de couche', 'Développer', 'Effondrer'],
            'gl': ['Control de lendas', 'Control de capa', 'Expandir.', 'Colapso'],
            'de': ['Legend Control.', 'Schichtregelung', 'Expandieren', 'Zusammenbruch'],
            'el': ['Έλεγχος θρύλου', 'Έλεγχος στρώματος', 'Επεκτείνουν', 'Κατάρρευση'],
            'hi': ['पौराणिक नियंत्रण', 'परत नियंत्रण', 'विस्तार करना', 'ढहने'],
            'hu': ['Legenda irányítás', 'Rétegszabályozás', 'Kiterjed', 'Összeomlás'],
            'id': ['Kontrol legenda', 'Kontrol lapisan', 'Mengembangkan', 'Jatuh'],
            'it': ['Controllo della legenda', 'Controllo del livello', 'Espandere', 'Crollo'],
            'ja': ['伝説のコントロール', 'レイヤコントロール', '拡大', '崩壊'],
            'kk': ['Аңызды бақылау', 'Қабатты бақылау', 'Кеңейту', 'Күйреу'],
            'ko': ['전설 제어', '레이어 제어', '확장하다', '무너지다'],
            'es': ['Control de leyenda', 'Control de la capa', 'Expandir', 'Colapso'],
            'lv': ['Leģenda kontrole', 'Slāņa kontrole', 'Paplašināt', 'Sabrukums'],
            'lt': ['Legend Control.', 'Sluoksnio kontrolė', 'Išplėsti', 'Žlugimas'],
            'ms': ['Kawalan Legend.', 'Kawalan lapisan', 'Berkembang', 'Runtuh'],
            'nb': ['Legenden kontrollen', 'Lagkontroll', 'Utvide', 'Kollapse'],
            'pl': ['Kontrola legendy', 'Kontrola warstwy', 'Zwiększać', 'Zawalić się'],
            'pt': ['Controle da legenda', 'Controle de camada', 'Expandir', 'Colapso'],
            'ro': ['Controlul legendei', 'Controlul stratului', 'Extinde', 'Colaps'],
            'ru': ['Легендант контроля', 'Управление слоем', 'Расширять', 'Крах'],
            'sr': ['Контрола легенде', 'Контрола слоја', 'Проширити', 'Колапс'],
            'sk': ['Legenda', 'Ovládanie vrstvy', 'Rozbaľovať', 'Kolaps'],
            'sl': ['Legenda Control.', 'Kontrola plasti', 'Razširi', 'Spanje.'],
            'sv': ['Legendkontroll', 'Lagkontroll', 'Bygga ut', 'Kollaps'],
            'th': ['การควบคุมตำนาน', 'การควบคุมเลเยอร์', 'ขยาย', 'ทรุด'],
            'tr': ['Efsane kontrolü', 'Katman kontrolü', 'Genişletmek', 'Yıkılmak'],
            'uk': ['Легенда контроль', 'Керування шаром', 'Розширювати', 'Розвал'],
            'vi': ['Kiểm soát huyền thoại', 'Lớp kiểm soát', 'Mở rộng', 'Sự sụp đổ']
        };
        return BaseControl;
    }(azmaps.internal.EventEmitter));

    /** A control that displays legend information on the map. */
    var LegendControl = /** @class */ (function (_super) {
        __extends(LegendControl, _super);
        /****************************
         * Constructor
         ***************************/
        /**
         * A control that displays a legend.
         * @param options Options for defining how the control is rendered and functions.
         */
        function LegendControl(options) {
            var _this = _super.call(this, 0, 'atlas-legend-control-container', 'atlas-legend-btn') || this;
            /****************************
            * Private Properties
            ***************************/
            _this._options = {
                resx: {},
                layout: 'carousel',
                style: 'light',
                visible: true,
                legends: [],
                zoomBehavior: 'hide',
                showToggle: true,
                minimized: false
            };
            _this._legendIdx = 0;
            _this._currentLegend = null;
            _this._layerOptCache = {};
            _this._styleDataChanged = function () {
                var self = _this;
                var layerOptCache = self._layerOptCache;
                var map = self._map;
                //Loop through monitored layers and if any of their options have changed, rebuild legend.
                var needsRebuild = false;
                Object.keys(layerOptCache).forEach(function (key) {
                    var l = map.layers.getLayerById(key);
                    var opt = layerOptCache[key];
                    var opt2 = DynamicLegend.serializeLayerOptions(l);
                    if (opt !== opt2) {
                        needsRebuild = true;
                    }
                });
                if (needsRebuild) {
                    self._rebuildContainer();
                }
            };
            _this.setOptions(options);
            return _this;
        }
        /****************************
         * Public Methods
         ***************************/
        /** Gets the options of the legend control. */
        LegendControl.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /**
         * Sets the style of the legend control.
         * @param options Legend control options.
         */
        LegendControl.prototype.setOptions = function (options) {
            options = options || {};
            var self = this;
            var opt = self._options;
            Object.keys(options).forEach(function (key) {
                var val = options[key];
                if (val !== undefined) {
                    switch (key) {
                        case 'style':
                        case 'visible':
                        case 'container':
                        case 'layout':
                        case 'zoomBehavior':
                            //@ts-ignore
                            opt[key] = val;
                            break;
                        case 'legends':
                            opt[key] = val;
                            //If the current legend isn't in the new set of legends, set the current legend to null and reset the legend index to 0.
                            var idx = 0;
                            if (val !== null && self._currentLegend) {
                                idx = val.indexOf(self._currentLegend);
                                if (idx === -1) {
                                    self._currentLegend = null;
                                    idx = 0;
                                }
                            }
                            else {
                                //All legends removed.
                                self._currentLegend = null;
                                idx = 0;
                            }
                            self._legendIdx = idx;
                            var hasZoomRange_1 = false;
                            val.forEach(function (l) {
                                l.minZoom = Utils.getNumber(l, 'minZoom', 0, 0);
                                l.maxZoom = Utils.getNumber(l, 'maxZoom', 0, 24);
                                //Only consider data zoomable if the zoom range is not the max range of 0 to 24.
                                if (l.minZoom !== 0 || l.maxZoom !== 24 || l.type === 'dynamic') {
                                    hasZoomRange_1 = true;
                                }
                            });
                            self._hasZoomableContent = hasZoomRange_1;
                            if (val) {
                                self.setLegendIdx(idx);
                            }
                            self._needsRebuild = true;
                            break;
                        default:
                            opt[key] = val;
                            self._needsRebuild = true;
                            break;
                    }
                }
            });
            _super.prototype.setOptions.call(this, options);
        };
        /**
         * Navigates to the specified legend index within a carousel or list.
         * @param idx The legend index in the array of legends in the legend control options.
         * @param focus Specifies if tab focus should move inside of the specified legend.
         */
        LegendControl.prototype.setLegendIdx = function (idx, focus) {
            this._setItemIndex(idx, focus);
        };
        /**
         * Adds a legend to the legend control. If the legend is already in the control, it will update the carousel index to focus on this legend.
         * @param legend The legend to add.
         * @param show A boolean indicating if this legend should be displayed.
         */
        LegendControl.prototype.add = function (legend, show, skipRebuildFocus) {
            var self = this;
            var idx = self._getLegendIdx(legend);
            //Make sure legend is not already in the legend control.
            if (idx === -1) {
                //Add the legend.
                self._options.legends.push(legend);
                if (focus) {
                    self._legendIdx = self._options.legends.length - 1;
                    self._currentLegend = legend;
                }
                legend.minZoom = Utils.getNumber(legend, 'minZoom', 0, 0);
                legend.maxZoom = Utils.getNumber(legend, 'maxZoom', 0, 24);
                if (legend.minZoom !== 0 || legend.maxZoom !== 24) {
                    self._hasZoomableContent = true;
                }
                if (!skipRebuildFocus) {
                    //Rebuild the legend control. 
                    self._rebuildContainer();
                }
            }
            else if (show) {
                //If the legend is already added, and they simply want to focus on it, then do that.
                self.setLegendIdx(idx);
            }
        };
        /**
         * Puts the specified legend in view of the user. If in carousel mode, will switch to that legend.
         * @param legend The legend to focus on.
         */
        LegendControl.prototype.focus = function (legend) {
            var self = this;
            var idx = self._getLegendIdx(legend);
            //Make sure legend is in the legend control.
            if (idx !== -1) {
                //If the legend is already added, and they simply want to focus on it, then do that.
                self.setLegendIdx(idx);
            }
        };
        /**
         * Removes a legend from the legend control.
         * @param legend The legend to remove.
         */
        LegendControl.prototype.remove = function (legend, skipRebuild) {
            var self = this;
            var idx = self._getLegendIdx(legend);
            var legends = self._options.legends;
            //Make sure legend is in the legend control.
            if (idx > -1 && legends.length > idx) {
                //If this is the current legend, move down one legend.
                if (self._legendIdx === idx) {
                    if (legends.length > 1) {
                        self._legendIdx = idx - 1;
                        self._currentLegend = legends[idx - 1];
                    }
                    else {
                        self._legendIdx = -1;
                        self._currentLegend = null;
                    }
                }
                //Remove the legend.
                legends.splice(idx, 1);
                if (!skipRebuild) {
                    //Rebuild the legend control. 
                    self._rebuildContainer();
                }
            }
        };
        LegendControl.prototype.onAdd = function (map, options) {
            map.events.add('styledata', this._styleDataChanged);
            return _super.prototype.onAdd.call(this, map, options);
        };
        LegendControl.prototype.onRemove = function () {
            if (this._map) {
                this._map.events.remove('styledata', this._styleDataChanged);
            }
            _super.prototype.onRemove.call(this);
        };
        /****************************
         * Private Methods
         ***************************/
        LegendControl.prototype._replaceMany = function (oldLegends, newLegends) {
            var self = this;
            if (oldLegends) {
                oldLegends.forEach(function (l) {
                    self.remove(l, true);
                });
            }
            //Remember current legend/idx.
            var currentLegend = self._currentLegend;
            var legendIdx = self._legendIdx;
            if (newLegends) {
                newLegends.forEach(function (l) {
                    self.add(l, false, true);
                });
            }
            if (legendIdx > -1 && currentLegend) {
                self._currentLegend = currentLegend;
                self._legendIdx = legendIdx;
            }
            //Rebuild the legend control. 
            self._rebuildContainer();
        };
        /**
         * Navigates to the specified legend index within a carousel or list.
         * @param idx The legend index in the array of legends in the legend control options.
         * @param focus Specifies if tab focus should move inside of the specified legend.
         */
        LegendControl.prototype._setItemIndex = function (idx, focus) {
            var self = this;
            if (self._content) {
                self._setCardIdx(idx, focus);
                idx = self._currentIdx;
                var legends = self._options.legends;
                //Capture the current legend.
                var l = (typeof idx !== 'undefined') ? ((legends.length > idx) ? legends[idx] : null) : null;
                self._currentLegend = l;
                self._invokeEvent('legendfocused', {
                    legendIdx: idx,
                    legend: l,
                    type: 'legendfocused'
                });
            }
        };
        /**
         * Gets the index of a legend within the array of legends in the legend control options.
         * @param legend The legend to get the index for.
         * @returns The index of a legend within the array of legends in the legend control options.
         */
        LegendControl.prototype._getLegendIdx = function (legend) {
            return this._options.legends.indexOf(legend);
        };
        /**
         * Creates the legend control content.
         */
        LegendControl.prototype._createContent = function () {
            var self = this;
            var opt = self._options;
            var resx = opt.resx || {};
            var layout = opt.layout;
            var layerOptCache = {};
            self._layerOptCache = layerOptCache;
            var legends = [];
            opt.legends.forEach(function (l) {
                if (l.type === 'dynamic') {
                    var dlg = l;
                    var dynmaicLg = DynamicLegend.parse(dlg, self);
                    if (dynmaicLg && dynmaicLg.length > 0) {
                        legends = legends.concat(dynmaicLg);
                        dynmaicLg.forEach(function (d) {
                            if (d.minZoom !== 0 || d.maxZoom !== 24) {
                                self._hasZoomableContent = true;
                            }
                        });
                        var mapLayer = Utils.getLayer(dlg.layer, self._map);
                        if (mapLayer['getOptions']) {
                            layerOptCache[mapLayer.getId()] = DynamicLegend.serializeLayerOptions(mapLayer);
                        }
                    }
                }
                else {
                    legends.push(l);
                }
            });
            if (self._content) {
                self._content.remove();
            }
            //Create content container.
            var content = document.createElement('div');
            content.className = 'atlas-legend-control';
            self._content = content;
            //Add top level legend card title.
            Utils.addStringDiv(content, opt.title, 'atlas-legend-title', resx, true);
            //Add legends.
            if (legends && legends.length > 0) {
                var dotContainer = document.createElement('div');
                dotContainer.className = 'atlas-carousel-dot-container';
                var rebuildOnStyleChange = false;
                for (var i = 0; i < legends.length; i++) {
                    var lg = legends[i];
                    if (lg) {
                        var id = Utils.uuid();
                        var card = document.createElement('div');
                        card.classList.add('atlas-layer-legend-card');
                        card.id = id;
                        card.setAttribute('rel', i + '');
                        var subtitle = void 0;
                        if (opt.layout === 'accordion') {
                            subtitle = Utils.getString(lg.subtitle, resx);
                        }
                        else {
                            subtitle = Utils.addStringDiv(card, lg.subtitle, 'atlas-legend-subtitle', resx, true);
                        }
                        switch (lg.type) {
                            case 'category':
                                self._createCategoryLegend(card, lg, resx);
                                break;
                            case 'image':
                                self._createImageLegend(card, lg, resx);
                                break;
                            case 'html':
                                self._createHtmlLegend(card, lg);
                                break;
                            case 'gradient':
                                rebuildOnStyleChange = true;
                                self._createGradientLegend(card, lg, resx);
                                break;
                        }
                        Utils.addStringDiv(card, lg.footer, 'atlas-legend-footer', resx, false, true);
                        self._addCard(card, dotContainer, lg, subtitle);
                    }
                }
                self._rebuildOnStyleChange = rebuildOnStyleChange;
                //Add carousel dots
                if (layout === 'carousel') {
                    if (dotContainer.children.length > 1) {
                        Utils.addClearDiv(content);
                        content.appendChild(dotContainer);
                    }
                    self.setLegendIdx(self._legendIdx);
                }
            }
            var elm = Utils.getElement(opt.container);
            if (elm) {
                elm.appendChild(content);
            }
            else if (self._container) {
                self._container.appendChild(content);
            }
        };
        /**
         * Create a category type legend.
         * @param legend The HTML element for the content of this legend.
         * @param legendType The legend options.
         * @param resx A resource file for localization of strings.
         */
        LegendControl.prototype._createCategoryLegend = function (legend, legendType, resx) {
            if (legendType.items) {
                var itemContainer_1 = document.createElement('div');
                itemContainer_1.classList.add('atlas-legend-category-legend');
                if (legendType.cssClass) {
                    itemContainer_1.classList.add(legendType.cssClass);
                }
                if (legendType.layout) {
                    itemContainer_1.style.flexDirection = legendType.layout;
                }
                var fitItemsVertically_1 = (legendType.fitItems && legendType.layout && legendType.layout.startsWith('row') &&
                    legendType.itemLayout && legendType.itemLayout.startsWith('column'));
                var maxSize_1 = 0;
                legendType.items.forEach(function (item) {
                    var itemDiv = document.createElement('div');
                    itemDiv.classList.add('atlas-legend-category-item');
                    itemDiv.style.flexDirection = (legendType.itemLayout) ? legendType.itemLayout : 'row';
                    var c = item.color || legendType.color || 'transparent';
                    var svg;
                    var imageSrc;
                    var shape = item.shape || legendType.shape || 'circle';
                    var strokeWidth = Utils.getNumber2(item, legendType, 'strokeWidth', 0, 1);
                    var shapeSize = Utils.getNumber2(item, legendType, 'shapeSize', 1, 20);
                    var fillSize = shapeSize - strokeWidth * 2;
                    var cx = shapeSize * 0.5;
                    switch (shape) {
                        case 'line':
                            var y = shapeSize * 0.5;
                            svg = "<line x1=\"0\" y1=\"" + y + "\" x2=\"" + shapeSize + "\" y2=\"" + y + "\" stroke=\"" + c + "\" stroke-width=\"" + strokeWidth + "\" />";
                            break;
                        case 'square':
                            svg = "<rect x=\"" + strokeWidth + "\" y=\"" + strokeWidth + "\" height=\"" + fillSize + "\" width=\"" + fillSize + "\" fill=\"" + c + "\" stroke-width=\"" + strokeWidth + "\"/>";
                            break;
                        case 'triangle':
                            svg = "<polygon points=\"" + strokeWidth + " " + fillSize + ", " + fillSize + " " + fillSize + ", " + (fillSize + strokeWidth) * 0.5 + " " + strokeWidth + "\" fill=\"" + c + "\" stroke-width=\"" + strokeWidth + "\"/>";
                            break;
                        case 'circle':
                            svg = "<circle cx=\"" + cx + "\" cy=\"" + cx + "\" r=\"" + (cx - strokeWidth) + "\" fill=\"" + c + "\" stroke-width=\"" + strokeWidth + "\"/>";
                            break;
                        default:
                            //Is either image URL or inline image string.
                            //Assume an inline svg image string if icon doesn't start with "data:", but does include "<svg"
                            if (/<svg/i.test(shape) && !(/^data:/i.test(shape))) {
                                imageSrc = "data:image/svg+xml;base64," + window.btoa(shape);
                            }
                            else {
                                imageSrc = shape;
                            }
                            break;
                    }
                    maxSize_1 = Math.max(maxSize_1, shapeSize);
                    var itemShape = document.createElement('div');
                    if (svg) {
                        itemShape.innerHTML = "<svg class=\"atlas-legend-category-shape\" style=\"width:" + shapeSize + "px;\" viewBox=\"0 0 " + shapeSize + " " + shapeSize + "\" xmlns=\"http://www.w3.org/2000/svg\">" + svg + "</svg>";
                    }
                    else if (imageSrc) {
                        itemShape.innerHTML = "<img class=\"atlas-legend-category-shape\" style=\"width:" + shapeSize + "px;\" src=\"" + imageSrc + "\"/>";
                    }
                    if (item.cssClass) {
                        itemDiv.classList.add(item.cssClass);
                    }
                    if (legendType.collapse) {
                        itemDiv.style.padding = '0px';
                    }
                    itemDiv.appendChild(itemShape);
                    if (fitItemsVertically_1) {
                        Object.assign(itemShape.style, {
                            position: 'relative'
                        });
                        Object.assign(itemShape.firstChild.style, {
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        });
                    }
                    var stringLabel = Utils.getString(item.label, resx, legendType.numberFormatLocales, legendType.numberFormat);
                    var itemLabel = document.createElement('span');
                    itemLabel.innerHTML = stringLabel;
                    itemLabel.setAttribute('aria-label', stringLabel);
                    if (legendType.labelsOverlapShapes) {
                        Object.assign(itemLabel.style, {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            margin: '0 auto'
                        });
                    }
                    itemDiv.appendChild(itemLabel);
                    itemContainer_1.appendChild(itemDiv);
                });
                if (legendType.fitItems) {
                    var elms = itemContainer_1.getElementsByClassName('atlas-legend-category-item');
                    var size = maxSize_1 + 'px';
                    var o_1 = {};
                    if (fitItemsVertically_1) {
                        o_1.height = size;
                    }
                    else {
                        o_1.width = size;
                    }
                    var retainWidth_1 = fitItemsVertically_1 || (legendType.layout && legendType.layout.startsWith('row') &&
                        legendType.itemLayout && legendType.itemLayout.startsWith('row'));
                    Array.prototype.forEach.call(elms, function (el) {
                        if (retainWidth_1) {
                            o_1.width = el.firstChild.firstChild.style.width;
                        }
                        Object.assign(el.firstChild.style, o_1);
                    });
                }
                legend.appendChild(itemContainer_1);
            }
        };
        /**
         * Create an Image type legend.
         * @param legend The HTML element for the content of this legend.
         * @param legendType The legend options.
         * @param resx A resource file for localization of strings.
         */
        LegendControl.prototype._createImageLegend = function (legend, legendType, resx) {
            if (legendType.url) {
                var itemContainer_2 = document.createElement('div');
                itemContainer_2.classList.add('atlas-legend-image-legend');
                if (legendType.cssClass) {
                    itemContainer_2.classList.add(legendType.cssClass);
                }
                var img = document.createElement('img');
                var altText = Utils.getString(legendType.altText || legendType.subtitle, resx);
                if (altText !== '') {
                    img.setAttribute('alt', altText);
                    img.setAttribute('title', altText);
                }
                img.onerror = function () {
                    console.log('Unable to load legend image: ' + legendType.url);
                    itemContainer_2.remove();
                };
                var maxHeight = legendType.maxHeight;
                var maxWidth = legendType.maxWidth;
                if (maxHeight && maxHeight > 0) {
                    img.style.maxWidth = maxHeight + 'px';
                }
                if (maxWidth && maxWidth > 0) {
                    img.style.maxWidth = maxWidth + 'px';
                }
                var imageSrc = legendType.url;
                if (/<svg/i.test(imageSrc) && !(/^data:/i.test(imageSrc))) {
                    imageSrc = "data:image/svg+xml;base64," + window.btoa(imageSrc);
                }
                img.src = imageSrc;
                itemContainer_2.appendChild(img);
                legend.appendChild(itemContainer_2);
            }
        };
        /**
         * Create a HTML type legend.
         * @param legend The HTML element for the content of this legend.
         * @param legendType The legend options.
         * @param resx A resource file for localization of strings.
         */
        LegendControl.prototype._createHtmlLegend = function (legend, legendType) {
            if (legendType.html) {
                var itemContainer = document.createElement('div');
                if (legendType.cssClass) {
                    itemContainer.classList.add(legendType.cssClass);
                }
                if (typeof legendType.html === 'string') {
                    itemContainer.innerHTML = legendType.html;
                }
                else {
                    itemContainer.appendChild(legendType.html);
                }
                legend.appendChild(itemContainer);
            }
        };
        /**
         * Create a gradient type legend.
         * @param legend The HTML element for the content of this legend.
         * @param legendType The legend options.
         * @param resx A resource file for localization of strings.
         */
        LegendControl.prototype._createGradientLegend = function (legend, legendType, resx) {
            if (legendType.stops && legendType.stops.length > 0) {
                var itemContainer = document.createElement('div');
                itemContainer.classList.add('atlas-legend-gradient-legend');
                if (legendType.cssClass) {
                    itemContainer.classList.add(legendType.cssClass);
                }
                //Get the font color determined by the control. This is used to color tick lines and labels.
                var fontColor = this._fontColor;
                var getNumber = Utils.getNumber;
                var isVertical = (legendType.orientation === 'vertical');
                var fontSize_1 = getNumber(legendType, 'fontSize', 1, 12);
                var fontFamily_1 = legendType.fontFamily || "'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
                fontFamily_1 = fontFamily_1.replace(/"/g, "'");
                var thickness = getNumber(legendType, 'barThickness', 1, 20);
                var barLength_1 = getNumber(legendType, 'barLength', 1, 200);
                var tickSize_1 = getNumber(legendType, 'tickSize', 0, 5);
                var tickGap = 3;
                var svgStops_1 = [];
                var tickLines_1 = [];
                var textItems_1 = [];
                var width = void 0;
                var svgWidth = void 0;
                var height = void 0;
                var svgHeight = void 0;
                var gradientDirection = void 0;
                var textStyle = void 0;
                var barWidth = void 0;
                var barHeight = void 0;
                //Ensure stops are sorted by offset.
                legendType.stops.sort(function (a, b) {
                    return a.offset - b.offset;
                });
                if (isVertical) {
                    gradientDirection = 'x1="0%" y1="0%" x2="0%" y2="100%" gradientTransform="rotate(180,0.5,0.5)"';
                    textStyle = "fill:" + fontColor + ";font-size:" + fontSize_1 + "px;font-family:" + fontFamily_1 + ";text-align:center;text-anchor:start;dominant-baseline:middle;\"";
                    barWidth = thickness;
                    barHeight = barLength_1;
                    var maxTextWidth_1 = 0;
                    var tickStartX_1 = thickness + tickGap;
                    var tickEndX_1 = tickStartX_1 + tickSize_1;
                    var textX_1 = tickEndX_1 + tickGap;
                    if (tickSize_1 > 0) {
                        tickLines_1.push("<line x1=\"" + tickStartX_1 + "\" y1=\"0\" x2=\"" + tickStartX_1 + "\" y2=\"" + barLength_1 + "\" />");
                    }
                    legendType.stops.forEach(function (item) {
                        var c = item.color || 'black';
                        svgStops_1.push("<stop offset=\"" + item.offset * 100 + "%\" stop-color=\"" + c + "\" />");
                        var stringLabel = Utils.getString(item.label, resx, legendType.numberFormatLocales, legendType.numberFormat);
                        if (stringLabel && stringLabel !== '') {
                            var y1 = barLength_1 * (1 - item.offset);
                            if (item.offset === 0) {
                                y1 -= 1;
                            }
                            else if (item.offset === 1) {
                                y1 += 1;
                            }
                            if (tickSize_1 > 0) {
                                tickLines_1.push("<line x1=\"" + tickStartX_1 + "\" y1=\"" + y1 + "\" x2=\"" + tickEndX_1 + "\" y2=\"" + y1 + "\" />");
                            }
                            textItems_1.push("<text x=\"" + textX_1 + "\" y=\"" + y1 + "\">" + stringLabel + "</text>");
                            maxTextWidth_1 = Math.max(Utils.measureText(stringLabel, fontSize_1, fontFamily_1).width, maxTextWidth_1);
                        }
                    });
                    width = Math.ceil(textX_1 + maxTextWidth_1);
                    svgWidth = width;
                    height = barLength_1;
                    svgHeight = height + fontSize_1;
                }
                else {
                    gradientDirection = 'x1="0%" y1="0%" x2="100%" y2="0%"';
                    textStyle = "fill:" + fontColor + ";font-size:" + fontSize_1 + "px;font-family:" + fontFamily_1 + ";text-align:center;text-anchor:middle;dominant-baseline:hanging;";
                    barWidth = barLength_1;
                    barHeight = thickness;
                    var maxTextWidth_2 = 0;
                    var tickStartY_1 = thickness + tickGap;
                    var tickEndY_1 = tickStartY_1 + tickSize_1;
                    var textY_1 = tickEndY_1 + tickGap;
                    if (tickSize_1 > 0) {
                        tickLines_1.push("<line x1=\"0\" y1=\"" + tickStartY_1 + "\" x2=\"" + barLength_1 + "\" y2=\"" + tickStartY_1 + "\" />");
                    }
                    legendType.stops.forEach(function (item) {
                        var c = item.color || 'black';
                        svgStops_1.push("<stop offset=\"" + item.offset * 100 + "%\" stop-color=\"" + c + "\" />");
                        var stringLabel = Utils.getString(item.label, resx, legendType.numberFormatLocales, legendType.numberFormat);
                        if (stringLabel && stringLabel !== '') {
                            var x1 = barLength_1 * item.offset;
                            if (item.offset === 1) {
                                x1 -= 1;
                            }
                            else if (item.offset === 0) {
                                x1 += 1;
                            }
                            if (tickSize_1 > 0) {
                                tickLines_1.push("<line x1=\"" + x1 + "\" y1=\"" + tickStartY_1 + "\" x2=\"" + x1 + "\" y2=\"" + tickEndY_1 + "\" />");
                            }
                            textItems_1.push("<text x=\"" + x1 + "\" y=\"" + textY_1 + "\">" + stringLabel + "</text>");
                            maxTextWidth_2 = Math.max(Utils.measureText(stringLabel, fontSize_1, fontFamily_1).width, maxTextWidth_2);
                        }
                    });
                    width = barLength_1;
                    svgWidth = maxTextWidth_2 + width;
                    height = textY_1 + ((textItems_1.length > 0) ? fontSize_1 * 1.33 : 0);
                    svgHeight = height;
                }
                var id = Utils.uuid();
                var svg = "\n                <svg width=\"" + svgWidth + "\" height=\"" + svgHeight + "\" viewBox=\"0 0 " + width + " " + height + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                    <defs>                    \n                        <pattern id=\"atlas-pattern-" + id + "\" x=\"0\" y=\"0\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\">\n                            <rect x=\"0\" y=\"0\" width=\"10\" height=\"10\" fill=\"white\"/>\n                            <rect x=\"0\" y=\"0\" width=\"5\" height=\"5\" fill=\"#ccc\"/>\n                            <rect x=\"5\" y=\"5\" width=\"5\" height=\"5\" fill=\"#ccc\"/>\n                        </pattern>\n\n                        <linearGradient id=\"atlas-gradient-" + id + "\" " + gradientDirection + ">" + svgStops_1.join('') + "</linearGradient>\n                    </defs>\n\n                    <rect x=\"0\" y=\"0\" width=\"" + barWidth + "\" height=\"" + barHeight + "\" fill=\"url('#atlas-pattern-" + id + "')\" />  \n                    <rect x=\"0\" y=\"0\" width=\"" + barWidth + "\" height=\"" + barHeight + "\" fill=\"url('#atlas-gradient-" + id + "')\" />\n\n                    <g style=\"stroke:" + fontColor + ";stroke-width:2;\">" + tickLines_1.join('') + "</g>\n\n                    <g style=\"" + textStyle + "\">" + textItems_1.join('') + "</g>\n                </svg>\n                ";
                itemContainer.innerHTML = svg;
                legend.appendChild(itemContainer);
            }
        };
        return LegendControl;
    }(BaseControl));

    /** A control for creating a list of layers and actions. */
    var LayerControl = /** @class */ (function (_super) {
        __extends(LayerControl, _super);
        /****************************
         * Constructor
         ***************************/
        /**
         * A control that displays a legend.
         * @param options Options for defining how the control is rendered and functions.
         */
        function LayerControl(options) {
            var _this = _super.call(this, 1, 'atlas-layer-control-container', 'atlas-layer-btn') || this;
            /****************************
            * Private Properties
            ***************************/
            _this._options = {
                resx: {},
                layout: 'list',
                style: 'light',
                visible: true,
                zoomBehavior: 'disable',
                showToggle: true,
                minimized: false
            };
            _this._stateCache = {};
            /****************************
             * Private Methods
             ***************************/
            /** Event handler for when a layer is added or removed from the map. */
            _this._layerChanged = function (layer) {
                var self = _this;
                //If layer control has dynamic layer groups, they will need to be updated.
                self._rebuildContainer();
            };
            /**
             * Event handler for when an item changes.
             * @param state The new state.
             * @param layers The layers affected.
             * @param layerGroup The related layer group options.
             * @param elm The element the event occurred on.
             * @param focusLegend A option specifying if an associated legend item should come into view.
             */
            _this._itemChanged = function (state, layers, layerGroup, elm, focusLegend) {
                if (layers) {
                    var self_1 = _this;
                    var legendControl = self_1._options.legendControl;
                    //Handle range slider
                    if (elm instanceof HTMLInputElement && elm.type === 'range') {
                        var layerState = state;
                        var val = parseFloat(elm.value);
                        //Apply styles to layers
                        var rangeStyle = layerState.style;
                        if (rangeStyle) {
                            var labelString = state.label ? Utils.getString(state.label, self_1._options.resx) : '{rangeValue}';
                            var formattedVal = labelString.replace('{rangeValue}', new Intl.NumberFormat(undefined, layerState.numberFormat || {}).format(val));
                            //Set the input's label.
                            elm.parentElement.children[1].innerHTML = formattedVal;
                            //Replace placeholder in style.
                            var style_1 = Utils.replacePlaceholder(rangeStyle, '{rangeValue}', val, true);
                            layers.forEach(function (layer) { return self_1._setLayerStyle(layer, style_1); });
                        }
                        layerState.value = val;
                    }
                    else {
                        var enabled = (elm['checked'] !== undefined) ? elm['checked'] : elm['selected'];
                        if (enabled === undefined) {
                            enabled = false;
                        }
                        if (elm instanceof HTMLOptionElement) {
                            enabled = elm.parentElement.selectedOptions[0] === elm;
                        }
                        var layerState = state;
                        //Apply styles to layers
                        var style_2 = enabled ? layerState.enabledStyle : (layerState.disabledStyle || {});
                        if (style_2) {
                            layers.forEach(function (layer) { return self_1._setLayerStyle(layer, style_2); });
                        }
                        //Handle new item state.
                        if (layerState.legends && legendControl) {
                            for (var i = 0; i < layerState.legends.length; i++) {
                                var l = layerState.legends[i];
                                if (enabled) {
                                    l.minZoom = Utils.getNumber2(l, layerState, 'minZoom', 0, 0);
                                    l.maxZoom = Utils.getNumber2(l, layerState, 'maxZoom', 0, 24);
                                    legendControl.add(l, (i === 0) ? focusLegend : false);
                                }
                                else {
                                    legendControl.remove(l);
                                }
                            }
                        }
                        layerState.enabled = enabled;
                        //If style changes visibility, ensure associated legends also change. 
                        var legend = self_1._options.legendControl;
                        if (typeof style_2.visible === 'boolean' && legend) {
                            legend._rebuildContainer();
                        }
                    }
                    //Handle old state.
                    var oldState = self_1._updateStateCache(state, layers, (elm instanceof HTMLOptionElement) ? elm.parentElement : elm);
                    self_1._invokeEvent('statechanged', {
                        type: 'statechanged',
                        layerGroup: layerGroup,
                        oldState: oldState,
                        newState: state
                    });
                }
            };
            _this.setOptions(Object.assign({}, _this._options, options));
            return _this;
        }
        /****************************
         * Public Methods
         ***************************/
        /**
         * Gets the options of the layer control.
         * @returns The options of the layer control.
         */
        LayerControl.prototype.getOptions = function () {
            return this._options;
        };
        /**
         * Sets the style of the layer control.
         * @param options The layer control options.
         */
        LayerControl.prototype.setOptions = function (options) {
            options = options || {};
            var self = this;
            var opt = self._options;
            Object.keys(options).forEach(function (key) {
                var val = options[key];
                if (val !== undefined) {
                    switch (key) {
                        //Base options that are handled with the super.setOptions. Capture value for when user gets for options.
                        case 'style':
                        case 'visible':
                        case 'container':
                        case 'layout':
                        case 'zoomBehavior':
                            //@ts-ignore
                            opt[key] = val;
                            break;
                        default:
                            opt[key] = val;
                            self._needsRebuild = true;
                            break;
                    }
                }
            });
            _super.prototype.setOptions.call(this, options);
        };
        LayerControl.prototype.onAdd = function (map, options) {
            //Add events to monitor the layers being added and removed.
            map.events.add('layeradded', this._layerChanged);
            map.events.add('layerremoved', this._layerChanged);
            return _super.prototype.onAdd.call(this, map, options);
        };
        LayerControl.prototype.onRemove = function () {
            var self = this;
            var map = self._map;
            if (map) {
                map.events.remove('layeradded', self._layerChanged);
                map.events.remove('layerremoved', self._layerChanged);
            }
            return _super.prototype.onRemove.call(this);
        };
        LayerControl.prototype.refresh = function () {
            this._rebuildContainer();
        };
        /**
        * Navigates to the specified layer index within a carousel or list.
        * @param idx The layer index in the array of layers in the layer control options.
        * @param focus Specifies if tab focus should move inside of the specified layer.
        */
        LayerControl.prototype._setItemIndex = function (idx, focus) {
            this._setCardIdx(idx, focus);
        };
        /**
         * Creates the content of the layer control.
         */
        LayerControl.prototype._createContent = function () {
            var self = this;
            var opt = self._options;
            var resx = opt.resx || {};
            var layout = opt.layout;
            var hasZoomRange = false;
            //Clone the layer group array as dynamic layer groups might get appended.
            var layerGroups = (opt.layerGroups) ? opt.layerGroups.map(function (x) { return x; }) : [];
            var dlg = opt.dynamicLayerGroup;
            //Get the layer groups to render.
            if (dlg) {
                var lg = self._getLayerGroup(dlg);
                if (lg) {
                    hasZoomRange = true;
                    var idx = dlg.layerGroupIdx;
                    if (typeof idx !== 'number' || idx < 0 || idx > layerGroups.length) {
                        idx = 0;
                    }
                    layerGroups.splice(idx, 0, lg);
                    if (opt.legendControl) {
                        //Create a dynamic legend type for all layers within layer group.
                        //Each layer should only exist once in a dynamic layer group, and all layers are set at the item level.
                        var legends_1 = [];
                        lg.items.forEach(function (item) {
                            if (item.layers) {
                                item.layers.forEach(function (l) {
                                    legends_1.push({
                                        type: 'dynamic',
                                        layer: l
                                    });
                                });
                            }
                        });
                        opt.legendControl._replaceMany(self._dynamicLegends, legends_1);
                        self._dynamicLegends = legends_1;
                    }
                }
            }
            if (self._content) {
                self._content.remove();
            }
            //Create content container.
            var content = document.createElement('div');
            content.className = 'atlas-layer-control';
            self._content = content;
            //Add top level legend card title.
            Utils.addStringDiv(content, opt.title, 'atlas-layer-title', resx, true);
            //Create layer groups.
            if (layerGroups && layerGroups.length > 0) {
                var dotContainer = document.createElement('div');
                dotContainer.className = 'atlas-carousel-dot-container';
                var _loop_1 = function (i) {
                    var id = Utils.uuid();
                    var lg = layerGroups[i];
                    //Process zoom range of layer group and underlying states.
                    var lgZr = Utils.getZoomRange(self._getAllAzLayers(null, lg));
                    lg.minZoom = Utils.getNumber2(lg, lgZr, 'minZoom', 0, 0);
                    lg.maxZoom = Utils.getNumber2(lg, lgZr, 'maxZoom', 0, 24);
                    //Only consider data zoomable if the zoom range is not the max range of 0 to 24.
                    if (lg.minZoom !== 0 || lg.maxZoom !== 24) {
                        hasZoomRange = true;
                    }
                    if (lg.items) {
                        //Process states within a layer group.
                        lg.items.forEach(function (state) {
                            //Get all layers the state works with.
                            var layers = self._getAllAzLayers(state, lg);
                            //Inflate the styles for the state.
                            self._inflateLayerStateStyles(state, layers);
                            //Get the zoom level range of the layers within the state.
                            var lZr = Utils.getZoomRange(layers);
                            //Set min/max zoom of state. Prioritize user define values, then layer limits, then layer group limits.
                            state.minZoom = Math.max(Utils.getNumber2(state, lZr, 'minZoom', 0, 0), lg.minZoom);
                            state.maxZoom = Math.min(Utils.getNumber2(state, lZr, 'maxZoom', 0, 24), lg.maxZoom);
                            //Only consider data zoomable if the zoom range is not the max range of 0 to 24.
                            if (state.minZoom !== 0 && state.maxZoom !== 24) {
                                hasZoomRange = true;
                            }
                        });
                    }
                    var card = document.createElement('div');
                    card.classList.add('atlas-layer-legend-card');
                    card.id = id;
                    if (lg.cssClass) {
                        card.classList.add(lg.cssClass);
                    }
                    //Add the id to the `rel` attribute.
                    card.setAttribute('rel', i + '');
                    var titleString = void 0;
                    if (layout === 'accordion') {
                        titleString = Utils.getString(lg.groupTitle, resx);
                    }
                    else {
                        titleString = Utils.addStringDiv(card, lg.groupTitle, 'atlas-layer-group-title', resx, true);
                    }
                    if (lg.legends && opt.legendControl) {
                        for (var i_1 = 0; i_1 < lg.legends.length; i_1++) {
                            var l = lg.legends[i_1];
                            l.minZoom = Utils.getNumber2(l, lg, 'minZoom', 0, 0);
                            l.maxZoom = Utils.getNumber2(l, lg, 'maxZoom', 0, 24);
                            opt.legendControl.add(l, (i_1 === 0));
                        }
                    }
                    var itemLayout = lg.layout || 'checkbox';
                    var c = void 0;
                    switch (itemLayout) {
                        case 'dropdown':
                            c = self._createDropdown(lg, titleString);
                            break;
                        case 'checkbox':
                        case 'radio':
                            c = self._createChoiceGroup(itemLayout, lg);
                            break;
                        case 'range':
                            c = self._createRange(lg);
                            break;
                    }
                    if (c) {
                        card.appendChild(c);
                    }
                    self._addCard(card, dotContainer, lg, titleString);
                };
                for (var i = 0; i < layerGroups.length; i++) {
                    _loop_1(i);
                }
                self._hasZoomableContent = hasZoomRange;
                //Add carousel dots
                if (layout === 'carousel') {
                    if (dotContainer.children.length > 1) {
                        Utils.addClearDiv(content);
                        content.appendChild(dotContainer);
                    }
                    self._setCardIdx(0);
                }
            }
            var elm = Utils.getElement(opt.container);
            if (elm) {
                elm.appendChild(content);
            }
            else if (self._container) {
                self._container.appendChild(content);
            }
        };
        /**
         * Binds a layer state to an element.
         * @param state A layer state.
         * @param layerGroup A layer group.
         * @param elm An element that is being bound to the state.
         */
        LayerControl.prototype._bindLayerState = function (state, layerGroup, elm, oninput) {
            var self = this;
            //Ensure we have a unique list of layers between the layer group layers and the state level defined layers.
            var layers = self._getAllAzLayers(state, layerGroup);
            var event = self._itemChanged.bind(self, state, layers, layerGroup, elm, true);
            if (elm instanceof HTMLOptionElement) {
                elm.parentElement.addEventListener('change', event);
                self._itemChanged(state, layers, layerGroup, elm, false);
            }
            else {
                elm.onchange = event;
                if (oninput) {
                    elm.oninput = event;
                }
                self._itemChanged(state, layers, layerGroup, elm, false);
            }
        };
        /**
         * Creates a dropdown for a layer group.
         * @param layerGroup The layer group options.
         * @param title The title to display for the layer group.
         * @returns A dropdown.
         */
        LayerControl.prototype._createDropdown = function (layerGroup, title) {
            var self = this;
            var dropdown = document.createElement('select');
            dropdown.className = 'atlas-layer-dropdown';
            dropdown.title = title;
            if (layerGroup.items) {
                dropdown.name = Utils.uuid();
                var items = layerGroup.items;
                items.forEach(function (item) {
                    var option = document.createElement('option');
                    if (item.label) {
                        option.innerHTML = Utils.getString(item.label, self._options.resx);
                    }
                    if (item.enabled) {
                        option.selected = true;
                    }
                    //Store min/max zoom info as attributes.
                    Utils.setZoomRangeAttr(item, self._baseOptions, option);
                    dropdown.appendChild(option);
                    self._bindLayerState(item, layerGroup, option);
                });
            }
            return dropdown;
        };
        /**
         * Creates a container of radio or checkbox buttons.
         * @param type The type of choice group to create, radio or checkbox.
         * @param layerGroup The layer group to create the choice for.
         * @returns A container with a group of radio buttons or checkboxes.
         */
        LayerControl.prototype._createChoiceGroup = function (type, layerGroup) {
            var self = this;
            var itemContainer = document.createElement('div');
            if (layerGroup.items) {
                var items = layerGroup.items;
                var groupName_1 = Utils.uuid();
                items.forEach(function (item) {
                    //<label><input type="checkbox" /><span>Option 1</span></label>
                    //<label><input type="radio" name=""/><span>Option 1</span></label>
                    var label = document.createElement('label');
                    label.className = "atlas-layer-" + type;
                    var input = document.createElement('input');
                    input.type = type;
                    if (type === 'radio') {
                        input.name = groupName_1;
                    }
                    input.checked = item.enabled;
                    label.appendChild(input);
                    var span = document.createElement('span');
                    span.innerHTML = Utils.getString(item.label, self._options.resx);
                    label.appendChild(span);
                    self._bindLayerState(item, layerGroup, input);
                    //Store min/max zoom info as attributes.
                    Utils.setZoomRangeAttr(item, self._baseOptions, label);
                    itemContainer.appendChild(label);
                });
            }
            return itemContainer;
        };
        /**
         * Creates a slider.
         * @param layerGroup The layer group options.
         * @returns A slider.
         */
        LayerControl.prototype._createRange = function (layerGroup) {
            var self = this;
            var itemContainer = document.createElement('div');
            if (layerGroup.items) {
                var items = layerGroup.items;
                var getNumber_1 = Utils.getNumber;
                var measureText_1 = Utils.measureText;
                var placeholder_1 = '{rangeValue}';
                items.forEach(function (item) {
                    //<label><input type="range" /><span>Option 1</span></label>
                    var label = document.createElement('label');
                    label.className = 'atlas-layer-range';
                    var input = document.createElement('input');
                    input.type = 'range';
                    var min = getNumber_1(item, 'min', 0, 0);
                    var max = getNumber_1(item, 'max', 0, 1);
                    var step = getNumber_1(item, 'step', 0, 0.1);
                    var value = getNumber_1(item, 'value', 0, 1);
                    input.setAttribute('min', min + '');
                    input.setAttribute('max', max + '');
                    input.setAttribute('step', step + '');
                    input.value = value + '';
                    label.appendChild(input);
                    var span = document.createElement('span');
                    var labelString = item.label ? Utils.getString(item.label, self._options.resx) : placeholder_1;
                    var numberFormat = new Intl.NumberFormat(undefined, item.numberFormat || {});
                    span.innerHTML = labelString.replace(placeholder_1, numberFormat.format(value));
                    //Try and determine max width of label. Measure min, max, value, and max minus the step.
                    span.style.minWidth = Math.max(measureText_1(labelString.replace(placeholder_1, numberFormat.format(value)), 12, 'Arial').width, measureText_1(labelString.replace(placeholder_1, numberFormat.format(min)), 12, 'Arial').width, measureText_1(labelString.replace(placeholder_1, numberFormat.format(max)), 12, 'Arial').width, measureText_1(labelString.replace(placeholder_1, numberFormat.format(max - step)), 12, 'Arial').width) + 'px';
                    label.appendChild(span);
                    //Store min/max zoom info as attributes.
                    Utils.setZoomRangeAttr(item, self._baseOptions, label);
                    self._bindLayerState(item, layerGroup, input, item.updateOnInput);
                    itemContainer.appendChild(label);
                });
            }
            return itemContainer;
        };
        /**
         * Updates the cached state of an item.
         * @param item The item.
         * @param layers The associated layers.
         * @param elm The element that triggers the state change.
         * @returns The old state.
         */
        LayerControl.prototype._updateStateCache = function (item, layers, elm) {
            var self = this;
            var legendControl = self._options.legendControl;
            //Handle old state of radio buttons.
            if ((elm instanceof HTMLInputElement && elm.type === 'radio') || elm instanceof HTMLSelectElement) {
                var state = item;
                var oldState = self._stateCache[elm.name];
                if (oldState && oldState !== item) {
                    //Disable old state.
                    oldState.enabled = !state.enabled;
                    //Trigger disabled styles.
                    var oldStyle_1 = (oldState.enabled) ? oldState.enabledStyle : oldState.disabledStyle;
                    if (oldStyle_1 && oldState.layers) {
                        oldState.layers.forEach(function (layer) { return self._setLayerStyle(layer, oldStyle_1); });
                    }
                    //Remove any associated legend.
                    if (legendControl && oldState.legends) {
                        oldState.legends.forEach(function (l) {
                            legendControl.remove(l);
                        });
                    }
                    if (state.enabled) {
                        self._stateCache[elm.name] = state;
                        return oldState;
                    }
                }
                else if (!oldState && state.enabled) {
                    self._stateCache[elm.name] = state;
                }
            }
            return null;
        };
        /**
         * Inflates the styles of a state.
         * @param state The state to inflate the styles on.
         * @param layers The associated layers.
         */
        LayerControl.prototype._inflateLayerStateStyles = function (state, layers) {
            var self = this;
            if (state['enabledStyle']) {
                self._inflateStyle(state['enabledStyle'], layers);
            }
            if (state['disabledStyle']) {
                self._inflateStyle(state['disabledStyle'], layers);
            }
            if (state['style']) {
                self._inflateStyle(state['style'], layers);
            }
        };
        /**
         * Inflates a style such that color/fillColor, opacity/fillOpacity will share their settings unless explicitly set.
         * This allows a single style to be specified and easily used with different layer types.
         * @param style The style to inflate.
         * @param layers The associated layers.
         */
        LayerControl.prototype._inflateStyle = function (style, layers) {
            if (style) {
                var enhancedStyles_1 = {};
                var keys = Object.keys(style);
                var hasBubble_1 = false;
                var hasLine_1 = false;
                layers.forEach(function (l) {
                    if (l instanceof azmaps.layer.BubbleLayer) {
                        hasBubble_1 = true;
                    }
                    else if (l instanceof azmaps.layer.LineLayer) {
                        hasLine_1 = true;
                    }
                });
                keys.forEach(function (key) {
                    switch (key) {
                        case 'color':
                            if (!style.fillColor) {
                                enhancedStyles_1.fillColor = style.color;
                            }
                            break;
                        case 'fillColor':
                            if (!style.color) {
                                enhancedStyles_1.color = style.fillColor;
                            }
                            if (hasLine_1 && !hasBubble_1 && !style.strokeColor) {
                                enhancedStyles_1.strokeColor = style.fillColor;
                            }
                            break;
                        case 'opacity':
                            if (!style.fillOpacity) {
                                enhancedStyles_1.fillOpacity = style.opacity;
                            }
                            break;
                        case 'fillOpacity':
                            if (!style.opacity) {
                                enhancedStyles_1.opacity = style.fillOpacity;
                            }
                            if (hasLine_1 && !hasBubble_1 && !style.strokeOpacity) {
                                enhancedStyles_1.strokeOpacity = style.strokeOpacity;
                            }
                            break;
                    }
                });
                Object.assign(style, enhancedStyles_1);
            }
        };
        /**
         * Sets the style on a layer.
         * @param layer The layer name or instance.
         * @param style The style.
         */
        LayerControl.prototype._setLayerStyle = function (layer, style) {
            if (layer) {
                layer = Utils.getLayer(layer, this._map);
                if (layer['setOptions']) {
                    var s = style;
                    if (layer instanceof azmaps.layer.LineLayer) {
                        if (!style.strokeColor && style.color) {
                            s = Object.assign({ strokeColor: style.color }, s);
                        }
                        if (!style.strokeOpacity && style.opacity) {
                            s = Object.assign({ strokeOpacity: style.opacity }, s);
                        }
                    }
                    layer['setOptions'](s);
                }
            }
        };
        /**
         * Gets all Azure Maps layers within a state and layer group.
         * @param state The state.
         * @param layerGroup The layer group.
         * @returns All Azure Maps layers within a state and layer group.
         */
        LayerControl.prototype._getAllAzLayers = function (state, layerGroup) {
            var self = this;
            var map = self._map;
            //Ensure we have a unique list of layers between the layer group layers and the state level defined layers.
            var layers = [];
            if (map) {
                if (layerGroup && layerGroup.layers) {
                    layerGroup.layers.forEach(function (l) {
                        var tl = Utils.getLayer(l, map);
                        if (tl) {
                            layers.push(tl);
                        }
                    });
                }
                if (state) {
                    if (state.layers) {
                        state.layers.forEach(function (l) {
                            var li = Utils.getLayer(l, map);
                            if (layers.indexOf(li) === -1) {
                                layers.push(li);
                            }
                        });
                    }
                }
                else {
                    //If state isn't passed in, grab layers for all states.
                    layerGroup.items.forEach(function (s) {
                        if (s.layers) {
                            s.layers.forEach(function (l) {
                                var li = Utils.getLayer(l, map);
                                if (layers.indexOf(li) === -1) {
                                    layers.push(li);
                                }
                            });
                        }
                    });
                }
            }
            return layers;
        };
        /**
         * Creates a layer group for a dynamic layer group.
         * @param dynamicLayerGroup A dynamic layer group to process.
         */
        LayerControl.prototype._getLayerGroup = function (dynamicLayerGroup) {
            if (!dynamicLayerGroup.layout) {
                return;
            }
            var self = this;
            var layerGroup = {
                cssClass: dynamicLayerGroup.cssClass,
                groupTitle: dynamicLayerGroup.groupTitle,
                legends: dynamicLayerGroup.legends,
                items: [],
                //@ts-ignore
                layout: dynamicLayerGroup.layout || 'checkbox'
            };
            //Get the layers from the map.
            var layers = Utils.getMapLayers(self._map, dynamicLayerGroup.layerFilter);
            var labelProperty = dynamicLayerGroup.labelProperty;
            if (layers && layers.length > 0) {
                //For radio and dropdowns, either select the first visible layer, or make the first visible.
                var hasSelection_1 = false;
                layers.forEach(function (l) {
                    var opt = (l['getOptions']) ? l['getOptions']() : {};
                    var enabled = opt.visible;
                    if (enabled === undefined) {
                        enabled = true;
                    }
                    if (layerGroup.layout === 'dropdown' || layerGroup.layout === 'radio') {
                        if (hasSelection_1) {
                            enabled = false;
                            if (l['setOptions']) {
                                l['setOptions']({ visible: false });
                            }
                        }
                        else if (enabled) {
                            hasSelection_1 = true;
                        }
                    }
                    var label = Utils.getString((labelProperty && l.metadata && l.metadata[labelProperty] && l.metadata[labelProperty] !== '') ? l.metadata[labelProperty] : l.getId(), self._options.resx);
                    var ogcLayer = azmaps.layer['OgcMapLayer'];
                    var simpleLayer = azmaps.layer['SimpleDataLayer'];
                    if (l.getId() === label && label.indexOf('-') > -1) {
                        //If it is an OGC Map layer, get the label from the capabilities.
                        if (ogcLayer && l instanceof ogcLayer) {
                            var ogc = l;
                            var client = ogc._client;
                            if (client && client._capabilities) {
                                var cap = client._capabilities;
                                if (cap.title && cap.title !== '' && cap.title.toLowerCase() === 'wms') {
                                    label = cap.title;
                                }
                                else {
                                    var activeLayers = ogc.getOptions().activeLayers;
                                    var sublayers = cap.sublayers;
                                    if (activeLayers.length === 1 && sublayers) {
                                        var al = activeLayers[0];
                                        for (var i = 0; i < sublayers.length; i++) {
                                            if ((typeof al === 'string' && al === sublayers[i].id) || al.id === sublayers[i].id) {
                                                var styles = al.styles;
                                                if (styles && styles.length > 0 && styles[0].legendUrl && styles[0].legendUrl !== '') {
                                                    label = al.title || al.subtitle || sublayers[i].id || '';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                //If no client or capabilities, reload the capabilities.
                                ogc.getCapabilities().then(function (cap) {
                                    if (cap) {
                                        self._rebuildContainer();
                                    }
                                });
                            }
                        }
                        else if (simpleLayer && l instanceof simpleLayer) {
                            var sLayer = l;
                            if (sLayer.metadata) {
                                label = sLayer.metadata.title || sLayer.metadata.name || '';
                            }
                        }
                    }
                    layerGroup.items.push({
                        layers: [l],
                        label: label,
                        enabled: enabled,
                        enabledStyle: {
                            visible: true
                        },
                        disabledStyle: {
                            visible: false
                        },
                        minZoom: Utils.getNumber(opt, 'minZoom', 0, 0),
                        maxZoom: Utils.getNumber(opt, 'maxZoom', 0, 24),
                    });
                });
                if (!hasSelection_1 && (layerGroup.layout === 'dropdown' || layerGroup.layout === 'radio')) {
                    layerGroup.items[0].enabled = true;
                    if (layers[0]['setOptions']) {
                        layers[0]['setOptions']({ visible: true });
                    }
                }
            }
            else {
                return;
            }
            return layerGroup;
        };
        return LayerControl;
    }(BaseControl));



    var baseControl = /*#__PURE__*/Object.freeze({
        __proto__: null,
        LegendControl: LegendControl,
        LayerControl: LayerControl
    });

    var control = Namespace.merge("atlas.control", baseControl);

    exports.control = control;

}(this.atlas = this.atlas || {}, atlas));
