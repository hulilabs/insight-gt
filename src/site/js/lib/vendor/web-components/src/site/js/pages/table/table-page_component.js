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
 * @file Table documentation page
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/icons/icon_component
 * @requires web-components/tables/mixins/selection-controls
 * @requires web-components/tables/mixins/sort
 * @requires web-components/tables/table-cell_component
 * @requires web-components/tables/table-paginator_component
 * @requires web-components/tables/table-row_component
 * @requires web-components/tables/table_component
 * @requires web-components/dialogs/dialog/dialog_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/tables/readme.md
 * @requires pages/table/table-page_template.html
 * @requires site/css/components/pages/table-page.css
 * @module pages/table/table-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/icons/icon_component',
    'web-components/tables/mixins/selection-controls',
    'web-components/tables/mixins/sort',
    'web-components/tables/table-cell_component',
    'web-components/tables/table-paginator_component',
    'web-components/tables/table-row_component',
    'web-components/tables/table_component',
    'web-components/dialogs/dialog/dialog_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'text!web-components/tables/readme.md',
    'text!pages/table/table-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css',
    'css-loader!site/css/components/pages/table-page.css'
], function(
    Vue,
    FlatButton,
    IconButton,
    Icon,
    TableSelectionControlsMixin,
    TableSortMixin,
    TableCell,
    TablePaginator,
    TableRow,
    Table,
    Dialog,
    TextField,
    Markdown,
    Checkbox,
    TableReadme,
    Template
) {

    var TablePage = Vue.extend({
        template : Template,
        mixins : [TableSelectionControlsMixin, TableSortMixin],
        data : function() {
            return {
                activeRows : {},
                sortColumnIndex : null,
                scrollable : false,
                state : {
                    dialogStyles : {
                        dialog : {
                            'padding-bottom' : '24px'
                        }
                    },
                    headers : [
                        {
                            class : 'SampleTable__date',
                            clickable : true,
                            text : 'Fecha',
                            sortIcon : 'icon-arrow-up'
                        },
                        {
                            class : 'SampleTable__age',
                            text : 'Edad (años, meses)'
                        },
                        {
                            alignRight : true,
                            class : 'SampleTable__height',
                            clickable : true,
                            sortIcon : 'icon-arrow-up',
                            text : 'Altura (cm)',
                            tooltip : 'Altura de la persona'
                        },
                        {
                            alignRight : true,
                            class : 'SampleTable__weight',
                            text : 'Peso (kg)',
                            compact : true
                        }
                    ],
                    rows : [
                        [
                            {
                                text : '30 de enero, 2017 (tooltip)',
                                clickable : true,
                                tooltip : 'Cumpleaños'
                            },
                            {
                                text : '2 años, 4 meses'
                            },
                            {
                                alignRight : true,
                                text : 90.4,
                            },
                            {
                                text : 12.9,
                                alignRight : true,
                                compact : true
                            }
                        ],
                        [
                            {
                                text : '30 de enero, 2018',
                                clickable : true,
                            },
                            {
                                text : '3 años, 4 meses'
                            },
                            {
                                alignRight : true,
                                text : 98.6,
                            },
                            {
                                text : 15.0,
                                alignRight : true,
                                compact : true
                            },
                        ],
                        [
                            {
                                text : 'treinta de enero del dos mil diez y nueve',
                                clickable : true
                            },
                            {
                                text : 'cuatro años y cuatro meses'
                            },
                            {
                                alignRight : true,
                                text : '6,353 km a 6,384 km',
                                tooltip : 'Radio de la tierra'
                            },
                            {
                                text : 17.0,
                                alignRight : true,
                                compact : true
                            },
                        ],
                        [
                            {
                                text : '30 de enero, 2019',
                                clickable : true,
                            },
                            {
                                text : '4 años, 4 meses (sin borde)',
                                noBorder : true
                            },
                            {
                                alignRight : true,
                                text : 105.6,
                                tooltip : '1.56 mts'
                            },
                            {
                                text : 17.0,
                                alignRight : true,
                                compact : true
                            },
                        ],
                        [
                            {
                                text : '30 de enero, 2020',
                                clickable : true,
                            },
                            {
                                text : '5 años, 4 meses'
                            },
                            {
                                alignRight : true,
                                text : 110.0,
                            },
                            {
                                text : 18.3,
                                alignRight : true,
                                compact : true
                            },
                        ],
                    ],
                    limit : 2,
                    limitMax : 4,
                    page : 1,
                    selectedDate : null,
                    selectedRow : null,
                    selectedColumn : null,
                    title : 'Datos antropométricos',
                    totalRows : 4,
                    pagination : true
                },
                markdownSource : {
                    documentation : TableReadme
                }
            };
        },
        mounted : function() {
            this.state.totalRows = this.state.rows.length;
            // Add class to html element
            document.documentElement.classList.add('is-tablePage');
        },
        methods : {
            /**
             * Handler for the add data to the table feature
             */
            addRowHandler : function() {
                alert('Good job! You have triggered the add data feature'); // jshint ignore:line
            },
            /**
             * Assigns the data of the input dialog to the selectedDate state
             * @param  {Object} cell
             */
            assignData : function(cell) {
                // in this case is used for the data with column index 0
                if (cell.index === 0) {
                    this.state.selectedDate = cell.content[0].elm.textContent;
                }
            },
            /**
             * Handler for the button in the dialog
             * Used to confirm the changes made in the input
             */
            dateModifierHandler : function() {
                var dateModifierValue = this.$refs.dateModifier.getValue();
                var cell = this.state.rows[this.state.selectedRow][this.state.selectedColumn];

                cell.text = dateModifierValue;

                this.$refs.dialog.close();
            },
            /**
             * Handler for the click event triggered by an editable cell
             * @param  {Object} cell
             */
            editableCellHandler : function(cell) {
                this.state.selectedRow = cell.rowIndex;
                this.state.selectedColumn = cell.index;
                this.assignData(cell);
                this.$refs.dialog.open();
            },
            /**
             * Handler for the row right click (context menu) event
             * @param  {Object} payload
             */
            _onRowContextMenu : function(payload) {
                payload.event.preventDefault();
                alert('You right clicked the row ' + (payload.index + 1)); // jshint ignore:line
            },
            /**
             * Handler for the row double click event
             * @param  {Object} payload
             */
            _onRowDoubleClick : function(payload) {
                alert('You double clicked the row ' + (payload.index + 1)); // jshint ignore:line
            },
            /**
             * Handler for the click event triggered by a row action (button at the end of the row)
             */
            optionsClickHandler : function() {
                alert('Awesome! You clicked the options action button'); // jshint ignore:line
            },
            /**
             * Handler for the page changed event triggered by a page control in the pagination component inside the table
             * @param {OnPageChangedPayload} payload
             */
            _pageChangedHandler : function(payload) {
                alert('Page changed action triggered'); // jshint ignore:line
                this.state.page = payload.pageIntentCheck ? payload.pageIntent : payload.currentPage;
            },
            /**
             * Handler for the rows per page changed event triggered by the rows per page dropdwon in the pagination component
             */
            _onRowsPerPageChanged : function(rows) {
                alert('Rows per page changed'); // jshint ignore:line
                this.state.page = 1;
                this.state.limit = rows;
            },
            /**
             * Handler for the sort event when a clickable header is clicked
             * @param  {number} columnIndex
             * @param  {Object} sortConfig
             */
            sortColumnHandler : function(columnIndex, sortConfig) {
                this.sortColumnIndex = columnIndex;
                this.sortRows(sortConfig);
            },
            /**
             * Sort the rows of the table given a columnIndex and a sortType by the cell config
             * @param  {Object} config
             */
            sortRows : function(config) {
                var columnIndex = config.index,
                    header = this.state.headers[columnIndex];

                // handles the changes for the sort icon and sort type of the header
                this.handleSortConfig(columnIndex);

                this.sortTable(columnIndex, 'text', header.sortType);
            },
            /**
             * Toggles the `expanded` state of a given row
             * @param {number} index - row to be expanded
             */
            toggleRow : function(index) {
                Vue.set(this.activeRows, index, !this.activeRows[index]);
            },
            /**
             * Returns whether or not a row is active
             * @param  {number} index
             * @return {boolean}
             */
            isRowActive : function(index) {
                return this.activeRows[index];
            }
        },
        destroyed : function() {
            // Remove class from to html element
            document.documentElement.classList.remove('is-tablePage');
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-dialog' : Dialog,
            'wc-flat-button' : FlatButton,
            'wc-icon' : Icon,
            'wc-icon-button' : IconButton,
            'wc-markdown' : Markdown,
            'wc-table' : Table,
            'wc-table-cell' : TableCell,
            'wc-table-paginator' : TablePaginator,
            'wc-table-row' : TableRow,
            'wc-text-field' : TextField
        }
    });

    return TablePage;
});
