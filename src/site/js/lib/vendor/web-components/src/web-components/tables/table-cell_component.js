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
 * @file TableCell component
 * @requires vue
 * @requires web-components/tables/table-cell_template.html
 * @requires web-components/tables/table-cell_styles.css
 * @module web-components/tables/table-cell_component
 * @extends Vue
 * @fires module:TableCell#ON_CLICK
 * @see {@link https://web-components.hulilabs.xyz/components/table} for demos and documentation
 */
define([
    'vue',
    'text!web-components/tables/table-cell_template.html',
    'css-loader!web-components/tables/table-cell_styles.css'
],
function(
    Vue,
    Template
) {
    /**
     * List of TableCell component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLICK : 'table-cell-click'
    };

    var TableCell = Vue.extend({
        name : 'TableCellComponent',
        template : Template,
        props : {
            /**
             * Give the action behavior to the cell
             */
            action : {
                type : Boolean,
                default : false
            },
            /**
             * Give the clickable behavior to the cell
             */
            clickable : {
                type : Boolean,
                default : false
            },
            /**
             * Compacts cell width
             */
            compact : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the cell styles to disabled
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Give the header behavior to the cell
             */
            header : {
                type : Boolean,
                default : false
            },
            /**
             * Index of the cell within a table
             */
            index : {
                type : Number,
                default : null
            },
            /**
             * Remove bottom border (borderless)
             */
            noBorder : {
                type : Boolean,
                default : false
            },
            /**
             * Truncate table cell content on overflow (ellipsis)
             */
            truncate : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    index : this.index
                }
            };
        },
        mounted : function() {
            if (this.clickable && !this.disabled) {
                this._addClickListener();
            }
        },
        methods : {
            /**
             * Add click listener to the cell
             */
            _addClickListener : function() {
                this.$el.addEventListener('click', this._clickHandler);
            },
            /**
             * Handler for the click event
             * @fires module:TableCell#ON_CLICK
             */
            _clickHandler : function() {
                if (this.clickable) {
                    /**
                     * @typedef {onClickPayload}
                     * @property {Array} content content inside the default slot
                     * @property {Number} index cell index
                     * @property {Number} rowIndex parent index
                     */
                    var payload = {
                        content : this.$slots.default,
                        index : this.getIndex(),
                        rowIndex : this.$parent.getIndex()
                    };

                    this.$emit(EVENT.ON_CLICK, payload);
                }
            },
            /**
             * Returns the index of the cell inside of the row
             * @return {Number}
             */
            getIndex : function() {
                return this.state.index;
            }
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    TableCell.EVENT = EVENT;

    return TableCell;
});
