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
 * @file StepDots documentation page
 * @requires vue
 * @requires web-components/step-dots/step-dots_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/step-dots/readme.md
 * @requires pages/step-dots/step-dots-page_template.html
 * @module pages/step-dots/step-dots-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/step-dots/step-dots_component',
    'web-components/markdown/markdown_component',
    'text!web-components/step-dots/readme.md',
    'text!pages/step-dots/step-dots-page_template.html'
], function(
    Vue,
    StepDots,
    Markdown,
    StepDotsReadme,
    Template
) {

    var StepDotsPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    // Default amount of step dots
                    size : 5,
                    // Default selected step dot
                    selected : 2
                },
                // Step dot readme
                markdownSource : {
                    documentation : StepDotsReadme
                }
            };
        },
        methods : {
            /**
             * Transforms a value into a valid number
             * Modifier v-model.number handles empty input as empty string
             * @param {String|Number} value
             * @return {Number}
             */
            _toNumber : function(value) {
                return value === '' ? 0 : parseInt(value);
            }
        },
        watch : {
            /**
             * Watch required to keep size state updated and handle empty value
             * @param {String|Number} newValue
             */
            'state.size' : function(newValue) {
                this.state.size = this._toNumber(newValue);
            },
            /**
             * Watch required to keep selected state updated and handle empty value
             * @param {String|Number} newValue
             */
            'state.selected' : function(newValue) {
                this.state.selected = this._toNumber(newValue);
            }
        },
        components : {
            'wc-step-dots' : StepDots,
            'wc-markdown' : Markdown
        }
    });

    return StepDotsPage;
});
