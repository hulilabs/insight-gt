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
 * @file RaisedButtonPage - wc-RaisedButton component examples and documentation
 * @requires vue
 * @requires web-components/buttons/raised/raised-button_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/buttons/raised/readme.md
 * @requires pages/buttons/raised/raised-button-page_template.html
 * @module pages/buttons/raised/raised-button-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/raised/raised-button_component',
    'web-components/markdown/markdown_component',
    'text!web-components/buttons/raised/readme.md',
    'text!pages/buttons/raised/raised-button-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    RaisedButton,
    Markdown,
    RaisedButtonReadme,
    PageTemplate
) {

    var RaisedButtonPage = Vue.extend({
        template : PageTemplate,
        data : function() {
            return {
                markdownSource : {
                    documentation : RaisedButtonReadme
                }
            };
        },
        components : {
            'wc-raised-button' : RaisedButton,
            'wc-markdown' : Markdown
        }
    });

    return RaisedButtonPage;
});
