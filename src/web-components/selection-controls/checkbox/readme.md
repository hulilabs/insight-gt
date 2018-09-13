# `<wc-checkbox>` documentation

A checkbox `<input>`, follows material guidelines.
- This component uses an `<input>` tag, so it can handle TAB focus and SPACE bar input
- This component will also change its selected state if the ENTER key is pressed when focused
- This component uses enhanced [selection control focus behavior](https://github.com/hulilabs/web-components/blob/master/src/web-components/behaviors/a11y/selection-control-focus/readme.md), which means that will visually display a focus state when focused with the keyboard, but not when set/unset

## API

### Props

@see [Selection Control Mixin](https://github.com/hulilabs/web-components/blob/master/src/web-components/selection-controls/mixins/selection-control_mixin.js)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `value` | Array, Boolean, Number, Object, String | false | - | Corresponds to the `<input>` tag checked state. **Required for v-model support**
| `customValue` | String, Number, Object | false | - | An alternative value for the checkbox `Boolean` checked state. **Will only work if the value associated with v-model is an Array**. It also supports `null` as a value
| `disabled` | Boolean | false | none | Determines the checkbox disabled state
| `name` | String | false | none | Checkbox `<input>` tag name
| `color` | String | false | none | Customizes the background and border color for the checkbox

### Slots

| Name | Description |
| --- | --- |
| `default` | generally used to enter radio button label |

### Methods

#### `isChecked()`

Returns `true` if checked, `false` otherwise

### Events

#### `input`

Fired when the checkbox changes. The event's payload will vary according to the value associated with `v-model`.

* When `v-model` is related to a **Boolean** value: `true` or `false` will be returned, according to the checked state
* When `v-model` is related to an **Array** value and the checkbox **is checked**: the payload will contain the v-model's array value with a new element corresponding to the component's `customValue` prop
* When `v-model` is related to an **Array** value and the checkbox **is unchecked**: the payload will contain the v-model's array value without the `customValue` prop

## Examples

``` html
<!-- Named checkbox with a Boolean v-model -->
<wc-checkbox v-model="someBooleanValue" name="test">
    boolean checkbox
</wc-checkbox>

<!-- Checkbox with an Array v-model and a non-boolean alternative value -->
<wc-checkbox v-model="someArrayValue" alt-value="cool">
    non-boolean checkbox
</wc-checkbox>

<!-- Disabled boolean checkbox -->
<wc-checkbox v-model="someDisabledValue" disabled>
    boolean checkbox
</wc-checkbox>

<!-- Boolean checkbox with a default checked state -->
<wc-checkbox v-model="booleanCheckedValue">
    boolean checkbox default state
</wc-checkbox>

<!-- Non-Boolean checkbox with a default checked state -->
<wc-checkbox v-model="arrayCheckedValue" alt-value="example">
    non-boolean checkbox default state
</wc-checkbox>

<!-- Checkbox with custom color -->
<wc-checkbox v-model="someBooleanValue" color="red">
    boolean checkbox with custom color
</wc-checkbox>
```

```javascript
{
    data : function() {
        return {
            someBooleanValue : false,
            someArrayValue : [],
            booleanCheckedValue : true,
            arrayCheckedValue : ['example']
        };
    }
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-checkbox-size` | checkbox height and width | 24px
| `$wc-checkbox-border-size` | border size | 2px
| `$wc-checkbox-border-radius` | border radius | 4px
| `$wc-checkbox-label-margin` | space between checkbox input and clickable label text in list configuration | 32px
| `$wc-checkbox-label-row-margin` | space between checkbox input and clickable label text in row configuration | 24px
| `$wc-checkbox-scale-duration` | time to grow from 0x to 1x when set/unset | 0.2s
| `$wc-checkbox-color-transition-duration` | color change animation time when set/unset | 0.1s

## References

### Design references

* Material guidelines : https://material.google.com/components/selection-controls.html
* Guidelines : https://zpl.io/22dn8n

### Examples in other libraries

* http://www.material-ui.com/#/components/checkbox

### Issues history

* Created on [HULI-1352](https://hulihealth.atlassian.net/browse/HULI-1352)
* Modified on [HULI-1742](https://hulihealth.atlassian.net/browse/HULI-1742): added horizontal layout
* Modified on [HULI-2019](https://hulihealth.atlassian.net/browse/HULI-2019): added `v-model` support to checkbox, radio-button and toggle components. Removed "smart" functionalities to radio-group and toggle (group) components. Updated docs.
