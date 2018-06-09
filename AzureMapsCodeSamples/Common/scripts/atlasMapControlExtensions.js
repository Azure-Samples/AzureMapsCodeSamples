//This file contains extensions to the Azure Maps V1 Web map control.

/**
 * Merges two bounding boxes together.
 * @param bbox1 The first bounding box to merge with.
 * @param bbox2 The second bounding box to merge with.
 * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
 */
atlas.data.BoundingBox.merge = function (bbox1, bbox2) {
    var bb1Valid = bbox1 && bbox1.length === 4;
    var bb2Valid = bbox2 && bbox2.length === 4;

    if (bb1Valid && !bb2Valid) {
        return bbox1;
    } else if (bb2Valid && !bb1Valid) {
        return bbox2;
    } else if (!bb1Valid && !bb2Valid) {
        return null;
    }

    // [minLon, minLat, maxLon, maxLat];
    return [Math.min(bbox1[0], bbox2[0]), Math.min(bbox1[1], bbox2[1]), Math.max(bbox1[2], bbox2[2]), Math.max(bbox1[3], bbox2[3])];
}

/**
 * Calculates the bounding box of features, geometries, array of features, geometries, or points.
 * @param data The features, geometries, array of features, geometries, or points to calculate the bounding box for.
 * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
 */
atlas.data.BoundingBox.fromData = function (data) {
    if (data instanceof Array && data.length > 0) {
        if (data[0] instanceof Array) {
            if (data[0].length > 0 && typeof (data[0][0]) === 'number') {
                if (data[0].length === 4) {
                    //data is a bounding box.
                    return data[0];
                } else if (data[0].length >= 2) {
                    //data is an array of Positions.
                    var minLat = data[0][1], maxLat = data[0][1], minLon = data[0][0], maxLon = data[0][0];

                    for (var i = 1; i < data.length; i++) {
                        if (data[i][0] < minLon) {
                            minLon = data[i][0];
                        }

                        if (data[i][0] > maxLon) {
                            maxLon = data[i][0];
                        }

                        if (data[i][1] < minLat) {
                            minLat = data[i][1];
                        }

                        if (data[i][1] > maxLat) {
                            maxLat = data[i][1];
                        }
                    }

                    return [minLon, minLat, maxLon, maxLat];
                }
            }
        } else if (data[0].type || data[0][0] instanceof Array) {
            //data is an array of features or array of data.
            var bbox = atlas.data.BoundingBox.fromData(data[0]);

            for (var i = 1; i < data.length; i++) {
                bbox = atlas.data.BoundingBox.merge(bbox, atlas.data.BoundingBox.fromData(data[i]));
            }

            return bbox;
        } else if (typeof (data[0][0]) === 'number') {
            if (data[0].length === 4) {
                //data is a bounding box.
                return data;
            } else if (data[0].length >= 2) {
                //data is a coordinate. 
                return [data[0][0], data[0][1], data[0][0], data[0][1]];
            }
        }
    } else if (data.type) {
        //data is a feature.
        if (data.bbox && data.bbox.length === 4) {
            return data.bbox;
        } else {
            var dataArray = null;

            switch (data.type) {
                case 'FeatureCollection':
                    //features: Array<Feature<Geometry>>
                    if (data.features && data.features.length > 0) {
                        dataArray = data.features;
                    }
                    break;
                case 'Feature':
                    //geometry: G
                    return atlas.data.BoundingBox.fromData(data.geometry);
                case 'GeometryCollection':
                    //geometries: Geometry[]
                    if (data.geometries && data.geometries.length > 0) {
                        dataArray = data.geometries;
                    }
                    break;
                case 'Point':
                    //coordinates: Position
                    if (data.coordinates && data.coordinates.length >= 2) {
                        return [data[0], data[1], data[0], data[1]];
                    }
                    break;
                case 'LineString':
                case 'MultiPoint':
                    //coordinates: Position[]
                    return atlas.data.BoundingBox.fromData(data.coordinates);
                case 'Polygon':
                case 'MultiLineString':
                case 'MultiPolygon':
                    //coordinates: Position[][] || Position[][][]
                    if (data.coordinates && data.coordinates.length > 0) {
                        dataArray = data.coordinates;
                    }
                    break;
            }

            if (dataArray) {
                var bbox = atlas.data.BoundingBox.fromData(dataArray[0]);

                for (var i = 1; i < dataArray.length; i++) {
                    bbox = atlas.data.BoundingBox.merge(bbox, atlas.data.BoundingBox.fromData(dataArray[i]));
                }

                return bbox;
            }
        }
    }

    return null;
}