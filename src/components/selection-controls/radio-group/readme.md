# `<wc-radio-group>` documentation

A list of `<wc-radio-button>` components.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `layout` | String | false  | list  | display layout for radio buttons
| `compact` | Boolean | false | false | determines whether or not its radio buttons should have a more compact version no matter what other layout they have

**Layout options:**
* `column` : horizontally arrange in columns (3 for desktop, 1 for mobile)
* `list` : vertically arrange in single item rows
* `row` : horizontally arrange in rows, no fixed number of item per row

### Slots

| Name | Description |
| --- | --- |
| `default` | expects a list of `<wc-radio-button>` components |

## Examples

``` html
<wc-radio-group layout="list">
    <wc-radio-button v-model="radioGroupdValue" custom-value="1" name="radio-group">
        radio-button 1
    </wc-radio-button>
    <wc-radio-button v-model="radioGroupdValue" custom-value="2" name="radio-group">
        radio-button 2
    </wc-radio-button>
    <wc-radio-button v-model="radioGroupdValue" custom-value="3" name="radio-group">
        checked radio-button
    </wc-radio-button>
    <wc-radio-button v-model="radioGroupdValue" custom-value="4"  name="radio-group" disabled>
        disabled radio-button
    </wc-radio-button>
</wc-radio-group>
```

## Styles
This component uses `<wc-list-item>` style settings, as this one represents a list. Also, there's a static padding of `8px 0` for the radio-group block, and `0 16px` for every item.

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

* http://www.material-ui.com/#/components/radio-button

### Issues history

* Created on [HULI-1353](https://hulihealth.atlassian.net/browse/HULI-1353)
* Modified on [HULI-1742](https://hulihealth.atlassian.net/browse/HULI-1742): added horizontal layout
* Modified on [HULI-2019](https://hulihealth.atlassian.net/browse/HULI-2019): added `v-model` support to checkbox, radio-button and toggle components. Removed "smart" functionalities to radio-group and toggle (group) components. Updated docs.
