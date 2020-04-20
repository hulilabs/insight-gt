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
 * @file Stepper component
 * @requires vue
 * @requires web-components/effects/ripple/ripple_component
 * @requires web-components/steppers/stepper_template.html
 * @requires web-components/components/steppers/stepper_styles.css
 * @module web-components/components/steppers/stepper_component
 * @extends Vue
 * @fires module:Stepper#ON_CHANGE
 * @see {@link https://web-components.hulilabs.xyz/components/stepper} for demos and documentation
 */
define([
    'vue',
    'web-components/effects/ripple/ripple_component',
    'text!web-components/steppers/stepper_template.html',
    'css-loader!web-components/steppers/stepper_styles.css'
],
function(
    Vue,
    Ripple,
    Template
) {
    var Stepper = Vue.extend({
        name : 'StepperComponent',
        template : Template,
        props : {
            /**
             * Array of objects for defining the steps' ids (for distinction when they're active),
             * their tooltip text and if the step is enabled (if it should be displayed).
             * @warning The steps MUST NOT have duplicated ids.
             * @example The format for the steps object definition:
             * {
                    id : {String},
                    tooltip : {String},
                    isEnabled : {Boolean}
                }
             */
            steps : {
                type : Array,
                required : true,
                /**
                 * Checks that the objects comply with the appropriate format and that there are
                 * no duplicated step ids.
                 * @param {Object[]} steps definition of the stepper's steps
                 * @return {Boolean} if the given steps value is valid
                 */
                validator : function(steps) {
                    var ids = [],
                        invalidSteps = steps.filter(function(step) {
                            var isValid = typeof step === 'object' &&
                                step.hasOwnProperty('id') && step.id &&
                                step.hasOwnProperty('tooltip') && step.tooltip &&
                                step.hasOwnProperty('isEnabled') &&
                                ids.indexOf(step.id) === -1;

                            ids.push(step.id);

                            return !isValid;
                        });

                    return invalidSteps.length === 0;
                }
            },
            /**
             * Value of the current active step. This value references the 'id' key of the
             * correspondant step's object.
             */
            active : {
                type : String,
                required : false,
                default : null
            }
        },
        data : function() {
            return {
                state : {
                    active : this.active
                },
                events : {
                    ON_CHANGE : 'change'
                }
            };
        },
        methods : {
            /**
             * Sets the value for the currently active step.
             * @param {String} newStep the new step that will be set as active
             */
            setActive : function(newStep) {
                this.state.active = newStep;
            },
            /**
             * Sets the clicked step as active and triggers the ON_CHANGE event
             * for notifying the parent component which step was selected.
             * @param {String} step the step that was clicked and will be set as active
             * @private
             */
            _onStepClickedHandler : function(step) {
                this.setActive(step);
                this.$refs[step][0].animate();
                this._triggerState();
            },
            /**
             * Triggers the ON_CHANGE event with its respective payload, containing the value
             * of the currently active step
             * @fires module:Stepper#ON_CHANGE
             * @private
             */
            _triggerState : function() {
                /**
                 * @typedef {Object} OnChangePayload
                 * @property {String} active - id of the object definition of the active step
                 */
                var payload = {
                    active : this.state.active
                };

                /**
                 * change event
                 *
                 * @event module:Stepper#ON_CHANGE
                 * @type {OnChangePayload}
                 */
                this.$emit(this.events.ON_CHANGE, payload);
            }
        },
        watch : {
            /**
             * Makes sure that the parent's value for the current active step matches with
             * the state of the stepper.
             * @param {String} newStep the step's id of which will be set as the currently active
             */
            active : function(newStep) {
                if (newStep !== this.state.active) {
                    this.setActive(newStep);
                }
            }
        },
        components : {
            'wc-ripple' : Ripple
        }
    });

    return Stepper;
});
