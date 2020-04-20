# `<wc-error>` documentation

Component for displaying validation and application errors

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `layout` | String | false | `none` | Determine the error display mode based on how it relates to another component. Available options are: `card`, `selection` and `none`

@see `ErrorComponent.LAYOUT`

### Slots

| Name | Description |
| --- | --- |
| `default` | Sets the error message that will be displayed

## Examples

``` html
<wc-error layout="card">Error Message</wc-error>
```

## References

### Design references

* Material guidelines : https://material.io/guidelines/patterns/errors.html

* Guidelines : https://zpl.io/oQOXY
* [Add photo error guidelines](https://zpl.io/oQOXY)
* [Chip error guidelines](https://zpl.io/2tiWvM)
* [Deleter error guidelines](https://zpl.io/pxAqD)

### Issues history

* Created on [HULI-1670](https://hulihealth.atlassian.net/browse/HULI-1670)
