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
 * @file TextField component
 * @requires vue
 * @requires web-components/utils/random
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/enum/input-types_enum
 * @requires web-components/inputs/input-container/input-container_component
 * @requires web-components/mixins/input/input_behavior
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/inputs/textfield/textfield_template.html
 * @module web-components/components/inputs/textfield/textfield_component
 * @extends Vue
 * @fires module:TextField#ON_ACTION
 * @fires module:TextField#ON_BLUR
 * @fires module:TextField#ON_FOCUS
 * @fires module:TextField#ON_INPUT
 * @fires module:TextField#ON_INVALID
 * @see {@link https://web-components.hulilabs.xyz/components/textfield} for demos and documentation
 */
define([
    'vue',
    'web-components/utils/random',
    'web-components/icons/icon_component',
    'web-components/inputs/enum/input-types_enum',
    'web-components/inputs/input-container/input-container_component',
    'web-components/mixins/input/input_behavior',
    'web-components/mixins/input/input-container_behavior',
    'text!web-components/inputs/textfield/textfield_template.html'
],
function(
    Vue,
    RandomUtil,
    Icon,
    InputTypesEnum,
    InputContainer,
    InputBehavior,
    InputContainerBehavior,
    Template
) {
    /**
     * List of textfield component events
     * @type {Object}
     */
    var EVENT = {
        // Native events
        ON_FOCUS : 'focus',
        ON_BLUR : 'blur',
        ON_INPUT : 'input',
        ON_INVALID : 'invalid',
        // Custom events
        ON_ACTION : 'textfield-action'
    };

    /**
     * Standard empty value
     * @type {String}
     */
    var EMPTY_VALUE = '';

    /**
     * @see web-components/mixins/input/input_behavior
     * Properties set via InputBehavior:
     *     - type : {String}
     *     - name : {?String}
     *     - id : {?String}
     *     - value : {?String|?Number}
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
     *     - nativeError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - charCounter  : {Boolean}
     *     - modifier : {?String}
     *     - hideInputHighlighter : {Boolean}
     *     - showSecondaryStyle : {Boolean}
     *     - actionDisabled : {Boolean}
     */
    var TextField = Vue.extend({
        name : 'TextFieldComponent',
        template : Template,
        mixins : [InputBehavior, InputContainerBehavior],
        props : {
            /**
             * Determines if the textfield should have a clear action
             */
            clear : {
                type : Boolean,
                default : false
            },
            /**
             * Inject a custom class to the input element
             */
            inputClass : {
                type : String,
                default : ''
            },
            /**
             * Determines whether or not an input type number should support signed values
             */
            signed : {
                type : Boolean,
                default : false
            },
            /**
             * Constrains the input value to one that passes a regex test
             */
            pattern : {
                type : RegExp,
                default : null
            },
            /**
             * Trims the value before emitting the input event, so the parent component
             * will always get the value without leading empty spaces.
             * Only works with input type text
             */
            trim : {
                type : Boolean,
                default : true
            }
        },
        computed : {
            /**
             * Determines block visibility
             * @return {Boolean}
             */
            isHidden : function() {
                return InputTypesEnum.HIDDEN === this.type;
            },
            /**
             * Determines if the input's type corresponds to number
             * @return {Boolean}
             */
            isTypeNumber : function() {
                return InputTypesEnum.NUMBER === this.type;
            },
            /**
             * Determines if the clear action button is visible or not.
             * The clear action will be visible if the textfield is currently focused.
             * @return {Boolean}
             */
            isClearVisible : function() {
                return this.clear && this.state.isFocused && !!this.state.value;
            },
            /**
             * Determines if the textfield has an action.
             * This action may be the clear action (which logic is handled by the textfield)
             * or a custom action that will be handled by the parent component.
             * @return {Boolean}
             */
            hasAction : function() {
                return (this.clear || (this.$slots.hasOwnProperty('action') && this.$slots.action.length > 0));
            },
            /**
             * Detect if an error was provided or natively thrown
             * @return {Boolean}
             */
            hasAnyError : function() {
                return this.hasError || (this.nativeError && this.state.hasValidityError);
            },
            /**
             * Builds a style object based on whether or not a
             * custom color prop was given
             * @return {Object}
             */
            inlineCssTextfield : function() {
                var inlineCss = {};

                if (this.color) {
                    inlineCss.color = this.color;
                }

                return inlineCss;
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
                     * Focused state of the textfield according to the input's state
                     * @type {Boolean}
                     */
                    isFocused : false,

                    hasValidityError : false
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
             * Updates the textfield's state with the current value of the input field.
             *
             * @param {String}  value                - input field's value
             * @param {Boolean} [shouldTriggerState] - if the ON_INPUT event should be triggered
             * @param {Event}   [event]              - browser object
             *
             * @fires module:TextField#ON_INPUT
             */
            setValue : function(value, shouldTriggerState, event) {
                var isTypeText = InputTypesEnum.TEXT === this.type,
                    isString = 'string' === typeof value;
                this.state.value = (isTypeText && isString && this.trim) ? value.trim() : value;

                if (shouldTriggerState !== false) {
                    this._triggerState(EVENT.ON_INPUT, event);
                }
            },
            /**
             * Set focus state to the input and input container
             * @param {boolean} shouldTriggerState
             */
            focus : function(shouldTriggerState) {
                this.$refs.input.focus();
                this.$refs.inputContainer.focus(shouldTriggerState);
            },
            /**
             * Detect native errors
             * Uses Validity feature which is not reactive
             * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
             * @return {Boolean}
             */
            _checkValidity : function() {
                if (this.nativeError) {
                    var validity = (this.$refs.input && this.$refs.input.validity);
                    this.state.hasValidityError = (!!validity && !validity.valid);
                }
            },
            /**
             * Input field's on change handler.
             * This listener corresponds to the "input" event of the input.
             * @param {Event} e oninput event's object definition
             * @return {undefined}
             * @private
             */
            _onChange : function(e) {
                var maxLength = parseInt(this.maxLength),
                    // this.$refs.input
                    input = e.target,
                    value = input.value;

                // Check validity
                this._checkValidity();

                /**
                 * Several flows are handle by the following condition:
                 *
                 *  (A) Cancels input if a regex is passed as a pattern
                 *      argument and it doesn't match the input
                 *
                 *  (B) Known issue: invalid numeric values (ie. 716-980)
                 *      will set an empty string without cleaning the input
                 */
                if ((this.pattern && !this.pattern.test(value)) ||
                    (this.isTypeNumber && this.state.hasValidityError)) {
                    // DO NOT trigger the invalid event, let it happend at _onInvalid
                    this._resetCurrentValue();
                    e.preventDefault();
                    return;
                }

                // on number inputs, reduce the string into the max length
                if (this.isTypeNumber && !isNaN(maxLength)) {
                    this.setValue(value.length >= maxLength ? value.slice(0, maxLength) : value, true, e);
                    return;
                }

                this.setValue(value, true, e);
                return;
            },
            /**
             * Input field's on invalid handler.
             * This listener corresponds to the "invalid" event of the input.
             * @see {https://www.w3schools.com/jsref/event_oninvalid.asp}
             * @param {Event} e onInvalid event's object definition
             * @private
             */
            _onInvalid : function(e) {
                this._checkValidity();
                this._triggerState(EVENT.ON_INVALID, e);
            },
            /**
             * Handles the input's keypress event. This allows to handle the known
             * issue of the inputs type number, because browsers don't have a standard way
             * to handle the interaction with this kind of inputs.
             * @param {Event} e
             */
            _onKeyPress : function(e) {
                // Leave special keys alone
                if (e.metaKey || e.ctrlKey || e.altKey) {
                    return;
                }

                // Native error checking
                this._checkValidity();

                // Perform the validation of input only if the type is number
                if (this.isTypeNumber) {
                    // Allow to have only one decimal dot (this doesn't work for several dots input)
                    var numberRegex = /[0-9]/,
                        maxLength = parseInt(this.maxLength);

                    if (this.signed && e.target.value.indexOf('-') === -1 && e.target.value.indexOf('.') === -1) {
                        // If it's signed and doesn't already have a sign or a dot, it must support both
                        numberRegex = /[0-9.-]/;
                    } else if (this.signed && e.target.value.indexOf('-') === -1) {
                        // If it already has a dot, but it's signed and doesn't already have a sign
                        numberRegex = /[0-9-]/;
                    } else if (e.target.value.indexOf('.') === -1) {
                        // If it's not signed or already has a sign, but hasn't a dot
                        numberRegex = /[0-9.]/;
                    }

                    // Prevent the key down if pressed key is a non-numeric value or if the max length constrain is exceeded
                    if (this.__isPrintable(e) &&
                        (!numberRegex.test(String.fromCharCode(e.charCode)) ||
                        (!isNaN(maxLength) && maxLength <= e.target.value.length))) {
                        e.preventDefault();
                    }
                }
            },
            /**
             * ON_FOCUS handler of the input container component.
             * Updates the textfield's state to focused
             * @fires module:TextField#ON_FOCUS
             * @private
             */
            _onFocus : function() {
                if (!this.readonly) {
                    this.state.isFocused = true;
                    this._triggerState(EVENT.ON_FOCUS);
                }
            },
            /**
             * Detect the clear action trigger and handle the value cleaning
             * @param  {HTMLElement} target
             * @return {boolean}
             * @private
             */
            _onClear : function(target) {
                var isClearAction = (target === this.$refs.action);
                if (isClearAction) {
                    // If the action is the clear button, clear the input's value
                    if (this.clear) {
                        this.setValue(EMPTY_VALUE);
                    }
                }
                return isClearAction;
            },
            /**
             * ON_BLUR handler of the input container component.
             * Updates the textfield's state to not focused.
             * If an action was given, triggers the event for handling that action.
             * If the action corresponds to the clear action, set the input's value as empty.
             * On mobile, touch events do not fire blur on action tab, then the clear is handle on action
             * @param {InputContainerPayload} payload data sent when the event was triggered
             * @fires module:TextField#ON_ACTION
             * @fires module:TextField#ON_BLUR
             * @private
             */
            _onBlur : function(payload) {
                /**
                 * If the action was the one which triggered the blur event,
                 * we are interested in keeping the input focused, but executing the action
                 */
                if (this._onClear(payload.e.relatedTarget)) {
                    // And trigger the action event for notifying its parent the clear action was clicked
                    this._triggerState(EVENT.ON_ACTION, payload.e);
                } else {
                    this.state.isFocused = false;
                    this._triggerState(EVENT.ON_BLUR, payload.e);
                }
            },
            /**
             * Keeps the focus in the input element and triggers the ON_ACTION event for
             * allowing parent components to handle the custom event.
             * @fires module:TextField#ON_ACTION
             * @private
             */
            _onAction : function(e) {
                // Only on mobile, touch events are thrown on action click
                if (window.TouchEvent && e instanceof window.TouchEvent) {
                    // Check if the action is the clear button to clear the textfield value
                    this._onClear(e.currentTarget);
                }

                this.$refs.input.focus();
                this._triggerState(EVENT.ON_ACTION, e);
            },
            /**
             * Triggers the given event and sends the input's value as payload
             * @param {String} action  - event to be triggered
             * @param {Event}  [event] - browser event object
             * @fires module:TextField#ON_ACTION
             * @fires module:TextField#ON_BLUR
             * @fires module:TextField#ON_FOCUS
             * @fires module:TextField#ON_INPUT
             * @private
             */
            _triggerState : function(action, event) {
                this.$emit(action, this.state.value, event);
            },

            /**
             * Determines whether or not the pressed key code from a keydown event
             * is a "printable" character, e.g. if it's an alphanumeric character or a symbol.
             * This function in particular checks for any non-printable character that should
             * cause visual changes in an input. It's based on polymer's iron-input. Check
             * the following link for more details on how this works.
             * @see  {@link https://github.com/PolymerElements/iron-input/blob/master/iron-input.html}
             */
            __isPrintable : function(e) {
                // For these keys, ASCII code == browser keycode.
                var anyNonPrintable =
                    (e.keyCode == 8) ||  // backspace
                    (e.keyCode == 9) ||  // tab
                    (e.keyCode == 13) ||  // enter
                    (e.keyCode == 27);     // escape

                // For these keys, make sure it's a browser keycode and not an ASCII code.
                var mozNonPrintable =
                    (e.keyCode == 19) ||  // pause
                    (e.keyCode == 20) ||  // caps lock
                    (e.keyCode == 45) ||  // insert
                    (e.keyCode == 46) ||  // delete
                    (e.keyCode == 144) ||  // num lock
                    (e.keyCode == 145) ||  // scroll lock
                    (e.keyCode > 32 && e.keyCode < 41) || // page up/down, end, home, arrows
                    (e.keyCode > 111 && e.keyCode < 124); // fn keys

                return !anyNonPrintable && !(e.charCode === 0 && mozNonPrintable);
            },
            /**
             * Set again the same current value
             * This is mainly done to flush invalid values on change
             * @param {Boolean} shouldTriggerState if the ON_INPUT event should be triggered
             */
            _resetCurrentValue : function(shouldTriggerState) {
                this._setInputValue(this.state.value);
                this.setValue(this.state.value, shouldTriggerState);
            },
            /**
             * Updates the input's value
             */
            _setInputValue : function(value) {
                this.$refs.input.value = value;
            }
        },
        watch : {
            // When native error prop is changed, reverify validity
            nativeError : function() {
                this._checkValidity();
            },
            // Value must be watched for listening parent or vuex changes
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    // Set the value but don't trigger the on input event
                    this.setValue(newValue, false);
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
            'wc-icon' : Icon,
            'wc-input-container' : InputContainer
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    TextField.EVENT = EVENT;

    return TextField;
});
