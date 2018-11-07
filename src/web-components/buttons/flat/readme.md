# `<wc-flat-button>` documentation
A flat `<button>`, follows material guidelines
- This component uses a `<button>` tag, so you can assume that it will behave just like a normal button, it can even handle tab index.
- A [ripple effect](https://material.google.com/motion/choreography.html#choreography-radial-reaction) can be added when the button isn't disabled, using the directive `v-wc-ripple`
- This component uses enhanced [button focus behavior](../../behaviors/a11y/button-focus)

## API
### Props
| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `disabled` | Boolean | no | none | should the button be disabled?
| `large` | Boolean | no | none | is the button larger?
| `smartFocus` | Boolean | no | false | applies enhanced focus using `button-focus_behavior`
| `link` | Boolean | no | false | applies styles to resemble a link: no paddings and darker font color when it's highlighted
| `active` | Boolean | no | false | allows to add directly the active styles to the button

## Examples
```html
<!-- flat button -->
<wc-FlatButton v-wc-ripple:is-dark>
    button
</wc-FlatButton>

<!-- disabled flat button -->
<wc-FlatButton disabled>
    disabled button
</wc-FlatButton>

<!--large Flat button -->
<wc-FlatButton v-wc-ripple:is-dark large>
    large button
</wc-FlatButton>

<!--disabled large Flat button -->
<wc-FlatButton disabled large>
    disabled large button
</wc-FlatButton>

<!-- Flat button with link styles -->
<wc-FlatButton link>
    link flat button
</wc-FlatButton>

<!-- Flat button with active styles -->
<wc-FlatButton v-bind:active="someCondition">
    active flat button
</wc-FlatButton>
```

## Styles

### Configuration variables

In `resource/web-components/scss/settings/_components` you can configure the next variables for this component (note that they'll also affect `<wc-raised-button>`):

| Variable | Description | Default
| --- | --- | ---
| `$wc-button-height` | button height | 40px
| `$wc-button-min-width` | button min width | 96px
| `$wc-button-padding` | button padding | 8px 16px
| `$wc-button-border-radius` | button border radius | 4px
| `$wc-button-large-margin` | applied margin if the button is large | 0 16px
| `$wc-button-large-max-width` | max width when the button is large | 384px
| `$wc-button-color-transition-duration` | smooth transition time that plays nice with ripple effect | 0.2s

## References
### Design references
* Material guidelines : https://material.google.com/components/buttons.html#buttons-flat-buttons
* Guidelines : https://zpl.io/gnI3k
* Usage and design on practice: https://zpl.io/gnI3k

### Examples in other libraries
* http://www.material-ui.com/#/components/flat-button

### Issues history
* Created on [HULI-1362](https://hulihealth.atlassian.net/browse/HULI-1362)
* Updated on [HULI-2471](https://hulihealth.atlassian.net/browse/HULI-2471): Adding `link` prop
* Updated on [HULI-3365](https://hulihealth.atlassian.net/browse/HULI-3365): Adding `active` prop
