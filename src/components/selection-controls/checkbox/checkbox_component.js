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
 * @file Checkbox component
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/effects/ripple/ripple_component
 * @requires web-components/selection-controls/mixins/selection-control_mixin
 * @requires web-components/selection-controls/mixins/focus-behaviour_mixin
 * @requires web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior
 * @requires web-components/selection-controls/checkbox/checkbox_template.html
 * @requires web-components/components/selection-controls/checkbox/checkbox_styles.css
 * @module web-components/components/selection-controls/checkbox/checkbox_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/checkbox} for demos and documentation
 * @fires module:Checkbox#ON_INPUT
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/effects/ripple/ripple_component',
    'web-components/selection-controls/mixins/selection-control_mixin',
    'web-components/selection-controls/mixins/focus-behavior_mixin',
    'text!web-components/selection-controls/checkbox/checkbox_template.html',
    'css-loader!web-components/selection-controls/checkbox/checkbox_styles.css'
],
function(
    Vue,
    Icon,
    Ripple,
    selectionControlMixin,
    focusBehaviorMixin,
    Template
) {

    var Checkbox = Vue.extend({
        name : 'CheckboxComponent',
        template : Template,
        props : {
            /**
             * Custom color for the checkbox
             */
            color : {
                type : String,
                required : false,
                default : null
            }
        },
        mixins : [selectionControlMixin, focusBehaviorMixin],
        methods : {
            /**
             * Returns inner <input> tag
             * @return {Element}
             */
            getInput : function() {
                return this.$refs.input;
            },
            /**
             * Triggers the animation of the ripple component
             * @private
             */
            _animate : function() {
                this.$refs.ripple.animate();
            },
            /**
             * Notifies state changes, analogue to native 'change' event.
             * This applies support for v-model in checkboxes when
             * they accept a non-boolean value as their checked payload
             * @fires module:Checkbox#ON_INPUT
             * @private
             */
            _onChange : function() {
                this._animate();

                // @see web-components/selection-controls/mixins/selection-control_mixin@isChecked
                var isChecked = this.isChecked(),
                    payload = isChecked;

                // Handles the non-boolean & array value scenario
                if ((this.customValue || this.customValue === 0) && this.value instanceof Array) {
                    // Saves a copy for not modifying directly the value prop
                    var valueIndex = this.value.indexOf(this.customValue),
                        clonedValue = this.value.slice(0);
                    // When the component is checked and its model hasn't been already updated
                    if (isChecked && valueIndex === -1) {
                        clonedValue.push(this.customValue);
                    // When the checked state is removed, the value must be removed from the array
                    } else if (!isChecked) {
                        clonedValue.splice(valueIndex, 1);
                    }

                    payload = clonedValue;
                }

                this.$emit(this.events.ON_INPUT, payload);
            }
        },
        computed : {
            /**
             * Return true if this checkbox has a defined custom color
             * @return {Boolean}
             */
            hasCustomColor : function() {
                return (!this.disabled && this.color);
            },
            /**
             * If this component has a defined custom color
             * then this computed data will return the css styles
             * to render the corresponding color in the checkbox background
             *
             * @return Object styles map
             */
            inlineCssCheck : function() {
                return this.hasCustomColor ?
                            {
                                'background-color' : this.color
                            }
                            : null ;
            },
            /**
             * If this component has a defined custom color
             * then this computed data will return the css styles
             * to render the corresponding color in the checkbox border
             *
             * @return Object styles map
             */
            inlineCssCheckbox : function() {
                return this.hasCustomColor ?
                            {
                                'border-color' : this.color
                            }
                            : null ;
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-ripple' : Ripple
        }
    });

    return Checkbox;
});
