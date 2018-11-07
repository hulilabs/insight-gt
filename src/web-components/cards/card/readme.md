# `<wc-card>` documentation

## Common gotchas & troubleshooting
* To add a clickable actions inside of a card, you MUST add the 'js-card-action' class to the target and bind it like this: `v-on:click.stop="foo('bar')"` so the card won't trigger a focus attempt caused by the action click;
* For a better management of card's blur, it is recommended to add a negative tabindex (`tabindex="-1"`) to the app's main container, to prevent the document's `body` from gaining focus when the user clicks outside of a card; as this is validated as a workaround for the issue detailed on [HULI-2292](https://hulihealth.atlassian.net/browse/HULI-2292).

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `activeMaxHeight` | Number | no | none | Limits active height and adds a vertical scroll if needed
| `compactLayout` | Boolean | no | false | should remove the card's margins to look compact?
| `focusStyle` | String | no | `Card.FOCUS.LINE` | Focus visual style, can be 'line' or 'raise'
| `fullscreenActive` | Boolean | no | true if mobile | displays the card in fullscren mode when active
| `loading` | Boolean | no | false | displays the linear loader in the card header
| `name` | String | no | none | card identifier to be used as part of the triggered events
| `raisedOnActive` | Boolean | no | true | Enable raise animation when card becomes active
| `resizeOnContentChange` | Boolean | no | true | automatically resizes the card when the content changes while active
| `restingMaxHeight` | Number | no | none | Limits resting height and adds a vertical scroll if needed
| `showActions` | Boolean | no | true | show the card header's actions?
| `tabindex` | String | no | "0" | allows overriding the tabindex (not recommended)
| `title` | String | no | none | card header text
| `titleClass` | String | no | none | modifier CSS class card header text
| `titleDivider` | Boolean | no | true | On active state, include a divider between title and content
| `hasError` | Boolean | no | false | Tells wether card-level error feedback should be shown
| `titleHintText` | String | no | null | text to be added next to the title
| `titleHintClass` | String | no | null | class to apply to `titleHintText`
| `stickHeaderTo` | String | no | null | Selector to make the card's header sticky to an element instead of the window
| `compact` | Boolean | no | false | a more compact version with a smaller header and padding

### Slots

| Name | Description |
| --- | --- |
| `default` | Card content that is always displayed |
| `header` | Custom card header. Always prefer using the title prop whenever it's possible, because you will need to implement the navigation if you use this slot |
| `active` | Card content to be displayed only if the card is active |
| `resting` | Card content to be displayed only if the card is resting |
| `navigation` | Used to navigate from fullscreen card back to a closed card, it's commonly an icon |
| `actions` | Actions section of the card header |

### Methods

### `open()`
Opens a card:
* Raises the card
* Shows the `active` slot content
* Doesn't trigger any events

### `close()`
Closes a card:
* Changes the card to resting
* Shows the `resting` slot content
* Doesn't trigger any events

### `focus()`
Focuses a card only visually

### `updateHeight()`
Updates the card's height according to its currently displayed content. E.g. if the card is currently open, the card's will be resized to match its active content height.

### Events

#### Custom events

The following events aren't Vue events. They use the `CustomEvent` API, so they behave as a native event; i.e. they bubble, you can use `stopPropagation` and `preventDefault` to cancel them.

However, for error management, I recommend to use `CardCollection#CHANGE` event.

* ##### `card-open`
Triggered by a card open attempt. It has no payload.

* ##### `card-close`
Triggered when a card is closed. If the close action was the result of focusing another element, the related element will arrive in `event.detail.relatedTarget`

* ##### `card-focus`
Triggered when a card is focused. In `event.detail.hasOpenAttempt` a flag will be included, and it will be true if the user is attempting to open the card, like when the card is clicked

#### Vue events

* ##### `card-opened`
Triggered whenever the card's open operation succeeded. This one can't be cancelled.

* ##### `card-closed`
Triggered whenever the card's close operation succeeded. This one can't be cancelled.

* ##### `card-transition-end`
Triggered when a card's `width` transition ends, to make sure it is triggered only once per transition.

* ##### `card-fullscreen-change`
Triggered when a card's `fullscreenActive` value changes. Provides the new prop value and the card's current active state.

## Examples
Example simple configurations:

