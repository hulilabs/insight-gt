# `<wc-search-dropdown>` documentation

This search action displays the results in a dropdown, the results are formatted in a
standard way so if you need to change the layout of each item consider using the
standalone `wc-search-box`.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `dataSource` | Array | true  | -  | each of the items to be rendered as results.
| `notFoundLabel` | String | true  | -  | text displayed when no text was found.
| `placeholder` | String | true  | -  | text displayed while the input is empty.
| `rows` | Number | false  | 4  | Min number of rows to be displayed, any overflow will be displayed with a scroll.
| `text` | String | false  | null  | Text to load if the input will have a default value.
| `useThumbnail` | Boolean | false  | false  | Sets the component to load thumbnails instead of avatars.

### Events

#### `searchdropdown-clear`

Triggered when the clear icon is clicked or the input value is empty.

#### `searchdropdown-search` { String  value }

Triggered when the user enters any input. Use `value` to make your search request and then set
the results using `dataSource`.

#### `searchdropdown-select` { String  value }

Triggered when the user select any of the items.

## Examples

``` html
<!-- Basic declaration -->
<wc-search-dropdown
    not-found-label="Sorry, we found nothing."
    placeholder="Search for something"
    rows="6"
    v-bind:dataSource="results"
    v-on:searchdropdown-search="_onSearchHandler">
</wc-search-dropdown>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-search-dropdown-border-radius` | not found label color | `$wc-typoicon-primary-dark` |
|`$wc-search-dropdown-loader-width` | width of the loader | `48px` |
|`$wc-search-dropdown-not-found-color` | border style | `1px solid;` |

## References

### Design references

* Material guidelines: https://material.google.com/patterns/search.html
* Guidelines : https://zpl.io/ZjAu90

### Issues history

* Created on [HULI-1673](https://hulihealth.atlassian.net/browse/HULI-1673)
