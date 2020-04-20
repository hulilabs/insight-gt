# Button focus behavior documentation
Enhances focus management for buttons. By default, there are two ways of triggering a button's focus state:

- Clicking the button: leaves the button in `focus` state
- Using TAB key: adds focus when navigating with tabs

However, if the button includes styling for `:focus` a click may cause an unwanted state, so this behavior provides a workaround to:
- Prevent displaying `:focus` styles if the button was clicked
  - It WILL be focused, it just won't look like that. i.e. we're not using `blur` to remove focus, we just remove the styling
- Display `:focus` styles if the button was focused using TAB

## Side effects
This behavior will bind three events listeners to an `HTML element`:
- `mousedown`: adds utilitary class `is-focus-disabled`, to remove `button:focus` styles
- `blur` & `keyup`: removes utilitary class `is-focus-disabled`

## A note about mobile devices
There are no specific bindings for mobile devices, as they require a special treatment since elements will also retain the `hover` state after a click, and that was considered out of scope.

## API reference
### ButtonFocusBehavior#bind
Main API method to add the effect to any DOM element, the following are the arguments:

| Name | Type | Description
| --- | --- | ---
| element | Element | DOM element to add smar focus management to

## Usage example

The following example includes the implementation of a `smartFocus` prop, which is the recommended implementation, since this behavior applies several event bindings. You may omit the prop in case you don't consider it as an issue in a particular case.

**Note:** Remember to add the respective `:focus`, `:hover` and `:active` styles to the target component, if needed.

```javascript
// inside a component's `mounted` hook
if (this.smartFocus) {
    ButtonFocusBehavior.bind(this.$el);
}
```

## References
* https://github.com/PolymerElements/iron-a11y-keys-behavior
* https://elements.polymer-project.org/elements/iron-behaviors
* https://elements.polymer-project.org/elements/paper-icon-button
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role