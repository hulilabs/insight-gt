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
 * @file CustomLogic component
 * @requires vue
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/utils/os
 * @requires web-components/custom-logics/custom-logic_template.html
 * @requires web-components/custom-logics/custom-logic_styles.css
 * @module web-components/custom-logics/custom-logic_component
 * @extends Vue
 * @fires module:CustomLogic#ON_ACTION
 * @fires module:CustomLogic#ON_BLUR
 * @fires module:CustomLogic#ON_FOCUS
 * @fires module:CustomLogic#ON_INPUT
 * @see {@link https://web-components.hulilabs.xyz/components/custom-logic} for demos and documentation
 */
define([
    'vue',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'web-components/inputs/textfield/textfield_component',
    'web-components/utils/os',
    'text!web-components/inputs/custom-logic/custom-logic_template.html',
    'css-loader!web-components/inputs/custom-logic/custom-logic_styles.css'
],
function(
    Vue,
    InputBehavior,
    InputContainerBehavior,
    TextField,
    OSUtil,
    Template
) {

    /**
     * The mask only supports NUMBERS
     * Any other character is considered a separator
     *
     * @type {RegExp}
     */
    var MASK_CHARS = /[\#]/,    // not global, char specific
        MASK_MATCHES = /(\d)/g; // global

    /**
     * Bypass textfield component events
     * @type {Object}
     */
    var EVENT = TextField.EVENT;

    /**
     * Based on input mask implementation
     * https://github.com/estelle/input-masking
     *
     * @see web-components/mixins/input/input_behavior
     * Supported properties set via InputBehavior:
     *     - name : {?String}
     *     - value : {?String}
     *     - disabled : {Boolean}
     *     - required : {Boolean}
     *     - readonly : {Boolean}
     *
     * @see web-components/mixins/input/input-container_behavior
     * Supported properties set via InputContainerBehavior:
     *     - label : {?String}
     *     - floatingLabel : {Boolean}
     *     - hasError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - actionDisabled : {Boolean}
     */
    var CustomLogic = Vue.extend({
        name : 'CustomLogicComponent',
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             * Determines if the custom logic should have a clear action
             * This can also be overwritten by specifying the 'action' slot
             */
            clear : {
                type : Boolean,
                default : false
            },
            /**
             * Specifies a valid sequence of characters for the input
             * - Number (#): force input validation to be a number
             * - Separator (any non numerical): automatically adds or remove mask characters
             *
             *   Phone: ####-####
             *      ID: #-####-####
             *    Date: ##/##/####
             *    Time: ##:##
             */
            format : {
                type : String,
                required : true
            },
            /**
             * Customize mask display value
             * Must match 'format' sequence. Not used for sequence validation
             * @note same as InputContainerBehavior definition
             *
             *   Phone: 8888-9999
             *      ID: A-BCDE-FGHI
             *    Date: dd/mm/yyyy
             *    Time: hh:mm
             */
            placeholder : {
                type : String,
                default : null
            }
        },
        data : function() {
            var result = this._applyMaskToValue(this.value);

            return {
                state : {
                    /**
                     * The current value of the input field without mask separators
                     * @type {?String}
                     */
                    value : result.value,
                    /**
                     * The current value of the input field WITH mask separators
                     * @type {?String}
                     */
                    currentMaskedValue : result.masked,
                    /**
                     * One-input before value of the input field with mask separators
                     * Used for tracking changes, specially for 'delete' actions
                     * @type {?String}
                     */
                    previousMaskedValue : result.masked
                }
            };
        },
        computed : {
            /**
             * Computes mask without the value input
             * Gives precedence to the placeholder (custom mask) or uses the format as sequence
             * @return {String}
             */
            mask : function() {
                var value = this.state.currentMaskedValue,
                    mask = this.placeholder ? this.placeholder : this.format ? this.format : '';
                return value ? mask.substr(value.length) : mask;
            },
            /**
             * Detect android devices for UI fixes
             * @return {Boolean}
             */
            android : function() {
                return OSUtil.isAndroid();
            }
        },
        methods : {
            /**
             * Bypass textfield on action event
             * @fires module:CustomLogic#ON_ACTION
             * @param {InputContainerPayload} payload event payload that contains the input's current value
             * @private
             */
            _onAction : function(payload) {
                this.$emit(EVENT.ON_ACTION, payload);
            },
            /**
             * Bypass textfield on blur event
             * @fires module:CustomLogic#ON_BLUR
             * @param {InputContainerPayload} payload event payload that contains the input's current value
             * @private
             */
            _onBlur : function(payload) {
                this.$emit(EVENT.ON_BLUR, payload);
            },
            /**
             * On focus handler of the textfield element
             * Updates the current masked value of the component
             * @fires module:CustomLogic#ON_FOCUS
             * @param {String} value current value of the input element
             * @return {Promise}      nextTick result
             * @private
             */
            _onFocus : function(value) {
                return this._updateDataState(value, EVENT.ON_FOCUS);
            },
            /**
             * On input handler of the textfield element
             * Updates the current masked value of the component
             * @fires module:CustomLogic#ON_INPUT
             * @param {String}  value current value of the input element
             * @return {Promise}       nextTick result
             * @private
             */
            _onInput : function(value) {
                return this._updateDataState(value, EVENT.ON_INPUT);
            },
            /**
             * On delete keyup handler for the component
             * Track changes for removing mask separators with its previous valid character
             * @fires module:CustomLogic#ON_INPUT
             * @note
             *   - delete must be listen on keyup (not keydown or keypress)
             *   - using the physical keyboard at a simulator will throw
             *     e.keyIdentifier = "Unidentified" && e.keyCode = 0
             *     meaning that a backspace(8) or delete(46) won't be catch by the keyup handler
             * @private
             */
            _onDelete : function() {
                var currentValue = this.state.currentMaskedValue,
                    lastChar = currentValue.slice(-1);

                if (currentValue.indexOf(this.state.previousMaskedValue) === 0 && !MASK_MATCHES.test(lastChar)) {
                    var value = this._getValidChars(currentValue).slice(0,-1).join('');
                    this._updateDataState(value, EVENT.ON_INPUT);
                }
            },
            /**
             * Extract the valid characters from a value (no separators)
             * @param {String}   value  sequence of characters
             * @return {String[]}        array of valid characters
             * @private
             */
            _getValidChars : function(value) {
                return MASK_MATCHES.test(value) ? value.match(MASK_MATCHES) : [];
            },
            /**
             * Trigger data state update: masked and raw value
             * @param {String}  value        sequence of characters
             * @param {String}  triggerEvent event to trigger after update
             * @return {Promise}              nextTick result
             * @private
             */
            _updateDataState : function(value, triggerEvent) {
                var result = this._applyMaskToValue(value);

                return this.$nextTick().then(function() {
                    // Update both: masked and raw value
                    this.state.currentMaskedValue = result.masked;
                    this.state.value = result.value;

                    // Trigger event if provided
                    if (triggerEvent) {
                        this._triggerState(triggerEvent);
                    }
                }.bind(this));
            },
            /**
             * Triggers the given event and sends the component value as payload
             * @param {String} triggerEvent event to be triggered
             * @fires module:CustomLogic#ON_ACTION
             * @fires module:CustomLogic#ON_BLUR
             * @fires module:CustomLogic#ON_FOCUS
             * @fires module:CustomLogic#ON_INPUT
             * @private
             */
            _triggerState : function(triggerEvent) {
                this.$emit(triggerEvent, this.state.value);
            },
            /**
             * @typedef {MaskingResult}
             *
             * @property {String} masked processed value with separators
             * @property {String} value  the final valid input
             */
            /**
             * Apply the masking format into a given value (not necessarily processed before)
             * @param {String} value sequence of characters
             * @return {MaskingResult}
             * @private
             *
             * @notes
             * - Cant be based on previous/next logics
             * - this.format.split('') --> each mask input
             * - this.format.match(MASK_CHARS) -> masked inputs (excluding separators)
             */
            _applyMaskToValue : function(value) {
                // Split the mask into characters for evaluation
                var maskChars = this.format.split(''),
                    readyForNextInput = false,
                    // Extract from the value only the valid characters
                    valueChars = this._getValidChars(value),
                    valueLength = valueChars.length,
                    // Final value stored by character
                    processedValue = [],
                    // Cursors
                    valueCursor = 0,
                    maskCursor = 0;

                do {
                    // Extract evaluation character from the mask
                    var maskChar = (maskCursor in maskChars) ? maskChars[maskCursor] : null;

                    // When no mask character is found, the assume the mask is ready
                    if (maskChar === null) {
                        valueCursor = valueLength;
                        readyForNextInput = true;
                        continue;
                    }

                    // Detect mask character is a separator
                    if (MASK_CHARS.test(maskChar)) {
                        // Extract evaluation character from value
                        var valueChar = (valueCursor in valueChars) ? valueChars[valueCursor] : null;

                        // When a matching mask character is found, but no value is
                        // left to process then mark the processing as ready and end
                        if (valueChar === null) {
                            valueCursor = valueLength;
                            readyForNextInput = true;
                            continue;
                        }

                        // Masked number
                        if (maskChar === '#' && !isNaN(parseInt(valueChar))) {
                            processedValue.push(valueChar);
                            maskCursor++;
                        }

                        valueCursor++;
                    } else {
                        // Add separator to value
                        processedValue.push(maskChar);
                        maskCursor++;
                    }
                } while (valueCursor < valueLength || !readyForNextInput);

                return {
                    masked : processedValue.join(''),
                    value : valueChars.join('')
                };
            },
            /**
             * Setter of the state value
             * Forces the value to be only the raw data (numbers)
             * @param {String}  value sequence of characters
             * @return {Promise}       nextTick result
             * @public
             */
            setValue : function(value) {
                return this._updateDataState(value);
            },
            /**
             * Getter of the state value
             * @return {String} raw data, sequence of numbers
             * @public
             *
             * @note this component does not provide any validation on 'completeness'
             *       a value can be the whole or partial mask/format filled
             */
            getValue : function() {
                return this.state.value;
            },
            /**
             * Getter of the current masked value
             * @return {String} masked value (includes separators)
             * @public
             */
            getMaskedValue : function() {
                return this.state.currentMaskedValue;
            },
            /**
             * Set focus state to the input
             */
            focus : function() {
                this.$refs.input.focus();
            }
        },
        watch : {
            // listen to property format updates for masked value updates
            format : function() {
                this._updateDataState(this.state.currentMaskedValue, EVENT.ON_INPUT);
            },
            // listen to current input changes for tracking the previous value required on delete processing
            'state.currentMaskedValue' : function(newValue, oldValue) {
                this.state.previousMaskedValue = oldValue;
            },
            // listen to property value updates for masked value updates
            value : function(newValue) {
                this._updateDataState(newValue);
            }
        },
        components : {
            'wc-textfield' : TextField
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    CustomLogic.EVENT = EVENT;

    return CustomLogic;
});
