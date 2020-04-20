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
 * @file Markdown component, compiles markdown syntax to HTML.
 * This component uses 2 third party:
 * - marked: https://github.com/chjj/marked, compiles the markdown to html
 * - highlight: https://highlightjs.org/ prettify the pre and code html tags.
 * @requires vue
 * @requires marked
 * @requires highlight
 * @requires web-components/markdown/markdown_template.html
 * @requires web-components/markdown/markdown_styles.css
 * @module web-components/components/markdown/markdown_component
 * @extends Vue
 */
define([
    'vue',
    'marked',
    'highlight',
    'text!web-components/markdown/markdown_template.html',
    'css-loader!web-components/markdown/markdown_styles.css'
],
function(
    Vue,
    marked,
    Highlight,
    Template
) {
    var Markdown = Vue.extend({
        name : 'MarkdownComponent',
        template : Template,
        props : {
            source : {
                type : String,
                required : false,
                default : null
            }
        },
        created : function() {
            // configuring the marked library to use the highlight library
            marked.setOptions({
                highlight : function(code) {
                    return Highlight.highlightAuto(code).value;
                }
            });
        },
        computed : {
            content : function() {
                if (this.source) {
                    return marked(this.source);
                }
                if (this.$slots && this.$slots.default && this.$slots.default[0].text) {
                    return marked(this.$slots.default[0].text);
                }
            }
        }
    });

    return Markdown;
});
