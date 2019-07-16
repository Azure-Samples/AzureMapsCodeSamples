
module atlas {

    /****************************
    * Public classes
    ***************************/

    export module animations {

        /**
         * Adds an offset array property to point shapes and animates it's y value to simulate dropping. Use with a symbol layer with the icon/text offset property set to ['get', 'offset'].
         * @param shapes A one or more point geometries or shapes to drop in. 
         * @param datasource The data source to drop the point shapes into.
         * @param height The height at which to drop the shape from.Default: 200 pixels
         * @param options Options for the animation.
         */
        export function drop(shapes: atlas.data.Point | atlas.data.Feature<atlas.data.Point, any> | atlas.Shape | (atlas.data.Point | atlas.data.Feature<atlas.data.Point, any> | atlas.Shape)[], dataSource: atlas.source.DataSource, height?: number, options?: BaseAnimationOptions): PlayableAnimation {
            var s: atlas.Shape[] = [];

            if (Array.isArray(shapes)) {
                for (var i = 0, len = shapes.length; i < len; i++) {
                    if ((shapes[i]['type'] === 'Feature' && shapes[i]['geometry']['type'] === 'Point') || shapes[i]['type'] === 'Point') {
                        s.push(new atlas.Shape(shapes[i] as atlas.data.Point));
                    } else if (shapes[i] instanceof atlas.Shape && (shapes[i] as atlas.Shape).getType() === 'Point') {
                        s.push(shapes[i] as atlas.Shape);
                    }
                }
            } else if ((shapes['type'] === 'Feature' && shapes['geometry']['type'] === 'Point') || shapes['type'] === 'Point') {
                s.push(new atlas.Shape(shapes as atlas.data.Point));
            } else if (shapes instanceof atlas.Shape && shapes.getType() === 'Point') {
                s.push(shapes);
            }

            if (s.length > 0) {
                return new DropAnimation(s, dataSource, height, options);
            }

            throw 'Specified shape not a point geometry type.'
        }

        //public static setProperty(): void {

        //}

        /**
         * Animates the update of coordinates on a shape. Shapes will stay the same type. 
         * @param shape The shape to animate.
         * @param newCoordinates The new coordinates of the shape. Must be the same format as required by the shape. 
         * @param options Options for the animation.
         */
        export function setCoordinates(shape: atlas.Shape, newCoordinates: atlas.data.Position | atlas.data.Position[] | atlas.data.Position[][] | atlas.data.Position[][][], options?: PathAnimationOptions): PlayableAnimation {

            switch (shape.getType()) {
                case 'Point':
                    if (getDimensions(newCoordinates) === 0) {
                        return new PointTranslateAnimation(shape, newCoordinates as atlas.data.Position, options);
                    } else {
                        throw 'New coordinates not compatible with Point geometry.';
                    }

                //TODO: add support for other shape types.
                case 'MultiPoint':
                case 'LineString':
                case 'MultiLineString':
                    break;
                case 'Polygon':
                case 'MultiPolygon':
                    break;
            }
        }

        /**
         * Animates the path of a LineString.
         * @param shape A LineString shape to animate.
         * @param options Options for the animation.
         */
        export function snakeline(shape: atlas.Shape, options?: PathAnimationOptions): PlayableAnimation {
            if (shape && shape.getType() === 'LineString') {
                return new PathAnimation(shape, (shape.getCoordinates() as atlas.data.Position[]).slice(0), options);
            }

            throw 'Specified shape is not a LineString type.';
        }

        /**
         * Animates a Point shape along a path. 
         * @param shape A Point shape to animate.
         * @param path The path to animate the point along. Must be either an array of positions, or a LineString geometry/shape.
         * @param options Options for the animation.
         */
        export function moveAlongPath(shape: atlas.Shape, path?: atlas.data.Position[] | atlas.data.LineString | atlas.Shape, options?: PathAnimationOptions): PlayableAnimation {
            if (shape && shape.getType() === 'Point') {
                var p: atlas.data.Position[];

                if (path) {
                    if (Array.isArray(path)) {
                        //Must be an array of positions.
                        p = path;
                    } else if (path instanceof atlas.Shape) {
                        if (path.getType() === 'LineString') {

                        }
                    } else if (path.type === 'LineString') {
                        p = path.coordinates;
                    }
                }

                if (p.length < 2) {
                    throw 'Invalid path option specified.'
                }

                return new PathAnimation(shape, p, options);
            }

            throw 'Specified shape is not a Point type.';
        }

