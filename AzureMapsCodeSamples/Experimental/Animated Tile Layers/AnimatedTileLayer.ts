
/** An object that defines the options for an AnimatedTileLayer. */
interface AnimatedTileLayerOptions {
    /** The array of tile layers to animate through. */
    tileLayers?: atlas.layer.TileLayer[];

    /** A boolean that specifies whether the animation should auto-start when it is added to the map or not. Default: true */
    autoPlay?: boolean;

    /** The number of miliseconds the animation should last. Default: 5000 */
    duration?: number;

    /** The max amount of total loading time of all tiles in a viewport in milliseconds. Default: 15000 */
    //maxTotalLoadTime?: number;

    /** A boolean specifying if the animated tile layer is visible or not. Default: true */
    visible?: boolean;

    /** The layer or id of a layer in which to render the tile layers below. */
    below?: atlas.layer.Layer | string;
}

/** The event arguments for when a layer frame is being loaded in an AnimatedTileLayer. */
interface AnimatedFrameEventArgs {
    /** The index of the frame being loaded. */
    index: number;
}

/**
 * The enum indicating the state of animation
 */
const enum AnimatedTileLayerState {
    /** Animation is ready to be played. */
    ready = 0,

    /** Animation is currently being played. */
    playing = 1,

    /** Animation is currently paused. */
    paused = 2,

    /** Animation is currently stopped. */
    stopped = 3
}

/**
 * Provides a layer which can smoothly animate through an array of tile layers.
 */
class AnimatedTileLayerManager {

    private _options: AnimatedTileLayerOptions = {
        tileLayers: [],
        autoPlay: true,
        duration: 15000,
        //maxTotalLoadTime: 15000,
        visible: true
    };

    private _animationState: AnimatedTileLayerState = AnimatedTileLayerState.ready;

    /** Indicates the index of the current layer frame that is shown on the map */
    private _currentFrameIndex: number = 0;

    /** The identifier of the tile layers animation */
    private _animation: number;

    private _map: atlas.Map;

    /** The event to fire when pre-loading all animation tiles started */
    //public preLoadStarted: () => void;

    ///** The event to fire when pre-loading all animation tiles finished */
    //public preLoadEnded: () => void;

    /** The event to fire every time a new layer frame is loaded */
    public onFrameLoaded: (args: AnimatedFrameEventArgs) => void;

    constructor(map: atlas.Map, options?: AnimatedTileLayerOptions) {
        this._map = map;

        if (options) {
            this.setOptions(options);
        }

        //this._primers = [];
        this.setOptions(options);
    }

    public dispose(): void {
        this._removeAllTileLayers();
        this.onFrameLoaded = null;
        this._options = null;
    }

    public getOptions(): AnimatedTileLayerOptions {
        return this._options;
    }

    /**
     * Sets the options
     * @param options Set of animated tile layer options.
     */
    public setOptions(options: AnimatedTileLayerOptions): void {
        if (options) {
            if (typeof options.duration === "number") {
                this._options.duration = options.duration;
                if (this._animationState === AnimatedTileLayerState.playing) {
                    this.pause();
                    this.play();
                }
            }
            //this._options.maxTotalLoadTime = typeof options.maxTotalLoadTime === "number"
            //    ? options.maxTotalLoadTime : this._options.maxTotalLoadTime;

            this._options.visible = typeof options.visible === "boolean" ? options.visible : this._options.visible;

            // Update animation based on visible property if layer is already added to map
            if (this._options.visible) {
                this._toggleFrameVisibility(this._currentFrameIndex, this._animationState !== AnimatedTileLayerState.stopped);
                this._animationState === AnimatedTileLayerState.playing && this.play();
            }
            else {
                this._clearAnimation();
                this._toggleFrameVisibility(this._currentFrameIndex, false);
            }

            var addRemoveTiles = false;
            if (typeof options.below !== undefined && options.below != this._options.below) {
                this._options.below = options.below;
                addRemoveTiles = true;
            }

            if (options.tileLayers || addRemoveTiles) {
                if (this._options.tileLayers) {
                    this._removeAllTileLayers();
                }

                this._options.tileLayers = options.tileLayers;

                this._addAllTileLayers();
                // this._preLoadAllTiles();
            }

            this._options.autoPlay = typeof options.autoPlay === "boolean" ? options.autoPlay : this._options.autoPlay;
            if (this._options.autoPlay) {
                this.play();
            }
        }
    }

    /**
    * Stop the layer animation, hide layer, and reset frame to the beginning
    */
    public stop(): void {
        this._animationState = AnimatedTileLayerState.stopped;
        this._clearAnimation();
        this._map && this._toggleFrameVisibility(this._currentFrameIndex, false);
        this._currentFrameIndex = 0;
    }

    /**
     * Pause the tile layer animation.
     */
    public pause(): void {
        this._animationState = AnimatedTileLayerState.paused;
        this._clearAnimation();
    }

