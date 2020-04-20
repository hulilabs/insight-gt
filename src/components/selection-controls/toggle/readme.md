# `<wc-toggle>` documentation

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `label` | String | true  | -  | the main label of the component, displayed on top of the options
| `error` | String | false | - | error message to be displayed in case of error
| `noTopSpacing` | Boolean | false | false | adds the modifier for removing the spacing between the label and the toggle buttons
| `disabled` | Boolean | false | false | determines the component's disabled state

### Slots

| Name | Description |
| --- | --- |
| `default` | expects a list of `wc-toggle-button` components |


## Examples

Declaring each `wc-toggle-button` component explicitly
``` html
<wc-toggle v-bind:label="myLabel">
    <wc-toggle-button v-model="someParentVar" custom-value="a" name="foo">A</wc-toggle-button>
    <wc-toggle-button v-model="someParentVar" custom-value="b" name="foo">B</wc-toggle-button>
    <wc-toggle-button v-model="someParentVar" custom-value="c" name="foo" disabled>C</wc-toggle-button>
</wc-toggle>
```

Using `v-for` to declare all `wc-toggle-button` components:
```html
<wc-toggle v-bind:label="myLabel">
    <wc-toggle-button
        v-for="item in items"
        v-model="someOtherParentVar"
        v-bind:custom-value="item.id"
        v-bind:disabled="!item.isEnabled"
        name="bar"><wc-icon slot="icon" icon-class="icon-language"></wc-icon>{{item.label}}
    </wc-toggle-button>
</wc-toggle>
```

# `<wc-toggle-button>` documentation

A collection of `wc-toggle-button` components make up a `wc-toggle`. Internally it uses the standard
checkbox input element to take care of state and most of the component's accessibility controls.

## API

### Props

@see [Selection Control Mixin](https://github.com/hulilabs/web-components/blob/master/src/web-components/selection-controls/mixins/selection-control_mixin.js)

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `value` | Array, Boolean, Number, Object, String | false | - | Corresponds to the `<input>` tag checked state. **Required for v-model support**
| `customValue` | String, Number | false | - | An alternative value for the checkbox `Boolean` checked state. **Will only work if the value associated with v-model is an Array**. It also supports `null` as a value
| `disabled` | Boolean | false | none | Determines the checkbox disabled state
| `name` | String | false | none | Checkbox `<input>` tag name

### Slots

| Name | Description |
| --- | --- |
| `icon` | optionally use this to add a icon using `wc-icon`. |
| `default` | generally used to enter the toggle button label |

### Events

### Methods

#### `isChecked()`

Returns `true` if the toggle button is checked, `false` otherwise

### Events

#### `input`

Fired when the toggle is selected. Sends the given value for the `customValue` prop as payload.

## Examples

``` html
<!-- Regular toggle button -->
<wc-toggle-button v-model="foo" custom-value="foo" name="foo">Bar</wc-toggle-button>

<!-- Disabled toggle button -->
<wc-toggle-button v-model="foo" custom-value="bar" name="foo" disabled>Bar</wc-toggle-button>

<!-- Toggle button with an icon -->
<wc-toggle-button v-model="foo" custom-value="qux" name="foo">
    <wc-icon slot="icon" icon-class="icon-hello-world"></wc-icon>Bar
</wc-toggle-button>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-toggle-button-border` | border style | `1px solid;` |
|`$wc-toggle-button-border-radius` | border radius | `3px;` |
|`$wc-toggle-button-height-mobile` | button height in mobile display | `40px;` |
|`$wc-toggle-button-height-desktop` | button height in desktop display | `32px;` |
|`$wc-toggle-button-min-width` | button min width | `40px;` |


## References

* https://elements.polymer-project.org/elements/iron-selector?view=demo:demo/index.html&active=iron-selector

### Design references

* Material guidelines : https://material.google.com/components/selection-controls.html#selection-controls-checkbox
* Guidelines : https://zpl.io/1fmokb

### Issues history

* Created on [HULI-1669](https://hulihealth.atlassian.net/browse/HULI-1669)
* Modified on [HULI-2019](https://hulihealth.atlassian.net/browse/HULI-2019): added `v-model` support to checkbox, radio-button and toggle components. Removed "smart" functionalities to radio-group and toggle (group) components. Updated docs.
