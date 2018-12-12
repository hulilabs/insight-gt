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
    'web-components/buttons/raised/raised-button_component',
    'web-components/overlays/overlay_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'text!web-components/overlays/readme.md',
    'text!pages/overlay/overlay-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    RaisedButton,
    Overlay,
    Markdown,
    Checkbox,
    OverlayReadme,
    Template
) {

    var OverlayPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                // Model properties
                active : false,
                closeOnClick : true,
                closeOnEscKey : true,
                blockScroll : false,
                // Documentation
                markdownSource : {
                    documentation : OverlayReadme
                }
            };
        },
        methods : {
            open : function() {
                this.active = true;
            },
            onOverlayChange : function() {
                this.active = false;
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-overlay' : Overlay,
            'wc-markdown' : Markdown,
            'wc-raised-button' : RaisedButton
        }
    });

    return OverlayPage;
});
