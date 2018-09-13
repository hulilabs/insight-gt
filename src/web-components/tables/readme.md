# `<wc-table>` documentation

Table component. Defines the layout of a table for a data set. It can't be used in a mobile environment.

## Implementation pending

* Add selection controls to the rows using checkboxes (not in the files scope)

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `title` | String | false  | null  | Table title placed in the table header

### Slots

| Name | Description |
| --- | --- |
| `customFooterActions` | Table custom footer actions |
| `data` | Table rows |
| `headerActions` | Table header actions |
| `headers` | Table headers |

# `<wc-table-row>`

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `disabled` | Boolean | false | false | Sets the disabled state for the row
| `header` | Boolean | false | false | Sets the header behavior for a specific row
| `noFocus` | Boolean | false | false | Removes styles for :hover and :active and `tabindex` attribute
| `index` | Number | false | null | Index of the row within the table
| `selected` | Boolean | false | false | Sets the selected styles on a row
| `multiline` | Boolean | false | false | Allows the row's content to grow vertically beyond `height: 48px`
| `expanded` | Boolean | false | false | Shows the content from the `expandableContent` named slot

### Slots

| Name | Description |
| --- | --- |
| `default` | Row body |
| `expandableContent` | Additional hidden content that's only shown when the `expanded` prop is `true` |

### Methods

#### `getIndex`

Returns the current row index

#### `setIndex(Number index)`

Sets the row index

### Events

#### `table-row-click` : Object

Fired when the user clicks in a row. Provides the triggered event and the row index as payload.

#### `table-row-context-menu` : Object

Fired when the user right clicks in a row. Provides the triggered event and the row index as payload.

#### `table-row-double-click` : Object

Fired when the user double clicks in a row. Provides the triggered event and the row index as payload.

# `<wc-table-cell>`

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `action` | Boolean | false | false | Sets the action behavior to the cell
| `clickable` | Boolean | false | false | Sets the clickable behavior to the cell
| `compact` | Boolean | false | false | Reduce the horizontal spacing of a cell
| `disabled` | Boolean | false | false | Sets the disabled behavior to the cell
| `header` | Boolean | false | false | Sets the header behavior to the cell
| `index` | Number | false | null | Index of the cell within a table
| `no-border` | Boolean | false | false | Remove the border bottom cell style

### Slots

| Name | Description |
| --- | --- |
| `default` | Cell content |

### Methods

#### `getIndex`

Returns the current index of the cell

### Events

#### `table-cell-click` : Object

Fired when the cell has the clickable prop as true and is clicked. Provides an object as payload, it contains the content in the cell, the index of the cell (column index) and the index of the cell's parent.

### Styles

#### Modifiers

* `wc-TableCell--right` : Aligns the text to the right, it must be used when the data of the cell is type `Number`
* `wc-TableCell--top` : Aligns the text to the top
* `is-editable` : Uses the property `cursor:pointer`
* `is-sortable` : Use this modifier for cases when a header is sortable
* `is-active` : Use this modifier for cases when a header is sortable and is active

# `<wc-table-paginator>`

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `currentRowsLabel` | String | false | null | Label of the pagination range.
| `page` | Number | false | 1 | Selected page
| `rowsSelector` | Number | false | 5 | Set the current number of rows visible in the table
| `rowsSelectorLabel` | String | false | null | Label for the rows per page dropdown
| `rowsSelectorMax` | Number | false | 10 | Define the max amount of rows to show per page
| `totalRows` | Number | true | - | Defines the total number of rows that can show the table

### Methods

#### `getPage`

Returns the selected page of the paginator component.

#### `getPageLimit`

Returns the max amount of pages

#### `getRowsSelector`

Returns how many rows are shown by page.

#### `getTotalRows`

Returns the total rows that can be shown in a table component.

#### `isValidPage(Number page)`

Checks if the page is in a valid range : `1 - page_limit`

#### `setPage(Number page)`

Sets the page of the paginator component. Fires a `table-paginator-set-page` event

