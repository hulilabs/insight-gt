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
 * @file Onboarding component
 * @requires vue
 * @requires web-components/helper/vue-helper
 * @requires web-components/helper/vue-refs-helper
 * @requires web-components/overlays/overlay_component
 * @requires web-components/step-dots/step-dots_component
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/buttons/raised/raised-button_component
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/mixins/floating-layer/floating-layer_mixin
 * @requires web-components/onboardings/onboarding_template.html
 * @requires web-components/onboardings/onboarding_styles.css
 * @module web-components/onboardings/onboarding_component
 * @extends Vue
 * @fires module:Onboarding#ON_CHANGE
 * @see {@link https://web-components.hulilabs.xyz/components/onboarding} for demos and documentation
 */
define([
    'vue',
    'web-components/helper/vue-helper',
    'web-components/helper/vue-refs-helper',
    'web-components/overlays/overlay_component',
    'web-components/step-dots/step-dots_component',
    'web-components/buttons/flat/flat-button_component',
    'web-components/buttons/raised/raised-button_component',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/floating-layer/floating-layer_mixin',
    'text!web-components/onboardings/onboarding_template.html',
    'css-loader!web-components/onboardings/onboarding_styles.css'
],
function(
    Vue,
    VueHelper,
    VueRefsHelper,
    Overlay,
    StepDots,
    FlatButton,
    RaisedButton,
    FloatingLayerBehavior,
    FloatingLayerMixin,
    Template
) {

    /**
     * Contains the animations for a smooth displaying or hiding of the onboarding
     * when it's active state changes
     * @type {Object}
     */
    var ANIMATION = {
        FADE_OUT : 'vt-onboarding-fade-out',
        FADE_IN_OUT : 'vt-onboarding-fade-in-out'
    };

    /**
     * Actions that trigger a component's state change.
     * @type {String}
     */
    var ACTION = {
        PREVIOUS : 'previous',
        NEXT : 'next',
        SKIPPED : 'skipped',
        COMPLETED : 'completed'
    };

    /**
     * List of onboarding component events
     * @type {Object}
     */
    var EVENT = {
        ON_CHANGE : 'onboarding-change'
    };

    var Onboarding = Vue.extend({
        name : 'OnboardingComponent',
        template : Template,
        mixins : [FloatingLayerMixin],
        props : {
            /**
             * Identification of the onboarding process that the step belongs to.
             */
            onboardingId : {
                type : String,
                required : true
            },
            /**
             * Total number of steps that are related to the onboarding step.
             * An onboarding process consists in one or more steps.
             */
            numberOfSteps : {
                type : Number,
                required : false,
                default : 1
            },
            /**
             * Number of the step regarding an onboarding process with a bunch of steps.
             * Acts like the step's id regarding the process identified by the onboardingId prop.
             */
            stepNumber : {
                type : Number,
                required : false,
                default : 1
            },
            /**
             * Defines the state of the onboarding step.
             * True determines that the step will be active and the target will be highlighted.
             */
            active : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Defines if the onboarding process could be interrupted by clicking the overlay
             */
            skippable : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Target element-to-be-bound-to
             */
            target : VueRefsHelper.prop(true),
            /**
             * Text for the previous step action button.
             */
            previousBtnLabel : {
                type : String,
                required : false,
                default : null
            },
            /**
             * Text for the next step action button.
             */
            nextBtnLabel : {
                type : String,
                required : false,
                default : null
            },
            /**
             * Text for the confirmation action button. This corresponds to the last step's label
             * and its action will terminate an onboarding process.
             */
            confirmBtnLabel : {
                type : String,
                required : false,
                default : null
            }
        },
        data : function() {
            return {
                /**
                 * state of the onboarding
                 */
                state : {
                    /**
                     * Active state of the component for showing its steps and its overlay
                     * @see FloatingLayerMixin
                     * @type {Boolean}
                     */
                    isActive : this.active,
                    /**
                     * State of the step when it has been seen (when moved to another step)
                     * @type {Boolean}
                     */
                    hasBeenSeen : false,
                    /**
                     * State when it's the last step and the next action is clicked
                     * @type {Boolean}
                     */
                    isCompleted : false,
                    /**
                     * State for skippable onboardings when the onboarding is skipped
                     * @type {Boolean}
                     */
                    isSkipped : false
                }
            };
        },
        computed : {
            /**
             * Determines if the onboarding step should display the step dots
             * if the onboarding process that it belongs to, has multiple steps.
             */
            hasMultipleSteps : function() {
                return this.numberOfSteps > 1;
            },
            /**
             * Determines if there is a step before the current one, for displaying the
             * previous step action button.
             */
            isPreviousStepEnabled : function() {
                return this.stepNumber > 1;
            },
            /**
             * Determines if the onboarding step corresponds to the first one.
             */
            isFirstStep : function() {
                return this.stepNumber === 1;
            },
            /**
             * Determines if the onboarding step corresponds to the last one.
             */
            isLastStep : function() {
                return this.stepNumber === this.numberOfSteps;
            },
            /**
             * Computes the transition name for a smooth opening or hiding transition.
             * Only steps corresponding to the first or last step of an onboarding process
             * may have an animation, for avoiding flashes in the screen when transitioning
             * back and forth the different steps.
             */
            transitionName : function() {
                if (this.isFirstStep && !this.state.hasBeenSeen) {
                    return ANIMATION.FADE_IN_OUT;
                } else if (this.isLastStep && this.state.isCompleted || this.skippable && this.state.isSkipped) {
                    return ANIMATION.FADE_OUT;
                } else {
                    return null;
                }
            }
        },
        mounted : function() {
            /**
             * Sets the size of the step dots component for displaying that
             * there are (or not) more steps in the current onboarding process.
             * This happens only if the onboarding is initiliazed and mounted as active
             */
            if (this.$refs.stepDots) {
                this.$refs.stepDots.setSize(this.numberOfSteps);
            }

            /**
             * Setting up floating layer behavior (positioning, etc.).
             */
            this.bindFloatingLayerBehavior({
                computedStateKey : 'floatingLayerState',
                floatingConnector : true,
                floatingElementReferenceKey : 'onboarding',
                floatingOffset : 16,
                triggerElement : VueRefsHelper.resolveVueRef(this.target),
                triggerEvent : FloatingLayerBehavior.EVENT.NONE
            });
        },
        methods : {
            /**
             * Triggers the state of the component, notifying that a previous step must be activated
             * @fires module:Onboarding#ON_CHANGE
             * @private
             */
            _previousStepHandler : function() {
                if (this.hasMultipleSteps && this.isPreviousStepEnabled) {
                    this.state.hasBeenSeen = true;
                    this._triggerState(ACTION.PREVIOUS);
                }
            },
            /**
             * Triggers the state of the component, notifying that a next step must be activated.
             * If the step corresponds to the last one and the next step action is triggered,
             * then the step notifies that the onboarding process is finished.
             * @fires module:Onboarding#ON_CHANGE
             * @private
             */
            _nextStepHandler : function() {
                if (this.isLastStep) {
                    this.state.isCompleted = true;
                    this._triggerState(ACTION.COMPLETED);
                } else {
                    this.state.hasBeenSeen = true;
                    this._triggerState(ACTION.NEXT);
                }
            },
            /**
             * Triggers the ON_CHANGE event for notifying the parent that the onboarding was skipped.
             * @fires module:Onboarding#ON_CHANGE
             * @private
             */
            _skipOnboarding : function() {
                if (this.skippable) {
                    this.state.isSkipped = true;
                    this._triggerState(ACTION.SKIPPED);
                }
            },
            /**
             * Triggers the state of the component, sending as payload the current active step.
             * @param {String} action executed action's name for triggering the component's ON_CHANGE event
             * @fires module:Onboarding#ON_CHANGE
             * @private
             */
            _triggerState : function(action) {
                /**
                 * @typedef {OnChangePayload}
                 * @property {String} id     id of the onboarding process the step belongs to
                 * @property {Number} step   the value of the onboarding step's id
                 * @property {String} action which action triggered the event
                 */
                var payload = {
                    id : this.onboardingId,
                    step : this.stepNumber,
                    action : action
                };

                /**
                 * change event
                 *
                 * @event module:Onboarding#ON_CHANGE
                 * @type {OnChangePayload}
                 */
                this.$emit(EVENT.ON_CHANGE, payload);
            }
        },
        watch : {
            /**
             * Watches the changes on the active property of the onboarding and updates
             * the component's state.
             * @param {Boolean} value new value of the component's active property
             */
            active : function(value) {
                if (value !== this.state.isActive) {
                    this.state.isActive = value;
                }
            }
        },
        components : {
            'wc-step-dots' : StepDots,
            'wc-flat-button' : FlatButton,
            'wc-raised-button' : RaisedButton,
            'wc-overlay' : Overlay
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Onboarding.EVENT = EVENT;

    return Onboarding;
});
