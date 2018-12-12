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
 * @file Password component
 * @requires vue
 * @requires web-components/components/icon/icon_component
 * @requires web-components/inputs/enum/input-types_enum
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/inputs/password/password_template.html
 * @module web-components/inputs/password/password_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/password} for demos and documentation
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/inputs/enum/input-types_enum',
    'web-components/inputs/textfield/textfield_component',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'text!web-components/inputs/password/password_template.html',
    'css-loader!web-components/inputs/password/password_styles.css'
],
function(
    Vue,
    Icon,
    InputTypesEnum,
    TextField,
    InputBehavior,
    InputContainerBehavior,
    Template
) {
    'use strict';

    /**
     * List of Password component events
     * @type {Object}
     */
    var EVENT = {
        ON_BLUR : 'blur',
        ON_FOCUS : 'focus',
        ON_INPUT : 'input'
    };

    /**
     * Icons to be used as the textfield's action
     * @type {Object}
     */
    var ICON = {
        VISIBLE : 'icon-visible',
        NONVISIBLE : 'icon-nonvisible'
    };

    /**
     * @see web-components/mixins/input/input_behavior
     * Properties set via InputBehavior:
     *     - type : {string}
     *     - name : {?string}
     *     - id : {?string}
     *     - value : {?string}
     *     - disabled : {boolean}
     *     - required : {boolean}
     *     - maxLength : {?string|?number}
     *     - minLength : {?string|?number}
     *     - readonly : {boolean}
     *     - min : {?string}
     *     - max : {?string}
     *     - step : {?number}
     *     - autocomplete : {boolean}
     *
     * @see web-components/mixins/input/input-container_behavior
     * Properties set via InputContainerBehavior:
     *     - label : {?string}
     *     - floatingLabel : {boolean}
     *     - placeholder : {string}
     *     - hasError : {boolean}
     *     - errorMessage : {?string}
     *     - hintText : {?string}
     *     - charCounter  : {boolean}
     *     - actionDisabled : {boolean}
     */
    var Password = Vue.extend({
        name : 'PasswordComponent',
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             * Determines whether or not the password is revealed
             */
            revealed : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            /**
             * Returns the textfield's type that will vary depending on whether or not
             * the user chose the action for revealing the password
             * @return {string}
             */
            textfieldType : function() {
                return this.state.isPasswordRevealed ? InputTypesEnum.TEXT : InputTypesEnum.PASSWORD;
            },
            /**
             * Returns the textfield's icon name that will be used for the action
             * for revealing or hiding the password content
             * @return {string}
             */
            textfieldActionIconClass : function() {
                return this.state.isPasswordRevealed ? ICON.VISIBLE : ICON.NONVISIBLE;
            },
            /**
             * Determines if the password component's action is disabled
             * based on whether or not the input has content
             * @return {boolean}
             */
            isActionDisabled : function() {
                return !this.state.value || !this.state.value.length;
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Keeps the entered password value
                     * @type {string}
                     */
                    value : this.value,
                    /**
                     * Determines if the textfield's type must be changed to text instead of
                     * password so the user's input can be shown as alphanumeric characters
                     * @type {boolean}
                     */
                    isPasswordRevealed : this.revealed
                }
            };
        },
        methods : {
            /**
             * Updates the component's state and if given the option,
             * it'll emit the input event with the current value as payload,
             * for keeping it synched with the parent component if used with v-model
             * @param {String}  value              new value for the component's state
             * @param {Boolean} shouldTriggerState if the component should trigger the input event
             * @fires module:Password#ON_INPUT
             * @public
             */
            setValue : function(value, shouldTriggerState) {
                this.state.value = value;
                if (shouldTriggerState !== false) {
                    this._triggerState(EVENT.ON_INPUT, this.state.value);
                }
            },
            /**
             * Set focus state to the textfield component
             * @param {boolean} shouldTriggerState
             */
            focus : function(shouldTriggerState) {
                this.$refs.textfield.focus(shouldTriggerState);
            },
            /**
             * Toggles the flag for displaying the actual input the user entered,
             * instead of keeping it hidden as the native input type password
             * @private
             */
            _togglePasswordVisibility : function(value, event) {
                // skip the toggle when the event that triggered the action
                // was fired from the on blur handler in the textfield component
                if (event instanceof window.FocusEvent) {
                    return;
                }
                this.state.isPasswordRevealed = !this.state.isPasswordRevealed;
            },
            /**
             * Triggers the ON_FOCUS event
             * @fires module:Password#ON_FOCUS
             * @private
             */
            _onFocus : function() {
                this._triggerState(EVENT.ON_FOCUS, this.state.value);
            },
            /**
             * Triggers the ON_BLUR event
             * @fires module:Password#ON_BLUR
             * @private
             */
            _onBlur : function() {
                this._triggerState(EVENT.ON_BLUR, this.state.value);
            },
            /**
             * Triggers the given event and sends the components's value as payload
             * @param {string} action - event that will be triggered
             * @param {string} value  - event's payload
             * @fires module:Password#ON_BLUR
             * @fires module:Password#ON_FOCUS
             * @fires module:Password#ON_INPUT
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
             * @param {string} newValue
             */
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    this.setValue(newValue, false);
                }
            },

            /**
             * Watches for changes of the revealed prop and updates the component's state,
             * for keeping in sync with the parent component.
             * @param {boolean} value
             */
            revealed : function(value) {
                this.state.isPasswordRevealed = value;
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-textfield' : TextField
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Password.EVENT = EVENT;

    return Password;
});
