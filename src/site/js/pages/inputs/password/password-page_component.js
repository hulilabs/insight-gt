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
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/password/readme.md
 * @requires pages/password/password-page_template.html
 * @module pages/inputs/password/password-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/password/password_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/password/readme.md',
    'text!pages/inputs/password/password-page_template.html'
], function(
    Vue,
    Password,
    Checkbox,
    Markdown,
    PasswordReadme,
    Template
) {

    var PasswordPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                value : '',
                disabled : false,
                floatingLabel : true,
                hasError : false,
                hintText : null,
                placeholder : false,
                required : false,
                markdownSource : {
                    documentation : PasswordReadme
                }
            };
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-password' : Password,
            'wc-markdown' : Markdown
        }
    });

    return PasswordPage;
});
