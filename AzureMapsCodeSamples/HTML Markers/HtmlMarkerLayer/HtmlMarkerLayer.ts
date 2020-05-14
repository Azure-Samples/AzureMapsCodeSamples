/*
 * Copyright(c) 2019 Microsoft Corporation. All rights reserved. 
 * 
 * This code is licensed under the MIT License (MIT). 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions: 
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software. 
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. 
*/

/**
 * Options for the HTML Marker Layer class.
 */
interface HtmlMarkerLayerOptions extends atlas.LayerOptions {
    /**
     * The id or instance of a data source which the layer will render.
     */
    source: string | atlas.source.Source;

    /**
     * Required when the source of the layer is a VectorTileSource.
     * A vector source can have multiple layers within it, this identifies which one to render in this layer.
     * Prohibited for all other types of sources.
     */
    sourceLayer?: string;

    /**
     * Specifies if the layer should update while the map is moving. When set to false, rendering in the map view will 
     * occur after the map has finished moving. New data is not rendered until the moveend event fires. When set to true, 
     * the layer will constantly re-render as the map is moving which ensures new data is always rendered right away, 
     * but may reduce overall performance. 
     */
    updateWhileMoving: boolean

    /**
     * A callback function that customizes the rendering of a HtmlMarker. This is called each time the map is moved.
     */
    markerRenderCallback?: ((id: string, position: atlas.data.Position, properties: any) => HtmlMarker);

    /**
     * A callback function that customizes the rendering of a ClusteredHtmlMarker. This is called each time the map is moved.
     */
    clusterRenderCallback?: ((id: string, position: atlas.data.Position, properties: atlas.ClusteredProperties) => HtmlMarker);
}

/**
 * A HtmlMarker that has a properties property that contains properties of the point object it represents.
 */
interface HtmlMarker extends atlas.HtmlMarker {
    id: string;
    properties: any;
}

/**
 * A layer that renders point data from a data source as HTML elements on the map.
 */
class HtmlMarkerLayer extends atlas.layer.BubbleLayer {

    /*********************
     * Private Properties
     *********************/

    private _options = <HtmlMarkerLayerOptions>{
        sourceLayer: undefined,
        source: undefined,
        filter: undefined,
        minZoom: 0,
        maxZoom: 24,
        visible: true,
        updateWhileMoving: false,
        markerRenderCallback: (id, position, properties) => {
            return new atlas.HtmlMarker({
                position: position
            });
        },
        clusterRenderCallback: (id, position, properties) => {
            return new atlas.HtmlMarker({
                position: position,
                text: properties.point_count_abbreviated
            });
        }
    };

    private _map: atlas.Map;

    private _markers: HtmlMarker[] = [];
    private _markerIds: string[] = [];

    private _markerCache: any = {};
    
    /*********************
     * Constructor
     *********************/

     /**
     * Constructs a new HtmlMarkerLayer.
     * @param source The id or instance of a data source which the layer will render.
     * @param id The id of the layer. If not specified a random one will be generated.
     * @param options The options of the Html marker layer.
     */
    constructor(source?: string | atlas.source.Source, id?: string, options?: HtmlMarkerLayerOptions) {
        super(source, id, <atlas.BubbleLayerOptions>{            
            color: 'transparent',
            radius: 1,
            strokeWidth: 0
        });

        this.setOptions(options);
    }

    /*********************
     * Public methods
     *********************/

    /**
    * Gets the options of the Html Marker layer.
    */
    public getOptions(): HtmlMarkerLayerOptions {
        return this._options;
    }

    /**
    * Sets the options of the Html marker layer.
    * @param options The new options of the Html marker layer.
    */
    public setOptions(options: HtmlMarkerLayerOptions) {
        var newBaseOptions = <atlas.BubbleLayerOptions>{};
        var cc = false;

        if (options.source && this._options.source !== options.source) {
            this._options.source = options.source
            newBaseOptions.source = options.source;
            cc = true;
        }

        if (options.sourceLayer && this._options.sourceLayer !== options.sourceLayer) {
            this._options.sourceLayer = options.sourceLayer
            newBaseOptions.sourceLayer = options.sourceLayer;
            cc = true;
        }

        if (options.filter && this._options.filter !== options.filter) {
            this._options.filter = options.filter
            newBaseOptions.filter = options.filter;
            cc = true;
        }

        if (typeof options.minZoom === 'number' && this._options.minZoom !== options.minZoom) {
            this._options.minZoom = options.minZoom
            newBaseOptions.minZoom = options.minZoom;
        }

        if (typeof options.maxZoom === 'number' && this._options.maxZoom !== options.maxZoom) {
            this._options.maxZoom = options.maxZoom
            newBaseOptions.maxZoom = options.maxZoom;
        }

        if (typeof options.visible !== 'undefined' && this._options.visible !== options.visible) {
            this._options.visible = options.visible
            newBaseOptions.visible = options.visible;
        }

        if (options.markerRenderCallback && this._options.markerRenderCallback != options.markerRenderCallback) {
            this._options.markerRenderCallback = options.markerRenderCallback;
            cc = true;
        }

        if (options.clusterRenderCallback && this._options.clusterRenderCallback != options.clusterRenderCallback) {
            this._options.clusterRenderCallback = options.clusterRenderCallback;
            cc = true;
        }

        if (typeof options.updateWhileMoving === 'boolean' && this._options.updateWhileMoving !== options.updateWhileMoving) {
            this._options.updateWhileMoving = options.updateWhileMoving;
        }

        if (cc) {
            this.clearCache(true);
        } else {
            this.updateMarkers();
        }

        super.setOptions(newBaseOptions);
    }

