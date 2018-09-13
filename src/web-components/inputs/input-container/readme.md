# `<wc-input-container>` documentation

## Implementation details (MUST READ)

The initial implementation of this component was manipulating directly the DOM. This isn't recommended by the framework because those changes could be overwritten in future __"ticks"__ or patching/re-rendering cycles, which was causing integration problems at app level.

This guide explains how to properly use the `input-container` component.

#### Scoped slots

The component's `default` slot is dedicated exclusively for passing some kind of `input` element, which will be styled and given the expected behavior of a material design textfield. The implementation approach, for exposing this behavior whilst maintaining the component agnostic to its content, is using [Vue's scoped slots](http://vuejs.org/v2/guide/components.html#Scoped-Slots).

Basically, the input container's `default` slot exposes the following properties that must be directly bound to the parent component's input element:

| Property | Type | Description
| --- | --- | ---
| `inputClass` | String | Class name for applying the appropriate textfield styles to the input element
| `onFocus` | Function | Handler of the input element's `focus` event. Used for turning **ON** the `focus` state flags
| `onBlur` | Function | Handler of the input element's `blur` event. Used for turning **OFF** the `focus` state flags

#### Custom action

A custom action sent as the `action` slot must comply with the following rules, which have to be applied at the parent element for this to work:
* Having `wc-InputContainer__action` class: allows the properly styling of the action
* Having a `tabindex` value of `-1`: prevents the action to be focused by the keyboard navigation and prevent to lose input element's focus state when the action is clicked

These conditions were previously handled by the component but were modifying directly the DOM, since this isn't recommended as previously explained now this must be handled at the parent component.

#### Implementation example

``` html
<wc-input-container>
    <template slot-scope="inputContainerScope">
        <input tabindex="0"
            v-bind:class="[inputContainerScope.inputClass]"
            v-on:focus="inputContainerScope.onFocus"
            v-on:blur="inputContainerScope.onBlur"/>
    </template>
    <button slot="action" class="wc-InputContainer__action" tabindex="-1">Press me!</button>
</wc-input-container>
```
1. `<template slot-scope="inputContainerScope">` allows the usage of the properties exposed by the `default` slot's scope
2. `<input tabindex="0"` handles the input's tabindex. Could be changed depending on the parent component's requirements
3. `v-bind:class="[inputContainerScope.inputClass]"` an array is used for allowing other class binding
4. `v-on:focus="inputContainerScope.onFocus"` the `focus` event listener is attached with the exposed handler
5. `v-on:blur="inputContainerScope.onBlur"` the `blur` event listener is attached with the exposed handler

## API

### Props

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `value` | [String, Number] | false | null | A reactive property bound to the input element. For keeping track of the input's value
| `required` | Boolean | false | false | Marks the input element as required (*)
| `disabled` | Boolean | false | false | Input's disabled attribute
| `labelFor` | String | false | null | Target input's name, used in the "for" attribute of the input for association
| `maxLength` | Number | false | null | Input's maximum allowed length (used by the character counter)
| `minLength` | Number | false | null | Input's minimum allowed length (used by the character counter)
| `hideInputHighlighter` | Boolean | false | false | Whether or not the input highlighter should be shown

**NOTE:** maxLength and minLength props aren't binded to the input element, which means that the parent of both the input element and input container must bind those attributes to the input too.

### Slots

| Slot name | Usage
| --- | ---
| `suffix` | Text or content placed besides (after) the input element
| `action` | An action that is placed at the end of the input. E.g. a clear button
| `default` | Where the input element is given

### Methods

#### `focus()`

Sets the focus state and triggers the focus event

### Events

#### `focus` : { Event e, String value }

Fired when the input field gains focus. Provides current value payload and the event's info

#### `blur` : { Event e, String value }

Fired when the input field loses focus (a.k.a. blur). Provides current value payload and the event's info

## Examples

``` html
<!-- A simple input wrapped by the container, with floating label -->
<wc-input-container label="label" label-for="example" floating-label>
    <template slot-scope="inputContainerScope">
        <input v-bind:class="[inputContainerScope.inputClass]"
            v-on:focus="inputContainerScope.onFocus"
            v-on:blur="inputContainerScope.onBlur"/>
    </template>
</wc-input-container>

<!-- An input wrapped by the container, with a suffix -->
<wc-input-container>
    <template slot-scope="inputContainerScope">
        <input v-bind:class="[inputContainerScope.inputClass]"
            v-on:focus="inputContainerScope.onFocus"
            v-on:blur="inputContainerScope.onBlur"/>
    </template>
    <span slot="suffix">World!</span>
</wc-input-container>

<!-- A div element wrapped by the container, with floating label -->
<wc-input-container label="label" floating-label>
    <template slot-scope="inputContainerScope">
        <div v-bind:class="[inputContainerScope.inputClass]"
            v-on:focus="inputContainerScope.onFocus"
            v-on:blur="inputContainerScope.onBlur">
            Hello!
        <div>
    </div>
</wc-input-container>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-input-container-color-disabled | Color for the disabled status | $wc-typoicon-disabled-dark
| $wc-input-container-element-border-bottom-color | Input's border color when in normal state | $wc-dividers-dark
| $wc-input-container-element-color | Color of the input element's content | $wc-typoicon-primary-dark
| $wc-input-container-highlighter-background-color | Color of the input's border when in active state | $wc-secondary-color-dark
| $wc-input-container-label-color | Label's color when in normal state | $wc-typoicon-secondary-dark
| $wc-input-container-label-color-focus | Label's color when in focused state | $wc-secondary-color-dark
| $wc-input-container-suffix-color | Color of the suffix's content | $wc-typoicon-primary-dark

### Modifiers

| Variable | Description
| --- | ---
| `is-title` | increases the size of the input and label font to title styles
| `is-headline` | increases the size of the input and label font to headline styles

## References

### Design references

* Material guidelines : https://material.google.com/components/text-fields.html
* Guidelines : https://zpl.io/Z2absbx

### Examples in other libraries

* https://github.com/PolymerElements/paper-input/
* https://github.com/PolymerElements/paper-input/blob/master/paper-input-container.html

### Issues history

* Created on [HULI-1728](https://hulihealth.atlassian.net/browse/HULI-1728)
* Updated on [HULI-1705](https://hulihealth.atlassian.net/browse/HULI-1705): Adding support for `headline` and `title` font sizes
* Updated on [CS-92](https://hulihealth.atlassian.net/browse/CS-92): Replacing DOM manipulation for required classes and events binding with scoped slots
