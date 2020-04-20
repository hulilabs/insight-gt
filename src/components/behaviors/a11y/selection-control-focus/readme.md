# Input control focus behavior documentation
Enhances focus management for input controls (checkbox, radio button, switch). The focus will behave like this:

* If you CHANGE the control state, the focus will dissaper
    * This is achieved by subscribing to the component's (not the input tag) CHANGE event. i.e. is a requirement for the component to expose a CHANGE event
* If you FOCUS the control using he TAB button, it will display the focus state

## Requirements
* The bound component must trigger a CHANGE event whenever its value changes, so this behavior is able to dismiss the focus in that case
* The bound component must include a focus manager, like `ripple_component`, which includes `show` and `hide` methods on its API

## Side effects
There will be handlers attached to events:
* `Component#change`
* `Component[<input> element]#blur`
* `Component[<input> element]#focus`

## API reference
### ButtonFocusBehavior#constructor
Initialization which expects the following injected dependencies:

| Name | Type | Description
| --- | --- | ---
| inputElement | Element | component's <input> tag
| focusManagerElement | Object | has `show` and `hide` methods to control component's focus visibility

### ButtonFocusBehavior#bind
Main API method to add the effect to a component, expected arguments:

| Name | Type | Description
| --- | --- | ---
| component | Vue | Vue component to apply behavior to
| settings.changeEvent | String | event triggered by the component when its value changes

## Usage example

```javascript
// somewhere inside a component's implementation

data : function() {
    return {
        events : {
            ON_CHANGE : 'change'
        }
    };
},

methods : {
    _notifyChange : function() {
        this.$emit(this.events.ON_CHANGE, /* event payload, not relevant for this behavior */);
    }

},

mounted : function() {
    var focusBehavior = new InputControlFocusBehavior(this.$refs.input, this.$refs.ripple);
    focusBehavior.bind(this, {changeEvent : this.events.ON_CHANGE});
}


```

## References
* https://github.com/PolymerElements/iron-a11y-keys-behavior
* https://elements.polymer-project.org/elements/iron-behaviors