    /**
     * Play the animation either from start or where it was paused.
     */
    public play(): void {
        this._clearAnimation();
        this._animationState = AnimatedTileLayerState.playing;

        this._toggleFrameVisibility(this._currentFrameIndex, true);
        this._animation = setInterval(() => {
            if (this._map) {
                var prevIndex = this._currentFrameIndex;
                this._currentFrameIndex = this._currentFrameIndex + 1 === this._options.tileLayers.length ? 0 : this._currentFrameIndex + 1;
                this._toggleFrameVisibility(this._currentFrameIndex, true);
                this._toggleFrameVisibility(prevIndex, false);
            }
        }, this._options.duration / this._options.tileLayers.length);
    }

    /**
     * Removes all tile layers.
     */
    private _removeAllTileLayers(): void {
        this._clearAnimation();

        for (var i = 0; i < this._options.tileLayers.length; i++) {
            this._map.layers.remove(this._options.tileLayers[i]);
        }
    }

    private _addAllTileLayers(): void {
        if (this._options.tileLayers) {
            for (var i = 0; i < this._options.tileLayers.length; i++) {
                this._options.tileLayers[i].setOptions({ visible: false });
                this._map.layers.add(this._options.tileLayers[i], this._options.below);
            }
        }
    }

    /**
     * Pre-loads tiles of all layers in current viewport by generating primers for each of them
     */
    //private _preLoadAllTiles(): void {
    //    this.preLoadStarted.invoke();
    //    this._primers = [];

    //    var camera = this._map.getCamera();
    //    var centerLatitude = camera.center[1];
    //    var centerLongitude = camera.center[0];
    //    var centerZoom = camera.zoom;

    //    var tileSources = this._options.tileLayers;
    //    for (var i = 0; i < tileSources.length; i++) {
    //        var layerOptions = tileSources[i].getOptions();

    //        // skip loading tiles if outside defined zoom range
    //        if (centerZoom > layerOptions.maxZoom || centerZoom < layerOptions.minZoom) {
    //            continue;
    //        }

    //        var bounds = layerOptions.bounds;

    //        //var dynamicProperties: IDynamicProperties = Microsoft.Maps.GlobalConfig.dynamicProperties;
    //        //var primer = new MapsTilePrimer.Primer(
    //        //    layerDiv,
    //        //    dynamicProperties.market,
    //        //    dynamicProperties.isGeopolUserRegion && dynamicProperties.userRegion ? dynamicProperties.userRegion : null,
    //        //    centerLatitude.toString(),
    //        //    centerLongitude.toString(),
    //        //    centerZoom,
    //        //    bounds,
    //        //    null,
    //        //    null,
    //        //    null,
    //        //    null,
    //        //    <string>tileSources[i].getUriConstructor(),
    //        //    null,
    //        //    null,
    //        //    null,
    //        //    null,
    //        //    null,
    //        //    true);

    //        //this._primers.push(primer);

    //        //(<HTMLElement>layerDiv.firstElementChild).style.zIndex = "auto";
    //    }
    //    this._checkPreLoadTilesComplete();
    //}

    ///**
    // * Wait and check that all tile images have completed loading
    // */
    //private _checkPreLoadTilesComplete(): void {

    //    var preLoadComplete = () => {
    //        clearInterval(checkPreLoad);
    //        clearTimeout(timeoutPreLoad);

    //        this._options.visible && this._animationState !== AnimatedTileLayerState.stopped && this._map
    //            && this._toggleFrameVisibility(this._currentFrameIndex, true);

    //        this.preLoadEnded.invoke();

    //        // do not start animation if it is paused, invisible, or animated tile layer is already removed
    //        this._options.visible && this._animationState < AnimatedTileLayerState.paused && this._map && this.play();
    //    };

    //    var checkPreLoad = setInterval(() => {
    //        var primersComplete = true;
    //        for (var i = 0; i < this._primers.length; i++) {
    //            if (!this._primers[i].isTileLoadingCompleted()) {
    //                primersComplete = false;
    //                break;
    //            }
    //        }
    //        primersComplete && preLoadComplete();
    //    }, 500);

    //    var timeoutPreLoad = setTimeout(() => { preLoadComplete(); },
    //        this._options.maxTotalLoadTime);
    //}

    /**
     * Clears the animation of this layer
     */
    private _clearAnimation(): void {
        if (this._animation) {
            clearInterval(this._animation);
            this._animation = null;
        }
    }

    /**
     * Toggles the visibility of a tile layer frame at the given index.
     * @param index The index of the tile layer frame.
     * @param visible Whether the frame should be visible.
     */
    private _toggleFrameVisibility(index: number, visible: boolean): void {
        if (index < this._options.tileLayers.length) {
            this._options.tileLayers[index].setOptions({
                visible: visible
            });

            if (this.onFrameLoaded) {
                this.onFrameLoaded({ index: this._currentFrameIndex });
            }
        }
    }
}