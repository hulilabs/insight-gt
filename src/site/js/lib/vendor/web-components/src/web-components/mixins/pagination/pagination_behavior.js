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
 * @file PaginationBehavior
 * @description behavior for sharing basic pagination logic
 * @module web-components/mixins/pagination/pagination_behavior
 */
define([], function() {
    /**
     * Pagination setup
     * @type {Object}
     */
    var DEFAULT = {
        ITEMS_PER_PAGE : 5,
        PAGE : 1,
        TOTAL_ITEMS : 0
    };

    /**
     * List of pagination mixin events
     * @type {Object}
     */
    var MIXIN_EVENT = {
        SET_ITEMS_PER_PAGE : 'pagination-mixin-set-items-per-page',
        SET_PAGE : 'pagination-mixin-set-page',
        SET_TOTAL_ITEMS : 'pagination-mixin-set-total-items',
    };

    /**
     * Mixin to ease behavior composition
     *
     * @fires module:PaginationMixin#SET_ITEMS_PER_PAGE
     * @fires module:PaginationMixin#SET_PAGE
     * @fires module:PaginationMixin#SET_TOTAL_ITEMS
     */
    var PaginationMixin = {
        data : function() {
            return {
                /**
                 * Pagination mixin data
                 * - Creates a scope as naming convetion
                 * - Ease mixin maintenance on custom implementations
                 */
                paginationMixin : {
                    /**
                     * Expose pagination events
                     * - Re-emit custom component events
                     * - Handle data changes without attaching watchers
                     */
                    EVENT : MIXIN_EVENT,
                    /**
                     * Default pagination values
                     */
                    DEFAULT : DEFAULT,
                    /**
                     * State
                     * - Variables are mainly to control the valid state (limit scenarios)
                     * - It is recommended to access them through getters instead of direct binding
                     */
                    state : {
                        itemsPerPage : DEFAULT.ITEMS_PER_PAGE,
                        page : DEFAULT.PAGE,
                        totalItems : DEFAULT.TOTAL_ITEMS
                    }
                }
            };
        },
        computed : {
            /**
             * Gets the current items label higher limit
             * @return {number}
             */
            paginationMixin_currentPageItemsHigherLimit : function() {
                var limit = this.paginationMixin.state.page * this.paginationMixin.state.itemsPerPage;
                return limit > this.paginationMixin.state.totalItems ? this.paginationMixin.state.totalItems : limit;
            },
            /**
             * Gets the current items label lower limit
             * @return {number}
             */
            paginationMixin_currentPageItemsLowerLimit : function() {
                return ((this.paginationMixin.state.page - 1) * this.paginationMixin.state.itemsPerPage + 1);
            },
            /**
             * Detects if the go to previous page (back button) should be disabled
             * @return {boolean}
             */
            paginationMixin_isBackDisabled : function() {
                return this.paginationMixin.state.page <= DEFAULT.PAGE;
            },
            /**
             * Detects if the go to next page button should be disabled
             * @return {boolean}
             */
            paginationMixin_isNextDisabled : function() {
                return (this.paginationMixin.state.page >= this.paginationMixin_pagesLimit);
            },
            /**
             * Calculate the max amount of pages
             * @return {number}
             */
            paginationMixin_pagesLimit : function() {
                return Math.ceil(this.paginationMixin.state.totalItems / this.paginationMixin.state.itemsPerPage);
            }
        },
        methods : {
            /**
             * Returns the items per page dropdown value
             * @return {number}
             */
            $_paginationMixin_getItemsPerPage : function() {
                return parseInt(this.paginationMixin.state.itemsPerPage);
            },
            /**
             * Returns the selected page
             * @return {number}
             */
            $_paginationMixin_getPage : function() {
                return parseInt(this.paginationMixin.state.page);
            },
            /**
             * Returns the total items of the paginator
             * @return {number}
             */
            $_paginationMixin_getTotalItems : function() {
                return parseInt(this.paginationMixin.state.totalItems);
            },
            /**
             * Checks if the page is in a valid range [1 - page_limit]
             * @param  {number}  page - prospect page number
             * @return {boolean}
             */
            $_paginationMixin_isValidPage : function(page) {
                return page > 0 && page <= this.paginationMixin_pagesLimit;
            },
            /**
             * Click handler for the next page icon button
             * @param {boolean?} triggerEvent
             */
            $_paginationMixin_onNextPageClickHandler : function(triggerEvent) {
                this.$_paginationMixin_setPage(this.$_paginationMixin_getPage() + 1, triggerEvent);
            },
            /**
             * Click handler for the previous page icon button
             * @param {boolean?} triggerEvent
             */
            $_paginationMixin_onPreviousPageClickHandler : function(triggerEvent) {
                this.$_paginationMixin_setPage(this.$_paginationMixin_getPage() - 1, triggerEvent);
            },
            /**
             * Sets the items per page
             * @param {number}   itemsPerPage
             * @param {boolean?} triggerEvent
             * @fires module:PaginationBehavior#SET_ITEMS_PER_PAGE
             */
            $_paginationMixin_setItemsPerPage : function(itemsPerPage, triggerEvent) {
                itemsPerPage = parseInt(itemsPerPage);
                var previousItemsPerPage = this.paginationMixin.state.itemsPerPage;
                if (previousItemsPerPage !== itemsPerPage) {
                    this.paginationMixin.state.itemsPerPage = itemsPerPage;
                    // Notify state changes
                    if (triggerEvent !== false) {
                        this.$emit(MIXIN_EVENT.SET_ITEMS_PER_PAGE, itemsPerPage, previousItemsPerPage);
                    }
                }
            },
            /**
             * Sets the selected page
             * @param {number}   page - requested page to change
             * @param {boolean?} triggerEvent
             * @fires module:PaginationBehavior#SET_PAGE
             */
            $_paginationMixin_setPage : function(page, triggerEvent) {
                page = parseInt(page);
                var previousPage = this.paginationMixin.state.page;
                if (this.$_paginationMixin_isValidPage(page) && previousPage !== page) {
                    this.paginationMixin.state.page = page;
                    // Notify state changes
                    if (triggerEvent !== false) {
                        this.$emit(MIXIN_EVENT.SET_PAGE, page, previousPage);
                    }
                }
            },
            /**
             * Sets the total items
             * @param {number}   totalItems
             * @param {boolean?} triggerEvent
             * @fires module:PaginationBehavior#SET_TOTAL_ITEMS
             */
            $_paginationMixin_setTotalItems : function(totalItems, triggerEvent) {
                totalItems = parseInt(totalItems);
                var previousTotalItems = this.paginationMixin.state.totalItems;
                if (previousTotalItems !== totalItems) {
                    this.paginationMixin.state.totalItems = totalItems;
                    // Notify state changes
                    if (triggerEvent !== false) {
                        this.$emit(MIXIN_EVENT.SET_TOTAL_ITEMS, totalItems, previousTotalItems);
                    }
                }
            }
        }
    };

    var PaginationBehavior = {
        // Default pagination values
        DEFAULT : DEFAULT,
        // Mixin to ease behavior composition
        mixin : PaginationMixin
    };

    return PaginationBehavior;
});
