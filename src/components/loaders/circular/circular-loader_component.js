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
 * @file CircularLoader component
 * @requires vue
 * @requires web-components/loaders/circular/circular-loader_template.html
 * @requires web-components/loaders/circular/circular-loader_styles.css
 * @module web-components/loaders/circular/circular-loader_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/loaders/circular} for demos and documentation
 */
define([
    'vue',
    'text!web-components/loaders/circular/circular-loader_template.html',
    'css-loader!web-components/loaders/circular/circular-loader_styles.css'
],
function(
    Vue,
    Template
) {
    var LOADER_CIRCUMFERENCE_PERCENTAGE = 0.63;

    /**
     * Default values for the circle's dimensions according to design guidelines
     * @type {Object}
     */
    var DEFAULT_VALUES = {
        CX : '12px',
        CY : '12px',
        R : '10px'
    };

    var CircularLoader = Vue.extend({
        template : Template,
        props : {
            /**
             * Use light theme
             */
            light : {
                type : Boolean,
                default : false
            },

            /**
             * Sets the component as indeterminate
             */
            indeterminate : {
                type : Boolean,
                default : false
            },

            /**
             * Used when the loader is determinate, sets the current progress of the loader
             */
            progress : {
                type : Number,
                default : 0,
                validator : function(value) {
                    return (value <= 100 && value >= 0);
                }
            },

            /**
             * Changes the loader color to the saver color if this prop is set true
             */
            isSaver : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    isSpinning : true
                },

                defaultValues : DEFAULT_VALUES
            };
        },
        computed : {
            /**
             * Calculates the progress having 63px of circumference
             * @return {Number}
             */
            processProgress : function() {
                return this.progress * LOADER_CIRCUMFERENCE_PERCENTAGE;
            }
        }
    });

    return CircularLoader;
});
