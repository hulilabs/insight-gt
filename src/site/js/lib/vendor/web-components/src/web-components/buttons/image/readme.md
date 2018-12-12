# `<wc-image-button>` documentation
Button that contains an image. Can can checked or disabled

## API
### Props
| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `disabled` | Boolean | no | false | should the button be disabled?
| `path` | String | yes | none | Image path
| `subtitle` | String | no | null | Subtitle text
| `title` | String | no | null | Title text
| `value` | String,Number | yes | none | Component value

## Examples
```html
<!-- image button -->
<wc-image-button
    v-bind:path="imagePath"
    v-bind:title="'Ramón Health'"
    v-bind:value="'Ramón'"
    v-on:input="_onInput"
    selected></wc-image-button>
```

## References
### Design references
* Guidelines : https://zpl.io/aRN8Oqr
* Usage and design on practice: https://zpl.io/aRN8Oqr


### Issues history
* Created on [HV-995](https://hulihealth.atlassian.net/browse/HV-995)
