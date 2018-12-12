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
 * @file Table component
 * @requires vue
 * @requires web-components/tables/table-row_component
 * @requires web-components/tables/table-paginator_component
 * @requires web-components/tables/table_template.html
 * @requires web-components/tables/table_styles.css
 * @module web-components/tables/table_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/table} for demos and documentation
 */
define([
    'vue',
    'web-components/tables/table-row_component',
    'web-components/tables/table-paginator_component',
    'text!web-components/tables/table_template.html',
    'css-loader!web-components/tables/table_styles.css'
],
function(
    Vue,
    // Components
    TableRow,
    TablePaginator,
    // Template
    Template
) {

    var Table = Vue.extend({
        name : 'TableComponent',
        template : Template,
        props : {
            /**
             * Define a custom class for the body (data rows group)
             */
            bodyClass : {
                type : [Array, Object, String],
                default : null
            },
            /**
             * Table title, it's placed in the table header
             */
            title : {
                type : String,
                default : null
            },
            /**
             * Make the body (data rows group) scrollable and header row fixed
             */
            scrollable : {
                type : Boolean,
                default : false
            }
        }
    });

    return Table;
});
