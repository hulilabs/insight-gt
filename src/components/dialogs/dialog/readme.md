# `wc-Dialog` documentation

Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.

Dialogs contain text and UI controls. They retain focus until dismissed or a required action has been taken. Use dialogs sparingly because they are interruptive.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `active` | Boolean | No | false | State of the dialog. True to open, false to close. **This can be useful if you want to bind the state of the dialog to the parent component or vuex**
| `action` | String | No | - | Vuex's action name to be executed when the nav changes its state
| `closeOnClick` | Boolean| No | true  | Set to true to allow the user to close the dialog by clicking in the overlay
| `closeOnEscKey` | Boolean| No | true | Set to true to allow the user to close the dialog by pressing the ESC key
| `title`| String| No | null | Dialog Title
| `stylesObject` | JSON| No | empty | Object that overrides the styles in the component.

`stylesObject` has the following these keys:

| Key | Description
| --- | ---
| dialog | Rules apply to the dialog component, the window
| title | Rules apply to the prop title
| content | Rules apply to the slot content
| actions | Rules apply to the slot actions

Example :

``` json
dialog : {
    width : '98%',
    max-width : '98%'
},
title : {
    color : 'red'
},
content : {
    font-size : '10px'
},
actions : {
    background-color : 'green'
}
```

### Slots

| Name | Description |
| --- | --- |
| `content` | All the components/HTML inside this content will be displayed in the drawer when is opened. |
| `actions` | Place to add button actions(affirmative or dismissive) |

** Example : **

```html
<wc-dialog title="My First dialog">
    <div slot="content">
        <p>some text</p>
        <p>more text</p>
    </div>
    <div slot="actions">
        <button>Accept</button>
        <button>Deny</button>
    </div>
</wc-dialog>
```

### Methods

There are 2 basic methods:

- `open()`
- `close()`

**Example :**

Parent template: **notice the ref attribute**

``` html
<wc-dialog ref="dialog">
    <div slot="content">
        <p>Text</p>
    </div>
    ...
</wc-dialog>
```

Parent component code:

``` javascript
// When the component is mounted, show the dialog, getting the component via refs.
mounted : function() {
    this.$refs.dialog.open();
}
```

- `scrollTop(number)` : controlls dialog's inner content scroll. For example, `dialogInstance.scrollTop(0)` will scroll up to the beginning of the dialog's content.

- `recalculateHeight()` : recalculates the height of the dialog, based on updated content after the dialog has been initialized. For example, `dialogInstance.recalculateHeight()` will recalculate the height of the dialog, useful when the content updates after the dialog has been initialized.

### Events

#### `ON_CHANGE`

The Drawer component will emit the 'change' event each time its state changes. **This approach ca be used when
there is a Parent-Child communication.**

For example each time the dialog emits the 'change' event, the dialogChanged method (of its parent) will be called
with the payload as parameter.

Parent template:

``` html
<wc-dialog v-on:change="dialogChanged">
    <div slot="content">
       ...
</wc-dialog>
```

Parent component:

``` javascript
dialogChanged : function(payload) {
    // the dialog was closed ...
}
```

Event payload or parameters:
``` json
{
    active : {Boolean}
}
```

### Actions

If there is a store(Vuex) and an "action" prop defined the dialog will execute the action.

``` html
<wc-dialog action="dialogChanged">
    <div slot="content">
   ....
</wc-dialog>
```

Event payload or parameters:
``` json
{
	active : {Boolean}
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the dialog:

| Variable | Description | Default
| --- | --- | ---
| `$wc-dialog-width` |width of the dialog, it is dynamic | 88%
| `$wc-dialog-max-width` | maximum width of the dialog | 896px
| `$wc-dialog-min-width`| minimum width of the dialog | 280px
| `$wc-dialog-max-height` | maximum height of the dialog | 280px
| `$wc-dialog-min-height` | minimum height of the dialog | 120px
| `$wc-dialog-desktop-width`  | width of the dialog, it is dynamic, but for desktop | 55%
| `$wc-dialog-desktop-max-height` | maximum height of the dialog, but for desktop | 544px

## References

* [Polymer, paper-dialog demo](https://elements.polymer-project.org/elements/paper-dialog)
* [Polymer, paper-dialog code](https://github.com/PolymerElements/paper-dialog-behavior/)

### Design references

* [Material UI, react](http://www.material-ui.com/#/components/dialog)
* [Materializecss](http://materializecss.com/modals.html)
