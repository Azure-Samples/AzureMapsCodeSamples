/// <reference path="../../Common/typings/azure-maps-control.d.ts"/>



        interface FullscreenTranslation {
            view: string;
            exit: string;
            title: string;
        }

        interface FullscreenControlOptions extends atlas.Options {
            /**
             * The style of the control.
             * Default `ControlStyle.light.
             * @default ControlStyle.light
             */
            style: atlas.ControlStyle | string;

            /**
             * Specifies if the control should be hidden if fullscreen is not supported by the browser. 
             * @default false
             */
            hideIfUnsupported: boolean;
        }

        class FullscreenControl implements atlas.Control {
            private _container: HTMLElement;
            private _button: HTMLButtonElement;
            private _options: atlas.ControlOptions = <FullscreenControlOptions>{
                style: 'light',
                hideIfUnsupported: true
            };
            private _map: atlas.Map;
            private _resource: FullscreenTranslation;

            private _fullscreenCss = '{elm}:-webkit-full-screen{width:100%;height:100%;}{elm}:-moz-full-screen{width:100%;height:100%;}{elm}:-ms-fullscreen{width:100%;height:100%;}{elm}:-o-full-screen{width:100%;height:100%;}{elm}:-full-screen{width:100%;height:100%;}.fullscreenBtn-{colorName}{margin:0;padding:0;border:none;border-collapse:collapse;width:32px;height:32px;text-align:center;cursor:pointer;line-height:32px;background-repeat:no-repeat;background-size:20px;background-position:center center;z-index:200;box-shadow:0px 0px 4px rgba(0,0,0,0.16);background-color:{color};}.fullscreenBtn-{colorName} .expand{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABQCAMAAAHU9NKHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURQAAAIaGjYOHi4KIjoOIjYOJjYKIjYOIjYOIjYOIjoOIjYOIjYOIjYOIjYOIjYOIjRxqJC4AAAAPdFJOUwAmQlhre4mWo6250Nzo83UgkpAAAAAJcEhZcwAAFxEAABcRAcom8z8AAAIvSURBVEhL7ZcPk4IgEMW9LOPU4vt/29tlH7iQbElzNzcNv6nkz/MJ7GoymLiRfryUiXHwC4oFfhhjj2P9TcrvwlbTWcrkO0kpx03bCFf6eujfxHkfbOmQGTrneVGGyS9vXci5SfzH3Kd23f8GhpmOkVQt22W66RihqHKDV1GMcLh3Q36Q4C/FDc+X5DAWXT40c0fZHhpw6ByAU1qtG2rV7HZ+9XKPAQrF3ZI7VsQTqDgNi3XvOPrG6Eq0Kw+1PyMmuZ70LjRVmSAjk17q6Ugrk8QMn2CsDIdpEzN0gi0nUIthNda90zmGpFTKSU5HArVHpDvqoTbldxTBM3mu5wZLTh+lZ60t1/rgbMhn7kp6GUdx82bM/OP9dyiLr6EG4aR0+GiwGGF9TIIQOTbL+hsLKa82MY4SLyNMEnSood+qD1CXUovelGfqoH8iRxE8tii4k8DkKMcCUttButNSQI9ap9PpGJzOG3uvzSP6mC+0vUzcsAjl8zq+WAiHX3hhfluAHv2ItoUezEyrub/XtxJp+E3mvKOo2ov1tNBPmzksduxhzfudBvMrncTbvl37ZC3m9ZWrMov5o72yZvMyk14k+ZGdfhmjP83k2DDqzkeSnnaULTrh6G01JUljtkxZniv3LO+b8vxCBtsdWjgo+6Y7VD9bdgaX7NsfXDVrBvbN5oH6ksqliVbz1QH9Pzmiza0iah95oBx+3B8Ih83PGBxzQZvmij7mhLZOp9P5fYbhB465JX5zEC2FAAAAAElFTkSuQmCC);}.fullscreenBtn-{colorName} .expand:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABQCAMAAAHU9NKHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURQAAAC+u0DGtzjCrzzGszjCtzzGszjCszzGszjGszjGszjCszzGszjCszzGrzjGszjGszgmTsGgAAAAQdFJOUwAmRFtuf42ZpbC8yNLd6PSI+gS0AAAACXBIWXMAABcRAAAXEQHKJvM/AAACQElEQVRIS+2Xi3aDIAyGsTrnrK28/9MufxKQi9LKtrMb3zmtgcS/XEKqpsgw0pcVmxiNndRMsGZ0ngHxN7E/CqR6FV6s6cWKufbbCO/0ORriSQZrWXa1seCwWCyK6e2U/VCn12cYlp717RjruN+ly+dM5IvQYfqrwzfTfpmusXPSTyuJyxzkmYLtnsX8EKwv5obFT2IbE5flbjjSfu7QS+MESOlg3ehEgcPsHuzdyhlTaCvWUviCCHcDmbOZSmdnoY/bXdnt7z5orq6Fk95lpbHzBIFMejpOR1oZHwxwQ2FlsE1bMKAbyuGEtuRk/PCa1fhdSEr5nEQ6EtrKEbeL1+hyuJoKKpOaOShCkZfrmNo55Iri0SiHh/FsFsJHuHy8GMnhjeDKslp+LBvltkK0gkJJPKxKf4A3uTyeKpfqVZb68ULyo83z2wS/j1Zza2aQK4iW+GJ4FM3xxfDUiXg1cxBO6ORoaRhp7SBuvxQar61Go9Eo0A0B2hdyURe4aN/TuBcWIa3XPddNx+kHXhVfFyX8z+mu2klvQKBWPH5/ivHDrxJf5PZ9efHNE33ViTuJXF6l8b5TIY5nQX6a2ZP30iL+yp2nGEU8lw+kIZ5m0pO410PI3Tq1CfrT9Io+pvHP8QlC2RImHGWLT8zKbOnXKM839Sjvq/L8QgrBCY0VAvmqExrVlnxwXr6+cB1JA5WvFmeOl1TkiVrxdVLCrOi0b7pKUP3ImXT47v1AOC1+0cGBvWx4UR/YezpoNBqNr8GYdx7zJ6KYC/6BAAAAAElFTkSuQmCC);}.fullscreenBtn-{colorName} .collapse{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABZCAMAAAGMKpG+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAAIaGjYOHi4OIjYOJjYKIjYOIjYOIjYOIjoOIjYOIjYOIjYOIjYOIjYOIja46bbwAAAAOdFJOUwAmQmt7iZajrbnF0NzzMFsUdgAAAAlwSFlzAAAXEQAAFxEByibzPwAAAmVJREFUWEftmY1ygyAQhKVtSgyW93/c3t4doKiFKJNkUr6ZUhDXRTh+bIcSPiaMH3wqGDtYq/kVizspZ2ZPaQ8/e+IsIOtUQCPtt+ZzJmqnZvGAUR/1JKjdZE+NXzfCOfSn985d9EoNnghphrz5YpjeGH5VDhH/IVci1AUUxZSuO9ZzzbrC0Wig5sc5vRKx1n5yquVTTDRw3IKNQdIaLc3wF30fLUfoPXCNfvIqanHnwWyM3DAV5rbEgQ46LxIUIcX1ACqOFpbWKACCTjVVCoP7iKghaDl9DTCRiHnb+HoBnX+i4Ssl0Lupr2tUMh7e8w7F9xdVo4xH6F3DaWUDO513YtxYY8zfU4EmKItUabCHY/WS4g6jiERpPGmKkiCS2xxpKiQqipoqiYiCBqsWXyxBiqCpklzp3BNvRQbl1QkoQ5fe5KP5P6HzE0D2krL/irCfIq/9pgG7S5As+rokIliHDDQV9xNihRz71Ig4koPGydQowJLZ/KkQiUQ1N8zTokgl4UQ2IaKLIpFErkh0X76PfvbudDqdB1G7RpsvzRwBR6u0geRbieHtAhgcjw7sGgpsktFyz6JH69mMTc7YLI2Qi39PvVGBbRqYgGSE3/HYh1MG2TQyAcEI6dKmoQkQI7CwEVqZgGC0smlior2S2HgbIY/2O8mMdmxOmnReGnPjT0slxi9/gAbiGnqUPKL3AvpcqMU2B7eVjdbf95+dHdI7rd+m2ZQJCySShQ2+6ogmRsFkeyNoZJRMtm2aGM1N2CY9DVW6SZ81sqyPIZQ9yfBXLSNGxz87q79yD30OdzqdTufpDMMvhocrBPmo80EAAAAASUVORK5CYII=);}.fullscreenBtn-{colorName} .collapse:hover{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABZCAMAAAGMKpG+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURQAAAC+u0DGtzjGszjCtzzGszjCszzGszjGszjGszjCszzGszjCszzGszjGszpuJGtMAAAAOdFJOUwAmRG5/jZmlsLzI0t30Qf/9UAAAAAlwSFlzAAAXEQAAFxEByibzPwAAAmVJREFUWEftmdt6qyAUhGlTa1JS3v9xO7PWkoNoJOru7tfyXygExuEMRrdFiBchuJAibnTjaMGKIufsKecT3ItzN4sgGrIIC7lazhvKaUE+4P5vi7kFyg17FL4uhPdszxC8v9ovLQSgV7RPida87NDfC+rvccOoCIP+EgkvHkloiGzIGOHOlDrBozckhcqScRxhgKvFD3FDx4nPQidZStWvqIfVZ56EerC47PVZ0sXune9joefcrR6CBTqPvUplkcAI2dCoSsYrg00KwkFnmjYF84GoAVhOfwacSCAv20LzV9j8U02LQFo3tXWLSvvDhw9GZJ5vqgbtj3Ij+BvreKdTMCytMY+nwqstTJNScmPSSWSNQUW2pE3zVCLrqEizjbxtS0yUNC0SFUVNm0REmUZ+esiAc4//zDSMy1r3AFt6s7I1LIrvOEDZGeqiwabV91dhbcWgtds0YFfRbGVbb4oA8/FOTUt+QEnyaRJREDU2nzYQj6iZJuFDtFiqeedtW6SS6UQm56pNkUr42inIhmz78nP0s3en0+l8E2+tR4n5H0XPwKPVPRpd55Zpn+DxaMeuYdAmGfnMEuDRKQT225RGHiF5WyXYYs3muAlJRrSJh0s5ZeB+jgmZjBZszjMhakRKG+EsEzIZVTbnmGirJBZqoxSDcAel0YrNUZPOj+Yqr5ZG/KNLXkAnPg6PgNmIXhvQx4ZaKrM9rrK5W/pTX3bWiHWqa3PelLEFsl46823iKGayvBGcZRRNVvabU4wyE7HJnsYkDR01uog+LvV+9qT0SVGN9n+fan7L3fU63Ol0Op3/jnNfvJgrBGHh/YYAAAAASUVORK5CYII=);}';

            constructor(options?: FullscreenControlOptions) {
                this._options = { ...this._options, ...options };
            }

            public onAdd(map: atlas.Map, options?: atlas.ControlOptions): HTMLElement {
                this._map = map;

                var isSupported = FullscreenControl.isSupported();

                if (isSupported || (!isSupported && !this._options.hideIfUnsupported)) {
                    this._resource = FullscreenControl._getTranslations(map);

                    var color = this._options.style;

                    if (color === 'light') {
                        color = 'white';
                    } else if (color === 'dark') {
                        color = 'black';
                    }

                    var colorName = color.replace('#', color);
                    var cssClassName = 'fullscreenBtn-{colorName}'.replace('{colorName}', colorName);

                    var mapContainer = this._map.getMapContainer();

                    //Add css for fullscreen.
                    var css = this._fullscreenCss.replace(/{elm}/g, '#' + mapContainer.id)
                        .replace(/{color}/g, color)
                        .replace('{colorName}', colorName);
                   
                    var style = document.createElement('style');
                    style.innerHTML = css;
                    document.body.appendChild(style);

                    //Create the fullscreen button.
                    this._container = document.createElement('div');
                    this._container.classList.add('azure-maps-control-container');
                    this._container.setAttribute('aria-label', this._resource.title);
                    this._container.style.flexDirection = 'column';

                    this._button = document.createElement("button");
                    this._button.classList.add(cssClassName);
                    this._button.classList.add('expand');
                    this._button.setAttribute('title', this._resource.view);
                    this._button.setAttribute('alt', this._resource.view);
                    this._button.addEventListener('click', () => {
                        if (this.isFullscreen()) {
                            var closeFullScreenFn =
                                document.webkitCancelFullScreen
                            || document['cancelFullScreen']
                            || document['mozCancelFullScreen']
                            || document['msExitFullscreen'];

                            closeFullScreenFn.call(document);
                        } else {
                            var openFullScreenFn =
                                mapContainer.webkitRequestFullScreen
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
                    } else if (document['mozCancelFullScreen']) {
                        changeEventName = 'mozfullscreenchange';
                    } else if (document['msExitFullscreen']) {
                        changeEventName = 'MSFullscreenChange';
                    }

                    if (changeEventName) {
                        document.addEventListener(changeEventName, () => { this._updateBtn() });
                    }

                    return this._container;
                }

                return null;
            }

            public onRemove(): void {
                if (this._container) {
                    this._container.remove();
                }
            }

            public isFullscreen(): boolean {
                return !(!document.fullscreenElement &&
                    !document['msFullscreenElement'] &&
                    !document['mozFullScreenElement'] &&
                    !document.webkitFullscreenElement);
            }
            
            //Determines if fullscreen can be requested of not.
            public static isSupported() {
                return document.fullscreenEnabled ||
                    document['msFullscreenEnabled'] ||
                    document['mozFullScreenEnabled'] ||
                    document.webkitFullscreenEnabled;
            }

            private _updateBtn() {
                var ariaLabel = this._resource.view;
                var removeClass, addClass;

                if (this.isFullscreen()) {
                    //Is fullscreen, exit.
                    ariaLabel = this._resource.exit;

                    removeClass = 'expand';
                    addClass = 'collapse';
                } else {
                    //Make map full screen.
                    ariaLabel = this._resource.view;

                    removeClass = 'collapse';
                    addClass = 'expand';
                }

                this._button.setAttribute('title', ariaLabel);
                this._button.setAttribute('alt', ariaLabel);

                this._button.classList.remove(removeClass);
                this._button.classList.add(addClass);
            }

            private static _getTranslations(map: atlas.Map): FullscreenTranslation {
                switch (map.getStyle().language) {

                    default:
                        return {
                            exit: 'Exit Fullscreen',
                            view: 'View Fullscreen',
                            title: 'Fullscreen Control'
                        };
                }
            }
}