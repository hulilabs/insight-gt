# `<wc-char-counter>` documentation

## API

### Props


| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `target` | String | true | - | the string which length will be tracked
| `maxLength` | Number | false | null | target's maximum length constraint
| `minLength` | Number | false | null | target's minimum length constraint
| `hasError` | Boolean | false | false | defines the error state of the component

### Events

The `wc-char-counter` component will emit the `change` event whenever the compliance state of the counter is changed, according to the target's current length. **It's responsibility of the parent to handle this event.**

#### Usage example:

``` html
<!-- Parent's template -->
<wc-char-counter v-bind:target="parentString" v-on:change="charCounterOnChangeHandler"></wc-char-counter>
```

``` javascript
// Parent's component
charCounterOnChangeHandler : function(target) {
    if (target.state === 'IS_COMPLIANT') {
        this.hasErrors = false;
    } else {
        this.hasErrors = true;
    }
}
```

#### Event payload
``` json
{
    state : {String}    // Compliance state of the character counter
}
```

## Examples

``` html
<!-- The max-length prop is binded so the component can receive a literal value -->
<wc-char-counter v-bind:target="state.value" v-bind:max-length="255" v-on:change="checkLengthValidation">
</wc-char-counter>
```
## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Examples in other libraries

* https://elements.polymer-project.org/elements/paper-input?active=paper-input-char-counter

### Issues history

* Created on [HULI-1676](https://hulihealth.atlassian.net/browse/HULI-1676)
* Updated on [HULI-1728](https://hulihealth.atlassian.net/browse/HULI-1728): Moved out from the text-fields folder
