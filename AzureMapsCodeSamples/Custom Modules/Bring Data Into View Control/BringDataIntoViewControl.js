/** A control that makes it easy to bring any data loaded on the map into view. */
class BringDataIntoViewControl {
    /****************************
     * Constructor
     ***************************/
    /**
     * A control that makes it easy to bring any data loaded on the map into view.
     * @param options Options for defining how the control is rendered and functions.
     */
    constructor(options) {
        this._darkColor = '#011c2c';
        this._options = {
            style: 'light',
            padding: 100
        };
        this._buttonCSS = '.bringDataIntoViewBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcRAAAXEQHKJvM/AAAAB3RJTUUH4wMIFTgXULHJFAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAhUlEQVRo3u3asQ2AIBAF0MO4p42FI1nYOKlugAUnJvL+BLzwcxGw7Md5RUO2dSmRkNZ1TPGTgICADAIptbGXNVqzUluraoGADAKZv/rIy56UqvVFartVVEu1QEBAQEBAQEBAQEAaz+xuGlXrpWr1PlvbERAQEJCIhzfEnqPYLxwgICBjQW7ewSYPr/zk7gAAAABJRU5ErkJggg==);}' +
            '.bringDataIntoViewBtn:hover{background-color:red;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcRAAAXEQHKJvM/AAAAB3RJTUUH4wMIFTcYR5bISgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABDklEQVRo3u2aMQ+CMBSE7wjGwURXd1cHhb8Cv1L/ikDi7Goc1UESElMXN0UiLaToXcIEbe57vFd4TbneZnsAS7RUnkSEA623mbEZH9hA+KQAPyKBDAXEeOz5rbew5mECWAA4NUxKZ+6MGZMcNQRxDuDwDQgAlHkS3foKc5HGFYCqYYkuVewCEcifg4QWP3mzDr43zJPo0isIgHNHwWWbe8GHIaVv6ZMn0fHp+eWiRWqZjszyr4tdIAIRiEAEIhCBCEQgAhHI8Hr2ugbJGDMr0vjqk9nVZjclefnqjZCc+Bb1T55Cy7md76K0Tq2+e2sVu0AEIpDOQO4e+q31RBdbny6WYhdHOFQjAhGIQIajB80LO3KY+u0wAAAAAElFTkSuQmCC);}';
        this._options = Object.assign({}, this._options, options);
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
    onAdd(map, options) {
        this._map = map;
        var ariaLabel = BringDataIntoViewControl._getAriaLabel(this._map.getStyle().language);
        var color = this._options.style || 'light';
        if (color === 'light') {
            color = 'white';
        }
        else if (color === 'dark') {
            color = this._darkColor;
        }
        else if (color === 'auto') {
            //Color will change between light and dark depending on map style.
            this._map.events.add('styledata', () => { this._mapStyleChanged(); });
            color = this._getColorFromMapStyle();
        }
        //Add the CSS style for the control to the DOM.
        var style = document.createElement('style');
        style.innerHTML = this._buttonCSS;
        document.body.appendChild(style);
        //Create a button container.
        this._container = document.createElement('div');
        this._container.classList.add('azure-maps-control-container');
        this._container.setAttribute('aria-label', ariaLabel);
        this._container.style.flexDirection = 'column';
        //Create the button.
        this._button = document.createElement("button");
        this._button.classList.add('bringDataIntoViewBtn');
        this._button.style.backgroundColor = color;
        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);
        this._button.addEventListener('click', () => {
            //Logic that gets all shapes on the map and calculates the bounding box of the map.            
            var data = [];
            for (var s of this._map.sources['sources'].values()) {
                if (s instanceof atlas.source.DataSource) {
                    data = data.concat(s.toJson().features);
                }
            }
            var bounds = null;
            if (data.length > 0) {
                bounds = atlas.data.BoundingBox.fromData(data);
            }
            var pos = [];
            for (var marker of this._map.markers['markers'].values()) {
                pos.push(marker.getOptions().position);
            }
            if (pos.length > 0) {
                var b = atlas.data.BoundingBox.fromPositions(pos);
                if (bounds === null) {
                    bounds = b;
                }
                else {
                    bounds = atlas.data.BoundingBox.merge(bounds, b);
                }
            }
            var l = this._map.getLayers();
            for (var i = 0; i < l.length; i++) {
                if (l[i] instanceof atlas.layer.ImageLayer) {
                    var b = atlas.data.BoundingBox.fromPositions(l[i].getOptions().coordinates);
                    if (bounds === null) {
                        bounds = b;
                    }
                    else {
                        bounds = atlas.data.BoundingBox.merge(bounds, b);
                    }
                }
            }
            if (bounds !== null) {
                var w = atlas.data.BoundingBox.getWidth(bounds);
                var h = atlas.data.BoundingBox.getHeight(bounds);
                //If the bounding box is really small, likely a single point, use center/zoom.
                if (w < 0.000001 || h < 0.000001) {
                    this._map.setCamera({
                        center: atlas.data.BoundingBox.getCenter(bounds),
                        zoom: 17
                    });
                }
                else {
                    this._map.setCamera({
                        bounds: bounds,
                        padding: this._options.padding
                    });
                }
            }
        });
        this._container.appendChild(this._button);
        return this._container;
    }
    /**
     * Action to perform when control is removed from the map.
     */
    onRemove() {
        if (this._button) {
            this._button.remove();
        }
        if (this._options.style === 'auto') {
            this._map.events.remove('styledata', () => { this._mapStyleChanged(); });
        }
    }
    /****************************
     * Private Methods
     ***************************/
    /**
     * An event handler for when the map style changes. Used when control style is set to auto.
     */
    _mapStyleChanged() {
        if (this._button) {
            this._button.style.backgroundColor = this._getColorFromMapStyle();
        }
    }
    /**
     * Retrieves the background color for the button based on the map style. This is used when style is set to auto.
     */
    _getColorFromMapStyle() {
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
    /**
     * Returns the set of translation text resources needed for the center and zoom control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns The translated text for the aria label for the center and zoom control.
     */
    static _getAriaLabel(lang) {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }
        switch (lang) {
            case 'af':
                return 'Bring data in die oog';
            case 'ar':
                return 'جلب البيانات في الرأي';
            case 'eu':
                return 'Ekarri datuak ikusteko';
            case 'bg':
                return 'Привеждане на данните в изглед';
            case 'zh':
                return '将数据带入视图';
            case 'hr':
                return 'Donesite podatke u prikaz';
            case 'cs':
                return 'Přenést data do zobrazení';
            case 'da':
                return 'Få vist data i visningen';
            case 'nl':
                return 'Gegevens in beeld brengen';
            case 'et':
                return 'Andmete vaatamine';
            case 'fi':
                return 'Tuo tiedot näkymään';
            case 'fr':
                return 'Mettre les données en vue';
            case 'gl':
                return 'Fai ver os datos';
            case 'de':
                return 'Daten in den Blick bringen';
            case 'el':
                return 'Εισαγωγή δεδομένων σε προβολή';
            case 'hi':
                return 'डेटा को दृश्य में लाएं';
            case 'hu':
                return 'Adatok áthozása a nézetbe';
            case 'id':
                return 'Bawa data ke tampilan';
            case 'it':
                return 'Portare i dati in vista';
            case 'ja':
                return 'データをビューに取り込む';
            case 'kk':
                return 'Деректерді көрініске енгізіңіз';
            case 'ko':
                return '데이터를 뷰로 가져오기';
            case 'es':
                return 'Lleve los datos a la vista';
            case 'lv':
                return 'Datu skatīšana skatā';
            case 'lt':
                return 'Atvesti duomenis į rodinį';
            case 'ms':
                return 'Membawa data ke dalam paparan';
            case 'nb':
                return 'Hent data til visning';
            case 'pl':
                return 'Przynieś dane do widoku';
            case 'pt':
                return 'Colocar os dados em exibição';
            case 'ro':
                return 'Aducerea datelor în vizualizare';
            case 'ru':
                return 'Перенесите данные в представление';
            case 'sr':
                return 'Uskladi podatke u prikaz';
            case 'sk':
                return 'Preniesť údaje do zobrazenia';
            case 'sl':
                return 'Prinesite podatke v pogled';
            case 'sv':
                return 'Ta fram data i vyn';
            case 'th':
                return 'นำข้อมูลมาไว้ในมุมมอง';
            case 'tr':
                return 'Verileri görünüme getirme';
            case 'uk':
                return 'Приведення даних у режим перегляду';
            case 'vi':
                return 'Mang dữ liệu vào chế độ xem';
            case 'en':
            case 'ngt':
            default:
                return 'Bring data into view';
        }
    }
}
//# sourceMappingURL=BringDataIntoViewControl.js.map