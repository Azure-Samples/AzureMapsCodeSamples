
interface DynamicPopupOptions {

    /** The content to display within the popup. */
    content?: HTMLElement | string;

    /** Specifies the fill color of the popup. default "#FFFFFF". */
    fillColor?: string

    /** 
     *  An array of [pixelsRight, pixelsDown] for how many pixels to the right and down the anchor of the popup should be offset. 
     * Negative numbers can be used to offset the popup left and up. default [0, 0] 
     */
    pixelOffset?: atlas.Pixel;

    /** The position on the map where the popup should be anchored. default [0, 0] */
    position?: atlas.data.Position;

    showArrow?: boolean;

    showCloseButton?: boolean;

    orientation: 'horizontal' | 'vertical';
}

class DynamicPopup extends atlas.HtmlMarker {
    private _options: DynamicPopupOptions = {
        content: null,
        position: [0, 0],
        pixelOffset: [0,0],
        fillColor: '#FFFFFF',
        showArrow: true,
        orientation: 'vertical'
    };

    private _map: atlas.Map;
    private _container: HTMLElement;
    private _arrowWidth: number = 30;
    private _arrowLength: number = 8;

    constructor(options: DynamicPopupOptions) {
        super({
            position: options.position,
            anchor: 'top-left'
        });

        this._container = document.createElement('div');

        Object.assign(this._container.style, {
            position: 'absolute',
            zIndex: 10000
        });

        this.setOptions(options);

        super.setOptions({ htmlContent: this._container });
    }

    public getOptions(): DynamicPopupOptions {
        return this._options;
    }

    public setOptions(options?: DynamicPopupOptions) {
        if (options) {
            if (options.fillColor && options.fillColor !== this._options.fillColor) {
                this._options.fillColor = options.fillColor;
            }

            if (options.position) {
                this._options.position = options.position;
            }

            if (options.pixelOffset) {
                this._options.pixelOffset = options.pixelOffset;
            }

            if (options.content) {
                this._options.content = options.content;
            }

            this._render();
        }
    }

    /**
     * Open the popup.
     * @param map The map to open the popup on.
     */
    public open(map: atlas.Map): void {
        if (this._map !== map) {
            this._updateMapReference(map);
        }

        super.setOptions({ visible: true });

        this._render();
    }

    /**
     * Close the popup.
     */
    public close(): void {
        super.setOptions({ visible: false });
    }

    /***************************
     * Private functions
     **************************/

    /**
    * The map has moved.
    */
    private _mapMoved = (): void => {
        if (this._map && super.getOptions().visible) {
            this._render();
        }
    }

