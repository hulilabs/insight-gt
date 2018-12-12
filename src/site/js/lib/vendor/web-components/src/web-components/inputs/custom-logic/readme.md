# `<wc-custom-logic>` documentation

Text field with a mask for validating input format

## Implementation pending
* It currently handles only **numbers**. Provide support for letters and sets of special characters

## API

### Props

The following props correspond to the HTML attributes that a `<input/>` tag supports. These are inherited from [InputBehavior](https://github.com/hulilabs/web-components/tree/HULI-1724/src/web-components/behaviors/mixins/input#input-behavior-mixin-documentation):

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| name | String | false | null | Sets the input's name. Useful for form data binding
| value | String | false | null | Sets the input's default value. This is also usefu l for data binding to the component
| disabled | Boolean | false | false | Sets the disabled attribute to the input
| required | Boolean | false | false | Sets the required attribute to the input
| readonly | Boolean | false | false | Sets the readonly attribute to the input

The following props correspond to those that are going to be bound to a `<wc-input-container>` component. These are inherited from [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/HULI-1728/src/web-components/behaviors/mixins/input#input-container-behavior-mixin-documentation):

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| label | String | false | null | Label's text that describes the input
| floatingLabel | Boolean | false | false | If the input's label must have the floating label behavior
| hasError | Boolean | false | false | If the input has validation errors
| nativeError | Boolean | false | false | Activates native input validation and error state handling
| errorMessage | String | false | null | Text for the input's error state
| hintText | String | false | null | Text for an additional description of the input. Is placed below the input

Own props:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| clear | Boolean | false | false | If the textfield should have a clear button for resetting the input's value
| format | String | true | -- | Specifies a valid sequence of characters for the input. Use `#` for numbers and any other character for separators
| placeholder | String | false | null | Customize mask display value. Must match 'format' sequence. Not used for sequence validation

### Slots

@see [InputContainer](https://github.com/hulilabs/web-components/tree/master/src/web-components/inputs/input-container#slots)

### Methods

#### `getMaskedValue()`

Retrieves the current masked value (include separators)

#### `getValue()`

Retrieves the current value without mask (raw data)

#### `setValue(String value)`

Set the current value and updates the masked value. Forces the input to be a valid sequence of characters following the provided format

| Param | Type | Required | Note
| ---- | --- | --- | ---
| value | String, Number | true | -

### Events

@see [Textfield](https://github.com/hulilabs/web-components/tree/master/src/web-components/inputs/textfield#events)

## Examples

``` html
<wc-custom-logic format="#-####-####" placeholder="A-BCDE-FGHI" v-model="citizenID"></wc-custom-logic>
```

### Sample setups

| Name | Format | Placeholder
| --- | --- | ---
| Phone | ####-#### | 8888-9999
| ID | #-####-#### | A-BCDE-FGHI
| Date | ##/##/#### | dd/mm/yyyy
| Time | ##:## | hh:mm

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-custom-logic-placeholder-color | input placeholder mask color | $wc-input-container-label-color

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Examples in other libraries

* https://elements.polymer-project.org/elements/paper-input
* http://react-toolbox.com/#/components/input
* https://marcosmoura.github.io/vue-material/#/components/input

### Masking solutions

**Vanilla JS**
* https://github.com/estelle/input-masking (main solution source)
* http://www.material-ui.com/#/components/text-field
* https://github.com/insin/inputmask-core

**Vue plugins**
* https://github.com/probil/v-mask
* https://github.com/matisoffn/vue-mask

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1625