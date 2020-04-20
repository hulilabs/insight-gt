# `<wc-autocomplete>` documentation

Autocomplete component. It can make searches on a given data source to select an specific option. The component can handle the interaction with the keyboard (alphabetic, escape, enter, up, down).

## API

### Props

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `isloadingMore` | Boolean | false | false | Whether we are currently loading more results, a spinner will be shown at the bottom of the dropdown
| `addItemLabel` | String | false | null | Label placed in a new option before the text input typed by user. It is shown when the allowAddingItems prop is true and the text doesn't have a match with the dataSource options text.
| `allowAddingItems` | Boolean | false  | false  | Enable the component to insert new information under the same input context
| `bufferLimitForRequest` | Number | false  | 2 | Sets the limit of the input text to trigger the `ON_SEARCH` event or apply the filter for the given text
| `dataSource` | Array | true  | -  | Dataset that the component will filter with the input text, option must contain at least text and value properties
| `delay` | Number | false | 300 | Adds a delay in other to fire the search event
| `disabled` | Boolean | false  | false  | Disable the component and change the input status to disabled
| `isMobile` | Boolean | false | false | Flag set to define the component as mobile
| `maxLength` | Number | false | null | Max length of the autocomplete input
| `minLength` | Number | false | null | Min length of the autocomplete input
| `notFoundLabel` | String | true | - | Label placed in a new option before the text input typed by user. It is shown when the allowAddingItems prop is false and the text doesn't have a match with the dataSource options text.
| `required` | Boolean | false | false  | Sets if the component is required (must have a value set)
| `search` | Boolean | false  | false  | Enable external search, disable the filter feature for the dataSource prop
| `fullWidth` | Boolean | false | false | Flag set to the menu child component to take the width of the input
| `text` | String | false | null | Sets the input text of the component
| `value` | String, Number | false  | null  | Autocomplete value, when it is set the component searches for the option with that value in the dataSource prop and change the input text
| `hideInputHighlighter` | Boolean | false | false | Whether or not the input highlighter should be shown
| `showSecondaryStyle` | Boolean | false | false | Whether or not the autocomplete should show the secondary style.
| `hideSelectedAvatar` | Boolean | false | false | Hides the avatar when it is set to the autocomplete input
| `multiline` | Boolean | false  | false  | Allows multiline text in the options

Example format for the dataSource prop:

```
[{
    text : 'Foo'
    match : '<strong>Foo</strong>'
    value : 1
    iconTooltip : 'Icon tooltip example'
    icon : 'icon-lock'
}]
```

### Methods

#### `getInputText()`

Obtains the current input text of the autocomplete

#### `setInputText(String text)`

Sets the input text of the autocomplete

#### `getValue()`

Obtains the current value of the autocomplete

#### `setValue(value)`

Sets the value of the autocomplete

#### `openMenu()`

Open the menu (container of the options)

#### `closeMenu()`

Close the menu

#### `clear()`

Clears the component input text and value

#### `focus()`

Focus the input component

#### `checkSelected()`

Checks if there is a selected value and loads the information in the textfield

### Events

#### `autocomplete-add` : { String value }

Fired when the user selects the empty option 'Add new item'. Provides the current input text.

You must set a value for the current text sent in the payload. Use the method `setValue` if the component is making local searches or use a POST request if the component makes requests to the server to make a search.

#### `autocomplete-clear` :

Fired when the user clicks on the input action (clear button).

#### `autocomplete-enter` :

Fired when the user has the input focused and press the enter key.

#### `autocomplete-focus` : Boolean focusState

Fired when the user clicks of navigate with the keyboard and reaches the autocomplete input. Provides the current focus state as payload.

#### `autocomplete-blur`

Fired when the the input loses focus

#### `autocomplete-input` : { Object option, VueComponent component }

Fired when the user selects an option. Provides the selected option as payload and the component itself (useful for lists of autocompletes).

#### `autocomplete-menu-opened`
Fired when the autocomplete menu is opened after the user writes for the first time.

#### `autocomplete-menu-closed`
Fired when the autocomplete menu is closed.

#### `autocomplete-overflows-viewport` : { Object value }

Fired when the displayed menu doesn't fits into the viewport. Provides the $el of the autocomplete

#### `autocomplete-search` : { String value }

Fired after when the user changes the input and the search prop is true.
Keep in mind this event is debounce to avoid searching on each input (typing)

#### `autocomplete-load-more`

Fired when the user reaches the end of the autocomplete and we are able to laod more results for the current query.


## Examples

``` html
<wc-autocomplete
    v-bind:add-item-label="addItemLabel"
    v-bind:allow-adding-items="allowAddingItems"
    v-bind:data-source="dataSource"
    v-bind:delay="1000"
    v-bind:disabled="disabled"
    v-bind:error-message="errorMessage"
    v-bind:floating-label="floatingLabel"
    v-bind:has-error="hasError"
    v-bind:label="label"
    v-bind:not-found-label="notFoundLabel"
    v-bind:placeholder="placeholder"
    v-bind:required="required"
    v-bind:search="enableSearch"
    v-on:autocomplete-overflows-viewport="onOverflowsViewport"
    v-on:autocomplete-search="onSearch"
></wc-autocomplete>

<wc-autocomplete
    v-bind:add-item-label="addItemLabel"
    v-bind:data-source="dataSource"
    v-bind:disabled="disabled"
    v-bind:error-message="errorMessage"
    v-bind:floating-label="floatingLabel"
    v-bind:has-error="hasError"
    v-bind:label="label"
    v-bind:native-error="nativeError"
    v-bind:not-found-label="notFoundLabel"
    v-bind:placeholder="placeholder"
    v-bind:required="required"
    v-on:autocomplete-overflows-viewport="onOverflowsViewport"
></wc-autocomplete>
```

## Styles

### Configuration variables

The customizable styles for this component are the input container styles.

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/text-fields.html#text-fields-auto-complete-text-field
* Guidelines : https://zpl.io/2ayxrO

### Examples in other libraries

* [React Toolbox](http://react-toolbox.com/#/components/autocomplete)
* [Quasar Framework](http://quasar-framework.org/components/autocomplete.html)
* [Material UI](http://www.material-ui.com/#/components/auto-complete)

### Issues history

* Created on [HULI-1506](https://hulihealth.atlassian.net/browse/HULI-1506)
* Added blur and focus when the icon is clicked [HULI-5001](https://hulihealth.atlassian.net/browse/HULI-5001)
* Added support for input behavior's `modifier` prop [HULI-5290](https://hulihealth.atlassian.net/browse/HULI-5290)
