/**
* Adds a clustering layer to the map which expands clusters into a spiral spider layout.
*/
class SpiderClusterManager {
    /**********************
    * Constructor
    ***********************/
    /**
    * @constructor
    * A cluster manager that expands clusters when selectd into a spiral layout.
    * @param map A map instance to add the cluster layer to.
    * @param clusterLayer The layer used for rendering the clusters.
    * @param options A combination of SpiderClusterManager and Cluster options.
    */
    constructor(map, clusterLayer, unclustedLayer, options) {
        this._hoverStateId = null;
        this._options = {
            circleSpiralSwitchover: 6,
            minCircleLength: 30,
            minSpiralAngleSeperation: 25,
            spiralDistanceFactor: 5,
            maxFeaturesInWeb: 100,
            stickLayerOptions: {
                strokeColor: [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    'red',
                    'black'
                ]
            },
            featureSelected: null,
            featureUnselected: null
        };
        this._map = map;
        this._clusterLayer = clusterLayer;
        var s = clusterLayer.getSource();
        if (typeof s === 'string') {
            s = map.sources.getById(s);
        }
        if (s instanceof atlas.source.DataSource) {
            this._datasource = s;
        }
        else {
            throw 'Data source on cluster layer is not supported.';
        }
        options = options || {};
        //Create a data source to manage the spider lines. 
        this._spiderDataSource = new atlas.source.DataSource();
        map.sources.add(this._spiderDataSource);
        this._spiderDatasourceId = this._spiderDataSource.getId();
        this._spiderLineLayer = new atlas.layer.LineLayer(this._spiderDataSource, null, this._options.stickLayerOptions);
        map.layers.add(this._spiderLineLayer);
        //Make a copy of the cluster layer options.
        var unclustedLayerOptions = this._deepCopy(unclustedLayer.getOptions(), ['source']);
        unclustedLayerOptions.filter = ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]; //Only render Point or MultiPoints in this layer.;        
        this._unclustedLayer = unclustedLayer;
        if (unclustedLayer instanceof atlas.layer.BubbleLayer) {
            this._spiderFeatureLayer = new atlas.layer.BubbleLayer(this._spiderDataSource, null, unclustedLayerOptions);
        }
        else {
            unclustedLayerOptions.iconOptions = unclustedLayerOptions.iconOptions || {};
            unclustedLayerOptions.iconOptions.allowOverlap = true;
            unclustedLayerOptions.iconOptions.ignorePlacement = true;
            this._spiderFeatureLayer = new atlas.layer.SymbolLayer(this._spiderDataSource, null, unclustedLayerOptions);
        }
        map.layers.add(this._spiderFeatureLayer);
        this.setOptions(options);
        map.events.add('click', () => { this.hideSpiderCluster(); });
        map.events.add('movestart', () => { this.hideSpiderCluster(); });
        map.events.add('mouseleave', this._spiderFeatureLayer, (e) => { this._unhighlightStick(e); });
        map.events.add('mousemove', this._spiderFeatureLayer, (e) => { this._highlightStick(e); });
        map.events.add('click', this._clusterLayer, (e) => { this._layerClickEvent(e); });
        map.events.add('click', this._spiderFeatureLayer, (e) => { this._layerClickEvent(e); });
        map.events.add('click', this._unclustedLayer, (e) => { this._layerClickEvent(e); });
    }
    /**********************
    * Public Functions
    ***********************/
    /**
    * Disposes the SpiderClusterManager and releases it's resources.
    */
    dispose() {
        this._spiderDataSource.clear();
        this._map.sources.remove(this._spiderDataSource);
        this._spiderDataSource = null;
        this._map.layers.remove(this._spiderFeatureLayer);
        this._spiderFeatureLayer = null;
        this._map.layers.remove(this._spiderLineLayer);
        this._spiderLineLayer = null;
        this._map.events.remove('click', () => { this.hideSpiderCluster(); });
        this._map.events.remove('movestart', () => { this.hideSpiderCluster(); });
        this._map.events.remove('click', this._clusterLayer, (e) => { this._layerClickEvent(e); });
        this._map.events.remove('mouseleave', this._spiderFeatureLayer, (e) => { this._unhighlightStick(e); });
        this._map.events.remove('mousemove', this._spiderFeatureLayer, (e) => { this._highlightStick(e); });
        this._map.events.remove('click', this._spiderFeatureLayer, (e) => { this._layerClickEvent(e); });
        this._map.events.remove('click', this._unclustedLayer, (e) => { this._layerClickEvent(e); });
    }
    /**
    * Collapses any open spider clusters.
    */
    hideSpiderCluster() {
        this._spiderDataSource.clear();
    }
    /**
    * Sets the options used to customize how the SpiderClusterManager renders clusters.
    * @param options The options used to customize how the SpiderClusterManager renders clusters.
    */
    setOptions(options) {
        this.hideSpiderCluster();
        if (options) {
            if (typeof options.circleSpiralSwitchover === 'number') {
                this._options.circleSpiralSwitchover = options.circleSpiralSwitchover;
            }
            if (typeof options.maxFeaturesInWeb === 'number') {
                this._options.maxFeaturesInWeb = options.maxFeaturesInWeb;
            }
            if (typeof options.minSpiralAngleSeperation === 'number') {
                this._options.minSpiralAngleSeperation = options.minSpiralAngleSeperation;
            }
            if (typeof options.spiralDistanceFactor === 'number') {
                this._options.spiralDistanceFactor = options.spiralDistanceFactor;
            }
            if (typeof options.minCircleLength === 'number') {
                this._options.minCircleLength = options.minCircleLength;
            }
            if (options.stickLayerOptions) {
                this._options.stickLayerOptions = options.stickLayerOptions;
                this._spiderLineLayer.setOptions(options.stickLayerOptions);
            }
            if (options.featureSelected) {
                this._options.featureSelected = options.featureSelected;
            }
            if (options.featureUnselected) {
                this._options.featureUnselected = options.featureUnselected;
            }
            if (typeof options.visible === 'boolean' && this._options.visible !== options.visible) {
                this._options.visible = options.visible;
                this._spiderLineLayer.setOptions({ visible: options.visible });
                this._spiderFeatureLayer.setOptions({ visible: options.visible });
            }
        }
    }
    /**
    * Expands a cluster into it's open spider layout.
    * @param cluster The cluster to show in it's open spider layout.
    */
    showSpiderCluster(cluster) {
        this.hideSpiderCluster();
        if (cluster && cluster.properties.cluster) {
            this._datasource.getClusterLeaves(cluster.properties.cluster_id, this._options.maxFeaturesInWeb, 0).then((children) => {
                //Create spider data.
                var center = cluster.geometry.coordinates;
                var centerPoint = this._map.positionsToPixels([center])[0];
                var angle = 0;
                var makeSpiral = children.length > this._options.circleSpiralSwitchover;
                var legPixelLength;
                var stepAngle;
                var stepLength;
                if (makeSpiral) {
                    legPixelLength = this._options.minCircleLength / Math.PI;
                    stepLength = 2 * Math.PI * this._options.spiralDistanceFactor;
                }
                else {
                    stepAngle = 2 * Math.PI / children.length;
                    legPixelLength = (this._options.spiralDistanceFactor / stepAngle / Math.PI / 2) * children.length;
                    if (legPixelLength < this._options.minCircleLength) {
                        legPixelLength = this._options.minCircleLength;
                    }
                }
                var shapes = [];
                for (var i = 0, len = children.length; i < len; i++) {
                    //Calculate spider point feature location.
                    if (makeSpiral) {
                        angle += this._options.minSpiralAngleSeperation / legPixelLength + i * 0.0005;
                        legPixelLength += stepLength / angle;
                    }
                    else {
                        angle = stepAngle * i;
                    }
                    var pos = this._map.pixelsToPositions([[
                            centerPoint[0] + legPixelLength * Math.cos(angle),
                            centerPoint[1] + legPixelLength * Math.sin(angle)
                        ]])[0];
                    //Create stick to point feature.
                    var stick = new atlas.data.Feature(new atlas.data.LineString([center, pos]), null, i + '');
                    shapes.push(stick);
                    //Create point feature in spiral that contains same metadata as parent point feature.
                    var c = children[i];
                    var p = (c instanceof atlas.Shape) ? c.getProperties() : c.properties;
                    var id = (c instanceof atlas.Shape) ? c.getId() : c.id;
                    //Make a copy of the properties.
                    p = this._deepCopy(p);
                    p._stickId = i + '';
                    p._parentId = id;
                    shapes.push(new atlas.data.Feature(new atlas.data.Point(pos), p));
                }
                this._spiderDataSource.add(shapes);
            });
        }
    }
    /**********************
    * Private Functions
    ***********************/
    /**
    * Click event handler for when a shape in the cluster layer is clicked.
    * @param e The mouse event argurment from the click event.
    */
    _layerClickEvent(e) {
        if (e && e.shapes && e.shapes.length > 0) {
            var prop;
            var pos;
            var s;
            if (e.shapes[0] instanceof atlas.Shape) {
                s = e.shapes[0];
                prop = s.getProperties();
                pos = s.getCoordinates();
            }
            else {
                var f = e.shapes[0];
                prop = f.properties;
                pos = f.geometry.coordinates;
            }
            if (prop.cluster) {
                if (this._options.featureUnselected) {
                    this._options.featureUnselected();
                }
                this._currentCluster = e.shapes[0];
                if (prop.point_count > this._options.maxFeaturesInWeb) {
                    this._datasource.getClusterExpansionZoom(prop.cluster_id).then(zoom => {
                        this._map.setCamera({
                            center: pos,
                            zoom: zoom
                        });
                    });
                }
                else {
                    this.showSpiderCluster(f);
                }
            }
            else {
                if (typeof prop._parentId !== 'undefined') {
                    s = this._datasource.getShapeById(prop._parentId);
                }
                else {
                    this._currentCluster = null;
                }
                if (this._options.featureSelected && s) {
                    this._options.featureSelected(s, this._currentCluster);
                }
                this.hideSpiderCluster();
            }
            e.preventDefault();
        }
    }
    _highlightStick(e) {
        if (e && e.shapes && e.shapes.length > 0) {
            var stickId;
            if (e.shapes[0] instanceof atlas.Shape) {
                stickId = e.shapes[0].getProperties()._stickId;
            }
            else {
                stickId = e.shapes[0].properties._stickId;
            }
            if (this._hoverStateId) {
                //TODO: replace with built-in function.
                this._map.map.setFeatureState({ source: this._spiderDatasourceId, id: this._hoverStateId }, { hover: false });
            }
            this._hoverStateId = stickId;
            //TODO: replace with built-in function.
            this._map.map.setFeatureState({ source: this._spiderDatasourceId, id: this._hoverStateId }, { hover: true });
        }
    }
    _unhighlightStick(e) {
        if (this._hoverStateId) {
            //TODO: replace with built-in function.
            this._map.map.setFeatureState({ source: this._spiderDatasourceId, id: this._hoverStateId }, { hover: false });
            this._hoverStateId = null;
        }
    }
    _deepCopy(obj, filter) {
        var copy = obj, k;
        if (obj && typeof obj === 'object') {
            copy = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
            for (k in obj) {
                if (!Array.isArray(filter) || (Array.isArray(filter) && filter.indexOf(k) !== -1)) {
                    copy[k] = this._deepCopy(obj[k], filter);
                }
            }
        }
        return copy;
    }
}
//# sourceMappingURL=SpiderClusterManager.js.map