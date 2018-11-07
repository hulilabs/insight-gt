# `<wc-datepicker>` documentation

A datepicker with two versions: **native** which uses the browser's own input type date and a **custom** one, which consists in a custom logic field with an option to display a dialog for allowing the selection of the year, month and a __calendar__ for the day selection.

## Implementation pending

* Don't lose focus when the input is clicked

## API

### Props

@see [InputBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props)

@see [InputContainerBehavior](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/input#props-1)

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| ~~`placeholder`~~* | ~~String~~ | ~~false~~ | ~~null~~ | ~~Input's placeholder text~~

\* **The specification for this prop is overwritten by the datepicker**

Datepicker's own props:

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `days` | Array | true | - | List of the names of days of the week
| `months` | Array | true | - | List of months' names
| `monthLabel` | String | true | - | Translation for the "Month" label
| `yearLabel` | String | true | - | Translation for the "Year" label
| `format` | String | true | - | Format for the custom logic field. **Must allow numbers only. E.g.:** `##/##/####`
| `full` | Boolean | false | false | If the datepicker should contain the full options for selecting the year, month and day
| `native` | Boolean | false | false | If the datepicker should be a native input type date (useful for mobile implementations)
| `min` | String | false | null | ISO formatted string representation of the minimum allowed date, for the calendar date picker
| `max` | String | false | null | ISO formatted string representation of the maximum allowed date, for the calendar date picker
| `placeholder` | String | false | null | Mask for the custom logic field. **Years must be represented with:** `yyyy`**, months: **`mm`**, days: **`dd`

### Methods

#### `setValue(String value, Boolean shouldTriggerState)`

Sets the datepicker's value

| Param | Type | Required | Note
| ---- | --- | --- | ---
| `value` | String | true | Must be in ISO format ('yyyy-MM-dd')
| `shouldTriggerState` | Boolean | false | If the datepicker should trigger an event for notifying its value changes

### Events

* #### `input`

Fired when a date is selected. Sends the ISO string representation of the selected date as the event's payload.

**This event is required by `v-model` for handling parent-child interaction**

* #### `focus`

Fired when the datepicker's input gains focus or when the dialog is opened. Sends the ISO string representation of the selected date as the event's payload.

* #### `blur`

Fired when the datepicker's input loses focus or when the dialog is closed. Sends the ISO string representation of the selected date as the event's payload.

* #### `datepicker-invalid-value`


Fired when the datepicker's initial value is invalid or in the `blur` event when the value entered in the custom logic component doesn't correspond to a valid date. Sends the value entered in the input.
## Examples

``` html
<!-- Custom datepicker, required and with floating label -->
<wc-datepicker
    v-model="value"
    v-bind:months="months"
    v-bind:days="days"
    month-label="Month"
    year-label="Year"
    label="Label"
    floating-label
    required>
</wc-datepicker>

<!-- Custom full datepicker, with year and month selectors and floating label -->
<wc-datepicker
    v-model="value"
    v-bind:months="months"
    v-bind:days="days"
    month-label="Month"
    year-label="Year"
    floating-label
    label="Label"
    full>
</wc-datepicker>

<!-- Simple native datepicker -->
<wc-datepicker
    v-model="value"
    v-bind:months="months"
    v-bind:days="days"
    month-label="Month"
    year-label="Year"
    label="Label"
    native>
</wc-datepicker>

<!-- Datepicker with min and max values -->
<wc-datepicker
    v-model="value"
    v-bind:months="months"
    v-bind:days="days"
    min="2012-12-21"
    max="2016-12-21"
    month-label="Month"
    year-label="Year"
    label="Label"
    native>
</wc-datepicker>


<!-- Datepicker with error handling -->
<wc-datepicker v-on:datepicker-invalid-value="_onInvalidDate"
    v-model="value"
    v-bind:months="months"
    v-bind:days="days"
    v-bind:has-error="datePickerHasInvalidDate"
    v-bind:error-message="errorMessage"
    min="2012-12-21"
    max="2016-12-21"
    month-label="Month"
    year-label="Year"
    label="Label"
    native>
</wc-datepicker>

```

```json
{
    data : function() {
        return {
            months : ['January', 'February', 'March' /*, ...*/], // 12 months of the year
            days : ['Monday', 'Tuesday', 'Wednesday' /*, ...*/], // 7 days of the week
            value : null,
            datePickerHasInvalidDate : false,
            errorMessage : null
        };
    },
    methods : {
        _onInvalidDate : function(value) {
            this.datePickerHasInvalidDate = true;
            this.errorMessage = 'Invalid value for date: ' + value;
        }
    }
}
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-datepicker-background-color` | Datepicker's background color | $wc-primary-color
| `$wc-datepicker-option-background-color-highlighted` | Datepicker's year/month option hovered background color| rgba(black, 0.15)
| `$wc-datepicker-width` | Datepicker's maximum width | 288px

## References

### Design references

* Material guidelines : https://material.io/guidelines/components/pickers.html#pickers-date-pickers
* Guidelines : https://zpl.io/1Nvvh2

### Examples in other libraries

* http://www.material-ui.com/#/components/date-picker
* http://www.webpackbin.com/EkGe5ZSHM (inspiration)

### Issues history

* Created on [HULI-1356](https://hulihealth.atlassian.net/browse/HULI-1356)
