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
 * @file Textarea documentation page
 * @requires vue
 * @requires web-components/inputs/textarea/textarea_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/textarea/readme.md
 * @requires pages/textarea/textarea-page_template.html
 * @module pages/textarea/textarea-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/textarea/textarea_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'web-components/utils/adaptive/adaptive',
    'text!web-components/inputs/textarea/readme.md',
    'text!pages/inputs/textarea/textarea-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Textarea,
    TextField,
    Checkbox,
    Markdown,
    AdaptiveUtil,
    TextareaReadme,
    Template
) {

    var TextareaPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                charCounter : false,
                disabled : false,
                floatingLabel : true,
                focusHint : AdaptiveUtil.isMobile() ? 'Press enter to create a new line' : 'Press shift+enter to create a new line',
                hasError : false,
                hintText : false,
                mobile : false,
                label : true,
                maxLength : null,
                minLength : null,
                placeholder : false,
                readonly : false,
                required : false,
                value : null,
                trim : true,
                markdownSource : {
                    documentation : TextareaReadme
                }
            };
        },
        computed : {
            description : function() {
                var c = [], d = [];

                if (this.disabled) {
                    d.push('disabled');
                }

                if (this.required) {
                    d.push('required');
                }

                if (this.placeholder) {
                    c.push('placeholder');
                }

                if (this.floatingLabel) {
                    c.push('floating label');
                }

                if (this.label && !this.floatingLabel) {
                    c.push('label');
                }

                if (this.hasError) {
                    c.push('error message');
                }

                if (this.hintText) {
                    c.push('hint text');
                }

                if (this.charCounter) {
                    c.push('char counter');
                }

                if (this.autocomplete) {
                    c.push('autocomplete');
                }

                if (c.length > 0) {
                    var last = c.pop();
                    d.push('with');

                    if (c.length > 1) {
                        d.push(c.join(', '));
                    } else if (c.length === 1) {
                        d.push(c[0]);
                    }

                    if (c.length >= 1) {
                        d.push('and');
                    }

                    d.push(last);
                }

                return d.join(' ');
            }
        },
        components : {
            'wc-textarea' : Textarea,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField,
            'wc-checkbox' : Checkbox
        }
    });

    return TextareaPage;
});
