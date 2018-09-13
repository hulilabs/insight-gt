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
    'web-components/effects/ripple/ripple_effect',
    'text!web-components/effects/ripple/readme.md',
    'text!web-components/directives/ripple-effect/readme.md',
    'text!pages/ripple/ripple-page_template.html'
], function(
    Vue,
    Markdown,
    RippleEffect,
    RippleEffectReadme,
    RippleEffectDirectiveReadme,
    Template
) {

    var RipplePage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : RippleEffectReadme,
                    directive : RippleEffectDirectiveReadme
                }
            };
        },
        components : {
            'wc-markdown' : Markdown
        }
    });

    return RipplePage;
});
