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
 * @file raised button component, follows material design spec
 * @requires vue
 * @requires web-components/buttons/raised/raised-button_template.html
 * @requires web-components/buttons/raised/raised-button_styles.css
 * @module web-components/buttons/raised/raised-button_component
 * @extends Vue
 */
define([
    'vue',
    'text!web-components/buttons/raised/raised-button_template.html',
    'css-loader!web-components/buttons/raised/raised-button_styles.css'
],
function(
    Vue,
    Template
) {

    var RaisedButton = Vue.extend({
        name : 'RaisedButtonComponent',
        template : Template,
        props : {
            // adds `is-disabled` modifier
            disabled : Boolean,
            // adds `is-large` modifier
            large : Boolean
        }
    });

    return RaisedButton;
});
