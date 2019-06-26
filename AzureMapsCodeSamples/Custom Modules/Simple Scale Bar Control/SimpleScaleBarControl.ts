
interface CustomScaleBarControlOptions extends atlas.Options {
    /** The distance units of the scale bar. Supported values: imperial, metric, meters, kilometers, yards, feet, miles, nauticalMiles */
    units?: string;

    /** The maximum length of the scale bar in pixels. Default: 100 */
    maxBarLength?: number;
}

class SimpleScaleBarControl implements atlas.Control {
    private _map: atlas.Map = null;
    private _scaleBar: HTMLElement = null;
    private _options: CustomScaleBarControlOptions = {
        units: 'imperial',
        maxBarLength: 100
    };
    
    constructor(options: CustomScaleBarControlOptions) {
        this._options = { ...this._options, ...options }; 
    }
    
    public onAdd(map: atlas.Map, options?: atlas.ControlOptions): HTMLElement {
        this._map = map;

        //Add the CSS style for the control to the DOM.
        var style = document.createElement('style');
        style.innerHTML = '.customAzureMapsScaleBar {background-color:rgba(255,255,255,0.8);font-size:10px;border-width:medium 2px 2px;border-style:none solid solid;border-color:black;padding:0 5px;color:black;}';
        document.body.appendChild(style);
        
        this._scaleBar = document.createElement('div');
        this._scaleBar.className = 'customAzureMapsScaleBar';

        this._map.events.add('move', () => { this.updateScaleBar(); });

        this.updateScaleBar();

        return this._scaleBar;
    }

    public onRemove(): void {
        this._map.events.remove('move', () => { this.updateScaleBar(); });
        this._map = null;
        this._scaleBar = null;
    }

    private updateScaleBar(): void {
        var camera = this._map.getCamera();

        //Get the center pixel.
        var cp = this._map.pixelsToPositions([camera.center]);

        //Calculate two coordinates that are seperated by the maxBarLength pixel distance from the center pixel.
        var pos = this._map.pixelsToPositions([[0, cp[0][1]], [this._options.maxBarLength, cp[0][1]]]);

        //Calculate the strightline distance between the positions.
        var units = this._options.units.toLowerCase();

        if (units === 'imperial') {
            units = 'miles';
        } else if (units === 'metric') {
            units = 'kilometers';
        }

        var trueDistance = atlas.math.getDistanceTo(pos[0], pos[1], units);

        //Round the true distance to a nicer number.
        var niceDistance = this.getRoundNumber(trueDistance);
        var isSmall = false;
        if (niceDistance < 2) {
            units = this._options.units.toLowerCase();
            if (units === 'imperial') {
                //Convert to feet.
                trueDistance *= 5280;
                niceDistance = this.getRoundNumber(trueDistance);
                isSmall = true;
            } else if (units === 'metric') {
                //Convert to meters.
                trueDistance *= 1000;
                niceDistance = this.getRoundNumber(trueDistance);
                isSmall = true;
            }
        }

        //Calculate the distanceRatio between the true and nice distances and scale the scalebar size accordingly.
        var distanceRatio = niceDistance / trueDistance;

        //Update the width of the scale bar by scaling the maxBarLength option by the distance ratio.
        this._scaleBar.style.width = (this._options.maxBarLength * distanceRatio) + 'px';

        //Update the text of the scale bar.
        this._scaleBar.innerHTML = this.createDistanceString(niceDistance, isSmall);
    }

    private getRoundNumber(num: number): number {
        if (num >= 2) {
            //Convert the number to a round value string and get the number of characters. Then use this to calculate the powe of 10 increment of the number.
            var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
            var i = num / pow10;

            //Shift the number to the closest nice number. 
            if (i >= 10) {
                i = 10;
            } else if (i >= 5) {
                i = 5
            } else if (i >= 3) {
                i = 3
            } else if (i >= 2) {
                i = 2;
            } else {
                i = 1;
            }

            return pow10 * i;
        }

        return Math.round(100 * num) / 100;
    }

    private createDistanceString(num: number, isSmall: boolean): string {
         if (this._options.units) {
             switch (this._options.units.toLowerCase()) {
                case 'feet':
                case 'foot':
                case 'ft':
                     return num + ' ft';
                case 'kilometers':
                case 'kilometer':
                case 'kilometres':
                case 'kilometre':
                case 'km':
                case 'kms':
                     return num + ' km';
                case 'miles':
                case 'mile':
                case 'mi':
                    return num + ' mi';
                case 'nauticalmiles':
                case 'nauticalmile':
                case 'nms':
                case 'nm':
                     return num + ' nm';
                case 'yards':
                case 'yard':
                case 'yds':
                case 'yrd':
                case 'yrds':
                     return num + ' yds';
                 case 'metric':
                     if (isSmall) {
                         return num + ' m';
                     } else {
                         return num + ' km';
                     }
                case 'imperial':
                     if (isSmall) {
                         return num + ' ft';
                     } else {
                         return num + ' mi';
                     }
                case 'meters':
                case 'metres':
                case 'm':
                default:
                     return num + ' m';
            }
        }
    }
}