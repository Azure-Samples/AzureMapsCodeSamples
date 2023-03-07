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

(function (exports) {
    'use strict';

    /** A class that synchronizes the cameras of two or more maps. */
    var MapSynchronizer = /** @class */ (function () {
        ///////////////////////////
        // Constructor
        ///////////////////////////
        /**
         * A class that synchronizes the cameras of two or more maps.
         * @param maps An array of two or more maps to synchronize.
         */
        function MapSynchronizer(maps) {
            var _this = this;
            this._syncEvents = [];
            this._enabled = true;
            this._maps = maps;
            //Bind sync events.
            maps.forEach(function (map, index) {
                _this._syncEvents[index] = _this._synchronizeMaps.bind(_this, map);
            });
            //Sync all map views with the first map.
            this._syncEvents[0]();
            //Attach the map move handler.
            this._attachMapChangeHandlers();
        }
        ///////////////////////////
        // Public methods
        ///////////////////////////
        /** Disposes the map synchronizer. */
        MapSynchronizer.prototype.dispose = function () {
            this._detachMapChangeHandlers();
            this._maps = null;
            this._syncEvents = null;
            this._enabled = null;
        };
        /**
         * Get sthe enabled state.
         */
        MapSynchronizer.prototype.isEnabled = function () {
            return this._enabled;
        };
        /** Disables the synchronization of the maps. */
        MapSynchronizer.prototype.disable = function () {
            this._enabled = false;
            this._detachMapChangeHandlers();
        };
        /** Enables the synchronization of the maps. */
        MapSynchronizer.prototype.enable = function () {
            this._enabled = true;
            this._attachMapChangeHandlers();
        };
        ///////////////////////////
        // Private methods
        ///////////////////////////
        /** Attach map move handlers to the maps to synchronize them. */
        MapSynchronizer.prototype._attachMapChangeHandlers = function () {
            var _this = this;
            if (this._maps) {
                this._maps.forEach(function (map, index) {
                    map.events.add('move', _this._syncEvents[index]);
                    map.events.add('styledata', _this._syncEvents[index]);
                });
            }
        };
        /** Detach map move handlers to the maps. */
        MapSynchronizer.prototype._detachMapChangeHandlers = function () {
            var _this = this;
            if (this._maps) {
                this._maps.forEach(function (map, index) {
                    map.events.remove('move', _this._syncEvents[index]);
                    map.events.remove('styledata', _this._syncEvents[index]);
                });
            }
        };
        /**
         * Synchronize all maps with a base map.
         * @param baseMap The base map to synchronize with.
         */
        MapSynchronizer.prototype._synchronizeMaps = function (baseMap) {
            if (this._maps && this._enabled) {
                var targetMaps = this._maps.filter(function (m) { return m !== baseMap; });
                this._detachMapChangeHandlers();
                var cam_1 = baseMap.getCamera();
                targetMaps.forEach(function (targetMap) {
                    targetMap.setCamera({
                        center: cam_1.center,
                        zoom: cam_1.zoom,
                        bearing: cam_1.bearing,
                        pitch: cam_1.pitch,
                        type: 'jump'
                    });
                });
                this._attachMapChangeHandlers();
            }
        };
        return MapSynchronizer;
    }());

    /**
     * Synchronizes the cameras of two or more maps.
     * @param maps An array of two or more maps to synchronize.
     */
    function syncMaps() {
        var maps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            maps[_i] = arguments[_i];
        }
        //Allow maps to be passed in as arguments or as an array.
        if (Array.isArray(maps) && maps.length > 0 && Array.isArray(maps[0])) {
            //@ts-ignore
            maps = maps[0];
        }
        return new MapSynchronizer(maps);
    }

    exports.syncMaps = syncMaps;

}(this.atlas = this.atlas || {}));
