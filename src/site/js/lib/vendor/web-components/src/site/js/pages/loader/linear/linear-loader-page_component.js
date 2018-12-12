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
 * @file Loader documentation page
 * @requires vue
 * @requires web-components/loaders/linear/linear-loader_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/loaders/linear/readme.md
 * @requires pages/loader/linear/linear-loader-page_template.html
 * @module pages/loader/linear/linear-loader-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/loaders/linear/linear-loader_component',
    'web-components/markdown/markdown_component',
    'web-components/inputs/textfield/textfield_component',
    'text!web-components/loaders/linear/readme.md',
    'text!pages/loader/linear/linear-loader-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    LinearLoader,
    Markdown,
    TextField,
    LinearLoaderReadme,
    Template
) {

    var LinearLoaderPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                progress : 17,
                markdownSource : {
                    documentation : LinearLoaderReadme
                }
            };
        },
        components : {
            'wc-linear-loader' : LinearLoader,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField
        }
    });

    return LinearLoaderPage;
});
