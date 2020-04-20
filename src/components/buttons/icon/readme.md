# `wc-icon-button` documentation

A `<button>` represented with an icon, with three available color setups:

| Name | BEM Modifier | Current result
| --- | --- | ---
| default | none | black on light background
| action | `wc-IconButton--action` | action's blue on light background
| light | `wc-IconButton--light` | white icon to use on dark background
| raised | `wc-IconButton--raised` | similar to raised button styles
| primary | `wc-IconButton--primary` |  white background color with black font color
| secondary | `wc-IconButton--secondaryDark` | lighter black (54%) on light background

This component wraps a `wc-icon` component. You can add modifiers to inner icon using the `iconModifier` prop; this way you're able to obtain different sizes `icon-buttons`. Refer to the examples below or the `wc-icon` documentation for details about the available sizes

## Props
| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| disabled | Boolean | no | none | should the button be disabled?
| hover | Boolean | no | false | Activates the styles(like focus) when the mouse is hover the element
| avatarPath | String | no | none | path to load an image and use it as icon
| disabledAvatarPath | String | no | none | alternative path to display for disabled image icon button
| avatarText | String | no | none | Text to be bound to the avatar component, check the avatar documentation.
| avatarClass | String | no | none | Class to be added to the avatar element
| iconClass | String | no | none | class to be added to the icon element
| iconContent | String | no | none | adds text inside the icon tag, when the icon isn't an image
| iconModifier | String | no | none | allows changing icon's size, see `wc-icon` documentation for available modifiers
| notification | Boolean | no | false | adds a notification indicator (a red dot)
| raised | Boolean | no | false | combines raised button styles
| smartFocus | Boolean | no | false | applies enhanced focus using `button-focus_behavior`
| imageIconPath | String | no | none | alternative path to display for disabled image icon button
| imageIconAlt | String | no | none | alt text when using `imageIconPath` and the image isn't loaded

Note that when the `imageIconPath` is set, the icon will be generated using an `<img>` tag, while leaving it blank will cause the icon to be generated using the `iconClass` and `iconContent` props as an `<i>` tag

## Usage examples

```html
<!-- Avatar icon button  -->
<wc-icon-button v-wc-ripple:is-dark avatar-path="/site/img/doctor-male.svg" smart-focus></wc-icon-button>
<wc-icon-button v-wc-ripple:is-dark avatar-text="Doctor" smart-focus></wc-icon-button>
<wc-icon-button  disabled avatar-path="/site/img/doctor-male.svg" ></wc-icon-button>
<wc-icon-button  avatar-path="/site/img/doctor-male.svg" avatar-class="wc-Avatar--size-6x" smart-focus></wc-icon-button>

<!-- default color scheme icon button  -->
<wc-icon-button v-wc-ripple:is-dark icon-class="icon-chat"></wc-icon-button>
<wc-icon-button icon-class="icon-chat" disabled></wc-icon-button>
<wc-icon-button class="is-selected" v-wc-ripple:is-dark icon-class="icon-chat"></wc-icon-button>
<wc-icon-button v-bind:has-hover="true" icon-class="icon-chat"></wc-icon-button>

<!-- action color applied on icon button with light background -->
<wc-icon-button class="wc-IconButton--action" v-wc-ripple:is-dark icon-class="icon-language"></wc-icon-button>
<wc-icon-button class="wc-IconButton--action" v-wc-ripple:is-dark icon-class="icon-language" disabled></wc-icon-button>

<!-- colored background with light icon button  -->
<wc-icon-button v-wc-ripple:is-light icon-class="icon-heart-solid" light></wc-icon-button>
<wc-icon-button v-wc-ripple:is-light icon-class="icon-heart-solid" light disabled></wc-icon-button>

<!-- bigger icon buttons usin icon-modifier prop and sizes relative to the grid's -->
<wc-icon-button v-wc-ripple:is-dark icon-class="icon-upgrade" icon-modifier="wc-Icon--size-4x"></wc-icon-button>
<wc-icon-button v-wc-ripple:is-dark icon-class="icon-upgrade" icon-modifier="wc-Icon--size-5x"></wc-icon-button>
<wc-icon-button v-wc-ripple:is-dark icon-class="icon-upgrade" icon-modifier="wc-Icon--size-6x"></wc-icon-button>

<!-- showing `new state` or notification-->
<wc-icon-button icon-class="icon-language" notification></wc-icon-button>

<!-- applying raised button styles -->
<wc-icon-button icon-class="icon-language" raised></wc-icon-button>
```

## Notes about component behavior
- This component uses a `<button>` tag, so you can assume that it will behave just like a normal button, it can even handle tab index and tab navigation.
- As a `<button>`, it can be triggered using either a click, an ENTER press or a SPACE BAR press (keyboard works when focused).
- A [ripple effect](https://material.google.com/motion/choreography.html#choreography-radial-reaction) can be added using the `v-wc-ripple` directive.
- This component uses enhanced [button focus behavior](../../behaviors/a11y/button-focus)

## References
### Design references
* Material guidelines: https://material.google.com/components/buttons.html
* Guidelines: https://zpl.io/gnI3k
* Usage and design on practice: https://zpl.io/UD4rp

### Examples in other libraries
* http://www.material-ui.com/#/components/icon-button
* http://materializecss.com/buttons.html
* https://www.muicss.com/docs/v1/css-js/buttons
* https://elements.polymer-project.org/elements/paper-button

### Issues history
* Created on https://hulihealth.atlassian.net/browse/HULI-1113
* Updated on [HULI-1588](https://hulihealth.atlassian.net/browse/HULI-1588): added new notification state
* Updated on [HULI-1823](https://hulihealth.atlassian.net/browse/HULI-1832): removed the hover state as default and added support for an avatar
* Updated on [HULI-3098](https://hulihealth.atlassian.net/browse/HULI-3098): adding back the image icon support
* Updated on [HULI-3543](https://hulihealth.atlassian.net/browse/HULI-3543): added secondary dark icon color
* Updated on [HULI-3699](https://hulihealth.atlassian.net/browse/HULI-3699): added raised prop for combining styles
