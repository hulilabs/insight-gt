# `<wc-radio-button>` documentation

A radio-button `<input>`, follows material guidelines.
- This component uses an `<input>` tag, so it can handle TAB focus and SPACE bar input
- This component will also change its selected state if the ENTER key is pressed when focused
- This component uses enhanced [selection control focus behavior](https://github.com/hulilabs/web-components/blob/master/src/web-components/behaviors/a11y/selection-control-focus/readme.md), which means that will visually display a focus state when focused with the TAB key, but not when set/unset

## API

### Props

@see [Selection Control Mixin](https://github.com/hulilabs/web-components/blob/master/src/web-components/selection-controls/mixins/selection-control_mixin.js)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `value` | Array, Boolean, Number, Object, String | false | - | Corresponds to the `<input>` tag checked state. **Required for v-model support**
| `customValue` | String, Number, Object | false | - | An alternative value for the radio-button `Boolean` checked state. It also supports `null` as a value
| `disabled` | Boolean | false | none | Determines the radio button's disabled state
| `name` | String | false | none | Radio button's `<input>` tag name

### Slots

| Name | Description |
| --- | --- |
| `default` | generally used to enter radio button label |

### Methods

#### `isChecked()`

Returns `true` if checked, `false` otherwise

### Events

#### `input`

Fired when the radio button changes. Sends the given value for the `customValue` prop as payload.

## Examples

``` html
<wc-radio-button v-model="parentVar" custom-value="1" name="aname">
    radio-button 1
</wc-radio-button>
<wc-radio-button v-model="parentVar" custom-value="2" name="aname">
    radio-button 2
</wc-radio-button>
<wc-radio-button v-model="parentVar" custom-value="3" name="aname" disabled>
    disabled radio-button 3
</wc-radio-button>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-radio-button-size` | radio button height and width | 24px;
| `$wc-radio-button-border-size` | border size | 2px;
| `$wc-radio-button-label-margin-list` | space between radio-button input and clickable label text when in list configuration | 32px;
| `$wc-radio-button-label-margin-row` | space between radio-button input and clickable label text when in row configuration | 24px;|
| `$wc-radio-button-scale-duration` | time to grow from 0x to 1x when set/unset | 0.2s;
| `$wc-radio-button-color-transition-duration` | color change animation time when set/unset | 0.1s;

## References

### Design references

* Material guidelines : https://material.google.com/components/selection-controls.html
* Guidelines : https://zpl.io/22dn8n

### Examples in other libraries

* http://www.material-ui.com/#/components/radio-button
* https://elements.polymer-project.org/elements/paper-radio-button?view=demo:demo/index.html&active=paper-radio-button

### Issues history

* Created on [HULI-1353](https://hulihealth.atlassian.net/browse/HULI-1353)
* Modified on [HULI-1742](https://hulihealth.atlassian.net/browse/HULI-1742): added horizontal layout
* Modified on [HULI-2019](https://hulihealth.atlassian.net/browse/HULI-2019): added `v-model` support to checkbox, radio-button and toggle components. Removed "smart" functionalities to radio-group and toggle (group) components. Updated docs.
