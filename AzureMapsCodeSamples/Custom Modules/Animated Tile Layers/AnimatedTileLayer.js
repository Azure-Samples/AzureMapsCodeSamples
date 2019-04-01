/**
 * Provides a layer which can smoothly animate through an array of tile layers.
 */
class AnimatedTileLayerManager {
    /**
     * Provides a layer which can smoothly animate through an array of tile layers.
     * @param map A map instance to animate the tile layers on.
     * @param options The options for the animation manager.
     */
    constructor(map, options) {
        this._options = {
            tileLayerOptions: [],
            autoPlay: true,
            frameRate: 10,
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
    /** Disposes the animation manager and any resources it is using. */
    dispose() {
        this._clearAnimation();
        this._removeAllTileLayers();
        this.onFrameLoaded = null;
        this._options = null;
        this._tileLayers = null;
        this._map = null;
        this._animation = null;
    }
    /**
     * Gets the options set on the animation manager.
     */
    getOptions() {
        return this._options;
    }
    /**
     * Sets the options on the animation manager.
     * @param options Set of animated tile layer options.
     */
    setOptions(options) {
        if (options) {
            if (typeof options.frameRate === "number") {
                this._options.frameRate = options.frameRate;
                if (this._animationState === 1 /* playing */) {
                    this.pause();
                    this.play();
                }
            }
            this._options.visible = typeof options.visible === "boolean" ? options.visible : this._options.visible;
            //Update animation based on visible property if layer is already added to map.
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
            if (options.tileLayerOptions || addRemoveTiles) {
                if (this._options.tileLayerOptions) {
                    this._removeAllTileLayers();
                }
                this._options.tileLayerOptions = options.tileLayerOptions;
                this._addAllTileLayers();
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
    stop() {
        this._animationState = 3 /* stopped */;
        this._clearAnimation();
        this._map && this._toggleFrameVisibility(this._currentFrameIndex, false);
        this._currentFrameIndex = 0;
    }
    /**
     * Pause the tile layer animation.
     */
    pause() {
        this._animationState = 2 /* paused */;
        this._clearAnimation();
    }
    /**
     * Play the animation either from start or where it was paused.
     */
    play() {
        this._clearAnimation();
        this._animationState = 1 /* playing */;
        this._toggleFrameVisibility(this._currentFrameIndex, true);
        this._animation = setInterval(() => {
            if (this._map) {
                var prevIndex = this._currentFrameIndex;
                this._currentFrameIndex = this._currentFrameIndex + 1 === this._options.tileLayerOptions.length ? 0 : this._currentFrameIndex + 1;
                this._toggleFrameVisibility(this._currentFrameIndex, true);
                this._toggleFrameVisibility(prevIndex, false);
            }
        }, 1000 / this._options.frameRate);
    }
    /**
     * Removes all tile layers.
     */
    _removeAllTileLayers() {
        this._clearAnimation();
        if (this._tileLayers) {
            for (var i = 0; i < this._tileLayers.length; i++) {
                this._map.layers.remove(this._tileLayers[i]);
            }
        }
        this._tileLayers = [];
    }
    /**
     * Add all tile layers.
     */
    _addAllTileLayers() {
        if (this._options.tileLayerOptions) {
            this._tileLayers = [];
            for (var i = 0; i < this._options.tileLayerOptions.length; i++) {
                if (typeof this._options.tileLayerOptions[i].opacity === 'undefined') {
                    this._options.tileLayerOptions[i].opacity = 1;
                }
                this._options.tileLayerOptions[i].fadeDuration = 0;
                //Cache the opacity value the user specified for the layer.
                this._tileLayers[i] = new atlas.layer.TileLayer(this._options.tileLayerOptions[i]);
                //Change the opacity to 0. To hide/show tile layers, we will use opacity rather than visibility as this will be smoother.
                this._tileLayers[i].setOptions({ opacity: 0 });
                //Add the tile layer to the map.
                this._map.layers.add(this._tileLayers[i], this._options.below);
            }
        }
    }
    /**
     * Clears the animation of this layer
     */
    _clearAnimation() {
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
    _toggleFrameVisibility(index, visible) {
        if (this._tileLayers && this._options.tileLayerOptions && index < this._options.tileLayerOptions.length) {
            this._tileLayers[index].setOptions({
                opacity: (visible) ? this._options.tileLayerOptions[index].opacity : 0
            });
            if (this.onFrameLoaded) {
                this.onFrameLoaded({ index: this._currentFrameIndex });
            }
        }
    }
}
//# sourceMappingURL=AnimatedTileLayer.js.map