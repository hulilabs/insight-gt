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
 * @file Password Strength component
 * @requires vue
 * @requires zxcvbn
 * @requires web-components/inputs/password/password_component
 * @requires web-components/inputs/password/password_template.html
 * @module web-components/inputs/password/password_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/password} for demos and documentation
 */
define([
    'vue',
    'zxcvbn',
    'web-components/inputs/password/password_component',
    'text!web-components/inputs/password/password-strength_template.html',
    'css-loader!web-components/inputs/password/password-strength_styles.css'
],
function(
    Vue,
    zxcvbn,
    Password,
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
        ON_INPUT : 'input',
        ON_SCORE_UPDATE : 'password-strength-score'
    };

    /**
     * Available scores obtained from zxcvbn
     * @type {Object}
     */
    var SCORE = {
        WEAKEST : 0,
        WEAK : 1,
        MEDIUM : 2,
        STRONG : 3,
        STRONGEST : 4
    };

    var PasswordStrength = Vue.extend({
        name : 'PasswordStrengthComponent',
        template : Template,
        props : {
            /**
             * Text displaying in the score hint
             */
            strengthHintText : {
                type : String,
                required : true
            },
            /**
             * Label to display when the score is the lowest
             */
            scoreWeakest : {
                type : String
            },
            /**
             * Label to display when the score is weak
             */
            scoreWeak : {
                type : String,
                required : true
            },
            /**
             * Label to display when the score is medium
             */
            scoreMedium : {
                type : String,
                required : true
            },
            /**
             * Label to display when the score is strong
             */
            scoreStrong : {
                type : String,
                required : true
            },
            /**
             * Label to display when the score has the best score
             */
            scoreStrongest : {
                type : String
            },
            /**
             * Additional words that lower the score of the evaluation
             */
            dictionary : {
                type : Array,
                default : function() {
                    return [
                        'huli'
                    ];
                }
            },
            /**
             * Initial value for the password field
             */
            value : {
                type : String,
                default : null
            }
        },
        computed : {
            /**
             * Returns the score of the password using the `zxcvbn` library.
             * @returns {number}
             */
            score : function() {
                return zxcvbn(this.state.value, this.dictionary).score;
            },
            /**
             * Returns the label to be displayed for the evaluation
             * @returns {string}
             */
            scoreLabel : function() {
                switch (this.score) {
                    case SCORE.STRONGEST:
                        return this.scoreStrongest || this.scoreStrong;
                    case SCORE.STRONG:
                        return this.scoreStrong;
                    case SCORE.MEDIUM:
                        return this.scoreMedium;
                    case SCORE.WEAK:
                        return this.scoreWeak;
                    default:
                        return this.scoreWeakest || this.scoreWeak;
                }
            },
            /**
             * Returns the style to be displayed for the evaluation
             * @returns {string}
             */
            scoreStyle : function() {
                switch (this.score) {
                    case SCORE.STRONGEST:
                    case SCORE.STRONG:
                        return 'wc-PasswordStrength__score--strong';
                    case SCORE.MEDIUM:
                        return 'wc-PasswordStrength__score--medium';
                    default:
                        return 'wc-PasswordStrength__score--weak';
                }
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Keeps the entered password value
                     * @type {string}
                     */
                    value : this.value
                }
            };
        },
        methods : {
            /**
             * Set focus state to the textfield component
             * @param {boolean} shouldTriggerState
             */
            focus : function(shouldTriggerState) {
                this.$refs.password.focus(shouldTriggerState);
            },
            /**
             * Triggers the ON_FOCUS event
             * @fires module:PasswordStrength#ON_FOCUS
             * @private
             */
            _onFocus : function(value) {
                this._triggerState(EVENT.ON_FOCUS, value);
            },
            /**
             * Triggers the ON_BLUR event
             * @fires module:PasswordStrength#ON_BLUR
             * @private
             */
            _onBlur : function(value) {
                this._triggerState(EVENT.ON_BLUR, value);
            },
            /**
             * Triggers the ON_BLUR event
             * @fires module:PasswordStrength#ON_INPUT
             * @private
             */
            _onInput : function(value) {
                this.state.value = value;
                this._triggerState(EVENT.ON_INPUT, value);
            },
            /**
             * Triggers the given event and sends the components's value as payload
             * @param {string} action - event that will be triggered
             * @param {string} value  - event's payload
             * @fires module:PasswordStrength#ON_BLUR
             * @fires module:PasswordStrength#ON_FOCUS
             * @fires module:PasswordStrength#ON_INPUT
             * @fires module:PasswordStrength#ON_SCORE_UPDATE
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
                    this.state.value = newValue;
                }
            },
            /**
             * Fires an event everytime the score changes so container components
             * can keep track of the value.
             * @param {string} newValue
             * @fires module:PasswordStrength#ON_SCORE_UPDATE
             */
            score : function(newValue) {
                this._triggerState(EVENT.ON_SCORE_UPDATE, newValue);
            }
        },

        components : {
            'wc-password' : Password
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    PasswordStrength.EVENT = EVENT;

    return PasswordStrength;
});
