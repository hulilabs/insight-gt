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
    'web-components/drawers/drawer_component',
    'text!web-components/drawers/readme.md',
    'text!pages/drawer/drawer-page_template.html'
], function(
    Vue,
    Markdown,
    Drawer,
    DrawerReadme,
    Template
) {

    var DrawerPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    showNav : false
                },
                markdownSource : {
                    documentation : DrawerReadme
                }
            };
        },
        methods : {
            toggleDrawer : function() {
                this.state.showNav = !this.state.showNav;
            },
            drawerChanged : function(newState) {
                this.state.showNav = newState.active;
            }
        },
        components : {
            'wc-drawer' : Drawer,
            'wc-markdown' : Markdown
        }
    });

    return DrawerPage;
});
