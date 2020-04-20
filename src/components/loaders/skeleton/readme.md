# `<wc-skeleton-loader>` documentation

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `animated` | Boolean | false  | false | Adds the loader animation to the items
| `autofill` | Boolean | false  | false  | Fills the container with all the possible items
| `layout` | String | false  | 'list'  | Skeleton layout, possible values: 'card', 'document', 'id-card', 'list', 'table' or 'table-document'
| `length` | Number | false  | 1  | Number of items of the list
| `shadow` | Boolean | false  | false | Adds a shadow to the items

## Examples

``` html
<!--List layout-->
<wc-skeleton-loader layout="list"></wc-skeleton-loader>

<!--Card Layout-->
<wc-skeleton-loader layout="card" shadow></wc-skeleton-loader>

<!--Document Layout-->
<wc-skeleton-loader layout="document"></wc-skeleton-loader>

<!--Id Card Loader-->
<wc-skeleton-loader layout="id-card"></wc-skeleton-loader>

<!--Table Loader-->
<wc-skeleton-loader layout="table"></wc-skeleton-loader>

<!--Table Document Loader-->
<wc-skeleton-loader layout="table-document"></wc-skeleton-loader>

<!-- 10 items with animation  -->
<wc-skeleton-loader v-bind:length="10" animated></wc-skeleton-loader>

<!-- 2 items without animation -->
<wc-skeleton-loader v-bind:length="2" ></wc-skeleton-loader>

<!-- Autofill -->
<div style="height: 400px;">
    <wc-skeleton-loader autofill animated></wc-skeleton-loader>
</div>

<!--Shadow Loader-->
<wc-skeleton-loader v-bind:length="2" animated shadow layout="list"></wc-skeleton-loader>
```

## References

### Design references

* Guidelines : https://zpl.io/Z1qEEix

### Examples in other libraries

* Based on http://cloudcannon.com/deconstructions/2014/11/15/facebook-content-placeholder-deconstruction.html


### Issues history

* Created on [HULI-2473](https://hulihealth.atlassian.net/browse/HULI-2473)
* Table and table-document layouts [HULI-3998](https://hulihealth.atlassian.net/browse/HULI-3998)
