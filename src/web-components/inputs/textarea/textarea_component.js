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
 * @file Textarea component
 * @requires vue
 * @requires web-components/utils/random
 * @requires web-components/inputs/input-container/input-container_component
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/inputs/textarea/textarea_template.html
 * @requires web-components/inputs/textarea/textarea_styles.css
 * @module web-components/inputs/textarea/textarea_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/textarea} for demos and documentation
 */
define([
    'vue',
    'web-components/utils/random',
    'web-components/inputs/input-container/input-container_component',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'text!web-components/inputs/textarea/textarea_template.html',
    'css-loader!web-components/inputs/textarea/textarea_styles.css'
],
function(
    Vue,
    RandomUtil,
    InputContainer,
    InputBehavior,
    InputContainerBehavior,
    Template
) {
    /**
     * List of textarea component events
     * @type {Object}
     */
    var EVENT = {
        // Native events
        ON_FOCUS : 'focus',
        ON_BLUR : 'blur',
        ON_INPUT : 'input',
    };

    /**
     * Hidden field input type
     * @type {String}
     */
    var HIDDEN_TYPE = 'hidden';

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
     *     - modifier : {?String}
     *     - actionDisabled : {Boolean}
     */
    var Textarea = Vue.extend({
        name : 'TextareaComponent',
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             * Optional text to be displayed when the text area has focus
             * @type {String}
             */
            focusHint : {
                type : String,
                default : null
            },
            /**
             * Whether the component should render the device dependent layout.
             * @type {Boolean}
             */
            mobile : {
                type : Boolean,
                default : false
            },
            /**
             * Whether or not it has to trim its value before emitting the input event,
             * so the parent component will always get the value without leading empty spaces.
             */
            trim : {
                type : Boolean,
                default : true
            },

            /**
             * Returns an object with the custom styles that should be applied
             * to the textarea. It will usually hold styles that need to override
             * element options
             */
            classObject : {
                type : Object,
                default : function() {
                    return {
                        inputClass : '',
                        inputContainerClass : ''
                    };
                }
            }
        },
        computed : {
            /**
             * Determines block visibility
             * @return {Boolean}
             */
            isHidden : function() {
                return this.type === HIDDEN_TYPE;
            },

            /**
             * Determines if the textarea has an action.
             * This action may be the clear action (which logic is handled by the textarea)
             * or a custom action that will be handled by the parent component.
             * @inheritDoc web-components/inputs/input-container/input-container_component
             * @return {Boolean}
             */
            hasAction : function() {
                return this.$slots.hasOwnProperty('action');
            },

            /**
             * Returns the textarea value formatted as html, this is used in
             * the mirror container to grow the textarea dynamically
             * @return {String}
             */
            getValueForMirror : function() {
                var value = this.state.value;

                // taken from @see https://github.com/PolymerElements/iron-autogrow-textarea/blob/master/iron-autogrow-textarea.html
                // sanitizes user input
                value = value ? value
                    .replace(/&/gm, '&amp;')
                    .replace(/"/gm, '&quot;')
                    .replace(/'/gm, '&#39;')
                    .replace(/</gm, '&lt;')
                    .replace(/>/gm, '&gt;')
                    .split('\n') : [''];

                return value.join('<br/>') + '&#160;';
            },

            /**
             * Returns the hint text to be displayed depending on whether the
             * component has a normal hint and a focus hint.
             * @return {?String}
             */
            getHintText : function() {
                return this.state.hintText && !this.mobile ? this.state.hintText : this.hintText;
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * The current value of the input field
                     * @type {?String}
                     */
                    value : this.value,
                    /**
                     * Focused state of the textarea according to the input's state
                     * @type {Boolean}
                     */
                    isFocused : false,

                    /**
                     * State of the hint text, will change depending on the
                     * focus state
                     * @type {?String}
                     */
                    hintText : null
                },
                /**
                 * Randomly generated id for the input field.
                 * The random id is generated only if the "id" prop isn't given.
                 * @type {?String}
                 */
                pseudoId : null
            };
        },
        mounted : function() {
            /**
             * Obtains a pseudo id for connecting label and input
             * @return {String}
             */
            this.pseudoId = this.id || RandomUtil.getPseudoId();
        },
        methods : {
            /**
             * Returns the input's current value
             * @return {String} current value of the input
             */
            getValue : function() {
                return this.state.value;
            },
            /**
             * Updates the textarea's state with the current value of the input field.
             * @param {String}  value               input field's value
             * @param {Boolean} shouldTriggerState  if the ON_INPUT event should be triggered
             * @fires module:TextArea#ON_INPUT
             */
            setValue : function(value, shouldTriggerState) {
                this.state.value = ('string' === typeof value && this.trim) ? value.trim() : value;

                if (shouldTriggerState !== false) {
                    this._triggerState(EVENT.ON_INPUT);
                }
            },
            /**
             * Set focus state to the textarea and input container
             */
            focus : function() {
                this.$refs.input.focus();
                this.$refs.inputContainer.focus();
            },
            /**
             * Input field's on change handler.
             * This listener corresponds to the "input" event of the input.
             * @param {Event} e oninput event's object definition
             * @private
             */
            _onChange : function(e) {
                this.setValue(e.target.value);
            },
            /**
             * @typedef {InputContainerPayload}
             *
             * @property {?String} value current value of the input element
             * @property {Event} e object containing the triggered event's information
             */
            /**
             * ON_FOCUS handler of the input container component.
             * Updates the textarea's state to focused
             * @fires module:TextArea#ON_FOCUS
             * @private
             */
            _onFocus : function() {
                if (this.focusHint) {
                    this.state.hintText = this.focusHint;
                }
                this.state.isFocused = true;
                this._triggerState(EVENT.ON_FOCUS);
            },
            /**
             * ON_BLUR handler of the input container component.
             * Updates the textarea's state to not focused.
             * If an action was given, triggers the event for handling that action.
             * If the action corresponds to the clear action, set the input's value as empty.
             * @fires module:TextArea#ON_BLUR
             * @private
             */
            _onBlur : function() {
                // reset hint text
                this.state.hintText = null;
                this.state.isFocused = false;
                this._triggerState(EVENT.ON_BLUR);
            },
            /**
             * Triggers the given event and sends the input's value as payload
             * @param {String} action event to be triggered
             * @fires module:TextArea#ON_BLUR
             * @fires module:TextArea#ON_FOCUS
             * @fires module:TextArea#ON_INPUT
             * @private
             */
            _triggerState : function(action) {
                this.$emit(action, this.state.value);
            }
        },
        watch : {
            // Value must be watched for listening parent or vuex changes
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    // Set the value but don't trigger the on input event
                    this.setValue(newValue, false);
                    // update value in dom element
                    this.$refs.input.value = newValue;
                }
            },
            // If the trim prop is given, trim the value and trigger the input event
            trim : function(value) {
                if (value) {
                    this.setValue(this.state.value, true);
                }
            }
        },
        components : {
            'wc-input-container' : InputContainer
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Textarea.EVENT = EVENT;

    return Textarea;
});
