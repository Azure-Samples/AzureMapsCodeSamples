/*
 * Copyright(c) 2018 Microsoft Corporation. All rights reserved.
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/// <reference path="../../Common/typings/azure-maps-control.d.ts"/>
/**
 * A control that toggles the map from its defined size to a fullscreen size.
 */
var FullscreenControl = /** @class */ (function () {
    /****************************
     * Constructor
     ***************************/
    /**
     * A control that toggles the map from its defined size to a fullscreen size.
     * @param options Options for defining how the control is rendered and functions.
     */
    function FullscreenControl(options) {
        this._options = {
            style: 'light',
            hideIfUnsupported: true
        };
        this._darkColor = '#011c2c';
        this._fullscreenCss = '{elm}:-webkit-full-screen{width:100%;height:100%;}{elm}:-moz-full-screen{width:100%;height:100%;}{elm}:-ms-fullscreen{width:100%;height:100%;}{elm}:-o-full-screen{width:100%;height:100%;}{elm}:-full-screen{width:100%;height:100%;}' +
            '.fullscreenMapBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);}' +
            '.fullscreenMapExpand{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAF6ePCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAAJacn5ean5idopicopicoZicoZbVOdIAAAAGdFJOUwBQYI+fucOe/hkAAAAJcEhZcwAAFxEAABcRAcom8z8AAADMSURBVDhPzZSNDoIwDITn397/kV27il9Rzmwq4Qux194VRmIombqqDzCvtV236LvRJos28rD6RlPGs5jpvHaZVTLWe0nEbCkxbnKkU4zcMw7xpvTqeHrho2WzzDfWHHPPmraCmAXWzRDrtZ7ZpCeNOe03c3xnL2bOdginc2Iz6/yYuDGxP+WG1Q8Qmvxxx6UGQUgNgpAaBCE1CEJqEITUIHhxXGquTjTHBa+mQRBSgyCkBkFIDYKQGgQhNQhCahDsMmGfoA1r351BSrkDTQQSzEhW2qYAAAAASUVORK5CYII=);}' +
            '.fullscreenMapExpand:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAF6ePCOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAVUExURQAAADCszDCqzTKtzzKszzCszzGszvdFYikAAAAGdFJOUwBQYI+fucOe/hkAAAAJcEhZcwAAFxEAABcRAcom8z8AAADMSURBVDhPzZSNDoIwDITn397/kV27il9Rzmwq4Qux194VRmIombqqDzCvtV236LvRJos28rD6RlPGs5jpvHaZVTLWe0nEbCkxbnKkU4zcMw7xpvTqeHrho2WzzDfWHHPPmraCmAXWzRDrtZ7ZpCeNOe03c3xnL2bOdginc2Iz6/yYuDGxP+WG1Q8Qmvxxx6UGQUgNgpAaBCE1CEJqEITUIHhxXGquTjTHBa+mQRBSgyCkBkFIDYKQGgQhNQhCahDsMmGfoA1r351BSrkDTQQSzEhW2qYAAAAASUVORK5CYII=);}' +
            '.fullscreenMapCollapse{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAD1BMVEWWnJ+Xmp+YnKKYnKKYnKHcteq5AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQfiCw8VGzLD58rvAAAANUlEQVQ4y2NgIB+wuLg4IKhRGUpkXGAAKgMFg0JmuIHBH9ajuYTaMszGxgZAiklJSYFg+gAAKrRnAIqOPxgAAAAASUVORK5CYII=);}' +
            '.fullscreenMapCollapse:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAD1BMVEUwrMwwqs0yrM8yrM8xrM6kUFC0AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQfiCw8VGSuVugCtAAAANUlEQVQ4y2NgIB+wuLg4IKhRGUpkXGAAKgMFg0JmuIHBH9ajuYTaMszGxgZAiklJSYFg+gAAKrRnAIqOPxgAAAAASUVORK5CYII=);}';
        this._options = __assign({}, this._options, options);
    }
    /****************************
     * Private Methods
     ***************************/
    /**
     * Action to perform when the control is added to the map.
     * @param map The map the control was added to.
     * @param options The control options used when adding the control to the map.
     * @returns The HTML Element that represents the control.
     */
    FullscreenControl.prototype.onAdd = function (map, options) {
        var _this = this;
        this._map = map;
        var isSupported = FullscreenControl.isSupported();
        if (isSupported || (!isSupported && !this._options.hideIfUnsupported)) {
            this._resource = FullscreenControl._getTranslations(this._map.getStyle().language);
            var color = this._options.style || 'light';
            if (color === 'light') {
                color = 'white';
            }
            else if (color === 'dark') {
                color = this._darkColor;
            }
            else if (color === 'auto') {
                //Color will change between light and dark depending on map style.
                this._map.events.add('styledata', function () { _this._mapStyleChanged(); });
                color = this._getColorFromMapStyle();
            }
            var mapContainer = this._map.getMapContainer();
            //Add css for fullscreen.
            var css = this._fullscreenCss.replace(/{elm}/g, '#' + mapContainer.id)
                .replace(/{color}/g, color);
            //Add the CSS style for the control to the DOM.
            var style = document.createElement('style');
            style.innerHTML = css;
            document.body.appendChild(style);
            //Create the fullscreen button.
            this._container = document.createElement('div');
            this._container.classList.add('azure-maps-control-container');
            this._container.setAttribute('aria-label', this._resource.title);
            this._container.style.flexDirection = 'column';
            this._button = document.createElement("button");
            this._button.classList.add('fullscreenMapBtn');
            this._button.classList.add('fullscreenMapExpand');
            this._button.style.backgroundColor = color;
            this._button.setAttribute('title', this._resource.view);
            this._button.setAttribute('alt', this._resource.view);
            this._button.addEventListener('click', function () {
                if (_this.isFullscreen()) {
                    var closeFullScreenFn = document.webkitCancelFullScreen
                        || document['cancelFullScreen']
                        || document['mozCancelFullScreen']
                        || document['msExitFullscreen'];
                    closeFullScreenFn.call(document);
                }
                else {
                    var openFullScreenFn = mapContainer.webkitRequestFullScreen
                        || mapContainer['requestFullScreen']
                        || mapContainer['mozRequestFullScreen']
                        || mapContainer['msRequestFullscreen'];
                    openFullScreenFn.call(mapContainer);
                }
            });
            this._updateBtn();
            this._container.appendChild(this._button);
            var changeEventName;
            if (document['fullscreenchange']) {
                changeEventName = 'fullscreenchange';
            }
            else if (document['webkitCancelFullScreen']) {
                changeEventName = 'webkitfullscreenchange';
            }
            else if (document['mozCancelFullScreen']) {
                changeEventName = 'mozfullscreenchange';
            }
            else if (document['msExitFullscreen']) {
                changeEventName = 'MSFullscreenChange';
            }
            if (changeEventName) {
                document.addEventListener(changeEventName, function () { _this._updateBtn(); });
            }
            return this._container;
        }
        return null;
    };
    /**
     * Action to perform when control is removed from the map.
     */
    FullscreenControl.prototype.onRemove = function () {
        var _this = this;
        if (this._container) {
            this._container.remove();
        }
        if (this._options.style === 'auto') {
            this._map.events.remove('styledata', function () { _this._mapStyleChanged(); });
        }
    };
    /**
     * Determines if the map is in full screen mode or not.
     */
    FullscreenControl.prototype.isFullscreen = function () {
        return !(!document.fullscreenElement &&
            !document['msFullscreenElement'] &&
            !document['mozFullScreenElement'] &&
            !document.webkitFullscreenElement);
    };
    /**
     * Determines if fullscreen can be requested of not.
     */
    FullscreenControl.isSupported = function () {
        return document.fullscreenEnabled ||
            document['msFullscreenEnabled'] ||
            document['mozFullScreenEnabled'] ||
            document.webkitFullscreenEnabled;
    };
    /****************************
     * Private Methods
     ***************************/
    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    FullscreenControl.prototype._mapStyleChanged = function () {
        if (this._button) {
            this._button.style.backgroundColor = this._getColorFromMapStyle();
        }
    };
    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    FullscreenControl.prototype._getColorFromMapStyle = function () {
        var style = this._map.getStyle().style;
        var color = 'white';
        switch (style) {
            //When the style is dark (i.e. satellite, night), show the dark colored theme.
            case 'satellite':
            case 'satellite_road_labels':
            case 'grayscale_dark':
            case 'night':
                color = this._darkColor;
                break;
            //When the style is bright (i.e. road), show the light colored theme.
            case 'road':
            case 'grayscale_light':
            default:
                break;
        }
        return color;
    };
    /**
     * Toggles the fullscreen state of the button.
     */
    FullscreenControl.prototype._updateBtn = function () {
        var ariaLabel = this._resource.view;
        var removeClass, addClass;
        if (this.isFullscreen()) {
            //Is fullscreen, exit.
            ariaLabel = this._resource.exit;
            removeClass = 'fullscreenMapExpand';
            addClass = 'fullscreenMapCollapse';
        }
        else {
            //Make map full screen.
            ariaLabel = this._resource.view;
            removeClass = 'fullscreenMapCollapse';
            addClass = 'fullscreenMapExpand';
        }
        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);
        this._button.classList.remove(removeClass);
        this._button.classList.add(addClass);
    };
    /**
     * Returns the set of translation text resources needed for the fullscreen control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns An object containing text resources in the specified language.
     */
    FullscreenControl._getTranslations = function (lang) {
        if (lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }
        //TODO: Add translations.
        switch (lang) {
            //case 'fr':
            //    return {
            //        exit: 'Plein écran',
            //        view: 'Plein écran',
            //        title: 'Plein écran'
            //    };
            //case 'de':
            //    return {
            //        exit: 'Vollbild',
            //        view: 'Vollbild',
            //        title: 'Vollbild'
            //    };
            case 'en':
            default:
                return {
                    exit: 'Exit Fullscreen',
                    view: 'View Fullscreen',
                    title: 'Fullscreen Control'
                };
        }
    };
    return FullscreenControl;
}());
//# sourceMappingURL=FullScreenControl.js.map