    /** Force the layer to refresh and update. */
    public update(): void {
        this.clearCache(true);
        this.updateMarkers();
    }

    /***************************
     * Public override methods
     ***************************/

    //Override the layers onAdd function. 
    public onAdd(map: atlas.Map): void {
        if (this._map) {
            this._map.events.remove('moveend', () => { this.updateMarkers(); });
            this._map.events.remove('move', () => { this.mapMoved(); });
            this._map.events.remove('sourcedata', () => { this.sourceUpdated(); });
        }
   
        this._map = map;

        this._map.events.add('moveend', () => { this.updateMarkers(); });
        this._map.events.add('move', () => { this.mapMoved(); });
        this._map.events.add('data', (e) => {
            this.sourceUpdated();
        });

        //Call the underlying functionaly for this.
        super.onAdd(map);
    }

    //Override the layers onRemove function.
    public onRemove(): void {
        if (this._map) {
            this._map.events.remove('moveend', () => { this.updateMarkers(); });
            this._map.events.remove('move', () => { this.mapMoved(); });
            this._map.events.remove('sourcedata', () => { this.sourceUpdated(); });
        }

        this.clearCache(false);
        this._map = null;

        super.onRemove();
    }

    /*********************
     * Private methods
     *********************/

    private mapMoved() {
        if (this._options.updateWhileMoving) {
            this.updateMarkers();
        }
    }

    private getSourceClass(): atlas.source.Source {
        var s = this.getSource();
        if (typeof s === 'string' && this._map !== null) {
            return this._map.sources.getById(s);
        } else if (s instanceof atlas.source.Source) {
            return s;
        }

        return null;
    }

    private sourceUpdated(): void {
        var s = this.getSourceClass();

        if (s) {
            //TODO: optimize so that this only processes if the source for this layer has changed. Currently runs when any source changes.
            this.clearCache(true);
        }
    }

    private clearCache(update): void {
        this._markerCache = {}; //Clear marker cache. 
        if (this._map) {
            this._map.markers.remove(this._markers);
        }
        this._markers = [];
        this._markerIds = [];

        if (update) {
            this.updateMarkers();
        }     
    }

    private updateMarkers() {
        if (this._map && this._map.getCamera().zoom >= this._options.minZoom && this._map.getCamera().zoom <= this._options.maxZoom) {
            var shapes = this._map.layers.getRenderedShapes(null, this, this._options.filter);

            var newMarkers = [];
            var newMarkerIds = [];

            var id: string;
            var properties: any;
            var position: atlas.data.Position;
            var shape: atlas.Shape;
            var feature: atlas.data.Feature<atlas.data.Geometry, any>;
            var marker: HtmlMarker;

            for (var i = 0, len = shapes.length; i < len; i++) {               
                marker = null;

                if (shapes[i] instanceof atlas.Shape) {
                    shape = <atlas.Shape>shapes[i];

                    if (shape.getType() === 'Point') {
                        position = <atlas.data.Position>shape.getCoordinates();
                        properties = shape.getProperties();
                        id = shape.getId();
                    }
                } else {
                    feature = <atlas.data.Feature<atlas.data.Geometry, any>>shapes[i];

                    if (feature.geometry.type === 'Point') {
                        position = <atlas.data.Position>feature.geometry.coordinates;
                        properties = feature.properties;

                        if (properties && properties.cluster) {
                            id = 'cluster_' + feature.properties.cluster_id;
                        } else if (feature.id) {
                            id = feature.id;
                        }
                    }
                }

                if (position) {
                    marker = this.getMarker(id, position, properties);

                    if (marker) {
                        if (marker.id) {
                            newMarkerIds.push(marker.id);
                        }

                        if (!marker.id || this._markerIds.indexOf(marker.id) === -1) {
                            newMarkers.push(marker);
                            this._map.markers.add(marker);
                        }
                    }
                }
            }

            //Remove all markers that are no longer in view. 
            for (var i = this._markers.length - 1; i >= 0; i--) {
                if (!this._markers[i].id || newMarkerIds.indexOf(this._markers[i].id) === -1) {
                    this._map.markers.remove(this._markers[i]);
                    this._markers.splice(i, 1);
                }
            }

            this._markers = this._markers.concat(newMarkers);
            this._markerIds = newMarkerIds;
        }
    }

    private getMarker(id: string, position: atlas.data.Position, properties: any): HtmlMarker {
        //Check cache for existing marker.
        if (this._markerCache[id]) {
            return this._markerCache[id];
        } else {
            var m: HtmlMarker;

            if (properties && properties.cluster) {
                if (this._options.clusterRenderCallback && typeof properties.cluster_id === 'number') {
                    m = this._options.clusterRenderCallback(id, position, properties);
                }
            } else if (this._options.markerRenderCallback) {
                m = this._options.markerRenderCallback(id, position, properties);
            }

            if (m) {
                m.properties = properties;
                m.id = id;

                //Make sure position is set.
                m.setOptions({
                    position: position
                });

                this._markerCache[id] = m;

                return m;
            }

            return null;
        }
    }
}

/**
 * //TODO: Future improvements
 *  - Add support for layer level events
 *  - Add support for points in shapes (i.e. polygons), similar to how symbol layer works.
 *  - Investigate zoom level 0 issues.
 */