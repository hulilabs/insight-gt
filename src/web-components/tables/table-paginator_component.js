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
 * @file TablePaginator component
 * @requires vue
 * @requires web-components/dropdowns/dropdown_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/paginators/table-paginator_template.html
 * @requires web-components/paginators/table-paginator_styles.css
 * @module web-components/tables/table-paginator_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/paginators} for demos and documentation
 * @fires module:TablePaginator#ON_ROWS_PER_PAGE_CHANGED
 * @fires module:TablePaginator#SET_PAGE
 */
define([
    'vue',
    'web-components/dropdowns/dropdown_component',
    'web-components/buttons/icon/icon-button_component',
    'text!web-components/tables/table-paginator_template.html',
    'css-loader!web-components/tables/table-paginator_styles.css'
],
function(
    Vue,
    // Components
    Dropdown,
    IconButton,
    // Template
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
     * Pagination setup
     */
    var INITIAL_PAGE = 1;

    /**
     * Generates the options range for the rows per page dropdown
     * @return {Array}
     * @private
     */
    function _generateRowsSelectorRange(rowsSelectorMax) {
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

    var TablePaginator = Vue.extend({
        name : 'TablePaginatorComponent',
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
                default : INITIAL_PAGE,
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
                default : 5,
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
                required : true,
                validator : function(value) {
                    return value >= 0;
                }
            }
        },
        data : function() {
            return {
                // Range of rows bound to dropdown
                rowsSelectorRange : _generateRowsSelectorRange(this.rowsSelectorMax),
                /**
                 * State
                 * - Clones some props for inner model binding
                 * - Variables are requiered to control limit scenarios
                 */
                state : {
                    rowsSelector : this.rowsSelector
                }
            };
        },
        computed : {
            /**
             * Gets the current rows label lower limit
             * @return {Number}
             */
            getLowerCurrentRowsLimit : function() {
                return (this.page - 1) * this.state.rowsSelector + 1;
            },
            /**
             * Gets the current rows label higher limit
             * @return {Number}
             */
            getHigherCurrentRowsLimit : function() {
                var limit = this.page * this.state.rowsSelector;
                return limit > this.totalRows ? this.totalRows : limit;
            },
            /**
             * Detects if the go to previous page (back button) should be disabled
             * @return {Boolean}
             */
            isBackDisabled : function() {
                return this.page <= INITIAL_PAGE;
            },
            /**
             * Detects if the go to next page button should be disabled
             * @return {Boolean}
             */
            isNextDisabled : function() {
                return this.page >= this.getPageLimit();
            }
        },
        methods : {
            /**
             * Returns the selected page
             * @return {Number}
             */
            getPage : function() {
                return this.page;
            },
            /**
             * Calculate the max amount of pages
             * @return {Number}
             */
            getPageLimit : function() {
                return Math.ceil(this.totalRows / this.state.rowsSelector);
            },
            /**
             * Returns the rows per page dropdown value
             * @return {Number}
             */
            getRowsSelector : function() {
                return this.state.rowsSelector;
            },
            /**
             * Returns the total rows of the paginator
             * @return {Number}
             */
            getTotalRows : function() {
                return this.totalRows;
            },
            /**
             * Checks if the page is in a valid range [1 - page_limit]
             * @param  {Number}  page - prospect page number
             * @return {boolean}
             */
            isValidPage : function(page) {
                return page > 0 && page <= this.getPageLimit();
            },
            /**
             * Click handler for the previous page icon button
             * @fires module:TablePaginator#SET_PAGE
             * @private
             */
            _onPreviousPageClickHandler : function() {
                this.setPage(this.getPage() - 1);
            },
            /**
             * Click handler for the next page icon button
             * @fires module:TablePaginator#SET_PAGE
             * @private
             */
            _onNextPageClickHandler : function() {
                this.setPage(this.getPage() + 1);
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
                // This event is important to keep parent and local states synchronize
                // @warn the parent may try to exceed page limit
                if (shouldTrigger !== false) {
                    this._triggerSetPageEvent(page);
                }
            },
            /**
             * Trigger an internal event for parent changes handling
             * @param  {Number} page - prospect page number
             * @fires module:TablePaginator#SET_PAGE
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
                    currentPage : this.getPage(),
                    pageIntent : page,
                    pageIntentCheck : this.isValidPage(page),
                    pageLimit : this.getPageLimit(),
                    rowsOffset : this.getLowerCurrentRowsLimit,
                    rowsPerPage : this.state.rowsSelector
                });
            }
        },
        watch : {
            /**
             * Notify when a page is set outside the valid range [1 - page_limit]
             * @param  {Number} page - prospect page number
             * @fires module:TablePaginator#SET_PAGE
             */
            page : function(page) {
                if (!this.isValidPage(page)) {
                    // return to origin page
                    this.setPage(INITIAL_PAGE);
                }
            },
            /**
             * Synchronize local selected amount of rows per page
             * This will trigger the state.rowsSelector watcher too
             * @param  {Number} rows
             */
            rowsSelector : function(rows) {
                this.state.rowsSelector = rows;
            },
            /**
             * Render again the range of selectable rows per page dropdown
             * @param  {Number} max
             */
            rowsSelectorMax : function(max) {
                this.rowsSelectorRange = _generateRowsSelectorRange(max);
            },
            /**
             * Reset the selected page when:
             * - The rows per page dropdown is changed
             * - The rows are changed programatically
             *
             * The parent component must be in charge of resetting the page
             *
             * @fires module:TablePaginator#ON_ROWS_PER_PAGE_CHANGED
             */
            'state.rowsSelector' : function(rowsSelector) {
                this.$emit(EVENT.ON_ROWS_PER_PAGE_CHANGED, rowsSelector);
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
    TablePaginator.EVENT = EVENT;

    return TablePaginator;
});
