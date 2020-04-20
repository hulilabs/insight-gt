# Floating layer behavior documentation

Handles element positioning relative to its trigger block.

There is a mixin for easier implementation: [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

## Positioning

Provides 3 ways to define positioning logic:
* __Smart__: use expensive calculations to determine the best alignment inside viewport using current position on trigger
* __Direction__: calculates only on one axis the best alignment inside viewport using current position on trigger
* __Manual__: define floating origin to fixed the matching origins, no calculations over the viewport area done

## API

### `FloatingLayerBehavior#bind()`

Bind floating layer behavior to a component. Returns the instance of floating layer behavior for customization and unbind

| Name | Type | Description
| --- | --- | ---
| component | VueComponent | bound component
| computedStateKey | String | bound component computed property state key
| triggerElement | HTMLElement | element that opens the floating block
| floatingElement | HTMLElement | floating block element

### `FloatingLayerBehavior#unbind()`

Unbind floating layer behavior from a component

Avoid using unbind, it should only be used when any of the constructor arguments changes
Unbind its a bad practice if it could solved by setter+reposition methods

| Name | Type | Description
| --- | --- | ---
| floatingLayerBehavior | FloatingLayer | behavior instance

### FloatingLayerBehavior.DIRECTION

Opening animation direction : **`UP`** | **`RIGHT`** | **`DOWN`** | **`LEFT`**
```
                      [x-axis]

             up-left~   UP    ~up-right
                      \  |  /
                       \ | /
  [y-axis]     LEFT <--- x --> RIGHT
                       / | \
                      /  |  \
           down-left~  DOWN   ~down-right
```

### FloatingLayerBehavior.EVENT

Object of supported trigger events: **`CLICK`** | **`HOVER`** | **`NONE`** (default)

### FloatingLayerBehavior.HOOK

Object of supported hooks:
- AFTER_VERTICAL_POSITION_CALCULATED
- AFTER_HORIZONTAL_POSITION_CALCULATED

Currently only one handler per hook is supported.

### FloatingLayerBehavior.ORIGIN

Object of supported origins ( **`{y-axis}_{x-axis}`** combinations ) for trigger and floating blocks (ie. `TOP_LEFT`)
```
                          [x-axis]
                    left   center  right
                  top x      x      x
                        -----------
     [y-axis]  middle x |         | x
                        -----------
               bottom x      x      x
```

### Instance Methods

#### `close()`

Hides the floating layer

#### `fitsInsideViewportAxis()`

Checks if an element fits inside a viewport axis considering the provided dimensions. Very useful for hook validations

| Name | Type | Description
| --- | --- | ---
| calculatedPosition | Number | posible position for the axis relative to its parent
| floatingDim | Number | width (x) or height (y)
| parentViewportDim | Number | parent element viewport position
| viewportDim | Number | viewport width (x) or height (y)

#### `onHook(String hookName, Function callback)`

Set hook callback handler. See FloatingLayerBehavior.HOOK

#### `open()`

Shows the floating layer

#### `reposition()`

Reposition floating block

#### `resolve()`

Resolve current state visibility. Force visibility after the behavior setup is completed

#### `setBlockOrigin(Origin origin)`

Sets the floating block origin (manual setup)

#### `setDirection(String direction)`

Sets opening direction (direction setup)

#### `setOffset(Number offset)`

Sets offset between trigger origin and floating block

#### `setSmart(Boolean smart)`

Sets the smart positioning (smart setup)

#### `setTriggerOrigin(Origin origin)`

Sets trigger origin

#### `toggle()`

Toggle between close (hidden) or open (visible) states

#### `toggleConnector(Boolean toggle)`

Toggles connector usage and visibility

#### `triggerOn(String eventName)`

Sets the main trigger event. See FloatingLayerBehavior.EVENT

#### `unbind()`

Removes the event listeners and the CSS classes that were attached to the trigger element

## Implementation

* `<body>` or page wrapper must have `position:relative`
* Do not use inside `tables`. There is [known bug](https://www.w3.org/TR/CSS21/visuren.html#propdef-position) related to the relative positioning within `tables`
* Floating block is offset **20px** from the matching point when the connector is enabled
* Automatic alignments (direction and smart) use a **5px** thresholds off the viewport

## Usage example

```javascript
// Instantiate behavior
var behavior = FloatingLayerBehavior.bind(this, 'floatingLayerState', this.$refs.trigger, { element : this.$el });

// Always set trigger event, origin and offset (basic setup)
behavior.triggerOn(FloatingLayerBehavior.EVENT.CLICK)
        .setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT)
        .setOffset(10)
        .setSmart(true)
        .toggleConnector(true);

behavior.onHook(FloatingLayerBehavior.HOOK.AFTER_VERTICAL_POSITION_CALCULATED, function(top) {
    return top;
});

// Notify setup is completed
// This will also recheck active state (computed state) and handle initial visibility
behavior.resolve();
```

## References

### Issues history

* Created on [HULI-1357](https://hulihealth.atlassian.net/browse/HULI-1357)
* Improvements done at [HULI-1712](https://hulihealth.atlassian.net/browse/HULI-1712)
* Hooks added on [HULI-1797](https://hulihealth.atlassian.net/browse/HULI-1797)