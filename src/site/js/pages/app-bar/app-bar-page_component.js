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
define([
    'vue',
    'web-components/bars/app-bar/app-bar_component',
    'web-components/markdown/markdown_component',
    'text!web-components/bars/app-bar/readme.md',
    'text!pages/app-bar/app-bar-page_template.html'
], function(
    Vue,
    AppBar,
    Markdown,
    AppBarReadme,
    Template
) {

    var AppBarPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : AppBarReadme
                },
                title : 'title'
            };
        },
        components : {
            'wc-app-bar' : AppBar,
            'wc-markdown' : Markdown
        }
    });

    return AppBarPage;
});
