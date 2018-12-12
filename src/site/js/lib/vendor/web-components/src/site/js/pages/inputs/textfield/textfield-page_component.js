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
 * @file TextField documentation page
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires text!web-components/inputs/textfield/readme.md
 * @requires text!pages/inputs/textfield/textfield-page_template.html
 * @module pages/inputs/textfield/textfield-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/textfield/readme.md',
    'text!pages/inputs/textfield/textfield-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Icon,
    TextField,
    Checkbox,
    Markdown,
    TextFieldReadme,
    Template
) {

    var TextFieldPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                autocomplete : true,
                charCounter : false,
                clear : true,
                color : null,
                disabled : false,
                floatingLabel : true,
                hasError : false,
                hasErrorSlot : false,
                errorMessage : 'If there is error text, error slot is not displayed',
                hintText : false,
                hasHintSlot : false,
                isHeadline : false,
                isTitle : false,
                label : true,
                max : null,
                maxLength : null,
                min : null,
                minLength : null,
                nativeError : false,
                pattern : /^([0-9]+[-\. ]?)*$/,
                placeholder : false,
                readonly : false,
                required : false,
                signed : false,
                step : null,
                trim : true,
                type : 'text',
                value : null,
                markdownSource : {
                    documentation : TextFieldReadme
                }
            };
        },
        computed : {
            modifier : function() {
                if (this.isHeadline) {
                    return 'is-headline';
                }
                if (this.isTitle) {
                    return 'is-title';
                }
            },
            description : function() {
                var c = [], d = [];

                if (this.disabled) {
                    d.push('disabled');
                }

                if (this.required) {
                    d.push('required');
                }
                d.push(this.type);
                d.push('input');

                if (this.placeholder) {
                    c.push('placeholder');
                }

                if (this.floatingLabel) {
                    c.push('floating label');
                }

                if (this.label && !this.floatingLabel) {
                    c.push('label');
                }

                if (this.clear) {
                    c.push('clear action');
                }

                if (this.hasError) {
                    c.push('has error');
                }

                if (this.nativeError) {
                    c.push('native error validation');
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

                if (this.isTitle && !this.isHeadline) {
                    c.push('title styles');
                }

                if (this.isHeadline) {
                    c.push('headline styles');
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
        methods : {
            onAction : function() {
                this.$refs.customAction.setValue('This is a custom action example');
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-icon' : Icon,
            'wc-textfield' : TextField,
            'wc-markdown' : Markdown
        }
    });

    return TextFieldPage;
});
