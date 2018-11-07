# `<wc-tooltip>` documentation

Component for implementing tooltips, also known as "hints".

On *mobile*, the tooltip is shown after a longtap of the element and hide after 1.5s. It is not recommended to rely on hints for mobile experience.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `active` | Boolean | no | false | initialize activated
| `alignment` | String | no | bottom | opening origin and direction: `top`, `right`, `bottom`, `left`
| `mobile` | Boolean | false  | true if mobile | on mobile it changes offset and display behavior
| `triggerElement` | HTMLElement, Object(local, key) | yes | none | attached element for triggering visibility

Mixin props : [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

### Slots

#### `default`

Single line text to be displayed as the tooltip content when visible.

### Methods

#### `close()`

Closes the tooltip

#### `open()`

Opens the tooltip

#### `toggle()`

Toggle between close or open states

## Behaviors

* [Floating Layer](https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/floating-layer) : setup to use manual positioning by default
* [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

## Examples

``` html
<!-- Trigger attached to a referenced element -->
<a ref="tooltipTrigger" href="#">Trigger</a>
<wc-tooltip v-bind:triggerElement="composeVueRef('tooltipTrigger')" alignment="top" active>Tooltip content</wc-tooltip>

<!-- Trigger attached to a computed variable : tooltipTrigger => return this.$refs.tooltipTrigger -->
<a ref="tooltipTrigger" href="#">Trigger</a>
<wc-tooltip v-bind:triggerElement="tooltipTrigger">Tooltip content</wc-tooltip>
```

``` javascript
// Toggle tooltip state
this.$refs.tooltipTrigger.toggle();
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-tooltip-border-radius` | block radius | 2px
| `$wc-tooltip-min-width` | block minimum width | 40px
| `$wc-tooltip-max-width` | block maximum width | 800px
| `$wc-tooltip-mobile-height` | mobile height | 24px
| `$wc-tooltip-mobile-padding` | mobile x-padding | 8px
| `$wc-tooltip-desktop-height` | desktop height | 32px
| `$wc-tooltip-desktop-padding` | desktop x-padding | 16px

## References

### Design references

* [Material guidelines - Tooltips](https://material.google.com/components/tooltips.html)
* [Huli Guidelines - Tooltips](https://zpl.io/Z5Vvbt)

### Examples in other libraries

* [Materialize CSS - Dialogs - Tooltips](http://materializecss.com/dialogs.html)
* [Material UI - Buttons - Icon Button - Tooltips](http://www.material-ui.com/#/components/icon-button)
* [Material Design Lite - Tooltips](https://getmdl.io/components/index.html#tooltips-section)
* [Polymer - Paper tooltip](https://elements.polymer-project.org/elements/paper-tooltip)
* [Vue MDL - Tooltips](http://posva.net/vue-mdl/#!/tooltips)

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1357
