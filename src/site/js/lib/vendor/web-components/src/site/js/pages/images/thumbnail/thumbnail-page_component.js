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
 * @file ThumbnailPage documentation page
 * @requires vue
 * @requires web-components/images/thumbnail/thumbnail_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/images/thumbnail/readme.md
 * @requires pages/images/thumbnail/thumbnail-page_template.html
 * @module pages/images/thumbnail/thumbnail-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/images/thumbnail/thumbnail_component',
    'web-components/markdown/markdown_component',
    'text!web-components/images/thumbnail/readme.md',
    'text!pages/images/thumbnail/thumbnail-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Thumbnail,
    Markdown,
    ThumbnailReadme,
    Template
) {

    var ThumbnailPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : ThumbnailReadme
                },
                thumbnailSource : {
                    svgPath : '/site/img/doctor-male.svg'
                },
                thumbnailBehavior : {
                    username : 'Julio Health'
                }
            };
        },
        components : {
            'wc-thumbnail' : Thumbnail,
            'wc-markdown' : Markdown
        }
    });

    return ThumbnailPage;
});