        /**
         * Plays an array of animations at the same time.
         * @param animations Array of animations to play.
         * @param options Common set of options to apply to each animaiton.
         */
        export function play(animations: PlayableAnimation[], options?: BaseAnimationOptions): GroupAnimation {
            var ga = new atlas.animations.GroupAnimation(animations);

            if (animations && animations.length > 0) {
                for (var i = 0; i < animations.length; i++) {
                    animations[i].play(options);
                }
            }

            //No option to stop this animation.
            return ga;
        }

        /**
         * Plays an array of animations sequentially.
         * @param animations Array of animations to play.
         * @param options Common set of options to apply to each animaiton.
         */
        export function playSeq(animations: PlayableAnimation[], options?: BaseAnimationOptions): GroupAnimation {
            var ga = new atlas.animations.GroupAnimation(animations);

            if (animations && animations.length > 0) {
                var idx = 0;


                var callback = () => {
                    if (idx > 0) {
                        //Only use the callback once.
                        animations[idx - 1]._onComplete = null;
                    }

                    if (!ga._cancelAnimations && idx < animations.length) {
                        animations[idx]._onComplete = callback;
                        animations[idx].play(options);
                        idx++;
                    }
                };

                callback();
            }

            return ga;
        }

        /**
         * Plays an array of animations one by one based on an interval. 
         * @param animations Array of animations to play.
         * @param options Common set of options to apply to each animaiton.
         * @param interval The interval offset of each animation. Default: 100 ms
         * @param options Common set of options to apply to each animaiton.
         */
        export function playInterval(animations: PlayableAnimation[], interval?: number, options?: BaseAnimationOptions): GroupAnimation {
            var ga = new atlas.animations.GroupAnimation(animations);

            if (animations && animations.length > 0) {
                interval = (typeof interval === 'number' && interval > 0) ? Math.abs(interval) : 100;

                var idx = 0;
                var p = function () {
                    if (!ga._cancelAnimations && idx < animations.length) {
                        animations[idx].play(options);
                        idx++;

                        setTimeout(function () {
                            p();
                        }, interval);
                    }
                }
                p();
            }

            return ga;
        }

        /** Group animation handler. */
        export class GroupAnimation {
            private _animations: PlayableAnimation[];

            /**
             * Group animation handler.
             * @param animations Array of animations to handle.
             */
            constructor(animations: PlayableAnimation[]) {
                this._animations = animations;
            }

            public _cancelAnimations = false;

            /** When called, will prevent any animation that hasn't already started in the group animation from starting. */
            public cancel(): void {
                this._cancelAnimations = true;
            }

            /** Stops all animations and jumps to the final state of each animation. */
            public stop(): void {
                this._cancelAnimations = true;

                if (this._animations && this._animations.length > 0) {
                    for (var i = 0; i < this._animations.length; i++) {
                        //Start any unstarted animaitons.
                        if (this._animations[i]._start === null) {
                            this._animations[i].play();
                        }

                        this._animations[i].stop();
                    }
                }
            }
        }

        /****************************
        * Abstract classes
        ***************************/

        /** An abstract class which defines an animation that supports a play function. */
        export abstract class PlayableAnimation implements Animatable {

            protected _easing = Easings.linear;

            /**************************
            * Internal properties
            ***************************/

            public _start: number;

            public _onComplete: () => void;

            /**************************
            * Public Methods
            ***************************/

            /**
             * Plays the animation.
             * @param options Options for the animation.
             */
            public play(options?: BaseAnimationOptions): void {
                this._start = performance.now();
            }

            /** Stops the animation and jumps to the final state of the animation. */
            public stop(): void {
                //Jump the animationto the final state by adding a day to the current time.
                this._triggerFrameAnimation(performance.now() + 1000 * 60 * 60 * 24);
                this._start = null;
            }

            /** Stops the animation and jumps to the final state of the animation. */
            public abstract _triggerFrameAnimation(timestamp: number): void;
        }
    }

    /** Base animation options. */
    export interface BaseAnimationOptions {
        /** The duration of the animation in ms. Default: 100 ms */
        duration?: number,

        /** Specifies if the animation should start automatically or wait for the play function to be called. */
        autoPlay?: boolean,

        /** The easing of the animaiton. */
        easing?: string,
    }

    /** Options for animations that involve coordiates following a path. */
    export interface PathAnimationOptions extends BaseAnimationOptions {
        /** Specifies if a curved geodesic path should be used between points rather than a straight pixel path. Default: false */
        geodesic?: boolean;

        /** Specifies if metadata should be captured as properties of the shape. Potential metadata properties that may be captured: _heading */
        captureMetadata?: boolean;
    }

    /****************************
    * Internal Abstract classes
    ***************************/

    /** Represents an object that can be used with the AnimationManager. */
    abstract class Animatable {
        public _start: number;
        public abstract _triggerFrameAnimation(timestamp: number): void;
    }

    /****************************
    * Internal classes
    ***************************/
    
