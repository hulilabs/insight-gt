# `<wc-add-photo>` documentation

Placeholder for an add photo behavior. It doesn't perform the upload action, it's just a façade.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `deletable` | Boolean | false | false | If the add photo should have the delete action
| `error` | String | false | null | Shows the error when there is a problem uploading the file
| `imagePath` | String | false | null | Path of the image to be displayed
| `progress` | Number | false | 0 | Progress of the upload
| `retry` | Boolean | false | false | On error, display a retry icon
| `size` | Number | false | 9 | Size modifier from 6 to 12.
| `text` | String | false | null | Text (could be the image's `alt` value) for calculating a placeholder if the image path isn't given
| `uploadable` | Boolean | false | true | If the add photo should have the upload action

### Events

#### `add-photo-delete`

Fired when the delete action is clicked

#### `add-photo-retry`

Fired when the upload action is clicked and it involves a retry context

#### `add-photo-upload`

Fired when the upload action is clicked

## Examples

``` html
<!-- Add photo without the delete action -->
<wc-add-photo image-path="someImagePath" text="someText"></wc-add-photo>

<!-- Add photo with the delete action -->
<wc-add-photo image-path="someImagePath" text="someText" deletable></wc-add-photo>

<!-- Add photo with the delete action binded to a parent's condition -->
<wc-add-photo image-path="someImagePath" text="someText" v-bind:deletable="deletableCondition"></wc-add-photo>

<!-- Add photo on error retry -->
<wc-add-photo retry></wc-add-photo>
```

```json
<!-- Example of the binding of a condition for allowing the deletion of the photo -->
{
    computed : {
        deletableCondition : function() {
            return this.hasPhoto && this.canDeletePhoto;
        }
    }
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-add-photo-background-color` | Background color for the normal state | rgba(0, 0, 0, 0.26)
| `$wc-add-photo-background-color-pressed` | Background color for the pressed and hovered states | rgba(0, 0, 0, 0.54)
| `$wc-add-photo-delete-background-color` | Background color of the delete action circle | $wc-primary-color-dark
| `$wc-add-photo-color` | Font color of the upload and delete icons | $wc-typoicon-primary-light

## References

### Design references

* Guidelines : https://zpl.io/oQOXY

### Issues history

* Created on [HULI-1371](https://hulihealth.atlassian.net/browse/HULI-1371)
* Retry state added on [HULI-1670](https://hulihealth.atlassian.net/browse/HULI-1670)
