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
 * @file RadioButton documentation page
 * @requires vue
 * @requires web-components/selection-controls/radio-button/radio-button_component
 * @requires web-components/selection-controls/radio-group/radio-group_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/radio-button/readme.md
 * @requires web-components/selection-controls/radio-group/readme.md
 * @requires pages/selection-controls/radio-button/radio-button-page_template.html
 * @module pages/selection-controls/radio-button/radio-button-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/selection-controls/radio-button/radio-button_component',
    'web-components/selection-controls/radio-group/radio-group_component',
    'web-components/markdown/markdown_component',
    'text!web-components/selection-controls/radio-button/readme.md',
    'text!web-components/selection-controls/radio-group/readme.md',
    'text!pages/selection-controls/radio-button/radio-button-page_template.html'
], function(
    Vue,
    Checkbox,
    RadioButton,
    RadioGroup,
    Markdown,
    RadioButtonReadme,
    RadioGroupReadme,
    Template
) {
    var RadioButtonPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                compact : false,

                radioButtons1 : 2,
                radioGroup0 : null,
                radioGroup1 : null,
                radioGroup2 : 4,

                sandboxLayout : 'row',
                sandboxValue : null,

                markdownSource : {
                    documentation : RadioButtonReadme,
                    radioGroupDocumentation : RadioGroupReadme
                }
            };
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-radio-button' : RadioButton,
            'wc-radio-group' : RadioGroup,
            'wc-markdown' : Markdown
        }
    });

    return RadioButtonPage;
});