``` html
<wc-card name="Cardio">
    This card's name is Cardio. Programmers can identify this card by that name.
    Cardio's hobbies include watching soap operas and fortunetelling.

    You should always add a name to a card.
</wc-card>

<wc-card class="wc-CardCollection__card" v-bind:resting-max-height="100" v-bind:active-max-height="200">
    This card has its height limited to 100px when resting.
    This card has its height limited to 100px when raised.
</wc-card>

<wc-card v-bind:fullscreen-active="true" title="A fullscreen card">
    This card will be displayed fullscreen, but the trick will only work in mobile.
    You may want to manage the fullscreenActive adaptively, or just leave the card handle it.
</wc-card>

<wc-card title="A relevant card" title-class="u-headline">
    This cards displays the header "A relevant card".
    It's so relevant that it has a headeline-styled title. Wow.
</wc-card>

<wc-card title="Slots card">
    <div slot="resting">
        This is shown only when the card is resting.
    </div>
    <div slot="active">
        This is shown only when the card is active/raised.
    </div>
    <div>
        This is always show.
    </div>
</wc-card>

<wc-card resize-on-content-change>
    When raised, this card will automatically resize whenever its content changes.
    It does it by default though.
</wc-card>

<wc-card  focus-style="raise">
    This card will raise when focused
</wc-card>

<wc-card  focus-style="line">
    This card will display a blue line when focused
</wc-card>

<!-- consecutive cards with compact layout will display no margins between them -->
<wc-card compact-layout>we are</wc-card>
<wc-card compact-layout>so together</wc-card>

<!-- this card has icons and buttons, but not a header -->
<wc-card class="wc-CardCollection__card" focus-style="raise">
    <div class="wc-Card__tile wc-Card__tile--top">
        <div slot="actions" class="wc-Card__iconsTile wc-Card__iconsTile--right">
            <wc-icon-button icon-class="icon-code" class="wc-Card__iconButton"></wc-icon-button>
            <wc-icon-button icon-class="icon-badge" class="wc-Card__iconButton"></wc-icon-button>
            <wc-icon-button icon-class="icon-birthday" class="wc-Card__iconButton"></wc-icon-button>
        </div>
    </div>
    <p>This card has buttons and icon buttons, but it does not have a header</p>
    <p>If you add a header, you must add the icon buttons into the actions slot</p>

    <div class="wc-Card__tile wc-Card__tile--bottom">
        <div class="wc-Card__buttonsTile">
            <wc-flat-button class="wc-Card__button">button</wc-flat-button>
            <wc-flat-button class="wc-Card__button">button</wc-flat-button>
            <div class="wc-Card__iconsTile wc-Card__iconsTile--bottomRight">
                <wc-icon-button icon-class="icon-card" class="wc-Card__iconButton"></wc-icon-button>
                <wc-icon-button icon-class="icon-card" class="wc-Card__iconButton"></wc-icon-button>
            </div>
        </div>
    </div>
</wc-card>

<!-- This card has a header with actions -->
<wc-card class="wc-CardCollection__card" focus-style="raise" name="example" title="Card with icon action">
    <div slot="actions">
        <div class="wc-Card__iconsTile">
            <wc-icon-button class="wc-Card__iconButton" v-on:click.native="_someHandler" icon-class="icon-badge"></wc-icon-button>
        </div>
    </div>
    <p>If you add a header, you must add the icon buttons (if any) into the actions slot</p>
    <p>But be careful, only a few icons will fit on mobile screens, and you don't want your card to be messed up</p>
    <p>Also, that icon has an action bound</p>
</wc-card>

<!-- Resting only card -->
<wc-card class="wc-CardCollection__card"
    tabindex="-1"
    title="Resting only card"
    v-bind:title-divider="false"
    v-bind:raised-on-active="false"
    v-bind:fullscreen-active="false">
    <wc-textfield label="Text me!"></wc-textfield>
    <wc-textfield label="Tabbing is fun"></wc-textfield>
    <wc-textfield label="Tab! Tab! Tab!"></wc-textfield>
</wc-card>

```
Please refer to the card demo page markup for further examples.

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the following variables for the component:

| Variable | Description | Default
| --- | --- | ---
| $wc-card-min-width | card minimum width | 168px
| $wc-card-max-width | card max width | 608px
| $wc-card-desktop-max-width | card max width but in desktop | 816px
| $wc-card-header-min-height | minimum reserved space for the header | 56px
| $wc-card-border-radius | default border radius | 4px
| $wc-card-background-color | card's background | white
| $wc-card-resting-compact-divider-color | line shown between resting cards with compact layout | $wc-dividers-dark

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/cards.html
* Guidelines : zpl.io/1iACdJ

### Examples in other libraries

* http://materializecss.com/cards.html
* https://www.webcomponents.org/element/PolymerElements/paper-card

### Issues history

* Created on [HULI-1668](https://hulihealth.atlassian.net/browse/HULI-1668)
* Updated on [HULI-1924]( https://hulihealth.atlassian.net/browse/HULI-1924) added TRANSITION_END event
* Error block support added on [HULI-1670](https://hulihealth.atlassian.net/browse/HULI-1670)
* Added support for resting-only cards (aka. always-editable) [HULI-2176](https://hulihealth.atlassian.net/browse/HULI-2176)
* Fullscreen/raise styles for active state are applied according to the status and not the current media, so we can have a better device, without depending on this repo's breakpoints [HULI-2283](https://hulihealth.atlassian.net/browse/HULI-2283)
* Adding a workaround to prevent unexpected card close when there's a focused element inside that's removed from DOM, which happened commonly when there were lists or menus inside of the card, that dissappeared after user interaction [HULI-2292](https://hulihealth.atlassian.net/browse/HULI-2292)
* Changing breakpoints to better match ipad resolution [HULI-2488](https://hulihealth.atlassian.net/browse/HULI-2488)
* Allowing card header to be sticky to any element instead of just window, using `stickHeaderTo` prop [HULI-2574](https://hulihealth.atlassian.net/browse/HULI-2574)
* Allowing card's fullscreen-state related bindings to be executed when `fullscreenActive` prop changes [HULI-2965](https://hulihealth.atlassian.net/browse/HULI-2965)