# `<wc-switch>` documentation


## API

### Props

@see [Selection Control Mixin](https://github.com/hulilabs/web-components/blob/master/src/web-components/selection-controls/mixins/selection-control_mixin.js)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `value` | Array, Boolean, Number, Object, String | false | - | Corresponds to the `<input>` tag checked state. **Required for v-model support**
| `customValue` | String, Number, Object | false | - | An alternative value for the Switch component `Boolean` checked state. It also supports `null` as a value
| `disabled` | Boolean | false | none | Determines the switch disabled state
| `name` | String | false | none | Switch's `<input>` tag name

### Slots

| Name | Description |
| --- | --- |
| `default` | Switch label content |

### Methods

#### `isChecked()`

Returns `true` if checked, `false` otherwise

### Events

#### `input`

Fired when the switch changes. Sends the given value for the `customValue` prop as payload.

## Examples

``` html
<wc-switch v-model="switchValue" name="plus"> 
    Plus account
</wc-switch>
<wc-switch v-model="accountPlus" name="account" disabled> 
    Exclusive content
</wc-switch>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-switch-slide-duration` | Slide animation duration  | `.08s` |
|`$wc-switch-thumb-size` | Thumb size | `24px` |
|`$wc-switch-thumb-on-color` | Thumb color on check | `$wc-secondary-color` |
|`$wc-switch-thumb-color` | Thumb color off | `$wc-background-color` |
|`$wc-switch-thumb-disabled-color` | Thumb color disabled | `#B0BEC5` |
|`$wc-switch-track-width` | Track width | `48px` |
|`$wc-switch-track-heigth` | Track heigth | `12px` |
|`$wc-switch-track-on-color` | Track color on check | `rgba( $wc-secondary-color, .3 )` |
|`$wc-switch-track-color` | Track color off | `rgba( $wc-raised-button-disabled-color, .54 )` |
|`$wc-switch-track-disabled-color` | Track color disabled | `rgba( $wc-raised-button-disabled-color, .15 )` |

## References

### Design references

* Material guidelines : https://material.google.com/components/selection-controls.html
* Guidelines : https://zpl.io/V40OyRN

### Examples in other libraries

* https://www.webcomponents.org/element/@polymer/paper-toggle-button/demo/demo/index.html

### Issues history

* Created on [GROW-367](https://hulihealth.atlassian.net/browse/HULI-367)
