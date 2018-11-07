# `v-wc-tooltip` documentation

Directive for implementing tooltips, also known as "hints".
It creates an attached `<wc-tooltip>` component to any element.

## API

### Element

The DOM element will be used as the trigger (hover/focus) for the tooltip. **Must have an ID**

### Modifiers

| Name | Argument | Description
| --- | --- | ---
| `active` | | initialize activated
| `alignment` | `top`, `right`, `bottom`, `left` | opening origin and direction

### Expression

Pass a string or any bindable string variable. This will be used to fill the `<wc-tooltip>` default slot.

## Examples

``` html
<!-- Anchor with directive tooltip (not active and default alignment) and string text -->
<a href="#" v-wc-tooltip="'Tooltip content'">Link</a>

<!-- Span with directive tooltip (active and align at right) and text defined by a computed variable -->
<span v-wc-tooltip.active.alignment:right="someL10nVar">Span</span>
```

## Reference

`<wc-tooltip>` [documentation](https://github.com/hulilabs/web-components/src/web-components/tooltips/readme.md)

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1357
