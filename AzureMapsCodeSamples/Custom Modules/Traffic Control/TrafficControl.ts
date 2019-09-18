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

/**
 * An object that represents the traffic control text resources.
 */
interface TrafficTranslation {
    /** Show traffic */
    show: string;

    /** Hide traffic */
    hide: string;

    /** Traffic control */
    title: string;
}

/**
* Options that define how the traffic control renders and functions.
*/
interface TrafficControlOptions extends atlas.Options, atlas.TrafficOptions {
    /**
    * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
    * Default `light'.
    * @default light
    */
    style?: atlas.ControlStyle | string;

    /** Specifies if the control is in the active state (displaying traffic). Default: false */
    isActive?: boolean;
}

/**
 * A control that toggles traffic data on the map.
 */
class TrafficControl implements atlas.Control {

    /****************************
     * Private Properties
     ***************************/

    private _container: HTMLElement;
    private _button: HTMLButtonElement;
    private _options: TrafficControlOptions = {
        style: 'light',
        flow: 'relative',
        incidents: true
    };
    private _darkColor = '#011c2c';
    private _map: atlas.Map;
    private _resource: TrafficTranslation;

    private _iconTemplate = "data:image/svg+xml;utf8,<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 1000 1000' xml:space='preserve'><g fill='{color}'><path d='M988.5,683l-8.9-26c-4.9-14.4-20.6-26-35-26h-30.3c-18.9-53.8-38.6-101.5-45.1-116.2c-11.9-27-49.9-32.8-70.9-38.7c0,0-35-10.7-151.6-10.7c-116.6,0-151.6,10.7-151.6,10.7c-24.5,8.3-58.6,13.6-72.1,39.9c-5.4,10.5-25.4,59.6-44.6,115h-30c-14.4,0-30,11.6-35,26l-8.9,26c-4.9,14.4,2.7,31.1,17.1,31.1h30c-8,23.4-13.4,34.2-13.4,34.2c-2.2,3.8-3.8,21.4-3.8,26.2v194.8c0,14.4,11.6,26,26,26h72.3c14.4,0,26-11.6,26-26v-36.5h375.8v36.5c0,14.4,11.6,26,26,26H933c14.4,0,26-11.6,26-26V774.4c0-4.7-1.6-22.4-3.8-26.2c0,0-5.5-10.8-13.6-34.2h29.7C985.8,714.1,993.4,697.3,988.5,683z M493.2,839.1h-34.6c-30.9,0-61.8-4.5-61.8-26v-26c0-25.1,13.3-26,27.7-26c14,0,41.8,13,60.1,21.9c20,9.8,42.3,17.9,42.3,34.2C527,832.2,519.3,839.1,493.2,839.1z M421,658.7c18.3-72.5,38.1-99.7,42.5-111.1c3.5-8.3,6.9-33.9,183.3-33.9s180.5,29.3,181,29.6c5.4,15.5,27,48.6,44.3,115.4c0,0-74.5,24.2-225.2,24.2S421,658.7,421,658.7z M896.7,813.1c0,21.5-30.9,26-61.8,26h-34.6c-26,0-33.7-6.9-33.7-21.9c0-16.3,22.3-24.4,42.3-34.2c18.3-9,46.1-21.9,60.1-21.9c14.4,0,27.7,0.9,27.7,26V813.1L896.7,813.1z'/><path d='M611.3,346.4L611.3,346.4c-16-45.3-32.4-86.1-41.1-106.8C579,260.4,595.4,301.1,611.3,346.4z'/><path d='M348.5,589.1h0.5c15.4-42.4,30.8-80.3,36.9-92.3c19.3-37.5,58-49,83.6-56.6c4.3-1.3,8.4-2.5,12.3-3.8c8-2.5,48.1-13,165-13c1,0,1.7,0,2.6,0c-0.3-0.9-0.5-1.5-0.9-2.4h29.7c14.4,0,22-16.7,17.1-31.1l-8.9-26c-4.9-14.4-20.6-26-35-26h-30.3c-18.9-53.8-38.6-101.5-45.1-116.2c-11.9-27-49.9-32.8-70.9-38.7c0,0-35-10.7-151.6-10.7c-116.6,0-151.6,10.7-151.6,10.7c-24.5,8.3-58.5,13.6-72.1,39.9c-5.4,10.5-25.4,59.6-44.6,115H55.4c-14.4,0-30,11.6-35,26l-8.9,26C6.6,404.2,14.2,421,28.6,421h30c-8,23.4-13.4,34.2-13.4,34.2c-2.2,3.8-3.8,21.4-3.8,26.2v194.8c0,14.4,11.6,26,26,26h72.3c14.4,0,26-11.6,26-26v-36.5h110.1C287.8,610.3,317.4,589.1,348.5,589.1z M170.5,254.6c3.5-8.3,6.9-33.9,183.3-33.9c176.3,0,180.5,29.3,181,29.6c5.4,15.5,27,48.6,44.3,115.4c0,0-74.5,24.2-225.2,24.2C203,389.9,128,365.6,128,365.6C146.2,293.2,166.1,266,170.5,254.6z M200.2,546.1h-34.5c-30.9,0-61.8-4.5-61.8-26v-26c0-25.1,13.3-26,27.7-26c14,0,41.8,13,60.1,21.9c20,9.8,42.3,17.9,42.3,34.2C233.9,539.1,226.2,546.1,200.2,546.1z'/><path d='M463.5,87.1c3.5-8.3,6.9-33.9,183.3-33.9c176.3,0,180.5,29.3,181,29.6c5.4,15.5,27,48.6,44.3,115.4c0,0-74.5,24.2-225.2,24.2c-8.9,0-16.7-0.3-25.1-0.5c7.1,17.1,17.5,43.1,28.9,74.1h0.9c32.4,0,63.8,22.9,74.5,54.3l8.9,26c5.7,16.5,4.7,34.2-2,49.6c51.4,3.2,72.8,8.7,77.6,10.1l7.8,2c26.5,6.7,70.7,17.9,89.2,59.9c2.7,6.2,8.2,19.4,15.2,36.8H933c14.4,0,26-11.6,26-26V313.9c0-4.7-1.6-22.4-3.8-26.2c0,0-5.5-10.8-13.6-34.2h29.7c14.4,0,22-16.7,17.1-31.1l-9-26c-4.9-14.4-20.6-26-35-26h-30.3c-18.9-53.8-38.6-101.5-45.1-116.2c-11.9-27-49.9-32.8-70.9-38.7c0,0-35-10.7-151.6-10.7c-116.6,0-151.6,10.7-151.6,10.7c-24.5,8.3-58.6,13.6-72.1,39.9c-4,7.9-16.3,37.6-30.4,75.4c19.2,0.4,35,1.2,49.2,2.1C452.3,107.2,460.9,94.1,463.5,87.1z M896.7,326.5v26c0,21.5-30.9,26-61.8,26h-34.6c-26,0-33.7-6.9-33.7-21.9c0-16.2,22.4-24.4,42.3-34.2c18.3-9,46.1-21.9,60.1-21.9C883.3,300.5,896.7,301.4,896.7,326.5z'/></g></svg>";

