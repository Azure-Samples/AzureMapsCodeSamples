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

    /** A control that provides a window into a data set inside of a spy glass on the map. */
    var Spyglass = /** @class */ (function () {
        /****************************
        * Constructor
        ***************************/
        /**
         * A control that provides a window into a data set inside of a spy glass on the map.
         * @param primaryMap The primary map the spy glass will be overlaid on top of.
         * @param spyMap The map to be used as the spy glass.
         * @param options The options for the control
         */
        function Spyglass(primaryMap, spyMap, options) {
            this._options = {
                borderColor: '#555555',
                borderWidth: 5,
                opacity: 1,
                shape: 'circle',
                size: 350
            };
            this._syncEvents = [];
            this._maps = [];
            var self = this;
            self._primaryMap = primaryMap;
            self._spyMap = spyMap;
            var container = self._spyMap.getMapContainer();
            container.style.position = 'absolute';
            self._spyMap.events.add('ready', function () {
                container.getElementsByClassName('azure-map-logo')[0].style.display = 'none';
                container.getElementsByClassName('map-copyright')[0].style.display = 'none';
            });
            self.setOptions(self._options);
            if (options) {
                self.setOptions(options);
            }
            self._maps = [self._primaryMap, self._spyMap];
            //Bind sync events and synchronize the map views.
            self._maps.forEach(function (map, index) {
                self._syncEvents[index] = self._synchronizeMaps.bind(self, map);
            });
            //Sync all map views with the first map.
            self._syncEvents[0]();
            //Attach the map move handler.
            self._attachMapMoveHandlers();
        }
        /****************************
         * Public Methods
         ***************************/
        /** Dispose the control and clean up its resources. */
        Spyglass.prototype.dispose = function () {
            var self = this;
            self._detachMapMoveHandlers();
            self._options = null;
            self._spyMap = null;
            self._primaryMap = null;
        };
        /** Gets the options of the Spyglass control. */
        Spyglass.prototype.getOptions = function () {
            return this._options;
        };
        /**
         * Sets the options of the spyglass control.
         * @param options The options to set.
         */
        Spyglass.prototype.setOptions = function (options) {
            var spyMap = this._spyMap;
            var spyMapStyle = spyMap.getCanvasContainer().style;
            var containerStyle = spyMap.getMapContainer().style;
            var opt = this._options;
            if (typeof options.shape === 'string' && (options.shape === 'circle' || options.shape === 'square')) {
                if (options.shape === 'circle') {
                    containerStyle.borderRadius = '50%';
                    spyMapStyle.borderRadius = '50%';
                }
                else {
                    containerStyle.borderRadius = '0';
                    spyMapStyle.borderRadius = '0';
                }
                opt.shape = options.shape;
            }
            if (typeof options.borderWidth === 'number') {
                options.borderWidth = Math.max(options.borderWidth, 0);
                containerStyle.borderStyle = 'solid';
                containerStyle.borderWidth = options.borderWidth + 'px';
                opt.borderWidth = options.borderWidth;
            }
            if (typeof options.borderColor === 'string') {
                containerStyle.borderColor = options.borderColor;
                opt.borderColor = options.borderColor;
            }
            if (typeof options.opacity === 'number') {
                options.opacity = Math.max(Math.min(options.opacity, 1), 0);
                spyMapStyle.opacity = options.opacity + '';
                opt.opacity = options.opacity;
            }
            if (typeof options.size === 'number') {
                options.size = Math.max(options.size, 1);
                var offset = (options.size) / 2 + opt.borderWidth;
                containerStyle.left = 'calc(50% - ' + offset + 'px)';
                containerStyle.top = 'calc(50% - ' + offset + 'px)';
                spyMap.resize(options.size, options.size);
                opt.size = options.size;
            }
        };
        /****************************
         * Private Methods
         ***************************/
        /** Attach map move handlers to the maps to synchronize them. */
        Spyglass.prototype._attachMapMoveHandlers = function () {
            var _this = this;
            this._maps.forEach(function (map, index) {
                map.events.add('move', _this._syncEvents[index]);
            });
        };
        /** Detach map move handlers to the maps. */
        Spyglass.prototype._detachMapMoveHandlers = function () {
            var _this = this;
            this._maps.forEach(function (map, index) {
                map.events.remove('move', _this._syncEvents[index]);
            });
        };
        /**
         * Synchronize all maps with a base map.
         * @param baseMap The base map to synchronize with.
         */
        Spyglass.prototype._synchronizeMaps = function (baseMap) {
            var self = this;
            var targetMaps = self._maps.filter(function (m, i) { return m !== baseMap; });
            self._detachMapMoveHandlers();
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
            self._attachMapMoveHandlers();
        };
        return Spyglass;
    }());

    exports.Spyglass = Spyglass;

}(this.atlas = this.atlas || {}));
