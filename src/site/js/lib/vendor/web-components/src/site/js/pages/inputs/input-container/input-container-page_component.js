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
 * @file InputContainer documentation page
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/input-container/input-container_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires text!web-components/inputs/input-container/readme.md
 * @requires text!pages/inputs/input-container/input-container-page_template.html
 * @module pages/inputs/input-container/input-container-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/inputs/input-container/input-container_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/input-container/readme.md',
    'text!pages/inputs/input-container/input-container-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Icon,
    InputContainer,
    TextField,
    Checkbox,
    Markdown,
    InputContainerReadme,
    Template
) {

    var InputcontainerPage = Vue.extend({
        template : Template,
        computed : {
            modifier : function() {
                if (this.isHeadline) {
                    return 'is-headline';
                }
                if (this.isTitle) {
                    return 'is-title';
                }
            }
        },
        data : function() {
            return {
                value : '',
                label : 'Hello',
                floatingLabel : false,
                required : false,
                placeholder : 'World!',
                isHeadline : false,
                isTitle : false,
                hasError : false,
                errorMessage : 'Error message',
                hintText : 'Input\'s hint text',
                charCounter : false,
                disabled : false,
                labelFor : 'sandbox',
                maxLength : null,
                example1 : '',
                example2 : '',
                example3 : '',
                example4 : '',
                example5 : '',
                example6 : '',
                example7 : '',
                example8 : '',
                example9 : '',
                example10 : '',
                markdownSource : {
                    documentation : InputContainerReadme
                }
            };
        },
        components : {
            'wc-icon' : Icon,
            'wc-input-container' : InputContainer,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField,
            'wc-checkbox' : Checkbox
        }
    });

    return InputcontainerPage;
});
