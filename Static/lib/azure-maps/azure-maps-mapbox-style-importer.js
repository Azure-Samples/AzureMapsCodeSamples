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

    /** A class that converts Mapbox styles into native Azure Maps classes and imports them into an Azure Maps instance. */
    var MapboxStyleImporter = /** @class */ (function () {
        /**
         * A class that converts Mapbox styles into native Azure Maps classes and imports them into an Azure Maps instance.
         * @param map Map to add styles to.
         */
        function MapboxStyleImporter(map) {
            /** Local cache of raster sources since Azure Maps doesn't separate these from layers. */
            this.rasterSources = {};
            this._map = map;
        }
        /**
         * Extracts Mapbox light, source, and layer styles, converts them to Azure Maps comparable values, and applies it to the map.
         * @param mapboxStyle Mapbox style to add to the map.
         */
        MapboxStyleImporter.prototype.addStyle = function (mapboxStyle) {
            var self = this;
            var map = self._map;
            if (mapboxStyle.light) {
                map.setStyle({
                    light: self._convertOptions(mapboxStyle.light)
                });
            }
            if (mapboxStyle.sources) {
                Object.keys(mapboxStyle.sources).forEach(function (key) {
                    self.addSource(key, mapboxStyle.sources[key]);
                });
            }
            if (mapboxStyle.layers) {
                mapboxStyle.layers.forEach(function (mbLayer) {
                    self.addLayer(mbLayer);
                });
            }
        };
        /**
         * Converts a Mapbox style source to an Azure Map source and adds it to a map.
         * @param mapboxSource Mapbox source to add to map.
         */
        MapboxStyleImporter.prototype.addSource = function (id, mapboxSource) {
            var self = this;
            var map = self._map;
            var opt = self._convertOptions(mapboxSource);
            switch (mapboxSource.type) {
                case 'image':
                case 'raster':
                    if (id) {
                        self.rasterSources[id] = opt;
                    }
                    break;
                case 'geojson':
                    self._addDataSource(opt, mapboxSource, id);
                    break;
                case 'vector':
                    map.sources.add(new azmaps.source.VectorTileSource(id, opt));
                    break;
            }
        };
        /**
         * Converts a Mapbox style layer to an Azure Map layer and adds it to a map.
         * @param mapboxLayer Mapbox layer to add to map.
         * @param beforeLayer The ID of a layer to add this layer before.
         * @returns Azure Maps layer instance or null.
         */
        MapboxStyleImporter.prototype.addLayer = function (mapboxLayer, beforeLayer) {
            var self = this;
            var map = self._map;
            if (MapboxStyleImporter.supportedMBLayers.indexOf(mapboxLayer.type) > -1) {
                var source = mapboxLayer['source'];
                if (typeof source === 'string') {
                    //Source is a string ID. Check to see if raster source options have already been extracted, but not added to map.
                    if (self.rasterSources[source]) {
                        source = self.rasterSources[source];
                    }
                }
                else {
                    var s = self._convertOptions(source);
                    //Source is specified inline, need to extract.
                    switch (source.type) {
                        case 'image':
                        case 'raster':
                            source = s;
                            break;
                        case 'geojson':
                            source = self._addDataSource(opt, source);
                            break;
                        case 'vector':
                            source = new azmaps.source.VectorTileSource(null, s);
                            break;
                    }
                }
                var layer;
                var id = mapboxLayer.id;
                var opt = self._convertOptions(mapboxLayer);
                //Each layer merges the parsed options with the default Mapbox options (Azure Maps sometimes uses different defaults).
                switch (mapboxLayer.type) {
                    case 'circle':
                        layer = new azmaps.layer.BubbleLayer(source, id, Object.assign({
                            color: '#000000',
                            radius: 5,
                            strokeColor: '#000000',
                            strokeWidth: 0
                        }, opt));
                        break;
                    case 'heatmap':
                        layer = new azmaps.layer.HeatMapLayer(source, id, opt);
                        break;
                    case 'line':
                        layer = new azmaps.layer.LineLayer(source, id, Object.assign({
                            strokeColor: '#000000',
                            lineCap: 'butt',
                            lineJoin: 'miter',
                            strokeWidth: 2
                        }, opt));
                        break;
                    case 'fill-extrusion':
                        layer = new azmaps.layer.PolygonExtrusionLayer(source, id, Object.assign({
                            fillColor: '#000000',
                            fillOpacity: 1
                        }, opt));
                        break;
                    case 'fill':
                        layer = new azmaps.layer.PolygonLayer(source, id, Object.assign({
                            fillColor: '#000000',
                            fillOpacity: 1
                        }, opt));
                        break;
                    case 'symbol':
                        //Default options.
                        var symOptions = Object.assign({}, {
                            iconOptions: {
                                image: 'none'
                            },
                            textOptions: {}
                        });
                        if (opt.iconOptions) {
                            Object.assign(symOptions.iconOptions, opt.iconOptions);
                        }
                        if (opt.textOptions) {
                            Object.assign(symOptions.textOptions, opt.textOptions);
                        }
                        layer = new azmaps.layer.SymbolLayer(source, id, symOptions);
                        break;
                    case 'raster':
                        var opt = Object.assign(opt, source);
                        if (source.coordinates) {
                            //is image layer
                            layer = new azmaps.layer.ImageLayer(opt, id);
                        }
                        else {
                            //is tile layer
                            layer = new azmaps.layer.TileLayer(opt, id);
                        }
                        break;
                }
                if (layer) {
                    if (mapboxLayer['metadata']) {
                        layer.metadata = mapboxLayer['metadata'];
                    }
                    //Validate before layer.
                    if (beforeLayer) {
                        var l = map.layers.getLayerById(beforeLayer);
                        if (!l) {
                            var smBeforeLabel = beforeLayer.toLowerCase();
                            if (smBeforeLabel.indexOf('label') > 0) {
                                beforeLayer = 'labels';
                            }
                            else if (smBeforeLabel.indexOf('road') > 0) {
                                beforeLayer = 'transit';
                            }
                            else {
                                beforeLayer = undefined;
                            }
                        }
                    }
                    map.layers.add(layer, beforeLayer);
                    return layer;
                }
            }
            return null;
        };
        /**
         * Updates the style options of a layer.
         * @param layer The layer id or instance to set the options on.
         * @param options Mapbox or Azure Maps style options to apply to the layer.
         */
        MapboxStyleImporter.prototype.setLayerOptions = function (layer, options) {
            if (layer) {
                var l = (typeof layer === 'string') ? this._map.layers.getLayerById(layer) : layer;
                if (l['setOptions']) {
                    var opt = this._convertOptions(options);
                    l['setOptions'](opt);
                }
            }
        };
        /**
         * Extracts an Azure Maps DataSource from an Mapbox GeoJSON source.
         * @param mbSource A Mapbox GeoJSON source object.
         * @param id The id of the source, if there is one.
         * @returns An Azure Maps DataSource.
         */
        MapboxStyleImporter.prototype._addDataSource = function (azOptions, mbSource, id) {
            var source = new azmaps.source.DataSource(id, azOptions);
            this._map.sources.add(source);
            if (mbSource.data) {
                if (typeof mbSource.data === 'string') {
                    //data is a URL.
                    source.importDataFromUrl(mbSource.data);
                }
                else {
                    //data is raw geojson.
                    source.add(mbSource.data);
                }
            }
            return source;
        };
        /**
         * Extracts all supported Mapbox options and maps them to Azure Maps equivalent options.
         * @param mbSource Mapbox options
         * @returns Azure Maps options.
         */
        MapboxStyleImporter.prototype._convertOptions = function (mbOptions) {
            var opt = {};
            var self = this;
            Object.keys(mbOptions).forEach(function (key) {
                self._extractOption(key, mbOptions, opt);
            });
            if (mbOptions.paint) {
                Object.assign(opt, self._convertOptions(mbOptions.paint));
            }
            if (mbOptions.layout) {
                Object.assign(opt, self._convertOptions(mbOptions.layout));
            }
            return opt;
        };
        /**
         * Converts commonly used options.
         * @param key Property name.
         * @param mbOptions Mapbox options
         * @param azOptions Azure Maps option.
         */
        MapboxStyleImporter.prototype._extractOption = function (key, mbOptions, azOptions) {
            var self = this;
            var val = mbOptions[key];
            switch (key) {
                case 'scheme':
                    azOptions.isTMS = (val === 'tms');
                    break;
                case 'visibility':
                    azOptions.visible = (val !== "none");
                    break;
                case 'clusterProperties':
                    azOptions.clusterProperties = val;
                    break;
                case 'tiles':
                    //Array of formatted tile URLs.
                    azOptions.tileUrl = val[0];
                    break;
                case 'url':
                    //TileJSON URL
                    azOptions.tileUrl = val;
                    azOptions.url = val;
                    break;
                case 'text-font':
                    var mbFonts = val;
                    var azFonts = [];
                    //Try and convert Mapbox fonts to alternative Azure Maps fonts.
                    mbFonts.forEach(function (f) {
                        var oldFont = f.toLowerCase();
                        var fName = 'StandardFont';
                        //Get font name.
                        if (oldFont.indexOf('condensed') > -1) {
                            fName = 'StandardFontCondensed';
                        }
                        //else if(oldFont.indexOf('condensed') > -1){
                        //    fName = 'StandardFontCondensed';
                        //}
                        var fStyle = 'Regular';
                        //Get font style
                        if (oldFont.indexOf('bold') > -1) {
                            fStyle = 'Bold';
                        }
                        else if (oldFont.indexOf('black') > -1) {
                            fStyle = 'Black';
                        }
                        else if (oldFont.indexOf('light') > -1) {
                            fStyle = 'Light';
                        }
                        //else if(oldFont.indexOf('regular') > -1){
                        //    fStyle = 'Regular';
                        //}
                        var newFont = fName + '-' + fStyle;
                        if (fName && azFonts.indexOf(newFont) == -1) {
                            azFonts.push(newFont);
                        }
                    });
                    if (azFonts.length > 0) {
                        //WORKAROUND: Only taking first font for now to work around a bug in Azure Maps.
                        azOptions.textOptions = Object.assign(azOptions.textOptions || {}, { font: [azFonts[0]] });
                    }
                    break;
                case 'icon-image':
                    //Make sure the map has the required image.
                    if (!self._map.imageSprite.hasImage(val)) {
                        var loadIcon = true;
                        if (val.indexOf('marker') > -1) {
                            val = 'marker-blue';
                            loadIcon = false;
                        }
                        else if (val.indexOf('triangle') > -1 || val.indexOf('campsite') > -1) {
                            val = 'triangle';
                        }
                        else if (val.indexOf('car') > -1) {
                            val = 'car';
                        }
                        else if (val.indexOf('circle') > -1) {
                            val = 'pin-round';
                        }
                        else if (val.indexOf('embassy') > -1) {
                            val = 'flag';
                        }
                        else {
                            val = 'none';
                            loadIcon = false;
                        }
                        if (val && loadIcon && !self._map.imageSprite.hasImage(val)) {
                            self._map.imageSprite.createFromTemplate(val, val, '#1E90FF', '#fff', 1).then(function () { });
                        }
                    }
                    if (val) {
                        azOptions.iconOptions = Object.assign(azOptions.iconOptions || {}, { image: val });
                    }
                    break;
                //Add support for specific Azure Maps styles.
                case "iconOptions":
                    azOptions.iconOptions = Object.assign(azOptions.iconOptions || {}, val || {});
                    break;
                case "textOptions":
                    azOptions.textOptions = Object.assign(azOptions.textOptions || {}, val || {});
                    break;
                default:
                    //Lookup alternate name, where values stay the same.
                    var azName = MapboxStyleImporter.mbToAzName[key];
                    //If no known mapping of names, try snapping to the common change of dashed to camel casing. 
                    //This will increase the chance of future features in azure Maps automatically working with this module.
                    if (!azName) {
                        azName = self._mbNameToCamelCase(key);
                        if (key.startsWith('text-')) {
                            azName = azName.replace('text', 'textOptions-');
                        }
                        else if (key.startsWith('icon-')) {
                            azName = azName.replace('icon', 'iconOptions-');
                        }
                    }
                    if (azName) {
                        //Handle symbol layer options which separates text and icon options for clarity.
                        if (azName.indexOf('-') > -1) {
                            var path = azName.split('-');
                            if (!azOptions[path[0]]) {
                                azOptions[path[0]] = {};
                            }
                            azOptions[path[0]][path[1]] = val;
                        }
                        else {
                            azOptions[azName] = val;
                        }
                    }
                    break;
            }
        };
        MapboxStyleImporter.prototype._mbNameToCamelCase = function (input) {
            var idx = input.indexOf('-');
            if (idx > -1) {
                input = input.substr(idx + 1);
            }
            return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        };
        /** List of supported Mapbox layer types. */
        MapboxStyleImporter.supportedMBLayers = ['circle', 'fill', 'fill-extrusion', 'line', 'heatmap', 'raster', 'symbol'];
        /** List of supported Mapbox source types. */
        MapboxStyleImporter.supportedMBSources = ['vector', 'raster', 'geojson', 'image'];
        /**
         * Mapbox to Azure Maps name of properties where the values are the same and don't need any conversion.
         */
        MapboxStyleImporter.mbToAzName = {
            //Many options are commented out as they are automatically detected.
            'source-layer': 'sourceLayer',
            // 'filter': 'filter',
            'minzoom': 'minZoom',
            'maxzoom': 'maxZoom',
            //Light settings.
            // 'anchor': 'anchor',
            // 'color': 'color',
            // 'intensity': 'intensity',
            //  'position': 'position',
            //GeoJson options
            //  'buffer': 'buffer',
            //  'cluster': 'cluster',
            //  'clusterProperties': 'clusterProperties',
            //  'clusterMaxZoom': 'clusterMaxZoom',
            //  'clusterRadius': 'clusterRadius',
            //  'lineMetrics': 'lineMetrics',
            //   'tolerance': 'tolerance',
            //Raster/image/Vector source
            //   'tileSize': 'tileSize',
            //   'url': 'url',
            //   'bounds': 'bounds',
            //   'coordinates': 'coordinates',
            //raster/MediaOptions
            'raster-brightness-min': 'minBrightness',
            'raster-brightness-max': 'maxBrightness',
            //  'raster-contrast': 'contrast',
            //   'raster-fade-duration': 'fadeDuration',
            //  'raster-hue-rotate': 'hueRotation',
            // 'raster-opacity': 'opacity',
            // 'raster-saturation': 'saturation',
            //line/LineLayer options
            // 'line-blur': 'blur',
            'line-cap': 'lineCap',
            'line-color': 'strokeColor',
            'line-dasharray': 'strokeDashArray',
            'line-width': 'strokeWidth',
            'line-gradient': 'strokeGradient',
            'line-join': 'lineJoin',
            'line-opacity': 'strokeOpacity',
            // 'line-translate': 'translate',
            // 'line-translate-anchor': 'translateAnchor',
            // 'line-offset': 'offset',
            //fill/PolygonLayer options
            'fill-color': 'fillColor',
            'fill-opacity': 'fillOpacity',
            'fill-pattern': 'fillPattern',
            //fill-extrusion/PolygonExtrusionLayer options
            'fill-extrusion-base': 'base',
            'fill-extrusion-height': 'height',
            'fill-extrusion-color': 'fillColor',
            'fill-extrusion-opacity': 'fillOpacity',
            'fill-extrusion-pattern': 'fillPattern',
            'fill-extrusion-translate': 'translate',
            'fill-extrusion-translate-anchor': 'translateAnchor',
            'fill-extrusion-vertical-gradient': 'verticalGradient',
            //Circle/BubbleLayer options
            // 'circle-blur': 'blur',
            // 'circle-color': 'color',
            // 'circle-opacity': 'opacity',
            // 'circle-pitch-alignment': 'pitchAlignment',
            // 'circle-radius': 'radius',
            'circle-stroke-color': 'strokeColor',
            'circle-stroke-opacity': 'strokeOpacity',
            'circle-stroke-width': 'strokeWidth',
            //Heatmap options
            // 'heatmap-color': 'color',
            // 'heatmap-intensity': 'intensity',
            // 'heatmap-opacity': 'opacity',
            // 'heatmap-radius': 'radius',
            // 'heatmap-weight': 'weight',
            //Symbol base options
            'symbol-spacing': 'lineSpacing',
            'symbol-placement': 'placement',
            //Symbol icon options
            'icon-allow-overlap': 'iconOptions-allowOverlap',
            'icon-anchor': 'iconOptions-anchor',
            'icon-ignore-placement': 'iconOptions-ignorePlacement',
            'icon-image': 'iconOptions-image',
            'icon-offset': 'iconOptions-offset',
            'icon-opacity': 'iconOptions-opacity',
            'icon-optional': 'iconOptions-optional',
            'icon-pitch-alignment': 'iconOptions-pitchAlignment',
            'icon-rotate': 'iconOptions-rotation',
            'icon-rotation-alignment': 'iconOptions-rotationAlignment',
            //Symbol text options
            'text-allow-overlap': 'textOptions-allowOverlap',
            'text-anchor': 'textOptions-anchor',
            'text-color': 'textOptions-color',
            'text-halo-blur': 'textOptions-haloBlur',
            'text-halo-color': 'textOptions-haloColor',
            'text-halo-width': 'textOptions-haloWidth',
            'text-ignore-placement': 'textOptions-ignorePlacement',
            'text-offset': 'textOptions-offset',
            'text-opacity': 'textOptions-opacity',
            'text-optional': 'textOptions-optional',
            'text-pitch-alignment': 'textOptions-pitchAlignment',
            'text-rotate': 'textOptions-rotation',
            'text-rotation-alignment': 'textOptions-rotationAlignment',
            'text-size': 'textOptions-size',
            'text-field': 'textOptions-textField',
        };
        return MapboxStyleImporter;
    }());

    exports.MapboxStyleImporter = MapboxStyleImporter;

}(this.atlas = this.atlas || {}, atlas));