    private _render(): void {
        if (this._map) {
            var mapContainer = this._map.getCanvasContainer();
            var mapStyle = getComputedStyle(mapContainer);
            var mapWidth = parseFloat(mapStyle.width);
            var mapHeight = parseFloat(mapStyle.height);

            var pinPixel = this._map.positionsToPixels([this._options.position])[0];
            var key = (mapHeight * 0.5 < pinPixel[1]) ? 2 : 0; //Determine the quadrant that the pushpin is in. 
            key += (mapWidth * 0.5 < pinPixel[0]) ? 1 : 0;

           var content = document.createElement('div');

            Object.assign(content.style, {
                position: 'relative',
                float: 'left',
                backgroundColor: this._options.fillColor
            });

            if (this._options.content) {
                if (typeof this._options.content === 'string') {
                    content.innerHTML += this._options.content;
                } else {
                    content.appendChild(this._options.content);
                }
            }

            var arrowX = 0, arrowY = 0;

            while (this._container.hasChildNodes()) {
                this._container.removeChild(this._container.lastChild);
            }

            if (this._options.showArrow) {
                if (this._options.orientation === 'vertical') { //vertical arrow
                    arrowX = this._arrowWidth;
                    arrowY = this._arrowLength;

                    if (key > 1) {  //down
                        this._container.appendChild(content);
                        this._container.innerHTML += this._createArrow(2);

                        super.setOptions({
                            anchor: 'bottom-left'
                        });
                    } else {        //up
                        this._container.innerHTML += this._createArrow(0);
                        this._container.appendChild(content);

                        super.setOptions({
                            anchor: 'top-left'
                        });
                    }
                } else {
                    arrowX = this._arrowLength;
                    arrowY = this._arrowWidth;

                    if (key % 2) {  //right arrow
                        this._container.appendChild(content);
                        this._container.innerHTML += this._createArrow(1);
                    } else {        //left
                        this._container.innerHTML += this._createArrow(3);
                        this._container.appendChild(content);
                    }
                }
            } else {
                this._container.appendChild(content);
            }

            var contentStyle = getComputedStyle(content);

            //Add close button if enabled
            if (this._options.showCloseButton) {
                //contentContainer.append("<span id='" + _infoboxContainerId + "_closeBtn' href='javascript:void()' style='position:absolute;right:5px;top:2px;cursor:pointer;font:bold 18px Arial;line-height:12px;'>x</span>");
                //$('#' + _infoboxContainerId + '_closeBtn').click(function () {
                //    _hide();
                //});
            }

            //Get dimensions of contents
            var contentX = parseFloat(contentStyle.width);
            var contentY = parseFloat(contentStyle.height);

            var w = 0, h = 0, arrowOffsetTop = 0, arrowOffsetLeft = 0;

            var screenX = 0, screenY = 0;

            //Calculate dimensions of popup container
            if (this._options.orientation === 'vertical') {
                w = contentX;
                h = contentY + arrowY;

                if (key % 2) {  //content left
                    arrowOffsetLeft = w - this._arrowWidth;
                    screenX += this._options.pixelOffset[0] - w + this._arrowWidth * 0.5;
                } else {
                    screenX += this._options.pixelOffset[0] - this._arrowWidth * 0.5;
                }

                if (key > 1) {  //bottom
                    screenY -= h + this._options.pixelOffset[1];
                } else {
                    screenY -= this._options.pixelOffset[1];
                }
            } else {
                w = arrowX + contentX + 2;  //The 2 is to make up for the boarder on the contents
                h = Math.max(contentY, arrowY);

                if (key % 2) {  //right arrow
                    screenX += this._options.pixelOffset[0] - w;
                } else {        //left
                    screenX += this._options.pixelOffset[0];
                }

                if (key > 1) {
                    arrowOffsetTop = h - this._arrowWidth;
                    screenY -= h - this._arrowWidth * 0.5 + this._options.pixelOffset[1];
                } else {
                    screenY -= (this._arrowWidth * 0.5 + this._options.pixelOffset[1]);
                }
            }

            if (this._options.showArrow) {
                //var arrow = $('#' + _infoboxContainerId + '_arrow');
                //arrow.css({ 'margin-left': Math.ceil(arrowOffsetLeft) + 'px', 'margin-top': Math.ceil(arrowOffsetTop) + 'px' });
            }

            Object.assign(this._container.style, {
                width: Math.ceil(w) + 'px',
                hright: Math.ceil(h) + 'px',
                top: screenY + 'px',
                left: screenX + 'px',
            });
        }
    }

    private _updateMapReference(map: atlas.Map): void {
        if (this._map) {
            this._map.markers.remove(this);
            this._map.events.remove('move', this._mapMoved);
            this._map = null;
        }

        this._map = map;
        this._map.markers.add(this);
        this._map.events.add('move', this._mapMoved);
    }

    private _createArrow(direction: number): string {
        var html = ["<div style='position:relative;float:left;width:0;height:0;line-height:0;border-style:solid;"];
        var w = this._arrowWidth * 0.5;

        switch (direction) {
            case 0: 	//Point up
                html.push("border-width:0 ", w.toString(), "px ", this._arrowLength.toString(), "px ", w.toString(), "px;");
                html.push("border-color:transparent transparent ", this._options.fillColor, " transparent;");
                break;
            case 1: 	//Point Right
                html.push("border-width:", w.toString(), "px 0 ", w.toString(), "px ", this._arrowLength.toString(), "px;");
                html.push("border-color:transparent transparent transparent ", this._options.fillColor, ";");
                break;
            case 2: 	//Point Down
                html.push("border-width:", this._arrowLength.toString(), "px ", w.toString(), "px 0 ", w.toString(), "px;");
                html.push("border-color:", this._options.fillColor, " transparent transparent transparent;");
                break;
            case 3: 	//Point Left
                html.push("border-width:", w.toString(), "px ", this._arrowWidth.toString(), "px ", w.toString(), "px 0;");
                html.push("border-color:transparent ", this._options.fillColor, " transparent transparent;");
                break;
        }

        html.push("'></div>");

        return html.join('');
    }
}