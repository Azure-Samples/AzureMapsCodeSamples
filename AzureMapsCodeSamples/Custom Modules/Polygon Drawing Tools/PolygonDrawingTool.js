/**
 * A tool for drawing polygons on the map using a mouse.
 * @param map An Azure Maps map instance to attach the drawing tool too. 
 * @param beforeLayer The name of a layer to render the drawing layer before.
 * @param drawingEndedCallback A callback function that is fired when a drawing has been completed. If recieves a Feature that contains a Polygon in it.
 */
var PolygonDrawingTool = function (map, beforeLayer, drawingEndedCallback) {
    var _self = this;

    var _dataSource = new atlas.data.Feature(new atlas.data.Polygon([[[]]]));

    var _layerName = 'drawingLayer_' + Math.round(Math.random() * 1000000);
    var polygonLayerOptions = {
        name: _layerName,
        color: 'rgba(255,165,0,0.2)',
        overwrite: true,
        before: beforeLayer
    };

    var _lineLayerName = _layerName + '_lines';
    var lineLayerOptions = {
        name: _lineLayerName,
        color: 'orange',
        width: 2,
        //'line-dasharray': [2, 2],
        overwrite: true,
        before: beforeLayer
    };

    var _handleLayerName = _layerName + '_circles';
    var _handleRadius = 5;
    var dragHandleOptions = {
        name: _handleLayerName,
        color: 'orange',
        radius: _handleRadius,
        outlineColor: 'white',
        outlineWidth: 2,
        overwrite: true,
        before: beforeLayer
    };

    /*********************** 
    * Private Methods 
    ***********************/

    //When the user presses 'esc', take the polygon out of edit mode and re-add to base map.
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 27) {
            _dataSource.geometry.coordinates[0].pop();
            closeAndEnd();
        }
    }, false);

    function mouseUp(e) {
        var ring = _dataSource.geometry.coordinates[0];
        ring.pop(); //Remove the preview coordinate.
        ring.push(e.position); //Add the current coordinate.
        ring.push(e.position); //Add a preview coordinate.
        dataSourceUpdated();
    }

    function dragHandleSelected(e) {
        if (_dataSource.geometry.coordinates[0].length > 0) {
            var dist = pixelDistance(_dataSource.geometry.coordinates[0][0], e.position);
            if (dist <= _handleRadius * 1.2) {
                _dataSource.geometry.coordinates[0].pop(); //Remove the preview coordinate.
                _dataSource.geometry.coordinates[0].pop(); //Remove the last coordinate that was added due to the maps mouseup event.
                closeAndEnd();
            }
        }
    }

    function mouseMove(e) {
        //Update the last coordinate in the polygon which is there for preview purposes.
        var ring = _dataSource.geometry.coordinates[0];

        if (ring.length > 1) {
            ring[ring.length - 1] = e.position;
            dataSourceUpdated();
        }
    }

    function closeAndEnd() {
        var ring = _dataSource.geometry.coordinates[0];
        if (ring.length >= 1) {
            ring.push([ring[0][0], ring[0][1]]); //Add the first coordinate to the end to close the polygon.  
            dataSourceUpdated();
        }
        _self.endDrawing();
    }

    function dataSourceUpdated() {
        map.addPolygons([_dataSource], polygonLayerOptions);
        map.addLinestrings([_dataSource], lineLayerOptions);
        map.addCircles([_dataSource], dragHandleOptions);
    }

    function pixelDistance(pos1, pos2) {
        //Approximately 
        var dLat = (pos2[1] - pos1[1]) * (Math.PI / 180);  
        var dLon = (pos2[0] - pos1[0]) * (Math.PI / 180);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((pos1[1]) * (Math.PI / 180)) * Math.cos((pos2[1]) * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var groundResolution = Math.cos(pos2[1] * Math.PI / 180) * Math.PI / (Math.pow(2, map.getCamera().zoom) * 256);
        return c / groundResolution;
    }

    /*********************** 
    * Public Methods 
    ***********************/

    /**
     * Clears all data in the drawing layer. 
     */
    this.clear = function () {
        _dataSource = new atlas.data.Feature(new atlas.data.Polygon([[[]]]));
        dataSourceUpdated(); //Update rather than removing layers for faster startup when starting a new drawing.
    };

    /**
     * Starts a new drawing session. Clears all data in the drawing layer. 
     */
    this.startDrawing = function () {
        _self.clear();

        map.getCanvasContainer().style.cursor = 'pointer';

        map.addEventListener('mousemove', mouseMove);
        map.addEventListener('mouseup', mouseUp);
        map.addEventListener('mouseup', _handleLayerName, dragHandleSelected);
    };

    /**
     * Stops any current drawing in progress.
     */
    this.endDrawing = function () {
        map.getCanvasContainer().style.cursor = '';

        //Remove drag handles
        map.addCircles([], dragHandleOptions);

        // Unbind mouse events
        map.removeEventListener('mousemove', mouseMove);
        map.removeEventListener('mouseup', mouseUp);
        map.removeEventListener('mouseup', _handleLayerName, dragHandleSelected);

        if (drawingEndedCallback) {
            drawingEndedCallback(_dataSource);
        }
    };
};