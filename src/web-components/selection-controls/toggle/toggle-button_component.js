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
 * @file ToggleButton component
 * @requires vue
 * @requires web-components/selection-controls/mixins/selection-control_mixin
 * @requires web-components/selection-controls/toggle/toggle-button_template.html
 * @requires web-components/components/selection-controls/toggle/toggle-button_styles.css
 * @module web-components/components/selection-controls/toggle/toggle-button_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/toggle} for demos and documentation
 * @fires module:ToggleButton#ON_INPUT
 */
define([
    'vue',
    'web-components/selection-controls/mixins/selection-control_mixin',
    'text!web-components/selection-controls/toggle/toggle-button_template.html',
    'css-loader!web-components/selection-controls/toggle/toggle-button_styles.css'
],
function(
    Vue,
    selectionControlMixin,
    Template
) {

    var ToggleButton = Vue.extend({
        name : 'ToggleButtonComponent',
        template : Template,
        mixins : [selectionControlMixin],
        computed : {
            /**
             * Determines if the toggle button is currently checked
             * according to the given value. This allows to compute the checked
             * state of the toggle when the toggle has a custom value rather than
             * the Boolean returned by the native input type checkbox used.
             * @return {Boolean} if the toggle button is currently checked
             */
            isActive : function() {
                return (this.value === true || (this.customValue && this.value === this.customValue));
            }
        },
        methods : {
            /**
             * Returns inner <input> tag, to be used by the keyboard focus behaviour
             * @return {Element}
             */
            getInput : function() {
                return this.$refs.input;
            },
            /**
             * Notifies the selection of a toggle button, sending the given custom value as payload
             * @fires module:ToggleButton#ON_INPUT
             */
            _onChange : function() {

                var payload = this.isChecked();

                if (this.customValue || this.customValue === 0) {
                    payload = (payload) ? this.customValue : null;
                }

                this.$emit(this.events.ON_INPUT, payload);
            }
        }
    });

    return ToggleButton;
});
