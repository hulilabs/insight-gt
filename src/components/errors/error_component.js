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
 * @file Error component
 * @requires vue
 * @requires web-components/errors/error_template.html
 * @requires web-components/errors/error_styles.css
 * @module web-components/errors/error_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/error} for demos and documentation
 */
define([
    'vue',
    'text!web-components/errors/error_template.html',
    'css-loader!web-components/errors/error_styles.css'
],
function(
    Vue,
    Template
) {

    /**
     * List of error layouts
     * @type {Object}
     */
    var LAYOUT = {
        CARD : 'card',
        SELECTION : 'selection',
        NONE : 'none'
    };

    var ErrorComponent = Vue.extend({
        name : 'ErrorComponent',
        template : Template,
        props : {
            /**
             * Determine the error display mode based on how it relates to another component
             */
            layout : {
                type : String,
                default : LAYOUT.NONE,
                validator : function(value) {
                    return LAYOUT.hasOwnProperty(value.toUpperCase());
                }
            }
        }
    });

    /**
     * Component-exposed layouts
     * @type {Object}
     */
    ErrorComponent.LAYOUT = LAYOUT;

    return ErrorComponent;
});
