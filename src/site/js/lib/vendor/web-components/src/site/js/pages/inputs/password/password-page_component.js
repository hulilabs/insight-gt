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
 * @file Password documentation page
 * @requires vue
 * @requires web-components/inputs/password/password_component
 * @requires web-components/inputs/password/password-strength_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/password/readme.md
 * @requires pages/password/password-page_template.html
 * @module pages/inputs/password/password-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/password/password_component',
    'web-components/inputs/password/password-strength_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/password/readme.md',
    'text!pages/inputs/password/password-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Password,
    PasswordStrength,
    Checkbox,
    Textfield,
    Markdown,
    PasswordReadme,
    Template
) {

    var PasswordPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                blacklistText : 'hulilab,huli,test@test.com',
                value : '',
                strengthValue : '',
                disabled : false,
                floatingLabel : true,
                hasError : false,
                hasErrorSlot : false,
                errorMessage : 'This password is not valid',
                hintText : false,
                hasHintSlot : false,
                placeholder : false,
                required : false,
                autocomplete : true,
                markdownSource : {
                    documentation : PasswordReadme
                },
                revealed : false
            };
        },
        computed : {
            blacklist : function() {
                return this.blacklistText.split(',');
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-password' : Password,
            'wc-password-strength' : PasswordStrength,
            'wc-markdown' : Markdown,
            'wc-textfield' : Textfield,
        }
    });

    return PasswordPage;
});
