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
 * @file InputBehaviorMixin defines common properties that an input-like component can receive
 * @requires web-components/utils/random
 * @module web-components/mixins/input/input_behavior
 */
define([], function() {

    var InputBehaviorMixin = {
        props : {
            /**
             * Sets the input's type.
             * - See validator for supported values
             * - Unsupported html5 values: range
             */
            type : {
                type : String,
                default : 'text',
                validator : function(value) {
                    return ['color', 'date', 'datetime', 'datetime-local', 'email', 'hidden', 'month', 'number',
                        'password', 'search', 'tel', 'text', 'time', 'url', 'week'].indexOf(value) !== -1;
                }
            },
            /**
             * Sets input's name.
             * Useful for form data binding.
             */
            name : {
                type : String,
                default : null
            },
            /**
             * Sets the input's id attribute.
             */
            id : {
                type : String,
                default : null
            },
            /**
             * Determines the inputs's initial or default value.
             * Every input's value is empty by default.
             */
            value : {
                type : [String, Number],
                default : null
            },
            /**
             * Sets the input's disabled status.
             * Default to false so the input is always enabled.
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the input as a required field.
             * No input is required by default.
             * If active, a special character (*) is added for distinguish this field.
             */
            required : {
                type : Boolean,
                default : false
            },
            /**
             * Constraint of the maximum length of the input's value.
             */
            maxLength : {
                type : [Number, String],
                default : null
            },
            /**
             * Constraint of the minimum length of the input's value.
             */
            minLength : {
                type : [Number, String],
                default : null
            },
            /**
             * Determines if the input is read-only.
             * The input won't allow editing of its value, but the focus event is still triggered.
             */
            readonly : {
                type : Boolean,
                default : false
            },
            /**
             * Minimum value for the input. E.g: <input type="date" min="1994-10-26"/>
             * Works with input types: number, date.
             */
            min : {
                type : [String, Number],
                default : null
            },
            /**
             * Maximum value for the input. E.g.: <input type="number" max="9001"/>
             * Works with input types: number, date.
             */
            max : {
                type : [String, Number],
                default : null
            },
            /**
             * Defines the step that the input's value must be a multiple of.
             * E.g.: <input type="number" step="10"/> will allow values multiple of 10.
             * Works with input type: number.
             */
            step : {
                type : [Number, String],
                default : null
            },
            /**
             * If the input should handle the autocomplete attribute.
             * This is handled by the browser.
             */
            autocomplete : {
                type : Boolean,
                default : false
            }
        }
    };

    return InputBehaviorMixin;
});
