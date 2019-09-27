
/** Options for the GeolocationControl. */
interface GeolocationControlOptions {
    /**
    * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
    * Default `light'.
    * @default light
    */
    style?: atlas.ControlStyle | string;

    /** A Geolocation API PositionOptions object. Default: {enableHighAccuracy:false,timeout:6000} */
    positionOptions?: PositionOptions;

    /** Shows the users location on the map using a marker. Default: true */
    showUserLocation?: boolean;

    /** If true the Geolocation Control becomes a toggle button and when active the map will receive updates to the user's location as it changes. Default: false */
    trackUserLocation?: boolean;

    /** The color of the user location marker. Default: DodgerBlue */
    markerColor?: string;
}

/**
 * An object that represents the traffic control text resources.
 */
interface GeolocationTranslation {
    /** Start tracking */
    enableTracking: string;

    /** Stop tracking */
    disableTracking: string;

    /** My location */
    myLocation: string;

    /** Geolocation control */
    title: string;
}

/** A control that uses the browser's geolocation API to locate the user on the map. */
class GeolocationControl implements atlas.Control {
    /****************************
    * Private Properties
    ***************************/

    private _container: HTMLElement;
    private _button: HTMLButtonElement;
    private _options: GeolocationControlOptions = {
        style: 'light',
        positionOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 6000 
        },
        showUserLocation: true,
        trackUserLocation: false,
        markerColor: 'DodgerBlue'
    };
    private _darkColor = '#011c2c';
    private _map: atlas.Map;
    private _resource: GeolocationTranslation;
    private _gpsMarker: atlas.HtmlMarker;

    private _watchId: number;
    private _isActive = false;
    private _updateMapCamera = true;
    private _lastKnownLocation: Position;

    private _gpsArrowIcon = '<div style="{transform}"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><g transform="translate(2 2)"><polygon points="12,0 0,24 12,17 24,24" stroke-width="2" stroke="white" fill="{color}"/></g></svg></div>';
    private _gpsDotIcon = '<div class="atlas-map-gpsPulseIcon" style="background-color:{color}"></div>';

    private _iconTemplate = "data:image/svg+xml;utf8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 561 561' xml:space='preserve'><g fill='{color}'><path d='M280.5,178.5c-56.1,0-102,45.9-102,102c0,56.1,45.9,102,102,102c56.1,0,102-45.9,102-102C382.5,224.4,336.6,178.5,280.5,178.5z M507.45,255C494.7,147.9,410.55,63.75,306,53.55V0h-51v53.55C147.9,63.75,63.75,147.9,53.55,255H0v51h53.55C66.3,413.1,150.45,497.25,255,507.45V561h51v-53.55C413.1,494.7,497.25,410.55,507.45,306H561v-51H507.45z M280.5,459C181.05,459,102,379.95,102,280.5S181.05,102,280.5,102S459,181.05,459,280.5S379.95,459,280.5,459z'/></g></svg>";

    private _gpsBtnCss =
        '.atlas-map-gpsBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);}' +
        '.atlas-map-gpsDisabled{background-image:url("{grayIcon}");}' +
        '.atlas-map-gpsDisabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}' +
        '.atlas-map-gpsEnabled{background-image:url("{blueIcon}");}' +
        '.atlas-map-gpsEnabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}' + 
        '.atlas-map-gpsPulseIcon {display: block;width: 15px;height: 15px;border-radius: 50%;background: orange;border: 2px solid white;cursor: pointer;box-shadow: 0 0 0 rgba(0, 204, 255, 0.6);animation: pulse 2s infinite;}@keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(0, 204, 255, 0.6);}70% {box-shadow: 0 0 0 20px rgba(0, 204, 255, 0);}100% {box-shadow: 0 0 0 0 rgba(0, 204, 255, 0);}}';

    /****************************
     * Constructor
     ***************************/

    /**
     * A control that uses the browser's geolocation API to locate the user on the map.
     * @param options Options for defining how the control is rendered and functions.
     */
    constructor(options?: GeolocationControlOptions) {
        if (options) {
            if (options.positionOptions) {
                this._options.positionOptions = Object.assign(this._options.positionOptions, options.positionOptions);
            }

            if (options.style) {
                this._options.style = options.style;
            }

            if (options.markerColor) {
                this._options.markerColor = options.markerColor;
            }

            if (typeof options.showUserLocation === 'boolean') {
                this._options.showUserLocation = options.showUserLocation;
            }

            if (typeof options.trackUserLocation === 'boolean') {
                this._options.trackUserLocation = options.trackUserLocation;
            }
        }
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
    public onAdd(map: atlas.Map, options?: atlas.ControlOptions): HTMLElement {
        this._map = map;

        this._resource = GeolocationControl._getTranslations(this._map.getStyle().language);

        //Create different color icons and merge into CSS.
        var grayIcon = this._iconTemplate.replace('{color}', 'Gray');
        var blueIcon = this._iconTemplate.replace('{color}', 'DeepSkyBlue');
        var css = this._gpsBtnCss.replace(/{grayIcon}/g, grayIcon).replace(/{blueIcon}/g, blueIcon);

        //Add the CSS style for the control to the DOM.
        var style = document.createElement('style');
        style.innerHTML = css;
        document.body.appendChild(style);

        //Create the traffic toggle button.
        this._container = document.createElement('div');
        this._container.classList.add('azure-maps-control-container');
        this._container.setAttribute('aria-label', this._resource.title);
        this._container.style.flexDirection = 'column';

        //Hide the button by default. 
        this._container.style.display = 'none';

        this._button = document.createElement("button");
        this._button.classList.add('atlas-map-gpsBtn');
        this._button.classList.add('atlas-map-gpsDisabled');
        this._button.setAttribute('title', this._resource.enableTracking);
        this._button.setAttribute('alt', this._resource.enableTracking);
        this._button.setAttribute('type', 'button');
        this._button.addEventListener('click', this._toggleBtn);

        this._updateState();
        this.setOptions(this._options);
        this._container.appendChild(this._button);

        //Check that geolocation is supported.
        GeolocationControl.isSupported().then(supported => {
            if (supported) {
                //Show the button when we know geolocaiton is supported.
                this._container.style.display = '';
            }
        });

        this._map.events.add('movestart', this._mapMoveStarted);

        this.setOptions(this._options);
        
        return this._container;
    }

    /**
     * Action to perform when control is removed from the map.
     */
    public onRemove(): void {
        if (this._container) {
            this._container.remove();
        }

        if (this._options.style === 'auto') {
            this._map.events.remove('styledata', this._mapStyleChanged);
        }

        this._map.events.remove('movestart', this._mapMoveStarted);

        if (typeof this._watchId !== 'undefined') {
            navigator.geolocation.clearWatch(this._watchId);
        }

        if (this._gpsMarker) {
            this._map.markers.remove(this._gpsMarker);
        }

        this._map = null;
    }

    /** Gets the options of the geolocation control. */
    public getOptions(): GeolocationControlOptions {
        return Object.assign({}, this._options);
    }

    /**
     * Sets the options of the geolocation control.
     * @param options The options.
     */
    public setOptions(options: GeolocationControlOptions): void {
        if (options) {
            if (this._options.style === 'auto') {
                this._map.events.remove('styledata', this._mapStyleChanged);
            }

            this._options.style = options.style;

            var color = options.style || 'light';

            if (options.style) {
                if (color === 'light') {
                    color = 'white';
                } else if (color === 'dark') {
                    color = this._darkColor;
                } else if (color === 'auto') {
                    //Color will change between light and dark depending on map style.
                    this._map.events.add('styledata', this._mapStyleChanged);
                    color = this._getColorFromMapStyle();
                }
            }

            this._button.style.backgroundColor = color;           

            if (options.markerColor) {
                this._options.markerColor = options.markerColor;

                if (this._gpsMarker) {
                    this._gpsMarker.setOptions({
                        color: options.markerColor
                    });
                }
            }

            if (typeof options.showUserLocation === 'boolean') {
                this._options.showUserLocation = options.showUserLocation;

                if (this._gpsMarker) {
                    this._gpsMarker.setOptions({
                        visible: this._isActive && this._options.showUserLocation
                    });
                } else if (this._lastKnownLocation) {
                    this._onGpsSuccess(this._lastKnownLocation);
                }
            }

            if (typeof options.trackUserLocation === 'boolean') {
                this._options.trackUserLocation = options.trackUserLocation;
            }

            if (options.positionOptions) {
                var opt: PositionOptions = {};

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
                    this._options.positionOptions = Object.assign(this._options.positionOptions, opt);
                    this._stopTracking();
                    this._updateState();
                }
            }
        }
    }

    /**
     * Toggles the state of the GPS button.
     * @param isActive The state to toggle to. If not specified, will toggle to opposite of current state.
     */
    public toggle(isActive: boolean): void {
        this._isActive = (typeof isActive === 'boolean') ? isActive : !this._isActive;

        if (this._isActive && this._options.trackUserLocation && this._lastKnownLocation) {
            this._onGpsSuccess(this._lastKnownLocation);
        }

        this._updateMapCamera = true;
        this._updateState();
    }

    /** Checks to see if the geolocation API is supported in the browser. */
    public static async isSupported(): Promise<boolean> {
        if (window.navigator['permissions']) {
            // navigator.permissions has incomplete browser support
            // http://caniuse.com/#feat=permissions-api
            // Test for the case where a browser disables Geolocation because of an insecure origin.

            var p = await window.navigator['permissions'].query({ name: 'geolocation' });            
            return p.state !== 'denied';
        } 

        return !!window.navigator.geolocation;
    }

    /****************************
     * Private Methods
     ***************************/

    /** Toggles the state of the control. */
    private _toggleBtn = () => {
        this._isActive = !this._isActive;
        this._updateMapCamera = true;
        this._updateState();
    };

    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    private _mapStyleChanged = () => {
        if (this._button) {
            this._button.style.backgroundColor = this._getColorFromMapStyle();
        }
    };

    /**
    * An event handler for when the map starts to move.
    * When this happens, we don't want the map camera to automatically move if tracking.
    */
    private _mapMoveStarted = () => {
        this._updateMapCamera = false;
    };

    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    private _getColorFromMapStyle(): string {
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
    }

    /** Removes the geolocation watcher used for tracking. */
    private _stopTracking(): void {
        if (typeof this._watchId === 'number') {
            navigator.geolocation.clearWatch(this._watchId);
            this._watchId = null;
        }
    }

    /**
     * Updates the state of the button.
     */
    private _updateState(): void {
        if (!this._isActive || this._options.trackUserLocation) {
            this._stopTracking();
        }

        if (this._gpsMarker) {
            this._gpsMarker.setOptions({
                visible: this._isActive && this._options.showUserLocation
            });
        }

        var ariaLabel = this._resource.myLocation;
        var removeClass = 'atlas-map-gpsEnabled';
        var addClass = 'atlas-map-gpsDisabled';

        if (this._isActive) {
            removeClass = 'atlas-map-gpsDisabled';
            addClass = 'atlas-map-gpsEnabled';

            if (this._options.trackUserLocation) {
                if (typeof this._watchId !== 'number') {
                    this._watchId = navigator.geolocation.watchPosition(this._onGpsSuccess, this._onGpsError, this._options.positionOptions);
                }

                ariaLabel = this._resource.disableTracking;
            } else {
                navigator.geolocation.getCurrentPosition(this._onGpsSuccess, this._onGpsError, this._options.positionOptions);
            }           
        } else {
            if (this._options.trackUserLocation) {
                ariaLabel = this._resource.enableTracking;
            }
        }

        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);

        this._button.classList.remove(removeClass);
        this._button.classList.add(addClass);
    }

    /**
     * Callback for when an error occurs when getting the users location.
     * @param position The GPS position information.
     */
    private _onGpsSuccess = (position: Position) => {
        this._lastKnownLocation = position;

        if (this._isActive) {
            var pos = [position.coords.longitude, position.coords.latitude];

            var icon = this._getMarkerIcon();

            if (this._options.showUserLocation) {
                if (!this._gpsMarker) {
                    this._gpsMarker = new atlas.HtmlMarker({
                        position: pos,
                        htmlContent: icon,
                        color: this._options.markerColor
                    });

                    this._map.markers.add(this._gpsMarker);
                } else {
                    this._gpsMarker.setOptions({
                        position: pos,
                        htmlContent: icon,
                        visible: this._isActive && this._options.showUserLocation
                    });
                }
            } else {
                this._gpsMarker.setOptions({
                    visible: false
                });
            }

            if (this._updateMapCamera) {
                var opt: any = {
                    center: pos
                };

                //Only adjust zoom if the user is zoomed out too much.
                if (this._map.getCamera().zoom < 15) {
                    opt.zoom = 15;
                }

                this._map.setCamera(opt);
            }
        }
    };

    /**
     * Callback for when an error occurs when getting the users location.
     * @param error The error that occured.
     */
    private _onGpsError = (error: PositionError) => {
        this._watchId = null;
        this._isActive = false;
        this._updateState();
    }

    /** Generates the mark icon HTML */
    private _getMarkerIcon(): string {
        var icon = this._gpsDotIcon;

        var h = this._lastKnownLocation.coords.heading;

        if (this._options.trackUserLocation && h !== null && !isNaN(h)) {
            h = Math.round(h);
            var transform = `-webkit-transform:rotate(${h}deg);transform:rotate(${h}deg)`;
            icon = this._gpsArrowIcon.replace('{transform}', transform);

        }

        return icon;
    }

    /**
     * Returns the set of translation text resources needed for the control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns An object containing text resources in the specified language.
     */
    private static _getTranslations(lang?: string): GeolocationTranslation {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }

        switch (lang.toLowerCase()) {
            //Afrikaans
            case 'af':
                return { enableTracking: 'begin dop', disableTracking: 'stop die dop', myLocation: 'my plek', title: 'ligginggewing beheer' };
            //Arabic
            case 'ar':
                return { enableTracking: 'بدء تتبع', disableTracking: 'تتبع توقف', myLocation: 'موقعي', title: 'السيطرة تحديد الموقع الجغرافي' };
            //Basque
            case 'eu':
                return { enableTracking: 'Hasi segimendua', disableTracking: 'Stop jarraipena', myLocation: 'Nire kokapena', title: 'Geokokapen kontrol' };
            //Bulgarian
            case 'bg':
                return { enableTracking: 'Започнете да проследявате', disableTracking: 'Спиране на проследяването', myLocation: 'Моето място', title: 'контрол за геолокация' };
            //Chinese
            case 'zh':
                return { enableTracking: '开始跟踪', disableTracking: '停止追踪', myLocation: '我的位置', title: '地理位置控制' };
            //Croatian
            case 'hr':
                return { enableTracking: 'Započnite praćenje', disableTracking: 'zaustavljanje praćenje', myLocation: 'Moja lokacija', title: 'kontrola Geolocation' };
            //Czech
            case 'cs':
                return { enableTracking: 'začít sledovat', disableTracking: 'Zastavit sledování', myLocation: 'Moje lokace', title: 'ovládání Geolocation' };
            //Danish
            case 'da':
                return { enableTracking: 'Start sporing', disableTracking: 'Stop sporing', myLocation: 'min placering', title: 'Geolocation kontrol' };
            //Dutch
            case 'nl':
                return { enableTracking: 'beginnen met het bijhouden', disableTracking: 'stop volgen', myLocation: 'Mijn locatie', title: 'Geolocation controle' };
            //Estonian
            case 'et':
                return { enableTracking: 'Alusta jälgimist', disableTracking: 'Stopp jälgimise', myLocation: 'Minu asukoht', title: 'Geolocation kontrolli' };
            //Finnish
            case 'fi':
                return { enableTracking: 'Aloita seuranta', disableTracking: 'Lopeta seuranta', myLocation: 'Minun sijaintini', title: 'Geolocation ohjaus' };
            //French
            case 'fr':
                return { enableTracking: 'Démarrer le suivi', disableTracking: "suivi d'arrêt", myLocation: 'Ma position', title: 'le contrôle de géolocalisation' };
            //Galician
            case 'gl':
                return { enableTracking: 'comezar a controlar', disableTracking: 'seguimento parada', myLocation: 'A miña localización', title: 'control de xeolocalización' };
            //German
            case 'de':
                return { enableTracking: 'starten Sie Tracking', disableTracking: 'Stop-Tracking', myLocation: 'Mein Standort', title: 'Geolokalisierung Steuer' };
            //Greek
            case 'el':
                return { enableTracking: 'Ξεκινήστε την παρακολούθηση', disableTracking: 'Διακοπή παρακολούθησης', myLocation: 'Η τοποθεσία μου', title: 'ελέγχου geolocation' };
            //Hindi
            case 'hi':
                return { enableTracking: 'ट्रैक करना शुरू', disableTracking: 'बंद करो ट्रैकिंग', myLocation: 'मेरा स्थान', title: 'जियोलोकेशन नियंत्रण' };
            //Hungarian
            case 'hu':
                return { enableTracking: 'követés indítása', disableTracking: 'követés leállítása', myLocation: 'Saját hely', title: 'Geolocation ellenőrzés' };
            //Indonesian
            case 'id':
                return { enableTracking: 'Mulai pelacakan', disableTracking: 'berhenti pelacakan', myLocation: 'Lokasi saya', title: 'kontrol geolocation' };
            //Italian
            case 'it':
                return { enableTracking: 'Inizia il monitoraggio', disableTracking: 'monitoraggio arresto', myLocation: 'La mia posizione', title: 'controllo geolocalizzazione' };
            //Japanese
            case 'ja':
                return { enableTracking: '追跡を開始', disableTracking: '追跡を停止', myLocation: '私の場所', title: 'ジオロケーション制御' };
            //Kazakh
            case 'kk':
                return { enableTracking: 'қадағалау бастау', disableTracking: 'қадағалау тоқтату', myLocation: 'Менің орналасуы', title: 'геоорын бақылау' };
            //Korean
            case 'ko':
                return { enableTracking: '추적 시작', disableTracking: '정지 추적', myLocation: '내 위치', title: '위치 정보 제어' };
            //Spanish
            case 'es':
                return { enableTracking: 'iniciar el seguimiento', disableTracking: 'Detener el seguimiento', myLocation: 'Mi ubicacion', title: 'control de geolocalización' };
            //Latvian
            case 'lv':
                return { enableTracking: 'Sākt izsekošana', disableTracking: 'Stop izsekošana', myLocation: 'Mana atrašanās vieta', title: 'Geolocation kontrole' };
            //Lithuanian
            case 'lt':
                return { enableTracking: 'pradėti stebėti', disableTracking: 'Sustabdyti sekimo', myLocation: 'Mano vieta', title: 'Geografinė padėtis kontrolė' };
            //Malay
            case 'ms':
                return { enableTracking: 'mula menjejaki', disableTracking: 'Stop pengesanan', myLocation: 'Lokasi saya', title: 'kawalan geolokasi' };
            //Norwegian
            case 'nb':
                return { enableTracking: 'begynne å spore', disableTracking: 'stopp sporing', myLocation: 'Min posisjon', title: 'geolocation kontroll' };
            //Polish
            case 'pl':
                return { enableTracking: 'rozpocząć śledzenie', disableTracking: 'Zatrzymaj śledzenie', myLocation: 'Moja lokacja', title: 'kontrola Geolokalizacja' };
            //Portuguese
            case 'pt':
                return { enableTracking: 'começar a controlar', disableTracking: 'rastreamento parada', myLocation: 'Minha localização', title: 'controle de geolocalização' };
            //Romanian
            case 'ro':
                return { enableTracking: 'Pornire urmărire', disableTracking: 'Oprire urmărire', myLocation: 'Locatia mea', title: 'controlul de geolocalizare' };
            //Russian
            case 'ru':
                return { enableTracking: 'Начать отслеживание', disableTracking: 'остановка отслеживания', myLocation: 'Мое местонахождение', title: 'контроль геолокации' };
            //Serbian
            case 'sr':
                return { enableTracking: 'Старт трацкинг', disableTracking: 'стоп праћење', myLocation: 'Моја локација', title: 'kontrola геолоцатион' };
            //Slovak
            case 'sk':
                return { enableTracking: 'začať sledovať', disableTracking: 'zastaviť sledovanie', myLocation: 'moja poloha', title: 'ovládanie Geolocation' };
            //Slovenian
            case 'sl':
                return { enableTracking: 'Začni sledenje', disableTracking: 'Stop za sledenje', myLocation: 'moja lokacija', title: 'nadzor Geolocation' };
            //Swedish
            case 'sv':
                return { enableTracking: 'börja spåra', disableTracking: 'Stoppa spårning', myLocation: 'Min plats', title: 'geolocation kontroll' };
            //Thai
            case 'th':
                return { enableTracking: 'เริ่มการติดตาม', disableTracking: 'ติดตามหยุด', myLocation: 'ตำแหน่งของฉัน', title: 'ควบคุม Geolocation' };
            //Turkish
            case 'tr':
                return { enableTracking: 'izlemeyi başlat', disableTracking: 'Dur izleme', myLocation: 'Benim konumum', title: 'Coğrafi Konum kontrolü' };
            //Ukrainian
            case 'uk':
                return { enableTracking: 'почати відстеження', disableTracking: 'зупинка відстеження', myLocation: 'моє місце розташування', title: 'контроль геолокації' };
            //Vietnamese
            case 'vi':
                return { enableTracking: 'Bắt đầu theo dõi', disableTracking: 'dừng theo dõi', myLocation: 'vị trí của tôi', title: 'kiểm soát định vị' };
            //English
            case 'en':
            default:
                return { enableTracking: 'Start tracking', disableTracking: 'Stop tracking', myLocation: 'My location', title: 'Geolocation control' };
        }
    }
}