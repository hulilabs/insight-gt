# `<wc-search-box>` documentation

Displays a search button and the input. Anything the user inputs will be notified
via events. Use this component when you need to render results in custom/complex
ways. For example, when the search results display in a different container then
the one that has the search button.

Once the `ON_SEARCH` event is emitted the dropdown will display a loader while
waiting for the `dataSource` to change.

This components are not meant to be used on **mobile**.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `animate` | Boolean | false | false | display an animation when expanding/collapsing the box
| `delay` | Number | false  | 300  | Time in ms to wait for the user to stop typing before triggering the input event.
| `outline` | Boolean | false | false | display a white box around the search input
| `placeholder` | String | false  | -  | Text displayed when the input is active but empty
| `text` | String | false  | null  | Text to be displayed as default

### Methods

#### `isExpanded()`

Checks if the search box is displayed expanded

### Events

#### `ON_BLUR`

Triggered when the search input is blur (looses focus)

#### `ON_CLOSE`

Triggered when the box closes, hiding the input field and returning to it's initial state.

#### `ON_FOCUS`

Triggered when the search input gains focus

#### `ON_OPEN`

Triggered when the box starts its open animation (expands)

#### `ON_SEARCH`  { String value }

Triggered when the user enters any input text. Provides the entered input in `value`.

#### `ON_TOGGLE`  { Boolean open }

Convenient way to listen both ON_OPEN and ON_CLOSE

## Examples

``` html
<!-- Basic declaration -->
<wc-search-box placeholder="Enter something"></wc-search-box>

<!-- Handling events -->
<wc-search-box
    placeholder="Enter something"
    v-on:searchbox-search="_mySearchHandler"
    v-on:searchbox-close="_myCloseHandler">
</wc-search-box>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-search-box-bg` | input background color | `$wc-primary-color` |
|`$wc-search-box-border-radius` | expanded box border radius | `4px` |
|`$wc-search-box-placeholder-color` | placeholder text color | `$wc-typoicon-secondary-dark` |
|`$wc-search-box-grow-animation-duration` | expansion animation duration | `0.5s` |
|`$wc-search-text-padding-top` | padding on above the text and placeholder | `14px` |

