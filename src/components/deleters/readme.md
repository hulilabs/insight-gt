# `<wc-deleter>` documentation

A deleter its a wrapper for content that can be removed, usually from a list of items.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `adjustContent` | Boolean | false | - | Instead of filling wide, the width will be adjusted compact to its inner content
| `adjustPadding` | Boolean | false | - | Remove the action button padding when only one input without label is set as content
| `disableDelete` | Boolean | false | - | Display the icon disabled and avoid triggering any event
| `itemKey` | String, Number | false | - | Defines a key from its parent context
| `multipleInput` | Boolean | false | - | Add a separator when multiple inputs are set as content

### Slots

| Name | Description |
| --- | --- |
| `default` | main content, usually an editor or form |

### Events

#### `ON_DELETE` : `deleter-delete` : { Deleter component, String itemKey }

Fired when the delete action is triggered on click or tap. Provides the wrapper deleter and its itemKey (optional) as payload.

## Examples

``` html
<wc-deleter multiple-input adjust-padding adjust-content>
    <wc-textfield></wc-textfield>
</wc-deleter>

<wc-deleter v-for="(item, index) in items"
            v-bind:item-key="index"
            v-on:deleter-delete="_removeItem">
    <wc-textfield></wc-textfield>
</wc-deleter>

<wc-deleter disable-delete>
    <p>Placeholder item used mainly on lists</p>
</wc-deleter>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
|`$wc-deleter-trash-color` | delete action button color | `$wc-raised-button-disabled-font-color` |
|`$wc-deleter-divider-color` | multiple input divider color | `$wc-dividers-dark` |

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/lists.html#lists-specs
* Guidelines : https://zpl.io/pxAqD

### Examples in other libraries

* https://getmdl.io/components/index.html#lists-section

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1848
