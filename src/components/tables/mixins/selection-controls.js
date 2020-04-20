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
 * @file SelectionControlsMixin defines methods to use the selection controls for a table component
 *       used when the user clicks a row and it will keep the state of selected
 * @module web-components/table/mixins/selection-controls
 */
define(function() {

    var SelectionControlsMixin = {
        data : function() {
            return {
                state : {
                    selectedRow : null
                }
            };
        },
        methods : {
            /**
             * Handler for the click event of the row component
             * @param  {Object} payload
             */
            _onRowClick : function(payload) {
                this.setSelectedRow(payload.index);
            },
            /**
             * Handler for the keyup enter event of the row component
             * @param  {Object} payload
             */
            _onRowEnter : function(payload) {
                this.setSelectedRow(payload.index);
            },
            /**
             * Sets the selected row in the table
             * @param {Number} rowIndex
             */
            setSelectedRow : function(rowIndex) {
                this.state.selectedRow = rowIndex;
            }
        }
    };

    return SelectionControlsMixin;
});
