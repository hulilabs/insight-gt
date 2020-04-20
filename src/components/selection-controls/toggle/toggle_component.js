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
 * @file Toggle component
 * @requires vue
 * @requires web-components/selection-controls/toggle/toggle-button_component
 * @requires web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior
 * @requires web-components/selection-controls/toggle/toggle_template.html
 * @requires web-components/components/selection-controls/toggle/toggle_styles.css
 * @module web-components/components/selection-controls/toggle/toggle_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/toggle-button} for demos and documentation
 */
define([
    'vue',
    'web-components/selection-controls/toggle/toggle-button_component',
    'web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior',
    'text!web-components/selection-controls/toggle/toggle_template.html',
    'css-loader!web-components/selection-controls/toggle/toggle_styles.css'
],
function(
    Vue,
    ToggleButton,
    KeyboardFocusBehavior,
    Template
) {

    // state to let the toggle-button know that it's part of a toggle collection
    var TOGGLE_COLLECTION_STATE_CLASS = 'is-inToggleCollection';

    var Toggle = Vue.extend({
        name : 'ToggleComponent',
        template : Template,
        props : {
            // this is the label displayed on top of the first row of toggle buttons
            label : {
                type : String,
                required : false,
                default : null
            },
            // this is the label displayed below the toggle buttons in case of error
            error : {
                type : String,
                required : false
            },
            // determines if the toggle buttons must have a padding between the
            // label and the buttons themselves
            noTopSpacing : {
                type : Boolean,
                required : false,
                default : false
            },
            // Determines the styles for the disabled state of the component
            disabled : {
                type : Boolean,
                required : false,
                default : false
            }
        },
        data : function() {
            return {
                /**
                 * Behavior for allowing keyboard navigation between toggle elements
                 */
                toggleArrowBehavior : null
            };
        },
        mounted : function() {
            // binds behavior to allow keyboard arrow interaction
            // to move focus using UP and DOWN keys
            this.toggleArrowBehavior = new KeyboardFocusBehavior();
            this.toggleArrowBehavior.bind(this.$el);

            this._updateChildrenAlignment();
        },
        updated : function() {
            this._updateChildrenAlignment();
        },
        methods : {
            /**
             * Updates the children toggle button alignment class
             */
            _updateChildrenAlignment : function() {
                // iterates over every toggle-button to apply keys management behavior and
                // add the state class
                this.$children.map(function(child) {
                    if (child instanceof ToggleButton) {
                        this.toggleArrowBehavior.add(child);
                        child.setAlignClass(TOGGLE_COLLECTION_STATE_CLASS);
                    }
                }.bind(this));
            }
        }
    });

    return Toggle;
});
