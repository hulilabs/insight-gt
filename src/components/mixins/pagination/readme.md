# PaginationBehavior documentation

The behavior definition provides:
- *DEFAULT* : default state values for components to reuse the behavior definition (mainly for custom props)
- *mixin* : which allows a custom implementation of paginators (ie. table paginator component)

**Each component must have their own local model.** The mixin state will always reflect a valid state for the pagination logic, meaning that the component local model could be invalid againts the pagination state.

*Note: events list is not available from the behavior, because they are part of the mixin implementation. Use `this.paginationMixin.EVENT` for binding*

## PaginationMixin documentation

### API

#### Methods

##### `$_paginationMixin_getItemsPerPage()`

Returns the rows per page dropdown value

##### `$_paginationMixin_getPage()`

Returns the selected page

##### `$_paginationMixin_getTotalItems()`

Returns the total rows of the paginator

##### `$_paginationMixin_isValidPage(Number page)`

Checks if the page is in a valid range [1 - page_limit]

##### `$_paginationMixin_onNextPageClickHandler()`

Click handler for the next page icon button

##### `$_paginationMixin_onPreviousPageClickHandler()`

Click handler for the previous page icon button

##### `$_paginationMixin_setItemsPerPage: function(Number itemsPerPage)`

Sets the items per page

##### `$_paginationMixin_setPage: function(Number page)`

Sets the selected page

##### `$_paginationMixin_setTotalItems: function(Number totalItems)`

Sets the total items

#### Events

##### `pagination-mixin-set-items-per-page` : { Number itemsPerPage, Number previousItemsPerPage }

Fired when the component sets the items per page state

##### `pagination-mixin-set-page` : { Number page, Number previousPage }

Fired when the component sets the page state

##### `pagination-mixin-set-total-items` : { Number totalItems, Number previousTotalItems }

Fired when the component sets the total items state

### Usage example

```javascript
// Just add this behavior as a mixin in the component definition
var ComponentDefinition = Vue.extend({
    mixins : [PaginationMixin],
    ...
});
```