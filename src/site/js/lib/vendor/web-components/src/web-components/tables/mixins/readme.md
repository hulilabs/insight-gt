# Table Sort Mixin documentation

Mixin that defines sorting methods to interact with the table rows and headers.

See util [Table util](https://github.com/hulilabs/web-components/tree/master/src/web-components/utils/table)

## API

### Methods

#### `sortTable(columnIndex, key, sortType)`

Parameters:

| Param | Type | Note
| ---- | --- | --- | ---
| columnIndex | Number | index of the clicked column to be sort.
| key | String | cell (object) property by which the comparison will be made.
| sortType | String | asc or desc

#### `customSortTable(columnIndex, customSortFunction)`

Parameters:

| Param | Type | Note
| ---- | --- | --- | ---
| columnIndex | Number | index of the clicked column to be sort.
| customSortFunction | Function | sort function to be applied to the selected column

### `handleSortConfig(columnIndex, ascIcon, descIcon)`

Parameters:

| Param | Type | Note
| ---- | --- | --- | ---
| columnIndex | Number | index of the clicked header
| ascIcon | String | icon class that will be positioned next to the header content when the sort type of it is ascendant
| descIcon | String | icon class that will be positioned next to the header content when the sort type of it is descendant

## Implementation

* This methods operate over the `state.rows` and `state.headers` variables, so it must be defined in the parent component that uses a table component.

## Usage example

```javascript
// Just add this behavior as a mixin in the component definition
var ComponentDefinition = Vue.extend({
    mixins : [TableSortMixin],
    data : function() {
        return {
            state : {
                rows : [
                    [
                        {
                            text : 'cell11'
                        },
                        {
                            text : 'cell12'
                        }
                    ],
                    [
                        {
                            text : 'cell21'
                        },
                        {
                            text : 'cell22'
                        }
                    ]
                ]
            }
        };
    },
    methods : {
        sortColumnHandler : function(sortableHeader) {
            TableMixin.sortTable(sortableHeader.columnIndex, 'text', sortableHeader.sortType);
        }
    }
});
```

# Table Selection Controls Mixin

Mixin that defines methods to handle the `table-row-click` event to select a row

## API

### Methods

#### `_onRowClick(Object payload)`

Handler for the `table-row-click` event. The payload param expects an object with the following format:
```javascript
{
    event : {Event},
    index : {Number} rowIndex
}
```

#### `_onRowEnter(Object payload)`

Handler for the `table-row-enter` event. The payload param expects an object with the following format:
```javascript
{
    event : {Event},
    index : {Number} rowIndex
}
```

#### `setSelectedRow(Number rowIndex)`

Sets the selected row in the parent component.

## Implementation

* This methods operate over the `state.selectedRow` variable.

## Usage example

```javascript
// Just add this behavior as a mixin in the component definition
var ComponentDefinition = Vue.extend({
    mixins : [TableSelectionControlMixin],
    data : function() {
        return {
            state : {
                rows : [
                    [
                        {
                            text : 'cell11'
                        },
                        {
                            text : 'cell12'
                        }
                    ]
                ]
            }
        };
    }
});
```
