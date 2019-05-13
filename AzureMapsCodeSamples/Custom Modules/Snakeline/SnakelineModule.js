/* This code is licensed under the MIT License (MIT).
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


class Snakeline {
    constructor(map, linestring, polylineOptions, duration) {
        this.map = map;
        this.linestring = linestring;
        this.polylineOptions = polylineOptions;
        this.duration = duration;
        this.frameRate = 30;
        this.shape = null;
        setTimeout(() => {
            this.positions = this._preparePolyline();
            this._plot();
        }, 5000);
    }

    // plot snakeline
    _plot() {
        let dataSource = new atlas.source.DataSource();
        this.map.sources.add(dataSource);

        let coordinatesPerFrame = Math.ceil(this.positions.length / (this.duration / this.frameRate));

        let lineLayer = new atlas.layer.LineLayer(dataSource,
            null,
            this.polylineOptions);

        this.map.layers.add(lineLayer);

        let points = [];
        let shapeAdded = false;

        let intervalId = setInterval(() => {
            if (this.positions.length > 0) {
                let verticesInFrame;
                if (coordinatesPerFrame < this.positions.length) {
                    verticesInFrame = this.positions.splice(0, coordinatesPerFrame);
                } else {
                    verticesInFrame = this.positions.splice(0);
                }
                points.push(...verticesInFrame);
                if (points.length > 1) {
                    if (!shapeAdded) {
                        this.shape = new atlas.Shape(new atlas.data.LineString(points));
                        dataSource.add(this.shape);
                        shapeAdded = true;
                    } else {
                        this.shape.setCoordinates(points);
                    }
                }
            } else {
                clearInterval(intervalId);
            }
        }, this.frameRate);
    }
    /**
     * calculate rendering points along the polyline
     */
    _preparePolyline() {
        let snakeLocations = [];
        let totalNoOfFrames = Math.ceil(this.duration / this.frameRate);
        let distance = atlas.math.getLengthOfPath(this.linestring);
        let frameDistance = Math.ceil(distance / totalNoOfFrames);

        for (let i = 0; i < this.linestring.coordinates.length - 1; i++) {
            snakeLocations.push(this.linestring.coordinates[i]);
            let from = this.linestring.coordinates[i];
            let to = this.linestring.coordinates[i + 1];
            let segmentLength = atlas.math.getDistanceTo(from, to);

            let newLocations = Math.floor(segmentLength / frameDistance);
            for (let j = 1; j < newLocations; j++) {
                let fraction = (frameDistance * j) / segmentLength;
                let intersectedLocation = atlas.math.interpolate(from, to, fraction);
                snakeLocations.push(intersectedLocation);
            }
        }
        // add the last coordinate
        snakeLocations.push(this.linestring.coordinates[this.linestring.coordinates.length - 1]);
        return snakeLocations;
    }

    /*
    * Replays the snakeline
    */
    replay(duration) {
        if (duration) {
            this.duration = duration;
        }
        this.positions = this._preparePolyline();
        this.shape.setCoordinates([]);
        this._plot();
    }
}

export { Snakeline }