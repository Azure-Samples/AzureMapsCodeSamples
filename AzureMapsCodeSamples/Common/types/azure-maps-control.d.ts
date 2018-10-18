declare namespace atlas {

    //data classes
    export module data {

        /**
         * A GeoJSON Position object - an array that specifies the longitude and latitude of a location. The
         * full description is detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.1}.
         */
        export class Position extends Array<number> {

            /**
             * Constructs a Position.
             * @param longitude The position's longitude.
             * @param latitude The position's latitude.
             * @param elevation The position's elevation.
             */
            constructor(longitude: number, latitude: number, elevation?: number);
            /**
             * Clones a position.
             * @param position The position to clone.
             */
            static fromPosition(position: Position): Position;
            /**
             * Compares the longitude and latitude values of two positions to see if they are equal at an accuracy of 6 decimal places.
             * @param pos1 First position to compare.
             * @param pos2 Second position to compare.
             * @param precision The number of decimal places to compare to. Default: 6.
             * @returns A boolean indicating if two positions to see if they are equal at an accuracy of the specified precision or 6 decimal places.
             */
            static areEqual(pos1: Position, pos2: Position, precision?: number): boolean;
            /**
             * Generates a Position object from an object that contains coordinate information.
             * The object is scanned for the following properties using a case insensitive test.
             * Longitude: lng, longitude, lon, x
             * Latitude: lat, latitude, y
             * Elevation: elv, elevation, alt, altitude, z
             * @param latLng The object to extract coordinate information from.
             * @returns A Position object that represents the provided LatLng information.
             */
            static fromLatLng(latLng: object): Position;
            /**
             * Generates a Position object from latitude and longitude values.
             * @param lat The latitude value.
             * @param lng A longitude value.
             * @param elv An elevation value in meters.
             * @returns A Position object that represents the provided LatLng information.
             */
            static fromLatLng(lat: number, lng: number, elv?: number): Position;
            /**
             * Generates a Position object from an array that has the format; [lat, lng] or [lat, lng, elv]
             * @param latLng An array that contains latitude/longitude information in the format; [lat, lng] or [lat, lng, elv]
             * @returns A Position object that represents the provided LatLng information.
             */
            static fromLatLng(latLng: number[]): Position;
            /**
             * Converts an array of objects that contain coordinate information into an array of Positions. Objects that can't be converted are discarded.
             * Each object is either an array in the format; [lat, lng] or [lat, lng, elv], or an object with the any combination of the following properties:
             * Longitude: lng, longitude, lon, x
             * Latitude: lat, latitude, y
             * Elevation: elv, elevation, alt, altitude, z
             * @param latLngs The objects that contain coordinate information.
             * @returns An array of Position objects that contain all the provided coordinate information.
             */
            static fromLatLngs(latLngs: Array<object | number[]>): Position[];
        }

        /**
         * A GeoJSON BoundingBox object - an array that defines a shape whose edges follow lines of constant longitude,
         * latitude, and elevation. All axes of the most southwesterly point are followed by all axes of the more northeasterly
         * point. The axes order of the BoundingBox follows the axes order of geometries. The full description is detailed in
         * [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-5}.
         */
        export class BoundingBox extends Array<number> {
            /**
             * Constructs a BoundingBox
             * @param positions Can be either [west, south, east, north] or [west, south, elevation1, east, north, elevation2]
             */
            constructor(positions: number[]);
            /**
             * Constructs a BoundingBox.
             * @param southwestPosition The southwestern most position of the bounding box.
             * @param northeastPosition The northeastern most position of the bounding box.
             */
            constructor(southwestPosition: Position, northeastPosition: Position);
            /**
             * Clones a bounding box.
             * @param boundingBox The bounding box to clone.
             */
            static fromBoundingBox(boundingBox: BoundingBox): BoundingBox;
            /**
             * Constructs a BoundingBox from the specified dimensions.
             * @param center The center position of the bounding box.
             * @param width The width of the bounding box.
             * @param height The height of the bounding box.
             */
            static fromDimensions(center: Position, width: number, height: number): BoundingBox;
            /**
             * Constructs a BoundingBox from the specified edges.
             * @param west The west edge of the bounding box.
             * @param south The south edge of the bounding box.
             * @param east The east edge of the bounding box.
             * @param north The north edge of the bounding box.
             */
            static fromEdges(west: number, south: number, east: number, north: number): BoundingBox;
            /**
             * Determines if a position is within a bounding box.
             * @param bounds The bounding box to see if the position is in.
             * @param position The position to see if it is in the bounding box.
             * @returns True if the position is within the bounding box.
             */
            static containsPosition(bounds: BoundingBox, position: Position): boolean;
            /**
             * Returns a boolean indicating if the bounding box crosses the antimeridian or not.
             * @param bounds The bounding box to check.
             * @returns A boolean indicating if the bounding box crosses the antimeridian or not.
             */
            static crossesAntimeridian(bounds: BoundingBox): boolean;
            /**
             * Calculates the center of a bounding box.
             * @param bounds A bounding box to calculate the center of.
             * @returns A position that represents the center of the bounding box.
             */
            static getCenter(bounds: BoundingBox): Position;
            /**
             * Gets the height of a bounding box in degrees.
             * @param bounds The bounding box to check.
             * @returns The height of the bounding box in degrees.
             */
            static getHeight(bounds: BoundingBox): number;
            /**
             * Gets the width of a bounding box in degrees.
             * @param bounds The bounding box to check.
             * @returns The width of the bounding box in degrees.
             */
            static getWidth(bounds: BoundingBox): number;
            /**
             * Returns the south west position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south west position of the bounding box.
             */
            static getSouthWest(bounds: BoundingBox): Position;
            /**
             * Returns the north east position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north east position of the bounding box.
             */
            static getNorthEast(bounds: BoundingBox): Position;
            /**
             * Returns the north west position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north west position of the bounding box.
             */
            static getNorthWest(bounds: BoundingBox): Position;
            /**
             * Returns the south east position of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south east position of the bounding box.
             */
            static getSouthEast(bounds: BoundingBox): Position;
            /**
             * Returns the south position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The south position value of the bounding box.
             */
            static getSouth(bounds: BoundingBox): number;
            /**
             * Returns the west position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The west position value of the bounding box.
             */
            static getWest(bounds: BoundingBox): number;
            /**
             * Returns the north position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The north position value of the bounding box.
             */
            static getNorth(bounds: BoundingBox): number;
            /**
             * Returns the east position value of the bounding box.
             * @param bounds The bounding box to get the position from.
             * @returns The east position value of the bounding box.
             */
            static getEast(bounds: BoundingBox): number;
            /**
             * Determines is two bounding boxes intersect.
             * @param bounds1 The first bounding box to compare with.
             * @param bounds2 The second bounding box to compare with.
             * @returns true if the provided bounding boxes intersect.
             */
            static intersect(bounds1: BoundingBox, bounds2: BoundingBox): boolean;
            /**
             * Merges two bounding boxes together.
             * @param bounds1 The first bounding box to merge with.
             * @param bounds2 The second bounding box to merge with.
             * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
             */
            static merge(bounds1: BoundingBox, bounds2: BoundingBox): BoundingBox;
            /**
             * Creates a BoundingBox that contains all provided Position objects.
             * @param positions An array of locations to use to generate the bounding box.
             * @returns A bounding box that contains all given positions.
             */
            static fromPositions(positions: Position[]): BoundingBox;
            /**
             * Creates a BoundingBox from any array of objects that contain coordinate information.
             * Each object is either an array in the format; [lat, lng] or [lat, lng, elv], or an object with the any combination of the following properties:
             * Longitude: lng, longitude, lon, x
             * Latitude: lat, latitude, y
             * Elevation: elv, elevation, alt, altitude, z
             * @param latLngs The objects that contain coordinate information.
             * @returns A BoundingBox that contains all the provided coordinate information.
             */
            static fromLatLngs(latLngs: Array<object | number[]>): BoundingBox;
            /**
             * Calculates the bounding box of a FeatureCollection, Feature, Geometry, Shape or array of these objects.
             * @param data The FeatureCollection, Feature, Geometry, Shape or array of these objects to calculate the bounding box for.
             * @returns A bounding box in the format [minLon, minLat, maxLon, maxLat].
             */
            static fromData(data: FeatureCollection | Feature<Geometry, any> | Geometry | Shape | Array<FeatureCollection | Feature<Geometry, any> | Geometry>): BoundingBox;
            /**
             * Splits a BoundingBox that crosses the Antimeridian into two BoundingBox's. One entirely west of the Antimerdian and another entirely east of the Antimerdian.
             * @param bounds
             */
            static splitOnAntimeridian(bounds: BoundingBox): BoundingBox[];
        }

        /**
         * A base Geometry object in which all geometry shapes extend; Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection
         */
        export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;

        /**
         * A GeoJSON FeatureCollection object - a JSON object that contains a collection of GeoJSON features. The full
         * description is detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.3}.
         */
        export class FeatureCollection {

            /**
             * A static GeoJSON type descriptor for the FeatureCollection class to be used in runtime comparisons.
             */
            static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "FeatureCollection".
             */
            type: string;

            /**
             * The collection of GeoJSON features contained in the feature collection.
             */
            features: Array<Feature<Geometry, any>>;

            /**
             * Constructs a FeatureCollection.
             * @param features The collection of features that make up the feature collection.
             */
            constructor(features: Array<Feature<Geometry, any>>);
        }

        /**
         * A GeoJSON Feature object - a JSON object representing a spatially bounded entity. The full description is detailed in
         * [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.2}.
         */
        export class Feature<G extends Geometry, P extends any> {

            /**
             * A static GeoJSON type descriptor for the Feature class to be used in runtime comparisons.
             */
            static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "Feature".
             */
            type: string;

            /**
             * The geometry of the feature.
             */
            geometry: G;

            /**
             * The properties of the feature.
             */
            properties?: any;

            /**
             * The id of the feature.
             */
            id?: string;

            /**
             * Constructs a Feature.
             * @param geometry The geometry of the feature.
             * @param properties The properties of the feature.
             * @param id The id of the feature.
             */
            constructor(geometry: G, properties?: P, id?: string);
        }

        /**
         * A GeoJSON Point object - a JSON object that represents a geographic position. The full description is detailed in
         * [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.2}.
         */
        export class Point {
            /**
             * A static GeoJSON type descriptor for the Point class to be used in runtime comparisons.
             */
            static readonly TYPE: string;
            /**
             * A GeoJSON type descriptor with value "Point".
             */
            readonly type: string;
            /**
             * The position defining the point.
             */
            coordinates: Position;
            /**
             * Constructs a Point.
             * @param coordinates The position defining the point.
             */
            constructor(coordinates: Position);

        }

        /**
         * A GeoJSON LineString object - a JSON object that represents a geographic curve. The full description is detailed
         * in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.4}.
         */
        export class LineString {

            /**
             * A static GeoJSON type descriptor for the LineString class to be used in runtime comparisons.
             */
            static readonly TYPE: string;
            /**
             * A GeoJSON type descriptor with value "LineString".
             */
            readonly type: string;
            /**
             * The ordered list of positions defining the linestring.
             */
            coordinates: Position[];
            /**
             * The bounding box of the linestring.
             */
            readonly bbox?: BoundingBox;
            /**
             * Constructs a LineString.
             * @param coordinates The ordered list of positions defining the linestring.
             * @param bbox The bounding box of the linestring.
             */
            constructor(coordinates: Position[], bbox?: BoundingBox);
        }

        /**
         * A GeoJSON Polygon object - a JSON object that represents a geographic polygon. The full description is detailed in
         * [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.6}.
         */
        export class Polygon {

            /**
             * A static GeoJSON type descriptor for the Polygon class to be used in runtime comparisons.
             */
            static readonly TYPE: string;
            /**
             * A GeoJSON type descriptor with value "Polygon".
             */
            type: string;
            /**
             * The array of linear ring coordinate arrays defining the polygon.
             */
            coordinates: Position[][];
            /**
             * The bounding box of the polygon.
             */
            readonly bbox?: BoundingBox;
            /**
             * Constructs a Polygon.
             * @param coordinates The array of linear ring coordinate arrays defining the polygon.
             * @param bbox The bounding box of the polygon.
             */
            constructor(coordinates: Position[][], bbox?: BoundingBox);
        }

        /**
         * A GeoJSON MultiPoint object - a JSON object that represents multiple geographic positions. The full description
         * is detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.3}.
         */
        export class MultiPoint {

            /**
             * A static GeoJSON type descriptor for the MultiPoint class to be used in runtime comparisons.
             */
            public static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "MutliPoint".
             */
            public type: string;

            /**
             * The array of multiple positions defining the multipoint.
             */
            public coordinates: Position[];

            /**
             * The bounding box of the multipoint.
             */
            public readonly bbox?: BoundingBox;

            /**
             * Constructs a MultiPoint.
             * @param coordinates The array of multiple positions defining the multipoint.
             * @param bbox The bounding box of the multipoint.
             */
            constructor(coordinates: Position[], bbox?: BoundingBox)
        }

        /**
         * A GeoJSON MultiLineString object - a JSON object that represents multiple geographic curves. The full description
         * is detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.5}.
         */
        export class MultiLineString {

            /**
             * A static GeoJSON type descriptor for the MultiLineString class to be used in runtime comparisons.
             */
            public static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "MutliLineString".
             */
            public type: string;

            /**
             * The array of LineString coordinate arrays defining the multilinestring.
             */
            public coordinates: Position[][];

            /**
             * The bounding box of the multilinestring.
             */
            public readonly bbox?: BoundingBox;

            /**
             * Constructs a MultiLineString.
             * @param coordinates The array of LineString coordinate arrays defining the multilinestring.
             * @param bbox The bounding box of the multilinestring.
             */
            constructor(coordinates: Position[][], bbox?: BoundingBox)
        }

        /**
         * A GeoJSON MultiPolygon object - a JSON object that represents multiple geographic polygons. The full description is
         * detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.7}.
         */
        export class MultiPolygon {

            /**
             * A static GeoJSON type descriptor for the MultiPolygon class to be used in runtime comparisons.
             */
            public static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "MutliPolygon".
             */
            public type: string;

            /**
             * The array of polygon coordinate arrays defining the multipolygon.
             */
            public coordinates: Position[][][];

            /**
             * The bounding box of the multipolygon.
             */
            public readonly bbox?: BoundingBox;

            /**
             * Constructs a MultiPolygon.
             * @param coordinates The array of polygon coordinate arrays defining the multipolygon.
             * @param bbox The bounding box of the multipolygon.
             */
            constructor(coordinates: Position[][][], bbox?: BoundingBox)
        }

        /**
         * A GeoJSON GeometryCollection object - a JSON object that contains a collection of a GeoJSON Geometry objects. The
         * full description is detailed in [RFC 7946]{@link https://tools.ietf.org/html/rfc7946#section-3.1.8}.
         */
        export class GeometryCollection {

            /**
             * A static GeoJSON type descriptor for the GeometryCollection class to be used in runtime comparisons.
             */
            static readonly TYPE: string;

            /**
             * A GeoJSON type descriptor with value "GeometryCollection".
             */
            type: string;

            /**
             * The collection of GeoJSON geometries contained in the geometry collection.
             */
            geometries: Geometry[];

            /**
             * Constructs a GeometryCollection.
             * @param geometries The collection of geometries that make up the geometry collection.
             */
            constructor(geometries: Geometry[]);
        }

    }

    //controls classes
    export module controls {

        /**
         * A control for changing the rotation of the map.
         */
        export class CompassControl implements Control {
            /**
             * Constructs a CompassControl.
             * @param options The options for the control.
             */
            constructor(options?: CompassControlOptions);
            /**
             * Initialization method for the control which is called when added to the map.
             * @param map The map that the control will be added to.
             * @param options The ControlOptions for this control.
             * @return An HTMLElement to be placed on the map for the control.
             */
            onAdd(map: Map, options: ControlOptions): HTMLElement;
            /**
             * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
             * control.
             */
            onRemove(): void;
        }

        /**
         * A control for changing the pitch of the map.
         */
        export class PitchControl implements Control {
            /**
             * Constructs a PitchControl.
             * @param options The options for the control.
             */
            constructor(options?: PitchControlOptions);
            /**
             * Initialization method for the control which is called when added to the map.
             * @param map The map that the control will be added to.
             * @param options The ControlOptions for this control.
             * @return An HTMLElement to be placed on the map for the control.
             */
            onAdd(map: Map, options: ControlOptions): HTMLElement;
            /**
             * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
             * control.
             */
            onRemove(): void;
        }

        /**
         * A control for changing the style of the map.
         */
        export class StyleControl implements Control {
            /**
             * Constructs a StyleControl.
             * @param options The options for the control.
             */
            constructor(options?: StyleControlOptions);
            /**
             * Initialization method for the control which is called when added to the map.
             * @param map The map that the control will be added to.
             * @param options The ControlOptions for this control.
             * @return An HTMLElement to be placed on the map for the control.
             */
            onAdd(map: Map, options?: ControlOptions): HTMLElement;
            /**
             * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
             * control.
             */
            onRemove(): void;
        }

        /**
         * A control for changing the zoom of the map.
         */
        export class ZoomControl implements Control {
            /**
             * Constructs a ZoomControl.
             * @param options The options for the control.
             */
            constructor(options?: ZoomControlOptions);
            /**
             * Initialization method for the control which is called when added to the map.
             * @param map The map that the control will be added to.
             * @return An HTMLElement to be placed on the map for the control.
             */
            onAdd(map: Map): HTMLElement;
            /**
             * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
             * control.
             */
            onRemove(): void;
        }
    }

    //layer classes
    export module layer {

        /**
         * Renders Point objects as scalable circles (bubbles).
         */
        export class BubbleLayer extends Layer {

            /**
             * Constructs a new BubbleLayer.
             * @param source The id or instance of a data source which the layer will render.
             * @param id The id of the layer. If not specified a random one will be generated.
             * @param options The options of the bubble layer.
             */
            constructor(source: string | atlas.source.Source, id?: string, options?: BubbleLayerOptions);

            /**
             * Gets the options of the bubble layer.
             */
            getOptions(): BubbleLayerOptions;

            /**
             * Gets the source provided when creating the layer.
             */
            getSource(): string | atlas.source.Source;

            /**
             * Sets the options of the bubble layer.
             * @param newOptions The new options of the bubble layer.
             */
            setOptions(options: BubbleLayerOptions): void;

        }

        /**
         * Abstract class for other layer classes to extend.
         */
        export abstract class Layer {

            /**
             * A property for associating custom data with the layer.
             */
            metadata?: any;
            constructor(id?: string);

            /**
             * Gets the id of the layer
             */
            getId(): string;


        }

        /**
         * Renders line data on the map. Can be used with SimpleLine, SimplePolygon,
         * CirclePolygon, LineString, MultiLineString, Polygon, and MultiPolygon objects.
         */
        export class LineLayer extends Layer {

            /**
             * Constructs a new LineLayer.
             * @param source The id or instance of a data source which the layer will render.
             * @param id The id of the layer. If not specified a random one will be generated.
             * @param options The options of the line layer.
             */
            constructor(source: string | atlas.source.Source, id?: string, options?: LineLayerOptions);

            /**
             * Gets the options of the line layer.
             */
            getOptions(): LineLayerOptions;

            /**
             * Gets the source provided when creating the layer.
             */
            getSource(): string | atlas.source.Source;

        }

        /**
         * Renders filled Polygon and MultiPolygon objects on the map.
         */
        export class PolygonLayer extends Layer {

            /**
             * Constructs a new PolygonLayer.
             * @param source The id or instance of a data source which the layer will render.
             * @param id The id of the layer. If not specified a random one will be generated.
             * @param options The options of the polygon layer.
             */
            constructor(source: string | atlas.source.Source, id?: string, options?: PolygonLayerOptions);

            /**
             * Gets the options of the polygon layer.
             */
            getOptions(): PolygonLayerOptions;

            /**
             * Gets the source provided when creating the layer.
             */
            getSource(): string | atlas.source.Source;

            /**
             * Sets the options of the polygon layer.
             * @param newOptions The new options of the polygon layer.
             */
            setOptions(options: PolygonLayerOptions): void;

        }

        /**
         * Renders point based data as symbols on the map using text and/or icons.
         * Symbols can also be created for line and polygon data as well.
         */
        export class SymbolLayer extends Layer {
            /**
             * Constructs a new SymbolLayer.
             * @param source The id or instance of a data source which the layer will render.
             * @param id The id of the layer. If not specified a random one will be generated.
             * @param options The options of the polygon layer.
             */
            constructor(source: string | atlas.source.Source, id?: string, options?: SymbolLayerOptions);
            /**
             * Gets the options of the symbol layer.
             */
            getOptions(): SymbolLayerOptions;
            /**
             * Gets the source provided when creating the layer.
             */
            getSource(): string | atlas.source.Source;
            /**
             * Sets the options of the symbol layer.
             * @param newOptions The new options of the polygon layer.
             */
            setOptions(options: SymbolLayerOptions): void;
        }

        /**
         * Renders raster tiled images on top of the map tiles.
         */
        export class TileLayer extends Layer {
            /**
             * Constructs a new TileLayer.
             * @param options The options for the tile layer.
             * @param id The id of the layer. If not specified a random one will be generated.
             */
            constructor(options: TileLayerOptions, id?: string);
            /**
             * Gets the options of the tile layer.
             */
            getOptions(): TileLayerOptions;
            /**
             * Sets the options of the tile layer.
             * @param newOptions The new options of the tile layer.
             */
            setOptions(options: TileLayerOptions): void;
        }
    }

    //source classes
    export module source {

        /**
         * A data source class that makes it easy to manage shapes data that will be displayed on the map.
         * A data source must be added to a layer before it is visible on the map.
         * The DataSource class may be used with the SymbolLayer, LineLayer, PolygonLayer, BubbleLayer, and HeatMapLayer.
         */
        export class DataSource extends Source {
            /**
             * A data source class that makes it easy to manage shapes data that will be displayed on the map.
             * A data source must be added to a layer before it is visible on the map.
             * The `DataSource` class may be used with the `SymbolLayer`, `LineLayer`, `PolygonLayer`, `BubbleLayer`, and `HeatMapLayer`.
             * @param id a unique id that the user assigns to the data source. If this is not specified, then the data source will automatically be assigned an id.
             * @param options the options for the data source.
             */
            constructor(id?: string, options?: DataSourceOptions);
            /**
             * Adds shapes to the data source.
             * GeoJSON objects will be wrapped within a Shape class to make them easier to manage.
             * Optionally specify an index to insert the feature between other shapes/features in the layers.
             * @param data
             * @param index
             */
            add(data: atlas.data.FeatureCollection | atlas.data.Feature<atlas.data.Geometry, any> | atlas.data.Geometry | atlas.data.Geometry[] | atlas.data.GeometryCollection | Shape | Shape[], index?: number): void;
            /**
             * Removes all data in the data source.
             */
            clear(): void;
            /**
             * Cleans up any resources this object is consuming.
             */
            dispose(): void;
            /**
             * Gets the options used by the data source.
             */
            getOptions(): DataSourceOptions;
            /**
             * Retrieves a shape with the specified id.
             * If no shape with the specified id is contained in the data source, null will be return.
             * @param id The id of the shape to return.
             */
            getShapeById(id: string): Shape;
            /**
             * Removes a shape from the data source.
             * If a string is passed in, it is assumed to be an id.
             * If a number is passed in, removes the shape at that index.
             */
            remove(shape: number | string | Shape): void;
            /**
             * Sets the data source options.
             * The data source will retain its current values for any option not specified in the supplied options.
             */
            setOptions(options: DataSourceOptions): void;
            /**
             * Returns a GeoJSON FeatureCollection which contains all the shape data that is in the data source.
             */
            toJson(): atlas.data.FeatureCollection;
        }

        /**
         * A base abstract class in which all other source objects extend.
         * A source must be added to a layer before it is visible on the map.
         */
        export abstract class Source {
            constructor(id?: string);
            /**
             * Gets the id of the data source
             */
            getId(): string;
        }

        /**
         * A vector tile source describes how to access a vector tile layer.
         * Vector tile sources can be used with; SymbolLayer, LineLayer, PolygonLayer, BubbleLayer, HeatmapLayer and VectorTileLayer.
         */
        export class VectorTileSource extends Source {
            constructor(id?: string, options?: VectorTileSourceOptions);
            /**
             * Gets the options of the VectorTileSource.
             */
            getOptions(): VectorTileSourceOptions;
            /**
             * Returns all GeoJSON features that are in the VectorTileSource and which satisfy the specified filter expression.
             * @param sourceLayer Required if the source is a VectorTileSource. Specifies the layer within the VectorTileSource to query.
             * @param filter A filter that will limit the query.
             */
            getShape(sourceLayer: string, filter?: Expression): Array<atlas.data.Feature<atlas.data.Geometry, any>>;
        }
    }

    //math functions
    export module math {

        /**
         * Takes a BoundingBox and converts it to a polygon.
         * @param bounds The BoundingBox to convert to a Polygon.
         * @returns A polygon representation of the BoundingBox.
         */
        export function boundingBoxToPolygon(bounds: atlas.data.BoundingBox): atlas.data.Polygon;
        /**
         * Converts a distance from one distance units to another. Supported units: miles, nauticalMiles, yards, meters, kilometers, feet
         * @param distance A number that represents a distance to convert.
         * @param fromUnits The distance units the original distance is in.
         * @param toUnits The desired distance units to convert to.
         * @param decimals Specifies the number of decimal places to round the result to. If undefined, no rounding will occur.
         * @returns A distance in the new units.
         */
        export function convertDistance(distance: number, fromUnits: string, toUnits: string, decimals?: number): number;
        /**
         * Calculates an array of positions that form a cardinal spline between the specified array of positions.
         * @param positions The array of positions to calculate the spline through.
         * @param tension A number that indicates the tightness of the curve. Can be any number, although a value between 0 and 1 is usually used. Default: 0.5
         * @param nodeSize Number of nodes to insert between each position. Default: 15
         * @param close A boolean indicating if the spline should be a closed ring or not. Default: false
         * @returns An array of positions that form a cardinal spline between the specified array of positions.
         */
        export function getCardinalSpline(positions: atlas.data.Position[], tension?: number, nodeSize?: number, close?: boolean): atlas.data.Position[];
        /**
         * Calculates a destination position based on a starting position, a heading, a distance, and a distance unit type.
         * @param origin Position that the destination is relative to.
         * @param heading A heading angle between 0 - 360 degrees. 0 - North, 90 - East, 180 - South, 270 - West.
         * @param distance Distance that destination is away.
         * @param units Unit of distance measurement. Default is meters.
         * @returns A position that is the specified distance away from the origin.
         */
        export function getDestination(origin: atlas.data.Position, heading: number, distance: number, units?: string): atlas.data.Position;
        /**
         * Calculate the distance between two position objects on the surface of the earth using the Haversine formula.
         * @param origin First position to calculate distance between.
         * @param destination Second position to calculate distance between.
         * @param units Unit of distance measurement. Default is meters.
         * @returns The shortest distance between two positions in the specified units.
         */
        export function getDistanceTo(origin: atlas.data.Position, destination: atlas.data.Position, units?: string): number;
        /**
         * Retrieves the radius of the earth in a specific distance unit for WGS84.
         * @param units Unit of distance measurement. Default: meters
         * @returns A number that represents the radius of the earth in a specific distance unit.
         */
        export function getEarthRadius(units?: string): number;
        /**
         * Takes an array of positions objects and fills in the space between them with accurately positioned positions to form an approximated Geodesic path.
         * @param path Array of position objects that form a path to fill in.
         * @param nodeSize Number of nodes to insert between each position. Default: 15
         * @returns An array of position objects that form a geodesic paths.
         */
        export function getGeodesicPath(path: atlas.data.LineString | atlas.data.Position[], nodeSize?: number): atlas.data.Position[];
        /**
         * Calculates the heading from one position object to another.
         * @param origin Point of origin.
         * @param destination Destination to calculate relative heading to.
         * @returns A heading in degrees between 0 and 360. 0 degrees points due North.
         */
        export function getHeading(origin: atlas.data.Position, destination: atlas.data.Position): number;
        /**
         * Calculates the distance between all position objects in an array.
         * @param path The array of position objects that make up the path to calculate the length of.
         * @param units Unit of distance measurement. Default: meters
         * @returns The distance between all positions in between all position objects in an array on the surface of a earth in the specified units.
         */
        export function getLengthOfPath(path: atlas.data.LineString | atlas.data.Position[], units?: string): number;
        /**
         * Calculates the position object on a path that is a specified distance away from the start of the path. If the specified distance is longer
         * than the length of the path, the last position of the path will be returned.
         * @param path A polyline or array of position coordinates that form a path.
         * @param distance The distance along the path (from the start) to calculate the position for.
         * @param units Unit of distance measurement. Default is meters.
         * @returns A position object that is the specified distance away from the start of the path when following the path.
         */
        export function getPositionAlongPath(path: atlas.data.LineString | atlas.data.Position[], distance: number, units?: string): atlas.data.Position;
        /**
         * Calculates an array of position objects that are an equal distance away from a central point to create a regular polygon.
         * @param origin Center of the regular polygon.
         * @param radius Radius of the regular polygon.
         * @param numberOfPositions Number of positions the polygon should have.
         * @param units Unit of distance measurement. Default is meters.
         * @param offset An offset to rotate the polygon. When 0 the first position will align with North.
         * @returns An array of position objects that form a regular polygon.
         */
        export function getRegularPolygonPath(origin: atlas.data.Position, radius: number, numberOfPositions: number, units?: string, offset?: number): atlas.data.Position[];
        /**
         * Calculates a position object that is a fractional distance between two position objects.
         * @param origin First position to calculate mid-point between.
         * @param destination Second position to calculate mid-point between.
         * @param fraction The fractional parameter to calculate a mid-point for. Default 0.5.
         * @returns A position that lies a fraction of the distance between two position objects, relative to the first position object.
         */
        export function interpolate(origin: atlas.data.Position, destination: atlas.data.Position, fraction?: number): atlas.data.Position;
        /**
         * Normalizes a latitude value between -90 and 90 degrees.
         * @param lat The latitude value to normalize.
         */
        export function normalizeLatitude(lat: number): number;
        /**
         * Normalizes a longitude value between -180 and 180 degrees.
         * @param lng The longitude value to normalize.
         */
        export function normalizeLongitude(lng: number): number;

    }

    /**
     * The control for a visual and interactive web map.
     */
    export class Map {
        readonly controls: ControlManager;
        readonly events: EventManager;
        readonly imageSprite: ImageSpriteManager;
        readonly layers: LayerManager;
        readonly markers: HtmlMarkerManager;
        readonly sources: SourceManager;
        /**
         * Displays a map in the specified container.
         * @param container The id of the element where the map should be displayed.
         * @param options Options for the initial display and interactability with the map.
         */
        constructor(container: string, options: ServiceOptions & CameraOptions & StyleOptions & UserInteractionOptions);
        /**
         * Returns the HTMLCanvasElement that the map is drawn to.
         */
        getCanvas(): HTMLCanvasElement;
        /**
         * Returns the HTMLElement that contains the map's HTMLCanvasElement. The map's events (e.g. panning and zooming)
         * are attached to this element.
         */
        getCanvasContainer(): HTMLElement;
        /**
         * Returns the HTMLElement that contains the map.
         */
        getMapContainer(): HTMLElement;
        /**
         * Returns the service options with which the map control was initialized.
         */
        getServiceOptions(): ServiceOptions;
        /**
         * Set the service options.
         */
        setServiceOptions(options: ServiceOptions): void;
        /**
         * Set the camera of the map control with an animated transition. Any options not specified will default to their
         * current values.
         * @param options The options for setting the map's camera and for the animation of any view change.
         */
        setCamera(options?: (CameraOptions | CameraBoundsOptions) & AnimationOptions): void;
        /**
         * Set the camera bounds of the map control.
         * @param options The options for setting the map's camera bounds.
         * @deprecated recommend setCamera.
         */
        setCameraBounds(options?: CameraBoundsOptions): void;
        /**
         * Returns the camera's current properties.
         */
        getCamera(): CameraOptions & CameraBoundsOptions;
        /**
         * Set the map control's style options. Any options not specified will default to their current values.
         * @param options The options for setting the style of the map control.
         */
        setStyle(options?: StyleOptions): void;
        /**
         * Returns the map control's current style settings.
         */
        getStyle(): StyleOptions;
        /**
         * Add an icon to the map to use for pins. Map and image must be fully loaded before the icon can be added. Use the
         * addEventListener method with event type 'load'.
         * @param id The identifier of the icon.
         * @param icon The icon image.
         * @deprecated Use map.imageSprite.add instead.
         */
        addIcon(id: string, icon: HTMLImageElement): void;
        /**
         * Add a collection of points to a layer of the map as pins. The layer and its options can be specified through a
         * PinLayerOptions object. Options for the layer can
         * only be specified upon the layer's initial creation. Map must be fully loaded before the pins can be added. Use
         * the addEventListener method with event type 'load'.
         * @param pins The points to add.
         * @param options The layer options for the pins.
         * @deprecated Use atlas.layer.SymbolLayer instead.
         */
        addPins(pins: Array<data.Feature<data.Point, deprecated.PinProperties>>, options?: deprecated.PinLayerOptions): void;
        /**
         * Add a collection of points to a layer of the map as circles. The layer and its options can be specified through a
         * CircleLayerOptions object. Options for the layer
         * can only be specified upon the layer's initial creation. Map must be fully loaded before the circles can be
         * added. Use the addEventListener method with event type 'load'.
         * @param circles The circles to add.
         * @param options The layer options for the circles.
         * @deprecated Use atlas.layer.BubbleLayer instead.
         */
        addCircles(circles: Array<data.Feature<data.Point, deprecated.CircleProperties>>, options?: deprecated.CircleLayerOptions): void;
        /**
         * Add a collection of linestrings to a layer of the map. The layer and its options can be specified through a
         * LinestringLayerOptions object. Options for
         * the layer can only be specified upon the layer's initial creation. Map must be fully loaded before the
         * linestrings can be added. Use the addEventListener method with event type 'load'.
         * @param linestrings The linestrings to add.
         * @param options The layer options for the linestrings.
         * @deprecated Use atlas.layer.LineLayer instead.
         */
        addLinestrings(linestrings: Array<data.Feature<data.LineString | data.MultiLineString, deprecated.LinestringProperties>>, options?: deprecated.LinestringLayerOptions): void;
        /**
         * Add a collection of polygons to a layer of the map. The layer and its options can be specified through a
         * PolygonLayerOptions object. Options for
         * the layer can only be specified upon the layer's initial creation. Map must be fully loaded before the polygons
         * can be added. Use the addEventListener method with event type 'load'.
         * @param polygons The polygons to add.
         * @param options The layer options for the polygons.
         * @deprecated Use atlas.layer.PolygonLayer instead.
         */
        addPolygons(polygons: Array<data.Feature<data.Polygon | data.MultiPolygon, deprecated.PolygonProperties>>, options?: deprecated.PolygonLayerOptions): void;
        /**
         * Adds a raster layer to the map. The layer and its options can be specified through a
         * RasterLayerOptions object. Options for
         * the layer can only be specified upon the layer's initial creation.
         * @param tileSources  A list of endpoints specified as strings from which raster images can be requested. The
         * endpoints can be parameterized with the tags '{z}', '{x}' and '{y}' to specify the zoom, x-index, and y-index of
         * the needed tile respectively. The map control will request and place the tiles that are contained in the map's
         * viewport.
         * @param options The options for the raster layer.
         * @deprecated Use atlas.layer.TileLayer instead.
         */
        addRaster(tileSources: string[], options?: deprecated.RasterLayerOptions): void;
        /**
         * Returns a list of the map's layers from bottom to top.
         * @deprecated Use layers.getLayers() instead.
         */
        getLayers(): string[];
        /**
         * Removes a collection of layers from the map.
         * For each layer if a source by the name of "<layerName>-source" exists it will be removed too.
         * @param layerNames An array of layer names to remove from the map.
         * @deprecated Use layers.remove instead.
         */
        removeLayers(layerNames: string[]): void;
        /**
         * @deprecated recommend map.markers.add
         * Adds a custom HTMLElement to the map at a specified position.
         * @param element The HTMLElement to add.
         * @param position The position to place the element.
         */
        addHtml(element: HTMLElement, position: atlas.data.Position): string;
        /**
         * @deprecated recommend map.markers.remove
         * Removes a custom HTMLElement from the map.
         * @param elementId The id of element to remove.
         */
        removeHtml(elementId: string): void;
        /**
         * Add an event listener to the map.
         * @param type The event listener types:
         * <p>'click':  A pointing device is pressed and released at the same point on the map.</p>
         * <p>'dblclick':  A pointing device is clicked twice on the map.</p>
         * <p>'mousemove': A pointing device is moved within the map. </p>
         * <p>'mouseup': A pointing device is released within the map. </p>
         * <p>'mousedown': A pointing device is pressed within the map. </p>
         * <p>'mouseout': A pointing device leaves the map's canvas.</p>
         * <p>'touchstart': A touch point is placed on the touch surface. </p>
         * <p>'touchend': A touch point is removed from the touch surface. </p>
         * <p>'touchmove': A touch point is moved along the touch surface. </p>
         * <p>'drag': An element is dragged. </p>
         * <p>'dragstart': The user starts dragging an element.</p>
         * <p>'dragend': A drag operation is ended.</p>
         * <p>'zoomstart': Just before the map transitions from one zoom level to another.</p>
         * <p>'zoom': During the map transitions from one zoom level to another.</p>
         * <p>'zoomend': After the map completes a transition from one zoom level to another.</p>
         * <p>'rotatestart': When a "drag to rotate" starts.</p>
         * <p>'rotate': During a "drag to rotate" interaction.</p>
         * <p>'rotateend': After When a "drag to rotate" ends.</p>
         * <p>'pitchstart': When the map's pitch (tilt) starts to change.</p>
         * <p>'pitch': Whenever the map's pitch (tilt) changes.</p>
         * <p>'pitchend': After the map's pitch (tilt) completes the change.</p>
         * <p>'resize': The document view has been resized.<p>
         * <p>'load': Progression has been successful.</p>
         * @param callback The callback to fire when the event occurs.
         * @deprecated Use map.events.add instead.
         */
        addEventListener(type: string, callback: any): void;
        /**
         * Add an event listener to a layer of the map. Event listeners cannot be added to the default "base", "transit" and
         * "labels" layers of the map.
         * @param type The event listener types:
         * <p>'click':  A pointing device is pressed and released at the same point on the map.</p>
         * <p>'dblclick':  A pointing device is clicked twice on the map.</p>
         * <p>'mousemove': A pointing device is moved within the map. </p>
         * <p>'mouseup': A pointing device is released within the map. </p>
         * <p>'mousedown': A pointing device is pressed within the map. </p>
         * <p>'mouseenter': A pointing device is moved onto a specific layer that has the listener attached. </p>
         * <p>'mouseleave': A pointing device is moved off a specific layer that has the listener attached.</p>
         * <p>'mouseover': A pointing device is moved within the map.</p>
         * <p>'touchstart': A touch point is placed on the touch surface. </p>
         * <p>'touchend': A touch point is removed from the touch surface. </p>
         * @param layer The layer of the map.
         * @param callback The callback to fire when the event occurs.
         * @deprecated Use map.events.add instead.
         */
        addEventListener(type: string, layer: string, callback: any): void;
        /**
         * Remove an event listener from the map.
         * @param type The event type.
         * @param callback The callback of the event listener.
         * @deprecated Use map.events.remove instead.
         */
        removeEventListener(type: string, callback: any): void;
        /**
         * Remove an event listener from a layer of the map.
         * @param type The event type.
         * @param layer The layer of the map.
         * @param callback The callback of the event listener.
         * @deprecated Use map.events.remove instead.
         */
        removeEventListener(type: string, layer: string, callback: any): void;
        /**
         * Set the map control's user interaction handlers. Any options not specified will default to their current values.
         * @param options The options for enabling/disabling the user interaction handlers.
         */
        setUserInteraction(options?: UserInteractionOptions): void;
        /**
         * Return the map control's current user interaction handler settings.
         */
        getUserInteraction(): UserInteractionOptions;
        /**
         * Add a control to the map.
         * @param control The control to add.
         * @param options The options for the added control.
         * @deprecated Use map.controls.add instead.
         */
        addControl(control: Control, options?: ControlOptions): void;
        /**
         * Remove a control from the map.
         * @param control The control to remove.
         * @deprecated Use map.controls.remove instead.
         */
        removeControl(control: Control): void;
        /**
         * Set the traffic options for the map. Any options not specified will default to their current values.
         * @param options The options for defining the map's traffic display.
         */
        setTraffic(options?: TrafficOptions): void;
        /**
         * Return the map control's current traffic settings.
         */
        getTraffic(): TrafficOptions;
        /**
         * Clean up the map's resources. Map will not function correctly after calling this method.
         * @deprecated use map.dispose()
         */
        remove(): void;
        /**
         * Removes all user added sources, layers, markers, and popups from the map.
         * User added images are preserved.
         */
        clear(): void;
        /**
         * Clean up the map's resources. Map will not function correctly after calling this method.
         */
        dispose(): void;
        /**
         * Resize the map according to the dimensions of its container element.
         * @param eventData Optional additional properties to be added to event objects of events triggered by this method.
         */
        resize(eventData?: any): any;
        /**
         * Resizes the map's container element then the map itself.
         * @param height The height for the map and its container element. A number input is assumed to be in pixels.
         * @param width The width for the map and its container element. A number input is assumed to be in pixels.
         * @param eventData Optional additional properties to be added to event objects of events triggered by this method.
         */
        resize(height: number | string, width: number | string, eventData?: any): any;
        /**
         * Converts an array of Pixel objects to an array of geographic Positions objects on the map.
         * @param pixels The pixels to be converted.
         */
        pixelsToPositions(pixels: Pixel[]): atlas.data.Position[];
        /**
         * Converts an array of Positions objects to an array of Pixel objects relative to the map container.
         * @param positions The positions to be converted.
         */
        positionsToPixels(positions: atlas.data.Position[]): Pixel[];
        /**
         * Returns a boolean indicating if all tiles in the current viewport for all sources have loaded or not.
         */
        areTilesLoaded(): boolean;
        /**
         * Stops any animated transition that is currently underway.
         */
        stop(): void;
    }

    /**
     * Represent a pixel coordinate or offset. Extends an array of [x, y].
     */
    export class Pixel extends Array<number> {
        /**
         * Constructs a Pixel object and initializes it with the specified x and y coordinates.
         * @param x The horizontal pixel offset.
         * @param y The vertical pixel offset.
         */
        constructor(x: number, y: number);
        /**
         * Generates a Pixel object from an object that contains coordinate information.
         * The object is scanned for x and y properties using a case insensitive test.
         * @param data The object to extract coordinate information from.
         * @returns A Pixel object that represents the provided data information.
         */
        static fromData(data: object): Pixel;
        /**
         * Return the x coordinate of the specified pixel.
         * @param pixel The pixel to get the x coordinate of.
         */
        static getX(pixel: Pixel): number;
        /**
         * Return the y coordinate of the specified pixel.
         * @param pixel The pixel to get the y coordinate of.
         */
        static getY(pixel: Pixel): number;
    }


    /**
     * An information window anchored at a specified position on a map.
     */
    export class Popup {
        /**
         * Constructs a Popup object and initializes it with the specified options.
         * @param options The options for the popup.
         */
        constructor(options?: PopupOptions);
        /**
         * Sets the options for the popup.
         * @param options The options for the popup.
         * @deprecated Use setOptions(...) instead.
         */
        setPopupOptions(options?: PopupOptions): void;
        /**
         * Sets the options for the popup.
         * @param options The options for the popup.
         */
        setOptions(options?: PopupOptions): void;
        /**
         * Returns the options for the popup.
         * @deprecated Use getOptions() instead.
         */
        getPopupOptions(): PopupOptions;
        /**
         * Returns the options for the popup.
         */
        getOptions(): PopupOptions;
        /**
         * Attaches the popup to the HTML document in a hidden state.
         * @param map The map.
         */
        attach: (map: Map) => void;
        /**
         * Opens the popup on the passed in map.
         * @param map The map.
         */
        open: (map: Map) => void;
        /**
         * Closes the popup on the map. The popup remains attached to the HTML document.
         */
        close: () => void;
        /**
         * Closes the popup on the map and removes it from the HTML document.
         */
        remove: () => void;
        /**
         * Returns true if the popup is currently open, otherwise false.
         */
        isOpen: () => boolean;
    }

    /**
     * A helper class that wraps a Geometry or Feature and makes it easy to update and maintain.
     */
    export class Shape {
        /**
         * Constructs a Shape object and initializes it with the specified Feature.
         * @param data: a Feature which contains a Geometry object and properties.
         * If the feature does not have an id, a unique id value will be assigned to it.
         */
        constructor(data: data.Feature<data.Geometry, any>);
        /**
         * Constructs a Shape object and initializes it with the specified Geometry, ID, and properties.
         * @param data a Geometry object
         * @param id a unique id that the user assigns to the shape. If not provided, a unique id value will be assigned to it.
         * @param properties User defined properties for the shape.
         */
        constructor(data: data.Geometry, id?: string, properties?: any);
        /**
         * Adds or updates an existing property value in the shape.
         * @param key
         * @param value
         */
        addProperty(key: string, value: any): void;
        /**
         * Gets the bounding box of the shape
         */
        getBounds(): data.BoundingBox;
        /**
         * Gets the coordinates of the shape.
         */
        getCoordinates(): atlas.data.Position | atlas.data.Position[] | atlas.data.Position[][] | atlas.data.Position[][][];
        /**
         * Gets the id of the shape.
         */
        getId(): string;
        /**
         * Gets the properties of the shape.
         */
        getProperties(): any;
        /**
         * Returns a string indicating the type of geometry this shape contains.
         */
        getType(): string;
        /**
         * Indicates if the contained shape is a Circle, defined by the extended GeoJSON specification supported by Azure Maps.
         * [Extended Spec]{@link https://docs.microsoft.com/en-us/azure/azure-maps/extend-geojson}
         */
        isCircle(): boolean;
        /**
         * Updates the coordinates of the shape
         * @param coords Point: Position, LineString: Position[], Polygon: Position[][], MultiPoint: Position[], MultiLineString: Position[][], MultiPolygon: Position[][]
         */
        setCoordinates(coords: atlas.data.Position | atlas.data.Position[] | atlas.data.Position[][] | atlas.data.Position[][][]): void;
        /**
         * Sets the properties on the shape. Overwrites all existing properties.
         * @param properties
         */
        setProperties(properties: any): void;
        /**
         * Returns a GeoJSON feature that represents the shape.
         */
        toJson(): data.Feature<data.Geometry, any>;
    }

    /**
     * This class wraps an HTML element that can be displayed on the map.
     */
    export class HtmlMarker {

        /**
         * Constructs a new HtmlMarker.
         * @param options The options for the HtmlMarker.
         */
        constructor(options: HtmlMarkerOptions);

        /**
         * Gets the HTML marker options.
         */
        getOptions(): HtmlMarkerOptions;

        /**
         * Sets the options of the marker.
         * @param options The options for the marker.
         */
        setOptions(options: HtmlMarkerOptions): void;

        /**
         * Toggles the popup attached to the marker.
         */
        togglePopup(): void;

    }

    /**
     * Gets the default language that was provided.
     * If not previously set, the default value is `"NGT"`.
     */
    export function getLanguage(): string;
    /**
     * Gets the default session id that was provided.
     * If not previously set, the default value is a random UUID.
     */
    export function getSessionId(): string;
    /**
     * Gets the default Azure Maps subscription key that was provided.
     */
    export function getSubscriptionKey(): string;
    /**
     * Gets the default user region setting of the map control.
     * If not previously set, the default value is `"Unified"`.
     */
    export function getUserRegion(): string;
    /**
     * Current API version number based on build number.
     */
    export function getVersion(): string;
    /**
     * Checks to see if the user's browser is supported by the map control.
     * @param failIfMajorPerformanceCaveat If true the function will return false
     * if the performance of the map control would be dramatically worse than expected
     * (e.g. a software WebGL renderer would be used).
     */
    export function isSupported(failIfMajorPerformanceCaveat?: boolean): boolean;
    /**
     * Sets the default language used by the map and service modules unless the
     * language is explicitly specified when using those parts of the API.
     * If a Map is initialized with the language explicitly defined and
     * setLanguage hasn't previously been called it will automatically be called by the Map constructor.
     * @param language The new default language.
     */
    export function setLanguage(language: string): void;
    /**
     * Sets the default session id used by the map and service modules unless the
     * session id is explicitly specified when using those parts of the API.
     * If a Map is initialized with the session ID explicitly defined and
     * setSessionId hasn't previously been called it will automatically be called by the Map constructor.
     * @param id The new default session id.
     */
    export function setSessionId(id: string): void;
    /**
     * Sets your Azure Maps subscription key as the default subscription key in the atlas namespace
     * which is used by the map control and any modules that make requests to the Azure maps services.
     * If a Map is initialized with the subscription key explicitly defined and
     * setSubscriptionKey hasn't previously been called it will automatically be called by the Map constructor.
     * @param key The new default subscription key.
     */
    export function setSubscriptionKey(key: string): void;
    /**
     * Sets the default user region string which is an
     * [ISO 3166-1 alpha-2 country region code]{@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2}.
     * The user region value is used to ensure that disputed boarders and location names
     * align with the views of the specified user region.
     * If a Map is initialized with the user region explicitly defined and
     * setUserRegion hasn't previously been called it will automatically be called by the Map constructor.
     * @param userRegion The new default user region.
     */
    export function setUserRegion(userRegion: string): void;

    /**
     * Options used when rendering Point objects in a BubbleLayer.
     */
    export interface BubbleLayerOptions extends LayerOptions {
        /**
         * The id or instance of a data source which the layer will render.
         */
        source: string | atlas.source.Source;
        /**
         * Required when the source of the layer is a VectorTileSource.
         * A vector source can have multiple layers within it, this identifies which one to render in this layer.
         * Prohibited for all other types of sources.
         */
        sourceLayer?: string;
        /**
         * The color to fill the circle symbol with.
         * Default `"#1A73AA"`.
         * @default "#1A73AA"
         */
        color?: string | Expression | StyleFunction;
        /**
         * The amount to blur the circles.
         * A value of 1 blurs the circles such that only the center point if at full opacity.
         * Default `0`.
         * @default 0
         */
        blur?: number | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the circles will be drawn.
         * Default `1`.
         * @default 1
         */
        opacity?: number | Expression | StyleFunction;
        /**
         * The color of the circles' outlines.
         * Default `"#FFFFFF"`.
         * @default "#FFFFFF"
         */
        strokeColor?: string | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the circles' outlines will be drawn.
         * Default `1`.
         * @default 1
         */
        strokeOpacity?: number | Expression | StyleFunction;
        /**
         * The width of the circles' outlines in pixels.
         * Default `2`.
         * @default 2
         */
        strokeWidth?: number | Expression | StyleFunction;
        /**
         * The radius of the circle symbols in pixels.
         * Must be greater than or equal to 0.
         * Default `5`.
         * @default 5
         */
        radius?: number | Expression | StyleFunction;
    }

    /**
     * Options used to customize the icons in a SymbolLayer
     */
    export interface IconOptions extends Options {
        /**
         * Specifies if the symbol icon can overlay other symbols on the map.
         * If `true` the icon will be visible even if it collides with other previously drawn symbols.
         * Tip: Set this to true if animating an symbol to ensure smooth rendering.
         * Default `false`.
         * @default false
         */
        allowOverlap?: boolean;
        /**
         * Specifies which part of the icon is placed closest to the icons anchor position on the map.
         * <p>`"center"`: The center of the icon is placed closest to the anchor.</p>
         * <p>`"left"`: The left side of the icon is placed closest to the anchor.</p>
         * <p>`"right"`: The right side of the icon is placed closest to the anchor.</p>
         * <p>`"top"`: The top of the icon is placed closest to the anchor.</p>
         * <p>`"bottom"`: The bottom of the icon is placed closest to the anchor.</p>
         * <p>`"top-left"`: The top left corner of the icon is placed closest to the anchor.</p>
         * <p>`"top-right"`: The top right corner of the icon is placed closest to the anchor.</p>
         * <p>`"bottom-left"`: The bottom left corner of the icon is placed closest to the anchor.</p>
         * <p>`"bottom-right"`: The bottom right corner of the icon is placed closest to the anchor.</p>
         * Default `"bottom"`.
         * @default "bottom"
         */
        anchor?: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
        /**
         * Specifies if other symbols can overlap this symbol.
         * If true, other symbols can be visible even if they collide with the icon.
         * Default `false`.
         * @default false
         */
        ignorePlacement?: boolean;
        /**
         * The name of the image in the map's image sprite to use for drawing the icon.
         * Default `"pin-darkblue"`.
         * @default "pin-darkblue"
         */
        image?: string | Expression | StyleFunction;
        /**
         * Specifies an offset distance of the icon from its anchor in pixels.
         * Positive values indicate right and down, while negative values indicate left and up.
         * Each component is multiplied by the value of size to obtain the final offset in pixels.
         * When combined with rotation the offset will be as if the rotated direction was up.
         * Default `[0, 0]`.
         * @default [0, 0]
         */
        offset?: atlas.Pixel | Expression | StyleFunction;
        /**
         * Specifies if a symbols icon can be hidden but its text displayed if it is overlapped with another symbol.
         * If true, text will display without their corresponding icons
         * when the icon collides with other symbols and the text does not.
         * Default `false`.
         * @default false
         */
        optional?: boolean;
        /**
         * The amount to rotate the icon clockwise in degrees
         * Default `0`.
         * @default 0
         */
        rotation?: number | Expression | StyleFunction;
        /**
         * In combination with the placement property of a SymbolLayerOptions
         * this determines the rotation behavior of icons.
         * <p>`"auto"`: When placement is "point" this is equivalent to "viewport".
         * When placement is "line" this is equivalent to "map".</p>
         * <p>`"map"`: When placement is "point" aligns icons east-west.
         * When placement is "line" aligns the icons' x-axes with the line.</p>
         * <p>`"viewport"`: Icons' x-axes will align with the x-axis of the viewport.</p>
         * Default `"auto"`.
         * @default "auto"
         */
        rotationAlignment?: "auto" | "map" | "viewport";
        /**
         * Scales the original size of the icon by the provided factor.
         * Must be greater or equal to 0.
         * Default `1`.
         * @default 1
         */
        size?: number | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the icon will be drawn.
         * Default `1`.
         * @default 1
         */
        opacity?: number | Expression | StyleFunction;
    }

    /**
     * A base class which all other layer options inherit from.
     */
    export interface LayerOptions extends Options {
        /**
         * An expression specifying conditions on source features.
         * Only features that match the filter are displayed.
         */
        filter?: Expression;
        /**
         * An integer specifying the minimum zoom level to render the layer at.
         * Default `0`.
         * @default 0
         */
        minZoom?: number;
        /**
         * An integer specifying the maximum zoom level to render the layer at.
         * Default `24`.
         * @default 24
         */
        maxZoom?: number;
        /**
         * Specifies if the layer is visible or not.
         * Default `true`.
         * @default true
         */
        visible?: boolean;
    }

    /**
     * Options used when rendering SimpleLine, SimplePolygon, CirclePolygon,
     * LineString, MultiLineString, Polygon, and MultiPolygon objects in a line layer.
     */
    export interface LineLayerOptions extends LayerOptions {
        /**
         * The id or instance of a data source which the layer will render.
         */
        source: string | atlas.source.Source;
        /**
         * Required when the source of the layer is a VectorTileSource.
         * A vector source can have multiple layers within it, this identifies which one to render in this layer.
         * Prohibited for all other types of sources.
         */
        sourceLayer?: string;
        /**
         * Specifies how the ends of the lines are rendered.
         * <p>`"butt"`: A cap with a squared-off end which is drawn to the exact endpoint of the line.</p>
         * <p>`"round"`: A cap with a rounded end which is drawn beyond the endpoint of the line
         * at a radius of one-half of the lines width and centered on the endpoint of the line.</p>
         * <p>`"square"`: A cap with a squared-off end which is drawn beyond the endpoint of the line
         * at a distance of one-half of the line width.</p>
         * Default `"butt"`.
         * @default "butt"
         */
        lineCap?: "butt" | "round" | "square";
        /**
         * Specifies how the joints in the lines are rendered.
         * <p>`"bevel"`: A join with a squared-off end which is drawn beyond the endpoint of the line
         * at a distance of one-half of the lines width.</p>
         * <p>`"round"`: A join with a rounded end which is drawn beyond the endpoint of the line
         * at a radius of one-half of the lines width and centered on the endpoint of the line.</p>
         * <p>`"miter"`: A join with a sharp, angled corner which is drawn with the outer sides
         * beyond the endpoint of the path until they meet.</p>
         * Default `"miter"`.
         * @default "miter"
         */
        lineJoin?: "bevel" | "round" | "miter";
        /**
         * The amount of blur to apply to the line in pixels.
         * Default `0`.
         * @default 0
         */
        blur?: number | Expression | StyleFunction;
        /**
         * Specifies the color of the line.
         * Default `"#000000"`.
         * @default "#000000"
         */
        strokeColor?: string | Expression | StyleFunction;
        /**
         * Specifies the lengths of the alternating dashes and gaps that form the dash pattern.
         * Numbers must be equal or greater than 0. The lengths are scaled by the strokeWidth.
         * To convert a dash length to pixels, multiply the length by the current stroke width.
         */
        strokeDashArray?: number[];
        /**
         * Defines a gradient with which to color the lines.
         * Can only be used with GeoJSON sources that specify true for lineMetrics.
         * Disabled if strokeDashArray is set.
         */
        strokeGradient?: string | Expression | StyleFunction;
        /**
         * The line's offset.
         * A positive value offsets the line to the right, relative to the direction of the line.
         * A negative value offsets to the left.
         * Default `0`.
         * @default 0
         */
        offset?: number | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the line will be drawn.
         * Default `1`.
         * @default 1
         */
        strokeOpacity?: number | Expression | StyleFunction;
        /**
         * The width of the line in pixels. Must be a value greater or equal to 0.
         * Default `1`.
         * @default 1
         */
        strokeWidth?: number | Expression | StyleFunction;
    }

    /**
     * Options used when rendering canvas, image, raster tile, and video layers
     */
    export interface MediaLayerOptions extends LayerOptions {
        /**
         * A number between -1 and 1 that increases or decreases the contrast of the overlay.
         * Default `0`.
         * @default 0
         */
        contrast?: number;
        /**
         * The duration in milliseconds of a fade transition when a new tile is added.
         * Must be greater or equal to 0.
         * Default `300`.
         * @default 300
         */
        fadeDuration?: number;
        /**
         * Rotates hues around the color wheel.
         * A number in degrees.
         * Default `0`.
         * @default 0
         */
        hueRotation?: number;
        /**
         * A number between 0 and 1 that increases or decreases the maximum brightness of the overlay.
         * Default `1`.
         * @default 1
         */
        maxBrightness?: number;
        /**
         * A number between 0 and 1 that increases or decreases the minimum brightness of the overlay.
         * Default `0`.
         * @default 0
         */
        minBrightness?: number;
        /**
         * A number between 0 and 1 that indicates the opacity at which the overlay will be drawn.
         * Default `1`.
         * @default 1
         */
        opacity?: number;
        /**
         * A number between -1 and 1 that increases or decreases the saturation of the overlay.
         * Default `0`.
         * @default 0
         */
        saturation?: number;
    }

    /**
     * Options used when rendering Polygon and MultiPolygon objects in a PolygonLayer.
     */
    export interface PolygonLayerOptions extends LayerOptions {
        /**
         * The id or instance of a data source which the layer will render.
         */
        source: string | atlas.source.Source;
        /**
         * Required when the source of the layer is a VectorTileSource.
         * A vector source can have multiple layers within it, this identifies which one to render in this layer.
         * Prohibited for all other types of sources.
         */
        sourceLayer?: string;
        /**
         * The color to fill the polygons with.
         * Default `"#1A73AA"`.
         * @default "#1A73AA"
         */
        fillColor?: string | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the fill will be drawn.
         * Default `0.5`.
         * @default 0.5
         */
        fillOpacity?: number | Expression | StyleFunction;
    }

    /**
     * Options used when rendering geometries in a SymbolLayer.
     */
    export interface SymbolLayerOptions extends LayerOptions {
        /**
         * The id or instance of a data source which the layer will render.
         */
        source: string | atlas.source.Source;
        /**
         * Required when the source of the layer is a VectorTileSource.
         * A vector source can have multiple layers within it, this identifies which one to render in this layer.
         * Prohibited for all other types of sources.
         */
        sourceLayer?: string;
        /**
         * Options used to customize the icons of the symbols.
         * @see IconOptions for defaults.
         */
        iconOptions?: IconOptions;
        /**
         * Options used to customize the text of the symbols.
         * @see TextOptions for defaults.
         */
        textOptions?: TextOptions;
        /**
         * Specifies the label placement relative to its geometry.
         * <p>`"point"`: The label is placed at the point where the geometry is located.</p>
         * <p>`"line"`: The label is placed along the line of the geometry.
         * Can only be used on LineString and Polygon geometries.</p>
         * Default `"point"`.
         * @default "point"
         */
        placement?: "point" | "line";
        /**
         * Distance in pixels between two symbol anchors along a line. Must be greater or equal to 1.
         * Default `250`.
         * @default 250
         */
        lineSpacing?: number | Expression;
    }

    /**
     * Options used to customize the text in a SymbolLayer
     */
    export interface TextOptions extends Options {
        /**
         * Specifies if the text will be visible if it collides with other symbols.
         * If true, the text will be visible even if it collides with other previously drawn symbols.
         * Default `false`.
         * @default false
         */
        allowOverlap?: boolean;
        /**
         * Specifies which part of the icon is placed closest to the icons anchor position on the map.
         * <p>`"center"`: The center of the icon is placed closest to the anchor.</p>
         * <p>`"left"`: The left side of the icon is placed closest to the anchor.</p>
         * <p>`"right"`: The right side of the icon is placed closest to the anchor.</p>
         * <p>`"top"`: The top of the icon is placed closest to the anchor.</p>
         * <p>`"bottom"`: The bottom of the icon is placed closest to the anchor.</p>
         * <p>`"top-left"`: The top left corner of the icon is placed closest to the anchor.</p>
         * <p>`"top-right"`: The top right corner of the icon is placed closest to the anchor.</p>
         * <p>`"bottom-left"`: The bottom left corner of the icon is placed closest to the anchor.</p>
         * <p>`"bottom-right"`: The bottom right corner of the icon is placed closest to the anchor.</p>
         * Default `"center"`.
         * @default "center"
         */
        anchor?: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
        /**
         * Specifies the name of a property on the features to use for a text label.
         */
        textField?: string | Expression | StyleFunction;
        /**
         * The font stack to use for displaying text.
         * Possible values: `"SegoeFrutigerHelveticaMYingHei-Bold"`, `"SegoeFrutigerHelveticaMYingHei-Medium"`,
         * `"SegoeFrutigerHelveticaMYingHei-Regular"`, `"SegoeUi-Bold"`, `"SegoeUi-Light"`, `"SegoeUi-Regular"`,
         * `"SegoeUi-SemiBold"`, `"SegoeUi-SemiLight"`, `"SegoeUi-SymbolRegular"`, `"StandardCondensedSegoeUi-Black"`,
         * `"StandardCondensedSegoeUi-Bold"`, `"StandardCondensedSegoeUi-Light"`, `"StandardCondensedSegoeUi-Regular"`,
         * `"StandardFont-Black"`, `"StandardFont-Bold"`, `"StandardFont-Light"`, `"StandardFont-Regular"`,
         * `"StandardFontCondensed-Black"`, `"StandardFontCondensed-Bold"`, `"StandardFontCondensed-Light"`,
         * `"StandardFontCondensed-Regular"`.
         * Default `["StandardFont-Regular"]`.
         * @default ["StandardFont-Regular"]
         */
        font?: string[] | Expression;
        /**
         * Specifies if the other symbols are allowed to collide with the text.
         * If true, other symbols can be visible even if they collide with the text.
         * Default `false`.
         * @default false
         */
        ignorePlacement?: boolean;
        /**
         * Specifies an offset distance of the icon from its anchor in ems.
         * Positive values indicate right and down, while negative values indicate left and up.
         * Default `[0, 0]`.
         * @default [0, 0]
         */
        offset?: atlas.Pixel | Expression;
        /**
         * Specifies if the text can be hidden if it is overlapped by another symbol.
         * If true, icons will display without their corresponding text
         * when the text collides wit other symbols and the icon does not.
         * Default `false`.
         * @default false
         */
        optional?: boolean;
        /**
         * The size of the font in pixels.
         * Must be a number greater or equal to 0.
         * Default `16`.
         * @default 16
         */
        size?: number | Expression | StyleFunction;
        /**
         * The color of the text.
         * Default `"#000000"`.
         * @default "#000000"
         */
        color?: string | Expression | StyleFunction;
        /**
         * The halo's fadeout distance towards the outside in pixels.
         * Must be a number greater or equal to 0.
         * Default `0`.
         * @default 0
         */
        haloBlur?: number | Expression | StyleFunction;
        /**
         * The color of the text's halo, which helps it stand out from backgrounds.
         * Default `"rgba(0,0,0,0)"`.
         * @default "rgba(0,0,0,0)"
         */
        haloColor?: string | Expression | StyleFunction;
        /**
         * The distance of the halo to the font outline in pixels.
         * Must be a number greater or equal to 0.
         * The maximum text halo width is 1/4 of the font size.
         * Default `0`.
         * @default 0
         */
        haloWidth?: number | Expression | StyleFunction;
        /**
         * A number between 0 and 1 that indicates the opacity at which the text will be drawn.
         * Default `1`.
         * @default 1
         */
        opacity?: number | Expression | StyleFunction;
    }

    /**
     * Options used when rendering raster tiled images in a TileLayer.
     */
    export interface TileLayerOptions extends MediaLayerOptions {
        /**
         * A bounding box that specifies where tiles are available.
         * When specified, no tiles outside of the bounding box will be requested.
         * Default `[-180, -85.0511, 180, 85.0511]`.
         * @default [-180, -85.0511, 180, 85.0511]
         */
        bounds?: atlas.data.BoundingBox;
        /**
         * An integer specifying the minimum zoom level to render the layer at.
         * Default `0`.
         * @default 0
         */
        minSourceZoom?: number;
        /**
         * An integer specifying the maximum zoom level to render the layer at.
         * Default `22`.
         * @default 22
         */
        maxSourceZoom?: number;
        /**
         * An integer value that specifies the width and height dimensions of the map tiles.
         * For a seamless experience, the tile size must be a multiplier of 2.
         * Default `512`.
         * @default 512
         */
        tileSize?: number;
        /**
         * Specifies if the tile systems coordinates uses the Tile Map Services specification,
         * which reverses the Y coordinate axis.
         * Default `false`.
         * @default false
         */
        isTMS?: boolean;
        /**
         * An array of subdomain values to apply to the tile URL.
         */
        subdomains?: string[];
        /**
         * A http/https URL to a TileJSON resource or a tile URL template that uses the following parameters:
         * <p>{x}: X position of the tile. Usually also needs {y} and {z}.</p>
         * <p>{y}: Y position of the tile. Usually also needs {x} and {z}.</p>
         * <p>{z}: Zoom level of the tile. Usually also needs {x} and {y}.</p>
         * <p>{quadkey}: Tile quadKey id based on the Bing Maps tile system naming convention.</p>
         * <p>{bbox-epsg-3857}: A bounding box string with the format {west},{south},{east},{north}
         * in the EPSG 3857 Spacial Reference System.</p>
         * <p>{subdomain}: A placeholder where the subdomain values if specified will be added.</p>
         */
        tileUrl?: string;
    }

    /**
     * An interface for defining a control of the map.
     */
    interface Control {

        /**
         * Initialization method for the control which is called when added to the map.
         * @param map The map that the control will be added to.
         * @param options The ControlOptions for this control.
         * @return An HTMLElement to be placed on the map for the control.
         */
        onAdd(map: atlas.Map, options?: ControlOptions): HTMLElement;

        /**
         * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
         * control.
         */
        onRemove(): void;

    }

    /**
     * Available styles for a Control.
     */
    enum ControlStyle {
        light = "light",
        dark = "dark"
    }

    /**
     * The options for a CompassControl object.
     */
    export interface CompassControlOptions extends Options {
        /**
         * The angle that the map will rotate with each click of the control.
         * Default `15`.
         * @default 15
         */
        rotationDegreesDelta: number;
        /**
         * The style of the control.
         * Default `ControlStyle.light`
         * @default ControlStyle.light
         */
        style: ControlStyle;
    }

    /**
     * The options for a PitchControl object.
     */
    export interface PitchControlOptions extends Options {
        /**
         * The angle that the map will tilt with each click of the control.
         * Default `10`.
         * @default 10
         */
        pitchDegreesDelta: number;
        /**
         * The style of the control.
         * Default `ControlStyle.light`.
         * @default ControlStyle.light
         */
        style: ControlStyle;
    }

    /**
     * The options for a StyleControl object.
     */
    export interface StyleControlOptions extends Options {
        /**
         * The style of the control.
         * Default `ControlStyle.light`.
         * @default ControlStyle.light
         */
        style: ControlStyle;
    }

    /**
     * The options for a ZoomControl object.
     */
    export interface ZoomControlOptions extends Options {
        /**
         * The extent to which the map will zoom with each click of the control.
         * Default `1`.
         * @default 1
         */
        zoomDelta: number;
        /**
         * The style of the control.
         * Default `ControlStyle.light`.
         * @default ControlStyle.light
         */
        style: ControlStyle;
    }

    /**
     * The options for animating changes to the map control's camera.
     */
    export interface AnimationOptions extends Options {
        /**
         * The duration of the animation in milliseconds.
         * Default `1000`.
         * @default 1000
         */
        duration?: number;
        /**
         * The type of animation.
         * <p>"jump" is an immediate change.</p>
         * <p>"ease" is a gradual change of the camera's settings.</p>
         * <p>"fly" is a gradual change of the camera's settings following an arc resembling flight.</p>
         * Default `"jump"`.
         * @default "jump"
         */
        type?: "jump" | "ease" | "fly";
    }

    /**
     * The options for setting the bounds of the map control's camera.
     */
    export interface CameraBoundsOptions extends Options {
        /**
         * The bounds of the map control's camera.
         * `default [-180, -89, 180, 90]`
         * @default [-180, -89, 180, 90]
         */
        bounds?: atlas.data.BoundingBox;
        /**
         * The maximum zoom level to allow when the map view transitions to the specified bounds.
         * `default 20`
         * @default 20
         */
        maxZoom?: number;
        /**
         * An offset of the center of the given bounds relative to the map's center, measured in pixels.
         * `default [0, 0]`
         * @default [0, 0]
         */
        offset?: atlas.Pixel;
        /**
         * The amount of padding in pixels to add to the given bounds.
         * `default {top: 0, bottom: 0, left: 0, right: 0}`
         * @default {top: 0, bottom: 0, left: 0, right: 0}
         */
        padding?: Padding;
    }

    /**
     * The options for setting the map control's camera.
     */
    export interface CameraOptions extends Options {
        /**
         * The zoom level of the map view.
         * `default 1`
         * @default 1
         */
        zoom?: number;
        /**
         * The position to align the center of the map view with.
         * `default [0, 0]`
         * @default [0, 0]
         */
        center?: atlas.data.Position;
        /**
         * The bearing of the map (rotation) in degrees. 
         * When the bearing is 0, 90, 180, or 270 the top of the map container will be north, east, south or west respectively.
         * `default 0`
         * @default 0
         */
        bearing?: number;
        /**
         * The pitch (tilt) of the map in degrees between 0 and 60, where 0 is looking straight down on the map.
         * `default 0`
         * @default 0
         */
        pitch?: number;
        /**
         * The minimum zoom level that the map can be zoomed out to during the animation. Must be between 0 and 24, and less than or equal to `maxZoom`.
         * `default 1`
         * @default 1
         */
        minZoom?: number;
        /**
         * The maximum zoom level that the map can be zoomed into during the animation. Must be between 0 and 24, and greater than or equal to `minZoom`.
         * `default 20`
         * @default 20
         */
        maxZoom?: number;
    }

    /**
     * Positions where the control can be placed on the map.
     */
    export enum ControlPosition {
        TopLeft = "top-left",
        TopRight = "top-right",
        BottomLeft = "bottom-left",
        BottomRight = "bottom-right",
        NonFixed = "non-fixed"
    }

    /**
     * The options for adding a control to the map.
     */
    export interface ControlOptions extends Options {
        /**
         * The position the control will be placed on the map. If not specified, the control will be located at the
         * default position it defines.
         * default `ControlPosition.NonFixed`
         * @default ControlPosition.NonFixed
         */
        position?: ControlPosition;
    }

    /**
     * A MapEventData object is passed to the callback function when a map event is fired.
     */
    interface MapEventData {

        /**
         * The event type.
         */
        type: string;

        /**
         * The original event that was fired.
         */
        originalEvent: Event;

        /**
         * The geographic position on the map where the event occurred.
         */
        position?: atlas.data.Position;

        /**
         * The pixel coordinate where the event occurred as an array of [x, y].
         */
        coordinate?: number[];

        /**
         * The features associated with the event.
         */
        features?: Array<atlas.data.Feature<atlas.data.Geometry, any>>;
    }

    /**
     * A data source for managing shape data that will be displayed on the map.
     * A data source must be added to a layer before it is visible on the map.
     * Options for a `DataSourceOptions`.
     * @module Object Definitions
     */
    export interface DataSourceOptions extends Options {
        /**
         * Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels).
         * default `18`
         * @default 18
         */
        maxZoom?: number;
        /**
         * A boolean indicating if Point features in the source should be clustered or not.
         * If set to true, points will be clustered together into groups by radius.
         * default `false`
         * @default false
         */
        cluster?: boolean;
        /**
         * The radius of each cluster in pixels.
         * default `50`
         * @default 50
         */
        clusterRadius?: number;
        /**
         * The maximum zoom level in which to cluster points.
         * Defaults to one zoom less than `maxZoom` so that last zoom features are not clustered.
         */
        clusterMaxZoom?: number;
        /**
         * Specifies whether to calculate line distance metrics.
         * This is required for line layers that specify `lineGradient` values.
         * default `false`
         * @default false
         */
        lineMetrics?: boolean;
        /**
         * The Douglas-Peucker simplification tolerance that is applied to the data when rendering (higher means simpler geometries and faster performance).
         * default `0.375`
         * @default 0.375
         */
        tolerance?: number;
    }

    /**
     * A data source for managing shape data that will be displayed on the map.
     * A data source must be added to a layer before it is visible on the map.
     * Options for a `VectorTileSource`.
     * @module Object Definitions
     */
    export interface VectorTileSourceOptions extends Options {
        /**
         * A bounding box that specifies where tiles are available.
         * When specified, no tiles outside of the bounding box will be requested.
         */
        bounds?: atlas.data.BoundingBox;
        /**
         * An integer specifying the minimum zoom level to render the layer at.
         * default `0`
         * @default 0
         */
        minZoom?: number;
        /**
         * An integer specifying the maximum zoom level to render the layer at.
         * default `22`
         * @default 22
         */
        maxZoom?: number;
        /**
         * Specifies is the tile systems y coordinate uses the OSGeo Tile Map Services which reverses the Y coordinate axis.
         * default `false`
         * @default false
         */
        isTMS?: boolean;
        /**
         * An array of one or more tile source URLs. Supported URL parameters:
         *  <ul>
         *      <li>`{x}` - X position of tile. Tile URL usually also needs {y} and {z}.</li>
         *      <li>`{y}` - Y position of tile. Tile URL usually also needs {x} and {z}.</li>
         *      <li>`{z}` - Zoom level of tile. Tile URL usually also needs {x} and {y}.</li>
         *      <li>`{quadkey}` - Tile quadkey id based on the Bing Maps tile system naming convention.</li>
         *      <li>`{bbox-epsg-3857}` - A bounding box string with the format "{west},{south},{east},{north}" with coordinates in the EPSG 3857 Spatial Reference System also commonly known as WGS84 Web Mercator. This is useful when working with WMS imagery services.</li>
         *  <ul>
         */
        tiles?: string[];
        /**
         * An integer value that specifies the width and height dimensions of the map tiles.
         * For a seamless experience, the tile size must by a multiplier of 2. (i.e. 256, 512, 1024…).
         * default `512`
         * @default 512
         */
        tileSize?: number;
        /**
         * A URL to a TileJSON resource.
         * Supported protocols are `http:` and `https:`.
         */
        url?: string;
    }

    /**
     * The options for a popup.
     */
    export interface PopupOptions extends Options {
        /**
         * The position on the map where the popup should be anchored.
         * default `[0, 0]`
         * @default [0, 0]
         */
        position?: atlas.data.Position;
        /**
         * The content to display within the popup.
         * default `span`
         * @default span
         */
        content?: HTMLElement | string;
        /**
         * An array of [pixelsRight, pixelsDown] for how many pixels to the right and down the anchor of the popup should be
         * offset. Negative numbers can be used to offset the popup left and up.
         * default `[0, 0]`
         * @default [0, 0]
         */
        pixelOffset?: atlas.Pixel;
        /**
         * Specifies if the close button should be displayed in the popup or not.
         * default `true`
         * @default true
         */
        closeButton?: boolean;
    }

    /**
     * This is the object type expected to be returned by the transformRequest callback.
     */
    export interface RequestParameters {
        /**
         * Used to specify the cross-origin request (CORs) credentials setting. Can be `'same-origin'` or `'include'`.
         */
        credentials?: string;
        /**
         * The headers to be sent with the request.
         */
        headers?: object;
        /**
         * The url to be requested.
         */
        url?: string;
    }

    /**
     * Options for rendering an HtmlMarker object
     */
    export interface HtmlMarkerOptions extends Options {
        /**
         * Indicates if the user can drag the position of the marker using the mouse or touch controls.
         * default `false`
         * @default false
         */
        draggable?: boolean;
        /**
         * The HTML content of the marker. Can be an HTMLElement or HTML string.
         * Default is a blue pin SVG.
         */
        htmlContent?: string | HTMLElement;
        /**
         * An offset in pixels to move the popup relative to the markers center.
         * Negatives indicate left and up.
         * default `[0, 0]`
         * @default [0, 0]
         */
        pixelOffset?: atlas.Pixel;
        /**
         * The position of the marker.
         * default `[0, 0]`
         * @default [0, 0]
         */
        position?: atlas.data.Position;
        /**
         * A popup that is attached to the marker.
         */
        popup?: atlas.Popup;
    }

    /**
     * The options for the map's style.
     */
    export interface StyleOptions extends Options {
        /**
         * If true the map will automatically resize whenever the window's size changes.
         * Otherwise map.resize() must be called.
         * Default `true`.
         * @default true
         */
        autoResize?: boolean;
        /**
         * The name of the style to use when rendering the map. Available styles can be found in the
         * [supported styles]{@link https://docs.microsoft.com/en-us/azure/azure-maps/supported-map-styles} article. The
         * default style is "road".
         */
        style?: string;
        /**
         * The language of the map labels.
         * [Supported language]{@link https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages}.
         * Default `atlas.getLanguage()`.
         * @default atlas.getLanguage()
         */
        language?: string;
        /**
         * The geopolitical view of the map.
         * <p>Unified: The unified view of the world.</p>
         * Default `atlas.getUserRegion()`.
         * @default atlas.getUserRegion()
         */
        userRegion?: string;
        /**
         * The geopolitical view of the map.
         * <p>Unified: The unified view of the world.</p>
         * @deprecated Recommend using userRegion instead.
         */
        view?: string;
    }

    /**
     * The options for setting traffic on the map.
     */
    export interface TrafficOptions extends Options {
        /**
         * The type of traffic flow to display:
         * <p>"none" is to display no traffic flow data</p>
         * <p>"relative" is the speed of the road relative to free-flow</p>
         * <p>"absolute" is the absolute speed of the road</p>
         * <p>"relative-delay" displays relative speed only where they differ from free-flow;
         * false to stop displaying the traffic flow.</p>
         * default `"none"``
         * @default "none"
         */
        flow?: "none" | "relative" | "absolute" | "relative-delay";
        /**
         * Whether to display incidents on the map.
         * default `false`
         * @default false
         */
        incidents?: boolean;
    }

    /**
     * The options for enabling/disabling user interaction with the map.
     */
    export interface UserInteractionOptions extends Options {
        /**
         * Whether the map is interactive or static. If false, all user interaction is disabled.  If true, only selected
         * user interactions will enabled.
         * default `true`
         * @default true
         */
        interactive?: boolean;
        /**
         * Whether the map should zoom on scroll input.
         * default `true`
         * @default true
         */
        scrollZoomInteraction?: boolean;
        /**
         * Whether the Shift + left click and drag will draw a zoom box.
         * default `true`
         * @default true
         */
        boxZoomInteraction?: boolean;
        /**
         * Whether right click and drag will rotate and pitch the map.
         * default `true`
         * @default true
         */
        dragRotateInteraction?: boolean;
        /**
         * Whether left click and drag will pan the map.
         * default `true`
         * @default true
         */
        dragPanInteraction?: boolean;
        /**
         * Whether the keyboard interactions are enabled.
         * <style> .k-key { border: 1px solid grey; border-radius: 6px; background-color: #ccc; line-height: 14px;
         * font-size: 14px; padding: 2px; } </style>
         * <p><span class="k-key">+/=</span>: Increase zoom level by 1.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">+/=</span>: Increase the zoom level by 2.</p>
         * <p><span class="k-key">-</span>: Decrease zoom level by 1.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">-</span>: Decrease zoom level by 2.</p>
         * <p><span class="k-key">⇢</span>: Pan right 100 pixels.</p>
         * <p><span class="k-key">⇠</span>: Pan left 100 pixels.</p>
         * <p><span class="k-key">⇡</span>: Pan up 100 pixels.</p>
         * <p><span class="k-key">⇣</span>: Pan down 100 pixels.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">⇢</span>: Rotate 15 degrees clockwise.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">⇠</span>: Rotate 15 degrees counter-clockwise.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">⇡</span>: Increase pitch by 10 degrees.</p>
         * <p><span class="k-key">Shift</span> + <span class="k-key">⇣</span>: Decrease pitch by 10 degrees.</p>
         * default `true`
         * @default true
         */
        keyboardInteraction?: boolean;
        /**
         * Whether double left click will zoom the map inwards.
         * default `true`
         * @default true
         */
        dblClickZoomInteraction?: boolean;
        /**
         * Whether touch interactions are enabled for touch devices.
         * default `true`
         * @default true
         */
        touchInteraction?: boolean;
    }

    /**
    * An interface for defining a control of the map.
    */
    export interface Control {

        /**
         * Initialization method for the control which is called when added to the map.
         * @param map The map that the control will be added to.
         * @param options The ControlOptions for this control.
         * @return An HTMLElement to be placed on the map for the control.
         */
        onAdd(map: atlas.Map, options?: ControlOptions): HTMLElement;

        /**
         * Method that is called when the control is removed from the map. Should perform any necessary cleanup for the
         * control.
         */
        onRemove(): void;
    }

    /**
     * Global properties used in all atlas service requests.
     */
    export interface ServiceOptions extends Options {
        /**
         * The customer subscription key used to authorize requests.
         * @deprecated Recommend using the atlas.setSubscriptionKey function instead
         */
        subscriptionKey?: string;
        /**
         * The customer subscription key used to authorize requests.
         * @deprecated Recommend using the atlas.setSubscriptionKey function instead
         */
        "subscription-key"?: string;
        /**
         * The session id to pass with requests.
         * @deprecated Recommend using atlas.setSessionId instead.
         * @default Random UUID generated at runtime
         */
        sessionId?: string;
        /**
         * The session id to pass with requests.
         * @deprecated Recommend using atlas.setSessionId instead.
         */
        "session-id"?: string;
        /**
         * Disable telemetry collection
         * @default false
         */
        disableTelemetry?: boolean;
        /**
         * Disable telemetry collection
         * @deprecated Recommend using disableTelemetry instead.
         */
        "disable-telemetry"?: boolean;
        /**
         * Enable accessibility
         * @default false
         */
        enableAccessibility?: boolean;
        /**
         * Enable accessibility
         * @deprecated Recommend using enableAccessibility instead.
         */
        "enable-accessibility"?: boolean;
        /**
         * If defined transformRequest will be called to provide custom request parameters for loading a tile.
         */
        transformRequest?: (url: string, resourceType: string) => RequestParameters;
    }

    /**
     * Can be specified as the value of filter or certain layer options.
     * An expression defines a formula for computing the value of the property.
     * Expressions are represented as JSON arrays.
     * The first element of an expression is a string naming the expression operator.
     */
    export interface Expression extends Array<any> {
    }

    /**
     * A style function allows you to make the appearance of a map feature
     * change with the current zoom level and/or the feature's properties.
     */
    export interface StyleFunction {
        /**
         * The exponential base of the interpolation curve.
         * It controls the rate at which the function output increases.
         * Higher values make the output increase more towards the high end of the range.
         * With values close to 1 the output increases linearly.
         * default: `1`
         * @default 1
         */
        base?: number;
        /**
         * The color space in which colors are interpolated.
         * Interpolating colors in perceptual color spaces like LAB and HCL tend to produce color ramps
         * that look more consistent and produce colors that can be differentiated more easily
         * than those interpolated in RGB space.
         * <p>"rgb": Use the RGB color space.</p>
         * <p>"lab": Use the LAB color space.</p>
         * <p>"hcl": Use the HCL color space. Interpolating the Hue, Chroma, and Luminance channels individually.</p>
         */
        colorSpace?: "rgb" | "lab" | "hcl";
        /**
         * A value to serve as a fallback function result when a value isn't otherwise available.
         * If no default is provided, the style property's default is used.
         * It is used in the following circumstances:
         * <p>In categorical functions, when the feature value does not match any of the stop domain values.</p>
         * <p>In property and zoom-and-property functions, when a feature does not contain a value for the specified property.</p>
         * <p>In identity functions, when the feature value is not valid for the style property.</p>
         * <p>In interval or exponential property and zoom-and-property functions, when the feature value is not numeric.</p>
         */
        default?: any;
        /**
         * The name of the feature's property to use as input for the style function.
         */
        property?: string;
        /**
         * Functions are defined in terms of input and output values. A set of one input value is known as a "stop."
         * Stop output values must be literal values (i.e. not functions or expressions), and appropriate for the property.
         */
        stops?: any[][];
        /**
         * Specifies the type of the style function.
         * <p>"identity": A function that returns its input as the output.</p>
         * <p>"exponential": A function that generates an output by interpolating between stops.
         * The domain (input values) must be numeric and the style property must support interpolation.</p>
         * <p>"interval": A function that returns the output value of the stop just less than the function input.
         * The domain (input value) must be numeric. Any style property may use interval functions.</p>
         * <p>"categorical": A function that returns the output value of the stop equal to the function input.</p>
         */
        type?: "identity" | "exponential" | "interval" | "categorical";
    }

    /**
     * A manager for the map control's controls.
     * Exposed through the controls property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class ControlManager {
        /**
         * Add a control to the map.
         * @param control The control to add.
         * @param options The options for the added control.
         */
        add(control: Control, options?: ControlOptions): void;
        /**
         * Remove a control from the map.
         * @param control The control to remove.
         */
        remove(control: Control): void;
    }

    /**
     * A manager for the map control's events.
     * Exposed through the events property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class EventManager {
        /**
         * Adds a touch event to the map.
         * @param type The touch event name.
         * @param callback The event handler callback.
         */
        add(type: "touchstart" | "touchend" | "touchmove" | "touchcancel", callback: (e: MapTouchEvent) => void): any;
        /**
         * Adds a mouse event to the map.
         * @param type The mouse event name.
         * @param callback The event handler callback.
         */
        add(type: "mousedown" | "mouseup" | "mouseover" | "mousemove" | "click" | "dblclick" | "mouseout" | "contextmenu", callback: (e: MapMouseEvent) => void): any;
        /**
         * Adds a wheel event to the map.
         * @param type The wheel event name.
         * @param callback The event handler callback.
         */
        add(type: "wheel", callback: (e: MapMouseWheelEvent) => void): any;
        /**
         * Adds an event to the map.
         * @param type The event name.
         * @param callback The event handler callback.
         */
        add(type: "error" | "load" | "movestart" | "move" | "moveend" | "resize", callback: () => void): any;
        /**
         * Adds a touch event to the map.
         * @param type The touch event name.
         * @param target The layer(s) to add the event for.
         * @param callback The event handler callback.
         */
        add(type: "touchstart" | "touchend" | "touchmove" | "touchcancel", target: atlas.layer.Layer | atlas.layer.Layer[], callback: (e: MapTouchEvent) => void): any;
        /**
         * Adds a mouse event to the map.
         * @param type The mouse event name.
         * @param target The layer(s) to add the event for.
         * @param callback The event handler callback.
         */
        add(type: "mousedown" | "mouseup" | "mouseover" | "mousemove" | "click" | "dblclick" | "mouseout" | "mouseenter" | "mouseleave" | "contextmenu", target: atlas.layer.Layer | atlas.layer.Layer[], callback: (e: MapMouseEvent) => void): any;
        /**
         * Adds a wheel event to the map.
         * @param type The wheel event name.
         * @param target The layer(s) to add the event for.
         * @param callback The event handler callback.
         */
        add(type: "wheel", target: atlas.layer.Layer | atlas.layer.Layer[], callback: (e: MapMouseWheelEvent) => void): any;
        /**
         * Removes an event listener from the map.
         * @param type The event name.
         * @param callback The event handler callback.
         */
        remove(type: string, callback: (e: void | MapMouseEvent | MapTouchEvent | MapMouseWheelEvent) => void): any;
        /**
         * Removes an event listener from the map.
         * @param type The event name.
         * @param target The layer(s) to remove the event for.
         * @param callback The event handler callback.
         */
        remove(type: string, target: atlas.layer.Layer | atlas.layer.Layer[], callback: (e: void | MapMouseEvent | MapTouchEvent | MapMouseWheelEvent) => void): any;
    }

    /**
     * A manager for the map control's HTML markers.
     * Exposed through the markers property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class HtmlMarkerManager {
        /**
         * Adds an HTML based marker to the map.
         * @param element The marker to add.
         * @param position Optionally specify the position of the marker on the map.
         */
        add(element: atlas.HtmlMarker, position?: atlas.data.Position): void;
        /**
         * Removes one or more HTML markers from the map.
         * @param marker A HtmlMarker instance, a string id of a marker's htmlContent, or an array of these.
         */
        remove(marker: string | atlas.HtmlMarker | Array<string | atlas.HtmlMarker>): void;
        /**
         * Clears all markers.
         */
        clear(): void;
    }

    /**
     * A manager for the map control's image sprite.
     * Exposed through the imageSprite property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class ImageSpriteManager {
        /**
         * Add an icon image to the map's image sprite for use with symbols and patterns.
         * @param id The image's id.
         * If the specified id matches the id of a previously added image the new image will be ignored.
         * @param icon The image to add to the map's sprite. Can be a data URI, inline SVG, or image URL.
         */
        add(id: string, icon: string | HTMLImageElement | ImageData): Promise<void>;
        /**
         * Removes all images added by the user.
         */
        clear(): void;
        /**
         * Gets a list of all the image ids that have been added to the maps image sprite.
         */
        getImageIds(): string[];
        /**
         * Checks to see if an image is already loaded into the maps image sprite.
         * @param id The id to check the map's image sprite for.
         */
        hasImage(id: string): boolean;
        /**
         * Removes an image from the map's image sprite.
         * @param id The id of the image to remove.
         */
        remove(id: string): void;
    }

    /**
     * A manager for the map control's layers.
     * Exposed through the layers property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class LayerManager {
        /**
         * Adds one or more layers to the map.
         * The map must be fully loaded before a layer can be added.
         * Use the map.addEventListener method with event type 'load'.
         * @param layer The layer(s) to add.
         * @param before Optionally specify a layer or layer id to insert the new layer(s) before it.
         */
        add(layer: atlas.layer.Layer | atlas.layer.Layer[], before?: string | atlas.layer.Layer): void;
        /**
         * Removes all user added layers from the map.
         */
        clear(): void;
        /**
         * Retrieves a layer with the specified id.
         * @param id The id of the layer to retrieve.
         */
        getLayerById(id: string): atlas.layer.Layer;
        /**
         * Retrieves all layers that have been added to the map.
         */
        getLayers(): atlas.layer.Layer[];
        /**
         * Moves a layer to a different z-position.
         * @param layer The layer or id of the layer to move.
         * @param before Optionally specify to move the layer before this.
         */
        move(layer: string | atlas.layer.Layer, before?: string | atlas.layer.Layer): void;
        /**
         * Retrieve all GeoJSON features that are visible on the map that are in a DataSource or VectorTileSource.
         * Features that are not visible or who's layer zoom range does not include the current zoom level will not be returned.
         * Symbol features that have been hidden due to text or icon collisions are not included.
         * Features from all other layers are included even if they have no contribution to the map rendering, e.g. alpha set to zero.
         * The topmost rendered features appears first in the returned array and subsequent features are sorted in descending z-order.
         * @param geometry A Point or BoundingBox that returned features must intersect. If not specified the whole visible world is used.
         * @param layers An array of layers or their ids to limit the query to.
         * @param filter A expression to filter the returned features by.
         */
        getRenderedShapes(geometry?: atlas.data.Point | atlas.data.BoundingBox, layers?: Array<string | atlas.layer.Layer>, filter?: Expression): Array<atlas.Shape | atlas.data.Feature<atlas.data.Geometry, any>>;
        /**
         * Removes one or more layers from the map.
         * @param layer One or more layers or their ids for removal.
         */
        remove(layer: string | atlas.layer.Layer | Array<string | atlas.layer.Layer>): void;
    }

    /**
     * A manager for the map control's sources.
     * Exposed through the sources property of the atlas.Map class.
     * Cannot be instantiated by the user.
     */
    export class SourceManager {
        /**
         * Adds one or more data sources to the map.
         * The map must be fully loaded before a source can be added.
         * Use the map.addEventListener method with event type 'load'.
         * @param source
         */
        add(source: atlas.source.Source | atlas.source.Source[]): void;
        /**
         * Removes all sources from the map.
         */
        clear(): void;
        /**
         * Retrieves a source with the specified id.
         * @param id
         */
        getById(id: string): atlas.source.Source;
        /**
         * Returns a boolean indicating if the source is loaded or not.
         * @param source The id of a source or a Source object.
         */
        isSourceLoaded(source: string | atlas.source.Source): boolean;
        /**
         * Removes one or more sources from the map by specifying the source id or providing the source itself.
         * @param source
         */
        remove(source: string | atlas.source.Source | Array<string | atlas.source.Source>): void;
    }

    export interface Options {
        [property: string]: any;
    }

    /**
     * Event object returned by the maps when a touch event occurs.
     * @module Object Definitions
     */
    export interface MapMouseWheelEvent {
        /**
         * The original event that was fired.
         */
        originalEvent?: Event;
        /**
         * The `Map` instance in which the event occurred on.
         */
        map?: atlas.Map;
        /**
         * The event type.
         */
        type?: string;
        /**
         * Prevents event propagation bubbling up the event chain.
         */
        preventDefault: () => void;
    }

    /**
     * Event object returned by the maps when a touch event occurs.
     * @module Object Definitions
     */
    export interface MapTouchEvent extends MapMouseWheelEvent {
        /**
         * The pixel coordinate at the center of the all touch points on the map, relative to the top left corner.
         */
        pixel?: atlas.Pixel;
        /**
         * The array of pixel coordinates of all touch points on the map.
         */
        pixels?: atlas.Pixel[];
        /**
         * The geographic location of the center of all touch points on the map.
         */
        position?: atlas.data.Position;
        /**
         * The geographical location of all touch points on the map.
         */
        positions?: atlas.data.Position[];
    }

    export interface MapMouseEvent extends MapMouseWheelEvent {
        /**
         * The shapes of of all touch points on the map.
         */
        shapes?: Array<atlas.data.Feature<atlas.data.Geometry, any> | atlas.Shape>;
        /**
         * The geographical location of all touch points on the map.
         */
        position?: atlas.data.Position;
        /**
         * The pixel coordinate where the event occurred as an array of [x, y].
         */
        pixel?: atlas.Pixel;
    }

    /**
     * Represent the amount of padding in pixels to add to the side of a BoundingBox when setting the camera of a map.
     */
    export interface Padding extends Options {
        /**
         * Amount of padding in pixels to add to the bottom.
         * default `0`
         * @default 0
         */
        bottom: number;
        /**
         * Amount of padding in pixels to add to the left.
         * default `0`
         * @default 0
         */
        left: number;
        /**
         * Amount of padding in pixels to add to the right.
         * default `0`
         * @default 0
         */
        right: number;
        /**
         * Amount of padding in pixels to add to the top.
         * default `0`
         * @default 0
         */
        top: number;
    }

    export module deprecated {

        /**
         * The options for a linestring layer.
         * @deprecated Use LineLayerOptions with atlas.layer.LineLayer instead.
         */
        export class LinestringLayerOptions extends LayerOptions implements LinestringProperties {
            /**
             * The type of cap to use for the ends of the linestrings:
             * <p>"butt" is a squared ending that is drawn to the exact endpoint of the line.</p>
             * <p>"round" is a circular ending that is drawn past the exact endpoint with a radius of half the linestring's
             * width.</p>
             * <p>"square" is a squared ending that is drawn past the exact endpoint by half the linestring's width.
             */
            cap?: "butt" | "round" | "square";
            /**
             * The type of join to use for the linestrings:
             * <p>"bevel" is a squared join that cuts a corner flat at half the linestring's width from the vertex.</p>
             * <p>"round" is a circular join that rounds a corner with a radius of half the linestring's width from the
             * vertex.</p>
             * <p>"miter" is a sharp join that extends the segments of the linestring past the vertex until they intersect.</p>
             */
            join?: "bevel" | "round" | "miter";
            /**
             * The name of the layer.
             */
            name?: string;
            /**
             * The color of the lines for the layer. Is used as the default if a specific color is not specified for a line.
             */
            color?: string;
            /**
             * The width of the lines for the layer. Is used as the default if a specific width is not specified for a line.
             */
            width?: number;
        }

        /**
         * The options for a circle layer.
         * @deprecated Use BubbleLayerOptions with atlas.layer.BubbleLayer instead.
         */
        export class CircleLayerOptions extends LayerOptions implements CircleProperties {
            /**
             * The fill color of the circles for the layer. Is used as the default if a fill color is not specified for a
             * circle.
             */
            color?: string;
            /**
             * The outline color of the circles for the layer. Is used as the default if an outline color is not specified for
             * a circle.
             */
            outlineColor?: string;
            /**
             * The radius in pixels of the circles for the layer. Is used as the default if a radius is not specified for a
             * circle.
             */
            radius?: number;
            /**
             * The outline stroke width of the circles for the layer. Is used as the default if outline width is not specified
             * for a circle.
             */
            outlineWidth?: number;
            /**
             * The name of the layer.
             */
            name?: string;
        }

        /**
         * The options for a layer of the map.
         * @deprecated
         */
        class LayerOptions implements Options {

            /**
             * The name of the layer.
             */
            name?: string;

            /**
             * The name of the layer to place this layer before.  If not specified, the layer will be placed at the top of the
             * layer list.
             */
            before?: string;

            /**
             * The minimum zoom at which the layer will display inclusive.
             */
            minZoom?: number;

            /**
             * The maximum zoom at which the layer will display inclusive.
             */
            maxZoom?: number;

            /**
             * Whether to overwrite previous data for the layer.
             */
            overwrite?: boolean;

            /**
             * Whether to defer the layer's updates to the map until a subsequent layer's update or an update to the map's
             * style options.
             */
            defer?: boolean;

            /**
             * The opacity of the layer.
             */
            opacity?: number;
        }

        /**
         * The options for a pin layer.
         * @deprecated Use SymbolLayerOptions with atlas.layer.SymbolLayer instead.
         */
        export class PinLayerOptions extends LayerOptions implements PinProperties {
            /**
             * The factor by which the icon should be scaled. A value of 1 is the original size; a value of 2 will double the
             * size of the icon.
             */
            iconSize?: number;
            /**
             * The size of the title text.
             */
            fontSize?: number;
            /**
             * The color of the title text.
             */
            fontColor?: string;
            /**
             * The font for the title of the pin.
             */
            textFont?: "SegoeUi-Bold" | "SegoeUi-Regular" | "StandardFont-Bold" | "StandardFont-Regular";
            /**
             * Whether the icons should cluster when they collide on the map, or stay separate.
             */
            cluster?: boolean;
            /**
             * The icon to use to represent a cluster.
             */
            clusterIcon?: string;
            /**
             * An array of [pixelsRight, pixelsDown] for how many pixels to the right and down the title text should be
             * offset. Negative numbers can be used to offset the title left and up.
             */
            textOffset?: number[];
            /**
             * The name of the layer.
             */
            name?: string;
            /**
             * The icon of the pins for the layer. Is used as the default if an icon is not specified for a pin.
             */
            icon?: "pin-darkblue" | "pin-blue" | "pin-red" | "pin-round-darkblue" | "pin-round-blue" | "pin-round-red" | "none";
            /**
             * The title of the pins for the layer. Is used as the default if a title is not specified for a pin.
             */
            title?: string;
        }

        /**
         * The options for a polygon layer.
         * @deprecated Use new PolygonLayerOptions with atlas.layer.PolygonLayer instead.
         */
        export class PolygonLayerOptions extends LayerOptions implements PolygonProperties {
            /**
             * The fill color of the polygons for the layer. Is used as the default if a fill color is not specified for a
             * polygon.
             */
            color?: string;
            /**
             * The outline color of the polygons for the layer. Is used as the default if an outline color is not specified for
             * a polygon.
             * @deprecated Use `atlas.layer.LineLayer` to provide an outline for a polygon.
             */
            outlineColor?: string;
            /**
             * The name of the layer.
             */
            name?: string;
        }

        /**
         * The options for a raster layer.
         * @deprecated Use TileLayerOptions with atlas.layer.TileLayer instead.
         */
        export class RasterLayerOptions extends LayerOptions {
            /**
             * The name of the layer.
             */
            name?: string;
        }

        /**
         * Individual properties that can be specified for a circle feature.
         * @deprecated Use BubbleLayerOptions with atlas.layer.BubbleLayer instead.
         */
        export interface CircleProperties {
            /**
             * The fill color of the circle.
             */
            color?: string;
            /**
             * The outline color of the circle.
             */
            outlineColor?: string;
            /**
             * The radius in pixels of the circle.
             */
            radius?: number;
            /**
             * The outline stroke width of the circle.
             */
            outlineWidth?: number;
            /**
             * Additional properties of the entity.
             */
            [others: string]: any;
        }

        /**
         * Individual properties that can be specified for a linstring feature.
         * @deprecated Use LineLayerOptions with atlas.layer.LineLayer instead.
         */
        export interface LinestringProperties {
            /**
             * The color of the linestring.
             */
            color?: string;
            /**
             * The width of the linestring.
             */
            width?: number;
            /**
             * Additional properties of the entity.
             */
            [others: string]: any;
        }

        /**
         * Individual properties that can be specified for a point feature.
         * @deprecated Use SymbolLayerOptions with atlas.layer.SymbolLayer instead.
         */
        export interface PinProperties {
            /**
             * The icon to display for the point.
             */
            icon?: "pin-darkblue" | "pin-blue" | "pin-red" | "pin-round-darkblue" | "pin-round-blue" | "pin-round-red"
            | "none" | string;

            /**
             * The title to display for the point.
             */
            title?: string;

            /**
             * Additional properties of the entity.
             */
            [others: string]: any;
        }

        /**
         * Individual properties that can be specified for a polygon feature.
         * @deprecated Use new PolygonLayerOptions with atlas.layer.PolygonLayer instead.
         */
        export interface PolygonProperties {
            /**
             * The fill color of the polygon.
             */
            color?: string;
            /**
             * The outline color of the polygon.
             */
            outlineColor?: string;
            /**
             * Additional properties of the entity.
             */
            [others: string]: any;
        }
    }
}