    /** An animation manager for classes that extend from the AnimatedShape class. */
    class AnimationManager {

        /****************************
        * Private Properties
        ***************************/

        private _animation: number = null;
        private _queue: Animatable[] = [];
        private _lastTime: number;
        private _minFrameRate = 33; //roughly 30 frames per second is the fastest that the animation loop will update.
        private stopped = true;

        /****************************
        * Constructor
        ***************************/

        constructor() {
            this._lastTime = performance.now();
            this.enable();
        }

        /****************************
        * Public functions
        ***************************/

        /** Stops all animations. */
        public disable(): void {
            if (!this.stopped) {
                this.stopped = true;
                cancelAnimationFrame(this._animation);
            }
        }

        /** Renables animations. Many will likely snap to the end of their animation. */
        public enable(): void {
            if (this.stopped) {
                this.stopped = false;
                this._animation = requestAnimationFrame(this.animate.bind(this));
            }
        }

        /**
         * Adds an animated object to the animation queue.
         * @param animatable The object to animate.
         */
        public add(animatable: Animatable): void {
            var idx = this._queue.indexOf(animatable);

            //Only add the point to the queue if it isn't already in it.
            if (idx === -1) {
                this._queue.push(animatable);
            }
        }

        /**
         * Removes a object from the animation queue.
         * @param animatable The object to remove from the queue.
         */
        public remove(animatable: Animatable): void {
            var idx = this._queue.indexOf(animatable);

            if (idx >= 0) {
                this._queue = this._queue.splice(idx, 1);
            }
        }

        /****************************
        * Public static properties
        ***************************/

        /** A blobal static instance of the AnimationManager. */
        public static instance = new AnimationManager();

        /****************************
        * Private functions
        ***************************/

        /** Loops through the queue and animates a frame for each animatable object. */
        private animate(): void {
            if (!this.stopped) {
                var t = performance.now();

                if (t - this._lastTime >= this._minFrameRate) {
                    for (var i = 0, len = this._queue.length; i < len; i++) {
                        this._queue[i]._triggerFrameAnimation(t);
                    }

                    //Request the next frame of the animation.
                    this._lastTime = t;
                }

                this._animation = requestAnimationFrame(this.animate.bind(this));
            }
        }
    }

    /** Easing functions for animations. */
    class Easings {
        //From http://andrewraycode.github.io/easing-utils/gh-pages/

        /**
         * A linear easing function.
         * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
         */
        public static linear(progress: number): number {
            return progress;
        }

