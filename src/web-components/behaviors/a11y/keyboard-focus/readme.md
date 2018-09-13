# Keyboard focus behavior documentation
Enhances focus management on custom controls, allowing focus management using keyboard keys. This behavior is applied to the parent element of a group of components.

* Currently supported keys *
* To move focus up: `UP`
* To mode focus down: `DOWN`

* Considerations *
* The components should implement a `getInput` method, that returns the `<input>`
* If there's no a `getInput` method, the behavior will use the component's root `$el` to apply focus

## Side effects
* A `keydown` event listener will be added to bound `element`
* A `focus` event listener will be added to the bound `element`

## API reference
### KeyboardFocusBehavior#bind
Main API method to add the effect to any DOM element, the following are the arguments:

| Name | Type | Description
| --- | --- | ---
| element | Element | DOM element to add focus management to, parent of the elements to change focus using the keyboard

### KeyboardFocusBehavior#add
Adds component to the array of elements to move through using keyboard keys

| Name | Type | Description
| --- | --- | ---
| component | Vue | component to add to watched list

### KeyboardFocusBehavior#down
Moves the focus to the not disabled element that's immediatly down from the current

### KeyboardFocusBehavior#up
Moves the focus to the not disabled element that's immediatly up from the current

### KeyboardFocusBehavior#onFocus
Bindable delegate handler to listen for focus events on an element, used to update the current focused element index reference

| Name | Type | Description
| --- | --- | ---
| e | Event | Focus event


## Usage example

```javascript
// inside a component's `mounted` hook
var checklistArrowBehavior = new KeyboardFocusBehavior();
checklistArrowBehavior.bind(this.$el);

// you have to call this method for every child that you want to include in the focus management
checklistArrowBehavior.add(this.$children.child1);
checklistArrowBehavior.add(this.$children.child2);
```

You can see an actual usage example in the `<wc-checklist>` component.

NOTE: you can also manually bind the `onFocus`, `up` and `down` handlers, in case you want to use `v-on` to support more triggers, in case you want to, for example, support LEFT and RIGHT arrow keys.

## Pending tasks
* Currently, only elements that already handle focus (like `<input>` tags) are supported. Support for roving tabindex should be added later in order to support every kind of elements.

## References
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets