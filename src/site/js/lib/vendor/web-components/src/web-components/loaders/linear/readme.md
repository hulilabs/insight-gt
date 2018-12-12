# `<wc-linear-loader>` documentation

Linear loader. It can be used as determinate or indeterminate.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `indeterminate` | Boolean | false  | false | Sets the linear loader to be indeterminate
| `progress` | Number | false  | 0  | Sets the progress for the determinate linear loader. It only works if the component's indeterminate prop is set to false.

## Examples

``` html
<!-- indeterminate linear loader  -->
<wc-linear-loader v-bind:indeterminate="isIndeterminate"></wc-linear-loader>

<!-- set progress for the determinate linear loader -->
<wc-linear-loader v-bind:progress="progress"></wc-linear-loader>
```

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/progress-activity.html#progress-activity-types-of-indicators
* Guidelines : https://zpl.io/Z1qEEix

### Examples in other libraries

* http://materializecss.com/preloader.html


### Issues history

* Created on [HULI-1674](https://hulihealth.atlassian.net/browse/HULI-1674)