        /**
        * Slight acceleration from zero to full speed. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInSine(progress: number): number {
            return 1 - Math.cos(progress * Math.PI * 0.5);
        }

        /**
        * Slight deceleration at the end. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutSine(progress: number): number {
            return Math.sin(progress * Math.PI * 0.5);
        }

        /**
        * Slight acceleration at beginning and slight deceleration at end. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutSine(progress: number): number {
            return -0.5 * (Math.cos(Math.PI * progress) - 1);
        }

        /**
        * Accelerating from zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInQuad(progress: number): number {
            return progress * progress;
        }

        /**
        * Decelerating to zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutQuad(progress: number): number {
            return progress * (2 - progress);
        }

        /**
        * Acceleration until halfway, then deceleration. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutQuad(progress: number): number {
            if (progress < 0.5) {
                return 2 * progress * progress;
            }

            return - 1 + (4 - 2 * progress) * progress;
        }

        /**
        * Accelerating from zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInCubic(progress: number): number {
            return progress * progress * progress;
        }

        /**
        * Decelerating to zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutCubic(progress: number): number {
            const t1 = progress - 1;
            return t1 * t1 * t1 + 1;
        }

        /**
        * Acceleration until halfway, then deceleration. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutCubic(progress: number): number {
            if (progress < 0.5) {
                return 4 * progress * progress * progress;
            }

            return (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
        }

        /**
        * Accelerating from zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInQuart(progress: number): number {
            return progress * progress * progress * progress;
        }

        /**
        * Decelerating to zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutQuart(progress: number): number {
            const t1 = progress - 1;
            return 1 - t1 * t1 * t1 * t1;
        }

        /**
        * Acceleration until halfway, then deceleration. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutQuart(progress: number): number {
            if (progress < 0.5) {
                return 8 * progress * progress * progress * progress;
            }

            const t1 = progress - 1;
            return 1 - 8 * t1 * t1 * t1 * t1;
        }

        /**
        * Accelerating from zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInQuint(progress: number): number {
            return progress * progress * progress * progress * progress;
        }

        /**
        * Decelerating to zero velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutQuint(progress: number): number {
            const t1 = progress - 1;
            return 1 + t1 * t1 * t1 * t1 * t1;
        }

        /**
        * Acceleration until halfway, then deceleration. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutQuint(progress: number): number {
            if (progress < 0.5) {
                return 16 * progress * progress * progress * progress * progress;
            }

            const t1 = progress - 1;
            return 1 + 16 * t1 * t1 * t1 * t1 * t1;
        }

        /**
        * Accelerate exponentially until finish. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInExpo(progress: number): number {
            if (progress === 0) {
                return 0;
            }

            return Math.pow(2, 10 * (progress - 1));
        }

        /**
        * Initial exponential acceleration slowing to stop. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutExpo(progress: number): number {
            if (progress === 1) {
                return 1;
            }

            return 1 - Math.pow(2, -10 * progress);
        }

        /**
        * Exponential acceleration and deceleration. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutExpo(progress: number): number {
            if (progress === 0 || progress === 1) {
                return progress;
            }

            const scaledTime1 = progress * 2 - 1;

            if (scaledTime1 < 0) {
                return 0.5 * Math.pow(2, 10 * scaledTime1);
            }

            return 0.5 * (2 - Math.pow(2, -10 * scaledTime1));
        }

        /**
        * Increasing velocity until stop. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInCirc(progress: number): number {
            return -1 * (Math.sqrt(1 - progress * progress) - 1);
        }

        /**
        * Start fast, decreasing velocity until stop. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutCirc(progress: number): number {
            const t1 = progress - 1;
            return Math.sqrt(1 - t1 * t1);
        }

        /**
        * Fast increase in velocity, fast decrease in velocity. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutCirc(progress: number): number {
            const scaledTime = progress * 2;

            if (scaledTime < 1) {
                return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
            }

            const scaledTime1 = scaledTime - 2;

            return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
        }

        /**
        * Slow movement backwards then fast snap to finish. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeInBack(progress, magnitude?: number): number {
            magnitude = magnitude || 1.70158;

            return progress * progress * ((magnitude + 1) * progress - magnitude);
        }

        /**
        * Fast snap to backwards point then slow resolve to finish. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeOutBack(progress, magnitude?: number): number {
            magnitude = magnitude || 1.70158;

            const scaledTime = progress - 1;

            return (
                scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude)
            ) + 1;
        }

        /**
        * Slow movement backwards, fast snap to past finish, slow resolve to finish. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeInOutBack(progress, magnitude?: number): number {
            magnitude = magnitude || 1.70158;

            const scaledTime = progress * 2;
            const s = magnitude * 1.525;

            if (scaledTime < 1) {
                return 0.5 * scaledTime * scaledTime * (
                    ((s + 1) * scaledTime) - s
                );
            }

            const scaledTime2 = scaledTime - 2;

            return 0.5 * (
                scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2
            );
        }

        /**
        * Bounces slowly then quickly to finish. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeInElastic(progress, magnitude?: number): number {
            if (progress === 0 || progress === 1) {
                return progress;
            }

            magnitude = magnitude || 0.7;

            const scaledTime1 = progress - 1;
            const p = 1 - magnitude;
            const s = p / (2 * Math.PI) * Math.asin(1);

            return -(
                Math.pow(2, 10 * scaledTime1) *
                Math.sin((scaledTime1 - s) * (2 * Math.PI) / p)
            );
        }

        /**
        * Fast acceleration, bounces to zero. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeOutElastic(progress: number, magnitude?: number): number {
            if (progress === 0 || progress === 1) {
                return progress;
            }

            magnitude = magnitude || 0.7;

            const p = 1 - magnitude;
            const scaledTime = progress * 2;
            const s = p / (2 * Math.PI) * Math.asin(1);

            return (
                Math.pow(2, -10 * scaledTime) *
                Math.sin((scaledTime - s) * (2 * Math.PI) / p)
            ) + 1;
        }

        /**
        * Slow start and end, two bounces sandwich a fast motion. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        * @param magnitude The magnitude of the easing.
        */
        public static easeInOutElastic(progress: number, magnitude?: number): number {
            if (progress === 0 || progress === 1) {
                return progress;
            }

            magnitude = magnitude || 0.65;

            const p = 1 - magnitude;
            const scaledTime1 = progress * 2 - 1;
            const s = p / (2 * Math.PI) * Math.asin(1);

            if (scaledTime1 < 0) {
                return -0.5 * (
                    Math.pow(2, 10 * scaledTime1) *
                    Math.sin((scaledTime1 - s) * (2 * Math.PI) / p)
                );
            }

            return (
                Math.pow(2, -10 * scaledTime1) *
                Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5
            ) + 1;
        }

