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
 * @file LinearLoader component
 * @requires vue
 * @requires web-components/loaders/linear/linear-loader_template.html
 * @requires web-components/loaders/linear/linear-loader_styles.css
 * @module web-components/loaders/linear-loader_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/loaders/linear} for demos and documentation
 */
define([
    'vue',
    'text!web-components/loaders/linear/linear-loader_template.html',
    'css-loader!web-components/loaders/linear/linear-loader_styles.css'
],
function(
    Vue,
    Template
) {
    var LinearLoader = Vue.extend({
        name : 'LinearLoaderComponent',
        template : Template,
        props : {
            /**
             * Sets the components as indeterminate
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
            }
        }
    });

    return LinearLoader;
});
