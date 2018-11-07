# List components

A list consists of a single continuous column of tessellated sub-divisions of equal width called rows that function as containers for tiles.
Tiles hold content, and can vary in height within a list.

[Material design guidelines](https://material.google.com/components/lists.html)

**Example:**

``` html
<div>
    <wc-list-item>list item 1</wc-list-item>
    <wc-list-item>list item 2</wc-list-item>
</div>
```

# wc-list-item

## Props

| Name | Type | Required | Default | Description |
| --- | --- | ---  | ---  | ---
| `blockClass` | Array | false | [] | Custom class for the block element
| `expanded` | Boolean | false  | false  | Defines if the list is expanded or not (applicable only for expandable list items).
| `disabled` | Boolean | false | false | Disables the list item
| `horizontalPadding` | Number | false | false | Defines the horizontal padding of an item
| `multiline` | Boolean | false  | false | Allows multiline text in the item, doesn't cut the text
| `role` | String | false  | null | Defines the role of the item as part of the list and context. `menuitem` - component will have the hover, cursor pointer, press and focus states (it will behave like a but |
| `primaryTextClass` | String, Object, Array | false  | null | Custom class for the primaryText
| `secondaryTextClass` | String, Object, Array | false  | null | Custom class for the secondaryText
| `wrapperClass` | Array | false | [] | Custom class for the wrapper block element
| `value` | String, Number | false | null | Value of the list item

### layout

This component provides three different ways to display the information.


| Type | Required | Default | Options
| --- | --- | --- | ---
| String | No | 'single' | 'single', 'double', 'triple'

**single**: just one line of text, small size.

![Single list](https://github.com/hulilabs/web-components/raw/master/src/web-components/lists/img/single-line.png)

**double**: two lines of text, medium size.

![double list](https://github.com/hulilabs/web-components/raw/master/src/web-components/lists/img/two-line.png)

**triple**: three lines of text, big size.

![triple list](https://github.com/hulilabs/web-components/raw/master/src/web-components/lists/img/three-line.png)

## Slots

![component layout](https://github.com/hulilabs/web-components/raw/master/src/web-components/lists/img/slots.png)

The layout has three parts:

- The left column or primary action (a circle in the example)
- The middle column or text.
- The right column or secondary action (a box in the example)


This table shows the available slots with the corresponding column where it will be rendered

| Slot name | Column | Usage|
| --- | --- | --- |
| `avatar` | left | avatar component |
| `checkbox` | left | checkbox component |
| `icon` | left | icons
| `radioButton` | left | radio button
| `primaryText` | middle | title
| `secondaryText` | middle | for secondary text, above the title |
| `action` | right | actions like icon buttons, switches, etc |
| `description` | - | free content, this is used only for expandable lists

### Events

#### `list-item-expanded-changed` : Object

Fired when the user clicks a expandable list item. Provides an object with the `isExpanded` state of the component as payload.

**Example of three text lines with avatar and action** :

``` html
<div>
    <wc-list-item layout="triple">
        <wc-avatar slot="avatar"></wc-avatar>
        <span slot="primaryText">text1</span>
        <span slot="secondaryText">text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2</span>
        <wc-icon-button slot="action"></wc-icon-button>
    </wc-list-item>
    <wc-list-item layout="triple">
        <wc-avatar slot="avatar"></wc-avatar>
        <span slot="primaryText">text1</span>
        <span slot="secondaryText" >text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2</span>
        <wc-icon-button slot="action"></wc-icon-button>
    </wc-list-item>
</div>
```



### For one text line lists (default)

The default slot will treat its content as a primary text, this case should only used for one text line lists.

**Example** :

``` html
<div>
    <wc-list-item>list item 1</wc-list-item>
    <wc-list-item>list item 2</wc-list-item>
</div>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables:

| Variable | Description | Default
| --- | --- | ---
| $wc-list-item-width |width of tile | 100%
| $wc-list-item-single-height | height for one line of text | 48px
| $wc-list-item-double-height | height for two lines of text | 72px
| $wc-list-item-triple-height  | height for three lines of text | 88px
| $wc-list-item-background-color| background-color | $wc-primary-color;

### Modifiers

| Modifier | Description
| --- | ---
| wc-ListItem--double |It is taller than the default value, space for 2 lines of text, related to layout prop
| wc-ListItem--triple |It is taller than the default value, space for 3 lines of text, related to layout prop
| wc-ListItem.is-selected | set the style of the focus/hover states


## References

- [Material design guidelines](https://material.google.com/components/lists.html)
- [Zeplin guidelines](https://zpl.io/2v4Q4X)