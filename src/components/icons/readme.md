# `wc-Icon` documentation

A static icon, that can be either represented by an image or by an icon font.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `imageIconPath` | String | no | none | path to load an image and use it as icon
| `imageIconAlt` | String | no | none | `alt` text to be used with image icon
| `iconClass` | String | no | none | class to be added to the icon element
| `iconContent` | String | no | none | adds text inside the icon tag, when the icon isn't an image
| `notification` | Boolean | no | false | adds a notification indicator (a red dot)

Note that when the `imageIconPath` is set, the icon will be generated using an `<img>` tag, while leaving it blank will cause the icon to be generated using the `iconClass` and `iconContent` props as an `<i>` tag

#### Modifying icon's size

The icon's size modifiers are generated based on a `grid` size of `8px`, following this rule:

| icon relative size | modifier | resulting size
| --- | ---
| 1x | .wc-Icon--size-1x | 8px x 8px
| 2x | .wc-Icon--size-2x | 16px x 16px
| 3x | .wc-Icon--size-3x | 24px x 24px
| 4x | .wc-Icon--size-4x | 32px x 32px
| 5x | .wc-Icon--size-5x | 40px x 40px
| 6x | .wc-Icon--size-6x | 48px x 8px

Note that the default size is 32px (4 times the grid size), so that modifier isn't generated.

To change the generated icon sizes, you can modify the `$wc-icon-sizes` list in the `settings/_components.scss` file.

### Modifiers

| modifier | description
| --- | ---
| `wc-Icon__icon--round`| icon with circle shape, to be set in the `iconClass` prop


## Usage examples
```html
<!-- image icon button  -->
<wc-icon image-icon-path="/site/img/star.svg"> </wc-icon>

<!-- font icon button using material icons -->
<wc-icon icon-content="code" icon-class="material-icons"></wc-icon>

<!-- font icon button using Huli's font icons, default size (24x24) -->
<wc-icon icon-class="icon-age-baby"></wc-icon>
<!-- font icon button using Huli's font icons, 4x size (32x32) -->
<wc-icon icon-class="icon-age-kid" class="wc-Icon--size-4x"></wc-icon>
<!-- font icon button using Huli's font icons, 5x size (40x40) -->
<wc-icon icon-class="icon-age-adult" class="wc-Icon--size-5x"></wc-icon>
<!-- font icon button using Huli's font icons, 6x size (48x48) -->
<wc-icon icon-class="icon-age-elder" class="wc-Icon--size-6x"></wc-icon>

<!-- font icon showing new state -->
<wc-icon icon-class="icon-code" notification></wc-icon>
```

## References

### Design references
* Material guidelines : https://material.google.com/style/icons.html#icons-product-icons
* Usage and design : https://zpl.io/UD4rp

### Examples in other libraries
* http://materializecss.com/icons.html
* http://www.material-ui.com/#/components/font-icon
* https://elements.polymer-project.org/elements/iron-icon

### Issues history
* Created on https://hulihealth.atlassian.net/browse/HULI-1114
* Added new state https://hulihealth.atlassian.net/browse/HULI-1588
