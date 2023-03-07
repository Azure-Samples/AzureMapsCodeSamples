/*
azure-maps-spider-clusters Version: 0.0.1

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

    /**
    * Adds a visualization to the map which expands clusters into a spiral spider layout.
    */
    var SpiderClusterManager = /** @class */ (function (_super) {
        __extends(SpiderClusterManager, _super);
        /**********************
        * Constructor
        ***********************/
        /**
        * @constructor
        * A cluster manager that expands clusters when selectd into a spiral layout.
        * @param map A map instance to add the cluster layer to.
        * @param clusterLayer The layer used for rendering the clusters.
        * @param unclustedLayer The rendering layer used for displaying unclustered data (individual features).
        * @param options A combination of SpiderClusterManager and Cluster options.
        */
        function SpiderClusterManager(map, clusterLayer, unclustedLayer, options) {
            var _this = _super.call(this) || this;
            _this._hoverStateId = null;
            _this._options = {
                circleSpiralSwitchover: 6,
                minCircleLength: 30,
                minSpiralAngleSeperation: 25,
                spiralDistanceFactor: 5,
                maxFeaturesInWeb: 100,
                closeWebOnPointClick: true,
                stickLayerOptions: {
                    strokeColor: [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        'red',
                        'black'
                    ]
                }
            };
            /**
            * Collapses any open/expanded spider clusters.
            */
            _this.hideSpiderCluster = function (e) {
                var self = _this;
                //If closeWebOnPointClick is false, only hide the spider web if the first feature is not in the web layer.
                //If closeWebOnPointClick is true, hide the spider web.
                if (!e || self._options.closeWebOnPointClick ||
                    //@ts-ignore      
                    (!self._options.closeWebOnPointClick && e.shapes && e.shapes.length > 0 && (e.shapes[0] instanceof azmaps.Shape && e.shapes[0].dataSource && e.shapes[0].dataSource.id !== self._spiderDataSource.getId()))) {
                    self._spiderDataSource.clear();
                }
            };
            /**********************
            * Private Functions
            ***********************/
            /**
            * Click event handler for when a shape in the cluster layer is clicked.
            * @param e The mouse event argurment from the click event.
            */
            _this._layerClickEvent = function (e) {
                var self = _this;
                if (e && e.shapes && e.shapes.length > 0) {
                    var prop = void 0;
                    var pos_1;
                    var s = void 0;
                    var cluster = void 0;
                    if (e.shapes[0] instanceof azmaps.Shape) {
                        s = e.shapes[0];
                        prop = s.getProperties();
                        pos_1 = s.getCoordinates();
                    }
                    else {
                        cluster = e.shapes[0];
                        prop = cluster.properties;
                        pos_1 = cluster.geometry.coordinates;
                    }
                    if (cluster && prop.cluster) {
                        self._invokeEvent('featureUnselected', null);
                        self._currentCluster = e.shapes[0];
                        if (prop.point_count > self._options.maxFeaturesInWeb) {
                            self._datasource.getClusterExpansionZoom(prop.cluster_id).then(function (zoom) {
                                self._map.setCamera({
                                    center: pos_1,
                                    zoom: zoom
                                });
                            });
                        }
                        else {
                            self.showSpiderCluster(cluster);
                        }
                    }
                    else {
                        if (typeof prop._parentId !== 'undefined') {
                            s = self._datasource.getShapeById(prop._parentId);
                        }
                        else {
                            self._currentCluster = null;
                        }
                        if (s) {
                            self._invokeEvent('featureSelected', {
                                cluster: self._currentCluster,
                                shape: s
                            });
                        }
                        if (self._options.closeWebOnPointClick) {
                            self.hideSpiderCluster();
                        }
                    }
                    e.preventDefault();
                }
            };
            /**
             * Event handler for when the user is hovering over a feature and the stick joining it to a cluster should be highlighted.
             * @param e mouse event.
             */
            _this._highlightStick = function (e) {
                var self = _this;
                if (e && e.shapes && e.shapes.length > 0) {
                    var stickId = void 0;
                    if (e.shapes[0] instanceof azmaps.Shape) {
                        stickId = e.shapes[0].getProperties()._stickId;
                    }
                    else {
                        stickId = e.shapes[0].properties._stickId;
                    }
                    var info = { source: self._spiderDatasourceId, id: self._hoverStateId };
                    var map = self._map;
                    if (self._hoverStateId) {
                        //TODO: replace with built-in function.
                        //@ts-ignore
                        map.map.setFeatureState(info, { hover: false });
                    }
                    self._hoverStateId = stickId;
                    info.id = stickId;
                    //TODO: replace with built-in function.
                    //@ts-ignore
                    map.map.setFeatureState(info, { hover: true });
                    map.getCanvasContainer().style.cursor = 'pointer';
                }
            };
            /**
             * Event handler for when the user stops hovering over a feature and the stick joining it to a cluster should be unhighlighted.
             * @param e mouse event.
             */
            _this._unhighlightStick = function (e) {
                var self = _this;
                if (self._hoverStateId) {
                    //TODO: replace with built-in function.
                    //@ts-ignore
                    self._map.map.setFeatureState({ source: self._spiderDatasourceId, id: self._hoverStateId }, { hover: false });
                    self._hoverStateId = null;
                    self._map.getCanvasContainer().style.cursor = 'grab';
                }
            };
            var self = _this;
            var azlayer = azmaps.layer;
            self._map = map;
            self._clusterLayer = clusterLayer;
            var s = clusterLayer.getSource();
            if (typeof s === 'string') {
                s = map.sources.getById(s);
            }
            if (s instanceof azmaps.source.DataSource) {
                self._datasource = s;
            }
            else {
                throw 'Data source on cluster layer is not supported.';
            }
            options = options || {};
            //Create a data source to manage the spider lines. 
            var spiderDataSource = new azmaps.source.DataSource();
            self._spiderDataSource = spiderDataSource;
            map.sources.add(spiderDataSource);
            self._spiderDatasourceId = spiderDataSource.getId();
            self._spiderLineLayer = new azlayer.LineLayer(spiderDataSource, null, self._options.stickLayerOptions);
            map.layers.add(self._spiderLineLayer);
            //Make a copy of the cluster layer options.
            var unclustedLayerOptions = Object.assign({}, unclustedLayer.getOptions());
            unclustedLayerOptions.source = undefined;
            unclustedLayerOptions.filter = ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]; //Only render Point or MultiPoints in this layer.;        
            self._unclustedLayer = unclustedLayer;
            var spiderFeatureLayer;
            if (unclustedLayer instanceof azlayer.BubbleLayer) {
                spiderFeatureLayer = new azlayer.BubbleLayer(spiderDataSource, null, unclustedLayerOptions);
            }
            else {
                unclustedLayerOptions.iconOptions = unclustedLayerOptions.iconOptions || {};
                Object.assign(unclustedLayerOptions.iconOptions, {
                    allowOverlap: true,
                    ignorePlacement: true
                });
                spiderFeatureLayer = new azlayer.SymbolLayer(spiderDataSource, null, unclustedLayerOptions);
            }
            self._spiderFeatureLayer = spiderFeatureLayer;
            map.layers.add(spiderFeatureLayer);
            self.setOptions(options);
            var mapEvents = map.events;
            var layerClickEvent = self._layerClickEvent;
            var hideSpiderCluster = self.hideSpiderCluster;
            mapEvents.add('click', hideSpiderCluster);
            mapEvents.add('movestart', hideSpiderCluster);
            mapEvents.add('mouseleave', spiderFeatureLayer, self._unhighlightStick);
            mapEvents.add('mousemove', spiderFeatureLayer, self._highlightStick);
            mapEvents.add('click', clusterLayer, layerClickEvent);
            mapEvents.add('click', spiderFeatureLayer, layerClickEvent);
            mapEvents.add('click', unclustedLayer, layerClickEvent);
            return _this;
        }
        /**********************
        * Public Functions
        ***********************/
        /**
        * Disposes the SpiderClusterManager and releases it's resources.
        */
        SpiderClusterManager.prototype.dispose = function () {
            var self = this;
            var map = self._map;
            var mapEvents = map.events;
            var spiderFeatureLayer = self._spiderFeatureLayer;
            var layerClickEvent = self._layerClickEvent;
            var hideSpiderCluster = self.hideSpiderCluster;
            //Remove events.
            mapEvents.remove('click', hideSpiderCluster);
            mapEvents.remove('movestart', hideSpiderCluster);
            mapEvents.remove('click', self._clusterLayer, layerClickEvent);
            mapEvents.remove('mouseleave', spiderFeatureLayer, self._unhighlightStick);
            mapEvents.remove('mousemove', spiderFeatureLayer, self._highlightStick);
            mapEvents.remove('click', spiderFeatureLayer, layerClickEvent);
            mapEvents.remove('click', self._unclustedLayer, layerClickEvent);
            //Remove layers.
            map.layers.remove(spiderFeatureLayer);
            self._spiderFeatureLayer = null;
            map.layers.remove(self._spiderLineLayer);
            self._spiderLineLayer = null;
            //Clear and dispose of datasource.
            self._spiderDataSource.clear();
            map.sources.remove(self._spiderDataSource);
            self._spiderDataSource = null;
        };
        /**
         * Gets the options of the SpiderClusterManager.
         */
        SpiderClusterManager.prototype.getOptions = function () {
            return JSON.parse(JSON.stringify(this._options));
        };
        /**
         * Gets all layers managed by the spider cluster manager.
         */
        SpiderClusterManager.prototype.getLayers = function () {
            var self = this;
            return {
                clusterLayer: self._clusterLayer,
                unclustedLayer: self._unclustedLayer,
                spiderFeatureLayer: self._spiderFeatureLayer,
                spiderLineLayer: self._spiderLineLayer
            };
        };
        /**
        * Sets the options used to customize how the SpiderClusterManager renders clusters.
        * @param options The options used to customize how the SpiderClusterManager renders clusters.
        */
        SpiderClusterManager.prototype.setOptions = function (options) {
            var self = this;
            var opt = self._options;
            self.hideSpiderCluster();
            if (options) {
                if (typeof options.circleSpiralSwitchover === 'number') {
                    opt.circleSpiralSwitchover = options.circleSpiralSwitchover;
                }
                if (typeof options.maxFeaturesInWeb === 'number') {
                    opt.maxFeaturesInWeb = options.maxFeaturesInWeb;
                }
                if (typeof options.minSpiralAngleSeperation === 'number') {
                    opt.minSpiralAngleSeperation = options.minSpiralAngleSeperation;
                }
                if (typeof options.spiralDistanceFactor === 'number') {
                    opt.spiralDistanceFactor = options.spiralDistanceFactor;
                }
                if (typeof options.minCircleLength === 'number') {
                    opt.minCircleLength = options.minCircleLength;
                }
                if (typeof options.closeWebOnPointClick === 'boolean') {
                    opt.closeWebOnPointClick = options.closeWebOnPointClick;
                }
                if (options.stickLayerOptions) {
                    opt.stickLayerOptions = options.stickLayerOptions;
                    self._spiderLineLayer.setOptions(options.stickLayerOptions);
                }
                if (typeof options.visible === 'boolean' && opt.visible !== options.visible) {
                    opt.visible = options.visible;
                    self._spiderLineLayer.setOptions({ visible: options.visible });
                    self._spiderFeatureLayer.setOptions({ visible: options.visible });
                }
            }
        };
        /**
        * Expands a cluster into it's open spider layout.
        * @param cluster The cluster to show in it's open spider layout.
        */
        SpiderClusterManager.prototype.showSpiderCluster = function (cluster) {
            var _this = this;
            var self = this;
            var opt = self._options;
            var oldData = self._spiderDataSource.getShapes();
            if (cluster && cluster.properties.cluster) {
                var clusterId_1 = cluster.properties.cluster_id;
                if (oldData.length > 0 && oldData[0].getProperties().cluster_id === clusterId_1) {
                    //No need to reload the spider web. 
                    return;
                }
                self.hideSpiderCluster();
                self._datasource.getClusterLeaves(clusterId_1, opt.maxFeaturesInWeb, 0).then(function (children) {
                    //Create spider data.
                    var center = cluster.geometry.coordinates;
                    var centerPoint = self._map.positionsToPixels([center])[0];
                    var angle = 0;
                    var makeSpiral = children.length > opt.circleSpiralSwitchover;
                    var legPixelLength;
                    var stepAngle;
                    var stepLength;
                    if (makeSpiral) {
                        legPixelLength = opt.minCircleLength / Math.PI;
                        stepLength = 2 * Math.PI * opt.spiralDistanceFactor;
                    }
                    else {
                        stepAngle = 2 * Math.PI / children.length;
                        legPixelLength = (opt.spiralDistanceFactor / stepAngle / Math.PI / 2) * children.length;
                        if (legPixelLength < opt.minCircleLength) {
                            legPixelLength = opt.minCircleLength;
                        }
                    }
                    var shapes = [];
                    for (var i = 0, len = children.length; i < len; i++) {
                        //Calculate spider point feature location.
                        if (makeSpiral) {
                            angle += opt.minSpiralAngleSeperation / legPixelLength + i * 0.0005;
                            legPixelLength += stepLength / angle;
                        }
                        else {
                            angle = stepAngle * i;
                        }
                        var pos = self._map.pixelsToPositions([[
                                centerPoint[0] + legPixelLength * Math.cos(angle),
                                centerPoint[1] + legPixelLength * Math.sin(angle)
                            ]])[0];
                        //Create stick to point feature.
                        shapes.push(new azmaps.data.Feature(new azmaps.data.LineString([center, pos]), null, i + ''));
                        //Create point feature in spiral that contains same metadata as parent point feature.
                        var c = children[i];
                        var id = (c instanceof azmaps.Shape) ? c.getId() : c.id;
                        //Make a copy of the properties.
                        var p = Object.assign({}, (c instanceof azmaps.Shape) ? c.getProperties() : c.properties);
                        p._stickId = i + '';
                        p._parentId = id;
                        p._cluster = clusterId_1;
                        shapes.push(new azmaps.data.Feature(new azmaps.data.Point(pos), p));
                    }
                    _this._spiderDataSource.add(shapes);
                });
            }
        };
        return SpiderClusterManager;
    }(azmaps.internal.EventEmitter));

    exports.SpiderClusterManager = SpiderClusterManager;

}(this.atlas = this.atlas || {}, atlas));
