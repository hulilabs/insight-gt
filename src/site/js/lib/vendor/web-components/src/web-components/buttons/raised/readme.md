# `wc-raised-button` documentation
A raised `<button>`, follows material guidelines

## Props
| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `disabled` | Boolean | no | none | should the button be disabled?
| `large` | Boolean | no | none | is the button larger?

## Usage examples
```html
<!-- raised button -->
<wc-RaisedButton v-wc-ripple:is-light>button</wc-RaisedButton>

<!-- disabled raised button -->
<wc-RaisedButton disabled>disabled</wc-RaisedButton>

<!-- large raised button -->
<wc-RaisedButton large v-wc-ripple:is-light>large button</wc-RaisedButton>

<!-- disabled large raised button -->
<wc-RaisedButton large disabled>disabled large</wc-RaisedButton>
```

## Notes about component behavior
- This component uses a `<button>` tag, so you can assume that it will behave just like a normal button, it can even handle tab index.
- A [ripple effect](https://material.google.com/motion/choreography.html#choreography-radial-reaction) is included when the button isn't disabled

## References
### Design references
* Material guidelines : https://material.google.com/components/buttons.html
* Guidelines : https://zpl.io/1KUaNN
* Usage and design on practice: https://zpl.io/UD4rp

### Examples in other libraries
* http://www.material-ui.com/#/components/raised-button
* http://materializecss.com/buttons.html
* https://www.muicss.com/docs/v1/css-js/buttons
* https://elements.polymer-project.org/elements/paper-button

### Issues history
* Created on https://hulihealth.atlassian.net/browse/HULI-1111
