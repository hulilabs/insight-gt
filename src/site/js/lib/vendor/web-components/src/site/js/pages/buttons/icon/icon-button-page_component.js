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
 * @file icon button component, follows material design spec
 * @requires vue
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/buttons/icon/readme.md
 * @requires text!pages/buttons/icon/icon-button-page_template.html
 * @module pages/buttons/icon/icon-button-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/markdown/markdown_component',
    'text!web-components/buttons/icon/readme.md',
    'text!pages/buttons/icon/icon-button-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    IconButton,
    Markdown,
    IconButtonReadme,
    PageTemplate
) {

    var IconButtonPage = Vue.extend({
        template : PageTemplate,

        props : {
            notification : {
                type : Boolean,
                default : false
            }
        },

        data : function() {
            return {
                markdownSource : {
                    documentation : IconButtonReadme
                },
                // flag for showing notification dot
                hasNotification : !!this.notification,
                // flag for handling theme toggling
                isLightThemeSelected : false
            };
        },

        methods : {
            /**
             * Logs the clicked element and toggles the new state
             * @param  {Event} e
             */
            _onClick : function(e) {
                console.log('clicked', e.currentTarget); //jshint ignore:line
                this.hasNotification = !this.hasNotification;
            },

            /**
             * Demo for toggling between themes
             */
            _toggleTheme : function() {
                this.isLightThemeSelected = !this.isLightThemeSelected;
            }
        },

        components : {
            'wc-icon-button' : IconButton,
            'wc-markdown' : Markdown
        }
    });

    return IconButtonPage;
});
