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
 * @file TimePicker component
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/overlays/overlay_component
 * @requires web-components/inputs/time-picker/time-picker_template.html
 * @requires web-components/inputs/time-picker/time-picker_styles.css
 * @module web-components/inputs/time-picker/time-picker_component
 * @extends Vue
 * @fires module:TimePicker#ON_INPUT
 * @fires module:TimePicker#ON_FOCUS
 * @fires module:TimePicker#ON_BLUR
 * @see {@link https://web-components.hulilabs.xyz/components/time-picker} for demos and documentation
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'web-components/overlays/overlay_component',
    'text!web-components/inputs/time-picker/time-picker_template.html',
    'css-loader!web-components/inputs/time-picker/time-picker_styles.css'
],
function(
    Vue,
    Icon,
    Textfield,
    InputBehavior,
    InputContainerBehavior,
    Overlay,
    Template
) {
    /**
     * List of datepicker component events
     * @type {Object}
     */
    var EVENT = {
        ON_BLUR : 'blur',
        ON_FOCUS : 'focus',
        ON_INPUT : 'input'
    };

    /**
     * Format of a string representation of time
     * @type {Object}
     */
    var FORMAT = {
        TIME : 'HH:mm',
        HOURS : 'HH',
        MINUTES : 'mm'
    };

    /**
     * Height in pixels of the selector's options height
     * @type {Number}
     */
    var OPTION_HEIGHT = 40;

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
     *
     * @see web-components/mixins/input/input-container_behavior
     * Properties set via InputContainerBehavior:
     *     - label : {?String}
     *     - floatingLabel : {Boolean}
     *     - placeholder : {String}
     *     - hasError : {Boolean}
     *     - nativeError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - charCounter  : {Boolean}
     *     - modifier : {?String}
     *     - actionDisabled : {Boolean}
     */
    var TimePicker = Vue.extend({
        name : 'TimePickerComponent',
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             * String value of the label for representing the hours selector
             * in the timepicker dialog header
             */
            hoursLabel : {
                type : String,
                required : true
            },
            /**
             * String value of the label for representing the minutes selector
             * in the timepicker dialog header
             */
            minutesLabel : {
                type : String,
                required : true
            },
            /**
             * Flag for displaying a native timepicker, instead of the custom one.
             * A native datepicker corresponds to an input type time.
             */
            native : {
                type : Boolean,
                required : false
            },
            /**
             * Step of minutes for the minutes options.
             * E.g.: a minuteStep value of 5 will produce 00, 05, 10, 15 (...) minutes options
             */
            step : {
                type : Number,
                required : false,
                default : 1
            }
        },
        computed : {
            /**
             * Returns an array of object definitions for hours.
             * Determines which one is the currently selected hour value.
             * @return {Array} list of hours from 1 to 12
             */
            hours : function() {
                var result = [];

                for (var i = 1; i <= 12; i++) {
                    result.push({
                        value : i,
                        isActive : this.state.selectedHours == i
                    });
                }

                return result;
            },
            /**
             * Returns an array of object definitions for minutes.
             * Determines which one is the currently selected minute value.
             * @return {Array} list of minutes from 0 to 59
             */
            minutes : function() {
                var result = [];

                for (var i = 0; i < 60; i += this.step) {
                    var value = this._convertToTwoDigitString(i);

                    result.push({
                        value : value,
                        isActive : this.state.selectedMinutes == value
                    });
                }

                return result;
            },
            /**
             * Returns an array with the object definition of timepicker meridians,
             * with the isActive property for determining which is the currently selected
             * @return {Array} list of available meridian
             */
            meridians : function() {
                return [
                    {
                        value : 'AM',
                        isActive : this.state.selectedMeridian === 'AM'
                    },
                    {
                        value : 'PM',
                        isActive : this.state.selectedMeridian === 'PM'
                    }
                ];
            },
            /**
             * Determines if the timepicker dialog should be displayed
             * @return {Boolean}
             */
            shouldDisplayDialog : function() {
                return !this.native && this.state.isTimepickerDialogVisible;
            },
            /**
             * Determines if all the timepicker options (hours, minutes and meridian) have been selected.
             * @return {Boolean}
             */
            areAllOptionsSelected : function() {
                return this.state.selectedHours && this.state.selectedMinutes && this.state.selectedMeridian;
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Assigning the value from the prop for displaying the proper value as an
                     * initial state. This is equal to assigning `this.value` in the `mounted` hook.
                     */
                    value : this.value,
                    selectedHours : null,
                    selectedMinutes : null,
                    selectedMeridian : null,
                    isTimepickerDialogVisible : false
                }
            };
        },
        methods : {
            /**
             * Updates the component's state.
             * @param {String}  value              new value for the component's state
             * @param {Boolean} shouldTriggerState if the component should trigger the event
             *                                     for notifying its changes
             * @fires module:TimePicker#ON_INPUT
             * @public
             */
            setValue : function(value, shouldTriggerState) {
                this.state.value = value;
                this._updateSelectedOptions(value);

                if (shouldTriggerState !== false) {
                    this._triggerState(EVENT.ON_INPUT);
                }
            },
            /**
             * Updates the component's state value for the selected hour
             * @param {String} hours target value
             * @private
             */
            _selectHours : function(hours) {
                this.state.selectedHours = hours;

                if (!this.state.value && this.areAllOptionsSelected) {
                    this._closeDialog();
                }
            },
            /**
             * Updates the component's state value for the selected minutes
             * @param {String} minutes target value
             * @private
             */
            _selectMinutes : function(minutes) {
                this.state.selectedMinutes = minutes;

                if (!this.state.value && this.areAllOptionsSelected) {
                    this._closeDialog();
                }
            },
            /**
             * Updates the component's state value for the selected meridian (AM, PM)
             * @param {String} meridian target value
             * @private
             */
            _selectMeridian : function(meridian) {
                this.state.selectedMeridian = meridian;

                if (this.areAllOptionsSelected) {
                    this._closeDialog();
                }
            },
            /**
             * Triggers the ON_FOCUS event
             * @fires module:TimePicker#ON_FOCUS
             * @private
             */
            _onFocus : function() {
                this._triggerState(EVENT.ON_FOCUS);
            },
            /**
             * Triggers the ON_FOCUS event
             * @fires module:TimePicker#ON_FOCUS
             * @private
             */
            _onBlur : function() {
                this._triggerState(EVENT.ON_BLUR);
            },
            /**
             * Turns on the flag for displaying the timepicker dialog
             * @private
             */
            _openDialog : function() {
                if (!this.native) {
                    this.state.isTimepickerDialogVisible = true;

                    this.$nextTick(function() {
                        this.$refs.hoursSelector.scrollTop = OPTION_HEIGHT * (parseInt(this.state.selectedHours) - 1);
                        this.$refs.minutesSelector.scrollTop = OPTION_HEIGHT * parseInt(this.state.selectedMinutes);
                    }.bind(this));
                }
            },
            /**
             * Turns off the flag for displaying the timepicker dialog and updates
             * the component's value if all the options were selected
             * @private
             */
            _closeDialog : function() {
                if (!this.native) {
                    this.state.isTimepickerDialogVisible = false;
                    this.setValue(this._getHourFormat());
                }
            },
            /**
             * Updates the selected hours, minutes and meridian for matching them with
             * the component's current value. This allows to synchronize the textfield
             * and the selectors in the dialog. If the value is cleared, the selections
             * are reset to its initial value.
             * @param {String} value string representation of a time value
             */
            _updateSelectedOptions : function(value) {
                if (!value) {
                    this.state.selectedHours = null;
                    this.state.selectedMinutes = null;
                    this.state.selectedMeridian = null;
                } else {
                    // Extract the hours, minutes and meridian from a string representation
                    // of a time value in the format: 'HH:mm'
                    var dateObj = new Date(Date.parse(new Date().toDateString() + ' ' + value)),
                        hours = dateObj.getHours(),
                        minutes = this._convertToTwoDigitString(dateObj.getMinutes()),
                        meridian = (hours >= 12) ? 'PM' : 'AM';

                    // Converts hours from 24 to 12 hours format
                    hours = (hours === 0) ? 12 : (hours > 12) ? hours - 12 : hours;

                    this.state.selectedHours = hours;
                    this.state.selectedMinutes = minutes;
                    this.state.selectedMeridian = meridian;
                }
            },
            /**
             * Converts the selected options into an hour:minutes format string in 24h format,
             * because of the support of the input type time value
             * @return {String} string representation of the selected time
             * @private
             */
            _getHourFormat : function() {
                if (!this.state.selectedHours || !this.state.selectedMinutes || !this.state.selectedMeridian) {
                    return null;
                }

                var hours = parseInt(this.state.selectedHours),
                    minutes = this.state.selectedMinutes;

                // Adjusts the hours value to 24h according to the selected meridian
                if (this.state.selectedMeridian === 'PM') {
                    hours += (hours === 12) ? 0 : 12;
                } else if (hours === 12) {
                    hours = 0;
                }

                hours = this._convertToTwoDigitString(hours);

                return FORMAT.TIME.replace(FORMAT.HOURS, hours).replace(FORMAT.MINUTES, minutes);
            },
            /**
             * Converts a number to a string with a leading 0, if the number doesn't have two digits
             * @param  {Number|String} value number to be converted to a two digit string
             * @return {?String} value with a leading 0 if it doesn't have two digits
             */
            _convertToTwoDigitString : function(value) {
                if (value === null || isNaN(value)) {
                    return null;
                }

                return (parseInt(value) < 10) ? '0' + value : value.toString();
            },
            /**
             * Triggers the given event and sends the timepicker's value as payload
             * @param {String} action event that will be triggered
             * @fires module:TimePicker#ON_INPUT
             * @fires module:TimePicker#ON_FOCUS
             * @fires module:TimePicker#ON_BLUR
             * @private
             */
            _triggerState : function(action) {
                this.$emit(action, this.state.value);
            }
        },
        watch : {
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    this.setValue(newValue, false);
                }
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-overlay' : Overlay,
            'wc-textfield' : Textfield
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    TimePicker.EVENT = EVENT;

    return TimePicker;
});
