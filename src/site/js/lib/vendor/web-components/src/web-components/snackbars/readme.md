# `<wc-snackbar>` documentation

Snackbars provide brief feedback about an operation through a message at the bottom of the screen.

## Implementation pending
* Support for swipe methods

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `useCSSTransitionProperties` | Boolean | No | True | whether or not it should use the default transition end properties to control the animations
| `duration` | Number | No | 8000 | milliseconds that the snackbar will be shown

### Methods

#### `show(notificationData)`
Adds a new notification to the queue to be shown asap. It receives an object in this format:

~~~~
{
    text : String, // first line of text when using the list item layout
    action : {
        text : String,
        handler : Function
    },
    // if want to use a list item layout
    listItem : Boolean,
    // second line of text when using the list item layout
    secondaryText : '',
    // avatar path when using the list item layout
    avatarPath : '',
    close : Boolean,
    showAtBottom : Boolean,
    duration : Number (milliseconds)
}
~~~~

Errors will be thrown in the following cases:

| Name | Description
| --- | ---
| No label text provided | It was caused because the notification did not contain any text to be shown. Notification will not be queued.
| No action text provided | It was caused because the action was required but no text for the button was provided. Notification will not be queued.
| No action handler provided | It was caused because the action was required but no handler function for the button was provided. Notification will not be queued.

#### `pause()`
If there are notifications being shown, it will pause the execution until it is resumed.
New notification can continue to be added but will be send to the queue.

#### `resume()`
It resumes the display of the notifications in the queue. If there is one alread displayed the timeout will be restarted.


## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---  | ---  | ---
| `$wc-snackbar-min-height`| Min height of the snackbar | 48px
| `$wc-snackbar-desktop-min-width`| Min width of the desktop and tablet snackbars. For mobile is 100%  | 288px
| `$wc-snackbar-desktop-max-width`| Max width of the desktop and tablet snackbars. For mobile is 100% | 568px
| `$wc-snackbar-desktop-bottom-position`| Bottom position of the snackbar when displayed | 24px
| `$wc-snackbar-desktop-left-position`| Left position of the snackbar when displayed | 24px
| `$wc-snackbar-label-color`| Color of the label text | `$wc-typoicon-base-light`
| `$wc-snackbar-close-color`| Color of the close button | `$wc-typoicon-base-light`
| `$wc-snackbar-background-color`| Background color of the snackbar | `$wc-primary-color-dark`

## References

### Design references

* Material guidelines: https://material.google.com/components/snackbars-toasts.html
* Guidelines: https://zpl.io/21GM4j

### Examples in other libraries

* Material design lite: https://getmdl.io/components/index.html#snackbar-section

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1355
* Updated on https://hulihealth.atlassian.net/browse/CS-110 : Added flags for allowing an action to be executed only once when it's clicked
