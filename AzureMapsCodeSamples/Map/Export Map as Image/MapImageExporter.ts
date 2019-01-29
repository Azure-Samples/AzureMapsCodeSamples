/**
 * A class for generating screenshots of the map.
 */
class MapImageExporter {

    /**********************
    * Private Properties
    ***********************/

    private _map: atlas.Map;

    private _logoHeight = 25;

    /**********************
    * Constructor
    ***********************/

    /**
     * @constructor
     * @param map The map to be able to generate images from.
     */
    constructor(map: atlas.Map) {
        this._map = map;
    }

    /**********************
    * Public Functions
    ***********************/

    /**
    * Generates a Image object for an image of the map.
    */
    public getImage(): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            this.getDataUri().then((dataUri) => {
                var img = new Image();
                img.onload = () => {
                    resolve(img);
                };
                img.onerror = () => {
                    reject('Error creating image.');
                };
                img.src = dataUri;
            }, (e) => {
                reject(e);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * Generates a DataUri for an image of the map.
     */
    public getDataUri(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.getMapCanvas().then((mapCanvas) => {
                var dataUri = mapCanvas.toDataURL('image/png');
                resolve(dataUri);
            }, (e) => {
                reject(e);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * Generates a Blob for an image of the map.
     */
    public getBlob(): Promise<Blob> {
        return new Promise<Blob>((resolve, reject) => {
            this.getDataUri().then((dataUri) => {
                resolve(this.dataUritoBlob(dataUri));
            }, (e) => {
                reject(e);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**********************
    * Private Functions
    ***********************/

    /**
    * Gets copy of the map canvas with a logo and copyrights added to it.
    */
    private getMapCanvas(): Promise<HTMLCanvasElement> {
        return new Promise<HTMLCanvasElement>((resolve, reject) => {

            try {
                var mapCanvas = this._map.getCanvas();
                //return mapCanvas.toDataURL('image/png');

                var mapWidth = mapCanvas.width;
                var mapHeight = mapCanvas.height;

                //Create a copy of the map canvas.
                var offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = mapWidth;
                offscreenCanvas.height = mapHeight;

                var ctx = offscreenCanvas.getContext('2d');
                ctx.drawImage(mapCanvas, 0, 0);

                //Get the copyright information from the map and add it to the map canvas image.
                var copyrightContainer = this._map.getMapContainer().getElementsByClassName('map-copyright');
                if (copyrightContainer && copyrightContainer.length > 0) {
                    var copyrights = (<HTMLDivElement>copyrightContainer[0]).innerText;

                    ctx.font = "9px 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
                    ctx.fillStyle = '#999';

                    var copyrightWidth = ctx.measureText(copyrights).width;
                    ctx.fillText(copyrights, mapWidth - copyrightWidth - 5, mapHeight - 3);
                }

                var logoContainer = this._map.getMapContainer().getElementsByClassName('azure-map-logo');
                if (logoContainer && logoContainer.length > 0) {
                    var logoDivStyle = window.getComputedStyle(logoContainer[0]);                   

                    if (logoDivStyle && logoDivStyle.backgroundImage && logoDivStyle.backgroundImage.indexOf('data:image') >= 0) {
                        var logoUri = logoDivStyle.backgroundImage.slice(5, (logoDivStyle.backgroundImage.length - 2));

                        //Sanitize the URI.
                        logoUri = decodeURIComponent(logoUri.replace(/(\\')/g, "'"));

                        //Add logo to canvas.
                        var logoImg = new Image();
                        logoImg.onload = () => {
                            var w = this._logoHeight * (logoImg.width / logoImg.height);                           
                            ctx.drawImage(logoImg, mapWidth - w - 5, mapHeight - this._logoHeight - 15, w, this._logoHeight);
                            resolve(offscreenCanvas);
                        };
                        logoImg.onerror = (e) => {
                            //If we get here there as an issue loading the logo. Reolve the promise.
                            resolve(offscreenCanvas);
                        };
                        logoImg.src = logoUri;

                        return;
                    }
                }

                //If we get here there as an issue loading the logo. Reolve the promise.
                resolve(offscreenCanvas);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Converts a dataUri to Blob.
     * @param dataUri The dataUri to convert.
     * @returns A blob containing the data from the dataUri.
     */
    private dataUritoBlob(dataUri): Blob {
        //Convert base64 to raw binary data held in a string.
        var byteString = atob(dataUri.split(',')[1]);

        //Extract the mime type.
        var mimeType = dataUri.split(',')[0].split(':')[1].split(';')[0];

        //Write the bytes of the string to an ArrayBuffer.
        var ab = new ArrayBuffer(byteString.length);
        var dw = new DataView(ab);
        for (var i = 0; i < byteString.length; i++) {
            dw.setUint8(i, byteString.charCodeAt(i));
        }

        //Convert the ArrayBuffer to a blob.
        return new Blob([ab], { type: mimeType });
    }
}