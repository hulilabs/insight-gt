# `<wc-chip>` documentation

The chip component contains text and can be used with an avatar inside of it, the close button is optional.

By default the delete and supr keys trigger the close event for the selected chip, it is parent's duty to set the way to delete the component.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `avatarText` | String | false | - | text for the alphanumeric avatar
| `closeButtonVisible` | Boolean | false | - | set it to true when you want to make the close button visible
| `hasError` | Boolean | false | false | makes the chip red colored
| `imagePath` | String | false | - | image path for the avatar child component
| `mobile` | Boolean | false  | true if mobile | disable focus visuals on mobile
| `text` | String | true | - | chip text content
| `value` | String, Number | false | - | chip value

### Methods

The `wc-chip` component has 1 basic method:

- `close()`

### Events

#### `close()`

The chip component will emit the 'close' event when an user clicks the close button or press the delete or suppress button and will send a payload object that includes the value of the component and the isClosed state

## Examples

``` html
<wc-chip v-bind:text="text" v-on:chip-close="parentCloseMethod"></wc-chip>

<wc-chip v-bind:text="text" v-bind:avatarText="avatarText" v-on:chip-close="parentCloseMethod"></wc-chip>

<wc-chip v-bind:text="text" v-bind:imagePath="imagePath" v-bind:closeButtonVisible="closeButtonVisible" v-on:chip-close="parentCloseMethod"></wc-chip>
```
## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-chip-border-radius` | border radius | 16px
| `$wc-chip-height` | height | 32px
| `$wc-chip-close-button-size` | close button size | 24px

## References

### Design references

* Material guidelines : https://material.google.com/components/chips.html
* Guidelines : https://zpl.io/2tiWvM

### Examples in other libraries

* https://getmdl.io/components/index.html#chips-section
* http://react-toolbox.com/#/components/chip
* http://www.material-ui.com/#/components/chip

### Issues history

* Created on [HULI-1358](https://hulihealth.atlassian.net/browse/HULI-1358)
* Error state added on [HULI-1670](https://hulihealth.atlassian.net/browse/HULI-1670)
