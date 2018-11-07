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
 * @file CustomLogic documentation page
 * @requires vue
 * @requires web-components/custom-logics/custom-logic_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/custom-logics/readme.md
 * @requires pages/custom-logic/custom-logic-page_template.html
 * @module pages/custom-logic/custom-logic-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/custom-logic/custom-logic_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'text!web-components/inputs/custom-logic/readme.md',
    'text!pages/inputs/custom-logic/custom-logic-page_template.html'
], function(
    Vue,
    CustomLogic,
    TextField,
    Markdown,
    Checkbox,
    CustomLogicReadme,
    Template
) {

    var CustomLogicPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                format : '(###) ####-####',
                placeholder : '(CCC) NNNN-NNNN',
                hasError : false,
                hasLabel : false,
                value : null,
                maskedValue : null,
                markdownSource : {
                    documentation : CustomLogicReadme
                }
            };
        },
        watch : {
            value : function() {
                this.maskedValue = this.$refs.customLogic ? this.$refs.customLogic.getMaskedValue() : '';
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-custom-logic' : CustomLogic,
            'wc-textfield' : TextField,
            'wc-markdown' : Markdown
        }
    });

    return CustomLogicPage;
});
