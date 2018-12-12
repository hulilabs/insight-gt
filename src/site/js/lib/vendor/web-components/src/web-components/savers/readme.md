# `<wc-saver>` documentation

Saver component. It is an element that gives feedback to the user when something is completed in the right way. It is displayed as an inline block and has the following animations: circle, check maker and fade out animation.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `keepVisible` | Boolean | false | false | Keeps the saver visible after the animation ends

### Events

#### ON_CLOSE : { Element value }

Fired when the closeTimeOut prop expires

## Examples

``` html
<!-- listen to the close event -->
<wc-saver v-on:saver-close="closeSaver"></wc-saver>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-saver-time-on-screen | Time that the saver will be on the screen | 2 seconds
| $wc-saver-fade-animation-duration | time of the fade animation | 0.3 seconds

## References

### Design references

* Guidelines : https://zpl.io/Z1PkpC0

### Issues history

* Created on [HULI-1675](https://hulihealth.atlassian.net/browse/HULI-1675)