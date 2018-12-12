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
 * @file Tooltip documentation page
 * @requires vue
 * @requires web-components/mixins/vue-refs_mixin
 * @requires web-components/icons/icon_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/tooltips/tooltip_component
 * @requires web-components/tooltips/readme.md
 * @requires pages/tooltip/tooltip-page_template.html
 * @module pages/tooltip/tooltip-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/mixins/vue-refs_mixin',
    'web-components/icons/icon_component',
    'web-components/markdown/markdown_component',
    'web-components/tooltips/tooltip_component',
    'text!web-components/tooltips/readme.md',
    'text!web-components/directives/tooltip/readme.md',
    'text!pages/tooltip/tooltip-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    VueRefsMixin,
    Icon,
    Markdown,
    Tooltip,
    TooltipReadme,
    TooltipDirectiveReadme,
    Template
) {

    var TooltipPage = Vue.extend({
        template : Template,
        mixins : [VueRefsMixin],
        data : function() {
            return {
                markdownSource : {
                    documentation : TooltipReadme,
                    directiveDocumentation : TooltipDirectiveReadme
                }
            };
        },
        components : {
            'wc-icon' : Icon,
            'wc-markdown' : Markdown,
            'wc-tooltip' : Tooltip
        }
    });

    return TooltipPage;
});
