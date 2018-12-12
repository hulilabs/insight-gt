# Sticky section behavior documentation
Allows an element inside of wrapper to become sticky when the scroll makes the wrapper appear cut (like a material card's header).

Please note that this was made mostly to work with `<wc-card>` component, and no further implementations were tested during initial development.

## API

### Constructor
The constructor takes the following arguments:
| Name | Type | Description
| --- | --- | ---
| stickySection | Element | section to make sticky/fixed
| wrapper | Element | element that wraps the sticky section and that triggers the sticky when cut
| onStickyChange | Function | called when the sticky status change (i.e. began being sticky or stopped)

### `StickySectionBehavior#bind()`

Adds page scroll listener to make an element sticky

### `StickySectionBehavior#unbind()`

Removes scroll listeners added in StickySectionBehavior#bind and removes sticky section leftovers