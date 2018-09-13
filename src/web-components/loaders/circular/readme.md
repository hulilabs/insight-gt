# `<wc-circular>` documentation

Circular Loader. It can be used as determinate or indeterminate.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `indeterminate` | Boolean | false  | -  | Sets the circular loader to be indeterminate
| `progress` | Number | false  | false  | Sets the progress for the determinate circular loader. It only works if the component's indeterminate prop is set to false.
| `isSaver` | Boolean | false  | false  | Sets the loader color equal to the saver color
| `light` | Boolean | false  | false  | sets the loader to a light version of 1px stroke

## Examples

``` html
<!-- indeterminate circular loader -->
<wc-circular-loader v-bind:indeterminate="isIndeterminate"></wc-circular-loader>

<!-- set progress for the determinate linear loader -->
<wc-circular-loader v-bind:progress="progress"></wc-circular-loader>

<!-- set the loader color equal to the saver color -->
<wc-circular-loader v-bind:indeterminate="isIndeterminate" v-bind:is-saver="isSaver"></wc-circular-loader>
```

## Styles

### Modifiers

| Variable | Description
| --- | ---
| `saver` | sets the loader color equal to the saver color

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/progress-activity.html#progress-activity-types-of-indicators
* Guidelines : https://zpl.io/Z1qEEix

### Examples in other libraries

* http://materializecss.com/preloader.html

### Issues history

* Created on [HULI-1674](https://hulihealth.atlassian.net/browse/HULI-1674)
