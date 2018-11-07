# `<wc-fab>` documentation

Floating Action Button. Usually contains the main or most frequent action of a section along with some extra actions that are shown only when the component is focused.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `actions` | Array | true | - | Definition of the actions that the FAB will handle. If more than one action is given, the FAB will handle a series of options that will be available when it's hovered/focused. The specs of an action definition are below
| `action.name` | String | true | - | Name of the event that will be triggered by the FAB when the action is clicked. These are used for binding event listeners from the FAB's parent component. They usually are defined in `snake-case`
| `action.icon` | String | true | - | Icon that will be displayed by the actions buttons. When there are more than 1 options, the FAB will change its own icon for that of the main action. If there's only 1 action, the FAB icon is overwritten
| `action.tooltip` | String | true | - | Text to be displayed in the action's tooltip
| `action.tooltipAlignment` | String | false | undefined | Value for overwriting the position of an action's tooltip
| `action.classObject` | Object | false | undefined | Custom class object for overwriting the action's styles
| `position` | String | false | undefined | Where the FAB will be positioned in the screen. The possible values are: `top-right`, `bottom-right`, `bottom-left`, `top-left`
| `mini` | Boolean | false | false | Gives the component's mini styling: it's dimensions are smaller
| `isMobile` | Boolean | false | false | Flag for matching the defined mobile behavior
| `classObject` | Object | false | {} | Custom class object for overwriting the FAB's styles. For example: handling of a FAB's absolute positioning

### Methods

#### `open`

Turns on the component's `active` state for displaying the additional options (if any)

#### `close`

Resets the component's `active` state, therefore hiding the additional options


### Events

#### `open`

Triggered by the method with the same name. Notifies the button was focused (hover in desktop, tap in mobile)

### Actions

#### `close`

Triggered by the method with the same name. Notifies the button lost focus (not hovered in desktop, blur in mobile)

## Examples

``` html
<!-- A very simple fab -->
<wc-fab v-bind:actions="actions"></wc-fab>

<!-- Fab with mobile behavior -->
<wc-fab v-bind:actions="actions" is-mobile></wc-fab>

<!-- Fab with mini styles -->
<wc-fab v-bind:actions="actions" mini></wc-fab>

<!-- Fab positioned at the top right of the screen -->
<wc-fab v-bind:actions="actions" position="top-right"></wc-fab>

<!-- Fab positioned at the bottom right of the screen -->
<wc-fab v-bind:actions="actions" position="bottom-right"></wc-fab>

<!-- Fab positioned at the bottom left of the screen -->
<wc-fab v-bind:actions="actions" position="bottom-left"></wc-fab>

<!-- Fab positioned at the top left of the screen -->
<wc-fab v-bind:actions="actions" position="top-left"></wc-fab>

<!-- Fab with event listeners -->
<wc-fab
    position="top-left"
    v-bind:actions="actions"
    v-on:first-action="doSomething"
    v-on:second-action="doSomethingElse"
    v-on:open="notifyFabOpened"
    v-on:close="notifyFabClosed"
></wc-fab>
```

``` javascript
Vue.extend({
    // other component's options
    data : function() {
        return {
            actions : [
                {
                    name : 'first-action',
                    icon : 'icon-add',
                    tooltip : 'First action'
                },
                {
                    name : 'second-action',
                    icon : 'icon-delete',
                    tooltip : 'Second action'
                }
            ]
        }
    },
    methods : {
        doSomething : function() {},
        doSomethingElse : function() {},
        notifyFabOpened : function() {},
        notifyFabClosed : function() {}
    }
});
```
## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-fab-background-color | Background color for the FAB (the button that's visible) in its normal state | $wc-accent-color
| $wc-fab-background-color-pressed | Background color for the FAB's pressed state | $wc-accent-color-dark
| $wc-fab-background-color-action | Background color for the actions displayed when the FAB is hovered/focused |  $wc-secondary-color
| $wc-fab-background-color-action-pressed | Background color for the actions in their pressed state | $wc-secondary-color-dark

### Modifiers

| Modifier | Description
| --- | ---
| `wc-Fab--mini` | Gives the mini FAB styles which basically are just smaller dimensions
| `wc-Fab--topRight` | Gives a `position: fixed` at the top right corner of the screen
| `wc-Fab--bottomRight` | Gives a `position: fixed` at the bottom right corner of the screen
| `wc-Fab--bottomLeft` | Gives a `position: fixed` at the bottom left corner of the screen
| `wc-Fab--topLeft` | Gives a `position: fixed` at the top left corner of the screen

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/buttons-floating-action-button.html
* Guidelines : https://zpl.io/fIi35

### Examples in other libraries

* https://elements.polymer-project.org/elements/paper-fab?view=demo:demo/index.html&active=paper-fab
* http://materializecss.com/buttons.html
* https://elements.polymer-project.org/elements/paper-fab?view=demo:demo/index.html&active=paper-fab
* https://github.com/PygmySlowLoris/vue-fab

### Issues history

* Created on [HULI-1921](https://hulihealth.atlassian.net/browse/HULI-1921)
