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
 * @file Switch component
 * @requires vue
 * @requires web-components/selection-controls/switch/switch_template.html
 * @requires web-components/selection-controls/switch/switch_styles.css
 * @module web-components/selection-controls/switch/switch_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/switch} for demos and documentation
 */
define([
    'vue',
    'web-components/effects/ripple/ripple_component',
    'web-components/selection-controls/mixins/selection-control_mixin',
    'web-components/selection-controls/mixins/focus-behavior_mixin',
    'text!web-components/selection-controls/switch/switch_template.html',
    'css-loader!web-components/selection-controls/switch/switch_styles.css',
],
function(
    Vue,
    Ripple,
    selectionControlMixin,
    focusBehaviorMixin,
    Template
) {

    var Switch = Vue.extend({
        name : 'SwitchComponent',
        template : Template,
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
             * Notifies the selection of the switch, sending the given custom value as payload
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
        components : {
            'wc-ripple' : Ripple
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    // Switch.EVENT = EVENT;

    return Switch;
});
