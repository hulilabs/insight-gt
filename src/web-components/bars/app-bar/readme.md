# `wc-AppBar` documentation

App Bar, visible only for mobile devices, inform the user the state of the app and provides actions depending in the context.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `active` | Boolean | No | false | State of the App Bar. True to open, false to close. Use it to bind a parent/Vuex.
| `title` | String | No | null | App Bar Title text
| `titleClass` | String | No | null | Class that will be added to the title element
| `noShadow` | Boolean | No | false | True to disable the app bar shadow
| `showActions` | Boolean | No | true | shows/hides actions markup
| `hintText` | String | no | null | text to be added next to the title
| `hintClass` | String | no | null | class to apply to `hintText`
| `compact` | Boolean | no | false | gives the appbar a compact modifier for a more compact version (less height)

### Slots

| Name | Description |
| --- | --- |
| `default` | Additional custom content to add inside the bar |
| `navigation` | It is the navigation action on the left side, it should always be present and it has just one element |

### Actions

Are the button actions on the right side, maximum two actions.

** Example : **

``` html
<wc-app-bar title="new title" v-bind:active="true">
    <button slot="navigation">X</button>
    <button slot="actions">A</button>
    <button slot="actions">B</button>
</wc-app-bar>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the dialog:

| Variable | Description | Default
| --- | --- | ---
| `$wc-app-bar-height` | height of the app bar | 56px
| `$wc-app-bar-width` | width of the app bar | 100%
| `$wc-app-bar-background-color` | background color | $wc-primary-color

## Design references

This code was developed following these references:

- [Guidelines](https://zpl.io/YXklU)
- [Material design guidelines](https://material.google.com/components/toolbars.htm)
