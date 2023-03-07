/*
azure-maps-image-exporter Version: 0.0.2

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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
    * A class for generating screenshots of the map.
    */
    var MapImageExporter = /** @class */ (function () {
        function MapImageExporter() {
        }
        /**********************
        * Public Functions
        ***********************/
        /**
        * Generates a Image object for an image of the map.
        * @param map Map instance to get image for.
        */
        MapImageExporter.getImage = function (map) {
            return __awaiter(this, void 0, void 0, function () {
                var dataUri;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDataUri(map)];
                        case 1:
                            dataUri = _a.sent();
                            return [2 /*return*/, this._getImage(dataUri)];
                    }
                });
            });
        };
        /**
         * Generates a data URI for an image of the map.
         * @param map Map instance to get data URI for.
         * @param mimeType The `mimeType` of the image to generate. Defult: `'image/png'`
         */
        MapImageExporter.getDataUri = function (map, mimeType) {
            return __awaiter(this, void 0, void 0, function () {
                var mapCanvas;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getMapCanvas(map)];
                        case 1:
                            mapCanvas = _a.sent();
                            return [2 /*return*/, mapCanvas.toDataURL(mimeType)];
                    }
                });
            });
        };
        /**
         * Generates a Blob for an image of the map.
         * @param map Map instance to get blob for.
         */
        MapImageExporter.getBlob = function (map) {
            return __awaiter(this, void 0, void 0, function () {
                var dataUri;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDataUri(map)];
                        case 1:
                            dataUri = _a.sent();
                            return [2 /*return*/, this._dataUriToBlob(dataUri)];
                    }
                });
            });
        };
        /**********************
        * Private Functions
        ***********************/
        /**
         * Retrieves an image from a URL. Can be a URL to a hosted image, data URI, or SVG string.
         * @param url Url of image to retrieve.
         */
        MapImageExporter._getImage = function (url) {
            return new Promise(function (resolve, reject) {
                var img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.onerror = function () {
                    reject('Error creating image.');
                };
                if (url.indexOf('<svg') > -1) {
                    url = 'data:image/svg+xml;base64,' + window.btoa(url.substr(url.indexOf('<svg')));
                }
                img.src = url;
            });
        };
        /**
        * Gets copy of the map canvas with a logo and copyrights added to it.
        */
        MapImageExporter._getMapCanvas = function (map) {
            return __awaiter(this, void 0, void 0, function () {
                var mapCanvas, mapContainer, mapWidth, mapHeight, offscreenCanvas, ctx, copyrightContainer, copyrightsStyle, copyrights, copyrightSize, logoContainer, logoDivStyle, bg, logoUri, logoHeight, logoImg, w, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mapCanvas = map.getCanvas();
                            mapContainer = map.getMapContainer();
                            mapWidth = mapCanvas.width;
                            mapHeight = mapCanvas.height;
                            offscreenCanvas = document.createElement('canvas');
                            offscreenCanvas.width = mapWidth;
                            offscreenCanvas.height = mapHeight;
                            ctx = offscreenCanvas.getContext('2d');
                            ctx.drawImage(mapCanvas, 0, 0);
                            copyrightContainer = mapContainer.getElementsByClassName('map-copyright');
                            if (copyrightContainer && copyrightContainer.length > 0) {
                                try {
                                    copyrightsStyle = window.getComputedStyle(copyrightContainer[0].firstElementChild);
                                    copyrights = copyrightContainer[0].innerText;
                                    ctx.font = copyrightsStyle.font;
                                    copyrightSize = ctx.measureText(copyrights);
                                    //Add a background to the copyright area.
                                    ctx.fillStyle = 'rgba(238,238,238,0.8)';
                                    ctx.fillRect(mapWidth - copyrightSize.width - 10, mapHeight - 15, copyrightSize.width + 10, 20);
                                    //Write text.
                                    ctx.fillStyle = copyrightsStyle.color;
                                    ctx.fillText(copyrights, mapWidth - copyrightSize.width - 5, mapHeight - 3);
                                }
                                catch (_c) { }
                            }
                            logoContainer = mapContainer.getElementsByClassName('azure-map-logo');
                            if (!(logoContainer && logoContainer.length > 0)) return [3 /*break*/, 4];
                            logoDivStyle = window.getComputedStyle(logoContainer[0]);
                            bg = (logoDivStyle) ? logoDivStyle.backgroundImage : null;
                            if (!(bg && bg.indexOf('data:image') >= 0)) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            logoUri = bg.slice(5, (bg.length - 2));
                            //Sanitize the URI.
                            logoUri = decodeURIComponent(logoUri.replace(/(\\')/g, "'"));
                            logoHeight = this._logoHeight;
                            return [4 /*yield*/, this._getImage(logoUri)];
                        case 2:
                            logoImg = _b.sent();
                            w = logoHeight * (logoImg.width / logoImg.height);
                            //Add a background to the copyright area.
                            ctx.fillStyle = 'rgba(238,238,238,0.8)';
                            ctx.fillRect(mapWidth - w - 10, mapHeight - logoHeight - 25, w + 10, logoHeight + 10);
                            ctx.drawImage(logoImg, mapWidth - w - 5, mapHeight - logoHeight - 20, w, logoHeight);
                            return [2 /*return*/, offscreenCanvas];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: 
                        //If we get here there as an issue loading the logo. Reolve the promise.
                        return [2 /*return*/, offscreenCanvas];
                    }
                });
            });
        };
        /**
         * Converts a dataUri to Blob.
         * @param dataUri The dataUri to convert.
         * @returns A blob containing the data from the dataUri.
         */
        MapImageExporter._dataUriToBlob = function (dataUri) {
            //Convert base64 to raw binary data held in a string.
            var byteString = atob(dataUri.split(',')[1]);
            //Extract the mime type.
            var mimeType = dataUri.split(',')[0].split(':')[1].split(';')[0];
            //Write the bytes of the string to an ArrayBuffer.
            var ab = new ArrayBuffer(byteString.length);
            var dw = new DataView(ab);
            for (var i = 0; i < byteString.length; i++) {
                dw.setUint8(i, byteString.charCodeAt(i));
            }
            //Convert the ArrayBuffer to a blob.
            return new Blob([ab], { type: mimeType });
        };
        /**********************
        * Private Properties
        ***********************/
        MapImageExporter._logoHeight = 16;
        return MapImageExporter;
    }());

    exports.MapImageExporter = MapImageExporter;

}(this.atlas = this.atlas || {}));
