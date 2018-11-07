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
 * @file Typography documentation page
 * @requires vue
 * @requires 'web-components/markdown/markdown_component'
 * @requires 'text!pages/typography/typography-page_template.html'
 * @requires css-loader!site/css/components/styleguide.css'
 * @module pages/step-dots/step-dots-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/markdown/markdown_component',
    'text!pages/typography/typography-page_template.html',
    'css-loader!site/css/components/styleguide.css',
    'css-loader!web-components/typography/typography_styles.css'
], function(
    Vue,
    Markdown,
    Template
) {

    var TypographyPage = Vue.extend({
        template : Template,
        components : {
            'wc-markdown' : Markdown
        }
    });

    return TypographyPage;
});
