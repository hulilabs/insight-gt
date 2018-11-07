# `wc-ripple` directive documentation

Adds material ripple to a Vue component.

## API

### Arguments
See [the Vue documentation](https://vuejs.org/guide/custom-directive.html for feature details) for more details about the availble directive arguments.

| Name | Description
| --- | ---
| `arg` | Will be used _as is_ as a modifier

## Usage example
```html
<!-- the arg mentioned above is represented by the is-dark modifier -->
<wc-Component v-wc-ripple:is-dark> </wc-Component>

<!-- the arg mentioned above is represented by the is-light modifier -->
<wc-Component v-wc-ripple:is-light> </wc-Component>
```

## References
* [Vue's directives documentation](https://vuejs.org/guide/custom-directive.html for feature details)
* [Ripple effect library](../../effects/ripple)
