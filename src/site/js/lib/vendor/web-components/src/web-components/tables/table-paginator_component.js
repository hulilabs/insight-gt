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
 * @file TablePaginatorComponent
 * @description table paginator component
 * @module web-components/tables/table-paginator_component
 * @extends Vue
 * @fires module:PaginationMixin#SET_ITEMS_PER_PAGE
 * @fires module:PaginationMixin#SET_PAGE
 * @fires module:PaginationMixin#SET_TOTAL_ITEMS
 * @fires module:TablePaginatorComponent#ON_ROWS_PER_PAGE_CHANGED
 * @fires module:TablePaginatorComponent#SET_PAGE
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/dropdowns/dropdown_component',
    'web-components/mixins/pagination/pagination_behavior',
    'text!web-components/tables/table-paginator_template.html',
    'css-loader!web-components/tables/table-paginator_styles.css'
], function(
    Vue,
    IconButton,
    Dropdown,
    PaginationBehavior,
    Template
) {
    /**
     * List of TablePaginator component events
     * @type {Object}
     */
    var EVENT = {
        ON_ROWS_PER_PAGE_CHANGED : 'table-paginator-rows-selector-changed',
        SET_PAGE : 'table-paginator-set-page'
    };

    /**
     * Generates the options range for the rows per page dropdown
     * @return {Array}
     * @private
     */
    function generateRowsSelectorRange(rowsSelectorMax) {
        var rowsSelectorRange = [],
            rowsSelector = 1;

        while (rowsSelector <= rowsSelectorMax) {
            rowsSelectorRange.push({
                text : rowsSelector.toString(),
                value : rowsSelector
            });
            rowsSelector++;
        }

        return rowsSelectorRange;
    }

    var TablePaginatorComponent = Vue.extend({
        name : 'TablePaginatorComponent',
        mixins : [PaginationBehavior.mixin],
        template : Template,
        props : {
            /**
             * Label of the pagination range
             * Example: 1-4 {{currentRowsLabel}} 100 -> 1-4 de 100
             */
            currentRowsLabel : {
                type : String,
                default : null
            },
            /**
             * Selected page of the paginator
             */
            page : {
                type : Number,
                default : PaginationBehavior.DEFAULT.PAGE,
                validator : function(value) {
                    return value > 0;
                }
            },
            /**
             * Set the current number of rows visible in the table
             * @warn there is currently no way to avoid rowSelector > rowsSelectorMax
             */
            rowsSelector : {
                type : Number,
                default : PaginationBehavior.DEFAULT.ITEMS_PER_PAGE,
                validator : function(value) {
                    return value > 0;
                }
            },
            /**
             * Label for the pagination in the rows per page section
             */
            rowsSelectorLabel : {
                type : String,
                default : null
            },
            /**
             * Define the max amount of rows to show per page
             * This will render a range of dropdown options
             */
            rowsSelectorMax : {
                type : Number,
                default : 10,
                validator : function(value) {
                    return value > 0;
                }
            },
            /**
             * Defines the total number of rows that can show the table
             */
            totalRows : {
                type : Number,
                default : PaginationBehavior.DEFAULT.TOTAL_ITEMS,
                validator : function(value) {
                    return value >= 0;
                }
            }
        },
        data : function() {
            return {
                model : {
                    rowsSelector : PaginationBehavior.DEFAULT.ITEMS_PER_PAGE
                },
                // Range of rows bound to dropdown
                rowsSelectorRange : []
            };
        },
        mounted : function() {
            this.$on(this.paginationMixin.EVENT.SET_PAGE, this._triggerSetPageEvent);

            this.$on(this.paginationMixin.EVENT.SET_ITEMS_PER_PAGE, function(rowsSelector) {
                this.$emit(EVENT.ON_ROWS_PER_PAGE_CHANGED, rowsSelector);
            });
        },
        methods : {
            /**
             * Returns the selected page
             * @return {Number}
             */
            getPage : function() {
                return this.$_paginationMixin_getPage();
            },
            /**
             * Calculate the max amount of pages
             * @return {Number}
             */
            getPageLimit : function() {
                return this.paginationMixin_pagesLimit;
            },
            /**
             * Returns the rows per page dropdown value
             * @return {Number}
             */
            getRowsSelector : function() {
                return this.$_paginationMixin_getItemsPerPage();
            },
            /**
             * Returns the total rows of the paginator
             * @return {Number}
             */
            getTotalRows : function() {
                return this.$_paginationMixin_getTotalItems();
            },
            /**
             * Checks if the page is in a valid range [1 - page_limit]
             * @param  {Number}  page - prospect page number
             * @return {boolean}
             */
            isValidPage : function(page) {
                return this.$_paginationMixin_isValidPage(page);
            },
            /**
             * Sets the selected page
             *
             * @param  {Number}  page          - requested page to change
             * @param  {boolean} shouldTrigger - fire page changed event, default: true
             *
             * @return {Number}                - result destination page number to set
             *
             * @fires module:TablePaginator#SET_PAGE
             */
            setPage : function(page, shouldTrigger) {
                this.$_paginationMixin_setPage(page, shouldTrigger);
            },
            /**
             * Trigger an internal event for parent changes handling
             * @param {Number} page - prospect page number
             * @fires module:TablePaginatorComponent#SET_PAGE
             * @private
             */
            _triggerSetPageEvent : function(page) {
                /**
                 * @typedef {OnPageChangedPayload}
                 *
                 * Provide enough data for parent component decision making over the selected page
                 *
                 * @property {Number}  currentPage     - current page
                 * @property {Number}  pageIntent      - requested page change
                 * @property {boolean} pageIntentCheck - inner validation check of the requested page
                 * @property {Number}  pageLimit       - max number of pages
                 * @property {Number}  rowsOffset      - initial position of the data set to be rendered
                 * @property {Number}  rowsPerPage     - limit of rows that are going to be shown
                 */
                this.$emit(EVENT.SET_PAGE, {
                    currentPage : this.$_paginationMixin_getPage(),
                    pageIntent : page,
                    pageIntentCheck : this.$_paginationMixin_isValidPage(page),
                    pageLimit : this.paginationMixin_pagesLimit,
                    rowsOffset : this.paginationMixin_currentPageItemsLowerLimit,
                    rowsPerPage : this.$_paginationMixin_getItemsPerPage()
                });
            }
        },
        watch : {
            /**
             * Synchronize rows selector changes from the model to the pagination mixin
             * @param  {Number} rowsSelector
             */
            'model.rowsSelector' : function(rowsSelector) {
                this.$_paginationMixin_setItemsPerPage(rowsSelector);
            },
            /**
             * Synchronize page changes from the parent to the pagination mixin
             * @param {Number} page
             * @param {Number} oldPage
             * @fires module:TablePaginatorComponent#SET_PAGE
             */
            page : {
                handler : function(page, oldPage) {
                    /**
                     * @warning the total items and per page count must be updated
                     * BEFORE page setter to make sure the page is inside the valid limit.
                     * This is a way to control props binding vs. watchers order execution
                     */
                    this.$_paginationMixin_setItemsPerPage(this.rowsSelector, false);
                    this.$_paginationMixin_setTotalItems(this.totalRows, false);
                    this.$_paginationMixin_setPage(page, !!oldPage);
                },
                immediate : true
            },
            /**
             * Synchronize rows selector changes from the parent to the pagination mixin
             *
             * Reset the selected page when:
             * - The rows per page dropdown is changed
             * - The rows are changed programatically
             *
             * The parent component must be in charge of resetting the page
             *
             * @param {Number} rowsSelector
             * @param {Number} oldRowsSelector
             *
             * @fires module:TablePaginatorComponent#ON_ROWS_PER_PAGE_CHANGED
             */
            rowsSelector : {
                handler : function(rowsSelector, oldRowsSelector) {
                    this.model.rowsSelector = rowsSelector;
                    this.$_paginationMixin_setItemsPerPage(rowsSelector, !!oldRowsSelector);
                },
                immediate : true
            },
            /**
             * Render the range of selectable rows per page dropdown
             * @param {Number} max
             */
            rowsSelectorMax : {
                handler : function(max) {
                    this.rowsSelectorRange = generateRowsSelectorRange(max);
                },
                immediate : true
            },
            /**
             * Synchronize total rows changes from the parent to the pagination mixin
             * @param {Number} totalRows
             * @param {Number} oldTotalRows
             */
            totalRows : {
                handler : function(totalRows, oldTotalRows) {
                    this.$_paginationMixin_setTotalItems(totalRows, !!oldTotalRows);
                },
                immediate : true
            }
        },
        components : {
            'wc-dropdown' : Dropdown,
            'wc-icon-button' : IconButton
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    TablePaginatorComponent.EVENT = EVENT;

    return TablePaginatorComponent;
});
