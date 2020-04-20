# `<wc-textarea>` documentation

`wc-textarea` uses `wc-input-container` therefore, most of the modifiers in `wc-input-container` are available.

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

Own props:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `mobile` | Boolean | false | false | When true the textarea component will be rendered with mobile contraints. Currently, only the `focusHint` is affected.
| `focusHint` | String | false | - | This hint will be displayed when the component is focused. If a normal hint exists then it is temporarily replaced while the component has the focus.
| `trim` | Boolean | false | true | Determines whether or not the textfield must remove leading and trailing white spaces of the value
| `classObject` | Object | false | ``` { inputContainer : '', inputContainerClass : '' } ``` | Adds custom classes to the inputContainer and the input elements of the textarea.

### Methods

#### `getValue():String`

Retrieves the current textarea's value

#### `setValue(String value, Boolean shouldTriggerState)`

Sets the value of the textarea. If the textarea is used with v-model, it will update the parent's model.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| value | String, Number | true | -
| shouldTriggerState | Boolean | false | If the textarea should trigger the ON_INPUT event for notifying its state changes

### Events

#### `blur` : String

Fired when the textarea loses focus. It's handled **after** the `<input-container>`'s ON_BLUR event is triggered. Provides the current value as payload.

#### `focus` : String

Fired when the textarea gains focus. It's handled **after** the `<input-container>`'s ON_FOCUS event is triggered. Provides the current value as payload.

## Examples

``` html
<!-- A very simple textarea -->
<wc-textarea v-model="parentVariable"></wc-textarea>

<!-- A textarea with floating label -->
<wc-textarea v-model="parentVariable" floating-label></wc-textarea>

<!-- A textarea with placeholder -->
<wc-textarea v-model="parentVariable" placeholder="Foo"></wc-textarea>

<!-- A textarea with label and placeholder -->
<wc-textarea v-model="parentVariable" label="Foo" placeholder="Bar"></wc-textarea>

<!-- A textarea with hint text -->
<wc-textarea v-model="parentVariable" hint-text="Foo"></wc-textarea>

<!-- A textarea with character counter -->
<wc-textarea v-model="parentVariable" char-counter></wc-textarea>
```

## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Examples in other libraries

* https://elements.polymer-project.org/elements/paper-input

### Issues history

* Created on [HULI-1623](https://hulihealth.atlassian.net/browse/HULI-1623)
* Updated on [HULI-2852](https://hulihealth.atlassian.net/browse/HULI-2852): Fixed issue that caused the text to appear inverted in Microsoft Edge
* Updated on [HULI-3334](https://hulihealth.atlassian.net/browse/HULI-3334): Added `trim` prop
