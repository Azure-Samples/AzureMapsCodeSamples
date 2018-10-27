/// <reference path="../../Common/typings/azure-maps-control.d.ts"/>
var FullscreenControl = /** @class */ (function () {
    function FullscreenControl(options) {
        this._options = options || { style: atlas.ControlStyle.light };
    }
    FullscreenControl.prototype.onAdd = function (map, options) {
        var _this = this;
        this._map = map;
        this._resource = FullscreenControl._getTranslations(map);
        this._container = document.createElement("div");
        this._container.classList.add("azure-maps-control-container");
        this._container.setAttribute("aria-label", this._resource.title);
        this._container.style.flexDirection = "column";
        this._button = document.createElement("button");
        this._button.classList.add("azure-maps-control-button");
        this._button.classList.add("zoom-in");
        this._button.classList.add(this._options.style);
        this._button.setAttribute("title", this._resource.view);
        this._button.setAttribute("alt", this._resource.view);
        this._button.addEventListener("click", function (event) {
            var ariaLabel = _this._resource.view;
            if (_this._isFullscreen) {
                ariaLabel = _this._resource.exit;
            }
            else {
            }
            _this._button.setAttribute("title", ariaLabel);
            _this._button.setAttribute("alt", ariaLabel);
            _this._isFullscreen = !_this._isFullscreen;
        });
        this._container.appendChild(this._button);
        return this._container;
    };
    FullscreenControl.prototype.onRemove = function () {
        this._container.remove();
    };
    FullscreenControl.prototype.isFullscreen = function () {
        return this._isFullscreen;
    };
    FullscreenControl._getTranslations = function (map) {
        switch (map.getStyle().language) {
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