    private _trafficBtnCss = 
        '.trafficBtn{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);}' +
        '.trafficDisabled{background-image:url("{grayIcon}");}' +
        '.trafficDisabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}' +
        '.trafficEnabled{background-image:url("{blueIcon}");}' +
        '.trafficEnabled:hover{background-image:url("{blueIcon}");filter:brightness(90%);}';

    /****************************
     * Constructor
     ***************************/

    /**
     * A control that toggles traffic data on the map.
     * @param options Options for defining how the control is rendered and functions.
     */
    constructor(options?: TrafficControlOptions) {
        this._options = { ...this._options, ...options };
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

        this._resource = TrafficControl._getTranslations(this._map.getStyle().language);

        //Create different color icons and merge into CSS.
        var grayIcon = this._iconTemplate.replace('{color}', 'Gray');
        var blueIcon = this._iconTemplate.replace('{color}', 'DeepSkyBlue');
        var css = this._trafficBtnCss.replace(/{grayIcon}/g, grayIcon).replace(/{blueIcon}/g, blueIcon);

        //Add the CSS style for the control to the DOM.
        var style = document.createElement('style');
        style.innerHTML = css;
        document.body.appendChild(style);

        //Create the traffic toggle button.
        this._container = document.createElement('div');
        this._container.classList.add('azure-maps-control-container');
        this._container.setAttribute('aria-label', this._resource.title);
        this._container.style.flexDirection = 'column';

        this._button = document.createElement("button");
        this._button.classList.add('trafficBtn');
        this._button.classList.add('trafficDisabled');
        this._button.setAttribute('title', this._resource.show);
        this._button.setAttribute('alt', this._resource.show);
        this._button.setAttribute('type', 'button');
        this._button.addEventListener('click', this._toggleTraffic);

        this._updateBtn();
        this.setOptions(this._options);
        this._container.appendChild(this._button);

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
    }

