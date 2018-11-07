# `<wc-calendar>` documentation

The calendar component allows date selection by choosing between the month's days.
It also supports minimum and maximum allowed dates restriction.

## API

### Props

| Name | Type | Required | Default | Description
| ---- | --- | --- | --- | ---
| days | Array | true | - | Names of the days of the week (E.g.: `['Monday', 'Tuesday', ...]`)
| months | Array | true | - | Names of the months of the year (E.g.: `['January', 'February', ...]`)
| value | String | false | null | Value represented as the selected day. **Allows data binding with `v-model`**. **Must be a date string in ISO format**
| min | String | false | null | String representation of the minimum allowed date. Represented in ISO format: `yyyy-MM-dd`
| max | String | false | null | String representation of the maximum allowed date. Represented in ISO format: `yyyy-MM-dd`

### Methods

#### `setValue(String value, Boolean shouldTriggerState)`

Sets the value of the calendar (the selected day)

| Param | Type | Required | Note
| ---- | --- | --- | ---
| value | String | true | Must be in ISO format ('yyyy-MM-dd')
| shouldTriggerState | Boolean | false | If the calendar should trigger an event for notifying its value changes

#### `setCurrentDate(Number month, Number year)`

Updates the current date of the calendar, for displaying the respective days for the given month and year

| Param | Type | Required | Note
| ---- | --- | --- | ---
| month | Number | false | -
| year | Number | false | -

### Events

* #### `input`

Fired when a day is selected. Sends the ISO string representation of the selected date as the event's payload.

**This event is required by `v-model` for handling parent-child interaction**


* #### `calendar-month-changed`

Fired when the calendar's current month is changed. This action happens when one of the arrows located at the calendar's header,
located in each side of the month's name, is clicked.

##### Event payload or parameters

``` json
{
    value : {String},   // calendar's current value
    target : {Number}   // value of the target month
}
```

* #### `calendar-year-changed`

Fired when the action of changing the calendar's month caused a change in the calendar's year too.
For example: if the current month is january and must be changed to december of the previous year.

##### Event payload or parameters

``` json
{
    value : {String},   // calendar's current value
    target : {Number}   // value of the target year
}
```

## Examples

``` html
<!-- Simple calendar definition -->
<wc-calendar v-bind:days="days" v-bind:months="months" v-model="birthday"></wc-calendar>

<!-- Calendar with minimum and maximum dates -->
<wc-calendar
    v-bind:days="days"
    v-bind:months="months"
    v-model="birthday"
    min="2017-01-01"
    max="2017-12-31">
</wc-calendar>

<!-- Calendar with event handling -->
<wc-calendar
    v-bind:days="days"
    v-bind:months="months"
    v-model="birthday"
    v-on:calendar-month-change="monthChangedHandler"
    v-on:calendar-year-change="yearChangedHandler">
</wc-calendar>
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| ---- | --- | --- |
| $wc-calendar-cell-size | Size of the cells containing the days of the month | 40px
| $wc-calendar-highlighted-color | Color of the number representing the current date (today) | $wc-secondary-color
| $wc-calendar-selected-background-color | Background color of the selected date | $wc-secondary-color-dark
| $wc-calendar-width | Calendar's maximum width | 288px

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/pickers.html#pickers-date-pickers
* Guidelines : https://zpl.io/1Nvvh2

### Examples in other libraries

* http://www.material-ui.com/#/components/date-picker
* http://www.webpackbin.com/EkGe5ZSHM (inspiration)

### Issues history

* Created on [HULI-1356](https://hulihealth.atlassian.net/browse/HULI-1356)
