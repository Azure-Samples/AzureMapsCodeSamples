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
/** A class for smoothly animating a line as it grows. */
class Snakeline {
    /**
     * A class for smoothly animating a line as it grows.
     * @param map A map instance to attach the snakeline to.
     * @param path A line path to animate over.
     * @param lineOptions Options specifying how the line should be rendered.
     * @param duration The duration in milliseconds to play the animation.
     * @param autoPlay Specifies if the animation should play immediately.
     * @param beforeLayer The layer or id of the layer to insert the new snake line layer before.
     */
    constructor(map, path, lineOptions, duration, autoPlay, beforeLayer) {
        this.frameRate = 30;
        this.map = map;
        this.path = path;
        this.duration = duration || 1000;
        this.shape = null;
        this.dataSource = new atlas.source.DataSource();
        this.map.sources.add(this.dataSource);
        this.lineLayer = new atlas.layer.LineLayer(this.dataSource, null, lineOptions);
        this.map.layers.add(this.lineLayer, beforeLayer);
        if (autoPlay) {
            this.positions = this._preparePolyline();
            this._plot();
        }
    }
    /** Plots the snakeline. */
    _plot() {
        this.dataSource.clear();
        let coordinatesPerFrame = Math.ceil(this.positions.length / (this.duration / this.frameRate));
        let points = [];
        let shapeAdded = false;
        this.intervalId = setInterval(() => {
            if (this.positions.length > 0) {
                let verticesInFrame;
                if (coordinatesPerFrame < this.positions.length) {
                    verticesInFrame = this.positions.splice(0, coordinatesPerFrame);
                }
                else {
                    verticesInFrame = this.positions.splice(0);
                }
                points.push(...verticesInFrame);
                if (points.length > 1) {
                    if (!shapeAdded) {
                        this.shape = new atlas.Shape(new atlas.data.LineString(points));
                        this.dataSource.add(this.shape);
                        shapeAdded = true;
                    }
                    else {
                        this.shape.setCoordinates(points);
                    }
                }
            }
            else {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }, this.frameRate);
    }
    /**
     * Calculate rendering points along the polyline
     * @returns An array of positions that make up the snake line.
     */
    _preparePolyline() {
        let snakeLocations = [];
        let totalNoOfFrames = Math.ceil(this.duration / this.frameRate);
        let distance = atlas.math.getLengthOfPath(this.path);
        let frameDistance = Math.ceil(distance / totalNoOfFrames);
        for (let i = 0; i < this.path.coordinates.length - 1; i++) {
            snakeLocations.push(this.path.coordinates[i]);
            let from = this.path.coordinates[i];
            let to = this.path.coordinates[i + 1];
            let segmentLength = atlas.math.getDistanceTo(from, to);
            let newLocations = Math.floor(segmentLength / frameDistance);
            for (let j = 1; j < newLocations; j++) {
                let fraction = (frameDistance * j) / segmentLength;
                let intersectedLocation = atlas.math.interpolate(from, to, fraction);
                snakeLocations.push(intersectedLocation);
            }
        }
        // add the last coordinate
        snakeLocations.push(this.path.coordinates[this.path.coordinates.length - 1]);
        return snakeLocations;
    }
    /**
     * Replays the snakeline.
     * @param duration The duration in milliseconds to play the snakeline animation.
     */
    replay(duration) {
        if (duration) {
            this.duration = duration;
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.positions = this._preparePolyline();
        if (this.shape) {
            this.shape.setCoordinates([]);
        }
        this._plot();
    }
}
//# sourceMappingURL=SnakelineModule.js.map