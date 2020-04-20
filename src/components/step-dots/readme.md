# `<wc-step-dots>` documentation

Component for implementing step indicators. Represents each step as a dot

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `size`  | Number | yes | none | amount of steps
| `selected` | Number | no | 1 | one-based index of the selected step

### Methods

#### `setSelected(Number index)`

Sets the selected step

Param | Type | Required | Note
---- | --- | --- | ---
index | Number | true | one-based index

#### `setSize(Number size)`

Sets the amount of steps

Param | Type | Required
---- | --- | ---
size | Number | true

## Examples

``` html
<!-- 5 step dots and the second selected -->
<wc-step-dots ref="stepDots" size="5" selected="2"></wc-step-dots>

<!-- 3 step dots and the third one selected, in its light theme -->
<wc-step-dots ref="stepDots" size="3" selected="3" class="wc-StepDots--light"></wc-step-dots>
```

``` javascript
<!-- Increase size to 6 steps -->
this.$refs.stepDots.setSize(6);

<!-- Set last step as selected -->
this.$refs.stepDots.setSelected(6);
```
## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-step-dots-dot-size` | size of the dot elements | 4px
| `$wc-step-dots-dot-spacing` | spacing between two dots represented by a margin-left | 8px
| `$wc-step-dots-dot-background-color` | normal state background color | `$wc-typoicon-disabled-dark`
| `$wc-step-dots-dot-background-color-active` | active state background color | `$wc-typoicon-primary-dark`
| `$wc-step-dots-dot-background-color-light` | background color for the light modifier | `$wc-typoicon-disabled-light`
| `$wc-step-dots-dot-background-color-active-light` | background color for the active state light modifier | `$wc-typoicon-primary-light`

## Modifiers

| Variable | Description
| --- | ---
| `wc-StepDots--light` | Changes the background color of the step dots to a light version

## References

### Design references

* Material guidelines : https://material.google.com/components/steppers.html
* Guidelines : https://zpl.io/ZDJJkq

### Examples in other libraries

* http://www.material-ui.com/#/components/stepper

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1512
* Updated on [HULI-1514](https://hulihealth.atlassian.net/browse/HULI-1514): Removed usage of dot component
* Updated on [HULI-1859](https://hulihealth.atlassian.net/browse/HULI-1859): Changing onboarding background color and removing overlay color, now it's always transparent
