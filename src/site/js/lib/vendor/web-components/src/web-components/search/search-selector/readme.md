# `<wc-search-dropdown>` documentation

This search selectors displays the results in a dropdown, the results are formatted in a
standard way so if you need to change the layout of each item consider using the
standalone `wc-search-box`.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `isSelfContained | Boolean | false  | -  | Flag set to define the component as selfcontained
| `isMobile | Boolean | false | false | Flag set to define the component as mobile
| `notFoundLabel | String | true  | -  | text displayed when no text was found.
| `dataSource | Array | true  | -  | Dataset that the component will filter with the input text
| `placeholder | String | true  | -  | Placeholder for the input field
| `search | boolean | false  | -  | true to enable external search
| `value | Array | true  | -  | when it is set the component searches for the option with that value in the dataSource prop and change the input text



### Events

#### `search-selector-value-changed` { String  value }

Triggered when the user select any of the items.

#### `load-more`

Triggered when the user reaches the end of the list and the search flag is set.

#### `input-changed` { String  value }

Triggered when the user typed something in the search box.

## Examples

``` html
<!-- Basic declaration -->
<wc-search-selector
	v-bind:not-found-label="l10n.resultNotFound"
	v-bind:value="idUser"
	v-bind:data-source="dataSource"
	v-on:search-selector-value-changed="setIdUser">
</wc-search-selector>
```

## Styles

### Configuration variables

No configurable styles

## References

### Design references

* Guidelines : https://zpl.io/Z29g75o

### Issues history

* Created on [HULI-2389](https://hulihealth.atlassian.net/browse/HULI-2389)
