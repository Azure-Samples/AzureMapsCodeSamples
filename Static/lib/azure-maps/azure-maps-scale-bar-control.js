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

(function (exports, azmaps) {
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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Helper class for merging namespaces.
     */
    var Namespace = /** @class */ (function () {
        function Namespace() {
        }
        Namespace.merge = function (namespace, base) {
            var context = window || global;
            var parts = namespace.split(".");
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (context[part]) {
                    context = context[part];
                }
                else {
                    return base;
                }
            }
            return __assign(__assign({}, context), base);
        };
        return Namespace;
    }());

    /** A control that displays a scale bar relative to the pixel resolution at the center of the map. */
    var ScaleBarControl = /** @class */ (function () {
        /****************************
         * Constructor
         ***************************/
        /**
        * A control that displays a scale bar relative to the pixel resolution at the center of the map.
        * @param options Options for defining how the control is rendered and functions.
        */
        function ScaleBarControl(options) {
            var _this = this;
            /****************************
                * Private Properties
                ***************************/
            this._map = null;
            this._scaleBar = null;
            this._options = {
                units: 'imperial',
                maxBarLength: 100
            };
            /****************************
             * Private Methods
             ***************************/
            /** Updates the layout of the scalebar. */
            this._updateScaleBar = function () {
                var self = _this;
                var camera = self._map.getCamera();
                var opt = self._options;
                //Get the center pixel.
                var cp = self._map.positionsToPixels([camera.center]);
                //Calculate two coordinates that are seperated by the maxBarLength pixel distance from the center pixel.
                var pos = self._map.pixelsToPositions([[0, cp[0][1]], [opt.maxBarLength, cp[0][1]]]);
                //Calculate the strightline distance between the positions.
                var units = opt.units.toLowerCase();
                if (units === 'imperial') {
                    units = 'miles';
                }
                else if (units === 'metric') {
                    units = 'kilometers';
                }
                var trueDistance = azmaps.math.getDistanceTo(pos[0], pos[1], units);
                //Round the true distance to a nicer number.
                var niceDistance = self._getRoundNumber(trueDistance);
                var isSmall = 0;
                if (niceDistance < 2) {
                    units = opt.units.toLowerCase();
                    if (units === 'imperial') {
                        //Convert to yards.
                        trueDistance *= 1760;
                        niceDistance = self._getRoundNumber(trueDistance);
                        isSmall = 2;
                        if (niceDistance < 15) {
                            //Convert to feet.
                            trueDistance *= 3;
                            niceDistance = self._getRoundNumber(trueDistance);
                            isSmall = 1;
                        }
                    }
                    else if (units === 'metric') {
                        //Convert to meters.
                        trueDistance *= 1000;
                        niceDistance = self._getRoundNumber(trueDistance);
                        isSmall = 1;
                    }
                }
                //Calculate the distanceRatio between the true and nice distances and scale the scalebar size accordingly.
                var distanceRatio = niceDistance / trueDistance;
                var sb = self._scaleBar;
                //Update the width of the scale bar by scaling the maxBarLength option by the distance ratio.
                sb.style.width = (opt.maxBarLength * distanceRatio) + 'px';
                //Update the text of the scale bar.
                sb.innerHTML = self._createDistanceString(niceDistance, isSmall);
            };
            this._options = Object.assign(this._options, options || {});
        }
        /****************************
        * Public Methods
        ***************************/
        /**
        * Action to perform when the control is added to the map.
        * @param map The map the control was added to.
        * @param options The control options used when adding the control to the map.
        * @returns The HTML Element that represents the control.
        */
        ScaleBarControl.prototype.onAdd = function (map, options) {
            var self = this;
            self._map = map;
            //Add the CSS style for the control to the DOM.
            var style = document.createElement('style');
            style.innerHTML = '.azmaps-scaleBar {background-color:rgba(255,255,255,0.8);font-size:10px;border-width:medium 2px 2px;border-style:none solid solid;border-color:black;padding:0 5px;color:black;}';
            document.body.appendChild(style);
            var sb = document.createElement('div');
            sb.className = 'azmaps-scaleBar';
            self._scaleBar = sb;
            self._map.events.add('move', self._updateScaleBar);
            self._updateScaleBar();
            return sb;
        };
        /**
         * Action to perform when control is removed from the map.
         */
        ScaleBarControl.prototype.onRemove = function () {
            var self = this;
            if (self._map) {
                self._map.events.remove('move', self._updateScaleBar);
            }
            self._map = null;
            self._scaleBar.remove();
            self._scaleBar = null;
        };
        /**
         * Rounds a number to a nice value.
         * @param num The number to round.
         */
        ScaleBarControl.prototype._getRoundNumber = function (num) {
            if (num >= 2) {
                //Convert the number to a round value string and get the number of characters. Then use this to calculate the powe of 10 increment of the number.
                var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
                var i = num / pow10;
                //Shift the number to the closest nice number. 
                if (i >= 10) {
                    i = 10;
                }
                else if (i >= 5) {
                    i = 5;
                }
                else if (i >= 3) {
                    i = 3;
                }
                else if (i >= 2) {
                    i = 2;
                }
                else {
                    i = 1;
                }
                return pow10 * i;
            }
            return Math.round(100 * num) / 100;
        };
        /**
         * Create the string to display the distance information.
         * @param num The dustance value.
         * @param isSmall Specifies if the number is a small value (meters or feet).
         */
        ScaleBarControl.prototype._createDistanceString = function (num, isSmall) {
            if (this._options.units) {
                switch (this._options.units.toLowerCase()) {
                    case 'feet':
                    case 'foot':
                    case 'ft':
                        return num + ' ft';
                    case 'kilometers':
                    case 'kilometer':
                    case 'kilometres':
                    case 'kilometre':
                    case 'km':
                    case 'kms':
                        return num + ' km';
                    case 'miles':
                    case 'mile':
                    case 'mi':
                        return num + ' mi';
                    case 'nauticalmiles':
                    case 'nauticalmile':
                    case 'nms':
                    case 'nm':
                        return num + ' nm';
                    case 'yards':
                    case 'yard':
                    case 'yds':
                    case 'yrd':
                    case 'yrds':
                        return num + ' yds';
                    case 'metric':
                        if (isSmall === 1) {
                            return num + ' m';
                        }
                        else {
                            return num + ' km';
                        }
                    case 'imperial':
                        if (isSmall === 2) {
                            return num + ' yrds';
                        }
                        else if (isSmall === 1) {
                            return num + ' ft';
                        }
                        else {
                            return num + ' mi';
                        }
                    case 'meters':
                    case 'metres':
                    case 'm':
                    default:
                        return num + ' m';
                }
            }
        };
        return ScaleBarControl;
    }());



    var baseControl = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ScaleBarControl: ScaleBarControl
    });

    var control = Namespace.merge("atlas.control", baseControl);

    exports.control = control;

}(this.atlas = this.atlas || {}, atlas));
