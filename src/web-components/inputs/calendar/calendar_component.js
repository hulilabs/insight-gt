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
 * @file Calendar component allows date selection by choosing between the month's days
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/utils/date
 * @requires web-components/inputs/calendar/calendar_template.html
 * @requires web-components/inputs/calendar/calendar_styles.css
 * @module web-components/inputs/calendar/calendar_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/calendar} for demos and documentation
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/utils/date',
    'text!web-components/inputs/calendar/calendar_template.html',
    'css-loader!web-components/inputs/calendar/calendar_styles.css'
],
function(
    Vue,
    Icon,
    DateUtil,
    Template
) {
    /**
     * List of calendar component events
     * @type {Object}
     */
    var EVENT = {
        ON_INPUT : 'input',
        ON_MONTH_CHANGED : 'calendar-month-changed',
        ON_YEAR_CHANGED : 'calendar-year-changed'
    };

    var Calendar = Vue.extend({
        template : Template,
        props : {
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
             * Value for the currently selected day
             */
            value : {
                type : String,
                required : false,
                default : null
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
        data : function() {
            return {
                state : {
                    /**
                     * Component's internal value for avoiding conflicts with value prop
                     * @type {?String}
                     */
                    value : this.value,
                    /**
                     * Current timestamp pointing to the first day of the selected (or default) date's month.
                     * If a max value is given, then the current timestamp will default to that value
                     * (check the mounted function)
                     * @type {?Number}
                     */
                    currentTimestamp : null
                }
            };
        },
        computed : {
            /**
             * Translates the current date timestamp into a Date object.
             * It's just used for convenience.
             * @return {Date}
             */
            currentDateObject : function() {
                return new Date(this.state.currentTimestamp);
            },
            /**
             * Extracts the first letter of the days names, for displaying
             * the abbreviature of the days as the calendar's columns header.
             * @return {String[]} array containing the days names first letters
             */
            daysNamesAbbr : function() {
                return this.days.map(function(day) {
                    return day[0].toUpperCase();
                });
            },
            /**
             * Retrieves the current date month's name for displaying it
             * at the calendar's header.
             * @return {String} name of the current's date
             */
            currentMonthName : function() {
                return this.months[this.currentDateObject.getMonth()];
            },
            /**
             * Determines if the arrow for moving to a previous month is disabled
             * @return {Boolean}
             */
            isPreviousMonthDisabled : function() {
                var min = (this.min) ? DateUtil.getUTCValue(this.min) : null;

                return min && (min.getMonth() >= this.currentDateObject.getMonth() &&
                                min.getFullYear() >= this.currentDateObject.getFullYear());
            },
            /**
             * Determines if the arrow for moving to a next month is disabled
             * @return {Boolean}
             */
            isNextMonthDisabled : function() {
                var max = (this.max) ? DateUtil.getUTCValue(this.max) : null;

                return max && (max.getMonth() <= this.currentDateObject.getMonth() &&
                                max.getFullYear() <= this.currentDateObject.getFullYear());
            },
            /**
             * Retrieves the current year of the current date
             * @return {Number} value of the current year
             */
            currentYear : function() {
                return this.currentDateObject.getFullYear();
            },
            /**
             * Returns the amount of spaces the month's first day must move
             * for positioning the days correctly at their respective day of the week.
             * (e.g. if the month's first day was a friday, then the day will be located at the fifth cell)
             * @return {Number} amount of empty cells left before positioning the month's first day
             */
            currentMonthDaysOffset : function() {
                var day = this.currentDateObject.getDay();
                // Adjusts the day number for sundays to be 6, instead of 0
                return day > 0 ? day - 1 : 6;
            },
            /**
             * Builds the object definition of each individual day cell.
             * These cells contain the date positioned in the column respecting its day of the week.
             * @return {Object[]} array containing the days' object definition
             */
            currentMonthDays : function() {
                var days = [],
                    month = this.currentDateObject.getMonth(),
                    year = this.currentDateObject.getFullYear(),
                    monthDays = DateUtil.getMonthDays(month, year);

                var date = new Date(year, month, 1);

                for (var i = 0; i < monthDays; i++) {
                    days.push({
                        date : date.getDate(),
                        value : date.getTime(),
                        isDisabled : this._isDisabledDate(date),
                        isToday : DateUtil.areEqual(new Date(), date),
                        isSelected : this.state.value && DateUtil.areEqual(DateUtil.getUTCValue(new Date(this.state.value)), date)
                    });

                    date.setDate(date.getDate() + 1);
                }

                return days;
            },
        },
        mounted : function() {
            var currentDate = new Date();

            if (this.max) {
                var maxDate = DateUtil.getUTCValue(this.max);
                currentDate = (maxDate.getFullYear() < currentDate.getFullYear()) ? maxDate : currentDate;
            }

            this.state.currentTimestamp = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();

            // Initializes the value of the calendar to the given value
            if (this.state.value) {
                this.setValue(this.state.value, false);
            }
        },
        methods : {
            /**
             * Updates the component's state
             * @param {?String} value              new value for the component's state
             * @param {Boolean} shouldTriggerState if the component should trigger an event for
             *                                     notifying its parent the state's changes
             * @fires module:Calendar#ON_INPUT
             * @public
             */
            setValue : function(value, shouldTriggerState) {
                if (!value || !this._isDisabledDate(new Date(value))) {
                    // Converts the date into its UTC value for avoiding problems with localized dates
                    var dateUTC = DateUtil.getUTCValue(new Date(value));

                    this.state.value = DateUtil.getISOFormatValue(dateUTC);

                    // Adjust the value to the current day if no value was given
                    value = (value) ? dateUTC : new Date();

                    // Updates the current timestamp for displaying the month according to the given value
                    this.state.currentTimestamp = (new Date(value.getFullYear(), value.getMonth(), 1)).getTime();

                    if (shouldTriggerState !== false) {
                        this._triggerState(EVENT.ON_INPUT, this.state.value);
                    }
                }
            },
            /**
             * Updates the calendar's current date, for displaying the respective days
             * for the given month and year.
             * @param {Number} month target month which days will be displayed
             * @param {Number} year  target year which days will be displayed
             */
            setCurrentDate : function(month, year) {
                var month = (month !== null && !isNaN(month)) ? month : 0,
                    year = (year !== null && !isNaN(year)) ? year : this.currentDateObject.getFullYear();

                this.state.currentTimestamp = new Date(year, month, 1).getTime();
            },
            /**
             * Determines if a date must be disabled if it doesn't comply with
             * the minimum and maximum dates contrains.
             * A disabled date corresponds to a day that can't be selected in the calendar.
             * @param  {String}  date value to be evaluated
             * @return {Boolean} if the date should be disabled
             */
            _isDisabledDate : function(date) {
                var min = (this.min) ? DateUtil.getUTCValue(this.min) : null,
                    max = (this.max) ? DateUtil.getUTCValue(this.max) : null;

                if (!min && !max) {
                    return false;
                }

                return (min && date < min) || (max && date > max);
            },
            /**
             * Reduces the month value of the current date by 1 for
             * displaying the days of the target month
             */
            _previousMonthHandler : function() {
                this._changeMonth(-1);
            },
            /**
             * Increases the month value of the current date by 1 for
             * displaying the days of the target month
             */
            _nextMonthHandler : function() {
                this._changeMonth(1);
            },
            /**
             * Updates the value of the current date according to the given offset.
             * It also triggers the respective event if the year was changed because
             * the target month belongs to another year.
             * @param {Number} offset amount of months to be added to the current date
             * @fires module:Calendar#ON_MONTH_CHANGED
             * @fires module:Calendar#ON_YEAR_CHANGED
             * @private
             */
            _changeMonth : function(offset) {
                var targetMonth = this.currentDateObject.getMonth() + offset,
                    currentYear = this.currentYear;

                // Setting the first day of the month before changing the month
                // ensures that the month changes are done correctly. This fixes the
                // cases when the previous month doesn't have the same amount of days.
                // For example: if the current date is March's 31st, the previous month
                // will be February 31st; given that this date doesn't exist, the
                // resulting date will be March's 3rd.
                this.currentDateObject.setDate(1);
                this.currentDateObject.setMonth(targetMonth);

                this.state.currentTimestamp = this.currentDateObject.getTime();

                // Triggers the ON_MONTH_CHANGED
                this._triggerState(EVENT.ON_MONTH_CHANGED, {
                    value : this.state.value,
                    target : this.currentDateObject.getMonth()
                });

                // Triggers the ON_YEAR_CHANGED event if the year was changed
                if (currentYear !== this.currentDateObject.getFullYear()) {
                    this._triggerState(EVENT.ON_YEAR_CHANGED, {
                        value : this.state.value,
                        target : this.currentDateObject.getFullYear()
                    });
                }
            },
            /**
             * Marks the clicked day as the selected one
             * @param {Object}  day            definition of the day's details
             * @param {String}  day.value      string in ISO format of the day's value
             * @param {Boolean} day.isDisabled if the clicked day is disabled
             */
            _selectedDateHandler : function(day) {
                if (!day.isDisabled) {
                    this.setValue(day.value);
                }
            },
            /**
             * Triggers the given event and sends the calendar's value as payload
             * @param {String}                  action  event that will be triggered
             * @param {CalendarPayload|?String} payload value to be sent by the event
             * @fires module:Calendar#ON_INPUT
             * @fires module:Calendar#ON_MONTH_CHANGED
             * @fires module:Calendar#ON_YEAR_CHANGED
             * @private
             */
            _triggerState : function(action, payload) {
                this.$emit(action, payload);
            }
        },
        watch : {
            /**
             * Watches for changes of the value prop and updates the component's state,
             * for keeping in sync with the parent component.
             * @param {String} newValue
             */
            value : function(newValue) {
                newValue = (newValue) ? DateUtil.getUTCValue(new Date(newValue)) : null;

                if (newValue !== this.state.value) {
                    this.setValue(newValue, false);
                }
            }
        },
        components : {
            'wc-icon' : Icon
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Calendar.EVENT = EVENT;

    return Calendar;
});
