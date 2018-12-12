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
  * @file flat button component demo
  * @requires vue
  * @requires web-components/buttons/flat/flat-button_component
  * @requires web-components/markdown/markdown_component
  * @requires web-components/buttons/flat/readme.md
  * @requires pages/buttons/flat/flat-button-page_template.html
  * @module pages/buttons/flat/flat-button-page_component
  * @extends Vue
  */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/markdown/markdown_component',
    'text!web-components/buttons/flat/readme.md',
    'text!pages/buttons/flat/flat-button-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    FlatButton,
    Markdown,
    FlatButtonReadme,
    PageTemplate
) {

    var FlatButtonPage = Vue.extend({
        template : PageTemplate,
        data : function() {
            return {
                markdownSource : {
                    documentation : FlatButtonReadme
                }
            };
        },
        components : {
            'wc-flat-button' : FlatButton,
            'wc-markdown' : Markdown
        }
    });

    return FlatButtonPage;
});
