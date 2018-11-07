/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/**
 * @file Datepicker component
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/calendar/calendar_component
 * @requires web-components/inputs/custom-logic/custom-logic_component
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/overlays/overlay_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/utils/date
 * @requires web-components/inputs/datepicker/datepicker_template.html
 * @requires web-components/inputs/datepicker/datepicker_styles.css
 * @module web-components/inputs/datepicker/datepicker_component
 * @extends Vue
 * @fires module:Datepicker#ON_BLUR
 * @fires module:Datepicker#ON_FOCUS
 * @fires module:Datepicker#ON_INPUT
 * @fires module:Datepicker#ON_INVALID_VALUE
 * @see {@link https://web-components.hulilabs.xyz/components/datepicker} for demos and documentation
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/inputs/calendar/calendar_component',
    'web-components/inputs/custom-logic/custom-logic_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'web-components/overlays/overlay_component',
    'web-components/utils/date',
    'text!web-components/inputs/datepicker/datepicker_template.html',
    'css-loader!web-components/inputs/datepicker/datepicker_styles.css'
],
function(
    Vue,
    Icon,
    Calendar,
    CustomLogic,
    Textfield,
    InputBehavior,
    InputContainerBehavior,
    Overlay,
    DateUtil,
    Template
) {
    /**
     * List of datepicker component events
     * @type {Object}
     */
    var EVENT = {
        ON_BLUR : 'blur',
        ON_FOCUS : 'focus',
        ON_INPUT : 'input',
        ON_INVALID_VALUE : 'datepicker-invalid-value'
    };

    /**
     * Minimum year option that will be displayed.
     * The options go from the current year (at the top) to the minimum year value (at the bottom).
     * @type {Number}
     */
    var MINIMUM_YEAR = 1900;

    /**
     * Height (in pixels) of each year option
     * @type {Number}
     */
    var YEAR_OPTION_HEIGHT = 40;

    /**
     * @see web-components/mixins/input/input_behavior
     * Properties set via InputBehavior:
     *     - type : {String}
     *     - name : {?String}
     *     - id : {?String}
     *     - value : {?String}
     *     - disabled : {Boolean}
     *     - required : {Boolean}
     *     - maxLength : {?String|?Number}
     *     - minLength : {?String|?Number}
     *     - readonly : {Boolean}
     *     - min : {?String}
     *     - max : {?String}
     *     - step : {?Number}
     *     - autocomplete : {Boolean}
     *
     * @see web-components/mixins/input/input-container_behavior
     * Properties set via InputContainerBehavior:
     *     - label : {?String}
     *     - floatingLabel : {Boolean}
     *     - placeholder : {String}
     *     - hasError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - charCounter  : {Boolean}
     *     - actionDisabled : {Boolean}
     */
    var Datepicker = Vue.extend({
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             *
             */
            value : {
                type : String,
                required : false,
                default : null,
                validator : DateUtil.isValidDate
            },
            /**
             * Array containing the names of the days of the week.
             * Expected as a prop for giving the flexibility of giving custom translations.
             */
            days : {
                type : Array,
                required : true,
                validator : function(days) {
                    return days.length > 0;
                }
            },
            /**
             * Object containing the names of the months of the year.
             * Expected as a prop for giving the flexibility of giving custom translations.
             */
            months : {
                type : Array,
                required : true,
                validator : function(months) {
                    return months.length > 0;
                }
            },
            /**
             * Format for the custom logic component's mask.
             * Must have a 'yyyy-mm-dd' like format
             */
            format : {
                type : String,
                required : true
            },
            /**
             * Label to be displayed for indicating the months selector
             */
            monthLabel : {
                type : String,
                required : true
            },
            /**
             * Label to be displayed for indicating the years selector
             */
            yearLabel : {
                type : String,
                required : true
            },
            /**
             * Determines if the datepicker must display the full options
             * for selecting the date: year, date and day selectors.
             * Defaults to false for displaying the day selector only (month view).
             */
            full : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Flag for displaying a native datepicker, instead of the custom one.
             * A native datepicker corresponds to an input type date.
             */
            native : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Minimum date that can be selected
             */
            min : {
                type : String,
                required : false,
                default : null,
                validator : DateUtil.isValidDate
            },
            /**
             * Maximum date that can be selected
             */
            max : {
                type : String,
                required : false,
                default : null,
                validator : DateUtil.isValidDate
            }
        },
        computed : {
            /**
             * Calculates the current month according to the current value or the
             * month selected by the user. If there's a given max date constraint,
             * the initial value for the current month will be the last allowed month
             * for the max allowed year, according to the given max date value
             * @return {Number}
             */
            currentMonth : function() {
                if (this.state.selectedMonth !== null) {
                    return this.state.selectedMonth;
                } else if (this.state.value) {
                    return DateUtil.getUTCValue(this.state.value).getMonth();
                } else if (this.max) {
                    var maxDate = DateUtil.getUTCValue(this.max);
                    return (maxDate.getFullYear() === this.currentYear) ? maxDate.getMonth() : DateUtil.getUTCValue(new Date()).getMonth();
                } else {
                    return DateUtil.getUTCValue(new Date()).getMonth();
                }
            },
            /**
             * Calculates the current year according to the current value or the
             * year selected by the user. If there's a given max date contraint and
             * the current year (according to this instant) is greater than the max date,
             * the initial value for the current year will correspond to the year
             * of the given max date value
             * @return {Number}
             */
            currentYear : function() {
                if (this.state.selectedYear !== null) {
                    return this.state.selectedYear;
                } else if (this.state.value) {
                    return DateUtil.getUTCValue(this.state.value).getFullYear();
                } else if (this.max) {
                    var maxYear = DateUtil.getUTCValue(this.max).getFullYear(),
                        currentYear = new Date().getFullYear();
                    return (maxYear < currentYear) ? maxYear : currentYear;
                } else {
                    return DateUtil.getUTCValue(new Date()).getFullYear();
                }
            },
            /**
             * Determines if the datepicker dialog should be displayed
             * @return {Boolean}
             */
            shouldDisplayDialog : function() {
                return !this.native && this.state.isDatepickerDialogVisible;
            },
            /**
             * Determines the text displayed at the month selector.
             * The possible options are: the month label prop or the currently selected month.
             * @return {String}
             */
            monthSelectorLabel : function() {
                return (this.state.isMonthSelectorVisible) ? this.monthLabel : this.months[this.currentMonth];
            },
            /**
             * Determines the text displayed at the year selector.
             * The possible options are: the year label prop or the currently selected year.
             * @return {String}
             */
            yearSelectorLabel : function() {
                return (this.state.isYearSelectorVisible) ? this.yearLabel : this.currentYear;
            },
            /**
             * Computes an array with the given months options, for highlighting the currently selected.
             * It takes into consideration if the month is allowed, based in the min and max date
             * contraint.
             * @return {Object[]}
             */
            processedMonths : function() {
                // The util method will return null if the min and max props aren't defined
                var minDate = DateUtil.getUTCValue(this.min),
                    maxDate = DateUtil.getUTCValue(this.max);

                var min = (minDate && minDate.getFullYear() === this.currentYear) ? minDate.getMonth() : null,
                    max = (maxDate && maxDate.getFullYear() === this.currentYear) ? maxDate.getMonth() : null;

                return this.months.map(function(month, monthNumber) {
                    return {
                        value : month,
                        isSelected : monthNumber === this.currentMonth,
                        isDisabled : (min !== null && monthNumber < min || max !== null && monthNumber > max)
                    };
                }.bind(this));
            },
            /**
             * Computes an array with the year options the user will have available to choose
             * The available years will start from 1900 to the current year if not minimum date
             * was given and will be available to the max date given or the current year.
             * @return {Object[]}
             */
            processedYears : function() {
                var result = [];

                // The util method will return null if the min and max props aren't defined
                var minDate = DateUtil.getUTCValue(this.min),
                    maxDate = DateUtil.getUTCValue(this.max);

                var min = (minDate) ? minDate.getFullYear() : MINIMUM_YEAR,
                    max = (maxDate) ? maxDate.getFullYear() : new Date().getFullYear();

                for (var i = max; i >= min; i--) {
                    result.push({
                        value : i,
                        isSelected : i === this.currentYear
                    });
                }

                return result;
            },
            /**
             * Determines if the year options should be displayed, based on the amount
             * of available years for selection that is affected by the minimum and
             * maximum date contraints.
             * @return {Boolean}
             */
            isYearSelectorAvailable : function() {
                return this.processedYears.length > 1;
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Currently selected date value.
                     * Corresponds to an ISO-formatted string representation of a date.
                     * @type {?String}
                     */
                    value : this.value,
                    /**
                     * Currently selected month (0-indexed).
                     * Defaults to the current month according to the current date (today).
                     * @type {?Number}
                     */
                    selectedMonth : null,
                    /**
                     * Currently selected year.
                     * Defaults to the current year according to the current date (today).
                     * @type {?Number}
                     */
                    selectedYear : null,
                    /**
                     * Determines if the dialog for displaying the
                     * year/month/calendar selectors should be visible
                     * @type {Boolean}
                     */
                    isDatepickerDialogVisible : false,
                    /**
                     * If the month options are available for user selection
                     * @type {Boolean}
                     */
                    isMonthSelectorVisible : false,
                    /**
                     * If the year options are available for user selection
                     * @type {Boolean}
                     */
                    isYearSelectorVisible : false,
                    /**
                     * Value of the custom logic field
                     * @type {String}
                     */
                    customValue : null
                }
            };
        },
        mounted : function() {
            // If the given initial value isn't valid, notify with an event
            if (this.state.value && !DateUtil.isValidDate(this.state.value)) {
                this._triggerState(EVENT.ON_INVALID_VALUE, this.state.value);
            }

            // Syncs the custom logic component with the given initial value
            if (this.state.value) {
                this._updateCustomLogic(this.state.value);
            }
        },
        methods : {
            /**
             * Updates the component's state.
             * @param {String}  value                   new value for the component's state
             * @param {Boolean} shouldTriggerState      if the component should trigger the event
             *                                          for notifying its changes
             * @param {Boolean} shouldUpdateCustomLogic if the custom logic input's value should be updated.
             *                                          Disabling this flag will allow to update the datepicker's
             *                                          value without messing with the custom logic's mask.
             * @fires module:Datepicker#ON_INPUT
             * @public
             */
            setValue : function(value, shouldTriggerState, shouldUpdateCustomLogic) {
                value = (DateUtil.isValidDate(value)) ? value : null;

                this.state.value = value;

                /**
                 * If the value is invalid or was cleared (no value was given) this allows to reset the year
                 * and month displayed in their respective selectors (depends on the 'full' flag)
                 */
                var dateObj = DateUtil.getUTCValue(value);
                this.state.selectedMonth = (dateObj) ? dateObj.getMonth() : null;
                this.state.selectedYear = (dateObj) ? dateObj.getFullYear() : null;

                if (!this.native && shouldUpdateCustomLogic !== false) {
                    this._updateCustomLogic(value);
                }

                if (shouldTriggerState !== false) {
                    this._triggerState(EVENT.ON_INPUT, this.state.value);
                }
            },
            /**
             * Updates the customValue state that is bound to the custom logic component's value
             * @param {String} value string representation of a date in ISO format
             * @private
             */
            _updateCustomLogic : function(value) {
                var targetFormat = this.placeholder.split('/').join('');
                this.state.customValue = DateUtil.toString(DateUtil.getUTCValue(value), targetFormat);
            },
            /**
             * Translates the current value of the custom logic field and updates the
             * component's state with that parsed value. If the value isn't valid, then
             * the value is cleared.
             * @param  {Boolean} shouldTriggerState      if should be notified if the given value is invalid
             * @param  {Boolean} shouldUpdateCustomLogic if the custom logic value's must be updated
             * @return {Boolean} if the value from the custom logic component is a valid date
             * @private
             */
            _syncWithCustomLogic : function(shouldTriggerState, shouldUpdateCustomLogic) {
                var customLogicValue = this.$refs.customLogic.getMaskedValue(),
                    // we'll check that the date is complete, since for some browsers a date like 25/08/01 is valid
                    // but we want a complete four-digit year like 05/08/2001
                    isDateComplete = customLogicValue && (customLogicValue.length === this.placeholder.length),
                    dateObj = isDateComplete ? DateUtil.toDate(customLogicValue, this.placeholder) : null;

                this.setValue(DateUtil.getISOFormatValue(dateObj), true, shouldUpdateCustomLogic);

                if (shouldTriggerState && customLogicValue && !DateUtil.isValidDate(dateObj)) {
                    this._triggerState(EVENT.ON_INVALID_VALUE, customLogicValue);
                }
            },
            /**
             * Triggers the ON_FOCUS event
             * @fires module:Datepicker#ON_FOCUS
             * @private
             */
            _onFocus : function() {
                this._triggerState(EVENT.ON_FOCUS, this.state.value);
            },
            /**
             * Triggers the ON_BLUR event
             * @fires module:Datepicker#ON_BLUR
             * @fires module:Datepicker#ON_INVALID_VALUE
             * @private
             */
            _onBlur : function() {
                if (!this.native) {
                    this._syncWithCustomLogic(true);
                }

                this._triggerState(EVENT.ON_BLUR, this.state.value);
            },
            /**
             * Turns on the flag for displaying the dialog that contains the selectors
             * of year and month (if the 'full' prop is given) and the calendar date selector.
             * It syncs the value of the dialog with the
             * @private
             */
            _openDialog : function() {
                if (!this.readonly) {
                    this._syncWithCustomLogic();
                    // Turns on the flag for opening the datepicker dialog
                    this.state.isDatepickerDialogVisible = true;
                }
            },
            /**
             * Closes the datepicker dialog
             * @private
             */
            _closeDialog : function() {
                this.state.isDatepickerDialogVisible = false;
            },
            /**
             * Updates the component's state with the given year value.
             * It also updates the calendar's current date, for matching the given value
             * @param {Number} year value of the user-selected year
             * @private
             */
            _selectYear : function(year) {
                this._toggleYearSelector();
                this._toggleMonthSelector();
                this.state.selectedYear = year;
                this.$refs.calendar.setCurrentDate(this.state.selectedMonth, this.state.selectedYear);
            },
            /**
             * Updates the component's state with the given month value.
             * It also updates the calendar's current date, for matching the given value
             * @param {String} month name of the user-selected month
             * @private
             */
            _selectMonth : function(month) {
                this._toggleMonthSelector();
                this.state.selectedMonth = this.months.indexOf(month);
                this.$refs.calendar.setCurrentDate(this.state.selectedMonth, this.state.selectedYear);
            },
            /**
             * Turns on/off the selector of years, for displaying the options
             * @private
             */
            _toggleYearSelector : function() {
                this.state.isMonthSelectorVisible = false;
                this.state.isYearSelectorVisible = !this.state.isYearSelectorVisible;

                if (this.state.isYearSelectorVisible) {
                    // Positions the scroll into the last option
                    this.$nextTick(function() {
                        var scrollPosition = 0;

                        if (this.state.selectedYear !== null) {
                            var maxYear = (this.max) ? DateUtil.getUTCValue(this.max).getFullYear() : new Date().getFullYear();
                            scrollPosition = (maxYear - this.state.selectedYear) * YEAR_OPTION_HEIGHT;
                        }

                        this.$refs.yearSelector.scrollTop = scrollPosition;
                    }.bind(this));
                }
            },
            /**
             * Turns on/off the selector of months, for displaying the options
             * @private
             */
            _toggleMonthSelector : function() {
                this.state.isYearSelectorVisible = false;
                this.state.isMonthSelectorVisible = !this.state.isMonthSelectorVisible;
            },
            /**
             * Handler for the calendar-year-changed event. Updates the datepicker's state.
             * @param {CalendarPayload} payload event's payload that contains the year the calendar changed
             * @see web-components/inputs/calendar/calendar_component:277
             * @private
             */
            _calendarYearChangedHandler : function(payload) {
                this.state.selectedYear = payload.target;
            },
            /**
             * Handler for the calendar-month-changed event. Updates the datepicker's state.
             * @param {CalendarPayload} payload event's payload that contains the month the calendar changed
             * @see web-components/inputs/calendar/calendar_component:277
             * @private
             */
            _calendarMonthChangedHandler : function(payload) {
                this.state.selectedMonth = payload.target;
            },
            /**
             * Handler for the input event of the calendar. Updates the component's state.
             * It also updates the custom logic value, for displaying the selected date.
             * @param {String} value ISO-formatted string representation of the calendar's selected date
             * @private
             */
            _calendarInputHandler : function(value) {
                this.setValue(value);
                this._closeDialog();
            },
            /**
             * Triggers the given event and sends the datepickers's value as payload
             * @param {String} action event that will be triggered
             * @param {String} value  event's payload
             * @fires module:Datepicker#ON_BLUR
             * @fires module:Datepicker#ON_FOCUS
             * @fires module:Datepicker#ON_INPUT
             * @fires module:Datepicker#ON_INVALID_VALUE
             * @private
             */
            _triggerState : function(action, value) {
                this.$emit(action, value);
            }
        },
        watch : {
            /**
             * Watches for changes of the value prop and updates the component's state,
             * for keeping in sync with the parent component.
             * @param {String} newValue
             */
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    this.setValue(newValue, false);
                }
            },
            /**
             * If the given value for the component's state is empty, the selected month and year
             * are reset, for not displaying 'dirty' months or years in their respective selectors.
             * @param {?String} newValue
             */
            'state.value' : function(newValue) {
                if (this.full && !newValue) {
                    this.state.selectedMonth = null;
                    this.state.selectedYear = null;
                }
            }
        },
        components : {
            'wc-calendar' : Calendar,
            'wc-custom-logic' : CustomLogic,
            'wc-icon' : Icon,
            'wc-overlay' : Overlay,
            'wc-textfield' : Textfield
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Datepicker.EVENT = EVENT;

    return Datepicker;
});
