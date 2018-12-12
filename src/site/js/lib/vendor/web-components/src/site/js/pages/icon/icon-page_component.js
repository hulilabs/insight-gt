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
  * @file IconPage component, wc-Icon component examples and documentation
  * @requires vue
  * @requires web-components/icons/icon_component
  * @requires web-components/markdown/markdown_component
  * @requires web-components/icons/readme.md
  * @requires pages/icon/icon-page_template.html
  * @module  pages/icon/icon-page_component
  * @extends Vue
  *
  */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/markdown/markdown_component',
    'text!web-components/icons/readme.md',
    'text!pages/icon/icon-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Icon,
    Markdown,
    IconReadme,
    PageTemplate
) {

    // this class is part of the inner implmentation of the icon's "has-notification"
    // @see the icon's template icon for details
    var HAS_NEW_STATE_CLASS = 'has-notification';

    var IconPage = Vue.extend({
        template : PageTemplate,
        data : function() {
            return {
                markdownSource : {
                    documentation : IconReadme
                }
            };
        },

        methods : {
            /**
             * Toggles icon's HAS_NEW_STATE_CLASS, bound to click events
             * @param  {Event} e
             */
            _toggleNotification : function(e) {
                if (e.currentTarget.classList.contains(HAS_NEW_STATE_CLASS)) {
                    e.currentTarget.classList.remove(HAS_NEW_STATE_CLASS);
                } else {
                    e.currentTarget.classList.add(HAS_NEW_STATE_CLASS);
                }
            }
        },

        components : {
            'wc-icon' : Icon,
            'wc-markdown' : Markdown
        }
    });

    return IconPage;
});
