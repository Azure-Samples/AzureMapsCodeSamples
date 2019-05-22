class ExtendedSymbol {
    /**
     * A class for moving animating a Point that get positions updated
     * @param map
     * @param point
     * @param pointOptions
     * @param beforeLayer
     */
    constructor(map, position, symbolLayerOptions, duration = 1000) {
        this.map = map;
        this.position = position;
        this.symbolLayerOptions = symbolLayerOptions;
        this.duration = duration;
        this.frameRate = 30;
        this.dataSource = new atlas.source.DataSource();
        let point = new atlas.data.Point(position);
        this.shape = new atlas.Shape(point);
        this.dataSource.add(this.shape);
        this.map.sources.add(this.dataSource);
        this.setupOptions();
        this.symbolLayerOptions.textOptions.allowOverlap = true;
        this.symbolLayer = new atlas.layer.SymbolLayer(this.dataSource, null, this.symbolLayerOptions);
        this.map.layers.add(this.symbolLayer);
    }
    /**
     * setup options for smothier rendering
     */
    setupOptions() {
        if (this.symbolLayerOptions.iconOptions) {
            this.symbolLayerOptions.iconOptions.allowOverlap = true;
        }
        else {
            this.symbolLayerOptions.iconOptions = {};
            this.symbolLayerOptions.iconOptions.ignorePlacement = true;
            this.symbolLayerOptions.iconOptions.allowOverlap = true;
        }
        if (this.symbolLayerOptions.textOptions) {
            this.symbolLayerOptions.textOptions.ignorePlacement = true;
            this.symbolLayerOptions.textOptions.allowOverlap = true;
        }
        else {
            this.symbolLayerOptions.textOptions = {};
            this.symbolLayerOptions.textOptions.allowOverlap = true;
        }
    }
    /**
     * Plots the point
     */
    animate(positions) {
        this.intervalId = setInterval(() => {
            let _position = positions.shift();
            this.shape.setCoordinates(_position);
            if (positions.length === 0) {
                clearInterval(this.intervalId);
                this.position = _position;
            }
        }, this.frameRate);
    }
    /**
     * calculates rendering points towards the new position
     * @param newPosition new position to animate to
     */
    preparePath(newPosition) {
        let positions = new Array();
        let totalNumberOfFrames = Math.ceil(this.duration / this.frameRate);
        let distanceBetweenLocations = atlas.math.getDistanceTo(this.position, newPosition);
        let distancePerFrame = Math.ceil(distanceBetweenLocations / totalNumberOfFrames);
        for (let i = 1; i < totalNumberOfFrames; i++) {
            let fraction = (distancePerFrame * i) / distanceBetweenLocations;
            let interpolatedPoint = atlas.math.interpolate(this.position, newPosition, fraction);
            positions.push(interpolatedPoint);
        }
        positions.push(newPosition);
        this.animate(positions);
    }
    /**
     *
     * @param duration Duration in milliseconds to animate the move
     */
    setCoordinate(position, newDuration) {
        if (newDuration) {
            this.duration = newDuration;
        }
        this.preparePath(position);
        // this.shape.setCoordinates(position);
    }
}
//# sourceMappingURL=ExtendedSymbol.js.map