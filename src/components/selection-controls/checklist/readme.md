# `<wc-checklist>` documentation

A list of `<wc-checkbox>` components.
- This component uses enhanced [keyboard focus behavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/a11y/keyboard-focus/readme.md), which allows focus management using the UP and DOWN arrow keys.

## API

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `display-row` | Boolean | false  | false  | whether to display the radio group in horizontal configuration

### Slots

| Name | Description |
| --- | --- |
| `default` | expects a list of `<wc-checkbox>` components |

## Examples

``` html
<wc-checklist>
    <wc-checkbox v-model="someChecklistValue" alt-value="1">
        checkbox 1
    </wc-checkbox>
    <wc-checkbox v-model="someChecklistValue" alt-value="2">
        checkbox 2
    </wc-checkbox>
    <wc-checkbox v-model="someChecklistValue" alt-value="3">
        checked checkbox
    </wc-checkbox>
    <wc-checkbox v-model="someChecklistValue" alt-value="4" disabled>
        disabled checkbox
    </wc-checkbox>
</wc-checklist>
```

## Styles
This component uses `<wc-list-item>` style settings, as this one represents a list. Also, there's a static padding of `8px 0` for the checklist block, and `0 16px` for every item.

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-list-item-width` | row width | 100%
| `$wc-list-item-single-height` | row height | 48px

## References

### Design references

* Material guidelines : https://material.google.com/components/selection-controls.html
* Guidelines : https://zpl.io/22dn8n

### Examples in other libraries

* http://www.material-ui.com/#/components/checkbox

### Issues history

* Created on [HULI-1622](https://hulihealth.atlassian.net/browse/HULI-1622)
* Modified on [HULI-1742](https://hulihealth.atlassian.net/browse/HULI-1742): added horizontal layout
* Modified on [HULI-2019](https://hulihealth.atlassian.net/browse/HULI-2019): added `v-model` support to checkbox, radio-button and toggle components. Removed "smart" functionalities to radio-group and toggle (group) components. Updated docs.
