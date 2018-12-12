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
    'web-components/markdown/markdown_component',
    'text!web-components/markdown/readme.md',
    'text!pages/markdown/markdown-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Markdown,
    MarkdownReadme,
    PageTemplate
) {

    var MarkdownPage = Vue.extend({
        template : PageTemplate,
        data : function() {
            return {
                text : '# Hello\n## World!\n* List!\n* **Bold!**\n',
                markdownSource : {
                    documentation : MarkdownReadme
                }
            };
        },
        components : {
            'wc-markdown' : Markdown
        }
    });

    return MarkdownPage;
});
