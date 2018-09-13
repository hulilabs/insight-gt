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
 * @file TableRow component
 * @requires vue
 * @requires web-components/tables/table-cell_component
 * @requires web-components/utils/click
 * @requires web-components/utils/keyboard
 * @requires web-components/tables/table-row_template.html
 * @requires web-components/tables/table-row_styles.css
 * @module web-components/tables/table-row_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/table} for demos and documentation
 * @fires module:TableRowComponent#ON_CLICK
 * @fires module:TableRowComponent#ON_CONTEXT_MENU
 * @fires module:TableRowComponent#ON_DOUBLE_CLICK
 */
define([
    'vue',
    'web-components/tables/table-cell_component',
    'web-components/utils/click',
    'web-components/utils/keyboard',
    'text!web-components/tables/table-row_template.html',
    'css-loader!web-components/tables/table-row_styles.css'
],
function(
    Vue,
    // Components
    TableCell,
    // Utils
    ClickUtil,
    KeyboardUtil,
    // Template
    Template
) {
    /**
     * List of TableRow component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLICK : 'table-row-click',
        ON_CONTEXT_MENU : 'table-row-context-menu',
        ON_DOUBLE_CLICK : 'table-row-double-click'
    };

    var TableRow = Vue.extend({
        name : 'TableRowComponent',
        template : Template,
        props : {
            /**
             * Sets the disabled state for the row
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the header behavior for a specific row
             */
            header : {
                type : Boolean,
                default : false
            },
            /**
             * Disables :hover and :active feedback, and tabindex attribute when true
             */
            noFocus : {
                type : Boolean,
                default : false
            },
            /**
             * Index of the row within a table
             */
            index : {
                type : Number,
                default : null
            },
            /**
             * Sets the selected styles on a row
             */
            selected : {
                type : Boolean,
                default : false
            },
            /**
             * Allows the row to grow vertically (removes the `max-height` property)
             */
            multiline : {
                type : Boolean,
                default : false
            },
            /**
             * Allows to display the hidden content from the `expandableContent` named slot
             */
            expanded : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            /**
             * Returns a set of custom classes applied to the row according
             * to a series of values that determine the component's state
             * @return {Object}
             */
            classObject : function() {
                return {
                    'is-focusable' : !this.header && !this.noFocus,
                    'is-header' : this.header,
                    'is-selected' : this.selected,
                    'is-multiline' : this.multiline
                };
            }
        },
        data : function() {
            return {
                state : {
                    // set to null when corresponding, so vue does not add the attribute
                    hasTabIndex : this.header || this.disabled || this.noFocus ? null : 0,
                    index : this.index
                }
            };
        },
        mounted : function() {
            if (!this.disabled && !this.header) {
                this._addListeners();
            }
        },
        methods : {
            /**
             * Add the listeners for the row component
             */
            _addListeners : function() {
                this.$el.addEventListener('contextmenu', this._onContextMenuHandler);
                this.$el.addEventListener('keyup', this._onKeyupHandler);
                ClickUtil.attachClickListeners(
                    this.$el,
                    this._onClickHandler,
                    this._onDoubleClickHandler
                );
            },
            /**
             * Handler for the click event
             * @param {Event} event
             * @fires module:TableRow#ON_CLICK
             */
            _onClickHandler : function(event) {
                this.$emit(EVENT.ON_CLICK, this._generatePayload(event));
            },
            /**
             * Handler for the context menu (right click) event
             * @param  {Event} event
             * @fires module:TableRow#ON_CONTEXT_MENU
             */
            _onContextMenuHandler : function(event) {
                this.$emit(EVENT.ON_CONTEXT_MENU, this._generatePayload(event));
            },
            /**
             * Handler for the double click event
             * @param {Event} event
             * @fires module:TableRow#ON_DOUBLE_CLICK
             */
            _onDoubleClickHandler : function(event) {
                this.$emit(EVENT.ON_DOUBLE_CLICK, this._generatePayload(event));
            },
            /**
             * Returns a generic payload for all the event handlers in the component
             * @param  {Event} event corresponding event sent from a handler function
             * @return {Object}
             */
            _generatePayload : function(event) {
                /**
                 * @typedef {OnEnterPayload, OnDoubleClickPayload, OnClickPayload, OnContextMenuPayload}
                 * @property {Event} event corresponding event sent to a handler function
                 * @property {Number} index row index
                 */
                return {
                    event : event,
                    index : this.getIndex()
                };
            },
            /**
             * Returns the current row index
             * @return {Number}
             */
            getIndex : function() {
                return this.state.index;
            },
            /**
             * Sets the row index
             * @param {Number} index
             */
            setIndex : function(index) {
                this.state.index = index;
            }
        },
        components : {
            'wc-table-cell' : TableCell
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    TableRow.EVENT = EVENT;

    return TableRow;
});
