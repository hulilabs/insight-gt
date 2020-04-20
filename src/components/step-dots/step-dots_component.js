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
 * @file StepDots component
 * @requires vue
 * @requires web-components/step-dots/step-dots_template.html
 * @requires web-components/step-dots/step-dots_styles.css
 * @module web-components/components/step-dots/step-dots_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/step-dots} for demos and documentation
 */
define([
    'vue',
    'text!web-components/step-dots/step-dots_template.html',
    'css-loader!web-components/step-dots/step-dots_styles.css'
],
function(
    Vue,
    Template
) {
    var StepDots = Vue.extend({
        name : 'StepDotsComponent',
        template : Template,
        props : {
            /**
             * Set the number of steps (dots)
             * - No custom validator added to handle this property gracefully
             */
            size : {
                type : Number,
                required : true
            },
            /**
             * Set the selected or active step (dot)
             * - Index is treated one-based. Zero or null means no step selected
             * - No custom validator added to handle this property gracefully
             */
            selected : {
                type : Number,
                required : false
            }
        },
        data : function() {
            // Define properties with basic value validations
            // setSize and setSelected are not available inside data method
            var size = (this.size && this.size >= 0) ? this.size : 0,
                selected = (this.selected && this.selected >= 1) ? this.selected : 1;

            return {
                state : {
                    // current amount of steps
                    size : size,
                    // index of the currently selected step
                    // for initialization, asume same value as property
                    // @see computed.selectedStep
                    selected : selected
                }
            };
        },
        computed : {
            /**
             * Computing selected step index
             *
             * The index must be in between size range [0-size], this means a default step
             * is calculated when the selected property is outside the range
             */
            selectedStep : {
                get : function() {
                    var value = this._defaultStepSelected();

                    if (!this.state.selected) {
                        this.state.selected = value;
                    }

                    return this.state.selected;
                },
                /**
                 * Sets the selected step by index
                 * @param {Number} index one-based
                 * @private
                 */
                set : function(index) {
                    var newValue = this.state.selected;

                    // Keep selected value in between size range [0-size]
                    if (index <= 0) {
                        newValue = this._defaultStepSelected();
                    } else if (index > this.state.size) {
                        newValue = this.state.size;
                    } else {
                        newValue = index;
                    }

                    // Update selected state value
                    this.state.selected = newValue;
                }
            }
        },
        methods : {
            /**
             * Defines default step based on size property
             * @return {number} default step one-based index
             * @private
             */
            _defaultStepSelected : function() {
                // No step selected
                var defaultStep = null;

                // Resolve from state
                if (this.state.size > 0 || this.size > 0) {
                    // Use first step
                    defaultStep = 1;
                }

                return defaultStep;
            },
            /**
             * Sets the selected step by index
             * This is a decorator for computed.selectedStep.set
             * @param {Number} index one-based
             * @public
             */
            setSelected : function(index) {
                this.selectedStep = index;
            },
            /**
             * Sets the amount of steps
             * @param {Number} size
             * @public
             */
            setSize : function(size) {
                // Use current state value as default
                var newValue = this.state.size;

                if (size < 0) {
                    newValue = 0;
                } else {
                    newValue = size;
                }

                // Update the size state value
                this.state.size = newValue;

                // Recalculate selected step on size change
                this.setSelected(this.state.selected);
            }
        },
        watch : {
            /**
             * Run validations and keeps selected state updated
             * @param {Number} newValue
             */
            selected : function(newValue) {
                if (newValue != this.state.selected) {
                    this.setSelected(newValue);
                }
            },
            /**
             * Run validations and keeps size state updated
             * @param {Number} newValue
             */
            size : function(newValue) {
                if (newValue != this.state.size) {
                    this.setSize(newValue);
                }
            }
        }
    });

    return StepDots;
});