        /**
        * Bounce to completion. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeOutBounce(progress: number): number {
            if (progress < (1 / 2.75)) {
                return 7.5625 * progress * progress;
            } else if (progress < (2 / 2.75)) {
                const scaledTime2 = progress - (1.5 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.75;
            } else if (progress < (2.5 / 2.75)) {
                const scaledTime2 = progress - (2.25 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.9375;
            } else {
                const scaledTime2 = progress - (2.625 / 2.75);
                return (7.5625 * scaledTime2 * scaledTime2) + 0.984375;
            }
        }

        /**
        * Bounce increasing in velocity until completion. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInBounce(progress: number): number {
            return 1 - Easings.easeOutBounce(1 - progress);
        }

        /**
        * Bounce in and bounce out. 
        * @param progress The progress of the animation. A value between 0 and 1 where 0 is the start of the animation and 1 is the end.
        */
        public static easeInOutBounce(progress: number): number {
            if (progress < 0.5) {
                return Easings.easeInBounce(progress * 2) * 0.5;
            }

            return (Easings.easeOutBounce((progress * 2) - 1) * 0.5) + 0.5;
        }
    }

    /****************************
    * Internal animation logic
    ***************************/

    /** Animates the dropping of a point geometries. */
    class DropAnimation extends atlas.animations.PlayableAnimation {
        /****************************
        * Private properties
        ***************************/

        private _options: BaseAnimationOptions = {
            duration: 1000
        };
        private _height = 200;
        private _dataSource: atlas.source.DataSource;
        private _shapes: atlas.Shape[];
        private _x0: number[];
        private _y0: number[];

        /**************************
        * Constructor
        ***************************/

        /**
         * Animates the dropping of a point geometries.
         * @param shapes An array point geometry shapes to animatie dropping.
         * @param dataSource The data source to drop the points into.
         * @param height The height at which to drop the shape from.Default: 200 pixels
         * @param options Options for the animation.
         */
        constructor(shapes: atlas.Shape[], dataSource: atlas.source.DataSource, height: number, options: BaseAnimationOptions) {
            super();

            if (shapes && shapes.length > 0) {
                this._shapes = shapes;

                if (!dataSource) {
                    throw 'A data source to drop the shape into is required.';
                }

                this._height = (typeof height === 'number' && height > 0) ? height : this._height;

                this._dataSource = dataSource;
                this._x0 = [];
                this._y0 = [];

                for (var i = 0, len = this._shapes.length; i < len; i++) {
                    var prop = shapes[i].getProperties();

                    var offset = prop['offset'];
                    if (offset && Array.isArray(offset) && offset.length >= 2) {
                        this._x0.push(offset[0]);
                        this._y0.push(offset[1]);
                    } else {
                        this._x0.push(0);
                        this._y0.push(0);
                    }
                }

                if (options) {
                    if (options.autoPlay) {
                        this.play(options);
                    } else {
                        this._setOptions(options);
                    }
                }

                AnimationManager.instance.add(this);
            } else {
                throw 'No shape specified for animation.';
            }
        }

        /**************************
        * Public Methods
        ***************************/

        /**
         * Plays the animation from the beginning. 
         * @param options Options for the animation.
         */
        public play(options?: BaseAnimationOptions): void {
            this._start = null;

            this._setOptions(options);

            var needAdding = [];

            for (var i = 0, len = this._shapes.length; i < len; i++) {
                this._shapes[i].addProperty('offset', [this._x0[i], this._y0[i] - this._height]);

                //Add the shape to the data source if it isn't already added.
                if (this._dataSource.getShapeById(this._shapes[i].getId()) === null) {
                    needAdding.push(this._shapes[i]);
                }
            }

            if (needAdding.length > 0) {
                this._dataSource.add(needAdding);
            }

            super.play();
        }

        /**************************
        * Internal functions
        ***************************/

        public _triggerFrameAnimation(timestamp: number): void {
            if (this._start) {
                var progress = getProgress(timestamp, this._start, this._options.duration);

                if (progress >= 1) {
                    //animationdone. Stop animating. 
                    this._start = null;

                    if (this._onComplete) {
                        this._onComplete();
                    }
                }

                if (this._easing) {
                    progress = this._easing(progress);
                }

                for (var i = 0, len = this._shapes.length; i < len; i++) {
                    var y1 = this._y0[i] - this._height * (1 - progress);
                    this._shapes[i].addProperty('offset', [this._x0[i], y1]);
                }
            }
        }

        /**************************
        * Private functions
        ***************************/

        private _setOptions(options: BaseAnimationOptions): void {
            if (options) {
                if (options.easing && Easings[options.easing]) {
                    this._easing = Easings[options.easing];
                }

                if (typeof options.duration === 'number') {
                    this._options.duration = options.duration || this._options.duration;
                }
            }
        }
    }

