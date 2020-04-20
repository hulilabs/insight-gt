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
 * @file CharCounter component
 * @requires vue
 * @requires web-components/inputs/char-counter/char-counter_template.html
 * @module web-components/inputs/char-counter/char-counter_component
 * @extends Vue
 * @fires module:CharCounter#ON_CHANGE
 * @see {@link https://web-components.hulilabs.xyz/components/input-container} for demos and documentation
 */
define([
    'vue',
    'text!web-components/inputs/char-counter/char-counter_template.html'
],
function(
    Vue,
    Template
) {
    /**
     * Current compliance state of the target, according to the given maxLength and minLength
     * props. These are used as the event's payload body.
     * @type {String}
     */
    var IS_SHORTER = 'shorter',
        IS_LONGER = 'longer',
        IS_COMPLIANT = 'compliant';

    var CharCounter = Vue.extend({
        name : 'CharCounterComponent',
        template : Template,
        props : {
            /**
             * String which characters will be counted.
             * Not forcing the type for dynamic binding
             */
            target : {
                required : true
            },
            /**
             * Targets's maximum allowed length
             */
            maxLength : {
                type : [Number, String],
                required : false,
                default : null
            },
            /**
             * Target's minimum allowed length
             */
            minLength : {
                type : [Number, String],
                required : false,
                default : null
            }
        },
        data : function() {
            return {
                state : {
                    isAboveMaximum : false,
                    isBelowMinimum : false
                },
                events : {
                    ON_CHANGE : 'change'
                }
            };
        },
        computed : {
            /**
             * Computed value of the current target's length
             * @return {Number}
             */
            targetLength : function() {
                return (this.target) ? this.target.length : 0;
            }
        },
        methods : {
            /**
             * Evaluates wether or not the length of the target's string complies with
             * the minimum length for triggering the event with the appropriate compliance rule.
             * @param  {String} currentTargetLength length of the target string
             * @return {Boolean} if the target complies with the given minimum length requirement
             * @private
             */
            _checkMinLengthCompliance : function(currentTargetLength) {
                var isBelowMinimum = this.minLength > currentTargetLength;

                // The target doesn't comply with the given min length
                if (!this.state.isBelowMinimum && isBelowMinimum) {
                    this.state.isBelowMinimum = true;
                    this._triggerState(IS_SHORTER);
                    return false;
                } else if (!isBelowMinimum) {
                    // The target has an appropriate length and its state has to be triggered
                    this.state.isBelowMinimum = false;
                    return true;
                }
            },
            /**
             * Evaluates wether or not the length of the target's string complies with
             * the maximum length for triggering the event with the appropriate compliance rule.
             * @param  {String} currentTargetLength length of the target string
             * @return {Boolean} if the target complies with the given maximum length requirement
             * @private
             */
            _checkMaxLengthCompliance : function(currentTargetLength) {
                var isAboveMaximum = currentTargetLength > this.maxLength;

                // The target doesn't comply with the given max length
                if (!this.state.isAboveMaximum && isAboveMaximum) {
                    this.state.isAboveMaximum = true;
                    this._triggerState(IS_LONGER);
                    return false;
                } else if (!isAboveMaximum) {
                    // The target has an appropriate length and its state has to be triggered
                    this.state.isAboveMaximum = false;
                    return true;
                }
            },
            /**
             * Triggers the state of the component, notifying its parent wether or not the
             * given target string complies with the requirements of length.
             * In case where there's no compliance, the reason is sent as the event's payload.
             * @param {String} state the state of the target value according to its length and the
             *                       given length rules
             * @fires module:CharCounter#ON_CHANGE
             * @private
             */
            _triggerState : function(state) {
                /**
                 * @typedef {Object} OnChangePayload
                 * @property {state} state component's state according to the target's compliance
                 */
                var payload = {
                    state : state
                };

                /**
                 * change event
                 *
                 * @event module:CharCounter#ON_CHANGE
                 * @type {OnChangePayload}
                 */
                this.$emit(this.events.ON_CHANGE, payload);
            }
        },
        watch : {
            /**
             * Watches the changes on the target value for the compliance of the given length rules,
             * or the reason why it isn't compliant otherwise.
             * @param {String} value new value of the target string
             */
            target : function(value) {
                if (value && value.length) {
                    var currentTargetLength = value.length,
                        isCompliant = false;

                    if (this.minLength) {
                        isCompliant = this._checkMinLengthCompliance(currentTargetLength);
                    }

                    if (this.maxLength) {
                        isCompliant = this._checkMaxLengthCompliance(currentTargetLength);
                    }

                    if (isCompliant === true) {
                        this._triggerState(IS_COMPLIANT);
                    }
                }
            }
        }
    });

    return CharCounter;
});
