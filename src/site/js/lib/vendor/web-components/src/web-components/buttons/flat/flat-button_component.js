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
 * @file flat button component, follows material design spec
 * @requires vue
 * @requires web-components/behaviors/a11y/button-focus/button-focus_behavior
 * @requires web-components/buttons/flat/flat-button_template.html
 * @requires web-components/buttons/flat/flat-button_styles.css
 * @module web-components/buttons/flat/flat-button_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/behaviors/a11y/button-focus/button-focus_behavior',
    'text!web-components/buttons/flat/flat-button_template.html',
    'css-loader!web-components/buttons/flat/flat-button_styles.css'
],
function(
    Vue,
    ButtonFocusBehavior,
    Template
) {

    var FlatButton = Vue.extend({
        name : 'FlatButtonComponent',
        template : Template,
        props : {
            // adds disabled attribute
            disabled : {
                type : Boolean
            },
            // adds `is-large` modifier
            large : {
                type : Boolean
            },
            // toggles smart focus behavior
            // @see web-components/behaviors/a11y/button-focus/button-focus_behavior
            smartFocus : {
                type : Boolean
            },
            // adds `is-link` modifier for resembling a link
            link : {
                type : Boolean,
                default : false
            },
            // determines if the button must have the active styles
            active : {
                type : Boolean,
                default : false
            }
        },
        mounted : function() {
            this._addSmartFocus();
        },
        methods : {
            /**
             * Attaches `ButtonFocusBehavior` if `smartFocus` prop is set
             * @see web-components/behaviors/a11y/button-focus/button-focus_behavior
             */
            _addSmartFocus : function() {
                if (this.smartFocus) {
                    ButtonFocusBehavior.bind(this.$el);
                }
            }
        },
    });

    return FlatButton;
});