### Events

#### `table-paginator-set-page` : Object

Fired when an intentation of page change is done. This is useful for handling page changes from the parent (not inside the paginator context)

Provides an object that contains:

``` js
{
    currentPage : 1,
    pageIntent : 2,
    pageIntentCheck : true,
    pageLimit : 2,
    rowsOffset : 1,
    rowsPerPage : 2
}
```

#### `table-paginator-rows-selector-changed` : Number rowsSelector

Fired when the user changes the rows per page dropdown

## Configuration

The table component offers some mixins that stablish the communication with its parent component using simple methods.

@see [Mixins](https://github.com/hulilabs/web-components/tree/master/src/web-components/tables/mixins/)

### SortMixin

Use this mixin when the table component includes sorting as a feature. It handles the communication with the rows set from the parent component of the table and the rows to be ordered.

### SelectionControlsMixin

Use this mixin to integrate the click event handling to select a row.

## Examples

``` html
<wc-table
    rows-selector-label="Filas por página:"
    current-rows-label="de"
    v-bind:pagination="state.pagination"
    v-bind:title="title"
    v-bind:total-rows="totalRows"
    v-bind:white-background="whiteBackground"
    v-on:table-page-changed="_pageChangedHandler"
    v-on:table-rows-selector-changed="_rowsSelectorChangedHandler">
    <template slot="headerActions">
        <wc-icon-button v-wc-ripple:is-dark icon-class="icon-info" class="wc-Table__action"></wc-icon-button>
        <wc-icon-button v-wc-ripple:is-dark icon-class="icon-star" class="wc-Table__action"></wc-icon-button>
    </template>
    <template slot="headers">
        <wc-table-row header>
            <wc-table-cell
                v-for="(header, headerIndex) in state.headers"
                v-bind:class="{ 'wc-TableCell--right' : header.alignRight}"
                v-bind:index="headerIndex"
                v-bind:ref="'header' + headerIndex"
                v-bind:clickable="header.clickable"
                v-on:table-cell-sort="sortColumnHandler"
                header>
                {{ header.text }}
            </wc-table-cell>
            <!-- add this empty cell to fit the space with the row action -->
            <wc-table-cell header></wc-table-cell>
        </wc-table-row>
    </template>
    <template slot="data">
        <wc-table-row v-for="(row, rowIndex) in state.rows" v-bind:index="rowIndex" action>
            <wc-table-cell
                v-for="(cell, cellIndex) in row"
                v-bind:class="{ 'wc-TableCell--right' : cell.alignRight }"
                v-bind:clickable="cell.clickable"
                v-bind:index="cellIndex"
                v-on:table-cell-edit="editableCellHandler">
                <span>{{ cell.text }}</span>
            </wc-table-cell>
            <template slot="action">
                <wc-icon-button slot="action" v-on:click.native="optionsClickHandler" v-wc-ripple:is-dark icon-class="icon-options"></wc-icon-button>
            </template>
        </wc-table-row>
    </template>
    <template slot="customFooterActions">
        <wc-flat-button v-wc-ripple:is-dark v-on:click.native="addRowHandler">Agregar dato</wc-flat-button>
        <wc-table-paginator
            rows-selector-label="Filas por página:"
            current-rows-label="de"
            v-bind:total-rows="state.totalRows"
            v-on:table-paginator-page-changed="_pageChangedHandler"
            v-on:table-paginator-rows-selector-changed="_onRowsPerPageChanged">
        </wc-table-paginator>
    </template>
</wc-table>
```

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/tables.html#
* Guidelines : https://zpl.io/Z1Cryqv

### Examples in other libraries

* http://materializecss.com/table.html

### Issues history

* Created on [HULI-1672](https://hulihealth.atlassian.net/browse/HULI-1672)
* Better pagination parameters integration [HULI-4453](https://hulihealth.atlassian.net/browse/HULI-4453)
* Added `noFocus` prop [HULI-4132](https://hulihealth.atlassian.net/browse/HULI-4132)
