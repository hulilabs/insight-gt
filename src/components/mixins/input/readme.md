# Input Behavior Mixin documentation

Mixin that contains common properties for defining the attributes of an HTML `<input/>` tag.
Use this mixin whenever you need a component to have the definition of props for binding them to an input tag.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| type | String | false | text | Input type `date`, `email`,  `hidden`,  `password`, `phone`, `text`, etc.
| name | String | false | null | Sets the input's name. Useful for form data binding
| id | String | false | null | Input's id value. If it's not given, a pseudo id is assigned
| value | String, Number | false | null | Sets the input's default value. This is also useful for data binding to the component
| disabled | Boolean | false | false | Sets the disabled attribute to the input
| required | Boolean | false | false | Sets the required attribute to the input
| maxLength | Number | false | null | Input's max length
| minLength | Number | false | null | Input's min legth
| readonly | Boolean | false | false | Sets the readonly attribute to the input
| min | String | false | null | Minimum value for a **date** or **number** input type
| max | String | false | null | Maximum value for a **date** or **number** input type
| step | Number | false | null | Defines the multiple of a **number** input's value
| autocomplete | Boolean | false | false | Sets the input's autocomplete attribute

## Usage example

```javascript
// Just add this behavior as a mixin in the component definition
var ComponentDefinition = Vue.extend({
    mixins : [InputBehaviorMixin]
});
```
# Input Container Behavior Mixin documentation

Mixin that contains common properties to be used by a component that will act as a wrapper of an input-like element. These properties are also used for giving the error message and state handling, a floating label behavior, character counter, material design's textfield focus highlight (border bottom) and other behaviors to the input's container/wrapper component.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| label | String | false | null | Label's text that describes the input
| floatingLabel | Boolean | false | false | If the input's label must have the floating label behavior
| placeholder | String | false | null | Input's placeholder text
| hasError | Boolean | false | false | If the input has validation errors
| nativeError | Boolean | false | false | Activates native input validation and error state handling
| errorMessage | String | false | null | Text for the input's error state
| hintText | String | false | null | Text for an additional description of the input. Is placed below the input
| charCounter | Boolean | false | false | If the input must have a character counter
| modifier | String | false | null | Modifier for the input's font size. Currently available: `is-title` and `is-headline`
| hideInputHighlighter | Boolean | false | false | Whether the input highlighter should be shown or not.
| showSecondaryStyle | Boolean | false | false | Whether the input should show the secondary style. It was implemented to support the layout of https://zpl.io/Z29g75o
| actionDisabled | Boolean | false | false| Determines whether or not the action is disabled for interaction but still displayed

## Usage example

```javascript
// Just add this behavior as a mixin in the component definition
var ComponentDefinition = Vue.extend({
    mixins : [InputContainerBehaviorMixin]
});
```
