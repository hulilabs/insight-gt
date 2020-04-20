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
 * @file SortMixin defines methods to use the sort util methods for a table component
 * @requires web-components/tables/utils/sort
 * @module web-components/table/mixins/sort
 */
define([
    'web-components/tables/utils/sort'
], function(
    TableSortUtil
) {

    var SORT = {
        ICONS : {
            ASC : 'icon-arrow-up',
            DESC : 'icon-arrow-down'
        },
        TYPES : {
            ASC : 'asc',
            DESC : 'desc'
        }
    };

    var SortMixin = {
        data : function() {
            return {
                state : {
                    /**
                     * Table headers
                     * Expected schema:
                     * [
                     *     // Header1
                     *     {
                     *         headerProp1 : 'headerValue1'
                     *     }
                     * ]
                     */
                    headers : [],
                    /**
                     * Table rows
                     * Expected schema:
                     * [
                     *     // Row1
                     *     [
                     *
                     *         {
                     *             cellProp1 : 'cellValue1'
                     *         },
                     *         {
                     *             cellProp2 : 'cellValue2'
                     *         }
                     *     ]
                     * ]
                     * @type {Array}
                     */
                    rows : []
                }
            };
        },
        methods : {
            /**
             * Sort table rows
             * It extract the specific column to order by a key, given a type of sort
             * @param  {Number} columnIndex index of the column that will be the criteria to order the table
             * @param  {String} key property of the cells used to order the column
             * @param  {String} sortType asc or desc
             */
            sortTable : function(columnIndex, key, sortType) {
                var column = TableSortUtil.getColumnForSort(this.state.rows, columnIndex),
                    sortedColumn = TableSortUtil.sort(column, key, sortType);

                this.state.rows = TableSortUtil.matchSortedRows(this.state.rows, sortedColumn);
            },
            /**
             * Sort table rows with a custom sort function
             * @param  {Number} columnIndex index of the column that will be the criteria to order the table
             * @param  {Function} customSortFunction sort function that will be applied to the row cells
             * @see    {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort} for documentation
             */
            customSortTable : function(columnIndex, customSortFunction) {
                var column = TableSortUtil.getColumnForSort(this.state.rows, columnIndex),
                    sortedColumn = TableSortUtil.customSort(column, customSortFunction);

                this.state.rows = TableSortUtil.matchSortedRows(this.state.rows, sortedColumn);
            },
            /**
             * Handle the sort type and icon of a sortable header
             * @param {Object} header object that corresponds to the sortable header
             * @param {String} ascIcon icon class that represents the ascendant sort type
             * @param {String} descIcon icon class that represents the descendant sort type
             */
            handleSortConfig : function(columnIndex, ascIcon, descIcon) {
                var header = this.state.headers[columnIndex],
                    ascIcon = ascIcon ? ascIcon : SORT.ICONS.ASC,
                    descIcon = descIcon ? descIcon : SORT.ICONS.DESC;

                header.sortType = header.sortType === SORT.TYPES.ASC ? SORT.TYPES.DESC : SORT.TYPES.ASC;
                header.sortIcon = header.sortIcon === ascIcon ? descIcon : ascIcon;
            }
        }
    };

    return SortMixin;
});
