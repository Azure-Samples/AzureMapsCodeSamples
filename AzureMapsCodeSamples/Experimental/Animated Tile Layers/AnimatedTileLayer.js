/**
 * Provides a layer which can smoothly animate through an array of tile layers.
 */
var AnimatedTileLayerManager = /** @class */ (function () {
    function AnimatedTileLayerManager(map, options) {
        this._options = {
            tileLayers: [],
            autoPlay: true,
            duration: 15000,
            //maxTotalLoadTime: 15000,
            visible: true
        };
        this._animationState = 0 /* ready */;
        /** Indicates the index of the current layer frame that is shown on the map */
        this._currentFrameIndex = 0;
        this._map = map;
        if (options) {
            this.setOptions(options);
        }
        //this._primers = [];
        this.setOptions(options);
    }
    AnimatedTileLayerManager.prototype.dispose = function () {
        this._removeAllTileLayers();
        this.onFrameLoaded = null;
        this._options = null;
    };
    AnimatedTileLayerManager.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * Sets the options
     * @param options Set of animated tile layer options.
     */
    AnimatedTileLayerManager.prototype.setOptions = function (options) {
        if (options) {
            if (typeof options.duration === "number") {
                this._options.duration = options.duration;
                if (this._animationState === 1 /* playing */) {
                    this.pause();
                    this.play();
                }
            }
            //this._options.maxTotalLoadTime = typeof options.maxTotalLoadTime === "number"
            //    ? options.maxTotalLoadTime : this._options.maxTotalLoadTime;
            this._options.visible = typeof options.visible === "boolean" ? options.visible : this._options.visible;
            // Update animation based on visible property if layer is already added to map
            if (this._options.visible) {
                this._toggleFrameVisibility(this._currentFrameIndex, this._animationState !== 3 /* stopped */);
                this._animationState === 1 /* playing */ && this.play();
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
    };
    /**
    * Stop the layer animation, hide layer, and reset frame to the beginning
    */
    AnimatedTileLayerManager.prototype.stop = function () {
        this._animationState = 3 /* stopped */;
        this._clearAnimation();
        this._map && this._toggleFrameVisibility(this._currentFrameIndex, false);
        this._currentFrameIndex = 0;
    };
    /**
     * Pause the tile layer animation.
     */
    AnimatedTileLayerManager.prototype.pause = function () {
        this._animationState = 2 /* paused */;
        this._clearAnimation();
    };
    /**
     * Play the animation either from start or where it was paused.
     */
    AnimatedTileLayerManager.prototype.play = function () {
        var _this = this;
        this._clearAnimation();
        this._animationState = 1 /* playing */;
        this._toggleFrameVisibility(this._currentFrameIndex, true);
        this._animation = setInterval(function () {
            if (_this._map) {
                var prevIndex = _this._currentFrameIndex;
                _this._currentFrameIndex = _this._currentFrameIndex + 1 === _this._options.tileLayers.length ? 0 : _this._currentFrameIndex + 1;
                _this._toggleFrameVisibility(_this._currentFrameIndex, true);
                _this._toggleFrameVisibility(prevIndex, false);
            }
        }, this._options.duration / this._options.tileLayers.length);
    };
    /**
     * Removes all tile layers.
     */
    AnimatedTileLayerManager.prototype._removeAllTileLayers = function () {
        this._clearAnimation();
        for (var i = 0; i < this._options.tileLayers.length; i++) {
            this._map.layers.remove(this._options.tileLayers[i]);
        }
    };
    AnimatedTileLayerManager.prototype._addAllTileLayers = function () {
        if (this._options.tileLayers) {
            for (var i = 0; i < this._options.tileLayers.length; i++) {
                this._options.tileLayers[i].setOptions({ visible: false });
                this._map.layers.add(this._options.tileLayers[i], this._options.below);
            }
        }
    };
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
    AnimatedTileLayerManager.prototype._clearAnimation = function () {
        if (this._animation) {
            clearInterval(this._animation);
            this._animation = null;
        }
    };
    /**
     * Toggles the visibility of a tile layer frame at the given index.
     * @param index The index of the tile layer frame.
     * @param visible Whether the frame should be visible.
     */
    AnimatedTileLayerManager.prototype._toggleFrameVisibility = function (index, visible) {
        if (index < this._options.tileLayers.length) {
            this._options.tileLayers[index].setOptions({
                visible: visible
            });
            if (this.onFrameLoaded) {
                this.onFrameLoaded({ index: this._currentFrameIndex });
            }
        }
    };
    return AnimatedTileLayerManager;
}());
//# sourceMappingURL=AnimatedTileLayer.js.map