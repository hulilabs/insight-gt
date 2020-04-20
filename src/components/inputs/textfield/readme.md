# `<wc-textfield>` documentation

Corresponds to the material design's textfields. Supports the different types of input defined by HTML: `date`, `email`,  `hidden`,  `password`, `phone`, `text`, etc.

## Implementation pending
* Handling of the autocorrect feature
* Handling of the autocapitalize feature

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `clear` | Boolean | false | false | If the textfield should have a clear button for resetting the input's value
| `inputClass` | String | false | empty | Inject a custom class to the input element
| `hideInputHighlighter` | Boolean | false | false | Whether or not the input highlighter should be shown
| `signed` | Boolean | false | false | Use along with `type="number"` for allowing to enter negative values
| `pattern` | RegExp | false | null | Regular expression to be tested before allowing user input
| `trim` | Boolean | false | true | Determines whether or not the textfield must remove leading and trailing white spaces of the value

### Slots

@see [InputContainer](https://github.com/hulilabs/web-components/tree/master/src/web-components/inputs/input-container#slots)

### Methods

#### `getValue()`

Retrieves the current textfield's value

#### `setValue(String value, Boolean shouldTriggerState)`

Sets the value of the textfield. If the textfield is used with v-model, it will update the parent's model.

#### `focus()`

Sets the focus state of the input and the input container components.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `shouldTriggerState` | Boolean | false | If the textfield should trigger the ON_INPUT event for notifying its state changes

### Events

#### `blur` : String

Fired when the textfield loses focus. It's handled **after** the `<input-container>`'s ON_BLUR event is triggered. Provides the current value as payload.

If an action was given in the textfield's "action" named slot, the blur event won't happen (the input won't lose focus) and the ON_ACTION event will be triggered. If the `clear` prop is given, the textfield's value will be reset.

#### `focus` : String

Fired when the textfield gains focus. It's handled **after** the `<input-container>`'s ON_FOCUS event is triggered. Provides the current value as payload.

#### `textfield-action` : String

Fired when content is sent via "action" slot. Provides the current value as payload.

#### `input` : String

Fired when the textfield input's value is changed. **This event is required by `v-model` for handling the interaction between parent and textfield**

#### `invalid` : String

Fired when the textfield input's value is invalid. Mostly fired on copy-paste.

## Examples

``` html
<!-- A very simple textfield -->
<wc-textfield v-model="parentVariable"></wc-textfield>

<!-- A textfield with clear action-->
<wc-textfield v-model="parentVariable" clear></wc-textfield>

<!-- A textfield with floating label -->
<wc-textfield v-model="parentVariable" label="Foo" floating-label></wc-textfield>

<!-- A textfield with placeholder -->
<wc-textfield v-model="parentVariable" placeholder="Foo"></wc-textfield>

<!-- A textfield with label and placeholder -->
<wc-textfield v-model="parentVariable" label="Foo" placeholder="Bar"></wc-textfield>

<!-- A textfield with hint text -->
<wc-textfield v-model="parentVariable" hint-text="Foo"></wc-textfield>

<!-- A textfield with character counter -->
<wc-textfield v-model="parentVariable" char-counter></wc-textfield>

<!-- A textfield with a suffix -->
<wc-textfield v-model="parentVariable">
    <span slot="suffix">Bar</span>
</wc-textfield>

<!-- A textfield with an action -->
<wc-textfield v-model="parentVariable" v-on:textfield-action="function() { alert('action clicked'); }">
    <wc-icon icon-class="icon-angle-down" slot="action"></wc-icon>
</wc-textfield>
```

### Modifiers

@see [InputContainer Modifiers](https://github.com/hulilabs/web-components/tree/master/src/web-components/inputs/input-container#modifiers)

## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Examples in other libraries

* http://posva.net/vue-mdl/#!/textfields
* http://react-toolbox.com/#/components/input
* http://www.material-ui.com/#/components/text-field
* https://elements.polymer-project.org/elements/paper-input
* https://marcosmoura.github.io/vue-material/#/components/input

### Issues history

* Created on [HULI-1504](https://hulihealth.atlassian.net/browse/HULI-1504)
* Updated on [HULI-1676](https://hulihealth.atlassian.net/browse/HULI-1676): Added floating label, error state, character counter and required state
* Updated on [HULI-1731](https://hulihealth.atlassian.net/browse/HULI-1731): Refactoring the textfield logic for working with a input-container component
* Updated on [HULI-1705](https://hulihealth.atlassian.net/browse/HULI-1705): Adding support for `headline` and `title` font sizes and updating docs
* Updated on [HULI-2482](https://hulihealth.atlassian.net/browse/HULI-2482): Adding input exceptions for `type="number"` and `signed` prop
* Updated on [HULI-2768](https://hulihealth.atlassian.net/browse/HULI-2768): Added `pattern` prop
* Updated on [HULI-3328](https://hulihealth.atlassian.net/browse/HULI-3328): Added `trim` prop