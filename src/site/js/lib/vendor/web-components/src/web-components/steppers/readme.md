# `<wc-stepper>` documentation

Terciary navigation and visual hint for indicating in which section of the page the user is currently in.

It is not recommended to use this component on *mobile*.

## API

### Props

These are the props for the stepper component:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `steps` | Array | true | - | An array containing objects with the format: { id : {String}, tooltip: {String}, isEnabled : {Boolean} }.
| `active` | String | false | null | Id of the active step's object definition

The following is the definition of the "props" of each individual step dot that came within the **steps** prop:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `id` | String | true | - | "Unique" identification of the step within the scope of the stepper component. **There can't be duplicated ids.**
| `tooltip` | String | true | - | Text for the step's tooltip
| `isEnabled` | Boolean | true | - | If the step should be rendered and available for display and interaction.

### Methods

#### `setActive(String newStep)`
Sets as the currently active step, the one which __id__ from its definition object is equal to the __newStep__ argument.

Param | Type | Required
---- | --- | ---
`newStep` | String | true

### Events

#### 'change'

The Stepper component will emit the 'change' event every time that a dot element (that represents a step) is clicked. The responsibility of handling this 'change' event is left to the parent.

Usage example:

``` html
    <!-- Parent template: -->
    <wc-stepper v-bind:steps="steps" v-on:change="stepChangedHandler"></wc-stepper>
```

``` javascript
    <!-- Parent component: -->
    stepChangedHandler : function(payload) {
        this.state.currentStep = payload.active;
    }
```

##### Event payload or parameters:
``` json
{
    active : {String}
}
```

## Examples

``` html
<!-- Normal definition of a stepper component -->
<wc-stepper v-bind:steps="sectionSteps" v-bind:active="currentStep"></wc-stepper>
```

``` javascript
// Example definition of the properties passed to a stepper
data : function() {
    return {
        state : {
            currentStep : 'foo',
            sectionSteps : [
                {
                    id : 'foo',
                    tooltip : 'Foo',
                    isEnabled : true
                },
                {
                    // Example definition of a step that shouldn't be rendered in the stepper
                    id : 'bar',
                    tooltip : 'Bar',
                    isEnabled : false
                }
            ]
        }
    }
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-stepper-dot-size` | size of the dots that are representing steps | 8px
|`$wc-stepper-dot-padding` | inner padding of the dot so its clickable area is increased | 4px
|`$wc-stepper-dot-spacing` | spacing between the dots represented by a margin-top | 8px
|`$wc-stepper-dot-background-color` | dot's initial state background color  | `$wc-typoicon-disabled-dark`
|`$wc-stepper-dot-background-color-active` | dot's active state background color | `$wc-secondary-color`
|`$wc-stepper-dot-background-color-hover` | dot's hover state background color | `$wc-typoicon-secondary-dark`

## References

### Design references

* Material guidelines : https://material.google.com/components/steppers.html
* Guidelines : https://zpl.io/24bLhD

### Examples in other libraries

* http://www.material-ui.com/#/components/stepper

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1514
