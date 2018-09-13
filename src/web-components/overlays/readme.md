# `wc-Overlay` documentation

It is an utility component, it's used to block the user when its attention is required.

## Implementation pending

* Figure out a better way to avoid navigation behind the overlay without preventDefault. Must support form navigation above the overlay, like in a dialogs with forms

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `active` | Boolean | false | false  | State of the overlay. True to open, false to close. **This can be useful if you want to bind the state of the nav to the parent component or vuex**
| `closeOnClick` | Boolean | false | true | Set to true to allow the user to close the overlay by clicking on it
| `closeOnEscKey` | Boolean | false | true | Set to true to allow the user to close the component by pressing the ESC key
| `blockScroll` | Boolean | false | false | Blocks the scroll when the overlay is active
| `animated` | Boolean | false | true | Determines if the overlay should have the opening and closing transitions

## Methods

### `setBlockBodyPosition(Boolean block)`

This method blocks and unblocks the scroll in the body element when it is active.
It adds the 'js-wc-scrollFixed' class to the body in order to block the scroll.

#### Params
Param | Required | Type
---- | --- | ---
block | Yes | Boolean

## Events

### `overlay-close`

The overlay component will emit the `overlay-close` event each time its state changes. **This approach can be used when
there is a Parent-Child communication.**

For example: each time the overlay emits the `overlay-close` event, the onOverlayClosed method (of its parent) will be called.

Parent template:

``` html
    <wc-overlay v-on:overlay-close="onOverlayClosed"></wc-overlay>
```

Parent component:

``` javascript
onOverlayClosed : function() {
    this.state.overlay = !this.state.overlay;
}
```

## Examples

``` html
<!-- A simple overlay definition -->
<wc-overlay v-on:overlay-close="someParentMethod"></wc-overlay>

<!-- An overlay that blocks user's scroll -->
<wc-overlay v-on:overlay-close="someParentMethod" v-bind:block-scroll="true"></wc-overlay>

<!-- An overlay that isn't closed with click and ESC key -->
<wc-overlay v-on:overlay-close="someParentMethod" v-bind:close-on-click="true" v-bind:close-on-esc-key="true">
</wc-overlay>

<!-- An overlay with a transparent background color -->
<wc-overlay v-on:overlay-close="someParentMethod" class="wc-Overlay--transparent"></wc-overlay>

<!-- An overlay with the secondary color as background color -->
<wc-overlay v-on:overlay-close="someParentMethod" class="wc-Overlay--secondary"></wc-overlay>

<!-- An overlay without animation -->
<wc-overlay v-on:overlay-close="someParentMethod" v-bind:is-animated="false"></wc-overlay>
```
## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-overlay-background-color` | Overlay's original background color | rgba($wc-typoicon-base-dark, 0.54);
| `$wc-overlay-background-color-secondary` | Overlay's background color with it's `secondary` modifier | rgba($wc-secondary-color, 0.7);

### Modifiers

Class | Description
---- | --- |
 `wc-Overlay--secondary `| set the background color to secondary color
 `wc-Overlay--transparent` | set the background color transparent

## References

### Design references

* [Dialogs](https://zpl.io/ZcKHvw) - usage example
* [Nav drawer](https://zpl.io/2ugHXm) - usage example
* [Onboarding](https://zpl.io/1Y9onx) - usage example

### Issues history

* Created on [HULI-1110](https://hulihealth.atlassian.net/browse/HULI-1110)
* Updated on [HULI-1112](https://hulihealth.atlassian.net/browse/HULI-1112): Fixing readmes
* Updated on [HULI-1748](https://hulihealth.atlassian.net/browse/HULI-1748): Adding **modifier** and **animated** props for controlling the background color and if it should have the opnening/close animation. Also fixing readmes
* Updated on [HULI-1859](https://hulihealth.atlassian.net/browse/HULI-1859): Removing `animated` prop and styles related to it
