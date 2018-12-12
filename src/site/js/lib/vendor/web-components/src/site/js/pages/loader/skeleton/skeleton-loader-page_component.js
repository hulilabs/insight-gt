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
 * @file Skeleton Loader documentation page
 * @module pages/loader/skeleton/skeleton-loader-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/loaders/skeleton/skeleton-loader_component',
    'web-components/markdown/markdown_component',
    'text!web-components/loaders/skeleton/readme.md',
    'text!pages/loader/skeleton/skeleton-loader-page_template.html'
], function(
    Vue,
    SkeletonLoaderComponent,
    Markdown,
    Readme,
    Template
) {

    var SkeletonLoaderPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : Readme
                }
            };
        },
        components : {
            'wc-markdown' : Markdown,
            'wc-skeleton-loader' : SkeletonLoaderComponent
        }
    });

    return SkeletonLoaderPage;
});
