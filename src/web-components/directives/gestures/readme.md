# `wc-gesture` documentation

Adds support to detect gestures in any given element.

## API

### Props

See [the Vue documentation](https://vuejs.org/guide/custom-directive.html for feature details) for more details
about the available directive arguments.

| Name | Description
| --- | ---
| `arg` | Is the gesture to be detected. Available options are `tab`, `long tab`, `swipe` (any direction), `swipe left`, `swipe right`, `swipe down` and `swipe up`.
| `value` | MUST provide a function to handle the gesture. Error will be thrown otherwise.

### Usage example
```html
<!-- Tap -->
<wc-Component v-wc-gesture:tap="tapFn"> </wc-Component>

<!-- Long Tap -->
<wc-Component v-wc-gesture:longtap="longtapFn"> </wc-Component>
```

## References
* [Vue's directives documentation](https://vuejs.org/guide/custom-directive.html for feature details)

### Examples in other libraries

* [Gesture effect library](https://github.com/mlyknown/vue-gesture)

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1511