    /** Translates a Point object from one coordinate to another. */
    class PointTranslateAnimation extends atlas.animations.PlayableAnimation {
        /****************************
        * Private properties
        ***************************/

        private _options: PathAnimationOptions = {
            duration: 1000
        };
        private _shape: atlas.Shape;
        private _originPosition: atlas.data.Position;
        private _destinationPosition: atlas.data.Position;
        private _dx: number;
        private _heading: number;
        private _originPixel: atlas.Pixel;

        /**************************
        * Constructor
        ***************************/

        /**
         * Animates the dropping of a point geometries.
         * @param shapes An array point geometry shapes to animatie dropping.
         * @param options Options for the animation.
         */
        constructor(shape: atlas.Shape, newCoordinate?: atlas.data.Position, options?: PathAnimationOptions) {
            super();

            this._originPosition = shape.getCoordinates() as atlas.data.Position;
            this._shape = shape;
            this._destinationPosition = newCoordinate;

            if (options) {
                if (options.autoPlay) {
                    this.play(options);
                } else {
                    this._setOptions(options);
                }
            }

            AnimationManager.instance.add(this);
        }

        /**************************
        * Public Methods
        ***************************/

        /**
         * Plays the animation from the beginning. 
         * @param options Options for the animation.
         */
        public play(options?: BaseAnimationOptions): void {
            this._start = null;
            this._setOptions(options);
            super.play();
        }

        /**************************
        * Internal functions
        ***************************/

        public _triggerFrameAnimation(timestamp: number): void {
            if (this._start) {
                var progress = getProgress(timestamp, this._start, this._options.duration);

                if (progress >= 1) {
                    //animationdone. Stop animating. 
                    this._start = null;

                    if (this._onComplete) {
                        this._onComplete();
                    }
                }

                if (this._easing) {
                    progress = this._easing(progress);
                }

                if (progress === 1) {
                    //Animation is done.
                    this._shape.setCoordinates(this._destinationPosition);
                } else if (progress === 0) {
                    this._shape.setCoordinates(this._originPosition);
                } else {
                    var dx = this._dx * progress;

                    //Calculate the coordinate part way between the origin and destination.
                    if (this._options.geodesic) {
                        this._shape.setCoordinates(atlas.math.getDestination(this._originPosition, this._heading, dx));
                    } else {
                        this._shape.setCoordinates(atlas.math.mercatorPixelsToPositions([getPixelDestination(this._originPixel, this._heading, dx)], 21)[0]);
                    }
                }
            }
        }

        /**************************
        * Private functions
        ***************************/

        private _setOptions(options: PathAnimationOptions): void {
            if (options) {
                if (options.easing && Easings[options.easing]) {
                    this._easing = Easings[options.easing];
                }

                if (typeof options.duration === 'number') {
                    this._options.duration = options.duration || this._options.duration;
                }

                if (typeof options.captureMetadata === 'boolean') {
                    this._options.captureMetadata = options.captureMetadata;
                }

                if (typeof options.geodesic === 'boolean') {
                    this._options.geodesic = options.geodesic;
                }
            }
            
            if (this._options.geodesic) {
                //Calculate the distance and heading between the points. 
                this._dx = atlas.math.getDistanceTo(this._originPosition, this._destinationPosition);
                this._heading = atlas.math.getHeading(this._originPosition, this._destinationPosition);
            } else {
                //Calculate the mercator pixels of the coordinates at zoom level 21.
                var pixels = atlas.math.mercatorPositionsToPixels([this._originPosition, this._destinationPosition], 21);
                this._originPixel = pixels[0];

                //Ensure that the shortest path is taken between coordinates.
                if (Math.abs(this._originPosition[0] - this._destinationPosition[0]) > 180) {
                    var mapWidth = Math.pow(2, 21) * 512;

                    if (pixels[0][0] > pixels[1][0]) {
                        pixels[1][0] += mapWidth;
                    } else {
                        pixels[0][0] += mapWidth;
                    }
                }

                //Calculate the distance and heading between the pixels. 
                this._dx = getPixelDistance(pixels[0], pixels[1]);
                this._heading = getPixelHeading(pixels[0], pixels[1]);
            }

            if (this._options.captureMetadata) {
                this._shape.addProperty('_heading', this._heading);
            }
        }
    }

    /** Translates a Point object along a path or animates a LineString as a snakeline. */
    class PathAnimation extends atlas.animations.PlayableAnimation {

        /**************************
        * Private Properties
        ***************************/

        private _options: PathAnimationOptions = {
            duration: 1000
        };
        private _totalLength: number;
        private _positions: atlas.data.Position[];
        private _pixels: atlas.Pixel[];
        private _distances: number[];
        private _headings: number[];
        private _shape: atlas.Shape;

