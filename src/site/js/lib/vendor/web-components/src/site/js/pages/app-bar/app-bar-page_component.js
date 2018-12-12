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
    'web-components/bars/app-bar/app-bar_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/loaders/linear/linear-loader_component',
    'web-components/markdown/markdown_component',
    'web-components/search/search-box/search-box_component',
    'web-components/search/search-dropdown/search-dropdown_component',
    'text!web-components/bars/app-bar/readme.md',
    'text!pages/app-bar/app-bar-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    AppBar,
    IconButton,
    LinearLoader,
    Markdown,
    SearchBox,
    SearchDropdown,
    AppBarReadme,
    Template
) {

    var AppBarPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : AppBarReadme
                },
                searchBox : {
                    isExpanded : false
                },
                searchDropdown : {
                    isExpanded : false
                }
            };
        },
        methods : {
            /**
             * Keep track of search box expanded state
             * @param {boolean} isExpanded
             * @private
             */
            _onSearchBoxToggle : function(isExpanded) {
                this.searchBox.isExpanded = isExpanded;
            },
            /**
             * Keep track of search dropdown expanded state
             * @param {boolean} isExpanded
             * @private
             */
            _onSearchDropdownToggle : function(isExpanded) {
                this.searchDropdown.isExpanded = isExpanded;
            }
        },
        components : {
            'wc-app-bar' : AppBar,
            'wc-icon-button' : IconButton,
            'wc-linear-loader' : LinearLoader,
            'wc-markdown' : Markdown,
            'wc-search-box' : SearchBox,
            'wc-search-dropdown' : SearchDropdown
        }
    });

    return AppBarPage;
});
