declare module atlas {

    //export interface ServiceOptions  {
    //    "session-id": string;

    //    "subscription-key": string;
    //}


    export class Map {
        map: Mapbox.Map

    }

    export class Popup {

    }


    export module control {

    }

    export module data {

        /**
      * The valid values for the "type" property of GeoJSON geometry objects.
      * https://tools.ietf.org/html/rfc7946#section-1.4
      */
        export type GeoJsonGeometryTypes = "Point" | "LineString" | "MultiPoint" | "Polygon" | "MultiLineString" |
            "MultiPolygon" | "GeometryCollection";

        /**
         * The value values for the "type" property of GeoJSON Objects.
         * https://tools.ietf.org/html/rfc7946#section-1.4
         */
        export type GeoJsonTypes = "FeatureCollection" | "Feature" | GeoJsonGeometryTypes;

        /**
         * Bounding box
         * https://tools.ietf.org/html/rfc7946#section-5
         * [minLon, minLat, maxLon, maxLat]
         */
        export type BoundingBox = [number, number, number, number] | [number, number, number, number, number, number];

        /**
         * A Position is an array of coordinates.
         * https://tools.ietf.org/html/rfc7946#section-3.1.1
         * Array should contain between two and three elements.
         * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
         * but the current specification only allows X, Y, and (optionally) Z to be defined.
         */
        export type Position = Array<number>;

        /**
         * The base GeoJSON object.
         * https://tools.ietf.org/html/rfc7946#section-3
         * The GeoJSON specification also allows foreign members
         * (https://tools.ietf.org/html/rfc7946#section-6.1)
         * Developers should use "&" type in TypeScript or extend the interface
         * to add these foreign members.
         */
        export interface GeoJsonObject {
            // Don't include foreign members directly into this type def.
            // in order to preserve type safety.
            // [key: string]: any;
            /**
             * Specifies the type of GeoJSON object.
             */
            type: GeoJsonTypes;
            /**
             * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
             * https://tools.ietf.org/html/rfc7946#section-5
             */
            bbox?: BoundingBox;
        }

        /**
         * A geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3
         */
        export interface GeometryObject extends GeoJsonObject {
            type: GeoJsonGeometryTypes;
        }

        /**
         * Point geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3.1.2
         */
        export interface Point extends GeometryObject {
            type: "Point";
            coordinates: Position;
        }

        /**
         * MultiPoint geometry object.
         *  https://tools.ietf.org/html/rfc7946#section-3.1.3
         */
        export interface MultiPoint extends GeometryObject {
            type: "MultiPoint";
            coordinates: Position[];
        }

        /**
         * LineString geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3.1.4
         */
        export interface LineString extends GeometryObject {
            type: "LineString";
            coordinates: Position[];
        }

        /**
         * MultiLineString geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3.1.5
         */
        export interface MultiLineString extends GeometryObject {
            type: "MultiLineString";
            coordinates: Position[][];
        }

        /**
         * Polygon geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3.1.6
         */
        export interface Polygon extends GeometryObject {
            type: "Polygon";
            coordinates: Position[][];
        }

        /**
         * MultiPolygon geometry object.
         * https://tools.ietf.org/html/rfc7946#section-3.1.7
         */
        export interface MultiPolygon extends GeometryObject {
            type: "MultiPolygon";
            coordinates: Position[][][];
        }

        /**
         * Geometry Collection
         * https://tools.ietf.org/html/rfc7946#section-3.1.8
         */
        export interface GeometryCollection extends GeometryObject {
            type: "GeometryCollection";
            geometries: Array<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon>;
        }

        export type GeoJsonProperties = { [name: string]: any; } | null;

        /**
         * A feature object which contains a geometry and associated properties.
         * https://tools.ietf.org/html/rfc7946#section-3.2
         */
        export interface Feature extends GeoJsonObject {
            type: "Feature";
            /**
             * The feature's geometry
             */
            geometry: GeometryObject;
            /**
             * A value that uniquely identifies this feature in a
             * https://tools.ietf.org/html/rfc7946#section-3.2.
             */
            id?: string;
            /**
             * Properties associated with this feature.
             */
            properties: GeoJsonProperties;
        }

        /**
         * A collection of feature objects.
         *  https://tools.ietf.org/html/rfc7946#section-3.3
         */
        export interface FeatureCollection extends GeoJsonObject {
            type: "FeatureCollection";
            features: Array<Feature>;
        }

        export class FeatureCollection {
            constructor(features: Feature[]);
        }

        export class Feature {
            constructor(geometry: GeometryObject, properties?: GeoJsonProperties, id?: string);
        }

        export class Point {
            constructor(coordinates: Position);
            type: "Point";
            coordinates: Position;
        }

        export class LineString {
            constructor(coordinates: Position[], bbox?: BoundingBox);
        }

        export class Polygon {
            constructor(coordinates: Position[][], bbox?: BoundingBox);
            type: "Polygon";
            coordinates: Position[][];
        }
    }


    
}

declare module Mapbox {
    export class Map {
        public addSource(id: string, source: Source): this;

        public getSource(id: string): Source;

        public removeSource(id: string): this;

        /**
         * Sets the value of a layout property in the specified style layer.
         * @param layer The ID of the layer to set the layout property in.
         * @param name The name of the layout property to set
         * @param value The value of the layout propery. Must be of a type appropriate for the property, as defined in the Mapbox Style Specification .
         */
        public setLayoutProperty(layer: string, name: string, value): this;
    }

    export interface Source {

    }

    export interface GeoJsonSource extends Source {
        type: string;
        data: atlas.data.FeatureCollection;
        setData(data: atlas.data.FeatureCollection): GeoJsonSource;
    }
}