        /**************************
        * Constructor
        ***************************/

        constructor(shape: atlas.Shape, path: atlas.data.Position[], options?: PathAnimationOptions) {
            super();

            this._shape = shape;
            this._positions = path;

            options = options || {};

            if (options.autoPlay) {
                this.play(options);
            } else {
                this._setOptions(options);
            }  

            AnimationManager.instance.add(this);
        }

        /**************************
        * Public Methods
        ***************************/

        /**
         * Plays the animation from the beginning. 
         * @param options Options for the animation.
         */
        public play(options?: BaseAnimationOptions): void {
            this._start = null;
            this._setOptions(options);
            super.play();
        }

        /**************************
        * Internal functions
        ***************************/

        public _triggerFrameAnimation(timestamp: number): void {
            if (this._start) {
                var progress = getProgress(timestamp, this._start, this._options.duration);

                if (progress >= 1) {
                    //animationdone. Stop animating. 
                    this._start = null;

                    if (this._onComplete) {
                        this._onComplete();
                    }
                }

                if (this._easing) {
                    progress = this._easing(progress);
                }

                if (progress === 1) {
                    //Animation is done.
                    switch (this._shape.getType()) {
                        case 'Point':
                            this._shape.setCoordinates(this._positions[this._positions.length - 1]);
                            break;
                        case 'LineString':
                            this._shape.setCoordinates(this._positions);
                            break;
                    }

                    if (this._options.captureMetadata && this._headings.length > 0) {
                        this._shape.addProperty('_heading', this._headings[this._headings.length - 1]);
                    }
                } else if (progress === 0) {
                    this._shape.setCoordinates(this._positions[0]);

                    if (this._options.captureMetadata && this._headings.length > 0) {
                        this._shape.addProperty('_heading', this._headings[0]);
                    }
                } else {
                    var dx = this._totalLength * progress;
                    var pos: atlas.data.Position[] = null;
                    var heading = null;

                    //Calculate the coordinate part way between the origin and destination.
                    if (this._options.geodesic) {

                        if (dx > this._totalLength) {
                            heading = this._headings[this._headings.length - 1];
                            pos = this._positions.slice(0);
                            pos.push(atlas.math.getDestination(this._positions[this._positions.length - 1], heading, dx - this._totalLength));
                        } else if (dx < 0) {
                            heading = this._headings[0];
                            pos = this._positions.slice(0, 1);
                            pos.push(atlas.math.getDestination(this._positions[0], heading, dx));
                        } else {
                            var travelled = 0;

                            for (var i = 0; i < this._distances.length; i++) {
                                if (travelled + this._distances[i] >= dx) {
                                    heading = this._headings[i];
                                    pos = this._positions.slice(0, i + 1);
                                    pos.push(atlas.math.getDestination(this._positions[i], heading, dx - travelled));
                                    break;
                                } else {
                                    travelled += this._distances[i];
                                }
                            }
                        }
                    } else {
                        var px = null;

                        if (dx > this._totalLength) {
                            heading = this._headings[this._headings.length - 1];
                            px = getPixelDestination(this._pixels[this._pixels.length - 1], heading, dx - this._totalLength);
                            pos = this._positions.slice(0);
                            pos.push((atlas.math.mercatorPixelsToPositions([px], 21)[0]));
                        } else if (dx < 0) {
                            heading = this._headings[0];
                            px = getPixelDestination(this._pixels[0], heading, dx);
                            pos = this._positions.slice(0, 1);
                            pos.push(atlas.math.mercatorPixelsToPositions([px], 21)[0]);
                        } else {
                            var travelled = 0;

                            for (var i = 0; i < this._distances.length; i++) {
                                if (travelled + this._distances[i] >= dx) {
                                    heading = this._headings[i];
                                    px = getPixelDestination(this._pixels[i], heading, dx - travelled);
                                    pos = this._positions.slice(0, i + 1);
                                    pos.push(atlas.math.mercatorPixelsToPositions([px], 21)[0]);
                                    break;
                                } else {
                                    travelled += this._distances[i];
                                }
                            }
                        }
                    }

                    if (pos && pos.length > 0) {
                        switch (this._shape.getType()) {
                            case 'Point':
                                if (pos.length > 0) {
                                    this._shape.setCoordinates(pos[pos.length - 1]);
                                }
                                break;
                            case 'LineString':
                                this._shape.setCoordinates(pos);
                                break;
                        }
                    }

                    if (this._options.captureMetadata && typeof heading === 'number') {
                        this._shape.addProperty('_heading', heading);
                    }
                }
            }
        }

        /**************************
        * Private functions
        ***************************/

