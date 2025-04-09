/*
azure-maps-geolocation-control Version: 0.0.4

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

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var azmaps__namespace = /*#__PURE__*/_interopNamespace(azmaps);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
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

    /** A control that uses the browser's geolocation API to locate the user on the map. */
    var GeolocationControl = /** @class */ (function (_super) {
        __extends(GeolocationControl, _super);
        /****************************
         * Constructor
         ***************************/
        /**
         * A control that uses the browser's geolocation API to locate the user on the map.
         * @param options Options for defining how the control is rendered and functions.
         */
        function GeolocationControl(options) {
            var _this = _super.call(this) || this;
            _this._options = {
                style: 'light',
                positionOptions: {
                    enableHighAccuracy: true,
                    maximumAge: Infinity,
                    timeout: 10000
                },
                showUserLocation: true,
                trackUserLocation: true,
                markerColor: 'DodgerBlue',
                maxZoom: 15,
                calculateMissingValues: false,
                updateMapCamera: true,
                enableCompass: true,
                compassEventThrottleDelay: 100
            };
            _this._darkColor = '#011c2c';
            _this._hclStyle = null;
            _this._isActive = false;
            _this._updateMapCamera = true;
            _this._lastCompassHeading = Number.NaN;
            _this._compassEnabled = false;
            _this._compassUpdateScheduled = false;
            _this._compassEventUpdateScheduled = false;
            /****************************
             * Private Methods
             ***************************/
            /** Toggles the state of the control. */
            _this._toggleBtn = function () {
                _this.toggle();
            };
            /**
             * An event handler for when the map style changes. Used when control style is set to auto.
             */
            _this._mapStyleChanged = function () {
                var self = _this;
                if (self._button && !self._hclStyle) {
                    self._button.style.backgroundColor = self._getColorFromMapStyle();
                }
            };
            /**
            * An event handler for when the map starts to move.
            * When this happens, we don't want the map camera to automatically move if tracking.
            */
            _this._mapMoveStarted = function () {
                _this._updateMapCamera = false;
            };
            /**
            * An event handler for when the map stops to moving.
            * When this happens, we don't want the map camera to automatically move if tracking.
            */
            _this._mapMoveEnded = function () {
                _this._updateMapCamera = _this._options.updateMapCamera;
            };
            /**
             * Callback for when an error occurs when getting the users location.
             * @param position The GPS position information.
             */
            _this._onGpsSuccess = function (position) {
                var self = _this;
                var options = self._options;
                var map = self._map;
                var lastKnownPosition = self._lastKnownPosition;
                var gpsMarker = self._gpsMarker;
                var pos;
                if (position) {
                    pos = [position.coords.longitude, position.coords.latitude];
                    //@ts-ignore
                    var geopos = {
                        timestamp: new Date(position.timestamp),
                        _timestamp: position.timestamp
                    };
                    Object.assign(geopos, position.coords);
                    if (options.calculateMissingValues && lastKnownPosition) {
                        if (typeof position.coords.speed !== 'number') {
                            var dt = position.timestamp - lastKnownPosition.properties._timestamp;
                            var dx = azmaps__namespace.math.getDistanceTo(lastKnownPosition.geometry.coordinates, pos);
                            geopos.speed = dx / (dt * 0.001);
                        }
                        if (typeof position.coords.heading !== 'number') {
                            geopos.heading = azmaps__namespace.math.getHeading(lastKnownPosition.geometry.coordinates, pos);
                            geopos.headingType = 'calculated';
                        }
                    }
                    else if (!isNaN(geopos.heading)) {
                        geopos.headingType = 'geolocation';
                    }
                    if (!isNaN(self._lastCompassHeading)) {
                        geopos.compassHeading = self._lastCompassHeading;
                    }
                    lastKnownPosition = new azmaps__namespace.data.Feature(new azmaps__namespace.data.Point(pos), geopos);
                    self._lastKnownPosition = lastKnownPosition;
                }
                if (lastKnownPosition) {
                    if (!pos) {
                        pos = lastKnownPosition.geometry.coordinates;
                    }
                    if (self._isActive) {
                        if (options.showUserLocation) {
                            if (!gpsMarker) {
                                var icon = self._getMarkerIcon();
                                self._gpsMarker = new azmaps__namespace.HtmlMarker({
                                    position: pos,
                                    htmlContent: icon,
                                    anchor: 'center'
                                });
                                //@ts-ignore
                                self._gpsMarker.marker.setPitchAlignment('map');
                                //@ts-ignore
                                self._gpsMarker.marker.setRotationAlignment('map');
                                map.markers.add(self._gpsMarker);
                            }
                            else {
                                gpsMarker.setOptions({
                                    position: pos,
                                    visible: self._isActive && options.showUserLocation
                                });
                            }
                            self._updateMarkerHeading();
                        }
                        else {
                            gpsMarker.setOptions({
                                visible: false
                            });
                        }
                        if (self._updateMapCamera) {
                            var opt = {
                                center: pos
                            };
                            //Only adjust zoom if the user is zoomed out too much.
                            if (map.getCamera().zoom < 15) {
                                opt.zoom = 15;
                            }
                            //Rotate the map to align with the compass heading.
                            if (self._options.syncMapCompassHeading && !isNaN(self._lastCompassHeading)) {
                                opt.bearing = self._lastCompassHeading;
                            }
                            map.setCamera(opt);
                        }
                    }
                    self._invokeEvent('geolocationsuccess', lastKnownPosition);
                }
            };
            /**
             * Callback for when an error occurs when getting the users location.
             * @param error The error that occured.
             */
            _this._onGpsError = function (error) {
                //Don't do anything other than report the error. Often it will be that there was a timeout when getting the users location.
                _this._invokeEvent('geolocationerror', error);
            };
            /**
             * An event handler for when the device orientation changes. This is used to update the compass heading.
             * @param e The device orientation event.
             */
            _this._onOrientationChanged = function (e) {
                var self = _this;
                //Check to see if there is an update already scheduled. If so, ignore this event (throttle).
                if (!self._compassEventUpdateScheduled || !self._compassUpdateScheduled) {
                    var h_1 = null;
                    if (e.absolute) {
                        //Calculate the compass heading based on the device orientation using Euler angles.
                        h_1 = self._eulerAnglesToCompassHeading(e.alpha, e.beta, e.gamma);
                    }
                    //@ts-ignore
                    else if (e.webkitCompassHeading) {
                        //@ts-ignore
                        h_1 = e.webkitCompassHeading;
                    }
                    if (!isNaN(h_1)) {
                        self._lastCompassHeading = h_1;
                        if (!self._compassUpdateScheduled) {
                            self._compassUpdateScheduled = true;
                            //Update the marker heading no faster than every 100ms.
                            setTimeout(function () {
                                //Rotate the map to align with the compass heading.
                                if (self._options.syncMapCompassHeading) {
                                    self._map.setCamera({ bearing: self._lastCompassHeading });
                                }
                                self._updateMarkerHeading();
                                self._compassUpdateScheduled = false;
                            }, 100);
                        }
                        if (!self._compassEventUpdateScheduled) {
                            self._compassEventUpdateScheduled = true;
                            //Throttle.
                            setTimeout(function () {
                                self._invokeEvent('compassheadingchanged', h_1);
                                self._compassEventUpdateScheduled = false;
                            }, self._options.compassEventThrottleDelay);
                        }
                    }
                }
            };
            //When the page is unloaded, stop tracking the user location.
            _this._pageUnload = function () {
                _this._stopTracking();
                _this._disableCompass();
            };
            if (options) {
                var self_1 = _this;
                var opt = self_1._options;
                if (options.positionOptions) {
                    opt.positionOptions = Object.assign(opt.positionOptions, options.positionOptions);
                }
                if (options.style) {
                    opt.style = options.style;
                }
                if (options.markerColor) {
                    opt.markerColor = options.markerColor;
                }
                if (typeof options.showUserLocation === 'boolean') {
                    opt.showUserLocation = options.showUserLocation;
                }
                if (typeof options.trackUserLocation === 'boolean') {
                    opt.trackUserLocation = options.trackUserLocation;
                }
                if (typeof options.maxZoom === 'number') {
                    opt.maxZoom = Math.min(Math.max(options.maxZoom, 0), 24);
                }
                if (typeof options.calculateMissingValues === 'boolean') {
                    opt.calculateMissingValues = options.calculateMissingValues;
                }
                if (typeof options.updateMapCamera === 'boolean') {
                    opt.updateMapCamera = options.updateMapCamera;
                    self_1._updateMapCamera = options.updateMapCamera;
                }
                if (typeof options.enableCompass === 'boolean') {
                    opt.enableCompass = options.enableCompass;
                    options.enableCompass ? self_1._enableCompass() : self_1._disableCompass();
                }
                if (typeof options.syncMapCompassHeading === 'boolean') {
                    opt.syncMapCompassHeading = options.syncMapCompassHeading;
                }
                if (typeof options.compassEventThrottleDelay === 'number' && options.compassEventThrottleDelay >= 100) {
                    opt.compassEventThrottleDelay = options.compassEventThrottleDelay;
                }
            }
            return _this;
        }
        /****************************
         * Public Methods
         ***************************/
        /** Disposes the control. */
        GeolocationControl.prototype.dispose = function () {
            var self = this;
            if (self._map) {
                self._map.controls.remove(self);
            }
            Object.keys(self).forEach(function (k) {
                self[k] = null;
            });
        };
        /** Get sthe last known position from the geolocation control. */
        GeolocationControl.prototype.getLastKnownPosition = function () {
            return JSON.parse(JSON.stringify(this._lastKnownPosition));
        };
        /**
         * Action to perform when the control is added to the map.
         * @param map The map the control was added to.
         * @param options The control options used when adding the control to the map.
         * @returns The HTML Element that represents the control.
         */
        GeolocationControl.prototype.onAdd = function (map, options) {
            var self = this;
            self._map = map;
            var mcl = map.getMapContainer().classList;
            if (mcl.contains("high-contrast-dark")) {
                self._hclStyle = 'dark';
            }
            else if (mcl.contains("high-contrast-light")) {
                self._hclStyle = 'light';
            }
            self._resource = self._getTranslations(self._map.getStyle().language);
            //Create different color icons and merge into CSS.
            var gc = GeolocationControl;
            var grayIcon = gc._iconTemplate.replace('{color}', 'Gray');
            var blueIcon = gc._iconTemplate.replace('{color}', 'DeepSkyBlue');
            var css = gc._gpsBtnCss.replace(/{grayIcon}/g, grayIcon).replace(/{blueIcon}/g, blueIcon);
            //Add the CSS style for the control to the DOM.
            var style = document.createElement('style');
            style.innerHTML = css;
            document.body.appendChild(style);
            //Create the button.
            var c = document.createElement('div');
            c.classList.add('azure-maps-control-container');
            c.setAttribute('aria-label', self._resource[0]);
            c.style.flexDirection = 'column';
            //Hide the button by default. 
            c.style.display = 'none';
            self._container = c;
            var b = document.createElement("button");
            b.classList.add('azmaps-gpsBtn');
            b.classList.add('azmaps-gpsDisabled');
            b.setAttribute('title', self._resource[0]);
            b.setAttribute('alt', self._resource[0]);
            b.setAttribute('type', 'button');
            b.addEventListener('click', self._toggleBtn);
            self._button = b;
            self._updateState();
            self.setOptions(self._options);
            c.appendChild(b);
            //Check that geolocation is supported.
            gc.isSupported().then(function (supported) {
                if (supported) {
                    //Show the button when we know geolocation is supported.
                    self._container.style.display = '';
                }
                else {
                    //Device doesn't support getting position.
                    //@ts-ignore
                    self._invokeEvent('geolocationerror', {
                        code: 2,
                        message: 'Geolocation API not supported by device.',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                }
            });
            self._map.events.add('movestart', self._mapMoveStarted);
            self._map.events.add('moveend', self._mapMoveEnded);
            self.setOptions(self._options);
            addEventListener('beforeunload', self._pageUnload, false);
            return c;
        };
        /**
         * Action to perform when control is removed from the map.
         */
        GeolocationControl.prototype.onRemove = function () {
            var self = this;
            if (self._container) {
                self._container.remove();
            }
            if (self._options.style === 'auto') {
                self._map.events.remove('styledata', self._mapStyleChanged);
            }
            self._map.events.remove('movestart', self._mapMoveStarted);
            self._map.events.remove('moveend', self._mapMoveEnded);
            self._disableCompass();
            if (typeof self._watchId !== 'undefined') {
                navigator.geolocation.clearWatch(self._watchId);
            }
            if (self._gpsMarker) {
                self._map.markers.remove(self._gpsMarker);
            }
            self._map = null;
            removeEventListener('beforeunload', self._pageUnload);
        };
        /** Gets the options of the geolocation control. */
        GeolocationControl.prototype.getOptions = function () {
            return Object.assign({}, this._options);
        };
        /**
         * Sets the options of the geolocation control.
         * @param options The options.
         */
        GeolocationControl.prototype.setOptions = function (options) {
            var self = this;
            var o = self._options;
            if (options) {
                var color = 'white';
                if (self._hclStyle) {
                    if (self._hclStyle === 'dark') {
                        color = self._darkColor;
                    }
                }
                else {
                    if (o.style === 'auto') {
                        self._map.events.remove('styledata', self._mapStyleChanged);
                    }
                    o.style = options.style;
                    switch (options.style) {
                        case 'dark':
                            color = self._darkColor;
                            break;
                        case 'auto':
                            //Color will change between light and dark depending on map style.
                            self._map.events.add('styledata', self._mapStyleChanged);
                            color = self._getColorFromMapStyle();
                            break;
                        //case 'light':
                        //break;
                    }
                }
                self._button.style.backgroundColor = color;
                if (options.markerColor) {
                    o.markerColor = options.markerColor;
                    if (self._gpsMarker) {
                        //@ts-ignore
                        self._gpsMarker.getOptions().htmlContent.querySelector('.gps-dot').style.backgroundColor = options.markerColor;
                    }
                }
                if (typeof options.maxZoom === 'number') {
                    o.maxZoom = Math.min(Math.max(options.maxZoom, 0), 24);
                }
                if (typeof options.calculateMissingValues === 'boolean') {
                    o.calculateMissingValues = options.calculateMissingValues;
                }
                if (typeof options.updateMapCamera === 'boolean') {
                    o.updateMapCamera = options.updateMapCamera;
                    self._updateMapCamera = options.updateMapCamera;
                }
                if (typeof options.showUserLocation === 'boolean') {
                    o.showUserLocation = options.showUserLocation;
                    if (self._gpsMarker) {
                        self._gpsMarker.setOptions({
                            visible: self._isActive && options.showUserLocation
                        });
                    }
                    else if (self._lastKnownPosition) {
                        self._onGpsSuccess();
                    }
                }
                if (typeof options.trackUserLocation === 'boolean') {
                    o.trackUserLocation = options.trackUserLocation;
                }
                if (options.positionOptions) {
                    var opt = {};
                    if (options.positionOptions.enableHighAccuracy) {
                        opt.enableHighAccuracy = options.positionOptions.enableHighAccuracy;
                    }
                    if (typeof options.positionOptions.maximumAge === 'number') {
                        opt.maximumAge = options.positionOptions.maximumAge;
                    }
                    if (typeof options.positionOptions.timeout === 'number') {
                        opt.timeout = options.positionOptions.timeout;
                    }
                    if (Object.keys(opt).length > 0) {
                        o.positionOptions = Object.assign(o.positionOptions, opt);
                        self._stopTracking();
                        self._updateState();
                    }
                }
                if (typeof options.enableCompass === 'boolean') {
                    o.enableCompass = options.enableCompass;
                    options.enableCompass ? self._enableCompass() : self._disableCompass();
                    //If the compass is not enabled, reset the map heading to 0.
                    if (!o.enableCompass) {
                        self._map.setCamera({ bearing: 0 });
                    }
                }
                if (typeof options.syncMapCompassHeading === 'boolean') {
                    o.syncMapCompassHeading = options.syncMapCompassHeading;
                    //If the compass heading syncing is not enabled, reset the map heading to 0.
                    if (!o.syncMapCompassHeading) {
                        self._map.setCamera({ bearing: 0 });
                    }
                }
                if (typeof options.compassEventThrottleDelay === 'number' && options.compassEventThrottleDelay >= 100) {
                    o.compassEventThrottleDelay = options.compassEventThrottleDelay;
                }
            }
        };
        /**
         * Toggles the state of the Geolocation control button. If a boolean state is not passed in, will toggle to opposite of current state.
         * @param isActive The state to toggle to. If not specified, will toggle to opposite of current state.
         */
        GeolocationControl.prototype.toggle = function (isActive) {
            var self = this;
            self._isActive = (typeof isActive === 'boolean') ? isActive : !self._isActive;
            if (self._isActive && self._options.trackUserLocation && self._lastKnownPosition) {
                self._onGpsSuccess();
            }
            self._updateMapCamera = self._options.updateMapCamera;
            self._updateState();
        };
        /** Checks to see if the geolocation API is supported in the browser. */
        GeolocationControl.isSupported = function () {
            return __awaiter(this, void 0, void 0, function () {
                var p;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!window.navigator.permissions) return [3 /*break*/, 2];
                            return [4 /*yield*/, window.navigator.permissions.query({ name: 'geolocation' })];
                        case 1:
                            p = _a.sent();
                            return [2 /*return*/, p.state !== 'denied'];
                        case 2: return [2 /*return*/, !!window.navigator.geolocation];
                    }
                });
            });
        };
        /**
         * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
         */
        GeolocationControl.prototype._getColorFromMapStyle = function () {
            //When the style is dark (i.e. satellite, night), show the dark colored theme.
            if (['satellite', 'satellite_road_labels', 'grayscale_dark', 'night'].indexOf(this._map.getStyle().style) > -1) {
                return this._darkColor;
            }
            return 'white';
        };
        /** Removes the geolocation watcher used for tracking. */
        GeolocationControl.prototype._stopTracking = function () {
            var self = this;
            if (typeof self._watchId === 'number') {
                navigator.geolocation.clearWatch(self._watchId);
                self._watchId = null;
            }
        };
        /**
         * Updates the state of the button.
         */
        GeolocationControl.prototype._updateState = function () {
            var self = this;
            if (!self._isActive || self._options.trackUserLocation) {
                self._stopTracking();
            }
            if (self._gpsMarker) {
                self._gpsMarker.setOptions({
                    visible: self._isActive && self._options.showUserLocation
                });
            }
            var ariaLabel = self._resource[2];
            var removeClass = 'azmaps-gpsEnabled';
            var addClass = 'azmaps-gpsDisabled';
            if (self._isActive) {
                removeClass = 'azmaps-gpsDisabled';
                addClass = 'azmaps-gpsEnabled';
                if (self._options.trackUserLocation) {
                    if (typeof self._watchId !== 'number') {
                        self._watchId = navigator.geolocation.watchPosition(self._onGpsSuccess, self._onGpsError, self._options.positionOptions);
                    }
                    ariaLabel = self._resource[1];
                }
                else {
                    //True high accuracy first then fall back if needed.
                    navigator.geolocation.getCurrentPosition(self._onGpsSuccess, self._onGpsError, self._options.positionOptions);
                }
            }
            else {
                if (self._options.trackUserLocation) {
                    ariaLabel = self._resource[0];
                }
            }
            var b = self._button;
            b.setAttribute('title', ariaLabel);
            b.setAttribute('alt', ariaLabel);
            b.classList.remove(removeClass);
            b.classList.add(addClass);
        };
        /** Generates the mark icon HTML */
        GeolocationControl.prototype._getMarkerIcon = function () {
            var icon = document.createElement('div');
            icon.className = 'gps-container';
            icon.innerHTML = GeolocationControl._gpsDotIcon.replace('{color}', this._options.markerColor);
            return icon;
        };
        /**
         * Updates the marker heading based on the last known compass heading.
         */
        GeolocationControl.prototype._updateMarkerHeading = function () {
            var self = this;
            if (self._gpsMarker) {
                var h = self._lastCompassHeading;
                var clipPath = 'none';
                var animate = true;
                if (isNaN(h)) {
                    var props = self._lastKnownPosition.properties;
                    var h2 = props.heading;
                    //If a heading value is set and is either from the geolocation API, or calculated when in user tracking mode, use that.
                    if (!isNaN(h2) && (props.headingType === 'geolocation' || (self._options.trackUserLocation && self._options.calculateMissingValues))) {
                        h = h2;
                    }
                }
                if (!isNaN(h)) {
                    h = Math.round(h);
                    //@ts-ignore
                    self._gpsMarker.marker.setRotation(h);
                    clipPath = 'polygon(50% 50%, 0% 0%, 100% 0%)';
                    animate = false;
                }
                //@ts-ignore
                var gpsPluseElm = self._gpsMarker.getOptions().htmlContent.querySelector('.gps-pulse');
                gpsPluseElm.style.clipPath = clipPath;
                var animationClass = 'gps-pulse-animation';
                var cl = gpsPluseElm.classList;
                var hasClass = cl.contains(animationClass);
                if (animate) {
                    if (!hasClass) {
                        cl.add(animationClass);
                    }
                }
                else if (hasClass) {
                    cl.remove(animationClass);
                }
            }
        };
        /**
         * Enable the compass by adding the event listener for device orientation changes.
         */
        GeolocationControl.prototype._enableCompass = function () {
            var self = this;
            if (!self._compassEnabled) {
                if ('ondeviceorientationabsolute' in window) {
                    window.addEventListener('deviceorientationabsolute', self._onOrientationChanged, false);
                }
                else if ('ondeviceorientation' in window &&
                    ('DeviceOrientationEvent' in window && 'webkitCompassHeading' in DeviceOrientationEvent.prototype)) {
                    //@ts-ignore
                    window.addEventListener('deviceorientation', self._onOrientationChanged, false);
                }
                self._compassEnabled = true;
            }
        };
        /**
         * Disables the compass by removing the event listener for device orientation changes.
         */
        GeolocationControl.prototype._disableCompass = function () {
            var self = this;
            if (self._compassEnabled) {
                if ('ondeviceorientationabsolute' in window) {
                    window.removeEventListener('deviceorientationabsolute', self._onOrientationChanged, false);
                }
                else if ('ondeviceorientation' in window &&
                    ('DeviceOrientationEvent' in window && 'webkitCompassHeading' in DeviceOrientationEvent.prototype)) {
                    //@ts-ignore
                    window.removeEventListener('deviceorientation', self._onOrientationChanged, false);
                }
            }
            self._compassEnabled = false;
            self._lastCompassHeading = Number.NaN;
        };
        /**
         * Computes the compass-heading from the device-orientation euler-angles.
         * Source: https://w3c.github.io/deviceorientation/#example-cad08fa0
         */
        GeolocationControl.prototype._eulerAnglesToCompassHeading = function (alpha, beta, gamma) {
            var degtorad = Math.PI / 180;
            var _x = beta ? beta * degtorad : 0; // beta value
            var _y = gamma ? gamma * degtorad : 0; // gamma value
            var _z = alpha ? alpha * degtorad : 0; // alpha value
            var cY = Math.cos(_y);
            var cZ = Math.cos(_z);
            var sX = Math.sin(_x);
            var sY = Math.sin(_y);
            var sZ = Math.sin(_z);
            // Calculate Vx and Vy components
            var Vx = -cZ * sY - sZ * sX * cY;
            var Vy = -sZ * sY + cZ * sX * cY;
            // Calculate compass heading
            var compassHeading = Math.atan(Vx / Vy);
            // Convert compass heading to use whole unit circle
            if (Vy < 0) {
                compassHeading += Math.PI;
            }
            else if (Vx < 0) {
                compassHeading += 2 * Math.PI;
            }
            return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
        };
        /**
         * Returns the set of translation text resources needed for the control for a given language.
         * Array values: 0 - enableTracking, 1 - disableTracking, 2 - myLocation, 3 - title
         * @param lang The language code to retrieve the text resources for.
         * @returns An object containing text resources in the specified language.
         */
        GeolocationControl.prototype._getTranslations = function (lang) {
            if (lang && lang.indexOf('-') > 0) {
                lang = lang.substring(0, lang.indexOf('-'));
            }
            var t = GeolocationControl._translations;
            var r = t[lang];
            if (!r) {
                r = t['en'];
            }
            return r;
        };
        GeolocationControl._gpsDotIcon = '<div class="gps-dot" style="background-color:{color}"></div><div class="gps-wedge"><div class="gps-pulse"></div></div>';
        GeolocationControl._iconTemplate = "data:image/svg+xml;utf8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 561 561' xml:space='preserve'><g fill='{color}'><path d='M280.5,178.5c-56.1,0-102,45.9-102,102c0,56.1,45.9,102,102,102c56.1,0,102-45.9,102-102C382.5,224.4,336.6,178.5,280.5,178.5z M507.45,255C494.7,147.9,410.55,63.75,306,53.55V0h-51v53.55C147.9,63.75,63.75,147.9,53.55,255H0v51h53.55C66.3,413.1,150.45,497.25,255,507.45V561h51v-53.55C413.1,494.7,497.25,410.55,507.45,306H561v-51H507.45z M280.5,459C181.05,459,102,379.95,102,280.5S181.05,102,280.5,102S459,181.05,459,280.5S379.95,459,280.5,459z'/></g></svg>";
        GeolocationControl._gpsBtnCss = '.azmaps-gpsBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);}' +
            '.azmaps-gpsDisabled{background-image:url("{grayIcon}");}' +
            '.azmaps-gpsDisabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}' +
            '.azmaps-gpsEnabled{background-image:url("{blueIcon}");}' +
            '.azmaps-gpsEnabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}' +
            '.gps-container{position:relative;width:16px;height:16px;}' +
            '.gps-dot{width:12px;height:12px;background-color:dodgerBlue;border:2px white solid;border-radius:50%;position:absolute;top:50%;left:50%;transform: translate(-50%, -50%);z-index:100000;}' +
            '.gps-wedge{width:16px;height:16px;position:absolute;top:0;left:0;z-index:99999;}' +
            '.gps-pulse{width:100%;height:100%;border-radius:50%;background-image: radial-gradient(rgba(30,144,255,1),rgba(30,144,255,0.5));position:absolute;transform-origin:center;transform:scale(2.5);}' +
            '.gps-pulse-animation{animation:gps-pulse-animation-key 2s infinite ease-out;}' +
            '@keyframes gps-pulse-animation-key { 0% {transform:scale(0.5);opacity:1;} 100% {transform: scale(2.5);opacity:0.5;}}';
        GeolocationControl._translations = {
            //Afrikaans
            'af': ['begin dop', 'stop die dop', 'my plek', 'ligginggewing beheer'],
            //Arabic
            'ar': ['بدء تتبع', 'تتبع توقف', 'موقعي', 'السيطرة تحديد الموقع الجغرافي'],
            //Basque
            'eu': ['Hasi segimendua', 'Stop jarraipena', 'Nire kokapena', 'Geokokapen kontrol'],
            //Bulgarian
            'bg': ['Започнете да проследявате', 'Спиране на проследяването', 'Моето място', 'контрол за геолокация'],
            //Chinese
            'zh': ['开始跟踪', '停止追踪', '我的位置', '地理位置控制'],
            //Croatian
            'hr': ['Započnite praćenje', 'zaustavljanje praćenje', 'Moja lokacija', 'kontrola Geolocation'],
            //Czech
            'cs': ['začít sledovat', 'Zastavit sledování', 'Moje lokace', 'ovládání Geolocation'],
            //Danish
            'da': ['Start sporing', 'Stop sporing', 'min placering', 'Geolocation kontrol'],
            //Dutch
            'nl': ['beginnen met het bijhouden', 'stop volgen', 'Mijn locatie', 'Geolocation controle'],
            //Estonian
            'et': ['Alusta jälgimist', 'Stopp jälgimise', 'Minu asukoht', 'Geolocation kontrolli'],
            //Finnish
            'fi': ['Aloita seuranta', 'Lopeta seuranta', 'Minun sijaintini', 'Geolocation ohjaus'],
            //French
            'fr': ['Démarrer le suivi', "suivi d'arrêt", 'Ma position', 'le contrôle de géolocalisation'],
            //Galician
            'gl': ['comezar a controlar', 'seguimento parada', 'A miña localización', 'control de xeolocalización'],
            //German
            'de': ['starten Sie Tracking', 'Stop-Tracking', 'Mein Standort', 'Geolokalisierung Steuer'],
            //Greek
            'el': ['Ξεκινήστε την παρακολούθηση', 'Διακοπή παρακολούθησης', 'Η τοποθεσία μου', 'ελέγχου geolocation'],
            //Hindi
            'hi': ['ट्रैक करना शुरू', 'बंद करो ट्रैकिंग', 'मेरा स्थान', 'जियोलोकेशन नियंत्रण'],
            //Hungarian
            'hu': ['követés indítása', 'követés leállítása', 'Saját hely', 'Geolocation ellenőrzés'],
            //Indonesian
            'id': ['Mulai pelacakan', 'berhenti pelacakan', 'Lokasi saya', 'kontrol geolocation'],
            //Italian
            'it': ['Inizia il monitoraggio', 'monitoraggio arresto', 'La mia posizione', 'controllo geolocalizzazione'],
            //Japanese
            'ja': ['追跡を開始', '追跡を停止', '私の場所', 'ジオロケーション制御'],
            //Kazakh
            'kk': ['қадағалау бастау', 'қадағалау тоқтату', 'Менің орналасуы', 'геоорын бақылау'],
            //Korean
            'ko': ['추적 시작', '정지 추적', '내 위치', '위치 정보 제어'],
            //Spanish
            'es': ['iniciar el seguimiento', 'Detener el seguimiento', 'Mi ubicacion', 'control de geolocalización'],
            //Latvian
            'lv': ['Sākt izsekošana', 'Stop izsekošana', 'Mana atrašanās vieta', 'Geolocation kontrole'],
            //Lithuanian
            'lt': ['pradėti stebėti', 'Sustabdyti sekimo', 'Mano vieta', 'Geografinė padėtis kontrolė'],
            //Malay
            'ms': ['mula menjejaki', 'Stop pengesanan', 'Lokasi saya', 'kawalan geolokasi'],
            //Norwegian
            'nb': ['begynne å spore', 'stopp sporing', 'Min posisjon', 'geolocation kontroll'],
            //Polish
            'pl': ['rozpocząć śledzenie', 'Zatrzymaj śledzenie', 'Moja lokacja', 'kontrola Geolokalizacja'],
            //Portuguese
            'pt': ['começar a controlar', 'rastreamento parada', 'Minha localização', 'controle de geolocalização'],
            //Romanian
            'ro': ['Pornire urmărire', 'Oprire urmărire', 'Locatia mea', 'controlul de geolocalizare'],
            //Russian
            'ru': ['Начать отслеживание', 'остановка отслеживания', 'Мое местонахождение', 'контроль геолокации'],
            //Serbian
            'sr': ['Старт трацкинг', 'стоп праћење', 'Моја локација', 'kontrola геолоцатион'],
            //Slovak
            'sk': ['začať sledovať', 'zastaviť sledovanie', 'moja poloha', 'ovládanie Geolocation'],
            //Slovenian
            'sl': ['Začni sledenje', 'Stop za sledenje', 'moja lokacija', 'nadzor Geolocation'],
            //Swedish
            'sv': ['börja spåra', 'Stoppa spårning', 'Min plats', 'geolocation kontroll'],
            //Thai
            'th': ['เริ่มการติดตาม', 'ติดตามหยุด', 'ตำแหน่งของฉัน', 'ควบคุม Geolocation'],
            //Turkish
            'tr': ['izlemeyi başlat', 'Dur izleme', 'Benim konumum', 'Coğrafi Konum kontrolü'],
            //Ukrainian
            'uk': ['почати відстеження', 'зупинка відстеження', 'моє місце розташування', 'контроль геолокації'],
            //Vietnamese
            'vi': ['Bắt đầu theo dõi', 'dừng theo dõi', 'vị trí của tôi', 'kiểm soát định vị'],
            //English
            'en': ['Start tracking', 'Stop tracking', 'My location', 'Geolocation control']
        };
        return GeolocationControl;
    }(azmaps__namespace.internal.EventEmitter));

    var baseControl = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GeolocationControl: GeolocationControl
    });

    var control = Namespace.merge("atlas.control", baseControl);

    exports.control = control;

    Object.defineProperty(exports, '__esModule', { value: true });

})(this.atlas = this.atlas || {}, atlas);
