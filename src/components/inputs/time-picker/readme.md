# `<wc-time-picker>` documentation

A simple 12h format time picker with native support. Its native version consists on an input type time.

## Implementation pending

* Don't lose focus when the input is clicked
* Replacement of current textfield type time with a custom logic component for the manual input of the time value

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| ~~`step`~~* | ~~Number~~ | ~~false~~ | ~~null~~ | ~~Defines the multiple of a **number** input's value~~

\* **The specification for this prop is overwritten by the datepicker**

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

Own props:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `hoursLabel` | String | true | - | Label for display in the dialog's header for the hours selector
| `minutesLabel` | String | true | - | Label for display in the dialog's header for the minutes selector
| `native` | Boolean | false | false | If the time picker should be a native input type time (useful for mobile implementations)
| `step` | Number  | false | 1 | Steps that defines the minutes intervals. E.g.: 00, 05, 10

### Methods

#### `setValue(String value, Boolean shouldTriggerState)`

Sets the time picker's value

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `value` | String | true | Must be in the following format: **HH:mm** (hours:minutes)
| `shouldTriggerState` | Boolean | false | If the time picker should trigger an event for notifying its value changes


### Events

* #### `input`

Fired when the hour, minutes and meridian are selected or when the input is filled. Sends a 24h format string representation of the hour.

**This event is required by `v-model` for handling parent-child interaction**

* #### `focus`

Gained when the time picker's input gains focus or when the dialog is opened. Sends a 24h format string representation of the hour.

* #### `blur`

Gained when the time picker's input loses focus or when the dialog is closed. Sends a 24h format string representation of the hour.


## Examples

``` html
<!-- Simple time picker -->
<wc-time-picker hours-label="Hours" minutes-label="Minutes" v-model="someParentVar"></wc-time-picker>

<!-- Simple time with label and 10 minutes step -->
<wc-time-picker hours-label="Hours" minutes-label="Minutes" label="Time" v-bind:step="10" v-model="someParentVar"></wc-time-picker>

```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-time-picker-background-color` | Dialog's background color | $wc-primary-color
| `$wc-time-picker-option-background-color-highlighted` | Option's background color when its hovered | rgba(0, 0, 0, 0.1)
| `$wc-time-picker-color-active` | Font color for a selected option | $wc-secondary-color
| `$wc-time-picker-color-active-dark` | Font color for a selected option that is also being hovered | $wc-secondary-color-dark
| `$wc-time-picker-width` | Timepicker's maximum width  | 318px

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/pickers.html#
* Guidelines : https://zpl.io/Zf9poN

### Examples in other libraries

* http://codepen.io/alenaksu/pen/eNzbrZ
* https://ripjar.github.io/material-datetime-picker/

### Issues history

* Created on [HULI-1789](https://hulihealth.atlassian.net/browse/HULI-1789)
