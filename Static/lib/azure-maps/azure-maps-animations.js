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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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

    /** Easing functions for animations. */
    var Easings = /** @class */ (function () {
        function Easings() {
        }
        //From http://andrewraycode.github.io/easing-utils/gh-pages/
        /**
         * A linear easing function.
         * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
         */
        Easings.linear = function (progress) {
            return progress;
        };
        /**
        * Slight acceleration from zero to full speed.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInSine = function (progress) {
            return 1 - Math.cos(progress * Math.PI * 0.5);
        };
        /**
        * Slight deceleration at the end.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutSine = function (progress) {
            return Math.sin(progress * Math.PI * 0.5);
        };
        /**
        * Slight acceleration at beginning and slight deceleration at end.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutSine = function (progress) {
            return -0.5 * (Math.cos(Math.PI * progress) - 1);
        };
        /**
        * Accelerating from zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInQuad = function (progress) {
            return progress * progress;
        };
        /**
        * Decelerating to zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutQuad = function (progress) {
            return progress * (2 - progress);
        };
        /**
        * Acceleration until halfway, then deceleration.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutQuad = function (progress) {
            if (progress < 0.5) {
                return 2 * progress * progress;
            }
            return -1 + (4 - 2 * progress) * progress;
        };
        /**
        * Accelerating from zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInCubic = function (progress) {
            return progress * progress * progress;
        };
        /**
        * Decelerating to zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutCubic = function (progress) {
            var t1 = progress - 1;
            return t1 * t1 * t1 + 1;
        };
        /**
        * Acceleration until halfway, then deceleration.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutCubic = function (progress) {
            if (progress < 0.5) {
                return 4 * progress * progress * progress;
            }
            return (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
        };
        /**
        * Accelerating from zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInQuart = function (progress) {
            return progress * progress * progress * progress;
        };
        /**
        * Decelerating to zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutQuart = function (progress) {
            var t1 = progress - 1;
            return 1 - t1 * t1 * t1 * t1;
        };
        /**
        * Acceleration until halfway, then deceleration.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutQuart = function (progress) {
            if (progress < 0.5) {
                return 8 * progress * progress * progress * progress;
            }
            var t1 = progress - 1;
            return 1 - 8 * t1 * t1 * t1 * t1;
        };
        /**
        * Accelerating from zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInQuint = function (progress) {
            return progress * progress * progress * progress * progress;
        };
        /**
        * Decelerating to zero velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutQuint = function (progress) {
            var t1 = progress - 1;
            return 1 + t1 * t1 * t1 * t1 * t1;
        };
        /**
        * Acceleration until halfway, then deceleration.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutQuint = function (progress) {
            if (progress < 0.5) {
                return 16 * progress * progress * progress * progress * progress;
            }
            var t1 = progress - 1;
            return 1 + 16 * t1 * t1 * t1 * t1 * t1;
        };
        /**
        * Accelerate exponentially until finish.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInExpo = function (progress) {
            if (progress === 0) {
                return 0;
            }
            return Math.pow(2, 10 * (progress - 1));
        };
        /**
        * Initial exponential acceleration slowing to stop.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutExpo = function (progress) {
            if (progress === 1) {
                return 1;
            }
            return 1 - Math.pow(2, -10 * progress);
        };
        /**
        * Exponential acceleration and deceleration.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutExpo = function (progress) {
            if (progress === 0 || progress === 1) {
                return progress;
            }
            var scaledTime1 = progress * 2 - 1;
            if (scaledTime1 < 0) {
                return 0.5 * Math.pow(2, 10 * scaledTime1);
            }
            return 0.5 * (2 - Math.pow(2, -10 * scaledTime1));
        };
        /**
        * Increasing velocity until stop.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInCirc = function (progress) {
            return -1 * (Math.sqrt(1 - progress * progress) - 1);
        };
        /**
        * Start fast, decreasing velocity until stop.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutCirc = function (progress) {
            var t1 = progress - 1;
            return Math.sqrt(1 - t1 * t1);
        };
        /**
        * Fast increase in velocity, fast decrease in velocity.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutCirc = function (progress) {
            var scaledTime = progress * 2;
            if (scaledTime < 1) {
                return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
            }
            var scaledTime1 = scaledTime - 2;
            return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
        };
        /**
        * Slow movement backwards then fast snap to finish.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeInBack = function (progress, magnitude) {
            magnitude = magnitude || 1.70158;
            return progress * progress * ((magnitude + 1) * progress - magnitude);
        };
        /**
        * Fast snap to backwards point then slow resolve to finish.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeOutBack = function (progress, magnitude) {
            magnitude = magnitude || 1.70158;
            var scaledTime = progress - 1;
            return (scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude)) + 1;
        };
        /**
        * Slow movement backwards, fast snap to past finish, slow resolve to finish.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeInOutBack = function (progress, magnitude) {
            magnitude = magnitude || 1.70158;
            var scaledTime = progress * 2;
            var s = magnitude * 1.525;
            if (scaledTime < 1) {
                return 0.5 * scaledTime * scaledTime * (((s + 1) * scaledTime) - s);
            }
            var scaledTime2 = scaledTime - 2;
            return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
        };
        /**
        * Bounces slowly then quickly to finish.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeInElastic = function (progress, magnitude) {
            if (progress === 0 || progress === 1) {
                return progress;
            }
            magnitude = magnitude || 0.7;
            var scaledTime1 = progress - 1;
            var p = 1 - magnitude;
            var s = p / (2 * Math.PI) * Math.asin(1);
            return -(Math.pow(2, 10 * scaledTime1) *
                Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
        };
        /**
        * Fast acceleration, bounces to zero.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeOutElastic = function (progress, magnitude) {
            if (progress === 0 || progress === 1) {
                return progress;
            }
            magnitude = magnitude || 0.7;
            var p = 1 - magnitude;
            var scaledTime = progress * 2;
            var s = p / (2 * Math.PI) * Math.asin(1);
            return (Math.pow(2, -10 * scaledTime) *
                Math.sin((scaledTime - s) * (2 * Math.PI) / p)) + 1;
        };
        /**
        * Slow start and end, two bounces sandwich a fast motion.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        Easings.easeInOutElastic = function (progress, magnitude) {
            if (progress === 0 || progress === 1) {
                return progress;
            }
            magnitude = magnitude || 0.65;
            var p = 1 - magnitude;
            var scaledTime1 = progress * 2 - 1;
            var s = p / (2 * Math.PI) * Math.asin(1);
            if (scaledTime1 < 0) {
                return -0.5 * (Math.pow(2, 10 * scaledTime1) *
                    Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
            }
            return (Math.pow(2, -10 * scaledTime1) *
                Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5) + 1;
        };
        /**
        * Bounce to completion.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeOutBounce = function (progress) {
            if (progress < (1 / 2.75)) {
                return 7.5625 * progress * progress;
            }
            else if (progress < (2 / 2.75)) {
                var scaledTime2 = progress - (1.5 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.75;
            }
            else if (progress < (2.5 / 2.75)) {
                var scaledTime2 = progress - (2.25 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.9375;
            }
            else {
                var scaledTime2 = progress - (2.625 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.984375;
            }
        };
        /**
        * Bounce increasing in velocity until completion.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInBounce = function (progress) {
            return 1 - Easings.easeOutBounce(1 - progress);
        };
        /**
        * Bounce in and bounce out.
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        Easings.easeInOutBounce = function (progress) {
            if (progress < 0.5) {
                return Easings.easeInBounce(progress * 2) * 0.5;
            }
            return (Easings.easeOutBounce((progress * 2) - 1) * 0.5) + 0.5;
        };
        return Easings;
    }());

    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * Calculates the progress of an animation based on the current timestamp, start time and duration.
         * @param timestamp The current timestamp.
         * @param start The time the animation started.
         * @param duration The duration of the animation.
         * @param speed The speed of the animation.
         */
        Utils.getProgress = function (timestamp, start, duration, speed) {
            return Math.max(Math.min((timestamp - start) * speed / duration, 1), 0);
        };
        /**
         * Calculates the start time of an animation based on the progress and duration.
         * @param progress Progress of an animation.
         * @param duration Duration of an animation.
         * @param speed The speed of the animation.
         */
        Utils.getStartTime = function (progress, duration, speed) {
            return performance.now() - Math.round((duration * progress) / speed);
        };
        /**
         *
         * @param coords The coordinate set.
         * @returns 0 - point, 1 - linestring/multipoint, 2 - polygon/multilinestring, 3 - multipolygon.
         */
        Utils.getDimensions = function (coords) {
            if (coords && Array.isArray(coords) && coords.length > 0) {
                if (typeof coords[0] === 'number') {
                    return 0; //Point
                }
                else if (Array.isArray(coords[0]) && coords[0].length > 0) {
                    if (typeof coords[0][0] === 'number') {
                        return 1; //MultiPoint or Linestring
                    }
                    else if (Array.isArray(coords[0][0]) && coords[0][0].length > 0) {
                        if (typeof coords[0][0][0] === 'number') {
                            return 2; //polygon or multilinestring
                        }
                        else if (Array.isArray(coords[0][0][0]) && coords[0][0][0].length > 0) {
                            if (typeof coords[0][0][0][0] === 'number') {
                                return 3; //MultiPolygon
                            }
                        }
                    }
                }
            }
            return -1;
        };
        Utils.getSuitableCoordinates = function (shape, coords) {
            var geomType = 'Point';
            if (shape instanceof azmaps.Shape) {
                geomType = shape.getType();
            }
            if (coords) {
                var dim = Utils.getDimensions(coords);
                switch (geomType) {
                    case 'Point':
                        switch (dim) {
                            case 0:
                                return coords;
                            case 1:
                                return coords[0];
                            case 2:
                                return coords[0][0];
                            case 3:
                                return coords[0][0][0];
                        }
                        break;
                    case 'MultiPoint':
                    case 'LineString':
                        switch (dim) {
                            case 0:
                                return (geomType === 'MultiPoint') ? [coords] : [coords, coords];
                            case 1:
                                return coords;
                            case 2:
                                return coords[0];
                            case 3:
                                return coords[0][0];
                        }
                        break;
                    case 'MultiLineString':
                    case 'Polygon':
                        switch (dim) {
                            case 0:
                                return [[coords, coords, coords]];
                            case 1:
                                return [coords];
                            case 2:
                                return coords;
                            case 3:
                                return coords[0];
                        }
                        break;
                    case 'MultiPolygon':
                        switch (dim) {
                            case 0:
                                return [[[coords, coords, coords]]];
                            case 1:
                                return [[coords]];
                            case 2:
                                return [coords];
                            case 3:
                                return coords;
                        }
                        break;
                }
            }
            return null;
        };
        Utils.getPixelHeading = function (origin, destination) {
            var dx = (destination[0] - origin[0]) * Math.PI / 180;
            var dy = (origin[1] - destination[1]) * Math.PI / 180;
            return ((5 / 2 * Math.PI) - Math.atan2(dy, dx)) * 180 / Math.PI % 360;
        };
        Utils.getPixelDestination = function (origin, heading, distance) {
            return [
                origin[0] + distance * Math.cos((heading + 270) * Math.PI / 180),
                origin[1] + distance * Math.sin((heading + 270) * Math.PI / 180),
            ];
        };
        /** Adds metadata to a shape. */
        Utils.setMetadata = function (shape, metadata) {
            if (shape && metadata) {
                if (shape instanceof azmaps.Shape) {
                    shape.setProperties(Object.assign(shape.getProperties(), metadata));
                }
                else if (shape instanceof azmaps.HtmlMarker) {
                    shape['metadata'] = Object.assign(shape['metadata'] || {}, metadata);
                }
            }
        };
        /** Updates the coordinates of a point or line shape, or an HTML marker. */
        Utils.setCoordinates = function (shape, pos, positions) {
            if (shape) {
                if (shape instanceof azmaps.Shape) {
                    switch (shape.getType()) {
                        case 'Point':
                            shape.setCoordinates(pos);
                            break;
                        case 'LineString':
                            if (positions) {
                                shape.setCoordinates(positions);
                            }
                            break;
                    }
                }
                else if (shape instanceof azmaps.HtmlMarker) {
                    shape.setOptions({
                        position: pos
                    });
                }
            }
        };
        /**
         * Takes a formatted property path string, and breaks it up into its parts.
         * @param path Property path string.
         */
        Utils.getPropertyPath = function (path) {
            return path.split('/');
        };
        /**
         * Sets a value on an object based on property path.
         * @param obj The object to add the value to.
         * @param propertyPath The path to the property.
         * @param value The value.
         */
        Utils.setValue = function (obj, propertyPath, value) {
            if (propertyPath.length > 1) {
                var key = propertyPath.shift();
                Utils.setValue(obj[key] =
                    Object.prototype.toString.call(obj[key]) === '[object Object]' ? obj[key] : {}, propertyPath, value);
            }
            else {
                obj[propertyPath[0]] = value;
            }
        };
        /**
         * Retrieves the value of an object using its path.
         * @param obj The object to get the value from.
         * @param propertyPath The path of the property.
         */
        Utils.getValue = function (obj, propertyPath) {
            var len = propertyPath.length;
            if (len > 0 && obj) {
                var o = obj[propertyPath[0]];
                if (o != null) {
                    var i = void 0;
                    // Step through the property.
                    for (i = 1; i < len; i++) {
                        o = o[propertyPath[i]];
                        if (o == null) {
                            break;
                        }
                    }
                    // Make sure that all properties were stepped through.
                    if (i === len && o != null) {
                        return o;
                    }
                }
            }
            return null;
        };
        /**
         * Grabs the properties of two points and performs an interpolation between them.
         * @param p1 The first point feature.
         * @param p2 The second point feature.
         * @param offset The offset between the first point and the second point.
         * @param intpr The interpolation expression.
         */
        Utils.interpolateValue = function (p1, p2, offset, intpr, obj) {
            if (p1 && p2 && intpr) {
                intpr.interpolation = intpr.interpolation || 'linear';
                var propertyPath = Utils.getPropertyPath(intpr.propertyPath);
                var v1 = Utils.getValue(p1.properties, propertyPath);
                var v2 = Utils.getValue(p2.properties, propertyPath);
                var t1 = typeof v1;
                var t2 = typeof v2;
                if (t1 !== 'undefined' && t2 !== 'undefined' && t1 === t2) {
                    var tOut = void 0;
                    if (v1 instanceof Date) {
                        v1 = v1.getTime();
                        tOut = 'Date';
                    }
                    if (v2 instanceof Date) {
                        v2 = v2.getTime();
                        //If tOut is not set to date, v1 is a different type.
                        if (tOut !== 'Date') {
                            return null;
                        }
                    }
                    var val = void 0;
                    if (t1 === 'number' && t2 === 'number') {
                        switch (intpr.interpolation) {
                            case 'linear':
                                val = v1 + (v2 - v1) * offset;
                                break;
                            case 'min':
                                val = Math.min(v1, v2);
                                break;
                            case 'max':
                                val = Math.max(v1, v2);
                                break;
                            case 'avg':
                                val = (v1 + v2) * 0.5;
                                break;
                        }
                    }
                    else if (intpr.interpolation === 'nearest') {
                        val = (offset < 0.5) ? v1 : v2;
                    }
                    if (typeof val !== 'undefined') {
                        if (tOut === 'Date') {
                            val = new Date(val);
                        }
                        Utils.setValue(obj, propertyPath, val);
                    }
                }
            }
            return null;
        };
        Utils.extractRoutePointsFromFeature = function (feature, timestampProperty) {
            var pts = [];
            var pt;
            var t;
            switch (feature.geometry.type) {
                case 'Point':
                    pt = Utils.extractRoutePointFromPoint(feature, timestampProperty);
                    if (pt) {
                        pts = [pt];
                    }
                    break;
                case 'LineString':
                case 'MultiPoint':
                    if (feature.properties[timestampProperty] &&
                        Array.isArray(feature.properties[timestampProperty]) &&
                        feature.geometry.coordinates.length === feature.properties[timestampProperty].length) {
                        for (var i = 0, len = feature.geometry.coordinates.length; i < len; i++) {
                            t = azmaps.math.parseTimestamp(feature.properties[timestampProperty][i]);
                            if (t) {
                                pts.push(new azmaps.data.Feature(new azmaps.data.Point(feature.geometry.coordinates[i]), {
                                    _timestamp: t.getTime()
                                }));
                            }
                        }
                    }
                    //Check to see if the feature has waypoints in its properties which may contain the route point info.
                    else if (feature.properties.waypoints &&
                        Array.isArray(feature.properties.waypoints) &&
                        feature.geometry.coordinates.length === feature.properties.waypoints.length &&
                        feature.properties.waypoints.length > 0 &&
                        feature.properties.waypoints[0].geometry) {
                        for (var i = 0, len = feature.geometry.coordinates.length; i < len; i++) {
                            if (feature.properties.waypoints[i].geometry.type === 'Point') {
                                pt = Utils.extractRoutePointFromPoint(feature.properties.waypoints[i], timestampProperty);
                                if (pt) {
                                    pts.push(pt);
                                }
                            }
                        }
                    }
                    break;
            }
            if (pts.length > 0) {
                return pts;
            }
            return null;
        };
        Utils.extractRoutePointFromPoint = function (feature, timestampProperty) {
            //Check to see if the feature has the timestampProperty.
            if (feature.properties[timestampProperty]) {
                var t = azmaps.math.parseTimestamp(feature.properties[timestampProperty]);
                if (typeof t !== 'undefined') {
                    feature.properties._timestamp = t.getTime();
                    return feature;
                }
            }
            return null;
        };
        return Utils;
    }());

    /** An animation manager for classes that extend from the AnimatedShape class. */
    var AnimationManager = /** @class */ (function () {
        /****************************
        * Constructor
        ***************************/
        function AnimationManager() {
            /****************************
            * Private Properties
            ***************************/
            this._animation = null;
            this._queue = [];
            //Min frame rate
            this._minFR = 33; //roughly 30 frames per second is the fastest that the animation loop will update.
            this._stopped = true;
            this._idCounter = 1234567890;
            this._idTable = {};
            this._lastTime = performance.now();
            this.enable();
        }
        /****************************
        * Public functions
        ***************************/
        /** Stops all animations. */
        AnimationManager.prototype.disable = function () {
            var self = this;
            if (!self._stopped) {
                self._stopped = true;
                cancelAnimationFrame(self._animation);
            }
        };
        /** Renables animations. Many will likely snap to the end of their animation. */
        AnimationManager.prototype.enable = function () {
            var self = this;
            if (self._stopped) {
                self._stopped = false;
                self._animation = requestAnimationFrame(self._animate.bind(self));
            }
        };
        /**
         * Adds an animated object to the animation queue.
         * @param animatable The object to animate.
         */
        AnimationManager.prototype.add = function (animatable) {
            var self = this;
            if (!animatable._id) {
                animatable._id = self._getUuid();
            }
            var animation = self._idTable[animatable._id];
            //Only add the animation to the queue if it isn't already in it.
            if (!animation) {
                self._queue.push(animatable);
                self._idTable[animatable._id] = animatable;
            }
            return animatable._id;
        };
        /**
         * Gets an animation by ID.
         * @param id The ID of the animation to get.
         */
        AnimationManager.prototype.getById = function (id) {
            return this._idTable[id];
        };
        /**
         * Removes a object from the animation queue.
         * @param animatable The object to remove from the queue.
         */
        AnimationManager.prototype.remove = function (animatable) {
            var self = this;
            //Verify animation is in queue.
            if (animatable) {
                var id = animatable._id;
                if (self._idTable[id]) {
                    var q = self._queue;
                    //Loop through and find the index of the animation in the array.
                    for (var i = q.length - 1; i >= 0; i--) {
                        if (id === q[i]._id) {
                            //Remove it from the queue.
                            self._queue = q.splice(i, 1);
                            //Remove it from the lookup table.
                            self._idTable[id] = undefined;
                            break;
                        }
                    }
                }
            }
        };
        /**
         * Removes an animation from the queue by ID.
         * @param id The ID of the animation to remove.
         */
        AnimationManager.prototype.removeById = function (id) {
            this.remove(this._idTable[id]);
        };
        /****************************
        * Private functions
        ***************************/
        /** Loops through the queue and animates a frame for each animatable object. */
        AnimationManager.prototype._animate = function () {
            var self = this;
            if (!self._stopped) {
                var t = performance.now();
                if (t - self._lastTime >= self._minFR) {
                    var q = self._queue;
                    //Iterate backwards over queue incase the _onTriggerFrameAnimation asks to remove the animation. 
                    for (var i = q.length - 1; i >= 0; i--) {
                        try {
                            q[i]._onAnimationProgress(t);
                        }
                        catch (_a) { }
                    }
                    //Request the next frame of the animation.
                    self._lastTime = t;
                }
                self._animation = requestAnimationFrame(self._animate.bind(self));
            }
        };
        /** Retrieves a unique ID from the animation manager. */
        AnimationManager.prototype._getUuid = function () {
            return this._idCounter++;
        };
        /****************************
        * Public static properties
        ***************************/
        /** A blobal static instance of the AnimationManager. */
        AnimationManager.instance = new AnimationManager();
        return AnimationManager;
    }());

    /** An abstract class which defines an animation that supports a play function. */
    var PlayableAnimation = /** @class */ (function (_super) {
        __extends(PlayableAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * The base playable animation class.
         * @param options Animaiton options.
         */
        function PlayableAnimation(options) {
            var _this = _super.call(this) || this;
            /**************************
            * Private properties
            ***************************/
            _this._start = null;
            _this._rawProgress = 0;
            _this._options = {
                duration: 1000,
                autoPlay: false,
                easing: 'linear',
                loop: false,
                reverse: false,
                speedMultiplier: 1,
                disposeOnComplete: false
            };
            _this._easing = Easings.linear;
            var self = _this;
            self._id = AnimationManager.instance.add(self);
            self.setOptions(options);
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        /** Disposes the animation. */
        PlayableAnimation.prototype.dispose = function () {
            var self = this;
            self.stop();
            AnimationManager.instance.remove(self);
            self._options = null;
            self._easing = null;
            self._start = null;
            self._onComplete = null;
            self._id = undefined;
            self._rawProgress = null;
        };
        /** Gets the duration of the animation. Returns Infinity if the animations loops forever. */
        PlayableAnimation.prototype.getDuration = function () {
            var o = this._options;
            return (o.loop) ? Infinity : o.duration / o.speedMultiplier;
        };
        /** Gets the animation options. */
        PlayableAnimation.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /**
         * Checks to see if the animaiton is playing.
         */
        PlayableAnimation.prototype.isPlaying = function () {
            return this._start !== null;
        };
        /**
         * Plays the animation.
         * @param reset Specifies if the animation should reset before playing.
         */
        PlayableAnimation.prototype.play = function (reset) {
            var self = this;
            if (reset) {
                self.reset();
            }
            if (self._rawProgress >= 1) {
                //Animation is complete, restart.
                self._rawProgress = 0;
            }
            if (self._rawProgress > 0) {
                //Animation is paused, calculated offset start time of animation.
                self._start = Utils.getStartTime(self._rawProgress, self._options.duration, self._options.speedMultiplier);
            }
            else {
                self._start = performance.now();
            }
        };
        /**
         * Pauses the animation.
         */
        PlayableAnimation.prototype.pause = function () {
            //Stop the progress of the animation.
            this._start = null;
        };
        /**
         * Advances the animation to specific step.
         * @param progress The progress of the animation to advance to. A value between 0 and 1.
         */
        PlayableAnimation.prototype.seek = function (progress) {
            var self = this;
            if (typeof progress === 'number') {
                var isPLaying = self.isPlaying();
                if (isPLaying) {
                    self.pause();
                }
                self._rawProgress = Math.min(Math.max(progress, 0), 1) / self._options.speedMultiplier;
                self._processFrame();
                if (isPLaying) {
                    self.play();
                }
            }
        };
        /** Sets the options of the animation. */
        PlayableAnimation.prototype.setOptions = function (options) {
            if (options) {
                var self_1 = this;
                var opt = self_1._options;
                if (options.easing) {
                    if (typeof options.easing === 'string' && Easings[options.easing]) {
                        self_1._easing = Easings[options.easing];
                        opt.easing = options.easing;
                    }
                    else if (options.easing instanceof Function) {
                        self_1._easing = options.easing;
                        opt.easing = options.easing;
                    }
                }
                if (typeof options.loop === 'boolean') {
                    opt.loop = options.loop;
                }
                if (typeof options.disposeOnComplete === 'boolean') {
                    opt.disposeOnComplete = options.disposeOnComplete;
                }
                if (typeof options.reverse === 'boolean') {
                    opt.reverse = options.reverse;
                }
                if (typeof options.speedMultiplier === 'number' && options.speedMultiplier > 0) {
                    opt.speedMultiplier = options.speedMultiplier;
                }
                var hasDuration = typeof options.duration === 'number' && options.duration > 0 && opt.duration !== options.duration;
                var hasAutoPlay = typeof options.autoPlay === 'boolean';
                if (hasDuration || hasAutoPlay) {
                    var isPlaying = self_1.isPlaying();
                    if (isPlaying) {
                        self_1.pause();
                    }
                    if (hasAutoPlay) {
                        opt.autoPlay = options.autoPlay || opt.autoPlay;
                        if (!isPlaying && options.autoPlay) {
                            isPlaying = true;
                        }
                    }
                    if (hasDuration) {
                        opt.duration = options.duration || opt.duration;
                    }
                    if (isPlaying) {
                        self_1.play();
                    }
                }
            }
        };
        /**
         * Stops the animation and jumps back to the end of the animation.
         */
        PlayableAnimation.prototype.stop = function () {
            var self = this;
            //Jump to the end of the animation. 
            self._rawProgress = 1;
            self._processFrame();
            self._start = null;
        };
        /**
         * Stops the animation and jumps back to the beginning of the animation.
         */
        PlayableAnimation.prototype.reset = function () {
            var self = this;
            //Jump to the beginning of the animation. 
            self._start = null;
            self._rawProgress = 0;
            self._processFrame();
        };
        /**
         * Callback function that contains the animation frame logic.
         * @param progress The progress of the animation where 0 is start and 1 is the end.
         */
        PlayableAnimation.prototype._onAnimationProgress = function (timestamp) {
            var self = this;
            if (self._start) {
                self._rawProgress = Utils.getProgress(timestamp, self._start, self._options.duration, self._options.speedMultiplier);
                self._processFrame();
            }
        };
        /**************************
        * Private functions
        ***************************/
        /**
         * Processes the animation frame for the raw progress.
         */
        PlayableAnimation.prototype._processFrame = function () {
            var self = this;
            var opt = self._options;
            if (typeof self._id !== 'undefined') {
                var progress = self._rawProgress || 0;
                //Animation reached the end.
                if (progress >= 1) {
                    if (opt.loop) {
                        //Restart the animation.
                        self._rawProgress = 0;
                        self._start = performance.now();
                    }
                    else {
                        //Stop animating. 
                        self._rawProgress = 1;
                        self._start = null;
                        if (self._onComplete) {
                            self._onComplete();
                        }
                    }
                }
                var playProgress = (opt.reverse) ? 1 - self._rawProgress : self._rawProgress;
                if (self._easing) {
                    progress = self._easing(playProgress);
                }
                var state = self.onAnimationProgress(progress);
                var eventArgs = Object.assign({
                    progress: playProgress,
                    easingProgress: progress,
                    animation: self
                }, state || {});
                self._invokeEvent('onprogress', Object.assign({ type: 'onprogress' }, eventArgs));
                //Check to see if the animation is complete.
                if (self._start === null) {
                    self._invokeEvent('oncomplete', Object.assign({ type: 'oncomplete' }, eventArgs));
                }
                if (opt.disposeOnComplete) {
                    self.dispose();
                }
            }
        };
        return PlayableAnimation;
    }(azmaps.internal.EventEmitter));

    /** A class for frame based animations. */
    var FrameBasedAnimationTimer = /** @class */ (function (_super) {
        __extends(FrameBasedAnimationTimer, _super);
        /**
         * An class for frame based animations.
         * @param numberOfFrames The number of frames in the animation.
         * @param onFrame A callback function to trigger when the frame index changes.
         * @param options Animation options.
         */
        function FrameBasedAnimationTimer(numberOfFrames, onFrame, options) {
            var _this = _super.call(this, options) || this;
            _this._numFrames = 0;
            _this._curFrameIdx = -1;
            var self = _this;
            self._numFrames = numberOfFrames;
            self._onFrame = onFrame;
            if (options && options.autoPlay) {
                self.play();
            }
            return _this;
        }
        /** Gets the current frame index of the animation. Returns -1 if animation hasn't started, or if there is 0 frames. */
        FrameBasedAnimationTimer.prototype.getCurrentFrameIdx = function () {
            if (this._numFrames <= 0) {
                return -1;
            }
            return this._curFrameIdx;
        };
        /** Gets the number of frames in the animation. */
        FrameBasedAnimationTimer.prototype.getNumberOfFrames = function () {
            return this._numFrames;
        };
        /**
         * Sets the frame index of the animation.
         * @param frameIdx The frame index to advance to.
         */
        FrameBasedAnimationTimer.prototype.setFrameIdx = function (frameIdx) {
            var self = this;
            if (frameIdx >= 0 || frameIdx < self._numFrames) {
                self.seek(self._numFrames / frameIdx);
            }
        };
        /**
         * Sets the number of frames in the animation.
         * @param numberOfFrames The number of frames in the animation.
         */
        FrameBasedAnimationTimer.prototype.setNumberOfFrames = function (numberOfFrames) {
            var self = this;
            if (typeof numberOfFrames === 'number' && self._numFrames !== numberOfFrames) {
                self._numFrames = Math.max(numberOfFrames, 0);
                self._curFrameIdx = (numberOfFrames < self._curFrameIdx) ? self._curFrameIdx : 0;
                if (numberOfFrames <= 0) {
                    self._curFrameIdx = -1;
                }
                self._triggerFrame(self._curFrameIdx);
            }
        };
        /////////////////////////////
        // Abstract method override
        ////////////////////////////
        FrameBasedAnimationTimer.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var nf = self._numFrames;
            if (nf > 0) {
                //Need to get even spaced frame periods.
                var frameIdx = Math.round(progress * nf - 0.49999999999999999999999);
                if (frameIdx !== self._curFrameIdx) {
                    //When progress exactly 1, the frameIdx will be equal to the number of frames, but we want one less. This means that the last frame will be slightly longer (a couple of ms in a most cases).
                    if (frameIdx === nf) {
                        frameIdx--;
                    }
                    else if (frameIdx < 0) {
                        //Unlikely to happen, but an extra check to be safe. Ignore any frames that are negative.
                        frameIdx = -1;
                    }
                    self._triggerFrame(frameIdx);
                    return { frameIdx: frameIdx };
                }
            }
            return null;
        };
        FrameBasedAnimationTimer.prototype._triggerFrame = function (frameIdx) {
            var self = this;
            if (self._onFrame && frameIdx !== -1) {
                self._onFrame(frameIdx);
            }
            self._curFrameIdx = frameIdx;
            if (frameIdx !== -1) {
                self._invokeEvent('onframe', {
                    type: 'onframe',
                    frameIdx: frameIdx,
                    animation: self,
                    numFrames: self._numFrames
                });
            }
        };
        return FrameBasedAnimationTimer;
    }(PlayableAnimation));

    /** A layer that can smoothly animate through an array of tile layers. */
    var AnimatedTileLayer = /** @class */ (function (_super) {
        __extends(AnimatedTileLayer, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * A layer that can smoothly animate through an array of tile layers.
         * @param options Options for the layer.
         */
        function AnimatedTileLayer(options) {
            var _this = _super.call(this) || this;
            /**************************
            * Private properties
            ***************************/
            _this._tileLayers = [];
            _this._options = {
                tileLayerOptions: [],
                visible: true
            };
            /**************************
            * Private functions
            ***************************/
            _this._onFrame = function (frameIdx) {
                var self = _this;
                var o = self._options;
                if (self._map && o.visible && o.tileLayerOptions && o.tileLayerOptions.length > 0 && frameIdx < o.tileLayerOptions.length) {
                    var m = self._map['map'];
                    var ct = self._currentTileLayer;
                    var id = void 0;
                    if (ct) {
                        id = ct.getId();
                        //Use lower level options to change the opacity for more smoothness.
                        m.setPaintProperty(id, 'raster-opacity-transition', { duration: 0, delay: 0 });
                        m.setPaintProperty(id, 'raster-opacity', 0);
                    }
                    ct = self._tileLayers[frameIdx];
                    self._currentTileLayer = ct;
                    id = ct.getId();
                    //Use lower level options to change the opacity for more smoothness.
                    m.setPaintProperty(id, 'raster-opacity-transition', { duration: 0, delay: 0 });
                    m.setPaintProperty(id, 'raster-opacity', o.tileLayerOptions[frameIdx].opacity);
                }
            };
            var self = _this;
            self._id = AnimationManager.instance.add(self);
            var numFrames = 0;
            if (options && options.tileLayerOptions) {
                numFrames = options.tileLayerOptions.length;
            }
            self._animation = new FrameBasedAnimationTimer(numFrames, self._onFrame, options);
            self._onComplete = self._animation._onComplete;
            if (options) {
                self.setOptions(options);
            }
            return _this;
        }
        /**************************
        * Public functions
        ***************************/
        /** Disposes the layer. */
        AnimatedTileLayer.prototype.dispose = function () {
            var self = this;
            self._animation.stop();
            AnimationManager.instance.remove(self);
            AnimationManager.instance.remove(self._animation);
            self._animation = undefined;
            self._onComplete = undefined;
            self._id = undefined;
            self._options = undefined;
        };
        /** Gets the duration of the animation. Returns Infinity if the animations loops forever. */
        AnimatedTileLayer.prototype.getDuration = function () {
            return (this._options.loop) ? Infinity : this._options.duration;
        };
        /** Gets the options for the layer. */
        AnimatedTileLayer.prototype.getOptions = function () {
            return Object.assign({}, this._options, this._animation.getOptions());
        };
        /** Gets the underlying frame based animation instance. */
        AnimatedTileLayer.prototype.getPlayableAnimation = function () {
            return this._animation;
        };
        /**
         * Checks to see if the animaiton is playing.
         */
        AnimatedTileLayer.prototype.isPlaying = function () {
            return this._animation.isPlaying();
        };
        /**
         * Pauses the animation.
         */
        AnimatedTileLayer.prototype.pause = function () {
            this._animation.pause();
        };
        /**
         * Plays the animation.
         */
        AnimatedTileLayer.prototype.play = function () {
            this._animation.play();
        };
        /** Stops the animation and jumps back to the beginning the animation. */
        AnimatedTileLayer.prototype.reset = function () {
            this._animation.reset();
        };
        /** Stops the animation. */
        AnimatedTileLayer.prototype.stop = function () {
            this._animation.stop();
        };
        /**
         * Sets the frame index of the animation.
         * @param frameIdx The frame index to advance to.
         */
        AnimatedTileLayer.prototype.setFrameIdx = function (frmeIdx) {
            this._animation.setFrameIdx(frmeIdx);
        };
        /**
         * Sets the options of the layer.
         * @param options The options to apply to the layer.
         */
        AnimatedTileLayer.prototype.setOptions = function (options) {
            var self = this;
            var animation = self._animation;
            var map = self._map;
            var opt = self._options;
            var tileLayers = self._tileLayers;
            if (options) {
                if (options.tileLayerOptions) {
                    if (tileLayers.length > 0) {
                        if (map) {
                            map.layers.remove(tileLayers);
                        }
                        tileLayers = [];
                        self._tileLayers = tileLayers;
                        self._currentTileLayer = null;
                    }
                    options.tileLayerOptions.forEach(function (x) {
                        //Do not allow fade duration or visble to be changed in individual layers.
                        x.fadeDuration = 0;
                        x.visible = true;
                        //Make opacity 0 by default when rendering the layer. Toggling the opacity is smoother than visble for animations.
                        //Additionally, by having opacity set to 0, the map will still load the tiles, even if the layer isn't visible yet. 
                        //This is an easy way to pre-load tiles for better performance.
                        tileLayers.push(new azmaps.layer.TileLayer(Object.assign({}, x, { opacity: 0 })));
                    });
                    if (map) {
                        map.layers.add(tileLayers, self);
                    }
                    opt.tileLayerOptions = options.tileLayerOptions;
                    if (animation) {
                        animation.setNumberOfFrames(opt.tileLayerOptions.length);
                    }
                    var frameIdx = (animation) ? self._animation.getCurrentFrameIdx() : 0;
                    if ((frameIdx == -1 || frameIdx > tileLayers.length)) {
                        frameIdx = 0;
                    }
                    if (frameIdx >= 0) {
                        self._currentTileLayer = tileLayers[frameIdx];
                        self._currentTileLayer.setOptions({ fadeDuration: 0, visible: true });
                    }
                }
                if (typeof options.visible === 'boolean') {
                    opt.visible = options.visible;
                    tileLayers.forEach(function (l) { return l.setOptions({
                        visible: options.visible
                    }); });
                }
            }
            if (animation) {
                //Check to see if the options contain any animation options.
                var updateAnimation_1 = false;
                Object.keys(options).forEach(function (key) {
                    switch (key) {
                        case 'tileLayerOptions':
                        case 'visible':
                            break;
                        default:
                            updateAnimation_1 = true;
                            break;
                    }
                });
                if (updateAnimation_1) {
                    animation.setOptions(options);
                }
            }
        };
        AnimatedTileLayer.prototype.onAdd = function (map) {
            var self = this;
            self._map = map;
            //Need to wait a moment in case someone adds the layer after removing it.
            map.layers.add(self._tileLayers, self);
        };
        AnimatedTileLayer.prototype.onRemove = function () {
            var self = this;
            self.pause();
            var m = self._map;
            self._map = null;
            //Need to remove sublayers, but after the map has removed this layer as maps dispose/clear will also try and remove the sublayers.
            setTimeout(function () {
                var mapLayers = m.layers.getLayers();
                self._tileLayers.forEach(function (tl) {
                    if (mapLayers.indexOf(tl) > -1) {
                        m.layers.remove(tl);
                    }
                });
            }, 0);
        };
        /**
         * @internal
         */
        AnimatedTileLayer.prototype._buildLayers = function () {
            return [];
        };
        /**
        * @internal
        */
        AnimatedTileLayer.prototype._getLayerIds = function () {
            var ids = [];
            this._tileLayers.forEach(function (t) {
                ids.push(t.getId());
            });
            return ids; //[this.id];
        };
        /**
         * @internal
         */
        AnimatedTileLayer.prototype._buildSource = function () {
            return null;
        };
        /**
         * @internal
         */
        AnimatedTileLayer.prototype._getSourceId = function () {
            return null;
        };
        AnimatedTileLayer.prototype._onAnimationProgress = function (timestamp) {
            return null;
        };
        return AnimatedTileLayer;
    }(azmaps.layer.Layer));



    var baseLayer = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AnimatedTileLayer: AnimatedTileLayer
    });

    /** Animates the dropping of a point geometries. */
    var DropAnimation = /** @class */ (function (_super) {
        __extends(DropAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * Animates the dropping of point geometries or HtmlMarkers.
         * @param shapes An array point geometry shapes or HtmlMarkers to animatie dropping.
         * @param dataSourceOrMap The map or data source to drop the shapes into.
         * @param height The height at which to drop the shape from. Default: 200 pixels
         * @param options Options for the animation.
         */
        function DropAnimation(shapes, dataSourceOrMap, height, options) {
            var _this = _super.call(this, options) || this;
            /****************************
            * Private properties
            ***************************/
            _this._height = 200;
            if (shapes && shapes.length > 0) {
                var self_1 = _this;
                self_1._shapes = shapes;
                var x0 = [];
                self_1._x0 = x0;
                var y0 = [];
                self_1._y0 = y0;
                self_1._height = (typeof height === 'number' && height > 0) ? height : self_1._height;
                var needsAdding = [];
                var offset = void 0;
                var ds = void 0;
                var map = void 0;
                var markers = [];
                if (dataSourceOrMap instanceof azmaps.source.DataSource) {
                    ds = dataSourceOrMap;
                }
                if (dataSourceOrMap instanceof azmaps.Map) {
                    map = dataSourceOrMap;
                    markers = map.markers.getMarkers();
                }
                //Extract the offsets for each shape.
                for (var i = 0, len = shapes.length; i < len; i++) {
                    offset = null;
                    if (shapes[i] instanceof azmaps.Shape) {
                        var prop = shapes[i].getProperties();
                        offset = prop['offset'];
                    }
                    else {
                        offset = shapes[i].getOptions().pixelOffset;
                    }
                    if (offset && Array.isArray(offset) && offset.length >= 2) {
                        x0.push(offset[0]);
                        y0.push(offset[1]);
                    }
                    else {
                        x0.push(0);
                        y0.push(0);
                        offset = [0, 0];
                    }
                    offset[1] -= self_1._height;
                    if (shapes[i] instanceof azmaps.Shape) {
                        var s = shapes[i];
                        s.setProperties(Object.assign(s.getProperties(), {
                            offset: offset,
                            opacity: 0
                        }));
                        //Add the shape to the data source if it isn't already added.
                        if (ds && ds.getShapeById(shapes[i].getId()) === null) {
                            needsAdding.push(shapes[i]);
                        }
                    }
                    else {
                        var m = shapes[i];
                        (m).setOptions({ pixelOffset: offset, visible: false });
                        if (map && markers && markers.indexOf(m) === -1) {
                            map.markers.add(m);
                        }
                    }
                }
                if (ds && needsAdding.length > 0) {
                    ds.add(needsAdding);
                }
                if (options && options.autoPlay) {
                    self_1.play();
                }
            }
            else {
                throw 'No shape specified for animation.';
            }
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        /**
         * The function that contains the animation frame logic.
         * @param timestamp Timestamp from `performance.now()` that for the animation frame relative to the start time.
         */
        DropAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var shapes = self._shapes;
            var offset;
            var y1;
            for (var i = 0, len = shapes.length; i < len; i++) {
                y1 = self._y0[i] - self._height * (1 - progress);
                offset = [self._x0[i], y1];
                if (shapes[i] instanceof azmaps.Shape) {
                    var s = shapes[i];
                    s.setProperties(Object.assign(s.getProperties(), {
                        offset: offset,
                        opacity: (progress !== 0) ? 1 : 0
                    }));
                }
                else {
                    shapes[i].setOptions({ pixelOffset: offset, visible: progress !== 0 });
                }
            }
            return null;
        };
        return DropAnimation;
    }(PlayableAnimation));

    /** An abstract class which defines an animation that will animate the maps camera on each frame as part of a larger animation.  */
    var MapPathPlayableAnaimation = /** @class */ (function (_super) {
        __extends(MapPathPlayableAnaimation, _super);
        /**************************
        * Constructor
        ***************************/
        function MapPathPlayableAnaimation(options) {
            var _this = _super.call(this, options) || this;
            /**************************
            * Private Properties
            ***************************/
            _this._pathOptions = {
                duration: 1000
            };
            _this.setOptions(options);
            return _this;
        }
        /**************************
        * Public functions
        ***************************/
        /** Disposes the animation. */
        MapPathPlayableAnaimation.prototype.dispose = function () {
            this._pathOptions = null;
            _super.prototype.dispose.call(this);
        };
        /** Gets the animation options. */
        MapPathPlayableAnaimation.prototype.getOptions = function () {
            return Object.assign({}, _super.prototype.getOptions.call(this), this._pathOptions);
        };
        /** Sets the options of the animation. */
        MapPathPlayableAnaimation.prototype.setOptions = function (options) {
            if (options) {
                var self_1 = this;
                var opt = self_1._pathOptions;
                if (typeof options.duration === 'number' && options.duration > 0) {
                    opt.duration = options.duration || opt.duration;
                }
                if (typeof options.captureMetadata === 'boolean') {
                    opt.captureMetadata = options.captureMetadata;
                }
                if (typeof options.geodesic === 'boolean') {
                    opt.geodesic = options.geodesic;
                }
                if (typeof options.reverse === 'boolean') {
                    opt.reverse = options.reverse;
                }
                if (typeof options.pitch === 'number') {
                    opt.pitch = options.pitch;
                }
                if (typeof options.zoom === 'number') {
                    opt.zoom = options.zoom;
                }
                if (typeof options.rotate === 'boolean') {
                    opt.rotate = options.rotate;
                }
                if (typeof options.rotationOffset === 'number') {
                    opt.rotationOffset = options.rotationOffset;
                }
                if (options.map || options.map === null) {
                    opt.map = options.map;
                }
                _super.prototype.setOptions.call(this, options);
            }
        };
        /**************************
        * Protected functions
        ***************************/
        MapPathPlayableAnaimation.prototype._setMapCamera = function (position, heading, animate) {
            var opt = this._pathOptions;
            if (opt.map && position) {
                var cam = {
                    center: position
                };
                if (typeof opt.pitch === 'number') {
                    cam.pitch = opt.pitch;
                }
                if (typeof opt.zoom === 'number') {
                    cam.zoom = opt.zoom;
                }
                if (opt.rotate && typeof heading === 'number') {
                    cam.bearing = (opt.reverse) ? heading + 180 : heading;
                    if (typeof opt.rotationOffset === 'number') {
                        cam.bearing += opt.rotationOffset;
                    }
                }
                if (animate) {
                    cam.type = 'fly';
                    cam.duration = Math.min(60, opt.duration);
                }
                else {
                    cam.type = 'jump';
                }
                //Set the initial view of the map.
                opt.map.setCamera(cam);
            }
        };
        MapPathPlayableAnaimation.prototype.onAnimationProgress = function (progress) {
            return null;
        };
        return MapPathPlayableAnaimation;
    }(PlayableAnimation));

    /** Translates a Point object from one coordinate to another. */
    var PointTranslateAnimation = /** @class */ (function (_super) {
        __extends(PointTranslateAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * Animates the dropping of a point geometries.
         * @param shapes An array point geometry shapes to animatie dropping.
         * @param options Options for the animation.
         */
        function PointTranslateAnimation(shape, newPosition, options) {
            var _this = _super.call(this) || this;
            var self = _this;
            var pos;
            if (shape instanceof azmaps.Shape) {
                pos = shape.getCoordinates();
            }
            else {
                pos = shape.getOptions().position;
            }
            self._originPosition = pos;
            self._shape = shape;
            self._destinationPosition = newPosition;
            self.setOptions(options);
            if (options && options.autoPlay) {
                self.play();
            }
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        /** Sets the options of the animation. */
        PointTranslateAnimation.prototype.setOptions = function (options) {
            if (options) {
                _super.prototype.setOptions.call(this, options);
            }
            var self = this;
            var oPos = self._originPosition;
            var destPos = self._destinationPosition;
            var mapMath = azmaps.math;
            var azPixel = azmaps.Pixel;
            if (oPos && destPos) {
                if (self._pathOptions.geodesic) {
                    //Calculate the distance and heading between the points. 
                    self._dx = mapMath.getDistanceTo(oPos, destPos);
                    self._heading = mapMath.getHeading(oPos, destPos);
                }
                else {
                    //Calculate the mercator pixels of the coordinates at zoom level 21.
                    var pixels = mapMath.mercatorPositionsToPixels([oPos, destPos], 21);
                    self._originPixel = pixels[0];
                    //Ensure that the shortest path is taken between coordinates.
                    if (Math.abs(oPos[0] - destPos[0]) > 180) {
                        var mapWidth = Math.pow(2, 21) * 512;
                        if (pixels[0][0] > pixels[1][0]) {
                            pixels[1][0] += mapWidth;
                        }
                        else {
                            pixels[0][0] += mapWidth;
                        }
                    }
                    //Calculate the distance and heading between the pixels. 
                    self._dx = azPixel.getDistance(pixels[0], pixels[1]);
                    self._heading = azPixel.getHeading(pixels[0], pixels[1]);
                }
                if (self._pathOptions.captureMetadata) {
                    Utils.setMetadata(self._shape, {
                        heading: self._heading
                    });
                }
            }
        };
        /**
         * Callback function that contains the animation frame logic.
         * @param progress The progress of the animation where 0 is start and 1 is the end.
         */
        PointTranslateAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var oPos = self._originPosition;
            var heading = self._heading;
            var destPos = self._destinationPosition;
            var mapMath = azmaps.math;
            var opt = self._pathOptions;
            if (oPos && destPos && opt) {
                var pos = void 0;
                var animateCamera = false;
                if (progress === 1) {
                    //Animation is done.
                    pos = destPos;
                }
                else if (progress === 0) {
                    //Restart animation.
                    pos = oPos;
                }
                else {
                    var dx = self._dx * progress;
                    //Calculate the coordinate part way between the origin and destination.
                    if (opt.geodesic) {
                        pos = mapMath.getDestination(oPos, heading, dx);
                    }
                    else {
                        pos = mapMath.mercatorPixelsToPositions([azmaps.Pixel.getDestination(self._originPixel, heading, dx)], 21)[0];
                    }
                    animateCamera = true;
                }
                Utils.setCoordinates(self._shape, pos);
                if (opt.map) {
                    self._setMapCamera(pos, heading, animateCamera);
                }
                return {
                    position: pos,
                    heading: heading
                };
            }
            return null;
        };
        return PointTranslateAnimation;
    }(MapPathPlayableAnaimation));

    /** Translates a Point object along a path or animates a LineString as a snakeline. */
    var PathAnimation = /** @class */ (function (_super) {
        __extends(PathAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        function PathAnimation(path, shape, options) {
            var _this = _super.call(this) || this;
            var self = _this;
            self._shape = shape;
            self._positions = path;
            self.setOptions(Object.assign({
                rotate: true,
                rotationOffset: 0
            }, options || {}));
            if (options && options.autoPlay) {
                self.play();
            }
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        /** Gets the animation options. */
        PathAnimation.prototype.dispose = function () {
            var _this = this;
            Object.keys(this).forEach(function (k) {
                _this[k] = undefined;
            });
            _super.prototype.dispose.call(this);
        };
        /** Sets the options of the animation. */
        PathAnimation.prototype.setOptions = function (options) {
            var self = this;
            if (options) {
                _super.prototype.setOptions.call(this, options);
            }
            var isPlaying = self.isPlaying();
            if (isPlaying) {
                self.pause();
            }
            if (self._positions) {
                var tl = 0;
                var distances = [];
                var heading = [];
                var pos = self._positions;
                var mapMath = azmaps.math;
                //Calculate the distances and headings between the positions.
                if (self._pathOptions.geodesic) {
                    for (var i = 1, len = pos.length; i < len; i++) {
                        var d = mapMath.getDistanceTo(pos[i - 1], pos[i]);
                        tl += d;
                        distances.push(d);
                        var h = mapMath.getHeading(pos[i - 1], pos[i]);
                        heading.push(h);
                    }
                }
                else {
                    //Calculate the mercator pixels of the coordinates at zoom level 21.
                    var pixels = mapMath.mercatorPositionsToPixels(pos, 21);
                    self._pixels = pixels;
                    for (var i = 1, len = pixels.length; i < len; i++) {
                        var d = azmaps.Pixel.getDistance(pixels[i - 1], pixels[i]);
                        tl += d;
                        distances.push(d);
                        var h = Utils.getPixelHeading(pixels[i - 1], pixels[i]);
                        heading.push(h);
                    }
                }
                self._totalLength = tl;
                self._distances = distances;
                self._headings = heading;
                if (self._pathOptions.captureMetadata) {
                    Utils.setMetadata(self._shape, { heading: self._headings[0] });
                }
            }
            if (isPlaying) {
                self.play();
            }
        };
        /**
         * Callback function that contains the animation frame logic.
         * @param progress The progress of the animation where 0 is start and 1 is the end.
         */
        PathAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var pos;
            var heading;
            var shape = self._shape;
            var sourcePos = self._positions;
            var headings = self._headings;
            var distances = self._distances;
            var pathOptions = self._pathOptions;
            var totalLength = self._totalLength;
            var mapMath = azmaps.math;
            if (progress === 1) {
                //Animation is done.
                pos = sourcePos[sourcePos.length - 1];
                heading = (headings.length > 0) ? headings[headings.length - 1] : undefined;
                if (pathOptions.map) {
                    self._setMapCamera(pos, heading, false);
                }
                Utils.setCoordinates(shape, pos, sourcePos);
            }
            else if (progress === 0) {
                pos = sourcePos[0];
                heading = (headings.length > 0) ? headings[0] : undefined;
                if (pathOptions.map) {
                    self._setMapCamera(pos, heading, false);
                }
                Utils.setCoordinates(shape, pos, [pos, pos]);
            }
            else {
                var dx = totalLength * progress;
                var positions = null;
                //Calculate the coordinate part way between the origin and destination.
                if (pathOptions.geodesic) {
                    if (dx > totalLength) {
                        heading = headings[headings.length - 1];
                        positions = sourcePos.slice(0);
                    }
                    else if (dx < 0) {
                        heading = headings[0];
                        positions = sourcePos.slice(0, 1);
                    }
                    else {
                        var travelled = 0;
                        for (var i = 0; i < distances.length; i++) {
                            if (travelled + distances[i] >= dx) {
                                heading = headings[i];
                                positions = sourcePos.slice(0, i + 1);
                                positions.push(mapMath.getDestination(sourcePos[i], heading, dx - travelled));
                                break;
                            }
                            else {
                                travelled += distances[i];
                            }
                        }
                    }
                }
                else {
                    var px = null;
                    var pixels = self._pixels;
                    if (dx > totalLength) {
                        heading = headings[headings.length - 1];
                        px = Utils.getPixelDestination(pixels[pixels.length - 1], heading, dx - totalLength);
                        positions = sourcePos.slice(0);
                        positions.push(mapMath.mercatorPixelsToPositions([px], 21)[0]);
                    }
                    else if (dx < 0) {
                        heading = headings[0];
                        px = Utils.getPixelDestination(pixels[0], heading, dx);
                        positions = sourcePos.slice(0, 1);
                        positions.push(mapMath.mercatorPixelsToPositions([px], 21)[0]);
                    }
                    else {
                        var travelled = 0;
                        for (var i = 0; i < distances.length; i++) {
                            if (travelled + distances[i] >= dx) {
                                heading = headings[i];
                                px = Utils.getPixelDestination(pixels[i], heading, dx - travelled);
                                positions = sourcePos.slice(0, i + 1);
                                positions.push(mapMath.mercatorPixelsToPositions([px], 21)[0]);
                                break;
                            }
                            else {
                                travelled += distances[i];
                            }
                        }
                    }
                }
                if (positions && positions.length > 0) {
                    pos = positions[positions.length - 1];
                    if (pathOptions.map) {
                        //Animate to the next view.
                        self._setMapCamera(pos, heading, positions.length > 2);
                    }
                    Utils.setCoordinates(shape, pos, positions);
                }
            }
            if (pathOptions.captureMetadata) {
                Utils.setMetadata(shape, { heading: heading });
            }
            return {
                position: pos,
                heading: heading
            };
        };
        return PathAnimation;
    }(MapPathPlayableAnaimation));

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var flubber_min = createCommonjsModule(function (module, exports) {
    !function(t,n){n(exports);}(commonjsGlobal,function(t){function n(t){return 10===t||13===t||8232===t||8233===t||32===t||9===t||11===t||12===t||160===t||t>=5760&&an.indexOf(t)>=0}function e(t){switch(32|t){case 109:case 122:case 108:case 104:case 118:case 99:case 115:case 113:case 116:case 97:case 114:return !0}return !1}function r(t){return t>=48&&t<=57}function i(t){return t>=48&&t<=57||43===t||45===t||46===t}function a(t){this.index=0,this.path=t,this.max=t.length,this.result=[],this.param=0,this.err="",this.segmentStart=0,this.data=[];}function o(t){for(;t.index<t.max&&n(t.path.charCodeAt(t.index));)t.index++;}function s(t){var n,e=t.index,i=e,a=t.max,o=!1,s=!1,h=!1,u=!1;if(i>=a)return void(t.err="SvgPath: missed param (at pos "+i+")");if(n=t.path.charCodeAt(i),43!==n&&45!==n||(i++,n=i<a?t.path.charCodeAt(i):0),!r(n)&&46!==n)return void(t.err="SvgPath: param should start with 0..9 or `.` (at pos "+i+")");if(46!==n){if(o=48===n,i++,n=i<a?t.path.charCodeAt(i):0,o&&i<a&&n&&r(n))return void(t.err="SvgPath: numbers started with `0` such as `09` are ilegal (at pos "+e+")");for(;i<a&&r(t.path.charCodeAt(i));)i++,s=!0;n=i<a?t.path.charCodeAt(i):0;}if(46===n){for(u=!0,i++;r(t.path.charCodeAt(i));)i++,h=!0;n=i<a?t.path.charCodeAt(i):0;}if(101===n||69===n){if(u&&!s&&!h)return void(t.err="SvgPath: invalid float exponent (at pos "+i+")");if(i++,n=i<a?t.path.charCodeAt(i):0,43!==n&&45!==n||i++,!(i<a&&r(t.path.charCodeAt(i))))return void(t.err="SvgPath: invalid float exponent (at pos "+i+")");for(;i<a&&r(t.path.charCodeAt(i));)i++;}t.index=i,t.param=parseFloat(t.path.slice(e,i))+0;}function h(t){var n,e;n=t.path[t.segmentStart],e=n.toLowerCase();var r=t.data;if("m"===e&&r.length>2&&(t.result.push([n,r[0],r[1]]),r=r.slice(2),e="l",n="m"===n?"l":"L"),"r"===e)t.result.push([n].concat(r));else for(;r.length>=rn[e]&&(t.result.push([n].concat(r.splice(0,rn[e]))),rn[e]););}function u(t){var n,r,a,u,c=t.max;if(t.segmentStart=t.index,n=t.path.charCodeAt(t.index),!e(n))return void(t.err="SvgPath: bad command "+t.path[t.index]+" (at pos "+t.index+")");if(a=rn[t.path[t.index].toLowerCase()],t.index++,o(t),t.data=[],!a)return void h(t);for(r=!1;;){for(u=a;u>0;u--){if(s(t),t.err.length)return;t.data.push(t.param),o(t),r=!1,t.index<c&&44===t.path.charCodeAt(t.index)&&(t.index++,o(t),r=!0);}if(!r){if(t.index>=t.max)break;if(!i(t.path.charCodeAt(t.index)))break}}h(t);}function c(t,n){return [t[0]*n[0]+t[2]*n[1],t[1]*n[0]+t[3]*n[1],t[0]*n[2]+t[2]*n[3],t[1]*n[2]+t[3]*n[3],t[0]*n[4]+t[2]*n[5]+t[4],t[1]*n[4]+t[3]*n[5]+t[5]]}function f(){if(!(this instanceof f))return new f;this.queue=[],this.cache=null;}function l(t,n,e,r){var i=t*r-n*e<0?-1:1,a=Math.sqrt(t*t+n*n),o=Math.sqrt(t*t+n*n),s=t*e+n*r,h=s/(a*o);return h>1&&(h=1),h<-1&&(h=-1),i*Math.acos(h)}function p(t,n,e,r,i,a,o,s,h,u){var c=u*(t-e)/2+h*(n-r)/2,f=-h*(t-e)/2+u*(n-r)/2,p=o*o,g=s*s,v=c*c,x=f*f,y=p*g-p*x-g*v;y<0&&(y=0),y/=p*x+g*v,y=Math.sqrt(y)*(i===a?-1:1);var d=y*o/s*f,m=y*-s/o*c,M=u*d-h*m+(t+e)/2,w=h*d+u*m+(n+r)/2,b=(c-d)/o,L=(f-m)/s,A=(-c-d)/o,q=(-f-m)/s,k=l(1,0,b,L),P=l(b,L,A,q);return 0===a&&P>0&&(P-=ln),1===a&&P<0&&(P+=ln),[M,w,k,P]}function g(t,n){var e=4/3*Math.tan(n/4),r=Math.cos(t),i=Math.sin(t),a=Math.cos(t+n),o=Math.sin(t+n);return [r,i,r-i*e,i+r*e,a+o*e,o-a*e,a,o]}function v(t,n,e){if(!(this instanceof v))return new v(t,n,e);this.rx=t,this.ry=n,this.ax=e;}function x(t){if(!(this instanceof x))return new x(t);var n=on(t);this.segments=n.segments,this.err=n.err,this.__stack=[];}function y(t){var n=t.match(wn);return n?n.map(Number):[]}function d(t,n,e,r,i,a,o,s){this.a={x:t,y:n},this.b={x:e,y:r},this.c={x:i,y:a},this.d={x:o,y:s},null!==o&&void 0!==o&&null!==s&&void 0!==s?(this.getArcLength=_,this.getPoint=L,this.getDerivative=M):(this.getArcLength=A,this.getPoint=b,this.getDerivative=m),this.init();}function m(t,n,e){return {x:2*(1-e)*(t[1]-t[0])+2*e*(t[2]-t[1]),y:2*(1-e)*(n[1]-n[0])+2*e*(n[2]-n[1])}}function M(t,n,e){return b([3*(t[1]-t[0]),3*(t[2]-t[1]),3*(t[3]-t[2])],[3*(n[1]-n[0]),3*(n[2]-n[1]),3*(n[3]-n[2])],e)}function w(t,n,e,r,i){for(var a=1,o=t/n,s=(t-e(r,i,o))/n;a>.001;){var h=e(r,i,o+s),u=e(r,i,o-s),c=Math.abs(t-h)/n,f=Math.abs(t-u)/n;c<a?(a=c,o+=s):f<a?(a=f,o-=s):s/=2;}return o}function b(t,n,e){return {x:(1-e)*(1-e)*t[0]+2*(1-e)*e*t[1]+e*e*t[2],y:(1-e)*(1-e)*n[0]+2*(1-e)*e*n[1]+e*e*n[2]}}function L(t,n,e){return {x:(1-e)*(1-e)*(1-e)*t[0]+3*(1-e)*(1-e)*e*t[1]+3*(1-e)*e*e*t[2]+e*e*e*t[3],y:(1-e)*(1-e)*(1-e)*n[0]+3*(1-e)*(1-e)*e*n[1]+3*(1-e)*e*e*n[2]+e*e*e*n[3]}}function A(t,n,e){void 0===e&&(e=1);var r=t[0]-2*t[1]+t[2],i=n[0]-2*n[1]+n[2],a=2*t[1]-2*t[0],o=2*n[1]-2*n[0],s=4*(r*r+i*i),h=4*(r*a+i*o),u=a*a+o*o;if(0===s)return e*Math.sqrt(Math.pow(t[2]-t[0],2)+Math.pow(n[2]-n[0],2));var c=h/(2*s),f=u/s,l=e+c,p=f-c*c;return Math.sqrt(s)/2*(l*Math.sqrt(l*l+p)-c*Math.sqrt(c*c+p)+p*Math.log(Math.abs((l+Math.sqrt(l*l+p))/(c+Math.sqrt(c*c+p)))))}function q(t,n){return qn[t][n]}function k(t,n,e){var r,i,a,o=e.length-1;if(0===o)return 0;if(0===t){for(i=0,a=0;a<=o;a++)i+=q(o,a)*Math.pow(1-n,o-a)*Math.pow(n,a)*e[a];return i}for(r=new Array(o),a=0;a<o;a++)r[a]=o*(e[a+1]-e[a]);return k(t-1,n,r)}function P(t,n,e){var r=k(1,e,t),i=k(1,e,n),a=r*r+i*i;return Math.sqrt(a)}function _(t,n,e){var r,i,a,o;void 0===e&&(e=1);for(r=e/2,i=0,a=0;a<20;a++)o=r*Ln[20][a]+r,i+=An[20][a]*P(t,n,o);return r*i}function E(t,n,e,r){var i=t*r-n*e<0?-1:1,a=t*e+n*r;return a>1&&(a=1),a<-1&&(a=-1),i*Math.acos(a)}function S(t,n,e,r,i,a,o,s,h,u){var c=u*(t-e)/2+h*(n-r)/2,f=-h*(t-e)/2+u*(n-r)/2,l=o*o,p=s*s,g=c*c,v=f*f,x=l*p-l*v-p*g;x<0&&(x=0),x/=l*v+p*g,x=Math.sqrt(x)*(i===a?-1:1);var y=x*o/s*f,d=x*-s/o*c,m=u*y-h*d+(t+e)/2,M=h*y+u*d+(n+r)/2,w=(c-y)/o,b=(f-d)/s,L=(-c-y)/o,A=(-f-d)/s,q=E(1,0,w,b),k=E(w,b,L,A);return 0===a&&k>0&&(k-=kn),1===a&&k<0&&(k+=kn),[m,M,q,k]}function C(t,n){var e=4/3*Math.tan(n/4),r=Math.cos(t),i=Math.sin(t),a=Math.cos(t+n),o=Math.sin(t+n);return [r,i,r-i*e,i+r*e,a+o*e,o-a*e,a,o]}function Z(t,n,e,r,i,a,o,s,h){var u=0,c=[],f=[];Pn(t,n,e,r,i,a,o,s,h).forEach(function(t){var n=new bn(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]),e=n.getTotalLength();u+=e,c.push(e),f.push(n);}),this.length=u,this.partialLengths=c,this.curves=f;}function T(t,n,e,r){this.x0=t,this.x1=n,this.y0=e,this.y1=r;}function F(t,n){return Math.sqrt((t[0]-n[0])*(t[0]-n[0])+(t[1]-n[1])*(t[1]-n[1]))}function z(t,n,e){return [t[0]+(n[0]-t[0])*e,t[1]+(n[1]-t[1])*e]}function j(t,n){return F(t,n)<1e-9}function I(t,n,e){var r=t.map(function(t,e){return V(t,n[e])});return function(t){var n=r.map(function(n){return n(t)});return e?H(n):n}}function V(t,n){return function(e){return t.map(function(t,r){return t+e*(n[r]-t)})}}function X(t){return "number"==typeof t&&isFinite(t)}function Y(t){return G(t)?nn(t):[(t[0][0]+t[t.length-1][0])/2,(t[0][1]+t[t.length-1][1])/2]}function G(t){for(var n=0;n<t.length-2;n++){var e=t[n],r=t[n+1],i=t[n+2];if(e[0]*(r[1]-i[1])+r[0]*(i[1]-e[1])+i[0]*(e[1]-r[1]))return !0}return !1}function O(t){return new yn(t).abs()}function D(t){return t.toString().split("M").map(function(t,n){return t=t.trim(),n&&t?"M"+t:t}).filter(function(t){return t})}function H(t){return "M"+t.join("L")+"Z"}function N(t){return D(O(t))}function Q(t,n){var e=O(t);return U(e)||R(e,n)}function U(t){var n=t.segments||[],e=[];if(!n.length||"M"!==n[0][0])return !1;for(var r=0;r<n.length;r++){var i=n[r],a=i[0],o=i[1],s=i[2];if("M"===a&&r||"Z"===a)break;if("M"===a||"L"===a)e.push([o,s]);else if("H"===a)e.push([o,e[e.length-1][1]]);else {if("V"!==a)return !1;e.push([e[e.length-1][0],o]);}}return !!e.length&&{ring:e}}function R(t,n){var e,r,i=D(t)[0],a=[],o=3;if(!i)throw new TypeError(Cn);r=B(i),e=r.getTotalLength(),n&&X(n)&&n>0&&(o=Math.max(o,Math.ceil(e/n)));for(var s=0;s<o;s++){var h=r.getPointAtLength(e*s/o);a.push([h.x,h.y]);}return {ring:a,skipBisect:!0}}function B(t){if("undefined"!=typeof window&&window&&window.document)try{var n=window.document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttributeNS(null,"d",t),n}catch(t){}return Sn(t)}function W(t,n){for(var e=t.length+n,r=en(t)/n,i=0,a=0,o=r/2;t.length<e;){var s=t[i],h=t[(i+1)%t.length],u=F(s,h);o<=a+u?(t.splice(i+1,0,u?z(s,h,(o-a)/u):s.slice(0)),o+=r):(a+=u,i++);}}function $(t,n){void 0===n&&(n=1/0);for(var e=0;e<t.length;e++)for(var r=t[e],i=e===t.length-1?t[0]:t[e+1];F(r,i)>n;)i=z(r,i,.5),t.splice(e+1,0,i);}function J(t,n){var e,r,i;if("string"==typeof t){var a=Q(t,n);t=a.ring,i=a.skipBisect;}else if(!Array.isArray(t))throw new TypeError(Cn);if(e=t.slice(0),!K(e))throw new TypeError(Cn);return e.length>1&&j(e[0],e[e.length-1])&&e.pop(),r=tn(e),r>0&&e.reverse(),!i&&n&&X(n)&&n>0&&$(e,n),e}function K(t){return t.every(function(t){return Array.isArray(t)&&t.length>=2&&X(t[0])&&X(t[1])})}function tt(t,n,e){var r;return r=t.length-n.length,W(t,r<0?-1*r:0),W(n,r>0?r:0),Tn(t,n),I(t,n,e)}function nt(t,n,e){e=e||2;var r=n&&n.length,i=r?n[0]*e:t.length,a=et(t,0,i,e,!0),o=[];if(!a)return o;var s,h,u,c,f,l,p;if(r&&(a=ut(t,n,a,e)),t.length>80*e){s=u=t[0],h=c=t[1];for(var g=e;g<i;g+=e)f=t[g],l=t[g+1],f<s&&(s=f),l<h&&(h=l),f>u&&(u=f),l>c&&(c=l);p=Math.max(u-s,c-h);}return it(a,o,e,s,h,p),o}function et(t,n,e,r,i){var a,o;if(i===Et(t,n,e,r)>0)for(a=n;a<e;a+=r)o=kt(a,t[a],t[a+1],o);else for(a=e-r;a>=n;a-=r)o=kt(a,t[a],t[a+1],o);return o&&Mt(o,o.next)&&(Pt(o),o=o.next),o}function rt(t,n){if(!t)return t;n||(n=t);var e,r=t;do{if(e=!1,r.steiner||!Mt(r,r.next)&&0!==mt(r.prev,r,r.next))r=r.next;else {if(Pt(r),(r=n=r.prev)===r.next)return null;e=!0;}}while(e||r!==n);return n}function it(t,n,e,r,i,a,o){if(t){!o&&a&&pt(t,r,i,a);for(var s,h,u=t;t.prev!==t.next;)if(s=t.prev,h=t.next,a?ot(t,r,i,a):at(t))n.push(s.i/e),n.push(t.i/e),n.push(h.i/e),Pt(t),t=h.next,u=h.next;else if((t=h)===u){o?1===o?(t=st(t,n,e),it(t,n,e,r,i,a,2)):2===o&&ht(t,n,e,r,i,a):it(rt(t),n,e,r,i,a,1);break}}}function at(t){var n=t.prev,e=t,r=t.next;if(mt(n,e,r)>=0)return !1;for(var i=t.next.next;i!==t.prev;){if(yt(n.x,n.y,e.x,e.y,r.x,r.y,i.x,i.y)&&mt(i.prev,i,i.next)>=0)return !1;i=i.next;}return !0}function ot(t,n,e,r){var i=t.prev,a=t,o=t.next;if(mt(i,a,o)>=0)return !1;for(var s=i.x<a.x?i.x<o.x?i.x:o.x:a.x<o.x?a.x:o.x,h=i.y<a.y?i.y<o.y?i.y:o.y:a.y<o.y?a.y:o.y,u=i.x>a.x?i.x>o.x?i.x:o.x:a.x>o.x?a.x:o.x,c=i.y>a.y?i.y>o.y?i.y:o.y:a.y>o.y?a.y:o.y,f=vt(s,h,n,e,r),l=vt(u,c,n,e,r),p=t.nextZ;p&&p.z<=l;){if(p!==t.prev&&p!==t.next&&yt(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&mt(p.prev,p,p.next)>=0)return !1;p=p.nextZ;}for(p=t.prevZ;p&&p.z>=f;){if(p!==t.prev&&p!==t.next&&yt(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&mt(p.prev,p,p.next)>=0)return !1;p=p.prevZ;}return !0}function st(t,n,e){var r=t;do{var i=r.prev,a=r.next.next;!Mt(i,a)&&wt(i,r,r.next,a)&&Lt(i,a)&&Lt(a,i)&&(n.push(i.i/e),n.push(r.i/e),n.push(a.i/e),Pt(r),Pt(r.next),r=t=a),r=r.next;}while(r!==t);return r}function ht(t,n,e,r,i,a){var o=t;do{for(var s=o.next.next;s!==o.prev;){if(o.i!==s.i&&dt(o,s)){var h=qt(o,s);return o=rt(o,o.next),h=rt(h,h.next),it(o,n,e,r,i,a),void it(h,n,e,r,i,a)}s=s.next;}o=o.next;}while(o!==t)}function ut(t,n,e,r){var i,a,o,s,h,u=[];for(i=0,a=n.length;i<a;i++)o=n[i]*r,s=i<a-1?n[i+1]*r:t.length,h=et(t,o,s,r,!1),h===h.next&&(h.steiner=!0),u.push(xt(h));for(u.sort(ct),i=0;i<u.length;i++)ft(u[i],e),e=rt(e,e.next);return e}function ct(t,n){return t.x-n.x}function ft(t,n){if(n=lt(t,n)){var e=qt(n,t);rt(e,e.next);}}function lt(t,n){var e,r=n,i=t.x,a=t.y,o=-1/0;do{if(a<=r.y&&a>=r.next.y){var s=r.x+(a-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(s<=i&&s>o){if(o=s,s===i){if(a===r.y)return r;if(a===r.next.y)return r.next}e=r.x<r.next.x?r:r.next;}}r=r.next;}while(r!==n);if(!e)return null;if(i===o)return e.prev;var h,u=e,c=e.x,f=e.y,l=1/0;for(r=e.next;r!==u;)i>=r.x&&r.x>=c&&yt(a<f?i:o,a,c,f,a<f?o:i,a,r.x,r.y)&&((h=Math.abs(a-r.y)/(i-r.x))<l||h===l&&r.x>e.x)&&Lt(r,t)&&(e=r,l=h),r=r.next;return e}function pt(t,n,e,r){var i=t;do{null===i.z&&(i.z=vt(i.x,i.y,n,e,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;}while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,gt(i);}function gt(t){var n,e,r,i,a,o,s,h,u=1;do{for(e=t,t=null,a=null,o=0;e;){for(o++,r=e,s=0,n=0;n<u&&(s++,r=r.nextZ);n++);for(h=u;s>0||h>0&&r;)0===s?(i=r,r=r.nextZ,h--):0!==h&&r?e.z<=r.z?(i=e,e=e.nextZ,s--):(i=r,r=r.nextZ,h--):(i=e,e=e.nextZ,s--),a?a.nextZ=i:t=i,i.prevZ=a,a=i;e=r;}a.nextZ=null,u*=2;}while(o>1);return t}function vt(t,n,e,r,i){return t=32767*(t-e)/i,n=32767*(n-r)/i,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),n=16711935&(n|n<<8),n=252645135&(n|n<<4),n=858993459&(n|n<<2),n=1431655765&(n|n<<1),t|n<<1}function xt(t){var n=t,e=t;do{n.x<e.x&&(e=n),n=n.next;}while(n!==t);return e}function yt(t,n,e,r,i,a,o,s){return (i-o)*(n-s)-(t-o)*(a-s)>=0&&(t-o)*(r-s)-(e-o)*(n-s)>=0&&(e-o)*(a-s)-(i-o)*(r-s)>=0}function dt(t,n){return t.next.i!==n.i&&t.prev.i!==n.i&&!bt(t,n)&&Lt(t,n)&&Lt(n,t)&&At(t,n)}function mt(t,n,e){return (n.y-t.y)*(e.x-n.x)-(n.x-t.x)*(e.y-n.y)}function Mt(t,n){return t.x===n.x&&t.y===n.y}function wt(t,n,e,r){return !!(Mt(t,n)&&Mt(e,r)||Mt(t,r)&&Mt(e,n))||mt(t,n,e)>0!=mt(t,n,r)>0&&mt(e,r,t)>0!=mt(e,r,n)>0}function bt(t,n){var e=t;do{if(e.i!==t.i&&e.next.i!==t.i&&e.i!==n.i&&e.next.i!==n.i&&wt(e,e.next,t,n))return !0;e=e.next;}while(e!==t);return !1}function Lt(t,n){return mt(t.prev,t,t.next)<0?mt(t,n,t.next)>=0&&mt(t,t.prev,n)>=0:mt(t,n,t.prev)<0||mt(t,t.next,n)<0}function At(t,n){var e=t,r=!1,i=(t.x+n.x)/2,a=(t.y+n.y)/2;do{e.y>a!=e.next.y>a&&i<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(r=!r),e=e.next;}while(e!==t);return r}function qt(t,n){var e=new _t(t.i,t.x,t.y),r=new _t(n.i,n.x,n.y),i=t.next,a=n.prev;return t.next=n,n.prev=t,e.next=i,i.prev=e,r.next=e,e.prev=r,a.next=r,r.prev=a,r}function kt(t,n,e,r){var i=new _t(t,n,e);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Pt(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ);}function _t(t,n,e){this.i=t,this.x=n,this.y=e,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1;}function Et(t,n,e,r){for(var i=0,a=n,o=e-r;a<e;a+=r)i+=(t[o]-t[a])*(t[a+1]+t[o+1]),o=a;return i}function St(t,n){var e=n.id,r=n.bbox,i=null==n.properties?{}:n.properties,a=Ct(t,n);return null==e&&null==r?{type:"Feature",properties:i,geometry:a}:null==r?{type:"Feature",id:e,properties:i,geometry:a}:{type:"Feature",id:e,bbox:r,properties:i,geometry:a}}function Ct(t,n){function e(t,n){n.length&&n.pop();for(var e=u[t<0?~t:t],r=0,i=e.length;r<i;++r)n.push(h(e[r],r));t<0&&Vn(n,i);}function r(t){return h(t)}function i(t){for(var n=[],r=0,i=t.length;r<i;++r)e(t[r],n);return n.length<2&&n.push(n[0]),n}function a(t){for(var n=i(t);n.length<4;)n.push(n[0]);return n}function o(t){return t.map(a)}function s(t){var n,e=t.type;switch(e){case"GeometryCollection":return {type:e,geometries:t.geometries.map(s)};case"Point":n=r(t.coordinates);break;case"MultiPoint":n=t.coordinates.map(r);break;case"LineString":n=i(t.arcs);break;case"MultiLineString":n=t.arcs.map(i);break;case"Polygon":n=o(t.arcs);break;case"MultiPolygon":n=t.arcs.map(o);break;default:return null}return {type:e,coordinates:n}}var h=In(t.transform),u=t.arcs;return s(n)}function Zt(t){for(var n,e=-1,r=t.length,i=t[r-1],a=0;++e<r;)n=i,i=t[e],a+=n[0]*i[1]-n[1]*i[0];return Math.abs(a)}function Tt(t,n){function e(t){switch(t.type){case"GeometryCollection":t.geometries.forEach(e);break;case"Polygon":r(t.arcs);break;case"MultiPolygon":t.arcs.forEach(r);}}function r(t){t.forEach(function(n){n.forEach(function(n){(a[n=n<0?~n:n]||(a[n]=[])).push(t);});}),o.push(t);}function i(n){return Zt(Ct(t,{type:"Polygon",arcs:[n]}).coordinates[0])}var a={},o=[],s=[];return n.forEach(e),o.forEach(function(t){if(!t._){var n=[],e=[t];for(t._=1,s.push(n);t=e.pop();)n.push(t),t.forEach(function(t){t.forEach(function(t){a[t<0?~t:t].forEach(function(t){t._||(t._=1,e.push(t));});});});}}),o.forEach(function(t){delete t._;}),{type:"MultiPolygon",arcs:s.map(function(n){var e,r=[];if(n.forEach(function(t){t.forEach(function(t){t.forEach(function(t){a[t<0?~t:t].length<2&&r.push(t);});});}),r=Yn(t,r),(e=r.length)>1)for(var o,s,h=1,u=i(r[0]);h<e;++h)(o=i(r[h]))>u&&(s=r[0],r[0]=r[h],r[h]=s,u=o);return r})}}function Ft(t){return function(n,e){return Dn(t(n),e)}}function zt(t,n){var e={},r={type:"Topology",objects:{triangles:{type:"GeometryCollection",geometries:[]}},arcs:[]};return t.forEach(function(t){var i=[];t.forEach(function(t,a){var o=t[0]<t[1]?t.join(","):t[1]+","+t[0],s=t.map(function(t){return n[t]});o in e?i.push(~e[o]):(i.push(e[o]=r.arcs.length),r.arcs.push(s));}),r.objects.triangles.geometries.push({type:"Polygon",area:Math.abs(tn(t.map(function(t){return n[t[0]]}))),arcs:[i]});}),r.objects.triangles.geometries.sort(function(t,n){return t.area-n.area}),r}function jt(t,n){for(var e=t.objects.triangles.geometries,r=Hn(function(t){return t.area}).left;e.length>n;)!function(){var n=e[0],i=On(e)[0][0],a=e[i],o=Tt(t,[n,a]);o.area=n.area+a.area,o.type="Polygon",o.arcs=o.arcs[0],e.splice(i,1),e.shift(),e.splice(r(e,o.area),0,o);}();if(n>e.length)throw new RangeError("Can't collapse topology into "+n+" pieces.");return Xn(t,t.objects.triangles).features.map(function(t){return t.geometry.coordinates[0].pop(),t.geometry.coordinates[0]})}function It(t){for(var n=zn(t.reduce(function(t,n){return t.concat([n[0]],[n[1]])},[])),e=[],r=0,i=n.length;r<i;r+=3)e.push([[n[r],n[r+1]],[n[r+1],n[r+2]],[n[r+2],n[r]]]);return e}function Vt(t,n,e){function r(t,n,o){void 0===n&&(n=[]),void 0===o&&(o=0);for(var s=0;s<t.length;s++){var h=t.splice(s,1),u=e[h[0]][n.length];o+u<i&&(t.length?r(t.slice(),n.concat(h),o+u):(i=o+u,a=n.concat(h))),t.length&&t.splice(s,0,h[0]);}}var i=1/0,a=t.map(function(t,n){return n});return r(a),a}function Xt(t,n){var e=F(Y(t),Y(n));return e*e}function Yt(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;void 0===a&&(a=!1);var o=J(t,r);o.length<n.length+2&&W(o,n.length+2-o.length);var s,h=Qn(o,n.length),u=n.map(function(t){return J(t,r)}),c="string"==typeof t&&t;return a&&!n.every(function(t){return "string"==typeof t})||(s=n.slice(0)),Dt(h,u,{match:!0,string:i,single:a,t0:c,t1:s})}function Gt(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;void 0===a&&(a=!1);var o=Yt(n,t,{maxSegmentLength:r,string:i,single:a});return a?function(t){return o(1-t)}:o.map(function(t){return function(n){return t(1-n)}})}function Ot(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;if(void 0===a&&(a=!1),!Array.isArray(t)||!Array.isArray(n)||t.length!==n.length||!t.length)throw new TypeError(Zn);var o,s,h=function(t){return J(t,r)},u=t.map(h),c=n.map(h);return a?(t.every(function(t){return "string"==typeof t})&&(o=t.slice(0)),n.every(function(t){return "string"==typeof t})&&(s=n.slice(0))):(o=t.slice(0),s=n.slice(0)),Dt(u,c,{string:i,single:a,t0:o,t1:s,match:!1})}function Dt(t,n,e){void 0===e&&(e={});var r=e.string,i=e.single,a=e.t0,o=e.t1,s=e.match,h=s?Un(t,n):t.map(function(t,n){return n}),u=h.map(function(e,i){return tt(t[e],n[i],r)});if(s&&Array.isArray(a)&&(a=h.map(function(t){return a[t]})),i&&r&&(Array.isArray(a)&&(a=a.join(" ")),Array.isArray(o)&&(o=o.join(" "))),i){var c=r?function(t){return u.map(function(n){return n(t)}).join(" ")}:function(t){return u.map(function(n){return n(t)})};return r&&(a||o)?function(t){return t<1e-4&&a||1-t<1e-4&&o||c(t)}:c}return r?(a=Array.isArray(a)?a.map(function(t){return "string"==typeof t&&t}):[],o=Array.isArray(o)?o.map(function(t){return "string"==typeof t&&t}):[],u.map(function(t,n){return a[n]||o[n]?function(e){return e<1e-4&&a[n]||1-e<1e-4&&o[n]||t(e)}:t})):u}function Ht(t,n,e,r,i){return Rt(Bt(t,n,e),r,Jt(t,n,e),2*Math.PI*e,i)}function Nt(t,n,e,r,i){var a=Ht(n,e,r,t,i);return function(t){return a(1-t)}}function Qt(t,n,e,r,i,a){return Rt(Wt(t,n,e,r),i,Kt(t,n,e,r),2*e+2*r,a)}function Ut(t,n,e,r,i,a){var o=Qt(n,e,r,i,t,a);return function(t){return o(1-t)}}function Rt(t,n,e,r,i){void 0===i&&(i={});var a=i.maxSegmentLength;void 0===a&&(a=10);var o=i.string;void 0===o&&(o=!0);var s,h,u=J(n,a);return X(r)&&u.length<r/a&&W(u,Math.ceil(r/a-u.length)),s=t(u),h=I(s,u,o),o?function(t){return t<1e-4?e:h(t)}:h}function Bt(t,n,e){return function(r){var i=Y(r),a=en(r.concat([r[0]])),o=Math.atan2(r[0][1]-i[1],r[0][0]-i[0]),s=0;return r.map(function(i,h){var u;return h&&(s+=F(i,r[h-1])),u=o+2*Math.PI*(a?s/a:h/r.length),[Math.cos(u)*e+t,Math.sin(u)*e+n]})}}function Wt(t,n,e,r){return function(i){var a=Y(i),o=en(i.concat([i[0]])),s=Math.atan2(i[0][1]-a[1],i[0][0]-a[0]),h=0;s<0&&(s=2*Math.PI+s);var u=s/(2*Math.PI);return i.map(function(a,s){s&&(h+=F(a,i[s-1]));var c=$t((u+(o?h/o:s/i.length))%1);return [t+c[0]*e,n+c[1]*r]})}}function $t(t){return t<=1/8?[1,.5+4*t]:t<=3/8?[1.5-4*t,1]:t<=5/8?[0,2.5-4*t]:t<=7/8?[4*t-2.5,0]:[1,4*t-3.5]}function Jt(t,n,e){var r=t-e+","+n,i=t+e+","+n,a="A"+e+","+e+",0,1,1,";return "M"+r+a+i+a+r+"Z"}function Kt(t,n,e,r){var i=t+e,a=n+r;return "M"+t+","+n+"L"+i+","+n+"L"+i+","+a+"L"+t+","+a+"Z"}var tn=function(t){for(var n,e=-1,r=t.length,i=t[r-1],a=0;++e<r;)n=i,i=t[e],a+=n[1]*i[0]-n[0]*i[1];return a/2},nn=function(t){for(var n,e,r=-1,i=t.length,a=0,o=0,s=t[i-1],h=0;++r<i;)n=s,s=t[r],h+=e=n[0]*s[1]-s[0]*n[1],a+=(n[0]+s[0])*e,o+=(n[1]+s[1])*e;return h*=3,[a/h,o/h]},en=function(t){for(var n,e,r=-1,i=t.length,a=t[i-1],o=a[0],s=a[1],h=0;++r<i;)n=o,e=s,a=t[r],o=a[0],s=a[1],n-=o,e-=s,h+=Math.sqrt(n*n+e*e);return h},rn={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},an=[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279],on=function(t){var n=new a(t),e=n.max;for(o(n);n.index<e&&!n.err.length;)u(n);return n.err.length?n.result=[]:n.result.length&&("mM".indexOf(n.result[0][0])<0?(n.err="SvgPath: string should start with `M` or `m`",n.result=[]):n.result[0][0]="M"),{err:n.err,segments:n.result}};f.prototype.matrix=function(t){return 1===t[0]&&0===t[1]&&0===t[2]&&1===t[3]&&0===t[4]&&0===t[5]?this:(this.cache=null,this.queue.push(t),this)},f.prototype.translate=function(t,n){return 0===t&&0===n||(this.cache=null,this.queue.push([1,0,0,1,t,n])),this},f.prototype.scale=function(t,n){return 1===t&&1===n||(this.cache=null,this.queue.push([t,0,0,n,0,0])),this},f.prototype.rotate=function(t,n,e){var r,i,a;return 0!==t&&(this.translate(n,e),r=t*Math.PI/180,i=Math.cos(r),a=Math.sin(r),this.queue.push([i,a,-a,i,0,0]),this.cache=null,this.translate(-n,-e)),this},f.prototype.skewX=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,0,Math.tan(t*Math.PI/180),1,0,0])),this},f.prototype.skewY=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,Math.tan(t*Math.PI/180),0,1,0,0])),this},f.prototype.toArray=function(){var t=this;if(this.cache)return this.cache;if(!this.queue.length)return this.cache=[1,0,0,1,0,0],this.cache;if(this.cache=this.queue[0],1===this.queue.length)return this.cache;for(var n=1;n<this.queue.length;n++)t.cache=c(t.cache,t.queue[n]);return this.cache},f.prototype.calc=function(t,n,e){var r;return this.queue.length?(this.cache||(this.cache=this.toArray()),r=this.cache,[t*r[0]+n*r[2]+(e?0:r[4]),t*r[1]+n*r[3]+(e?0:r[5])]):[t,n]};var sn=f,hn={matrix:!0,scale:!0,rotate:!0,translate:!0,skewX:!0,skewY:!0},un=/\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/,cn=/[\s,]+/,fn=function(t){var n,e,r=new sn;return t.split(un).forEach(function(t){if(t.length){if(void 0!==hn[t])return void(n=t);switch(e=t.split(cn).map(function(t){return +t||0}),n){case"matrix":return void(6===e.length&&r.matrix(e));case"scale":return void(1===e.length?r.scale(e[0],e[0]):2===e.length&&r.scale(e[0],e[1]));case"rotate":return void(1===e.length?r.rotate(e[0],0,0):3===e.length&&r.rotate(e[0],e[1],e[2]));case"translate":return void(1===e.length?r.translate(e[0],0):2===e.length&&r.translate(e[0],e[1]));case"skewX":return void(1===e.length&&r.skewX(e[0]));case"skewY":return void(1===e.length&&r.skewY(e[0]))}}}),r},ln=2*Math.PI,pn=function(t,n,e,r,i,a,o,s,h){var u=Math.sin(h*ln/360),c=Math.cos(h*ln/360),f=c*(t-e)/2+u*(n-r)/2,l=-u*(t-e)/2+c*(n-r)/2;if(0===f&&0===l)return [];if(0===o||0===s)return [];o=Math.abs(o),s=Math.abs(s);var v=f*f/(o*o)+l*l/(s*s);v>1&&(o*=Math.sqrt(v),s*=Math.sqrt(v));var x=p(t,n,e,r,i,a,o,s,u,c),y=[],d=x[2],m=x[3],M=Math.max(Math.ceil(Math.abs(m)/(ln/4)),1);m/=M;for(var w=0;w<M;w++)y.push(g(d,m)),d+=m;return y.map(function(t){for(var n=0;n<t.length;n+=2){var e=t[n+0],r=t[n+1];e*=o,r*=s;var i=c*e-u*r,a=u*e+c*r;t[n+0]=i+x[0],t[n+1]=a+x[1];}return t})},gn=Math.PI/180;v.prototype.transform=function(t){var n=Math.cos(this.ax*gn),e=Math.sin(this.ax*gn),r=[this.rx*(t[0]*n+t[2]*e),this.rx*(t[1]*n+t[3]*e),this.ry*(-t[0]*e+t[2]*n),this.ry*(-t[1]*e+t[3]*n)],i=r[0]*r[0]+r[2]*r[2],a=r[1]*r[1]+r[3]*r[3],o=((r[0]-r[3])*(r[0]-r[3])+(r[2]+r[1])*(r[2]+r[1]))*((r[0]+r[3])*(r[0]+r[3])+(r[2]-r[1])*(r[2]-r[1])),s=(i+a)/2;if(o<1e-10*s)return this.rx=this.ry=Math.sqrt(s),this.ax=0,this;var h=r[0]*r[1]+r[2]*r[3];o=Math.sqrt(o);var u=s+o/2,c=s-o/2;return this.ax=Math.abs(h)<1e-10&&Math.abs(u-a)<1e-10?90:180*Math.atan(Math.abs(h)>Math.abs(u-a)?(u-i)/h:h/(u-a))/Math.PI,this.ax>=0?(this.rx=Math.sqrt(u),this.ry=Math.sqrt(c)):(this.ax+=90,this.rx=Math.sqrt(c),this.ry=Math.sqrt(u)),this},v.prototype.isDegenerate=function(){return this.rx<1e-10*this.ry||this.ry<1e-10*this.rx};var vn=v;x.prototype.__matrix=function(t){var n,e=this;t.queue.length&&this.iterate(function(r,i,a,o){var s,h,u,c;switch(r[0]){case"v":s=t.calc(0,r[1],!0),h=0===s[0]?["v",s[1]]:["l",s[0],s[1]];break;case"V":s=t.calc(a,r[1],!1),h=s[0]===t.calc(a,o,!1)[0]?["V",s[1]]:["L",s[0],s[1]];break;case"h":s=t.calc(r[1],0,!0),h=0===s[1]?["h",s[0]]:["l",s[0],s[1]];break;case"H":s=t.calc(r[1],o,!1),h=s[1]===t.calc(a,o,!1)[1]?["H",s[0]]:["L",s[0],s[1]];break;case"a":case"A":var f=t.toArray(),l=vn(r[1],r[2],r[3]).transform(f);if(f[0]*f[3]-f[1]*f[2]<0&&(r[5]=r[5]?"0":"1"),s=t.calc(r[6],r[7],"a"===r[0]),"A"===r[0]&&r[6]===a&&r[7]===o||"a"===r[0]&&0===r[6]&&0===r[7]){h=["a"===r[0]?"l":"L",s[0],s[1]];break}h=l.isDegenerate()?["a"===r[0]?"l":"L",s[0],s[1]]:[r[0],l.rx,l.ry,l.ax,r[4],r[5],s[0],s[1]];break;case"m":c=i>0,s=t.calc(r[1],r[2],c),h=["m",s[0],s[1]];break;default:for(u=r[0],h=[u],c=u.toLowerCase()===u,n=1;n<r.length;n+=2)s=t.calc(r[n],r[n+1],c),h.push(s[0],s[1]);}e.segments[i]=h;},!0);},x.prototype.__evaluateStack=function(){var t,n,e=this;if(this.__stack.length){if(1===this.__stack.length)return this.__matrix(this.__stack[0]),void(this.__stack=[]);for(t=sn(),n=this.__stack.length;--n>=0;)t.matrix(e.__stack[n].toArray());this.__matrix(t),this.__stack=[];}},x.prototype.toString=function(){var t,n,e=this,r=[];this.__evaluateStack();for(var i=0;i<this.segments.length;i++)n=e.segments[i][0],t=i>0&&"m"!==n&&"M"!==n&&n===e.segments[i-1][0],r=r.concat(t?e.segments[i].slice(1):e.segments[i]);return r.join(" ").replace(/ ?([achlmqrstvz]) ?/gi,"$1").replace(/ \-/g,"-").replace(/zm/g,"z m")},x.prototype.translate=function(t,n){return this.__stack.push(sn().translate(t,n||0)),this},x.prototype.scale=function(t,n){return this.__stack.push(sn().scale(t,n||0===n?n:t)),this},x.prototype.rotate=function(t,n,e){return this.__stack.push(sn().rotate(t,n||0,e||0)),this},x.prototype.skewX=function(t){return this.__stack.push(sn().skewX(t)),this},x.prototype.skewY=function(t){return this.__stack.push(sn().skewY(t)),this},x.prototype.matrix=function(t){return this.__stack.push(sn().matrix(t)),this},x.prototype.transform=function(t){return t.trim()?(this.__stack.push(fn(t)),this):this},x.prototype.round=function(t){var n,e=0,r=0,i=0,a=0;return t=t||0,this.__evaluateStack(),this.segments.forEach(function(o){var s=o[0].toLowerCase()===o[0];switch(o[0]){case"H":case"h":return s&&(o[1]+=i),i=o[1]-o[1].toFixed(t),void(o[1]=+o[1].toFixed(t));case"V":case"v":return s&&(o[1]+=a),a=o[1]-o[1].toFixed(t),void(o[1]=+o[1].toFixed(t));case"Z":case"z":return i=e,void(a=r);case"M":case"m":return s&&(o[1]+=i,o[2]+=a),i=o[1]-o[1].toFixed(t),a=o[2]-o[2].toFixed(t),e=i,r=a,o[1]=+o[1].toFixed(t),void(o[2]=+o[2].toFixed(t));case"A":case"a":return s&&(o[6]+=i,o[7]+=a),i=o[6]-o[6].toFixed(t),a=o[7]-o[7].toFixed(t),o[1]=+o[1].toFixed(t),o[2]=+o[2].toFixed(t),o[3]=+o[3].toFixed(t+2),o[6]=+o[6].toFixed(t),void(o[7]=+o[7].toFixed(t));default:return n=o.length,s&&(o[n-2]+=i,o[n-1]+=a),i=o[n-2]-o[n-2].toFixed(t),a=o[n-1]-o[n-1].toFixed(t),void o.forEach(function(n,e){e&&(o[e]=+o[e].toFixed(t));})}}),this},x.prototype.iterate=function(t,n){var e,r,i,a=this.segments,o={},s=!1,h=0,u=0,c=0,f=0;if(n||this.__evaluateStack(),a.forEach(function(n,e){var r=t(n,e,h,u);Array.isArray(r)&&(o[e]=r,s=!0);var i=n[0]===n[0].toLowerCase();switch(n[0]){case"m":case"M":return h=n[1]+(i?h:0),u=n[2]+(i?u:0),c=h,void(f=u);case"h":case"H":return void(h=n[1]+(i?h:0));case"v":case"V":return void(u=n[1]+(i?u:0));case"z":case"Z":return h=c,void(u=f);default:h=n[n.length-2]+(i?h:0),u=n[n.length-1]+(i?u:0);}}),!s)return this;for(i=[],e=0;e<a.length;e++)if(void 0!==o[e])for(r=0;r<o[e].length;r++)i.push(o[e][r]);else i.push(a[e]);return this.segments=i,this},x.prototype.abs=function(){return this.iterate(function(t,n,e,r){var i,a=t[0],o=a.toUpperCase();if(a!==o)switch(t[0]=o,a){case"v":return void(t[1]+=r);case"a":return t[6]+=e,void(t[7]+=r);default:for(i=1;i<t.length;i++)t[i]+=i%2?e:r;}},!0),this},x.prototype.rel=function(){return this.iterate(function(t,n,e,r){var i,a=t[0],o=a.toLowerCase();if(a!==o&&(0!==n||"M"!==a))switch(t[0]=o,a){case"V":return void(t[1]-=r);case"A":return t[6]-=e,void(t[7]-=r);default:for(i=1;i<t.length;i++)t[i]-=i%2?e:r;}},!0),this},x.prototype.unarc=function(){return this.iterate(function(t,n,e,r){var i,a,o,s=[],h=t[0];return "A"!==h&&"a"!==h?null:("a"===h?(a=e+t[6],o=r+t[7]):(a=t[6],o=t[7]),i=pn(e,r,a,o,t[4],t[5],t[1],t[2],t[3]),0===i.length?[["a"===t[0]?"l":"L",t[6],t[7]]]:(i.forEach(function(t){s.push(["C",t[2],t[3],t[4],t[5],t[6],t[7]]);}),s))}),this},x.prototype.unshort=function(){var t,n,e,r,i,a=this.segments;return this.iterate(function(o,s,h,u){var c,f=o[0],l=f.toUpperCase();s&&("T"===l?(c="t"===f,e=a[s-1],"Q"===e[0]?(t=e[1]-h,n=e[2]-u):"q"===e[0]?(t=e[1]-e[3],n=e[2]-e[4]):(t=0,n=0),r=-t,i=-n,c||(r+=h,i+=u),a[s]=[c?"q":"Q",r,i,o[1],o[2]]):"S"===l&&(c="s"===f,e=a[s-1],"C"===e[0]?(t=e[3]-h,n=e[4]-u):"c"===e[0]?(t=e[3]-e[5],n=e[4]-e[6]):(t=0,n=0),r=-t,i=-n,c||(r+=h,i+=u),a[s]=[c?"c":"C",r,i,o[1],o[2],o[3],o[4]]));}),this};var xn=x,yn=xn,dn={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},mn=/([astvzqmhlc])([^astvzqmhlc]*)/gi,Mn=function(t){var n=[];return t.replace(mn,function(t,e,r){var i=e.toLowerCase();for(r=y(r),"m"===i&&r.length>2&&(n.push([e].concat(r.splice(0,2))),i="l",e="m"===e?"l":"L");r.length>=0;){if(r.length===dn[i])return r.unshift(e),n.push(r);if(r.length<dn[i])throw new Error("malformed path data");n.push([e].concat(r.splice(0,dn[i])));}}),n},wn=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi,bn=function(t,n,e,r,i,a,o,s){return new d(t,n,e,r,i,a,o,s)};d.prototype={constructor:d,init:function(){this.length=this.getArcLength([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]);},getTotalLength:function(){return this.length},getPointAtLength:function(t){var n=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]);return this.getPoint([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],n)},getTangentAtLength:function(t){var n=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]),e=this.getDerivative([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],n),r=Math.sqrt(e.x*e.x+e.y*e.y);return r>0?{x:e.x/r,y:e.y/r}:{x:0,y:0}},getPropertiesAtLength:function(t){var n,e=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]),r=this.getDerivative([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],e),i=Math.sqrt(r.x*r.x+r.y*r.y);n=i>0?{x:r.x/i,y:r.y/i}:{
    x:0,y:0};var a=this.getPoint([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],e);return {x:a.x,y:a.y,tangentX:n.x,tangentY:n.y}}};var Ln=[[],[],[-.5773502691896257,.5773502691896257],[0,-.7745966692414834,.7745966692414834],[-.33998104358485626,.33998104358485626,-.8611363115940526,.8611363115940526],[0,-.5384693101056831,.5384693101056831,-.906179845938664,.906179845938664],[.6612093864662645,-.6612093864662645,-.2386191860831969,.2386191860831969,-.932469514203152,.932469514203152],[0,.4058451513773972,-.4058451513773972,-.7415311855993945,.7415311855993945,-.9491079123427585,.9491079123427585],[-.1834346424956498,.1834346424956498,-.525532409916329,.525532409916329,-.7966664774136267,.7966664774136267,-.9602898564975363,.9602898564975363],[0,-.8360311073266358,.8360311073266358,-.9681602395076261,.9681602395076261,-.3242534234038089,.3242534234038089,-.6133714327005904,.6133714327005904],[-.14887433898163122,.14887433898163122,-.4333953941292472,.4333953941292472,-.6794095682990244,.6794095682990244,-.8650633666889845,.8650633666889845,-.9739065285171717,.9739065285171717],[0,-.26954315595234496,.26954315595234496,-.5190961292068118,.5190961292068118,-.7301520055740494,.7301520055740494,-.8870625997680953,.8870625997680953,-.978228658146057,.978228658146057],[-.1252334085114689,.1252334085114689,-.3678314989981802,.3678314989981802,-.5873179542866175,.5873179542866175,-.7699026741943047,.7699026741943047,-.9041172563704749,.9041172563704749,-.9815606342467192,.9815606342467192],[0,-.2304583159551348,.2304583159551348,-.44849275103644687,.44849275103644687,-.6423493394403402,.6423493394403402,-.8015780907333099,.8015780907333099,-.9175983992229779,.9175983992229779,-.9841830547185881,.9841830547185881],[-.10805494870734367,.10805494870734367,-.31911236892788974,.31911236892788974,-.5152486363581541,.5152486363581541,-.6872929048116855,.6872929048116855,-.827201315069765,.827201315069765,-.9284348836635735,.9284348836635735,-.9862838086968123,.9862838086968123],[0,-.20119409399743451,.20119409399743451,-.3941513470775634,.3941513470775634,-.5709721726085388,.5709721726085388,-.7244177313601701,.7244177313601701,-.8482065834104272,.8482065834104272,-.937273392400706,.937273392400706,-.9879925180204854,.9879925180204854],[-.09501250983763744,.09501250983763744,-.2816035507792589,.2816035507792589,-.45801677765722737,.45801677765722737,-.6178762444026438,.6178762444026438,-.755404408355003,.755404408355003,-.8656312023878318,.8656312023878318,-.9445750230732326,.9445750230732326,-.9894009349916499,.9894009349916499],[0,-.17848418149584785,.17848418149584785,-.3512317634538763,.3512317634538763,-.5126905370864769,.5126905370864769,-.6576711592166907,.6576711592166907,-.7815140038968014,.7815140038968014,-.8802391537269859,.8802391537269859,-.9506755217687678,.9506755217687678,-.9905754753144174,.9905754753144174],[-.0847750130417353,.0847750130417353,-.2518862256915055,.2518862256915055,-.41175116146284263,.41175116146284263,-.5597708310739475,.5597708310739475,-.6916870430603532,.6916870430603532,-.8037049589725231,.8037049589725231,-.8926024664975557,.8926024664975557,-.9558239495713977,.9558239495713977,-.9915651684209309,.9915651684209309],[0,-.16035864564022537,.16035864564022537,-.31656409996362983,.31656409996362983,-.46457074137596094,.46457074137596094,-.600545304661681,.600545304661681,-.7209661773352294,.7209661773352294,-.8227146565371428,.8227146565371428,-.9031559036148179,.9031559036148179,-.96020815213483,.96020815213483,-.9924068438435844,.9924068438435844],[-.07652652113349734,.07652652113349734,-.22778585114164507,.22778585114164507,-.37370608871541955,.37370608871541955,-.5108670019508271,.5108670019508271,-.636053680726515,.636053680726515,-.7463319064601508,.7463319064601508,-.8391169718222188,.8391169718222188,-.912234428251326,.912234428251326,-.9639719272779138,.9639719272779138,-.9931285991850949,.9931285991850949],[0,-.1455618541608951,.1455618541608951,-.2880213168024011,.2880213168024011,-.4243421202074388,.4243421202074388,-.5516188358872198,.5516188358872198,-.6671388041974123,.6671388041974123,-.7684399634756779,.7684399634756779,-.8533633645833173,.8533633645833173,-.9200993341504008,.9200993341504008,-.9672268385663063,.9672268385663063,-.9937521706203895,.9937521706203895],[-.06973927331972223,.06973927331972223,-.20786042668822127,.20786042668822127,-.34193582089208424,.34193582089208424,-.469355837986757,.469355837986757,-.5876404035069116,.5876404035069116,-.6944872631866827,.6944872631866827,-.7878168059792081,.7878168059792081,-.8658125777203002,.8658125777203002,-.926956772187174,.926956772187174,-.9700604978354287,.9700604978354287,-.9942945854823992,.9942945854823992],[0,-.1332568242984661,.1332568242984661,-.26413568097034495,.26413568097034495,-.3903010380302908,.3903010380302908,-.5095014778460075,.5095014778460075,-.6196098757636461,.6196098757636461,-.7186613631319502,.7186613631319502,-.8048884016188399,.8048884016188399,-.8767523582704416,.8767523582704416,-.9329710868260161,.9329710868260161,-.9725424712181152,.9725424712181152,-.9947693349975522,.9947693349975522],[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213]],An=[[],[],[1,1],[.8888888888888888,.5555555555555556,.5555555555555556],[.6521451548625461,.6521451548625461,.34785484513745385,.34785484513745385],[.5688888888888889,.47862867049936647,.47862867049936647,.23692688505618908,.23692688505618908],[.3607615730481386,.3607615730481386,.46791393457269104,.46791393457269104,.17132449237917036,.17132449237917036],[.4179591836734694,.3818300505051189,.3818300505051189,.27970539148927664,.27970539148927664,.1294849661688697,.1294849661688697],[.362683783378362,.362683783378362,.31370664587788727,.31370664587788727,.22238103445337448,.22238103445337448,.10122853629037626,.10122853629037626],[.3302393550012598,.1806481606948574,.1806481606948574,.08127438836157441,.08127438836157441,.31234707704000286,.31234707704000286,.26061069640293544,.26061069640293544],[.29552422471475287,.29552422471475287,.26926671930999635,.26926671930999635,.21908636251598204,.21908636251598204,.1494513491505806,.1494513491505806,.06667134430868814,.06667134430868814],[.2729250867779006,.26280454451024665,.26280454451024665,.23319376459199048,.23319376459199048,.18629021092773426,.18629021092773426,.1255803694649046,.1255803694649046,.05566856711617366,.05566856711617366],[.24914704581340277,.24914704581340277,.2334925365383548,.2334925365383548,.20316742672306592,.20316742672306592,.16007832854334622,.16007832854334622,.10693932599531843,.10693932599531843,.04717533638651183,.04717533638651183],[.2325515532308739,.22628318026289723,.22628318026289723,.2078160475368885,.2078160475368885,.17814598076194574,.17814598076194574,.13887351021978725,.13887351021978725,.09212149983772845,.09212149983772845,.04048400476531588,.04048400476531588],[.2152638534631578,.2152638534631578,.2051984637212956,.2051984637212956,.18553839747793782,.18553839747793782,.15720316715819355,.15720316715819355,.12151857068790319,.12151857068790319,.08015808715976021,.08015808715976021,.03511946033175186,.03511946033175186],[.2025782419255613,.19843148532711158,.19843148532711158,.1861610000155622,.1861610000155622,.16626920581699392,.16626920581699392,.13957067792615432,.13957067792615432,.10715922046717194,.10715922046717194,.07036604748810812,.07036604748810812,.03075324199611727,.03075324199611727],[.1894506104550685,.1894506104550685,.18260341504492358,.18260341504492358,.16915651939500254,.16915651939500254,.14959598881657674,.14959598881657674,.12462897125553388,.12462897125553388,.09515851168249279,.09515851168249279,.062253523938647894,.062253523938647894,.027152459411754096,.027152459411754096],[.17944647035620653,.17656270536699264,.17656270536699264,.16800410215645004,.16800410215645004,.15404576107681028,.15404576107681028,.13513636846852548,.13513636846852548,.11188384719340397,.11188384719340397,.08503614831717918,.08503614831717918,.0554595293739872,.0554595293739872,.02414830286854793,.02414830286854793],[.1691423829631436,.1691423829631436,.16427648374583273,.16427648374583273,.15468467512626524,.15468467512626524,.14064291467065065,.14064291467065065,.12255520671147846,.12255520671147846,.10094204410628717,.10094204410628717,.07642573025488905,.07642573025488905,.0497145488949698,.0497145488949698,.02161601352648331,.02161601352648331],[.1610544498487837,.15896884339395434,.15896884339395434,.15276604206585967,.15276604206585967,.1426067021736066,.1426067021736066,.12875396253933621,.12875396253933621,.11156664554733399,.11156664554733399,.09149002162245,.09149002162245,.06904454273764123,.06904454273764123,.0448142267656996,.0448142267656996,.019461788229726478,.019461788229726478],[.15275338713072584,.15275338713072584,.14917298647260374,.14917298647260374,.14209610931838204,.14209610931838204,.13168863844917664,.13168863844917664,.11819453196151841,.11819453196151841,.10193011981724044,.10193011981724044,.08327674157670475,.08327674157670475,.06267204833410907,.06267204833410907,.04060142980038694,.04060142980038694,.017614007139152118,.017614007139152118],[.14608113364969041,.14452440398997005,.14452440398997005,.13988739479107315,.13988739479107315,.13226893863333747,.13226893863333747,.12183141605372853,.12183141605372853,.10879729916714838,.10879729916714838,.09344442345603386,.09344442345603386,.0761001136283793,.0761001136283793,.057134425426857205,.057134425426857205,.036953789770852494,.036953789770852494,.016017228257774335,.016017228257774335],[.13925187285563198,.13925187285563198,.13654149834601517,.13654149834601517,.13117350478706238,.13117350478706238,.12325237681051242,.12325237681051242,.11293229608053922,.11293229608053922,.10041414444288096,.10041414444288096,.08594160621706773,.08594160621706773,.06979646842452049,.06979646842452049,.052293335152683286,.052293335152683286,.03377490158481415,.03377490158481415,.0146279952982722,.0146279952982722],[.13365457218610619,.1324620394046966,.1324620394046966,.12890572218808216,.12890572218808216,.12304908430672953,.12304908430672953,.11499664022241136,.11499664022241136,.10489209146454141,.10489209146454141,.09291576606003515,.09291576606003515,.07928141177671895,.07928141177671895,.06423242140852585,.06423242140852585,.04803767173108467,.04803767173108467,.030988005856979445,.030988005856979445,.013411859487141771,.013411859487141771],[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872]],qn=[[1],[1,1],[1,2,1],[1,3,3,1]],kn=2*Math.PI,Pn=function(t,n,e,r,i,a,o,s,h){var u=Math.sin(i*kn/360),c=Math.cos(i*kn/360),f=c*(t-s)/2+u*(n-h)/2,l=-u*(t-s)/2+c*(n-h)/2;if(0===f&&0===l)return [];if(0===e||0===r)return [];e=Math.abs(e),r=Math.abs(r);var p=f*f/(e*e)+l*l/(r*r);p>1&&(e*=Math.sqrt(p),r*=Math.sqrt(p));var g=S(t,n,s,h,a,o,e,r,u,c),v=[],x=g[2],y=g[3],d=Math.max(Math.ceil(Math.abs(y)/(kn/4)),1);y/=d;for(var m=0;m<d;m++)v.push(C(x,y)),x+=y;return v.map(function(t){for(var n=0;n<t.length;n+=2){var i=t[n+0],a=t[n+1];i*=e,a*=r;var o=c*i-u*a,s=u*i+c*a;t[n+0]=o+g[0],t[n+1]=s+g[1];}return t})},_n=function(t,n,e,r,i,a,o,s,h){return new Z(t,n,e,r,i,a,o,s,h)};Z.prototype={constructor:Z,init:function(){},getTotalLength:function(){return this.length},getPointAtLength:function(t){var n=this;t<0?t=0:t>this.length&&(t=this.length);for(var e=this.partialLengths.length-1;this.partialLengths[e]>=t&&this.partialLengths[e]>0;)e--;e<this.partialLengths.length-1&&e++;for(var r=0,i=0;i<e;i++)r+=n.partialLengths[i];return this.curves[e].getPointAtLength(t-r)},getTangentAtLength:function(t){var n=this;t<0?t=0:t>this.length&&(t=this.length);for(var e=this.partialLengths.length-1;this.partialLengths[e]>=t&&this.partialLengths[e]>0;)e--;e<this.partialLengths.length-1&&e++;for(var r=0,i=0;i<e;i++)r+=n.partialLengths[i];return this.curves[e].getTangentAtLength(t-r)},getPropertiesAtLength:function(t){var n=this.getTangentAtLength(t),e=this.getPointAtLength(t);return {x:e.x,y:e.y,tangentX:n.x,tangentY:n.y}}};var En=function(t,n,e,r){return new T(t,n,e,r)};T.prototype.getTotalLength=function(){return Math.sqrt(Math.pow(this.x0-this.x1,2)+Math.pow(this.y0-this.y1,2))},T.prototype.getPointAtLength=function(t){var n=t/Math.sqrt(Math.pow(this.x0-this.x1,2)+Math.pow(this.y0-this.y1,2)),e=(this.x1-this.x0)*n,r=(this.y1-this.y0)*n;return {x:this.x0+e,y:this.y0+r}},T.prototype.getTangentAtLength=function(){var t=Math.sqrt((this.x1-this.x0)*(this.x1-this.x0)+(this.y1-this.y0)*(this.y1-this.y0));return {x:(this.x1-this.x0)/t,y:(this.y1-this.y0)/t}},T.prototype.getPropertiesAtLength=function(t){var n=this.getPointAtLength(t),e=this.getTangentAtLength();return {x:n.x,y:n.y,tangentX:e.x,tangentY:e.y}};var Sn=function(t){function n(t){if(!t)return null;for(var a,o=Mn(t),s=[0,0],h=[0,0],u=0;u<o.length;u++)"M"===o[u][0]?(s=[o[u][1],o[u][2]],i.push(null)):"m"===o[u][0]?(s=[o[u][1]+s[0],o[u][2]+s[1]],i.push(null)):"L"===o[u][0]?(e+=Math.sqrt(Math.pow(s[0]-o[u][1],2)+Math.pow(s[1]-o[u][2],2)),i.push(new En(s[0],o[u][1],s[1],o[u][2])),s=[o[u][1],o[u][2]]):"l"===o[u][0]?(e+=Math.sqrt(Math.pow(o[u][1],2)+Math.pow(o[u][2],2)),i.push(new En(s[0],o[u][1]+s[0],s[1],o[u][2]+s[1])),s=[o[u][1]+s[0],o[u][2]+s[1]]):"H"===o[u][0]?(e+=Math.abs(s[0]-o[u][1]),i.push(new En(s[0],o[u][1],s[1],s[1])),s[0]=o[u][1]):"h"===o[u][0]?(e+=Math.abs(o[u][1]),i.push(new En(s[0],s[0]+o[u][1],s[1],s[1])),s[0]=o[u][1]+s[0]):"V"===o[u][0]?(e+=Math.abs(s[1]-o[u][1]),i.push(new En(s[0],s[0],s[1],o[u][1])),s[1]=o[u][1]):"v"===o[u][0]?(e+=Math.abs(o[u][1]),i.push(new En(s[0],s[0],s[1],s[1]+o[u][1])),s[1]=o[u][1]+s[1]):"z"===o[u][0]||"Z"===o[u][0]?(e+=Math.sqrt(Math.pow(o[0][1]-s[0],2)+Math.pow(o[0][2]-s[1],2)),i.push(new En(s[0],o[0][1],s[1],o[0][2])),s=[o[0][1],o[0][2]]):"C"===o[u][0]?(a=new bn(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],o[u][6]),e+=a.getTotalLength(),s=[o[u][5],o[u][6]],i.push(a)):"c"===o[u][0]?(a=new bn(s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4],s[0]+o[u][5],s[1]+o[u][6]),e+=a.getTotalLength(),s=[o[u][5]+s[0],o[u][6]+s[1]],i.push(a)):"S"===o[u][0]?(a=u>0&&["C","c","S","s"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-o[u-1][o[u-1].length-4],2*s[1]-o[u-1][o[u-1].length-3],o[u][1],o[u][2],o[u][3],o[u][4]):new bn(s[0],s[1],s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4]),e+=a.getTotalLength(),s=[o[u][3],o[u][4]],i.push(a)):"s"===o[u][0]?(a=u>0&&["C","c","S","s"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],s[0]+a.d.x-a.c.x,s[1]+a.d.y-a.c.y,s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]):new bn(s[0],s[1],s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]),e+=a.getTotalLength(),s=[o[u][3]+s[0],o[u][4]+s[1]],i.push(a)):"Q"===o[u][0]?(a=new bn(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4]),e+=a.getTotalLength(),i.push(a),s=[o[u][3],o[u][4]],h=[o[u][1],o[u][2]]):"q"===o[u][0]?(a=new bn(s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]),e+=a.getTotalLength(),h=[s[0]+o[u][1],s[1]+o[u][2]],s=[o[u][3]+s[0],o[u][4]+s[1]],i.push(a)):"T"===o[u][0]?(a=u>0&&["Q","q","T","t"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-h[0],2*s[1]-h[1],o[u][1],o[u][2]):new En(s[0],o[u][1],s[1],o[u][2]),i.push(a),e+=a.getTotalLength(),h=[2*s[0]-h[0],2*s[1]-h[1]],s=[o[u][1],o[u][2]]):"t"===o[u][0]?(a=u>0&&["Q","q","T","t"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-h[0],2*s[1]-h[1],s[0]+o[u][1],s[1]+o[u][2]):new En(s[0],s[0]+o[u][1],s[1],s[1]+o[u][2]),e+=a.getTotalLength(),h=[2*s[0]-h[0],2*s[1]-h[1]],s=[o[u][1]+s[0],o[u][2]+s[0]],i.push(a)):"A"===o[u][0]?(a=new _n(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],o[u][6],o[u][7]),e+=a.getTotalLength(),s=[o[u][6],o[u][7]],i.push(a)):"a"===o[u][0]&&(a=new _n(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],s[0]+o[u][6],s[1]+o[u][7]),e+=a.getTotalLength(),s=[s[0]+o[u][6],s[1]+o[u][7]],i.push(a)),r.push(e);return n}var e=0,r=[],i=[];n.getTotalLength=function(){return e},n.getPointAtLength=function(t){var n=a(t);return i[n.i].getPointAtLength(n.fraction)},n.getTangentAtLength=function(t){var n=a(t);return i[n.i].getTangentAtLength(n.fraction)},n.getPropertiesAtLength=function(t){var n=a(t);return i[n.i].getPropertiesAtLength(n.fraction)};var a=function(t){t<0?t=0:t>e&&(t=e);for(var n=r.length-1;r[n]>=t&&r[n]>0;)n--;return n++,{fraction:t-r[n-1],i:n}};return n(t)},Cn='All shapes must be supplied as arrays of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).\nExample valid ways of supplying a shape would be:\n[[0, 0], [10, 0], [10, 10]]\n"M0,0 L10,0 L10,10Z"\n',Zn="flubber.all() expects two arrays of equal length as arguments. Each element in both arrays should be an array of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).",Tn=function(t,n){for(var e,r,i,a=t.length,o=1/0,s=0;s<a;s++)!function(i){r=0,n.forEach(function(n,e){var o=F(t[(i+e)%a],n);r+=o*o;}),r<o&&(o=r,e=i);}(s);e&&(i=t.splice(0,e),t.splice.apply(t,[t.length,0].concat(i)));},Fn=function(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=J(t,r),o=J(n,r),s=tt(a,o,i);return !i||"string"!=typeof t&&"string"!=typeof n?s:function(e){return e<1e-4&&"string"==typeof t?t:1-e<1e-4&&"string"==typeof n?n:s(e)}},zn=nt;nt.deviation=function(t,n,e,r){var i=n&&n.length,a=i?n[0]*e:t.length,o=Math.abs(Et(t,0,a,e));if(i)for(var s=0,h=n.length;s<h;s++){var u=n[s]*e,c=s<h-1?n[s+1]*e:t.length;o-=Math.abs(Et(t,u,c,e));}var f=0;for(s=0;s<r.length;s+=3){var l=r[s]*e,p=r[s+1]*e,g=r[s+2]*e;f+=Math.abs((t[l]-t[g])*(t[p+1]-t[l+1])-(t[l]-t[p])*(t[g+1]-t[l+1]));}return 0===o&&0===f?0:Math.abs((f-o)/o)},nt.flatten=function(t){for(var n=t[0][0].length,e={vertices:[],holes:[],dimensions:n},r=0,i=0;i<t.length;i++){for(var a=0;a<t[i].length;a++)for(var o=0;o<n;o++)e.vertices.push(t[i][a][o]);i>0&&(r+=t[i-1].length,e.holes.push(r));}return e};var jn=function(t){return t},In=function(t){if(null==t)return jn;var n,e,r=t.scale[0],i=t.scale[1],a=t.translate[0],o=t.translate[1];return function(t,s){s||(n=e=0);var h=2,u=t.length,c=new Array(u);for(c[0]=(n+=t[0])*r+a,c[1]=(e+=t[1])*i+o;h<u;)c[h]=t[h],++h;return c}},Vn=function(t,n){for(var e,r=t.length,i=r-n;i<--r;)e=t[i],t[i++]=t[r],t[r]=e;},Xn=function(t,n){return "GeometryCollection"===n.type?{type:"FeatureCollection",features:n.geometries.map(function(n){return St(t,n)})}:St(t,n)},Yn=function(t,n){function e(n){var e,r=t.arcs[n<0?~n:n],i=r[0];return t.transform?(e=[0,0],r.forEach(function(t){e[0]+=t[0],e[1]+=t[1];})):e=r[r.length-1],n<0?[e,i]:[i,e]}function r(t,n){for(var e in t){var r=t[e];delete n[r.start],delete r.start,delete r.end,r.forEach(function(t){i[t<0?~t:t]=1;}),s.push(r);}}var i={},a={},o={},s=[],h=-1;return n.forEach(function(e,r){var i,a=t.arcs[e<0?~e:e];a.length<3&&!a[1][0]&&!a[1][1]&&(i=n[++h],n[h]=e,n[r]=i);}),n.forEach(function(t){var n,r,i=e(t),s=i[0],h=i[1];if(n=o[s])if(delete o[n.end],n.push(t),n.end=h,r=a[h]){delete a[r.start];var u=r===n?n:n.concat(r);a[u.start=n.start]=o[u.end=r.end]=u;}else a[n.start]=o[n.end]=n;else if(n=a[h])if(delete a[n.start],n.unshift(t),n.start=s,r=o[s]){delete o[r.end];var c=r===n?n:r.concat(n);a[c.start=r.start]=o[c.end=n.end]=c;}else a[n.start]=o[n.end]=n;else n=[t],a[n.start=s]=o[n.end=h]=n;}),r(o,a),r(a,o),n.forEach(function(t){i[t<0?~t:t]||s.push([t]);}),s},Gn=function(t,n){for(var e=0,r=t.length;e<r;){var i=e+r>>>1;t[i]<n?e=i+1:r=i;}return e},On=function(t){function n(t,n){t.forEach(function(t){t<0&&(t=~t);var e=i[t];e?e.push(n):i[t]=[n];});}function e(t,e){t.forEach(function(t){n(t,e);});}function r(t,n){"GeometryCollection"===t.type?t.geometries.forEach(function(t){r(t,n);}):t.type in o&&o[t.type](t.arcs,n);}var i={},a=t.map(function(){return []}),o={LineString:n,MultiLineString:e,Polygon:e,MultiPolygon:function(t,n){t.forEach(function(t){e(t,n);});}};t.forEach(r);for(var s in i)for(var h=i[s],u=h.length,c=0;c<u;++c)for(var f=c+1;f<u;++f){var l,p=h[c],g=h[f];(l=a[p])[s=Gn(l,g)]!==g&&l.splice(s,0,g),(l=a[g])[s=Gn(l,p)]!==p&&l.splice(s,0,p);}return a},Dn=function(t,n){return t<n?-1:t>n?1:t>=n?0:NaN},Hn=function(t){return 1===t.length&&(t=Ft(t)),{left:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var a=r+i>>>1;t(n[a],e)<0?r=a+1:i=a;}return r},right:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var a=r+i>>>1;t(n[a],e)>0?i=a:r=a+1;}return r}}},Nn=Hn(Dn),Qn=(function(t,n){return jt(zt(It(t),t),n)}),Un=function(t,n){if(t.length>8)return t.map(function(t,n){return n});var e=t.map(function(t){return n.map(function(n){return Xt(t,n)})});return Vt(t,n,e)};t.interpolate=Fn,t.separate=Yt,t.combine=Gt,t.interpolateAll=Ot,t.splitPathString=N,t.toPathString=H,t.fromCircle=Ht,t.toCircle=Nt,t.fromRect=Qt,t.toRect=Ut,Object.defineProperty(t,"__esModule",{value:!0});});
    });

    var flubber = unwrapExports(flubber_min);

    var RingInterpolator = /** @class */ (function () {
        function RingInterpolator(fromRing, toRing) {
            //If positions arrays are identical, don't use interpolate progress as it may add artifacts.
            var areEqual = true;
            if (fromRing.length !== toRing.length) {
                areEqual = false;
            }
            if (areEqual) {
                fromRing.forEach(function (val, idx) {
                    areEqual = areEqual && azmaps.data.Position.areEqual(val, toRing[idx]);
                });
            }
            if (areEqual) {
                this._constPos = toRing;
            }
            else {
                this._interp = flubber.interpolate(fromRing, toRing, {
                    string: false
                });
            }
        }
        RingInterpolator.prototype.interpolate = function (progress) {
            var self = this;
            if (self._constPos) {
                return self._constPos;
            }
            return self._interp(progress);
        };
        return RingInterpolator;
    }());

    var SimpleGeometryInterpolator = /** @class */ (function () {
        function SimpleGeometryInterpolator(fromGeometry, toGeometry) {
            this._interps = [];
            this._areSame = false;
            var self = this;
            if (fromGeometry.type === 'MultiPolygon') {
                throw 'Only simple geometries supported.';
            }
            self._fromGeom = fromGeometry;
            self._toGeom = toGeometry;
            self._areSame = (fromGeometry.type === toGeometry.type && JSON.parse(JSON.stringify(fromGeometry.coordinates)) === JSON.parse(JSON.stringify(toGeometry.coordinates)));
            self._initInterps();
        }
        SimpleGeometryInterpolator.prototype.interpolate = function (progress) {
            var self = this;
            var fg = self._fromGeom;
            var tg = self._toGeom;
            if (self._areSame) {
                return tg;
            }
            if (progress === 0) {
                return fg;
            }
            else if (progress === 1) {
                return tg;
            }
            var fgPos = fg.coordinates;
            var tgPos = tg.coordinates;
            var c = self._runInterps(progress);
            var g = { type: tg.type };
            switch (tg.type) {
                case 'Point':
                    //If morphing to a point, keep the from shape for as long a possible.
                    if (fg.type === 'LineString' ||
                        fg.type === 'MultiPoint') {
                        //Grab sample points.
                        g = {
                            type: fg.type,
                            coordinates: self._sampleMultiPoint(c, fgPos.length)
                        };
                    }
                    else if (fg.type === 'Polygon' ||
                        fg.type === 'MultiLineString') {
                        g = {
                            type: fg.type,
                            coordinates: c
                        };
                    }
                    else {
                        g.coordinates = c[0][0];
                    }
                    break;
                case 'LineString':
                    //Remove extra points when transitioning from a polygon.
                    if (fg.type === 'Polygon' && fgPos.length > tgPos.length) {
                        var numRemove = Math.floor(c[0].length / (tgPos.length - 1));
                        for (var i = numRemove; i >= 0; i--) {
                            c[0].pop();
                        }
                    }
                    g.coordinates = c[0];
                    break;
                case 'MultiPoint':
                    //If morphing to a MultiPoint, keep the from shape for as long a possible.
                    if (fg.type === 'Point') {
                        //Grab sample points.                   
                        g.coordinates = self._sampleMultiPoint(c, tgPos.length);
                    }
                    else if (fg.type !== 'MultiPoint') {
                        g = {
                            type: fg.type,
                            coordinates: (fg.type === 'LineString') ? c[0] : c
                        };
                    }
                    else {
                        g.coordinates = c[0];
                    }
                    break;
                case 'Polygon':
                case 'MultiLineString':
                    g.coordinates = c;
                    break;
            }
            return g;
        };
        SimpleGeometryInterpolator.prototype._initInterps = function () {
            var self = this;
            var fg = self._fromGeom;
            var tg = self._toGeom;
            if (!self._areSame && fg && fg.coordinates.length > 0 &&
                tg && tg.coordinates.length > 0) {
                var fgPos = fg.coordinates;
                var tgPos = tg.coordinates;
                var fromCoords = [];
                var toCoords = [];
                switch (fg.type) {
                    case 'Point':
                        var fc = fgPos;
                        fromCoords = [[fc, fc, fc]];
                        break;
                    case 'LineString':
                    case 'MultiPoint':
                        var fc2 = fgPos;
                        fromCoords = [fc2];
                        break;
                    case 'Polygon':
                    case 'MultiLineString':
                        if (typeof fgPos[0] === 'number') {
                            fromCoords = [fgPos];
                        }
                        else {
                            fromCoords = fgPos;
                        }
                        break;
                }
                switch (tg.type) {
                    case 'Point':
                        var tc = tgPos;
                        toCoords = [[tc, tc, tc]];
                        break;
                    case 'LineString':
                    case 'MultiPoint':
                        var tc2 = tgPos;
                        toCoords = [tc2];
                        break;
                    case 'Polygon':
                    case 'MultiLineString':
                        if (typeof tgPos[0] === 'number') {
                            toCoords = [tgPos];
                        }
                        else {
                            toCoords = tgPos;
                        }
                        break;
                }
                var i = void 0;
                var len = toCoords.length;
                //Fill gap of geometries transitioning from.
                if (fromCoords.length < toCoords.length) {
                    for (i = fromCoords.length; i < len; i++) {
                        fromCoords.push([fromCoords[0][0], fromCoords[0][0], fromCoords[0][0]]);
                    }
                }
                for (i = 0; i < len; i++) {
                    self._interps.push(new RingInterpolator(fromCoords[i], toCoords[i]));
                }
            }
        };
        SimpleGeometryInterpolator.prototype._runInterps = function (progress) {
            var c = [];
            var interps = this._interps;
            for (var i = 0; i < interps.length; i++) {
                c.push(interps[i].interpolate(progress));
            }
            return c;
        };
        SimpleGeometryInterpolator.prototype._sampleMultiPoint = function (c, targetSize) {
            var step = Math.min(Math.ceil(c[0].length / targetSize), targetSize);
            var p = [];
            for (var i = 0; i < targetSize; i++) {
                p.push(c[0][i * step]);
            }
            return p;
        };
        return SimpleGeometryInterpolator;
    }());

    var GeometryInterpolator = /** @class */ (function () {
        function GeometryInterpolator(fromGeometry, toGeometry) {
            this._interps = [];
            var self = this;
            self._fromGeom = fromGeometry;
            self._toGeom = toGeometry;
            self._initInterps();
        }
        GeometryInterpolator.prototype.interpolate = function (progress) {
            var self = this;
            var toGeom = self._toGeom;
            var interps = self._interps;
            if (progress === 0) {
                return self._fromGeom;
            }
            else if (progress === 1) {
                return toGeom;
            }
            if (toGeom.type === 'MultiPolygon') {
                var c_1 = [];
                interps.forEach(function (interpolator) {
                    c_1.push(interpolator.interpolate(progress).coordinates);
                });
                return {
                    type: 'MultiPolygon',
                    coordinates: c_1
                };
            }
            else if (toGeom.type === 'GeometryCollection') {
                var geoms_1 = [];
                interps.forEach(function (interpolator) {
                    geoms_1.push(interpolator.interpolate(progress));
                });
                //@ts-ignore.
                return {
                    type: 'GeometryCollection',
                    geometries: geoms_1
                };
            }
            return interps[0].interpolate(progress);
        };
        GeometryInterpolator.prototype._initInterps = function () {
            var self = this;
            var fromGeoms = [];
            var toGeoms = [];
            self._extractGeoms(self._fromGeom, fromGeoms);
            self._extractGeoms(self._toGeom, toGeoms);
            //Fill gap of geometries transitioning from.
            if (fromGeoms.length < toGeoms.length) {
                if (fromGeoms.length > 0) {
                    var c = azmaps.data.BoundingBox.getCenter(azmaps.data.BoundingBox.fromData(fromGeoms[0]));
                    var fillGeom = {
                        type: fromGeoms[0].type,
                        coordinates: []
                    };
                    switch (fromGeoms[0].type) {
                        case 'Point':
                            fillGeom.coordinates = c;
                            break;
                        case 'LineString':
                        case 'MultiPoint':
                            fillGeom.coordinates = [c, c];
                            break;
                        case 'MultiLineString':
                        case 'Polygon':
                            fillGeom.coordinates = [[c, c, c]];
                            break;
                    }
                    //Transitioning "from" less geometries to more, expand from a point near the center of the "from" geometry and expand to the "to" geometry.
                    for (var i = fromGeoms.length, len = toGeoms.length; i < len; i++) {
                        fromGeoms.push(fillGeom);
                    }
                }
            }
            //Crate interpolators
            for (var i = 0; i < toGeoms.length; i++) {
                self._interps.push(new SimpleGeometryInterpolator(fromGeoms[i], toGeoms[i]));
            }
        };
        GeometryInterpolator.prototype._extractGeoms = function (geom, targetArray) {
            var _this = this;
            switch (geom.type) {
                case 'MultiPolygon':
                    geom.coordinates.forEach(function (p) {
                        targetArray.push({
                            type: 'Polygon',
                            coordinates: p
                        });
                    });
                    break;
                case 'GeometryCollection':
                    //@ts-ignore
                    geom.geometries.forEach(function (g) {
                        _this._extractGeoms(g, targetArray);
                    });
                    break;
                default:
                    targetArray.push(geom);
                    break;
            }
        };
        return GeometryInterpolator;
    }());

    /** Animates the morphing of a shape from one geometry type or set of coordinates to another. */
    var MorphShapeAnimation = /** @class */ (function (_super) {
        __extends(MorphShapeAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        function MorphShapeAnimation(shape, newGeometry, options) {
            var _this = _super.call(this) || this;
            var self = _this;
            var bbox = azmaps.data.BoundingBox;
            self._shape = shape;
            var g = shape.toJson().geometry;
            //For circles, if the new geometry is not a point, then pass in a polygon of the circle.
            if (shape.isCircle() && newGeometry.type !== 'Point') {
                g = new azmaps.data.Polygon(shape.getCircleCoordinates());
            }
            self._interp = new GeometryInterpolator(shape.toJson().geometry, newGeometry);
            var lastCenter = bbox.getCenter(self._shape.getBounds());
            var newCenter = bbox.getCenter(bbox.fromData(newGeometry));
            self._heading = azmaps.math.getHeading(lastCenter, newCenter);
            var pixels = azmaps.math.mercatorPositionsToPixels([lastCenter, newCenter], 21);
            self._pixelHeading = Utils.getPixelHeading(pixels[0], pixels[1]);
            if (options) {
                self.setOptions(options);
                if (options.autoPlay) {
                    self.play();
                }
            }
            AnimationManager.instance.add(self);
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        MorphShapeAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var bbox = azmaps.data.BoundingBox;
            var g = self._interp.interpolate(progress);
            var newCenter = bbox.getCenter(bbox.fromData(g));
            var heading = 0;
            if (self._pathOptions.geodesic) {
                heading = self._heading;
            }
            else {
                heading = self._pixelHeading;
            }
            if (self._pathOptions.map) {
                self._setMapCamera(newCenter, heading, true);
            }
            var s = self._shape;
            if (self._pathOptions.captureMetadata) {
                s.addProperty('heading', heading);
            }
            //If shape is a circle and geometry is a Point, just set coordinates.
            if (s.isCircle() && g.type === 'Point') {
                s.setCoordinates(g.coordinates);
            }
            else {
                //TODO: Update with supported function in future.
                s['data'].geometry.type = g.type;
                s.setCoordinates(g.coordinates);
            }
            return {
                position: newCenter,
                heading: heading
            };
        };
        return MorphShapeAnimation;
    }(MapPathPlayableAnaimation));

    /** A simple animation class that can replace the logic of setTimeout and setInterval. */
    var SimpleIntervalAnimation = /** @class */ (function () {
        /**
         * A simple animation class that can replace the logic of setTimeout and setInterval.
         * @param intervalCallback The callback function for each interval.
         * @param delay The interval time in ms.
         * @param numberOfIOntervals The number of intervals.
         * @param arguments Any additional arguments to pass to the callback function.
         */
        function SimpleIntervalAnimation(intervalCallback, delay, numberOfIOntervals) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            this._delay = 1;
            this._numberOfInv = Infinity;
            this._currentInterval = 0;
            var self = this;
            self._id = AnimationManager.instance.add(self);
            self._intervalCb = intervalCallback;
            self._arguments = args;
            if (delay >= 0) {
                self._delay = delay;
            }
            if (numberOfIOntervals > 0) {
                self._numberOfInv = numberOfIOntervals;
            }
        }
        /** Disposes the animation. */
        SimpleIntervalAnimation.prototype.dispose = function () {
            var self = this;
            AnimationManager.instance.remove(self);
            Object.keys(self).forEach(function (k) {
                self[k] = undefined;
            });
        };
        /** Gets the duration of the animation. Returns Infinity if the animations loops forever. */
        SimpleIntervalAnimation.prototype.getDuration = function () {
            return this._numberOfInv * this._delay;
        };
        /** Checks to see if the animaiton is playing.  */
        SimpleIntervalAnimation.prototype.isPlaying = function () {
            return this._start != null;
        };
        /** Pauses the animation. */
        SimpleIntervalAnimation.prototype.pause = function () {
            this._start = null;
        };
        /** Plays the animation. */
        SimpleIntervalAnimation.prototype.play = function () {
            this._start = performance.now();
        };
        /** Stops the animation and resets the interval back to 0. */
        SimpleIntervalAnimation.prototype.reset = function () {
            this._start = null;
            this._currentInterval = 0;
        };
        /** Stops the animation and jumps to the last interval. */
        SimpleIntervalAnimation.prototype.stop = function () {
            var self = this;
            self._start = null;
            self._currentInterval = self._numberOfInv;
        };
        SimpleIntervalAnimation.prototype._onAnimationProgress = function (timestamp) {
            var self = this;
            if (self._start) {
                var intervalIdx = Math.round((timestamp - self._start) / self._delay);
                if (intervalIdx !== self._currentInterval) {
                    self._currentInterval = intervalIdx;
                    if (self._intervalCb) {
                        //Call setTimeout without any time, so that it calls the callback function asynchronously.
                        setTimeout(self._intervalCb, 0, self._arguments);
                    }
                    if (intervalIdx >= self._numberOfInv) {
                        self._start = null;
                        if (self._onComplete) {
                            self._onComplete();
                            self.dispose();
                        }
                    }
                }
            }
        };
        return SimpleIntervalAnimation;
    }());

    /** Animates a map and/or a Point shape along a route path. The movement will vary based on timestamps within the point feature properties. */
    var RoutePathAnimation = /** @class */ (function (_super) {
        __extends(RoutePathAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        function RoutePathAnimation(route, shape, options) {
            var _this = _super.call(this) || this;
            var self = _this;
            self._shape = shape;
            self._route = route;
            self.setOptions(Object.assign({
                rotate: true,
                rotationOffset: 0
            }, options || {}));
            if (options && options.autoPlay) {
                self.play();
            }
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        /** Disposes the animation. */
        RoutePathAnimation.prototype.dispose = function () {
            var self = this;
            self._route = null;
            self._headingInv = null;
            self._positions = null;
            self._timestamps = null;
            self._timeInv = null;
            self._totalTime = null;
            self._shape = null;
            _super.prototype.dispose.call(this);
        };
        /** Gets the duration of the animation. Returns Infinity if the animations loops forever. */
        RoutePathAnimation.prototype.getDuration = function () {
            var self = this;
            if (typeof self._totalTime !== 'undefined') {
                return self._totalTime / self._pathOptions.speedMultiplier;
            }
            return _super.prototype.getDuration.call(this);
        };
        /** Gets the animation options. */
        RoutePathAnimation.prototype.getOptions = function () {
            return Object.assign({}, _super.prototype.getOptions.call(this), {
                valueInterpolations: this._valueInterps
            });
        };
        /** Sets the options of the animation. */
        RoutePathAnimation.prototype.setOptions = function (options) {
            if (options) {
                var self_1 = this;
                if (options.valueInterpolations && Array.isArray(options.valueInterpolations)) {
                    self_1._positions = null;
                    self_1._valueInterps = options.valueInterpolations;
                }
                _super.prototype.setOptions.call(this, options);
                var isPlaying = self_1.isPlaying();
                if (isPlaying) {
                    self_1.pause();
                }
                if (!self_1._positions) {
                    self_1._processPath();
                    if (self_1._pathOptions.captureMetadata) {
                        if (self_1._headingInv.length > 0) {
                            Utils.setMetadata(self_1._shape, {
                                heading: self_1._headingInv[0],
                                speed: self_1._speedInv[0],
                                timestamp: self_1._timestamps[0]
                            });
                        }
                    }
                }
                if (isPlaying) {
                    self_1.play();
                }
            }
        };
        /** Gets the time span of the animation. */
        RoutePathAnimation.prototype.getTimeSpan = function () {
            var timestamps = this._timestamps;
            if (timestamps.length > 0) {
                return {
                    begin: timestamps[0],
                    end: timestamps[timestamps.length - 1]
                };
            }
            return null;
        };
        /** Gets the positions that form the route path. */
        RoutePathAnimation.prototype.getPath = function () {
            return JSON.parse(JSON.stringify(this._positions));
        };
        /**
         * Callback function that contains the animation frame logic.
         * @param progress The progress of the animation where 0 is start and 1 is the end.
         */
        RoutePathAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            var sourcePos = self._positions;
            if (sourcePos && sourcePos.length > 1) {
                var state = {};
                var idx_1 = 0;
                var props = void 0;
                var offset_1 = 0;
                var shape = self._shape;
                var pathOptions = self._pathOptions;
                var headings = self._headingInv;
                var speeds = self._speedInv;
                var timestamps = self._timestamps;
                var route_1 = self._route;
                if (progress === 1) {
                    //Animation is done.
                    idx_1 = headings.length - 1;
                    state = {
                        position: sourcePos[idx_1 + 1],
                        heading: headings[idx_1],
                        speed: speeds[idx_1],
                        timestamp: timestamps[idx_1 + 1]
                    };
                    if (pathOptions.map) {
                        self._setMapCamera(state.position, state.heading, false);
                    }
                    Utils.setCoordinates(shape, state.position, sourcePos);
                    props = route_1[idx_1].properties;
                    offset_1 = 1;
                }
                else if (progress === 0) {
                    idx_1 = 0;
                    state = {
                        position: sourcePos[0],
                        heading: headings[0],
                        speed: speeds[0],
                        timestamp: timestamps[0]
                    };
                    if (pathOptions.map) {
                        self._setMapCamera(state.position, state.heading, false);
                    }
                    Utils.setCoordinates(shape, state.position, [state.position, state.position]);
                    props = route_1[0].properties;
                }
                else {
                    var dt = self._totalTime * progress;
                    var pos = null;
                    //Calculate the coordinate part way between the origin and destination.
                    if (dt > self._totalTime) {
                        idx_1 = headings.length - 1;
                        state = {
                            heading: headings[idx_1],
                            speed: speeds[idx_1],
                            timestamp: timestamps[idx_1 + 1]
                        };
                        pos = sourcePos.slice(0);
                        props = route_1[idx_1 + 1].properties;
                        offset_1 = 1;
                    }
                    else if (dt < 0) {
                        state.heading = headings[0];
                        pos = sourcePos.slice(0, 1);
                    }
                    else {
                        var ellapsed = 0;
                        var ti = self._timeInv;
                        for (idx_1 = 0; idx_1 < headings.length; idx_1++) {
                            if (ellapsed + ti[idx_1] >= dt) {
                                state.heading = headings[idx_1];
                                state.speed = speeds[idx_1];
                                pos = sourcePos.slice(0, idx_1 + 1);
                                //Time in ms remaining that forms sub-path.
                                var dt2 = dt - ellapsed;
                                //Distance travelled based on average speed. Note that dt2 is in ms and speed is in m/s, thus the conversion to seconds.
                                var dx = speeds[idx_1] * dt2 * 0.001;
                                //Get the offset distance from the last known point.
                                offset_1 = dx / azmaps.math.getDistanceTo(sourcePos[idx_1], sourcePos[idx_1 + 1]);
                                state.timestamp = timestamps[idx_1] + dt2;
                                pos.push(azmaps.math.getDestination(sourcePos[idx_1], state.heading, dx));
                                break;
                            }
                            else {
                                ellapsed += ti[idx_1];
                            }
                        }
                    }
                    if (pos && pos.length > 0) {
                        state.position = pos[pos.length - 1];
                        if (pathOptions.map) {
                            //Animate to the next view.
                            self._setMapCamera(state.position, state.heading, pos.length > 2);
                        }
                        Utils.setCoordinates(shape, state.position, pos);
                    }
                }
                state = Object.assign(props || {}, state);
                if (pathOptions.captureMetadata) {
                    var obj_1 = {};
                    var vi = self._valueInterps;
                    if (vi && Array.isArray(vi)) {
                        vi.forEach(function (vi) {
                            Utils.interpolateValue(route_1[idx_1], route_1[idx_1 + 1], offset_1, vi, obj_1);
                        });
                    }
                    Utils.setMetadata(shape, Object.assign(state, obj_1));
                }
                return state;
            }
            return null;
        };
        /**************************
        * Private Methods
        ***************************/
        RoutePathAnimation.prototype._processPath = function () {
            var self = this;
            var r = self._route;
            if (r) {
                self._totalTime = 0;
                self._positions = null;
                var positions = [];
                var headingIntervals = [];
                var speedIntervals = [];
                var timeIntervals = [];
                var timestamps = [];
                var mapMath = azmaps.math;
                var f = r[0];
                if (f.type === 'Feature' && f.geometry.type === 'Point' && typeof f.properties._timestamp === 'number') {
                    timestamps.push(f.properties._timestamp);
                    positions.push(f.geometry.coordinates);
                    for (var i = 1, len = r.length; i < len; i++) {
                        f = r[i];
                        if (f.type === 'Feature' && f.geometry.type === 'Point' && typeof f.properties._timestamp === 'number') {
                            positions.push(f.geometry.coordinates);
                            var d = mapMath.getDistanceTo(positions[i - 1], positions[i]);
                            timestamps.push(f.properties._timestamp);
                            var dt = timestamps[i] - timestamps[i - 1];
                            timeIntervals.push(dt);
                            self._totalTime += dt;
                            //Get speed in meters per second. Convert time from ms to seconds.
                            speedIntervals.push(d / (dt * 0.001));
                            var h = mapMath.getHeading(positions[i - 1], positions[i]);
                            headingIntervals.push(h);
                        }
                    }
                }
                else {
                    throw 'Feature is not a point or is missing a _timestamp value.';
                }
                if (r.length !== positions.length) {
                    self.dispose();
                    throw 'Unable to process all points in route.';
                }
                self._headingInv = headingIntervals;
                self._speedInv = speedIntervals;
                self._timeInv = timeIntervals;
                self._timestamps = timestamps;
                self._positions = positions;
                _super.prototype.setOptions.call(this, { duration: self._totalTime });
            }
        };
        return RoutePathAnimation;
    }(MapPathPlayableAnaimation));

    /** Animates the opacity of a feature. */
    var OpacityAnimation = /** @class */ (function (_super) {
        __extends(OpacityAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * Animates the opacity of a feature.
         * @param shapes An array shapes or HtmlMarkers to animatie opacity.
         * @param initialOpacity The initial opacity of the shape. Default: `0`
         * @param finalOpacity The final opacity of the shape. Default: `1`
         * @param options Options for the animation.
         */
        function OpacityAnimation(shapes, initialOpacity, finalOpacity, options) {
            var _this = _super.call(this, options) || this;
            initialOpacity = initialOpacity || 0;
            finalOpacity = finalOpacity || 1;
            if (initialOpacity > finalOpacity) {
                var t = finalOpacity;
                finalOpacity = initialOpacity;
                initialOpacity = t;
            }
            _this._minOpacity = initialOpacity;
            _this._opacityWidth = finalOpacity - initialOpacity;
            if (shapes && shapes.length > 0) {
                var self_1 = _this;
                self_1._shapes = shapes;
                //Extract the offsets for each shape.
                shapes.forEach(function (s) {
                    s.setProperties(Object.assign(s.getProperties(), {
                        opacity: initialOpacity
                    }));
                });
                if (options && options.autoPlay) {
                    self_1.play();
                }
            }
            else {
                throw 'No shape specified for animation.';
            }
            return _this;
        }
        /**************************
        * Public Methods
        ***************************/
        OpacityAnimation.prototype.onAnimationProgress = function (progress) {
            var self = this;
            self._shapes.forEach(function (s) {
                s.setProperties(Object.assign(s.getProperties(), {
                    opacity: self._minOpacity + self._opacityWidth * progress
                }));
            });
            return null;
        };
        return OpacityAnimation;
    }(PlayableAnimation));

    /**
     * Adds an offset array property to point shapes and animates it's y value to simulate dropping.
     * Use with a symbol layer with the icon/text offset property set to ['get', 'offset'] and the opacity set to ['get', 'opacity'].
     * @param shapes A one or more point geometries or shapes to drop in.
     * @param datasource The data source to drop the point shapes into.
     * @param height The height at which to drop the shape from. Default: 1000 pixels
     * @param options Options for the animation.
     */
    function drop(shapes, dataSource, height, options) {
        var s = [];
        if (Array.isArray(shapes)) {
            for (var i = 0, len = shapes.length; i < len; i++) {
                if ((shapes[i]['type'] === 'Feature' && shapes[i]['geometry']['type'] === 'Point') || shapes[i]['type'] === 'Point') {
                    s.push(new azmaps.Shape(shapes[i]));
                }
                else if (shapes[i] instanceof azmaps.Shape && shapes[i].getType() === 'Point') {
                    s.push(shapes[i]);
                }
            }
        }
        else if ((shapes['type'] === 'Feature' && shapes['geometry']['type'] === 'Point') || shapes['type'] === 'Point') {
            s.push(new azmaps.Shape(shapes));
        }
        else if (shapes instanceof azmaps.Shape && shapes.getType() === 'Point') {
            s.push(shapes);
        }
        if (s.length > 0) {
            return new DropAnimation(s, dataSource, height, options);
        }
        throw 'No supported shapes specified.';
    }
    /**
     * Adds an offset to HtmlMarkers to animate it's y value to simulate dropping. Animation modifies `pixelOffset` value of HtmlMarkers.
     * @param markers A one or more HtmlMarkers to drop in.
     * @param map The map to drop the markers into.
     * @param height The height at which to drop the shape from. Default: 1000 pixels
     * @param options Options for the animation.
     */
    function dropMarkers(markers, map, height, options) {
        var s = [];
        if (Array.isArray(markers)) {
            for (var i = 0, len = markers.length; i < len; i++) {
                if (markers[i] instanceof azmaps.HtmlMarker) {
                    s.push(markers[i]);
                }
            }
        }
        else if (markers instanceof azmaps.HtmlMarker) {
            s.push(markers);
        }
        if (s.length > 0) {
            return new DropAnimation(s, map, height, options);
        }
        throw 'No markers specified.';
    }
    /**
     * Animates the update of coordinates on a shape or HtmlMarker. Shapes will stay the same type. Only base animation options supported for geometries other than Point.
     * @param shape The shape to animate.
     * @param newCoordinates The new coordinates of the shape. Must be the same dimension as required by the shape or suitable subset will be picked.
     * @param options Options for the animation.
     */
    function setCoordinates(shape, newCoordinates, options) {
        var c = Utils.getSuitableCoordinates(shape, newCoordinates);
        if (shape instanceof azmaps.Shape) {
            var t = shape.getType();
            if (t === 'Point') {
                return new PointTranslateAnimation(shape, c, options);
            }
            else if (t !== 'GeometryCollection') {
                return new MorphShapeAnimation(shape, {
                    type: shape.getType(),
                    coordinates: c
                }, options);
            }
        }
        return new PointTranslateAnimation(shape, c, options);
    }
    /**
     * Animates the path of a LineString.
     * @param shape A LineString shape to animate.
     * @param options Options for the animation.
     */
    function snakeline(shape, options) {
        if (shape && shape.getType() === 'LineString') {
            return new PathAnimation(shape.getCoordinates().slice(0), shape, options);
        }
        throw 'Specified shape is not a LineString type, or no map specified.';
    }
    /**
     * Animates a map and/or a Point shape, or marker along a path.
     * @param path The path to animate the point along. Must be either an array of positions, or a LineString geometry/shape.
     * @param shape A Point shape or marker to animate along the path.
     * @param options Options for the animation.
     */
    function moveAlongPath(path, shape, options) {
        if ((shape && (shape instanceof azmaps.HtmlMarker || (shape instanceof azmaps.Shape && shape.getType() === 'Point'))) || (options && options['map'])) {
            var p = void 0;
            if (path) {
                if (Array.isArray(path)) {
                    //Must be an array of positions.
                    p = path;
                }
                else if (path instanceof azmaps.Shape) {
                    if (path.getType() === 'LineString') {
                        p = path.getCoordinates();
                    }
                    else if (path.getType() === 'Polygon') {
                        var c = path.getCoordinates();
                        if (c.length > 0) {
                            p = c[0];
                        }
                    }
                }
                else if (path.type === 'LineString') {
                    p = path.coordinates;
                }
            }
            if (p.length < 2) {
                throw 'Invalid path option specified.';
            }
            return new PathAnimation(p, shape, options);
        }
        throw 'Specified shape is not a Point type, or not map specified.';
    }
    /**
     * Animates a map and/or a Point shape along a route path. The movement will vary based on timestamps within the point feature properties. All points must have a `timestamp` property that is a `Date.getTime()` value. Use the `extractRoutePoints` function to preprocess data.
     * @param shape A Point shape to animate.
     * @param route The route path to animate the point along. Each feature must have a `_timestamp` property.
     * @param options Options for the animation.
     */
    function moveAlongRoute(route, shape, options) {
        if (route.length < 2) {
            throw 'Invalid path option specified.';
        }
        return new RoutePathAnimation(route, shape, options);
    }
    /**
     * Extracts points from a shapes or features that form a time based route and sorts them by time.
     * Timestamps must parsable by the `atlas.math.parseTimestamp` function.
     * All extracted points will have a `_timestamp` property that contains the Date.getTime() value.
     * Features must be a Point, MultiPoint, or LineString and must contain properties that include timestamp information.
     * If a timestamp property name is not specified, `_timestamp` will be used.
     * If a feature collection is passed in, the first shape with a matching timestamp property will dictate what is extracted.
     * If the first shape is a Point, all points in the colleciton with the timestamp property will be extracted.
     * If the first shape is a LineString or MultiLineString;
     * - If it contains a timestamp property with an array of values the same length as coordinates in the feature, new Point features will be created from a combination of the coordinates and timestamp values.
     * - If the feature has a `waypoints` property that contains an array of Point features with the timestamp property and the same number of coordinates, then these p will be extracted.
     * @param shapes The shapes to extract the route points from.
     * @param timestampProperty The name of the property that contains the timestamp for each feature. If not specified, defaults to `_timestamp`.
     */
    function extractRoutePoints(shapes, timestampProperty) {
        timestampProperty = timestampProperty || '_timestamp';
        var route;
        if (Array.isArray(shapes)) {
            route = [];
            var mode = void 0;
            for (var i = 0, len = shapes.length; i < len; i++) {
                var f = void 0;
                if (shapes[i] instanceof azmaps.Shape) {
                    f = shapes[i].toJson();
                }
                else {
                    f = shapes[i];
                }
                if (!mode &&
                    ['Polygon', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'].indexOf(f.geometry.type) === -1 &&
                    ((f.properties[timestampProperty] || typeof f.properties._timestamp === 'number') ||
                        (f.geometry.type !== 'Point' && f.properties.waypoints))) {
                    mode = f.geometry.type;
                }
                if (mode) {
                    //Only allow one LineString or MultiPoint through.
                    if (route.length === 0 || f.geometry.type === 'Point') {
                        var r = this.extractRoutePoints(f, timestampProperty);
                        if (r) {
                            route = route.concat(r);
                            if (mode !== 'Point') {
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (shapes instanceof azmaps.Shape) {
            route = Utils.extractRoutePointsFromFeature(shapes.toJson(), timestampProperty);
        }
        else if (shapes.type === 'FeatureCollection') {
            route = this.extractRoutePoints(shapes.features, timestampProperty);
        }
        else if (shapes.type) {
            route = Utils.extractRoutePointsFromFeature(shapes, timestampProperty);
        }
        if (route) {
            //Sort the points by the _timestamp property.
            route = route.sort(function (a, b) {
                return a.properties._timestamp - b.properties._timestamp;
            });
        }
        return (route.length > 0) ? route : null;
    }
    /**
     * Animates the morphing of a shape from one geometry type or set of coordinates to another.
     * @param shape The shape to animate.
     * @param newGeometry The new geometry to turn the shape into.
     * @param options Options for the animation.
     */
    function morph(shape, newGeometry, options) {
        return new MorphShapeAnimation(shape, newGeometry, options);
    }
    /**
     * Creates a playable animation delay. This is useful for group animations.
     * @param timeout The time, in milliseconds (thousandths of a second), to delay before reaching the end of the animation.
     * @param callback A callback function that is called after the delay period.
     */
    function delay(timeout, callback) {
        return new SimpleIntervalAnimation(callback, timeout, 1);
    }
    /**
     * Creates a playable animation that triggers a callback function on constant interval.
     * @param period The interval time between calls to the callback.
     * @param callback The callback function to trigger on each interval.
     * @param numberOfIntervals The number of intervals to trigger in the animation. DEfault: Infinity
     */
    function interval(period, callback, numberOfIntervals) {
        return new SimpleIntervalAnimation(callback, period, Math.max(numberOfIntervals || Infinity, 1));
    }
    /**
     * A version of the setInterval function based on requestAnimationFrame.
     * @param callback The callback function to trigger on each interval.
     * @param timeout The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified callback function.
     */
    function setInterval(callback, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var animation = new SimpleIntervalAnimation(callback, timeout, Infinity, args);
        animation.play();
        return animation._id;
    }
    /**
     * Disposes a setInterval instance.
     * @param intervalId The ID from the creation of a setInterval.
     */
    function clearInterval(intervalId) {
        var animation = AnimationManager.instance.getById(intervalId);
        if (animation) {
            animation.stop();
        }
    }
    /**
     * A version of the setTimeout function based on requestAnimationFrame.
     * @param callback The callback function to trigger after a period of time.
     * @param timeout The time, in milliseconds (thousandths of a second), the timer should delay before executioning the specified callback function.
     */
    function setTimeout$1(callback, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var animation = new SimpleIntervalAnimation(callback, timeout, 1, args);
        animation.play();
        return animation._id;
    }
    /**
     * Disposes a setTimeout instance.
     * @param timeoutId The ID of the setTimeout instance.
     */
    function clearTimeout(timeoutId) {
        clearInterval(timeoutId);
    }
    /**
     * Retrieves an easing function by name, or null if a matching easing function is not found.
     * @param easing Name of the easing function to retrieve.
     */
    function getEasingFn(easing) {
        return Easings[easing] || null;
    }
    /**
     * Retrieves the name of all the built in easing functions.
     */
    function getEasingNames() {
        return Object.keys(Easings);
    }
    /**
     * Animates the dash-array of a line layer to make it appear to flow.
     * The lineCap option of the layer must not be 'round'. If it is, it will be changed to 'butt'.
     * @param layer The layer to animate.
     * @param options Animation options.
     */
    function flowingDashedLine(layer, options) {
        //From: https://stackoverflow.com/questions/43057469/dashed-line-animations-in-mapbox-gl-js
        //Round lineCap will cause an error, change to butt cap.
        if (layer.getOptions().lineCap === 'round') {
            layer.setOptions({
                lineCap: 'butt'
            });
        }
        var dashLength = options.dashLength || 4;
        var gapLength = options.gapLength || 4;
        //We divide the animation up into 40 steps to make careful use of the finite space in LineAtlas.
        var steps = 40;
        // A # of steps proportional to the dashLength are devoted to manipulating the dash.
        var dashSteps = steps * dashLength / (gapLength + dashLength);
        // A # of steps proportional to the gapLength are devoted to manipulating the gap.
        var gapSteps = steps - dashSteps;
        var animation = new FrameBasedAnimationTimer(40, function (frameIdx) {
            var t, a, b, c, d;
            if (frameIdx < dashSteps) {
                t = frameIdx / dashSteps;
                a = (1 - t) * dashLength;
                b = gapLength;
                c = t * dashLength;
                d = 0;
            }
            else {
                t = (frameIdx - dashSteps) / (gapSteps);
                a = 0;
                b = (1 - t) * gapLength;
                c = dashLength;
                d = t * gapLength;
            }
            layer.setOptions({
                strokeDashArray: [a, b, c, d]
            });
        }, options);
        return animation;
    }
    /**
     * Fades an array of shapes in/out by adjusting its opacity.
     * Use with a layer with the opacity/strokeOpacity/fillOpacity property set to ['get', 'opacity'].
     * Play in reverse to fade out.
     * @param shapes A one or more shapes to fade in/out.
     * @param initialOpacity The initial opacity of the shape. Default: `0`
     * @param finalOpacity The final opacity of the shape. Default: `1`
     * @param options Options for the animation.
     */
    function fadeShapes(shapes, initialOpacity, finalOpacity, options) {
        if (shapes.length > 0) {
            return new OpacityAnimation(shapes, initialOpacity, finalOpacity, options);
        }
        throw 'No supported shapes specified.';
    }

    /** Group animation handler. */
    var GroupAnimation = /** @class */ (function (_super) {
        __extends(GroupAnimation, _super);
        /**************************
        * Constructor
        ***************************/
        /**
         * Group animation handler.
         * @param animations Array of animations to handle.
         */
        function GroupAnimation(animations, options) {
            var _this = _super.call(this) || this;
            _this._cancelAnimations = false;
            _this._isPlaying = false;
            _this._options = {
                playType: 'together',
                interval: 100,
                autoPlay: false
            };
            _this._onComplete = function () { };
            var self = _this;
            self._animations = animations;
            if (options) {
                self.setOptions(options);
            }
            else {
                self._calculateDuration();
            }
            return _this;
        }
        /**************************
        * Public functions
        ***************************/
        /** Disposes the animation. */
        GroupAnimation.prototype.dispose = function () {
            var self = this;
            self.stop();
            self._options = null;
            self._animations = null;
            self._onComplete = null;
            self._isPlaying = null;
            self._cancelAnimations = null;
        };
        /** Gets the duration of the animation. */
        GroupAnimation.prototype.getDuration = function () {
            return this._calculateDuration();
        };
        /** Gets the animation options. */
        GroupAnimation.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /** Checks to see if the animaiton is playing. */
        GroupAnimation.prototype.isPlaying = function () {
            return this._isPlaying;
        };
        /**
         * Plays the group of animations.
         * @param reset Specifies if the animation should reset before playing.
         */
        GroupAnimation.prototype.play = function (reset) {
            var self = this;
            if (reset) {
                self.reset();
            }
            self._cancelAnimations = false;
            switch (self._options.playType) {
                case 'together':
                    self._playTogether();
                    break;
                case 'sequential':
                    self._playSeq();
                    break;
                case 'interval':
                    self._playInterval();
                    break;
            }
        };
        /**
         * Stops all animations and jumps back to the beginning of each animation.
         */
        GroupAnimation.prototype.reset = function () {
            var self = this;
            //Prevent any queued animations from starting.
            self._cancelAnimations = true;
            var animations = self._animations;
            //Stop all animations that are playing. 
            if (animations && animations.length > 0) {
                for (var i = 0; i < animations.length; i++) {
                    animations[i].reset();
                }
            }
            self._isPlaying = false;
        };
        /** Stops all animations and jumps to the final state of each animation. */
        GroupAnimation.prototype.stop = function () {
            var self = this;
            //Prevent any queued animations from starting.
            self._cancelAnimations = true;
            var animations = self._animations;
            //Stop all animations that are playing. 
            if (animations && animations.length > 0) {
                for (var i = 0; i < animations.length; i++) {
                    animations[i].stop();
                }
            }
            self._isPlaying = false;
        };
        /**
         * Sets the options of the animation.
         * @param options Options to apply to the animation.
         */
        GroupAnimation.prototype.setOptions = function (options) {
            if (options) {
                var self_1 = this;
                var opt = self_1._options;
                var isPlaying = self_1._isPlaying;
                if (isPlaying) {
                    self_1.stop();
                }
                if (options.playType && ['together', 'sequential', 'interval'].indexOf(options.playType) !== -1) {
                    opt.playType = options.playType;
                }
                if (typeof options.autoPlay === 'boolean') {
                    opt.autoPlay = options.autoPlay;
                    if (!isPlaying && options.autoPlay) {
                        isPlaying = true;
                    }
                }
                if (typeof options.interval === 'number') {
                    opt.interval = (options.interval > 0) ? Math.abs(options.interval) : 100;
                }
                self_1._calculateDuration();
                if (isPlaying) {
                    self_1.play();
                }
            }
        };
        /**************************
        * Private functions
        ***************************/
        /**
         * Plays an array of animations together at the same time.
         */
        GroupAnimation.prototype._playTogether = function () {
            var self = this;
            var animations = this._animations;
            if (animations && animations.length > 0) {
                self._isPlaying = true;
                for (var i = 0; i < animations.length; i++) {
                    if (i === animations.length - 1) {
                        animations[i]._onComplete = function () {
                            self._isPlaying = false;
                            //Animations complete.
                            self._invokeEvent('oncomplete', null);
                        };
                    }
                    animations[i].play();
                }
            }
        };
        /**
         * Plays an array of animations sequentially. Looping of any animation will be disabled.
         */
        GroupAnimation.prototype._playSeq = function () {
            var self = this;
            var animations = self._animations;
            if (animations && animations.length > 0) {
                self._isPlaying = true;
                var idx_1 = 0;
                var callback_1 = function () {
                    if (self._isPlaying) {
                        if (idx_1 > 0) {
                            //Only use the callback once.
                            animations[idx_1 - 1]._onComplete = null;
                        }
                        if (!self._cancelAnimations && idx_1 < animations.length) {
                            animations[idx_1]._onComplete = callback_1;
                            animations[idx_1].play();
                            idx_1++;
                        }
                        else {
                            self._isPlaying = false;
                            //Animations complete.
                            self._invokeEvent('oncomplete', null);
                        }
                    }
                };
                callback_1();
            }
        };
        /**
         * Plays an array of animations one by one based on an interval.
         */
        GroupAnimation.prototype._playInterval = function () {
            var self = this;
            var animations = self._animations;
            if (animations && animations.length > 0) {
                self._isPlaying = true;
                var idx_2 = 0;
                var p_1 = function () {
                    if (self._isPlaying) {
                        if (!self._cancelAnimations && idx_2 < animations.length) {
                            if (idx_2 === animations.length - 1) {
                                animations[idx_2]._onComplete = function () {
                                    if (self._isPlaying) {
                                        self._isPlaying = false;
                                        //Animations complete.
                                        self._invokeEvent('oncomplete', null);
                                    }
                                };
                            }
                            animations[idx_2].play();
                            idx_2++;
                            setTimeout$1(function () {
                                p_1();
                            }, self._options.interval);
                        }
                        else if (self._cancelAnimations && self._isPlaying) {
                            self._isPlaying = false;
                            //Animations complete.
                            self._invokeEvent('oncomplete', null);
                        }
                    }
                };
                p_1();
            }
        };
        /** Calculates the total duration of the animation. */
        GroupAnimation.prototype._calculateDuration = function () {
            var self = this;
            var maxPostInterval = 0;
            var intervalRemaining = 0;
            var max = 0;
            var sum = 0;
            var options = self._options;
            var animations = self._animations;
            var totalInterval = options.interval * animations.length;
            animations.forEach(function (a, i, arr) {
                var d = a.getDuration();
                intervalRemaining = totalInterval - i * options.interval;
                if (intervalRemaining < d) {
                    maxPostInterval = Math.max(maxPostInterval, d - intervalRemaining);
                }
                max = Math.max(max, d);
                sum += d;
            });
            var duration = 0;
            switch (options.playType) {
                case 'together':
                    duration = max;
                    break;
                case 'sequential':
                    duration = sum;
                    break;
                case 'interval':
                    duration = maxPostInterval + totalInterval;
                    break;
            }
            return duration;
        };
        return GroupAnimation;
    }(azmaps.internal.EventEmitter));

    /* Export static functions */

    var baseAnimations = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FrameBasedAnimationTimer: FrameBasedAnimationTimer,
        GroupAnimation: GroupAnimation,
        PlayableAnimation: PlayableAnimation,
        drop: drop,
        dropMarkers: dropMarkers,
        setCoordinates: setCoordinates,
        snakeline: snakeline,
        moveAlongPath: moveAlongPath,
        moveAlongRoute: moveAlongRoute,
        extractRoutePoints: extractRoutePoints,
        morph: morph,
        delay: delay,
        interval: interval,
        setInterval: setInterval,
        clearInterval: clearInterval,
        setTimeout: setTimeout$1,
        clearTimeout: clearTimeout,
        getEasingFn: getEasingFn,
        getEasingNames: getEasingNames,
        flowingDashedLine: flowingDashedLine,
        fadeShapes: fadeShapes
    });

    var layer = Namespace.merge("atlas.layer", baseLayer);
    var animations = Namespace.merge("atlas.animations", baseAnimations);

    exports.animations = animations;
    exports.layer = layer;

}(this.atlas = this.atlas || {}, atlas));
