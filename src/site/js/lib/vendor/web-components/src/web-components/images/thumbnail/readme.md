# `<wc-thumbnail>` documentation

Thumbnail image

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| imagePath | String | true | no | path to load an image and use it as thumbnail
| size | Number | false | 3 | grid dimensions

## Examples

``` html
<!-- generates a 6x size round thumbnail with an image inside -->
<wc-thumbnail size="6" v-bind:imagePath="insert_image_path_here"></wc-thumbnail>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-thumbnail-size` | defines the size of the default thumbnail | 24px
| `$wc-thumbnail-sizes` | defines all the availables sizes for the thumbnail that will be generated | 3,4,5,6,7,8,9,10,11,12

## References

### Design references

* Material guidelines : https://material.google.com/style/imagery.html#imagery-principles
* Guidelines : https://zpl.io/ZUOL8p

### Examples in other libraries

* http://www.material-ui.com/#/components/thumbnail
* http://react-toolbox.com/#/components/thumbnail

### Issues history

* Created on [HULI-2400](https://hulihealth.atlassian.net/browse/HULI-2400)
