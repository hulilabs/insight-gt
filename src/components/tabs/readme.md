# `<wc-tabs>` documentation

The "tabs" component acts as a wrapper for several "tab" components. It encapsulates the logic of handling the selected tab, assigning the appropriate width to each tab (both in mobile and desktop) and the resizing of the tabs' text for fitting its container if possible.

## API

### Props

| Name | Type | Required | Default | Description|
| --- | --- | --- | --- | ---
| `selected` | Number, String | false  | null  | defines which tab, from the children scope, is the currently selected.

### Slots

| Name | Description |
| --- | --- |
| `default` | It should contain only definitions of `<wc-tab>` components, other content that isn't a `<wc-tab>` will be rendered but won't take part in the interaction between the component and its children. |

### Methods

#### `setSelected(index)`

Sets the tab which index matches the given value as selected. The selected tab will be highlighted with an element that will be moved to the direction of the tab and will resize according to the tab's width and position in the screen.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `index` | Number, String | true | value of the index of a tab child

#### `updateIndicator()`

Updates the position of the tab selected indicator for matching the currently selected tab position. It also resizes it so it also matches the selected tab width.

### Events

The Tabs component will emit the `tabs-change` event whenever a different tab is selected. **It's responsibility of the parent to handle this event.**

#### Usage example:

``` html
<!-- Parent's template -->
<wc-tabs v-on:tabs-change="selectedTabHandler">
    <!-- Children definition -->
</wc-tabs>
```

``` javascript
// Parent's component
selectedTabHandler : function(tabs) {
    this.state.currentTab = tabs.selected
}
```

#### Event payload
``` json
{
    selected : {Number|String}
}
```

## Examples

``` html
<!-- Tabs which children won't have custom indexes -->
<wc-tabs v-bind:selected="currentTab">
    <wc-tab>Foo</wc-tab>
    <wc-tab>Bar</wc-tab>    <!-- will be the selected one -->
    <wc-tab>Baz</wc-tab>
    <wc-tab>Qux</wc-tab>
</wc-tabs>

<!-- Tabs with children that have custom indexes -->
<wc-tabs v-bind:selected="currentCustomTab">
    <wc-tab index="foo">Foo</wc-tab>
    <wc-tab index="bar">Bar</wc-tab>
    <wc-tab index="baz" v-on:tab-clicked="doSomethingCustom">Baz</wc-tab>
    <wc-tab index="qux">Qux</wc-tab>    <!-- will be the selected one -->
</wc-tabs>

<!-- Dynamically generated tabs -->
<wc-tabs v-bind:selected="currentDynamicTab">
    <wc-tab v-for="tab in tabs" v-if="tab.active" v-bind:index="tab.index">{{tab.label}}</wc-tab>
</wc-tabs>
```

``` javascript
// Parent's component
data : function() {
    return {
        currentTab : 1,
        currentCustomTab : "qux",
        currentDynamicTab : "orange",
        tabs : [
            { active : true, index : "orange", label : "Orange"},
            { active : true, index : "apple", label : "Apple"},
            { active : true, index : "pear", label : "Pear"},
            { active : false, index : "pineapple", label : "Pineapple"}
        ]
    };
},
methods : {
    doSomethingCustom : function() {
        alert('this is something custom');
    }
}
```

## Styles

### Configuration variables

In **resource/web-components/scss/settings/_components** you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-tabs-background-color` | tabs wrapper background color | `$primary-color`
| `$wc-tabs-tab-indicator-background-color` | background color of the tabs highlighter for their active state | `$secondary-color`

# `<wc-tab>` documentation

## API

### Props

| Name | Type | Required | Default | Description|
| --- | --- | --- | --- | ---
| `autoSelectable` | Boolean | true  | null  | Indicates if the component should set as selected once is clicked.
| `disabled` | Boolean | false | false | Make the tab not selectable
| `index` | Number, String | false  | null  | value that indexes or identifies the tab within a container's scope

### Slots

| Name | Description
| --- | ---
| `icon` | helps to position an icon in the tab and will be visible only in mobile


### Methods

#### `setActive(Boolean value, Boolean shouldTriggerState)`

Updates the `isActive` state of the component.

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `value` | Boolean | true | must be different than the current isActive state's value
| `shouldTriggerState` | Boolean | false | if an event must be emmited for notifying the change


#### `setIndex(Number|String index)`

Sets the value of the tab's index **if it wasn't provided by the index prop**.

| Param | Type | Required
| ---- | --- | --- | ---
| `index` | Number, String | true

#### `getIndex()`

Returns the component's index.

#### `isDisabled()`

Gets the disabled state

### Events

**It's responsibility of the parent to handle these events**

#### `tab-selected`

Fired when the tab is clicked and has the `autoSelectable` prop in `true`.
Used by `wc-tabs` component for updating its state whenever a tab child is selected.

##### Event payload
``` json
{
    index : {Number|String},
    component : {Tab}
}
```

#### `tab-clicked`

Fired when the tab is clicked and has the `autoSelectable` prop in `false`. Doesn't send a payload.

## Examples

``` html
<!-- Tab with an icon (only visible in mobile) and its label's text -->
<wc-tab v-on:tab-selected="someParentMethod">
    <wc-icon slot="icon" icon-class="icon-laboratory"></wc-icon>
    Example
</wc-tab>

<!-- Tab with text and no icon -->
<wc-tab v-on:tab-clicked="someParentMethod">
    Text
</wc-tab>

<!-- Tab with icon and no text -->
<wc-tab>
    <wc-icon icon-class="icon-language"></wc-icon>
</wc-tab>

<!-- Disabled tab with text and no icon -->
<wc-tab disabled>
    Disabled
</wc-tab>

<!-- Tab which text has custom styles -->
<wc-tab>
    <span class="u-caption3 u-primary-text-disabled">Example</span>
</wc-tab>
```

## Styles

### Configuration variables

In **resource/web-components/scss/settings/_components** you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-tab-icon-size` | size of the tab's icon only visible on mobile | 24px
| `$wc-tab-font-color-highlight` | highlighted tab's label text color | `$wc-secondary-color`

## References

### Design references

* Material guidelines : https://material.google.com/components/tabs.html#
* Guidelines : https://zpl.io/Z2gkrd

### Examples in other libraries

* https://www.muicss.com/docs/v1/css-js/tabs
* https://elements.polymer-project.org/elements/paper-tabs
* http://posva.net/vue-mdl/#!/tabs
* http://tympanus.net/Development/TabStylesInspiration/
* https://vuetifyjs.com/components/tabs

### Issues history

* Created on [HULI-1515](https://hulihealth.atlassian.net/browse/HULI-1515)
* Updated on [HULI-1788](https://hulihealth.atlassian.net/browse/HULI-1788): Added `tab-clicked` event
