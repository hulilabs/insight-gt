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
 * @file RadioButton component
 * @requires vue
 * @requires web-components/effects/ripple/ripple_component
 * @requires web-components/selection-controls/mixins/selection-control_mixin
 * @requires web-components/selection-controls/mixins/focus-behaviour_mixin
 * @requires web-components/selection-controls/radio-button/radio-button_template.html
 * @requires web-components/components/selection-controls/radio-button/radio-button_styles.css
 * @module web-components/components/selection-controls/radio-button/radio-button_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/radio-button} for demos and documentation
 * @fires module:RadioButton#ON_INPUT
 */
define([
    'vue',
    'web-components/effects/ripple/ripple_component',
    'web-components/selection-controls/mixins/selection-control_mixin',
    'web-components/selection-controls/mixins/focus-behavior_mixin',
    'text!web-components/selection-controls/radio-button/radio-button_template.html',
    'css-loader!web-components/selection-controls/radio-button/radio-button_styles.css'
],
function(
    Vue,
    Ripple,
    selectionControlMixin,
    focusBehaviorMixin,
    Template
) {

    var RadioButton = Vue.extend({
        name : 'RadioButtonComponent',
        template : Template,
        mixins : [selectionControlMixin, focusBehaviorMixin],
        components : {
            'wc-ripple' : Ripple
        },
        methods : {
            /**
             * Triggers the animation of the ripple component
             * @private
             */
            _animate : function() {
                this.$refs.ripple.animate();
            },
            /**
             * Notifies the selection of the radio button, sending the given custom value as payload
             * @fires module:RadioButton#ON_INPUT
             */
            _onChange : function() {
                this._animate();

                var payload = this.isChecked();

                if (this.customValue !== null) {
                    payload = (payload) ? this.customValue : null;
                }

                this.$emit(this.events.ON_INPUT, payload);
            }
        }
    });

    return RadioButton;
});
