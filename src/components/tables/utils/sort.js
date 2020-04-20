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
 * @file TableUtil - Table generic sort methods
 * @module web-components/utils/table/sort
 */
define([
],
function(
) {
    var SORT_TYPES = {
        ASC : 'asc',
        DESC : 'desc'
    };

    var TableUtil = {
        /**
         * Sort the rows of the table
         * @param  {Array} column   Array that contains the cells data that will be sorted
         * @param  {String} key      Name of the cell property to be compared and ordered
         * @param  {String} sortType Asc or desc
         * @return {Array}
         */
        sort : function(column, key, sortType) {
            return column.sort(function(cell, nextCell) {
                if (cell[key] && nextCell[key]) {
                    if (cell[key] < nextCell[key]) {
                        if (sortType === SORT_TYPES.ASC) {
                            return -1;
                        } else if (sortType === SORT_TYPES.DESC) {
                            return 1;
                        }
                    }
                    if (cell[key] > nextCell[key]) {
                        if (sortType === SORT_TYPES.ASC) {
                            return 1;
                        } else if (sortType === SORT_TYPES.DESC) {
                            return -1;
                        }
                    }
                    return 0;
                } else {
                    return -1;
                }
            });
        },
        /**
         * Sort the rows of the table using a custom sort function
         * @param  {Array} column     Array that contains the cells data that will be sorted
         * @param  {Function} customSort Sort function that will be applied to the column param
         * @return {Array}
         */
        customSort : function(column, customSort) {
            return column.sort(customSort());
        },
        /**
         * Extract the column of the table that matches with the selected column index
         * @param  {Array} column
         * @param  {Number} columnIndex
         * @return {Array}
         */
        getColumnForSort : function(column, columnIndex) {
            var sortColumn = [],
                currentCell,
                currentRow,
                rowIndex,
                cellIndex;

            for (rowIndex in column) {
                currentRow = column[rowIndex];
                for (cellIndex in currentRow) {
                    currentCell = currentRow[cellIndex];
                    if (cellIndex == columnIndex) {
                        currentCell.rowIndex = rowIndex;
                        sortColumn.push(currentCell);
                    }
                }
            }

            return sortColumn;
        },
        /**
         * Match the sorted column indexes with the original rows and change their order
         * @param  {Array} rows
         * @param  {Array} sortedColumn
         * @return {Array}
         */
        matchSortedRows : function(rows, sortedColumn) {
            var sortedRows = [],
                sortedColumnIndex;

            for (sortedColumnIndex in sortedColumn) {
                var sortedCell = sortedColumn[sortedColumnIndex],
                    sortedCellOriginalIndex = sortedCell.rowIndex;

                sortedRows.push(rows[sortedCellOriginalIndex]);
            }

            return sortedRows;
        }
    };

    return TableUtil;
});
