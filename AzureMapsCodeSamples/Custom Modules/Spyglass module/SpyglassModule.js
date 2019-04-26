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
/** A control that provides a window into a data set inside of a spy glass on the map. */
class SpyglassControl {
    /****************************
    * Constructor
    ***************************/
    /**
     * A control that provides a window into a data set inside of a spy glass on the map.
     * @param primaryMap The primary map the spy glass will be overlaid on top of.
     * @param spyMap The map to be used as the spy glass.
     * @param options The options for the control
     */
    constructor(primaryMap, spyMap, options) {
        this._options = {
            borderColor: '#555555',
            borderWidth: 5,
            opacity: 1,
            shape: 'circle',
            size: 350
        };
        this._syncEvents = [];
        this._maps = [];
        this._primaryMap = primaryMap;
        this._spyMap = spyMap;
        var container = this._spyMap.getMapContainer();
        container.style.position = 'absolute';
        this._spyMap.events.add('ready', () => {
            container.getElementsByClassName('azure-map-logo')[0].style.display = 'none';
            container.getElementsByClassName('map-copyright')[0].style.display = 'none';
        });
        this.setOptions(this._options);
        if (options) {
            this.setOptions(options);
        }
        this._maps = [this._primaryMap, this._spyMap];
        //Bind sync events and synchronize the map views.
        this._maps.forEach((map, index) => {
            this._syncEvents[index] = this._synchronizeMaps.bind(this, map);
        });
        //Sync all map views with the first map.
        this._syncEvents[0]();
        //Attach the map move handler.
        this._attachMapMoveHandlers();
    }
    /****************************
     * Public Methods
     ***************************/
    /** Dispose the control and clean up its resources. */
    dispose() {
        this._detachMapMoveHandlers();
        this._options = null;
        this._spyMap = null;
        this._primaryMap = null;
    }
    /** Gets the options of the Spyglass control. */
    getOptions() {
        return this._options;
    }
    /**
     * Sets the options of the spyglass control.
     * @param options The options to set.
     */
    setOptions(options) {
        var container = this._spyMap.getMapContainer();
        if (typeof options.shape === 'string' && (options.shape === 'circle' || options.shape === 'square')) {
            if (options.shape === 'circle') {
                container.style.borderRadius = '50%';
                this._spyMap.getCanvasContainer().firstChild.style.borderRadius = '50%';
            }
            else {
                container.style.borderRadius = '0';
                this._spyMap.getCanvasContainer().firstChild.style.borderRadius = '0';
            }
            this._options.shape = options.shape;
        }
        if (typeof options.borderWidth === 'number') {
            options.borderWidth = Math.max(options.borderWidth, 0);
            container.style.borderStyle = 'solid';
            container.style.borderWidth = options.borderWidth + 'px';
            this._options.borderWidth = options.borderWidth;
        }
        if (typeof options.borderColor === 'string') {
            container.style.borderColor = options.borderColor;
            this._options.borderColor = options.borderColor;
        }
        if (typeof options.opacity === 'number') {
            options.opacity = Math.max(Math.min(options.opacity, 1), 0);
            this._spyMap.getCanvasContainer().style.opacity = options.opacity + '';
            this._options.opacity = options.opacity;
        }
        if (typeof options.size === 'number') {
            options.size = Math.max(options.size, 1);
            var offset = (options.size) / 2 + this._options.borderWidth;
            container.style.left = 'calc(50% - ' + offset + 'px)';
            container.style.top = 'calc(50% - ' + offset + 'px)';
            this._spyMap.resize(options.size, options.size);
            this._options.size = options.size;
        }
    }
    /****************************
     * Private Methods
     ***************************/
    /** Attach map move handlers to the maps to synchronize them. */
    _attachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.add('move', this._syncEvents[index]);
        });
    }
    /** Detach map move handlers to the maps. */
    _detachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.remove('move', this._syncEvents[index]);
        });
    }
    /**
     * Synchronize all maps with a base map.
     * @param baseMap The base map to synchronize with.
     */
    _synchronizeMaps(baseMap) {
        var targetMaps = this._maps.filter(function (m, i) { return m !== baseMap; });
        this._detachMapMoveHandlers();
        var cam = baseMap.getCamera();
        targetMaps.forEach(function (targetMap) {
            targetMap.setCamera({
                center: cam.center,
                zoom: cam.zoom,
                bearing: cam.bearing,
                pitch: cam.pitch,
                type: 'jump'
            });
        });
        this._attachMapMoveHandlers();
    }
}
//# sourceMappingURL=SpyglassModule.js.map