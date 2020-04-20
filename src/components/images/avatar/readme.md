# `<wc-avatar>` documentation

Static avatar, it can be used with an image or text.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| text | String | false | no | text where the initial that will be rendered in the avatar is extracted
| imagePath | String | false | no | path to load an image and use it as avatar
| square | boolean | false | false | Indicates if the avatar is a square instead of a circle(default)
| expand | boolean | false | false | Indicates if the avatar image should expand to full width and height

## Examples

``` html
<!-- generates a 3x size round avatar by default  -->
<wc-avatar v-bind:text="insert_your_text_here"></wc-avatar>

<!-- generates a 4x size round avatar (32px x 32px) -->
<wc-avatar class="wc-Avatar--size-4x"></wc-avatar>

<!-- generates a 5x size square avatar (40px x 40px) -->
<wc-avatar class="wc-Avatar--size-5x" square></wc-avatar>

<!-- generates a 6x size round avatar with an image inside -->
<wc-avatar class="wc-Avatar--size-6x" v-bind:imagePath="insert_image_path_here"></wc-avatar>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-avatar-size` | defines the size of the default avatar | 24px
| `$wc-avatar-sizes` | defines all the availables sizes for the avatar that will be generated | 3,4,5,6,7,8,9,10,11,12

### Modifiers

| Modifier | Description
| --- | ---
| `wc-Avatar--transparent` | It is used to set the background color to transparent, must be used when the avatar contains an image
| `wc-Avatar--darkBackground` | Sets a different font and background colors when using the avatar in a dark background
| `wc-Avatar--size-3x` | It is used to set the size of the avatar by the grid size (i.e. wc-Avatar--sizeYx where the Y variable can be used as a number from 3 to 12, in this case)

## References

### Design references

* Material guidelines : https://material.google.com/style/imagery.html#imagery-principles
* Guidelines : https://zpl.io/ZUOL8p

### Examples in other libraries

* http://www.material-ui.com/#/components/avatar
* http://react-toolbox.com/#/components/avatar

### Issues history

* Created on [HULI-1351](https://hulihealth.atlassian.net/browse/HULI-1351)
