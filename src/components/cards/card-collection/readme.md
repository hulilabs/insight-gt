# `<wc-card-collection>` documentation
A wrapper for a group of `<wc-card>` components, which provides enhanced interaction capabilities for the users and unified event management for developers.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| orchestrate | Boolean | no | true | should the card collection produce a unified change event when interaction with cards is detected
| hasOverlay | Boolean | no | true | should show an overlay over not active cards?
| scrollToCard | Boolean | no | true | should scroll to a after interacting with it?
| container | HTMLElement | no | null | container to center a card into (using scroll) instead of `window`

### Events
#### `cardorchestrator-card-change`
It is not a Vue event, but rather a custom browser event, built using the `CustomEvent`, triggered when the following happens:
* A card is activaded
* A card is closed
* A card is focused but it's not going to be activated later

The most important part is that the triggered event is related to the last action. Which means, that if you get a `focus` type `change` event, is because the card is being focused and not activaded. Also, if a card activation caused another one to close, you will receive references to both cards in the event's payload. And a `close` type event means that a card was closed, but there wasn't another one open before.

Event payload available at `event.detail`:

```
{
  type : <CardOrchestrator.CHANGE member (open, close or focus)>,
  openingCard : <card instance (if any)>,
  focusingCard : <card instance (if any)>,
  closingCard : <card instance (if any)>
}
```

As it is a `CustomEvent`, this event bubbles and can be cancelled by calling `event.preventDefault()`, which will cancel any of the operations listed above.

##### Managing the `change` event to perform validations
Since the exposed `cardorchestrator-card-change` event can be cancelled, it means you can stop the action being performed. i.e. if you call `e.preventDefault()`, the opening card won't open, neither will continue the closing or the focus of a card.

Also, there are actions that this component binds (like scrolling to an open card), that you may want to cancel. This is an example of how to manage the card change event to perform validations:

* We need to bind event to capture phase, so we can cancel the side effects, like scrolling to active cards

```html
<!-- on the card collection declaration -->
<wc-card-collection v-on:cardorchestrator-card-change.native.capture="_onCardCollectionChange">
```
* We need to cancel the current change event in the handler and make sure that no future change events are performed

```javascript
_onCardCollectionChange : function(e) {
    // the current validation is false, i.e. not valid
    var valid = false,
    // we set a flag to prevent further validation errors until the validation passes
        areThereCurrentlyValidationErrors = true;
    if (valid && ! areThereCurrentlyValidationErrors) {
        // cancel the event
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}
```

### Slots

#### Default slot
Should hold a set of `<wc-card>` components

## Examples
Please refer to the card demo page markup for further examples.

``` html
<!-- simple collection with orchestration, scroll to active and compact stack layout -->
<wc-card-collection>
  <wc-card title="I am a card"></wc-card>
  <wc-card title="I am a card"></wc-card>
</wc-card-collection>

<!-- simple collection without orchestration, nor scrolls to active -->
<wc-card-collection
  v-bind:orchestrate="false"
  v-bind:has-overlay="false"
  v-bind:scroll-to-card="false">
  <wc-card title="I am a card"></wc-card>
  <wc-card title="I am a card"></wc-card>
</wc-card-collection>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-card-collection-overlay-color | overlay to be shown over inactive cards | rgba(white, 0.6)

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/cards.html
* Guidelines : zpl.io/1iACdJ

### Examples in other libraries

* http://materializecss.com/cards.html
* https://www.webcomponents.org/element/PolymerElements/paper-card

### Issues history

* Created on https://hulihealth.atlassian.net/browse/HULI-1668
* Improved scroll to card on interaction event https://hulihealth.atlassian.net/browse/HULI-1924
* Added support to scroll to active card when the container isn't the `window` https://hulihealth.atlassian.net/browse/HULI-2804
