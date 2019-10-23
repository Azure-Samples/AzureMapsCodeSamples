
/** An object that defines the options for an AnimatedTileLayer. */
interface AnimatedTileLayerOptions {
    /** The array of tile layers options to animate through. */
    tileLayerOptions?: atlas.TileLayerOptions[];

    /** A boolean that specifies whether the animation should auto-start when it is added to the map or not. Default: true */
    autoPlay?: boolean;

    /** The number of frames per second the animation should transition through the tile layers. Default: 10 */
    frameRate?: number;

    /** Specifies if the animation should loop infinitly. Default: true */
    loop?: boolean;

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
        tileLayerOptions: [],
        autoPlay: true,
        frameRate: 10,
        visible: true,
        loop: true
    };

    private _animationState: AnimatedTileLayerState = AnimatedTileLayerState.ready;

    /** Indicates the index of the current layer frame that is shown on the map */
    private _currentFrameIndex: number = 0;

    /** The identifier of the tile layers animation */
    private _animation: any;

    /** Reference to the map instance. */
    private _map: atlas.Map;

    /** The tile layers being animated. */
    private _tileLayers: atlas.layer.TileLayer[];

    /** The event to fire every time a new layer frame is loaded */
    public onFrameLoaded: (args: AnimatedFrameEventArgs) => void;

    /**
     * Provides a layer which can smoothly animate through an array of tile layers.
     * @param map A map instance to animate the tile layers on.
     * @param options The options for the animation manager.
     */
    constructor(map: atlas.Map, options?: AnimatedTileLayerOptions) {
        this._map = map;

        this.setOptions(options);
    }

    /** Disposes the animation manager and any resources it is using. */
    public dispose(): void {
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
    public getOptions(): AnimatedTileLayerOptions {
        return this._options;
    }

    /**
     * Sets the options on the animation manager.
     * @param options Set of animated tile layer options.
     */
    public setOptions(options: AnimatedTileLayerOptions): void {
        if (options) {
            if (typeof options.frameRate === "number") {
                this._options.frameRate = options.frameRate;
                if (this._animationState === AnimatedTileLayerState.playing) {
                    this.pause();
                    this.play();
                }
            }
            
            this._options.visible = typeof options.visible === "boolean" ? options.visible : this._options.visible;
            this._options.loop = typeof options.loop === "boolean" ? options.loop : this._options.loop;

            //Update animation based on visible property if layer is already added to map.
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
                this._currentFrameIndex = this._currentFrameIndex + 1 === this._options.tileLayerOptions.length ? 0 : this._currentFrameIndex + 1;
                this._toggleFrameVisibility(this._currentFrameIndex, true);
                this._toggleFrameVisibility(prevIndex, false);
            }
        }, 1000 / this._options.frameRate);
    }

    /**
     * Removes all tile layers.
     */
    private _removeAllTileLayers(): void {
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
    private _addAllTileLayers(): void {
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

//TODO: try refactoring to use a single tile layer and update it's URL/source as this should work better now.