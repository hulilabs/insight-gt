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
 * @file List Page component, explains how do the list component works
 * @module pages/list/list-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/lists/list-item_component',
    'web-components/markdown/markdown_component',
    'web-components/menus/menu_component',
    'web-components/images/avatar/avatar_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/icons/icon_component',
    'text!web-components/lists/readme.md',
    'text!pages/list/list-page_template.html'
], function(
    Vue,
    IconButton,
    ListItem,
    Markdown,
    Menu,
    Avatar,
    Checkbox,
    Icon,
    Readme,
    Template
) {

    var ListPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                expandListItem : false,
                markdownSource : {
                    documentation : Readme
                },
                avatarSource : {
                    svgPath : '/site/img/doctor-male.svg'
                },
                hasDescription : true
            };
        },
        methods : {
            toggle : function() {
                this.expandListItem = !this.expandListItem;
            },
            track : function() {
                console.log('event'); // jshint ignore:line
            }
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-checkbox' : Checkbox,
            'wc-icon' : Icon,
            'wc-icon-button' : IconButton,
            'wc-list-item' : ListItem,
            'wc-markdown' : Markdown,
            'wc-menu' : Menu
        }
    });

    return ListPage;
});
