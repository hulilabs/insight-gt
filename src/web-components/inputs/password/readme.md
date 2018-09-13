# `<wc-password>` documentation

A simple password input that allows to reveal or hide the password content by clicking in the input's action

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)


### Methods

#### `setValue(string value, boolean shouldTriggerState)`

Sets the components's value and if the option is given, triggers an `input` event which allows to update the value of the variable used with `v-model`

#### `focus()`

Sets the focus state of the input and the input container components.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `shouldTriggerState` | Boolean | false | If the child textfield component should trigger the ON_INPUT event for notifying its state changes

### Events

#### `blur`

Fired when the password component loses focus. Provides the current value as payload.

#### `focus`

Fired when the password component gains focus. Provides the current value as payload.

#### `input`

Fired when the password component input's value is changed. **This event is required by `v-model` for handling the parent-child interaction**

## Examples

``` html
<!-- Password component with floating label and v-model -->
<wc-password v-model="parentVariable" label="Password" floating-label></wc-password>
```

## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Issues history

* Created on [HULI-3010](https://hulihealth.atlassian.net/browse/HULI-3010)
