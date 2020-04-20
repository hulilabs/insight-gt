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
 * @file InputContainer
 *
 * @description container component that allows encapsulation of the floating label behavior,
 *              input's states and interaction with its "addons".
 *
 * @requires vue
 * @requires web-components/errors/error_component
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/inputs/char-counter/char-counter_component
 * @requires web-components/inputs/input-container/input-container_template.html
 * @requires web-components/inputs/input-container/input-container_styles.css
 *
 * @module web-components/inputs/input-container/input-container_component
 *
 * @extends Vue
 *
 * @implements InputContainerBehavior
 *
 * @fires module:InputContainerBehavior#ON_BLUR
 * @fires module:InputContainerBehavior#ON_FOCUS
 * @fires module:InputContainerBehavior#ON_CHANGE
 *
 * @see {@link https://web-components.hulilabs.xyz/components/input-container} for demos and documentation
 */
define([
    'vue',
    'web-components/errors/error_component',
    'web-components/mixins/input/input-container_behavior',
    'web-components/inputs/char-counter/char-counter_component',
    'text!web-components/inputs/input-container/input-container_template.html',
    'css-loader!web-components/inputs/input-container/input-container_styles.css'
],
function(
    Vue,
    ErrorComponent,
    InputContainerBehavior,
    CharCounter,
    Template
) {
    /**
     * @typedef {InputContainerPayload}
     *
     * @property {?string} value current value of the input element
     * @property {Event} e object containing the triggered event's information
     */

    /**
     * Class name for the given input element (the HTML tag corresponding to a form of user input)
     * @type {string}
     */
    var INPUT_CLASS_NAME = 'is-InputContainer__input';

    /**
     * Wrapper for an element for giving it behaviors similar to those of a material design
     * textfield, like a placeholder/floating-label, character counter, error message, states
     * handling and more.
     *
     * @see web-components/mixins/input/input-container_behavior
     *
     * Properties set via mixins:
     *     - label : {?string}
     *     - floatingLabel : {boolean}
     *     - placeholder : {string}
     *     - hasError : {boolean}
     *     - errorMessage : {?string}
     *     - hintText : {?string}
     *     - charCounter  : {boolean}
     *     - modifier : {?string}
     *     - hideInputHighlighter : {boolean}
     *     - showSecondaryStyle : {boolean}
     *     - actionDisabled : {boolean}
     */
    var InputContainer = Vue.extend({
        name : 'InputContainer',
        template : Template,
        mixins : [InputContainerBehavior],
        props : {
            /**
             * Value of the reactive property that watches the input element's changes.
             * This is required because without this property, the container won't have
             * a way to track if the input element is "dirty" or not.
             */
            value : {
                type : [String, Number],
                default : null
            },
            /**
             * Sets the input element as a required field.
             * No input is required by default.
             * If active, a special character (*) is added for distinguish this field.
             */
            required : {
                type : Boolean,
                default : false
            },
            /**
             * Disabled status of the input.
             * Determines the "is-disabled" state of the input's container component.
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Defines the 'for' HTML attribute for the input's label
             */
            labelFor : {
                type : String,
                default : null
            },
            /**
             * Input element's max length attribute
             */
            maxLength : {
                type : [Number, String],
                default : null
            },
            /**
             * Input element's min length attribute
             */
            minLength : {
                type : [Number, String],
                default : null
            },
            /**
             * Whether the input highlighter should be shown or not.
             */
            hideInputHighlighter : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Keeps track of the focus/blur states of the input element
                     * @type {boolean}
                     */
                    isFocused : false
                },
                /**
                 * Class used for giving the input element its appropriate styles
                 * @type {string}
                 */
                inputClassName : INPUT_CLASS_NAME
            };
        },
        computed : {
            /**
             * Computes the "dirty" state of the input element.
             * A dirty input means that the user has entered content into the input.
             * @return {boolean}
             */
            isDirty : function() {
                return this.value !== null && this.value.toString().length;
            },
            /**
             * Checks if the charCounter property was given.
             * It's just used for keeping the "has-something" convention.
             * @return {boolean}
             */
            hasCounter : function() {
                return this.charCounter === true;
            },
            /**
             * Checks if a non-empty content is given, for displaying a hint message or component.
             * The hint won't be displayed at the same time as an error message.
             * @return {boolean}
             */
            hasHint : function() {
                return (
                    ((this.hintText !== null && this.hintText.length > 0) ||
                        (this.$slots.hasOwnProperty('hintSlot') &&
                            this.$slots.hintSlot.length > 0)) &&
                    !this.hasError
                );
            },
            /**
             * Checks if the input should have a placeholder.
             * The placeholder can't be displayed along with a floating label.
             * @return {boolean}
             */
            hasPlaceholder : function() {
                return this.placeholder && !this.floatingLabel;
            },
            /**
             * Determines if the input element has a placeholder and this one is required.
             * Both a floating label and a placeholder can't both be marked as required.
             * @return {boolean}
             */
            hasPlaceholderRequired : function() {
                return this.hasPlaceholder && this.required && !this.label;
            },
            /**
             * Checks if content was given via the "suffix" named slot
             * @return {boolean}
             */
            hasSuffix : function() {
                return this.$slots.hasOwnProperty('suffix') && this.$slots.suffix.length > 0;
            },
            /**
             * Checks if an action for the input was given via the "action" named slot
             * @return {boolean}
             */
            hasAction : function() {
                return this.$slots.hasOwnProperty('action') && this.$slots.action.length > 0;
            },
            /**
             * Computes the classes that will be added to the input container according to
             * the state of the component.
             * @return {Object} state's classes of the input container
             */
            classObject : function() {
                return {
                    'is-dirty' : this.isDirty,
                    'is-focused' : this.state.isFocused,
                    'is-disabled' : this.disabled,
                    'has-action' : this.hasAction && !this.actionDisabled,
                    'has-error' : this.hasError,
                    'has-suffix' : this.hasSuffix,
                    'has-floating-label' : this.label && this.floatingLabel,
                    'hide-input-highlighter' : this.hideInputHighlighter,
                    'wc-InputContainer--secondary-style' : this.showSecondaryStyle
                };
            }
        },
        methods : {
            /**
             * Focus the input container
             * @param {boolean} shouldTriggerState
             * @fires module: InputContainer#ON_FOCUS
             */
            focus : function(shouldTriggerState) {
                this.state.isFocused = true;

                if (shouldTriggerState !== false) {
                    this.$emit('focus');
                }
            },
            /**
             * Gets the object that is sent as payload within the focus, blur and change events.
             * @param {Event} e event's information
             * @return {InputContainerPayload} event payload that contains the input's current value
             * @private
             */
            _getEventPayload : function(e) {
                return {
                    e : e,
                    value : this.value
                };
            },
            /**
             * On Blur handler of the input element.
             * Updates the state of the component, removing its focused status.
             * @fires module:InputContainerBehavior#ON_BLUR
             * @param {Event} e object containing the triggered event's information
             * @private
             */
            _onBlur : function(e) {
                this.state.isFocused = false;
                this.$emit('blur', this._getEventPayload(e));
            },
            /**
             * On Focus handler of the input element.
             * Updates the state of the component to its focused status.
             * @fires module:InputContainerBehavior#ON_FOCUS
             * @param {Event} e object containing the triggered event's information
             * @private
             */
            _onFocus : function(e) {
                this.state.isFocused = true;
                this.$emit('focus', this._getEventPayload(e));
            }
        },
        components : {
            'wc-char-counter' : CharCounter,
            'wc-error' : ErrorComponent
        }
    });

    return InputContainer;
});
