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
 * @file PaginationPage
 * @description Pagination mixin documentation page
 * @module pages/behaviors/pagination/pagination-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/mixins/pagination/pagination_behavior',
    'web-components/selection-controls/checkbox/checkbox_component',
    'text!web-components/mixins/pagination/readme.md',
    'text!pages/behaviors/pagination/pagination-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    IconButton,
    TextField,
    Markdown,
    PaginationBehavior,
    Checkbox,
    PaginationBehaviorReadme,
    PageTemplate
) {
    var PaginationPage = Vue.extend({
        template : PageTemplate,
        mixins : [PaginationBehavior.mixin],
        data : function() {
            return {
                notifyEvents : false,
                markdownSource : {
                    documentation : PaginationBehaviorReadme
                },
                model : {
                    itemsPerPage : PaginationBehavior.DEFAULT.ITEMS_PER_PAGE,
                    page : PaginationBehavior.DEFAULT.PAGE,
                    totalItems : PaginationBehavior.DEFAULT.TOTAL_ITEMS
                }
            };
        },
        mounted : function() {
            this.$on(this.paginationMixin.EVENT.SET_ITEMS_PER_PAGE, function(itemsPerPage) {
                this.model.itemsPerPage = itemsPerPage;
                if (this.notifyEvents) {
                    alert('Current items per page is ' + itemsPerPage);  // jshint ignore:line
                }
            });

            this.$on(this.paginationMixin.EVENT.SET_PAGE, function(page) {
                this.model.page = page;
                if (this.notifyEvents) {
                    alert('Current page is ' + page);  // jshint ignore:line
                }
            });

            this.$on(this.paginationMixin.EVENT.SET_TOTAL_ITEMS, function(totalItems) {
                this.model.totalItems = totalItems;
                if (this.notifyEvents) {
                    alert('Current total items is ' + totalItems);  // jshint ignore:line
                }
            });
        },
        watch : {
            'model.itemsPerPage' : function(itemsPerPage) {
                this.$_paginationMixin_setItemsPerPage(itemsPerPage);
            },
            'model.page' : function(page) {
                this.$_paginationMixin_setPage(page);
            },
            'model.totalItems' : function(totalItems) {
                this.$_paginationMixin_setTotalItems(totalItems);
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-icon-button' : IconButton,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField
        }
    });

    return PaginationPage;
});
