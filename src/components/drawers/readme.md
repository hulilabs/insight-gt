# `wc-Drawer` documentation

The navigation drawer slides in from the left and contains the navigation destinations for your app.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `active`| Boolean | No | false | State of the nav. True to open, false to close. **This can be useful if you want to bind the state of the nav to the parent component or vuex** |
| `action` | String | No | - | Vuex's action name to be executed when the nav changes its state
| `swipe` | Boolean| No | true | Set to false to disable the swipe functionality

### Slots

| Name | Description |
| --- | --- |
| `content` | All the components/HTML inside this content will be displayed in the drawer when is opened. |

** Example : **

``` html
<wc-Drawer>
    <div slot="content">
        <button v-on:click="toggleDrawer">Close Drawer</button>
        <p>some text</p>
    </div>
</wc-Drawer>
```

### Methods

There are 3 basic methods
- `open()`
- `close()`
- `toggle()`

**Example :**

Parent template: **notice the ref attribute**
``` html
<wc-Drawer ref="drawer">
    <div slot="content">
        <p>Text</p>
    </div>
</wc-Drawer>
```

Parent component code:
``` javascript
// When the component is mounted, show the drawer, getting the component via refs.
mounted : function() {
    this.$refs.drawer.open();
}
```

### Events

### `ON_CHANGE`

The Drawer component will emit the 'change' event each time its state changes. **This approach can be used when
there is a Parent-Child communication.**

For example each time the drawer emits the 'change' event, the drawerChanged method (of its parent) will be called
with the payload as parameter.

Parent template:
``` html
    <wc-Drawer v-on:change="drawerChanged">
        <div slot="content">
            <button v-on:click="toggleDrawer">Close Drawer</button>
        </div>
    </wc-Drawer>
```

Parent component:
``` javascript
drawerChanged : function(payload) {
    this.state.isDrawerVisible = payload.active;
}
```

Event payload or parameters:
``` json
{
    active : {Boolean}
}
```

### Actions

The Drawer component will execute an action, if there is a store and an "action" prop defined.

``` html
<wc-Drawer action="navChanged">
    <div slot="content">
        <button v-on:click="toggleDrawer">Close Drawer</button>
    </div>
</wc-Drawer>
```

Event payload or parameters:
``` json
{
    active : {Boolean}
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the drawer:

| Variable | Description | Default
| --- | --- | ---
| `$wc-drawer-nav-background-color` | Nav background color | $primary-color
| `$wc-drawer-edge-width` | The edge element is the little space where it detects that the user has an intention of opening the drawer by swiping | 40px
| `$wc-drawer-nav-max-width` | Maximum width of the nav | 280px
| `$wc-drawer-nav-width` | Nav width | 90%

### Modifiers

| Variable | Description
| --- | ---
| `wc-Drawer--appBar` | Adds a margin-top equal to the app bar height, just for the edge part of the drawer, the one that triggers the
swipe gesture to open it.

## References:

- [Side Navigation Bar: Live Code Session - Supercharged](https://www.youtube.com/watch?v=e5CXg1sjTqQ)
- [Polymer, paper-drawer](https://github.com/PolymerElements/paper-drawer-panel)
- [Material UI, react](https://github.com/callemall/material-ui/tree/master/src/Drawer)
