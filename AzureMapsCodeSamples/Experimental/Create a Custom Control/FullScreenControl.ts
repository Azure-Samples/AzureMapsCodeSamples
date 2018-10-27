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
        }

        class FullscreenControl implements atlas.Control {
            private _container: HTMLElement;
            private _button: HTMLButtonElement;
            private _options: atlas.ControlOptions;
            private _isFullscreen: boolean;
            private _map: atlas.Map;
            private _resource: FullscreenTranslation;

            constructor(options?: FullscreenControlOptions) {
                this._options = options || { style: atlas.ControlStyle.light };
            }

            public onAdd(map: atlas.Map, options?: atlas.ControlOptions): HTMLElement {
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
                this._button.addEventListener("click", (event) => {

                    var ariaLabel = this._resource.view;

                    if (this._isFullscreen) {
                        ariaLabel = this._resource.exit;

                    } else {

                    }

                    this._button.setAttribute("title", ariaLabel);
                    this._button.setAttribute("alt", ariaLabel);
                    this._isFullscreen = !this._isFullscreen;
                });

                this._container.appendChild(this._button);

                return this._container;
            }

            public onRemove(): void {
                this._container.remove();
            }

            public isFullscreen(): boolean {
                return this._isFullscreen;
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