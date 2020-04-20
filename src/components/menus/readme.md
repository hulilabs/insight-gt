# `<wc-menu>` documentation

Menus appear upon interaction with a button, action, or other control. They display a list of choices, with one choice per line

Basically it is a container that is shown when a the bound element is clicked so it could have any component inside it.

## Implementation pending

* Remove `triggerElementSelector` as it depends on a DOM element which is against the VDOM implementation. As a temporal fix, a nextTick is used to delay the DOM lookup. A menu inside table or list-item components does not work without this temporal fix.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `active` | Boolean | false | false | State of the menu. True to open, false to close. **This can be useful if you want to bind the state of the dialog the parent component or vuex**
| `triggerElementSelector` | String | true | none | CSS Selector for the element that activates the menu, when this element is clicked, the menu will be shown
| `triggerScroll` | Boolean | false | false | Whether the scroll event should be triggered when the user scrolls a menu.
| `triggerOrigin` | Origin | true | null | See [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)
| `menuClass` | Array Object String | false | none | Optional class for the menu
| `customStyles` | Object | false | none | Optional inline styles
| `removeOverlay` | Boolean | false | false | If true, removes the overlay component from the template

Mixin props : [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

### Slots

| Name | Description |
| --- | --- |
| `default` | There is only the default slot, all the content inside the component will be added to the menu. |

**Example**

``` html
<!--Trigger element-->
<button id="button">...</button>
<!--Menu component-->
<wc-menu trigger-element-selector="#button" trigger-origin="bottom-left" menuClass="menuStack">
    <wc-list-item role="menuitem" v-wc-ripple:is-dark v-on:click.native="say('1')">first element first element first element first element first element first element first element first element</wc-list-item>
    <wc-list-item role="menuitem" v-wc-ripple:is-dark v-on:click.native="say('2')">second element</wc-list-item>
    <div class="wc-Divider wc-Divider--verticalSpace"></div>
    <wc-list-item role="menuitem" v-wc-ripple:is-dark v-on:click.native="say('3')">third element</wc-list-item>
    <wc-list-item role="menuitem" v-wc-ripple:is-dark v-on:click.native="say('4')">four element</wc-list-item>
</wc-menu>
```

### Events

#### `ON_CLOSE` :

Fired when the menu is closed by clicking the overlay or by hitting the `ESC` key

#### `ON_OPEN` :

Fired when the menu is opened.

#### Keyboard:

- **`ESC`** : close the menu.
- **`UP`** and down arrows: navigate between items.
- **`TAB`** : close the menu and focus the next element.
- **`SPACE`** and **`ENTER`** : triggers a click event in the item.

### Methods

#### `close()`

Closes the menu

#### `open()`

Opens the menu

#### `toggle()`

Toggle between close or open states

#### `getHeight()`

Returns the height of the menu

## Behaviors

* [Floating Layer](https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/floating-layer) : setup to use smart positioning by default
* [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

## Implementation

* **Warning** The menu items should be a Vue component because the menu automatically binds the keydown and click events to the menu items.
Check the role property in the [List-Item component](/tree/master/src/web-components/lists#role)

## Examples

``` html
<wc-menu ref="menu">
   //content
    ...
</wc-menu>
```

Parent component code:

``` javascript
// When the component is mounted, show the menu, getting the component via refs.
mounted : function() {
    this.$refs.menu.open();
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable  | Default
| --- | --- |
| `$wc-menu-min-width` | 124px |
| `$wc-menu-max-width` | 280px |
| `$wc-menu-max-width-desktop` | 292px |
| `$wc-menu-background-color` | `$wc-primary-color` |

## References

### Design references

* [Material design guidelines](https://material.google.com/components/menus.html)
* [Huli Guidelines - Menu](https://zpl.io/Z1rjLQj)

### Examples in other libraries

* [Material design lite menu](https://github.com/google/material-design-lite/tree/mdl-1.x/src/menu) : The code of this menu is based on the material design lite menu.

### Issues history

* Created on [HULI-1112](https://hulihealth.atlassian.net/browse/HULI-1112)
* Updated on [HULI-2029](https://hulihealth.atlassian.net/browse/HULI-2029): Removing visibility styles of `wc-Menu__container` for fixing blur event issues with card component
* Updated on [HULI-3788](https://hulihealth.atlassian.net/browse/HULI-3788): Temporal fix added to delay triggerElementSelector DOM lookup