    /** Gets the options of the traffic control. */
    public getOptions(): TrafficControlOptions {
        return Object.assign({}, this._options);
    }

    /**
     * Sets the options of the traffic control.
     * @param options The options.
     */
    public setOptions(options: TrafficControlOptions): void {
        var color = this._options.style || 'light';

        if (options) {
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
        }

        this._button.style.backgroundColor = color;

        if (options.flow) {
            this._options.flow = options.flow;
        }

        if (typeof options.incidents !== 'undefined') {
            this._options.incidents = options.incidents;
        }

        if (typeof options.isActive !== 'undefined') {
            this._options.isActive = options.isActive;
        }

        this._updateBtn();
    }

    /****************************
     * Private Methods
     ***************************/

    /** Toggles the traffic data visibility. */
    private _toggleTraffic = () => {
        var t = this._map.getTraffic();

        this._options.isActive = !(t.flow !== 'none' || t.incidents);

        this._updateBtn();
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

    /**
     * Updates the state of the button.
     */
    private _updateBtn(): void {
        var ariaLabel = this._resource.show;
        var removeClass, addClass;

        if (this._options.isActive) {
            //Traffic is display, button will now allow hiding it.
            ariaLabel = this._resource.hide;

            removeClass = 'trafficDisabled';
            addClass = 'trafficEnabled';

            this._map.setTraffic(this._options);
        } else {
            //Traffic is hidden, button will now allow showing it.
            ariaLabel = this._resource.show;

            removeClass = 'trafficEnabled';
            addClass = 'trafficDisabled';

            this._map.setTraffic({
                flow: 'none',
                incidents: false
            });
        }

        this._button.setAttribute('title', ariaLabel);
        this._button.setAttribute('alt', ariaLabel);

        this._button.classList.remove(removeClass);
        this._button.classList.add(addClass);
    }

    /**
     * Returns the set of translation text resources needed for the control for a given language.
     * @param lang The language code to retrieve the text resources for.
     * @returns An object containing text resources in the specified language.
     */
    private static _getTranslations(lang?: string): TrafficTranslation {
        if (lang && lang.indexOf('-') > 0) {
            lang = lang.substring(0, lang.indexOf('-'));
        }

        switch (lang.toLowerCase()) {
            //Afrikaans
            case 'af':
                return { hide: 'Wys verkeer', show: 'verberg Verkeer', title: 'verkeer beheer' };
            //Arabic
            case 'ar':
                return { hide: 'عرض المرور', show: 'إخفاء المرور', title: 'التحكم بالمرور' };
            //Basque
            case 'eu':
                return { hide: 'Erakutsi trafikoa', show: 'ezkutatu Traffic', title: 'Trafiko kontrola' };
            //Bulgarian
            case 'bg':
                return { hide: 'Показване на трафика', show: 'Скриване на трафика', title: 'Контрол на трафика' };
            //Chinese
            case 'zh':
                return { hide: '显示路况信息', show: '隐藏路况', title: '交通管制' };
            //Croatian
            case 'hr':
                return { hide: 'Prikaži promet', show: 'Sakrij prometa', title: 'kontrola prometa' };
            //Czech
            case 'cs':
                return { hide: 'Show traffic', show: 'Hide Traffic', title: 'Kontrola dopravy' };
            //Danish
            case 'da':
                return { hide: 'Vis trafik', show: 'Skjul Trafik', title: 'Trafik kontrol' };
            //Dutch
            case 'nl':
                return { hide: 'verkeer weergeven', show: 'verbergen Traffic', title: 'Verkeerscontrole' };
            //Estonian
            case 'et':
                return { hide: 'Kuva liiklus', show: 'Peida liiklus', title: 'liikluse reguleerimise' };
            //Finnish
            case 'fi':
                return { hide: 'Näytä liikenne', show: 'piilota liikenne', title: 'Liikennevalvonta' };
            //French
            case 'fr':
                return { hide: 'Afficher le trafic', show: 'Cacher le trafic', title: 'Contrôle de la circulation' };
            //Galician
            case 'gl':
                return { hide: 'amosar tránsito', show: 'Agochar Tráfico', title: 'control de tráfico' };
            //German
            case 'de':
                return { hide: 'Verkehr anzeigen', show: 'verstecken Verkehr', title: 'Verkehrskontrolle' };
            //Greek
            case 'el':
                return { hide: 'Εμφάνιση κυκλοφορίας', show: 'Απόκρυψη κυκλοφορίας', title: 'ελέγχου της κυκλοφορίας' };
            //Hindi
            case 'hi':
                return { hide: 'ट्रैफ़िक दिखाएं', show: 'ट्रैफ़िक छुपाएं', title: 'यातायात नियंत्रण' };
            //Hungarian
            case 'hu':
                return { hide: 'forgalom megjelenítése', show: 'forgalom elrejtése', title: 'A forgalomirányítás' };
            //Indonesian
            case 'id':
                return { hide: 'Tampilkan lalu lintas', show: 'Sembunyikan Lalu Lintas', title: 'Kontrol lalu lintas' };
            //Italian
            case 'it':
                return { hide: 'Mostra traffico', show: 'Nascondi traffico', title: 'Controllo del traffico' };
            //Japanese
            case 'ja':
                return { hide: '表示するトラフィック', show: 'トラフィックを隠します', title: '交通規制' };
            //Kazakh
            case 'kk':
                return { hide: 'көрсету трафик', show: 'Қозғалысты жасыру', title: 'қозғалысын басқару' };
            //Korean
            case 'ko':
                return { hide: '교통 정보 표시', show: '숨기기 교통', title: '교통 통제' };
            //Spanish
            case 'es':
                return { hide: 'Mostrar tráfico', show: 'Ocultar tráfico', title: 'Control de trafico' };
            //Latvian
            case 'lv':
                return { hide: 'Rādīt satiksmes informāciju', show: 'Slēpt satiksmi', title: 'satiksmes kontrole' };
            //Lithuanian
            case 'lt':
                return { hide: 'Rodyti eismas', show: 'Slėpti eismo', title: 'eismo valdymo' };
            //Malay
            case 'ms':
                return { hide: 'Tunjukkan trafik', show: 'Menyembunyikan Traffic', title: 'Kawalan trafik' };
            //Norwegian
            case 'nb':
                return { hide: 'Vis trafikk', show: 'Skjul trafikk', title: 'Trafikkkontroll' };
            //Polish
            case 'pl':
                return { hide: 'Pokaż ruch', show: 'Ukryj Traffic', title: 'Kontrola ruchu' };
            //Portuguese
            case 'pt':
                return { hide: 'Mostrar trânsito', show: 'Esconder Tráfego', title: 'Controle de tráfego' };
            //Romanian
            case 'ro':
                return { hide: 'Afișați traficul', show: 'Ascundeți traficul', title: 'Control de trafic' };
            //Russian
            case 'ru':
                return { hide: 'Показать трафик', show: 'Скрыть трафик', title: 'управление движением' };
            //Serbian
            case 'sr':
                return { hide: 'схов саобраћај', show: 'Сакриј саобраћај', title: 'Саобраћајна контрола' };
            //Slovak
            case 'sk':
                return { hide: 'show traffic', show: 'hide Traffic', title: 'riadenie dopravy' };
            //Slovenian
            case 'sl':
                return { hide: 'Prikaži promet', show: 'Skrij prometa', title: 'nadzor prometa' };
            //Swedish
            case 'sv':
                return { hide: 'Visa trafik', show: 'hide Traffic', title: 'Trafik kontroll' };
            //Thai
            case 'th':
                return { hide: 'แสดงการจราจร', show: 'ซ่อนจราจร', title: 'การควบคุมการจราจร' };
            //Turkish
            case 'tr':
                return { hide: 'trafiği göster', show: 'hide Trafik', title: 'Trafik kontrolü' };
            //Ukrainian
            case 'uk':
                return { hide: 'Показати трафік', show: 'приховати трафік', title: 'управління рухом' };
            //Vietnamese
            case 'vi':
                return { hide: 'Hiển thị giao thông', show: 'Hide giao thông', title: 'Điều khiển giao thông' };
            //English
            case 'en':
            default:
                return { hide: 'Hide traffic', show: 'Show traffic', title: 'Traffic control' };
        }
    }
}