# `wc-AppBar` documentation

App Bar, visible only for mobile devices, inform the user the state of the app and provides actions depending in the context.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `active` | Boolean | no | false | State of the App Bar. True to open, false to close. Use it to bind a parent/Vuex.
| `compact` | Boolean | no | false | gives the appbar a compact modifier for a more compact version (less height)
| `fixed` | Boolean | no | false | True to fix the App Bar on top
| `fillSpace` | Boolean | no | false | Make the elements expand to fill the horizontal space
| `hintClass` | String | no | null | class to apply to `hintText`
| `hintText` | String | no | null | text to be added next to the title
| `noShadow` | Boolean | no | false | True to disable the app bar shadow
| `showActions` | Boolean | no | true | shows/hides actions markup
| `title` | String | no | null | App Bar Title text
| `titleClass` | String | no | null | Class that will be added to the title element

### Slots

| Name | Description |
| --- | --- |
| `default` | Additional custom content to add inside the bar |
| `navigation` | It is the navigation action on the left side, it should always be present and it has just one element |
| `progress` | Visual feedback for an action requiring progress, i.e. loading data on a page before displaying it

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

### Issues history

* Created on [HULI-1115](https://hulihealth.atlassian.net/browse/HULI-1115)
* Updated on [EHR-50](https://hulihealth.atlassian.net/browse/EHR-50): Added `progress` slot and styling
