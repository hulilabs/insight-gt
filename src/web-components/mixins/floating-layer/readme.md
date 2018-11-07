# Floating layer mixin documentation

This mixin allows a better integration of floating behavior options and the attached component properties. Think of this like interface `IFloatingLayerComponent`

See behavior [Floating Layer](https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/floating-layer)

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| floatingConnector | Boolean | false | false | enables connector (usually an arrow between trigger origin and floating block)
| floatingDirection | String | false | null | setup positioning to direction logic : up, right, down, left
| floatingOffset | Number | false | 0 | spacing between trigger origin and floating block
| floatingOrigin | String | false | null | defines floating origin manually
| floatingSmart | Boolean | false | false | setup positioning to smart logic : figure out best placement
| triggerEvent | String | false | none | define main trigger event : click, hover, none
| triggerOrigin | String | false | null | define trigger origin via prop manually

To provide a better support for component-based customizations, special computed properties are detected to enhance adding custom logic for behavior setup. Just add `floatingLayer` prefix to any **prop**. Example:

| Prop | Computed prop
| --- | ---
| floatingConnector | floatingLayerFloatingConnector
| triggerOrigin | floatingLayerTriggerOrigin

Hook handlers are not accesible via props, computed props or setup options.

### Methods

#### `bindFloatingLayerBehavior(Object config)`

Configuration parameters:

| Param | Type | Note
| ---- | --- | --- | ---
| computedStateKey | String | computer property for binding active state
| floatingConnector | Boolean | enable connector element
| floatingDirection | String | setup positiong based on direction
| floatingElement | HTMLElement | floating block element
| floatingElementReferenceKey | String | floating block element reference key for reactive binding
| floatingOffset | Number | pixels offset between the floating block and trigger
| floatingOrigin | Origin | floating origin, see FloatingLayerBehavior.ORIGIN
| floatingPositioner | HTMLElement | positioner element
| floatingSmart | Boolean | setup smart positioning
| triggerElement | HTMLElement | trigger element
| triggerEvent | String | trigger event, see FloatingLayerBehavior.EVENT
| triggerOrigin | Origin | trigger origin, see FloatingLayerBehavior.ORIGIN

No parameter is required.

**IMPORTANT!** Setup definition priority:
1. Prop
2. Computed prop
3. Provided config

## Implementation

* Always define a computed variable to bind the state (ie. `floatingLayerState`)
* Trigger origin *must* be set either through a prop or by calling the floating layer behavior setter **`setTriggerOrigin`**

## Usage example

```javascript
<!-- Just add this behavior as a mixin in the component definition -->
var ComponentDefinition = Vue.extend({
    mixins : [FloatingLayerMixin],
    mounted : function() {
        ...
        this.bindFloatingLayerBehavior({
            computedStateKey : 'floatingLayerState',
            ...
        });
    }
});
```