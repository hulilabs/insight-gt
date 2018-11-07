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
 * @file Checkbox documentation page
 * @requires vue
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/selection-controls/checklist/checklist_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/checkbox/readme.md
 * @requires pages/selection-controls/checkbox/checkbox-page_template.html
 * @module pages/selection-controls/checkbox/checkbox-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/selection-controls/checklist/checklist_component',
    'web-components/markdown/markdown_component',
    'text!web-components/selection-controls/checkbox/readme.md',
    'text!web-components/selection-controls/checklist/readme.md',
    'text!pages/selection-controls/checkbox/checkbox-page_template.html'
], function(
    Vue,
    Checkbox,
    Checklist,
    Markdown,
    CheckboxReadme,
    ChecklistReadme,
    Template
) {

    var CheckboxPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                checkbox1 : true,
                checkbox2 : true,
                checkbox3 : false,
                checkbox4 : true,
                checklistValue : [3],
                rowChecklistValue : [1],

                sandboxDisplayRow : false,
                sandboxValue : [],

                markdownSource : {
                    documentation : CheckboxReadme,
                    checklistDocumentation : ChecklistReadme
                }
            };
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-checklist' : Checklist,
            'wc-markdown' : Markdown
        }
    });

    return CheckboxPage;
});
