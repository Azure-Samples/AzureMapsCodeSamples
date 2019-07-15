# Animation Module

A library of map related animations. 

## Static methods

The following static methods are exposed on the `atlas.animations` namespace.

| Name | Return Type | Description |
|------|-------------|-------------|
| `drop(shapes: atlas.data.Point | atlas.data.Feature<atlas.data.Point, any>; | atlas.Shape | (atlas.data.Point | atlas.data.Featuree<atlas.data.Point, any> | atlas.Shape)[], dataSource: atlas.source.DataSource, height?: number, options?: DropAnimationOptions)` | PlayableAnimation | Adds an offset array property to point shapes and animates it's y value to simulate dropping. Use with a symbol layer with the icon/text offset property set to \['get', 'offset'\]. |
| moveAlongPath(shape: atlas.Shape, path?: atlas.data.Position\[\] \| atlas.data.LineString \| atlas.Shape, options?: BaseAnimationOptions) | PlayableAnimation | Animates a Point shape along a path.  |
| play(animations: PlayableAnimation\[\], options?: BaseAnimationOptions) | GroupAnimation | Plays an array of animations at the same time. |
| playInterval(animations: PlayableAnimation\[\], interval?: number, options?: BaseAnimationOptions) | GroupAnimation | Plays an array of animations one by one based on an interval.  |
| playSeq(animations: PlayableAnimation\[\], options?: BaseAnimationOptions) | GroupAnimation | Plays an array of animations sequentially. |
| setCoordinates(shape: atlas.Shape, newCoordinates: atlas.data.Position \| atlas.data.Position\[\] \| atlas.data.Position\[\]\[\] \| atlas.data.Position\[\]\[\]\[\], options?: BaseAnimationOptions) | PlayableAnimation | Animates the update of coordinates on a shape. Shapes will stay the same type. Currently supports Point shapes. |
| snakeline(shape: atlas.Shape, options?: BaseAnimationOptions) | PlayableAnimation | Animates the path of a LineString. |

## Classes and Option interfaces

The following classes and option interfaces are exposed on the `atlas.animations` namespace.

### GroupAnimation class

Group animation handler.

**Methods**

| Name | Return Type | Description |
|------|-------------|-------------|
| cancel() |  | When called, will prevent any animation that hasn't already started in the group animation from starting. |
| stop() |  | Stops all animations and jumps to the final state of each animation. |


### PlayableAnimation class

 An abstract class which defines an animation that supports a play function.

**Methods**

| Name | Return Type | Description |
|------|-------------|-------------|
| play(options?: BaseAnimationOptions) |  | Plays the animation. |
| stop() |  |  Stops the animation and jumps to the final state of the animation. |

### BaseAnimationOptions object

**Properties**

| Name | Type | Description |
|------|------|-------------|
| autoPlay | boolean | Specifies if the animation should start automatically or wait for the play function to be called. |
| duration | number | The duration of the animation in ms. Default: 100 ms |
| easing | string | The easing of the animaiton. |

## Easings

The following easing names can be used with the animation library.

| Name | Description |
|------|-------------|
| linear | linear easing function. |
| easeInSine | Slight acceleration from zero to full speed. |
| easeOutSine | Slight deceleration at the end. |
| easeInOutSine | Slight acceleration at beginning and slight deceleration at end. |
| easeInQuad | Accelerating from zero velocity. |
| easeOutQuad | Decelerating to zero velocity. |
| easeInOutQuad | Acceleration until halfway, then deceleration. |
| easeInCubic | Accelerating from zero velocity. |
| easeOutCubic | Decelerating to zero velocity. |
| easeInOutCubic | Acceleration until halfway, then deceleration. |
| easeInQuart | Accelerating from zero velocity. |
| easeOutQuart | Decelerating to zero velocity. |
| easeInOutQuart | Acceleration until halfway, then deceleration. |
| easeInQuint | Accelerating from zero velocity. |
| easeOutQuint | Decelerating to zero velocity. |
| easeInOutQuint | Acceleration until halfway, then deceleration. |
| easeInExpo | Accelerate exponentially until finish. |
| easeOutExpo | Initial exponential acceleration slowing to stop. |
| easeInOutExpo | Exponential acceleration and deceleration. |
| easeInCirc | Increasing velocity until stop. |
| easeOutCirc | Start fast, decreasing velocity until stop. |
| easeInOutCirc | Fast increase in velocity, fast decrease in velocity. |
| easeInBack | Slow movement backwards then fast snap to finish.  |
| easeOutBack | Fast snap to backwards point then slow resolve to finish. |
| easeInOutBack | Slow movement backwards, fast snap to past finish, slow resolve to finish. |
| easeInElastic | Bounces slowly then quickly to finish. |
| easeOutElastic | Fast acceleration, bounces to zero. |
| easeInOutElastic | Slow start and end, two bounces sandwich a fast motion. |
| easeOutBounce | Bounce to completion. |
| easeInBounce | Bounce increasing in velocity until completion. |
| easeInOutBounce | Bounce in and bounce out. |


## TODO - Roadmap

 - Allow looping of animations.
 - Add additional types of shape animations. 
    - translate line/polygons?
    - point drop in?
    - GPX animation?
    - route animation (points include speed and possibly acceleration)
    - Add property animation support for shapes and layers. 
    - tween/morph line/polygons on setCoordinates. 
	- Time series animations
    - Animated tile layers
	- Expanding/collapsing circle mask
 - Add easing examples, update animation options sample.
 - Events - onProgress, onEnd, on data point
 - Support for play, pause, stop for some animations.
 - Turn into a generic animation library. 
 - Consider reducing animated shapes classes down to a single class.
 - Expose easings as strings or function.
 - Consider removing type option from shape animation and automatically choose one based on the coordinate input.
 - Async animations for sequences of a set of animations. 