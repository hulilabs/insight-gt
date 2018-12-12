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
 * @file CircularLoader documentation page
 * @requires vue
 * @requires web-components/loaders/circular/circular-loader_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/loaders/circular/readme.md
 * @requires pages/loader/circular/circular-loader-page_template.html
 * @module pages/loader/circular/circular-loader-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/loaders/circular/circular-loader_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/inputs/textfield/textfield_component',
    'text!web-components/loaders/circular/readme.md',
    'text!pages/loader/circular/circular-loader-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    CircularLoader,
    Markdown,
    Checkbox,
    TextField,
    CircularLoaderReadme,
    Template
) {

    var CircularLoaderPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                progress : 17,
                light : false,
                markdownSource : {
                    documentation : CircularLoaderReadme
                }
            };
        },
        components : {
            'wc-circular-loader' : CircularLoader,
            'wc-textfield' : TextField,
            'wc-checkbox' : Checkbox,
            'wc-markdown' : Markdown
        }
    });

    return CircularLoaderPage;
});
