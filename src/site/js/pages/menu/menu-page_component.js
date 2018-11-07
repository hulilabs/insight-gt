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
/* global console*/
/**
 * @file List Page component, explains how do the list component works
 * @module pages/menu/menu-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/menus/menu_component',
    'web-components/lists/list-item_component',
    'web-components/buttons/raised/raised-button_component',
    'web-components/buttons/flat/flat-button_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/menus/readme.md',
    'text!pages/menu/menu-page_template.html',
    'css-loader!web-components/dividers/divider_styles.css'
], function(
    Vue,
    Menu,
    ListItem,
    RaisedButton,
    FlatButton,
    Checkbox,
    Markdown,
    Readme,
    Template
) {

    var MenuPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : Readme
                }
            };
        },
        methods : {
            say : function(t) {
                console.log(t);
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-flat-button' : FlatButton,
            'wc-list-item' : ListItem,
            'wc-markdown' : Markdown,
            'wc-menu' : Menu,
            'wc-raised-button' : RaisedButton
        }
    });

    return MenuPage;
});
