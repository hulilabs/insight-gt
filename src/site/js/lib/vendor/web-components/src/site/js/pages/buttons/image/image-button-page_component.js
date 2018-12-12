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
 * @file image button component demo
 * @requires vue
 * @requires web-components/buttons/image/image-button_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/buttons/image/readme.md
 * @requires pages/buttons/image/image-button-page_template.html
 * @module pages/buttons/image/image-button-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/image/image-button_component',
    'web-components/markdown/markdown_component',
    'text!web-components/buttons/image/readme.md',
    'text!pages/buttons/image/image-button-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    ImageButton,
    Markdown,
    ImageButtonReadme,
    PageTemplate
) {

    var ImageButtonPage = Vue.extend({
        template : PageTemplate,
        data : function() {
            return {
                imagePath : '/site/img/doctor-male.svg',
                markdownSource : {
                    documentation : ImageButtonReadme
                },
                singleSelectionValue : null,
                julioIsSelected : false,
                ramonIsSelected : false,
                luciaIsSelected : false
            };
        },
        components : {
            'wc-image-button' : ImageButton,
            'wc-markdown' : Markdown
        }
    });

    return ImageButtonPage;
});
