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
/** A control that allows swiping between two overlapping maps. */
class SwipeMapControl {
    /****************************
     * Constructor
     ***************************/
    /**
     * A control that allows swiping between two overlapping maps.
     * @param primaryMap The left or top map to swipe between.
     * @param secondaryMap The right or bottom map to swipe between.
     * @param options The options for the control.
     */
    constructor(primaryMap, secondaryMap, options) {
        this._options = {
            interactive: true,
            style: 'light',
            orientation: 'vertical'
        };
        this._syncEvents = [];
        this._maps = [];
        this._canMove = false;
        this._darkColor = '#011c2c';
        /** When the mouse is down, allow moving of the swipe slider, but don't show the accessibility outline.  */
        this._mouseDown = () => {
            this._canMove = true;
            this._swipeHandle.style.outlineWidth = '0';
        };
        /** When mouse up, don't allow moving anymore, and set the accessibility outline for when the handle has focus (i.e. by tabbing to it).*/
        this._mouseUp = () => {
            this._canMove = false;
            this._swipeHandle.style.outlineWidth = '1px';
            //Lose focus of handle.
            this._swipeHandle.blur();
        };
        /** On touch start, allow moving. */
        this._touchStart = () => {
            this._canMove = true;
        };
        /** On touch end, don't allow moving */
        this._touchEnd = () => {
            this._canMove = false;
        };
        /** When a keyup occurs on the handle, clear the repeater used to animate the slider when arrows keys are held down. */
        this._keyUp = (e) => {
            window.clearInterval(this._keyRepater);
            this._keyRepater = null;
        };
        /** On key down on the swipe handle, let the left and right arrow keys move the slider. */
        this._keyDown = (e) => {
            if (this._keyRepater) {
                window.clearInterval(this._keyRepater);
            }
            if (this._options.orientation === 'vertical') {
                //If the left or right arrows are pressed, move the slider position. 
                if (e.keyCode === 37 || e.keyCode === 39) {
                    //Use an interval to animate the slider position when the arrow keys are held down. 
                    this._keyRepater = window.setInterval(() => {
                        this._setSliderPosition(this._options.sliderPosition + ((e.keyCode === 37) ? -1 : 1));
                    }, 1);
                }
            }
            else {
                //If the up or down arrows are pressed, move the slider position. 
                if (e.keyCode === 38 || e.keyCode === 40) {
                    //Use an interval to animate the slider position when the arrow keys are held down. 
                    this._keyRepater = window.setInterval(() => {
                        this._setSliderPosition(this._options.sliderPosition + ((e.keyCode === 38) ? -1 : 1));
                    }, 1);
                }
            }
        };
        /** When the right map is resized, update the slider position. */
        this._mapResized = () => {
            this._rightMapClientRect = this._secondaryMap.getMapContainer().getBoundingClientRect();
            if (typeof this._options.sliderPosition == 'number') {
                this._setSliderPosition(this._options.sliderPosition);
            }
        };
        /** Mouse move event handler. As the mouse moves, the slider moves with it. */
        this._mouseMove = (e) => {
            this._container.style.pointerEvents = 'auto';
            this._swipeHandle.style.pointerEvents = 'auto';
            if (this._canMove && this._options.interactive) {
                var x = 0;
                if (this._options.orientation === 'vertical') {
                    if (e.touches) {
                        x = e.touches[0].clientX;
                    }
                    else {
                        x = e.clientX;
                    }
                    x -= this._rightMapClientRect.left;
                }
                else {
                    if (e.touches) {
                        x = e.touches[0].clientY;
                    }
                    else {
                        x = e.clientY;
                    }
                    x -= this._rightMapClientRect.top;
                }
                this._setSliderPosition(x);
            }
        };
        this._primaryMap = primaryMap;
        this._secondaryMap = secondaryMap;
        var positionSet = false;
        //Update the options.
        if (options) {
            if (typeof options.sliderPosition === 'number') {
                this._options.sliderPosition = options.sliderPosition;
                positionSet = true;
            }
            if (typeof options.interactive === 'boolean') {
                this._options.interactive = options.interactive;
            }
            if (options.style) {
                this._options.style = options.style;
            }
            if (options.orientation === 'horizontal') {
                this._options.orientation = options.orientation;
            }
            if (options.positionChanged) {
                this._options.positionChanged = options.positionChanged;
            }
        }
        //If position not set, default the slider position to the middle of the maps.
        if (!positionSet) {
            if (this._options.orientation === 'vertical') {
                this._options.sliderPosition = this._primaryMap.getMapContainer().getBoundingClientRect().width / 2;
            }
            else {
                this._options.sliderPosition = this._primaryMap.getMapContainer().getBoundingClientRect().height / 2;
            }
        }
        //Initialize the control.
        this.init();
    }
    /****************************
     * Public Methods
     ***************************/
    /** Dispose the swipe map control and clean up its resources. */
    dispose() {
        //Remove event handlers.
        this._swipeHandle.removeEventListener('mousedown', this._mouseDown, false);
        this._swipeHandle.removeEventListener('touchstart', this._touchStart, false);
        this._swipeHandle.removeEventListener('keydown', this._keyDown, false);
        this._swipeHandle.removeEventListener('keyup', this._touchStart, false);
        document.removeEventListener('touchend', this._touchEnd, false);
        document.removeEventListener('mouseup', this._mouseUp, false);
        document.removeEventListener('touchmove', this._mouseMove, false);
        document.removeEventListener('mousemove', this._mouseMove, false);
        this._secondaryMap.events.remove('resize', this._mapResized);
        this._detachMapMoveHandlers();
        this._options = null;
        //Remove swipe map container.
        this._primaryMap.getMapContainer().removeChild(this._container);
        this._container = null;
        this._swipeHandle = null;
        this._secondaryMap = null;
        this._rightMapClientRect = null;
        this._primaryMap = null;
    }
    /** Gets the options of the swipe map control. */
    getOptions() {
        return this._options;
    }
    /**
     * Sets the options of the control.
     * @param options The options to update.
     */
    setOptions(options) {
        if (options) {
            if (options.positionChanged) {
                this._options.positionChanged = options.positionChanged;
            }
            if (options.orientation !== this._options.orientation && (options.orientation === 'vertical' || options.orientation === 'horizontal')) {
                if (options.orientation === 'horizontal') {
                    this._container.style.flexDirection = 'row';
                    if (!this._container.classList.contains('azure-maps-swipe-map-horizontal')) {
                        this._container.classList.add('azure-maps-swipe-map-horizontal');
                        this._swipeHandle.classList.add('azure-maps-swipe-map-handle-horizontal');
                        if (typeof options.sliderPosition === 'undefined') {
                            options.sliderPosition = this._primaryMap.getMapContainer().getBoundingClientRect().height / 2;
                        }
                    }
                }
                else {
                    this._container.style.flexDirection = 'column';
                    if (this._container.classList.contains('azure-maps-swipe-map-horizontal')) {
                        this._container.classList.remove('azure-maps-swipe-map-horizontal');
                        this._swipeHandle.classList.remove('azure-maps-swipe-map-handle-horizontal');
                        if (typeof options.sliderPosition === 'undefined') {
                            options.sliderPosition = this._primaryMap.getMapContainer().getBoundingClientRect().width / 2;
                        }
                    }
                }
                this._options.orientation = options.orientation;
            }
            if (typeof options.sliderPosition === 'number') {
                this._setSliderPosition(options.sliderPosition);
            }
            if (typeof options.interactive === 'boolean') {
                this._options.interactive = options.interactive;
                //Hide the swipe handle if not interactive.
                this._swipeHandle.style.display = (options.interactive) ? '' : 'none';
            }
            if (options.style) {
                var color = options.style;
                if (color === 'light') {
                    color = 'white';
                }
                else if (color === 'dark') {
                    color = this._darkColor;
                }
                this._container.style.backgroundColor = color;
                this._swipeHandle.style.backgroundColor = color;
                this._options.style = options.style;
            }
        }
    }
    /****************************
     * Private Methods
     ***************************/
    /** Initialization functionality for the control. */
    init() {
        if (this._primaryMap && this._secondaryMap) {
            //Add css for swipe map control to the DOM.
            var style = document.createElement('style');
            style.innerHTML = ".azure-maps-swipe-map {background-color: #fff;position: absolute;width: 2px;height: 100%;z-index: 1;}.azure-maps-swipe-map-handle {display: inline-block;position: absolute;width: 32px;height: 32px;top: 50%;left: -16px;margin: -16px 1px 0;color: #fff;border-radius:50%;background-color: #fff;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAwCAMAAACosONjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURQAAAJmcoZicodcOpRoAAAACdFJOUwDRh0cvegAAAAlwSFlzAAAXEQAAFxEByibzPwAAAIZJREFUOE+1yLENADAMw7C0/x9dIOCiA6rFoOduowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCiCs/mq4GszD2yuBkOkUL4BAAAAAElFTkSuQmCC);text-align: center;cursor: pointer;background-repeat: no-repeat;background-size: 10px;background-position: center center;z-index: 200;box-shadow: 0 0 1px 1px rgba(0,0,0,0.16);}.azure-maps-swipe-map .azure-maps-swipe-map-handle:hover, .azure-maps-swipe-map .azure-maps-swipe-map-handle:focus {cursor: col-resize;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAwCAMAAACosONjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURQAAADGszjGszjTHRZ8AAAACdFJOUwDRh0cvegAAAAlwSFlzAAAXEQAAFxEByibzPwAAAIZJREFUOE+1yLENADAMw7C0/x9dIOCiA6rFoOduowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCgCowiMIjCKwCiCs/mq4GszD2yuBkOkUL4BAAAAAElFTkSuQmCC);}.azure-maps-swipe-map-horizontal {width: 100%;height: 2px;}.azure-maps-swipe-map-handle-horizontal {top: -16px;left: 50%;margin: -1px 0 0 -16px;background-size: 13px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAiCAMAAAAuwqolAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURQAAAJmcoZicodcOpRoAAAACdFJOUwDRh0cvegAAAAlwSFlzAAAXEQAAFxEByibzPwAAADNJREFUOE9jAAImEgDjiNUwCgYHgMYJUWDYJD4omygA1jAKBgeAxglRYNgkPiibGMDECABcmQZDAe+s0gAAAABJRU5ErkJggg==);}.azure-maps-swipe-map .azure-maps-swipe-map-handle-horizontal:hover, .azure-maps-swipe-map .azure-maps-swipe-map-handle-horizontal:focus {cursor: row-resize;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAiCAMAAAAuwqolAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURQAAADGszjGszjTHRZ8AAAACdFJOUwDRh0cvegAAAAlwSFlzAAAXEQAAFxEByibzPwAAADNJREFUOE9jAAImEgDjiNUwCgYHgMYJUWDYJD4omygA1jAKBgeAxglRYNgkPiibGMDECABcmQZDAe+s0gAAAABJRU5ErkJggg==);}";
            document.body.appendChild(style);
            //Retrieve the arial label for the control. 
            var ariaLabel = SwipeMapControl._getAriaLabel(this._primaryMap.getStyle().language);
            //Create a container for the control.
            this._container = document.createElement('div');
            this._container.classList.add('azure-maps-swipe-map');
            this._container.setAttribute('aria-label', ariaLabel);
            this._container.style.flexDirection = 'column';
            //Create a handle for the swipe control.
            this._swipeHandle = document.createElement('div');
            this._swipeHandle.classList.add('azure-maps-swipe-map-handle');
            this._swipeHandle.setAttribute('tabindex', '0');
            this._swipeHandle.setAttribute('title', ariaLabel);
            this._swipeHandle.setAttribute('alt', ariaLabel);
            if (this._options.orientation === 'horizontal') {
                this._container.style.flexDirection = 'row';
                this._container.classList.add('azure-maps-swipe-map-horizontal');
                this._swipeHandle.classList.add('azure-maps-swipe-map-handle-horizontal');
            }
            this._container.style.msUserSelect = 'none';
            this._container.style.webkitUserSelect = 'none';
            this._container.style.userSelect = 'none';
            this._swipeHandle.addEventListener('mousedown', this._mouseDown, false);
            this._swipeHandle.addEventListener('touchstart', this._touchStart, false);
            this._swipeHandle.addEventListener('keydown', this._keyDown, false);
            this._swipeHandle.addEventListener('keyup', this._keyUp, false);
            document.addEventListener('touchend', this._touchEnd, false);
            document.addEventListener('mouseup', this._mouseUp, false);
            document.addEventListener('touchmove', this._mouseMove, false);
            document.addEventListener('mousemove', this._mouseMove, false);
            this._container.appendChild(this._swipeHandle);
            this._primaryMap.getMapContainer().appendChild(this._container);
            this._rightMapClientRect = this._secondaryMap.getMapContainer().getBoundingClientRect();
            //If the size of the right map is changed, update the slider position. 
            this._secondaryMap.events.add('resize', this._mapResized);
            this._maps = [this._primaryMap, this._secondaryMap];
            //Bind sync events and synchronize the map views.
            this._maps.forEach((map, index) => {
                this._syncEvents[index] = this._synchronizeMaps.bind(this, map);
            });
            //Sync all map views with the first map.
            this._syncEvents[0]();
            //Attach the map move handler.
            this._attachMapMoveHandlers();
            //Set the initial options of the control. 
            this.setOptions(this._options);
        }
    }
    /** Attach map move handlers to the maps to synchronize them. */
    _attachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.add('move', this._syncEvents[index]);
        });
    }
    /** Detach map move handlers to the maps. */
    _detachMapMoveHandlers() {
        this._maps.forEach((map, index) => {
            map.events.remove('move', this._syncEvents[index]);
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
    /**
     * Sets the swipe slider position.
     * @param x The position to set the slider position to.
     */
    _setSliderPosition(x) {
        if (this._options.orientation === 'vertical') {
            x = Math.max(Math.min(x, this._rightMapClientRect.width), 0);
            var transform = 'translate(' + x + 'px, 0)';
            this._secondaryMap.getMapContainer().style.clip = 'rect(0, 999em, ' + this._rightMapClientRect.height + 'px,' + x + 'px)';
        }
        else {
            x = Math.max(Math.min(x, this._rightMapClientRect.height), 0);
            var transform = 'translate(0, ' + x + 'px)';
            this._secondaryMap.getMapContainer().style.clip = 'rect(' + x + 'px, 999em, 999em, 0)';
        }
        this._container.style.transform = transform;
        this._container.style.webkitTransform = transform;
        this._options.sliderPosition = x;
        if (this._options.positionChanged) {
            this._options.positionChanged(x);
        }
    }
    /**
    * Returns the aria label for the control for a given language.
    * @param lang The language code to retrieve the aria label for.
    * @returns The aria label for the control in the specified language.
    */
    static _getAriaLabel(lang) {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }
        switch (lang) {
            case 'af':
                return 'Sleep sien onderliggende data';
            case 'ar':
                return 'اسحب لرؤية البيانات الاساسيه';
            case 'eu':
                return 'Arrastatu azpiko datuak ikusteko';
            case 'bg':
                return 'Плъзнете, за да видите основните данни';
            case 'zh':
                return '拖动以查看基础数据';
            case 'hr':
                return 'Vucite da biste vidjeli temeljne podatke';
            case 'cs':
                return 'Přetažením zobrazíte podkladová data.';
            case 'da':
                return 'Træk for at se underliggende data';
            case 'nl':
                return 'Slepen om onderliggende gegevens weer te geven';
            case 'et':
                return 'Alusandmete nägemiseks lohistage';
            case 'fi':
                return 'Näytä pohjana olevat tiedot vetämällä';
            case 'fr':
                return 'Faites glisser pour voir les données sous-jacentes';
            case 'gl':
                return 'Arrastre para ver os datos subxacentes';
            case 'de':
                return 'Ziehen Sie, um die zugrunde liegenden Daten zu sehen';
            case 'el':
                return 'Σύρετε για να δείτε τα υποκείμενα δεδομένα';
            case 'hi':
                return 'अंतर्निहित डेटा देखने के लिए खींचें';
            case 'hu':
                return 'Húzással láthatja az alapul szolgáló adatokat';
            case 'id':
                return 'Seret untuk melihat data yang mendasari';
            case 'it':
                return 'Trascinare per visualizzare i dati sottostanti';
            case 'ja':
                return 'ドラッグして基になるデータを表示';
            case 'kk':
                return 'Негізгі деректерді көру үшін сүйреңіз';
            case 'ko':
                return '기본 데이터를 보려면 끕니다.';
            case 'es':
                return 'Arrastre para ver los datos subyacentes';
            case 'lv':
                return 'Velciet, lai skatītu pamatā esošos datus';
            case 'lt':
                return 'Vilkite, kad pamatytumėte pagrindinius duomenis';
            case 'ms':
                return 'Seret untuk melihat data asas';
            case 'nb':
                return 'Dra for å se underliggende data';
            case 'pl':
                return 'Przeciągnij, aby wyświetlić dane bazowe';
            case 'pt':
                return 'Arraste para ver os dados subjacentes';
            case 'ro':
                return 'Glisați pentru a vedea datele subiacente';
            case 'ru':
                return 'Перетаскивание для просмотра базовых данных';
            case 'sr':
                return 'Prevucite da biste videli osnovne podatke';
            case 'sk':
                return 'Presunutím zobrazíte základné údaje';
            case 'sl':
                return 'Povlecite za prikaz osnovnih podatkov';
            case 'sv':
                return 'Dra för att Visa underliggande data';
            case 'th':
                return 'ลากเพื่อดูข้อมูลพื้นฐาน';
            case 'tr':
                return 'Alttaki verileri görmek için sürükleyin';
            case 'uk':
                return 'Перетягніть, щоб переглянути основні дані';
            case 'vi':
                return 'Kéo để xem dữ liệu cơ bản';
            case 'en':
            case 'ngt':
            default:
                return 'Drag to see underlying data';
        }
    }
}
//# sourceMappingURL=SwipeMapModule.js.map