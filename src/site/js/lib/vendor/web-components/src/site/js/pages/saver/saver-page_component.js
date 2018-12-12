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
 * @file Saver documentation page
 * @requires vue
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/savers/saver_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/savers/readme.md
 * @requires pages/saver/saver-page_template.html
 * @module pages/saver/saver-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/savers/saver_component',
    'web-components/markdown/markdown_component',
    'text!web-components/savers/readme.md',
    'text!pages/saver/saver-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Checkbox,
    Saver,
    Markdown,
    SaverReadme,
    Template
) {

    var SaverPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                saveData : false,
                keepVisible : false,
                markdownSource : {
                    documentation : SaverReadme
                }
            };
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-saver' : Saver,
            'wc-markdown' : Markdown
        }
    });

    return SaverPage;
});
