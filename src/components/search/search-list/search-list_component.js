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
 * @file Search list component
 * @fires module: SearchList#VALUE_CHANGED
 * @fires module: SearchList#LOAD_MORE
 * @fires module: SearchList#INPUT_CHANGED
 * @module web-components/search/search-list/search-selector_component
 * @see {@link https://web-components.hulilabs.xyz/components/search} for demos and documentation
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/icons/icon_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/lists/list-item_component',
    'web-components/tooltips/tooltip_component',
    'web-components/utils/search',
    'text!web-components/search/search-list/search-list_template.html',
    'css-loader!web-components/search/search-list/search-list_styles.css',
    'css-loader!web-components/dividers/divider_styles.css'
],
function(
    Vue,
    AvatarComponent,
    IconComponent,
    TextFieldComponent,
    ListItemComponent,
    TooltipComponent,
    SearchUtils,
    Template
) {

    /**
     * Duration of the timeout after the user stopped typing
     * for performing the search request
     * @type {number}
     */
    var TYPING_TIMEOUT_DURATION = 300;

    /**
     * Events that the component can fire.
     * @type {Object}
     */
    var EVENT = {
        VALUE_CHANGED : 'search-list-value-changed',
        LOAD_MORE : 'load-more',
        INPUT_CHANGED : 'input-changed'
    };

    var ICON_CHECK_CLASS = 'icon-check';

    var SearchList = Vue.extend({
        template : Template,
        props : {

            /**
             * Whether we should enable external search
             */
            search : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             * Label to show when there are no results to show
             */
            notFoundLabel : {
                type : String,
                required : true,
                default : 'not found'
            },

            /**
             * Placeholder displayed in the search input
             * @type {String}
             */
            placeholder : {
                type : String,
                default : null
            },

            /**
             * Whether we are loading results
             * @type {String}
             */
            loading : {
                type : Boolean,
                default : false
            },

            /**
             * Placeholder displayed in the loading state
             * @type {String}
             */
            loadingLabel : {
                type : String,
                default : null
            },

            /**
             * True if the search state should be shown
             * @type {String}
             */
            searching : {
                type : Boolean,
                default : false
            },

            /**
             * Label to show on search state
             * @type {String}
             */
            searchingLabel : {
                type : String,
                default : null
            },

            /**
             * The objects in this array should have this format, e.g.:
             * {
             *      text : String
             *      value : Number
             *      icon : String - icon name
             *      disabled : Boolean
             *      avatar : String - img path
             * }
             */
            dataSource : {
                type : Array,
                required : true,
                default : function() {
                    return [];
                }
            },

            /**
             * Sets the selected value for the current search selector
             */
            value : {
                type : [String, Number],
                default : null
            }
        },

        data : function() {
            return {
                state : {
                    focused : false,
                    value : this.value,
                    text : '',
                    avatar : '',
                    options : this.dataSource,
                    isTyping : false,
                    typingTimeout : null
                }
            };
        },

        mounted : function() {
            this._updateInput();
        },

        watch : {
            dataSource : function() {
                this._updateInput();

                if (!this.search) {
                    this._onInputHandler();
                }
            },

            /**
             * Watch for the searching value. If it changes then
             * we need to update the isTyping value so that the
             * searching states in untoggled.
             * @param {boolean} newValue
             */
            searching : function(newValue) {
                this.state.isTyping = newValue;
            }
        },

        computed : {
            /**
             * Options that will be rendered in the list
             * @return {Array}
             */
            options : function() {
                return this.search ? this.dataSource : this.state.options;
            }
        },

        methods : {

            /**
             * Updates the input when there is a selected value
             */
            _updateInput : function() {
                // Sets the selected value in the state
                this.state.options.forEach(function(option) {
                    if (option.value == this.state.value && !option.disabled) {
                        this.state.text = option.text;
                        this.state.value = option.value;
                        this.state.avatar = option.avatar;
                    }
                }.bind(this));
            },

            /**
             * Gets whether the item should show an icon
             * @param {Number} value
             * @param {String} icon
             * @return {Boolean}
             */
            _showItemIcon : function(value, icon) {
                return value == this.state.value || icon;
            },

            /**
             * Gets the appropiate icon for each element of the list
             * @param {Number} value
             * @param {String} icon
             * @return {String}
             */
            _getItemIcon : function(value, disabled, icon) {
                return value == this.state.value && !disabled ? ICON_CHECK_CLASS : icon;
            },

            /**
             * Handles when the user starts typing in the input field.
             * @fires module: SearchList#INPUT_CHANGED
             */
            _onInputHandler : function() {
                if (this.search) {
                    clearTimeout(this.state.typingTimeout);
                    this.state.isTyping = true;
                    this.state.typingTimeout = setTimeout(this.$emit.bind(this, EVENT.INPUT_CHANGED, this.state.text), TYPING_TIMEOUT_DURATION);
                } else {
                    this.state.options = SearchUtils.filter(this.dataSource, this.state.text);
                }
            },

            /**
             * Handles when the user selects and element of the list
             * @fires module: SearchList#VALUE_CHANGED
             * @param {Object}  option
             * @param {String}  option.text
             * @param {Number}  option.value
             * @param {String}  option.icon
             * @param {Boolean} option.disabled
             * @param {String}  option.avatar
             *
             */
            _onItemSelected : function(option) {
                if (!option.disabled) {
                    this.state.text = option.text;
                    this.state.value = option.value;
                    this.state.avatar = option.avatar;

                    this.$emit(EVENT.VALUE_CHANGED, {
                        option : option
                    });
                }
            },

            /**
             * Handles the focus of the input component
             */
            _onInputFocus : function() {
                this.state.focused = true;
            },

            /**
             * Handles the blur of the input component
             */
            _onInputBlur : function() {
                this.state.focused = false;
            },
            /**
             * Clears the input text and the value
             * @fires module: SearchList#INPUT_CHANGED
             */
            _clear : function() {
                this.state.value = null;
                this.state.text = null;
                this.state.avatar = null;

                this.$emit(EVENT.INPUT_CHANGED, this.state.text);
            },

            /**
             * This is bound to the content scroll event
             * @param event
             * @private
             */
            _onScroll : function(event) {
                if (this.search) {
                    window.requestAnimationFrame(this._handleScroll.bind(this, event));
                }
            },

            /**
             * Handles the scroll event in the content element
             * Checks if should load more documents for the listing
             * @fires module: SearchList#LOAD_MORE
             * @param event
             * @private
             */
            _handleScroll : function(event) {
                var element = event && event.target ? event.target : null;
                //lazy loading
                if (element &&
                    ((element.offsetHeight + element.scrollTop + 40) >= element.scrollHeight)) {
                    this.$emit(EVENT.LOAD_MORE);
                }
            }
        },

        components : {
            'wc-avatar' : AvatarComponent,
            'wc-icon' : IconComponent,
            'wc-text-field' : TextFieldComponent,
            'wc-list-item' : ListItemComponent,
            'wc-tooltip' : TooltipComponent
        }
    });

    return SearchList;
});
