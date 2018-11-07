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
 * @file Search Dropdown component
 * @module web-components/search/search-dropdown/search-dropdown_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/search} for demos and documentation
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/images/thumbnail/thumbnail_component',
    'web-components/loaders/circular/circular-loader_component',
    'web-components/lists/list-item_component',
    'web-components/menus/menu_component',
    'web-components/search/search-box/search-box_component',
    'web-components/utils/keyboard',
    'web-components/utils/random',
    'text!web-components/search/search-dropdown/search-dropdown_template.html',
    'css-loader!web-components/search/search-dropdown/search-dropdown_styles.css'
],
function(
    Vue,
    Avatar,
    Thumbnail,
    CircularLoader,
    ListItem,
    Menu,
    SearchBox,
    KeyboardUtil,
    RandomUtil,
    Template
) {

    /**
     * List of search events.
     * @type {Object}
     */
    var EVENT = {
        ON_CLEAR : 'searchdropdown-clear',
        ON_SEARCH : 'searchdropdown-search',
        ON_SELECT : 'searchdropdown-select'
    };

    /**
     * Height for each of the child items in the menu
     * @type {Number}
     */
    var CHILD_HEIGHT = 72;

    /**
     * Padding used in the container that has the child items.
     * @type {Number}
     */
    var CHILD_PADDING = 16;

    var SearchDropdown = Vue.extend({
        template : Template,
        props : {
            /**
             * Used to display results in the dropdown
             * @type {Array}
             */
            dataSource : {
                type : Array,
                required : true,
                default : []
            },
            /**
             * Label displayed when there are no results.
             * @type {String}
             */
            notFoundLabel : {
                type : String,
                required : true
            },
            /**
             * Placeholder displayed in the search input
             * @type {String}
             */
            placeholder : {
                type : String,
                required : true
            },
            /**
             * Number of rows to display in the menu
             * @type {Number}
             */
            rows : {
                type : Number,
                default : 4,
                validator : function(value) {
                    return value > 0;
                }
            },

            /**
             * Text to be loaded in case that is needed
             * @type {string}
             */
            text : {
                type : String,
                default : null
            },

            /**
             * Set this prop true to use thumbnails insted of avatars
             * @type {boolean}
             */
            useThumbnail : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    dataSource : null,
                    id : RandomUtil.getPseudoId(),
                    isFiltering : false,
                    isMenuActive : false,
                    isResultEmpty : true
                }
            };
        },
        computed : {
            getMenuStyle : function() {
                return {
                    height : this.rows * CHILD_HEIGHT + CHILD_PADDING + 'px'
                };
            }
        },
        methods : {
            /**
             * Handles when the search input is closed.
             */
            _onInputClosed : function() {
                this._closeMenu();
            },

            /**
             * Changes the state of the component depending on the input provided.
             * @param  {String} value
             * @fires  module:SearchDropdown#ON_CLEAR
             * @fires  module:SearchDropdown#ON_SEARCH
             */
            _onInputHandler : function(value) {
                if (value) {
                    this.state.isFiltering = true;
                    this.$emit(EVENT.ON_SEARCH, value);
                    this._openMenu();
                } else {
                    this.$emit(EVENT.ON_CLEAR);
                    this._closeMenu();
                }
            },

            /**
             * Updates the state related to the menu when it is closed.
             */
            _onMenuClose : function() {
                this.state.isMenuActive = false;
            },

            /**
             * Updates the state related to the menu when it is open.
             */
            _onMenuOpen : function() {
                this.state.isMenuActive = true;
            },

            /**
             * Open the menu child
             */
            _openMenu : function() {
                window.addEventListener('keydown', this._preventWindowUpDownKeys);
                this.$refs.menu.open();
            },

            /**
             * Close the menu child
             */
            _closeMenu : function() {
                window.removeEventListener('keydown', this._preventWindowUpDownKeys);
                this.$refs.menu.close();
            },

            /**
             * Handles when an item in the menu is selected, returns the value
             * in an event.
             * @param  {mixed} value
             * @param  {String} text
             * @fires  module:SearchDropdown#ON_SELECT
             */
            _selectItem : function(value, text) {
                this.$emit(EVENT.ON_SELECT, value, text);
            },

            /**
             * Prevents the window to execute default actions for the up and down keys
             * @param  {Event} event
             */
            _preventWindowUpDownKeys : function(event) {
                if (event.keyCode === KeyboardUtil.CODE.UP || event.keyCode === KeyboardUtil.CODE.DOWN) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
        },
        watch : {
            dataSource : function(value) {
                // Make a copy of the new dataSource to modify the state dataSource
                // and not the prop
                this.state.isFiltering = false;
                this.state.isResultEmpty = !value || value.length === 0;
                this.state.dataSource = value.slice(0);
            }
        },
        destroyed : function() {
            // make sure the keydown listener is unbinded on destroy
            window.removeEventListener('keydown', this._preventWindowUpDownKeys);
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-thumbnail' : Thumbnail,
            'wc-circular-loader' : CircularLoader,
            'wc-list-item' : ListItem,
            'wc-menu' : Menu,
            'wc-search-box' : SearchBox
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    SearchDropdown.EVENT = EVENT;

    return SearchDropdown;
});
