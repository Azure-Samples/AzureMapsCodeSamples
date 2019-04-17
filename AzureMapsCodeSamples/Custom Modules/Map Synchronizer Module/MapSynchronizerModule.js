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
/** A module that synchronizes the cameras of two or more maps. */
class MapSynchronizer {
    /**
     * A module that synchronizes the cameras of two or more maps.
     * @param maps An array of two or more maps to synchronize.
     */
    constructor(maps) {
        this._syncEvents = [];
        this._maps = maps;
        //Bind sync events.
        this._maps.forEach((map, index) => {
            this._syncEvents[index] = this._synchronizeMaps.bind(this, map);
        });
        //Sync all map views with the first map.
        this._syncEvents[0]();
        //Attach the map move handler.
        this._attachMapMoveHandlers();
    }
    /** Attach map move handlers to the maps to synchronize them. */
    _attachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.add('move', this._syncEvents[index]);
            map.events.add('styledata', this._syncEvents[index]);
        });
    }
    /** Detach map move handlers to the maps. */
    _detachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.remove('move', this._syncEvents[index]);
            map.events.remove('styledata', this._syncEvents[index]);
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
//# sourceMappingURL=MapSynchronizerModule.js.map