        private _setOptions(options: PathAnimationOptions): void {
            if (options) {
                if (options.easing && Easings[options.easing]) {
                    this._easing = Easings[options.easing];
                }

                if (typeof options.duration === 'number') {
                    this._options.duration = options.duration || this._options.duration;
                }

                if (typeof options.captureMetadata === 'boolean') {
                    this._options.captureMetadata = options.captureMetadata;
                }

                if (typeof options.geodesic === 'boolean') {
                    this._options.geodesic = options.geodesic;
                }
            }

            this._totalLength = 0;
            this._distances = [];
            this._headings = [];
            
            //Calculate the distances and headings between the positions.
            if (this._options.geodesic) {
                for (var i = 1, len = this._positions.length; i < len; i++) {
                    var d = atlas.math.getDistanceTo(this._positions[i - 1], this._positions[i]);
                    this._totalLength += d;
                    this._distances.push(d);

                    var h = atlas.math.getHeading(this._positions[i - 1], this._positions[i]);
                    this._headings.push(h);
                }
            } else {
                //Calculate the mercator pixels of the coordinates at zoom level 21.
                this._pixels = atlas.math.mercatorPositionsToPixels(this._positions, 21);

                for (var i = 1, len = this._pixels.length; i < len; i++) {
                    var d = getPixelDistance(this._pixels[i - 1], this._pixels[i]);
                    this._totalLength += d;
                    this._distances.push(d);

                    var h = getPixelHeading(this._pixels[i - 1], this._pixels[i]);
                    this._headings.push(h);
                }
            }

            if (options.captureMetadata && this._headings.length > 0) {
                this._shape.addProperty('_heading', this._headings[0]);
            }
        }
    }

    /**
     * Calculates the progress of an animation based on the current timestamp, start time and duration.
     * @param timestamp The current timestamp.
     * @param start The time the animation started.
     * @param duration The duration of the animation.
     */
    function getProgress(timestamp: number, start: number, duration: number): number {
        return Math.max(Math.min((timestamp - start) / duration, 1), 0);
    }

    function getDimensions(coords): number {
        if (coords && Array.isArray(coords) && coords.length > 0) {
            if (typeof coords[0] === 'number') {
                return 0; //Point
            } else if (Array.isArray(coords[0]) && coords[0].length > 0) {
                if (typeof coords[0][0] === 'number') {
                    return 1; //MultiPoint or Linestring
                } else if (Array.isArray(coords[0][0]) && coords[0][0].length > 0) {
                    if (typeof coords[0][0][0] === 'number') {
                        return 2; //polygon or multilinestring
                    } else if (Array.isArray(coords[0][0][0]) && coords[0][0][0].length > 0) {
                        if (typeof coords[0][0][0][0] === 'number') {
                            return 3; //MultiPolygon
                        }
                    }
                }
            }
        }

        return -1;
    }
    
    function getPixelDistance(px1: atlas.Pixel, px2: atlas.Pixel): number {
        return Math.sqrt(Math.pow(px1[0] - px2[0], 2) + Math.pow(px1[1] - px2[1], 2));
    }

    function getPixelDestination(origin: atlas.Pixel, heading: number, distance: number): atlas.Pixel {
        return [
            origin[0] + distance * Math.cos((heading - 90) * Math.PI / 180),
            origin[1] + distance * Math.sin((heading - 90) * Math.PI / 180),
        ];
    }

    function getPixelHeading(origin: atlas.Pixel, destination: atlas.Pixel): number {
        var dx = (destination[0] - origin[0]);
        var dy = (origin[1] - destination[1]);
        return ((5 / 2 * Math.PI) - Math.atan2(dy, dx)) * 180 / Math.PI % 360;
    }
}

/*
 //TODO: animation module work items

 - Allow looping of animations.
 - Add additional types of shape animations. 
    - translate line/polygons?
    - point drop in?
    - GPX animation?
    - route animation (points include speed and possibly acceleration)
    - Add property animation support for shapes and layers. https://gitlab.com/IvanSanchez/Leaflet.Path.DashFlow
    - tween/morph line/polygons on setCoordinates. https://greensock.com/morphSVG
    - Time series animations
    - Animated tile layers
    - Expanding/collapsing circle mask
    - Wrap map events and expose as playable animations.
 - Add easing examples, update animation options sample.
 - Events - onProgress, onEnd, on data point
 - Support for play, pause, stop for some animations.
 - Turn into a generic animation library. 
 - Consider reducing animated shapes classes down to a single class.
 - Expose easings as strings or function.
 - Consider removing type option from shape animation and automatically choose one based on the coordinate input.
 - Async animations for sequences of a set of animations. https://github.com/Igor-Vladyka/leaflet.motion
 - Add support for adding group animations into ply/playSeq/playInterval. Then we can mix an match to create long running complex combinations of animations.
 */