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
 * @file Autocomplete component
 * @module web-components/autocompletes/autocomplete_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/autocomplete} for demos and documentation
 * @fires module:Autocomplete#ON_ADD
 * @fires module:Autocomplete#ON_CLEAR
 * @fires module:Autocomplete#ON_FOCUS
 * @fires module:Autocomplete#ON_INPUT
 * @fires module:Autocomplete#ON_BLUR
 * @fires module:Autocomplete#ON_OVERFLOWS_VIEWPORT
 * @fires module:Autocomplete#ON_SEARCH
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/icons/icon_component',
    'web-components/lists/list-item_component',
    'web-components/menus/menu_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/loaders/circular/circular-loader_component',
    'web-components/utils/keyboard',
    'web-components/utils/random',
    'web-components/utils/search',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/input/input-container_behavior',
    'text!web-components/autocompletes/autocomplete_template.html',
    'css-loader!web-components/autocompletes/autocomplete_styles.css'
],
function(
    Vue,
    Avatar,
    Icon,
    ListItem,
    Menu,
    TextField,
    CircularLoader,
    // Utils
    KeyboardUtil,
    RandomUtil,
    SearchUtil,
    // Behaviors
    FloatingLayerBehavior,
    InputContainerBehavior,
    // Template
    Template
) {
    /* @see web-components/mixins/input/input-container_behavior
     * Properties set via InputContainerBehavior:
     *     - label : {?String}
     *     - floatingLabel : {Boolean}
     *     - placeholder : {?String}
     *     - hasError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - charCounter  : {Boolean}
     *     - modifier : {?String}
     *     - actionDisabled : {Boolean}
     */

    var MENU_MAX_HEIGHT = 296;
    var MENU_ITEM_HEIGHT = 40;
    var MENU_PADDINGS = 16;
    var MENU_MAX_ITEMS = 7;
    var INPUT_WITH_LABEL_HEIGHT = 72;
    var INPUT_HEIGHT = 52;

    var MENU_CLASS = 'js-menu';

    /**
     * List of autocomplete component events
     * @type {Object}
     */
    var EVENT = {
        ON_ADD : 'autocomplete-add',
        ON_CLEAR : 'autocomplete-clear',
        ON_ENTER : 'autocomplete-enter',
        ON_FOCUS : 'autocomplete-focus',
        ON_BLUR : 'autocomplete-blur',
        ON_INPUT : 'autocomplete-input',
        ON_MENU_OPENED : 'autocomplete-menu-opened',
        ON_MENU_CLOSED : 'autocomplete-menu-closed',
        ON_OVERFLOWS_VIEWPORT : 'autocomplete-overflows-viewport',
        ON_SEARCH : 'autocomplete-search',
        ON_LOAD_MORE : 'autocomplete-load-more'
    };

    var Autocomplete = Vue.extend({
        name : 'AutocompleteComponent',
        template : Template,
        mixins : [InputContainerBehavior],
        props : {

            /**
             * Whether we are loading more results for the autocomplete
             * @type {boolean}
             */
            isLoadingMore : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             * Label placed in a new option before the text input typed by the user
             * Used when the option is not found and the allowAddingItems prop is true
             */
            addItemLabel : {
                type : String,
                default : null
            },
            /**
             * Sets the autocomplete to add new values from the input
             * Default to false so the autocomplete can't add items
             */
            allowAddingItems : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the limit of the buffer to trigger an event or filter the options in the dataSource
             * Default value to make a request -> 2
             */
            bufferLimitForRequest : {
                type : Number,
                default : 2,
                validator : function(value) {
                    return value >= 0;
                }
            },
            /**
             * Data set that the component will filter with the input text
             * option format example: {
             *     text : 'example',
             *     value : 1
             * }
             */
            dataSource : {
                type : Array,
                required : true
            },
            /**
             * Sets the input's disabled status.
             * Default to false so the input is always enabled.
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Flag set to know if the component will have a mobile behavior
             */
            isMobile : {
                type : Boolean,
                default : false
            },
            /**
             * Constraint of the maximum length of the input's value.
             */
            maxLength : {
                type : Number,
                default : null
            },
            /**
             * Constraint of the minimum length of the input's value.
             */
            minLength : {
                type : Number,
                default : null
            },
            /**
             * Label placed in a new option before the text input typed by the user
             * Used when the options is not found and the allowAddingItems prop is false
             */
            notFoundLabel : {
                type : String,
                required : true
            },
            /**
             * Sets the input as a required field.
             * No input is required by default.
             * If active, a special character (*) is added for distinguish this field.
             */
            required : {
                type : Boolean,
                default : false
            },
            /**
             * Enable external search, disable the component to filter the dataSource
             */
            search : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Flag set to the menu child component to take the width of the input
             * By default, the autocomplete loads the options with the longest text
             */
            fullWidth : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the buffer text
             */
            text : {
                type : String,
                default : null
            },
            /**
             * Value of the autocomplete
             */
            value : {
                type : [String, Number],
                default : null
            },
            /**
             * Whether the field highlighter should be shown.
             */
            showSelectedOption : {
                type : Boolean,
                default : false
            },
            /**
             * Whether or not the autocomplete should hide the avatar when an option is selected
             */
            hideSelectedAvatar : {
                type : Boolean,
                default : false
            },
            /**
             * Whether or not the autocomplete options(list item) should display multiline
             */
            multiline : {
                type : Boolean,
                default : false
            }
        },

        data : function() {
            return {
                state : {
                    buffer : this.text,
                    dataSource : this.dataSource,
                    id : RandomUtil.getPseudoId(),
                    isFiltering : false,
                    isInputFocused : false,
                    isMenuOpened : false,
                    // this flag is used to prevent the autocomplete form closing
                    // when we're using the scrollbar, so we will set it to true
                    // when a mousedown is detected inside of the autocomplete's menu
                    // and to false when the mouse click is released and it's no longer
                    // in the autocomplete
                    isMenuTargeted : false,
                    isResultEmpty : this.bufferLimitForRequest === 0 ? false : true,
                    value : this.value,
                    lastSelectedValue : this.value
                }
            };
        },

        mounted : function() {
            if (!this.search && this.value) {
                this.checkSelectedOption();
            }
        },

        updated : function() {
            if (!this.disabled && !this.isMobile) {
                var buffer = this.getInputText();

                /**
                 * If the menu is opened
                 * and the buffer is defined
                 * and is not filled with spaces
                 * and its length is greater that the bufferLimitForRequest prop
                 * Checks if the menu is out of the screen
                 */
                if (this.isMenuOpened && buffer && buffer.trim().length >= this.bufferLimitForRequest) {
                    this._checkMenuOutOfScreen();
                }
            }
        },
        computed : {
            /**
             * Filter the options set in the dataSource
             * If the search flag prop is set on true, the filter is not applied
             * @return {Array}
             */
            filterOptions : function() {
                var buffer = this.getInputText() ? this.getInputText().trim() : null,
                    dataSource = this.state.dataSource;

                if (buffer && buffer.length >= this.bufferLimitForRequest) {
                    if (!this.search) {
                        this.state.isFiltering = true;

                        var options = SearchUtil.filter(dataSource, buffer);

                        this.state.isFiltering = false;

                        if (options.length === 0) {
                            this.state.isResultEmpty = true;
                            return [];
                        } else {
                            this.state.isResultEmpty = false;
                            return options;
                        }

                    } else {
                        if (dataSource.length === 0) {
                            this.state.isResultEmpty = true;
                            return [];
                        } else {
                            this.state.isResultEmpty = false;
                            return dataSource;
                        }
                    }
                } else {
                    this._generateDefaultMatches();
                    return dataSource;
                }
            },

            isFocused : function() {
                return this.state.isInputFocused;
            },

            isMenuOpened : function() {
                return this.state.isMenuOpened;
            },

            classObject : function() {
                return {
                    'wc-Autocomplete--secondary-style' : this.showSecondaryStyle,
                    'is-active' : this.isMenuOpened
                };
            }
        },
        methods : {

            /**
             * Obtains the value of the component
             * @return {String|Number}
             */
            getValue : function() {
                return this.state.value;
            },
            /**
             * Sets the value of the component
             * @param {String|Number} value
             */
            setValue : function(value) {
                this.state.value = value;

                if (value) {
                    this.state.lastSelectedValue = value;
                }
            },
            /**
             * Obtains the text of the input component
             * @return {String}
             */
            getInputText : function() {
                return this.state.buffer;
            },
            /**
             * Sets the text of the input component
             * @param {String} text
             */
            setInputText : function(text) {
                this.state.buffer = text;
            },
            /**
             * Sets the avatar of the autocomplete component
             * @param {String} imgPath
             */
            setAvatar : function(imgPath) {
                this.state.avatar = imgPath;
            },
            /**
             * Open the menu child
             */
            openMenu : function() {
                if (!this.isMenuOpened) {
                    window.addEventListener('keydown', this._preventWindowUpDownKeys);

                    this.state.isMenuOpened = true;
                    this.$emit(EVENT.ON_MENU_OPENED);
                }
            },
            /**
             * Close the menu child
             */
            closeMenu : function() {
                if (!this.disabled && this.isMenuOpened) {
                    window.removeEventListener('keydown', this._preventWindowUpDownKeys);

                    this.state.isMenuOpened = false;

                    // If there's no selected option and the menu is closed,
                    // clear the input's text so there isn't "dirty" info left in the autocomplete.
                    if (!this.state.value) {
                        this.setInputText(null);
                        this.setAvatar(null);
                    }

                    this.$emit(EVENT.ON_MENU_CLOSED);
                }
            },
            /**
             * Clears the input text and the value
             * @param {boolean} shouldTriggerState
             * @fires module: Autocomplete#ON_CLEAR
             */
            clear : function(shouldTriggerState) {
                this.setInputText(null);
                this.setValue(null);
                this.setAvatar(null);

                if (shouldTriggerState !== false) {
                    this.$emit(EVENT.ON_CLEAR);
                }
            },
            /**
             * Focus the text field component
             * @param {boolean} shouldTriggerState
             */
            focus : function(shouldTriggerState) {
                this._setFocusState(true);

                this.$refs.input.focus(shouldTriggerState);
            },

            /**
             * When a click is received in the root container, ensures
             * the menu is closed that the input is focused
             */
            onAutocompleteClick : function() {
                this.closeMenu();
                this.focus();
            },

            /**
             * Sets the state isInputFocused
             * @param {Boolean} state
             * @fires module:Autocomplete#ON_FOCUS
             */
            _setFocusState : function(state) {
                this.state.isInputFocused = state;

                if (this.isFocused) {
                    this.$emit(EVENT.ON_FOCUS, this.isFocused);
                } else {
                    this.$emit(EVENT.ON_BLUR);
                }
            },
            /**
             * Prevents the window to execute default actions for the up and down keys
             * @param  {Event} event
             * @fires module:Autocomplete#ON_ENTER
             */
            _preventWindowUpDownKeys : function(event) {
                if (event.keyCode === KeyboardUtil.CODE.UP || event.keyCode === KeyboardUtil.CODE.DOWN) {
                    event.stopPropagation();
                    event.preventDefault();
                } else if (event.keyCode === KeyboardUtil.CODE.ENTER) {
                    this.$emit(EVENT.ON_ENTER, this.getInputText());
                }
            },
            /**
             * Sets the text, value and avatar sent when an user clicks or press enter on a selected option
             * @param {Object} selectedOption
             * @param {string} selectedOption.text
             * @param {number} selectedOption.value
             * @param {string} selectedOption.avatar
             * @param {boolean} selectedOption.disabled
             * @fires module:Autocomplete#ON_INPUT
             */
            _setSelectedOption : function(selectedOption) {
                if (!selectedOption.disabled && selectedOption.value) {
                    this.setInputText(selectedOption.text);
                    this.setValue(selectedOption.value);
                    this.setAvatar(selectedOption.avatar);

                    /**
                     * @typedef {onInputPayload}
                     * @property {Object}       option selected option,
                     *                          contains at least the text and value properties
                     * @property {VueComponent} component component reference
                     */
                    var payload = {
                        option : this._getSelectedOption(),
                        component : this
                    };

                    this.$emit(EVENT.ON_INPUT, payload);
                    if (this.bufferLimitForRequest > 0) {
                        this.closeMenu();
                    }
                }
            },
            /**
             * Triggers the add event with the input text
             * @param {String} text
             * @fires module:Autocomplete#ON_ADD
             */
            _addNewItem : function(text) {
                this.$emit(EVENT.ON_ADD, text);
                this.closeMenu();
            },
            /**
             * Stops the click event to propagate to the overlay in the menu component
             * @param  {Event} event
             */
            _onInputClick : function(event) {
                if (this.isFocused) {
                    event.stopPropagation();
                }
            },
            /**
             * Makes the setup for all the options if the input text is empty and the bufferLimitForRequest is 0
             */
            _generateDefaultMatches : function() {
                var value = this.getValue();

                this.state.dataSource.map(function(option) {
                    if (value === option.value) {
                        option.match = '<strong>' + option.text + '</strong>';
                    } else {
                        option.match = option.text;
                    }
                });
            },
            /**
             * Handler for the input event of the text field component
             * Triggers the search event if the search props is set true
             * @param  {String} inputValue
             * @fires module:Autocomplete#ON_SEARCH
             */
            _onInputHandler : function(inputValue) {
                this.setAvatar(null);
                if (!inputValue && this.bufferLimitForRequest > 0) {
                    this.closeMenu();
                    // Case: clear action using the keyboard.
                    // This case happens  when the user deletes the value of textfield using the delete key
                    // but there is a value in the state of the autocomplete, so it must be clear out
                    if (!inputValue && this.getValue()) {
                        this.clear(true);
                    }
                } else if (this.bufferLimitForRequest === 0) {
                    if (!inputValue && this.getValue()) {
                        // set value not used because there is no need to trigger the input event
                        this.state.value = null;
                    }

                    this._generateDefaultMatches();
                    this.openMenu();
                } else if (this.getInputText().trim().length >= this.bufferLimitForRequest) {
                    if (this.search) {
                        this.state.isFiltering = true;
                        this.$emit(EVENT.ON_SEARCH, inputValue);
                    }

                    this.openMenu();
                } else {
                    this.closeMenu();
                }
            },
            /**
             * Handler for the focus event of the text field component
             * Sets the state isInputFocused to true
             * @fires module:Autocomplete#ON_OVERFLOWS_VIEWPORT
             */
            _onInputFocus : function() {
                this._setFocusState(true);

                // Sometimes, we may want to programatically focus the input
                // so we check that it isn't already open to prevent unwanted side effects
                if (!this.state.isMenuOpened) {
                    this._onInputHandler(this.getInputText());
                }

                if (this.isMobile) {
                    this.$emit(EVENT.ON_OVERFLOWS_VIEWPORT, this.$el);
                }
            },

            /**
             * Handler for the blur event of the text field component
             * Sets the state isInputFocused to false
             * @param {string} text input text, it is not used but to mantain the order of the sent parameters is added as one
             * @param {Event} event blur event captured by the text field component
             */
            _onInputBlur : function(text, event) {
                // Check if the blur event was triggered by clicking outside of the component or not
                if (event.relatedTarget && this.$el.contains(event.relatedTarget)) {
                    if (this.bufferLimitForRequest > 0) {
                        if (this.isMenuOpened && !this.isFocused) {
                            this.closeMenu();
                        }
                        this._setFocusState(false);
                    } else {
                        this.openMenu();
                    }
                } else if (this.state.isMenuTargeted) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    this._setFocusState(false);
                    this.closeMenu();
                }
            },

            /**
             * Executed on scroll of the menu.
             * @fires module:Autocomplete#ON_LOAD_MORE
             * @param {Object} scrollData
             * @param {number} scrollData.offsetHeight
             * @param {number} scrollData.scrollTop
             * @param {number} scrollData.scrollHeight
             */
            _onScroll : function(scrollData) {
                if ((scrollData.offsetHeight + scrollData.scrollTop + 40) >= scrollData.scrollHeight) {
                    this.$emit(EVENT.ON_LOAD_MORE);
                }
            },

            /**
             * Handles the menu mousedown event
             * This is to know if the menu scrollbar is clicked
             * @param  {MouseEvent} event
             */
            _handleMenuMousedown : function(event) {
                if (event.target &&
                    this.$el.contains(event.target) &&
                    event.target.classList.contains(MENU_CLASS)) {
                    this.state.isMenuTargeted = true;
                }
            },

            /**
             * Handles the menu mouseup event
             * This is to keep the flow of the menu scrollbar
             */
            _handleMenuMouseup : function() {
                if (this.state.isMenuTargeted) {
                    this.state.isMenuTargeted = false;
                    this.$refs.input.focus();
                }
            },

            /**
             * Checks if the menu can be displayed in the screen,
             * If it doesn't fits, the autocomplete fires the scroll event
             * @fires module:Autocomplete#ON_OVERFLOWS_VIEWPORT
             */
            _checkMenuOutOfScreen : function() {
                if (!FloatingLayerBehavior.fitsInsideViewportAxis(
                    this._getInputHeight(),
                    this._getMenuHeight(),
                    this.$refs.input.$el.getBoundingClientRect().top,
                    window.innerHeight
                )) {
                    this.$emit(EVENT.ON_OVERFLOWS_VIEWPORT, this.$el);
                }
            },
            /**
             * Obtains the menu height, using the options quantity
             * @return {Number}
             */
            _getMenuHeight : function() {
                return (this.filterOptions.length < MENU_MAX_ITEMS) ?
                    (this.filterOptions.length * MENU_ITEM_HEIGHT) + MENU_PADDINGS :
                    MENU_MAX_HEIGHT;
            },
            /**
             * Obtains the input height based on the given props
             * @return {Number}
             */
            _getInputHeight : function() {
                return this.label ? INPUT_WITH_LABEL_HEIGHT : INPUT_HEIGHT;
            },
            /**
             * Checks for the option sent in the dataSource prop and set option text as the input text
             */
            checkSelectedOption : function() {
                var dataSource = this.state.dataSource;

                for (var optionIndex in dataSource) {
                    if (dataSource[optionIndex].value == this.state.value) {
                        this.setInputText(dataSource[optionIndex].text);
                        this.setAvatar(dataSource[optionIndex].avatar);
                    }
                }
            },
            /**
             * Returns the selected option of the dataSource
             * @return {Object} selected option
             */
            _getSelectedOption : function() {
                var dataSource = this.state.dataSource;

                for (var optionIndex in dataSource) {
                    if (dataSource[optionIndex].value == this.state.value) {
                        return dataSource[optionIndex];
                    }
                }

                return {};
            },
            /**
             * True if we should show the icon in the list item of the menu
             */
            _showItemIcon : function(value, icon) {
                return (this.showSelectedOption && value == this.state.lastSelectedValue) || icon;
            },

            /**
             * Gets the icon that should be shown in the list item
             */
            _getItemIcon : function(value, icon) {
                return (this.showSelectedOption && value == this.state.lastSelectedValue) ? 'icon-check' : icon;
            }
        },

        watch : {
            /**
             * Updates the state.text value with the new text prop value
             * @param {String} newValue
             */
            text : function(newValue) {
                this.state.buffer = newValue;
            },
            /**
             * Updates the state.value with the value prop
             * @param {String, Number} newValue
             */
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    this.state.value = newValue;

                    if (!this.search) {
                        this.checkSelectedOption();
                    }
                }
            },
            /**
             * Updates the state.dataSource with a copy of the dataSource prop new value
             * @param {Array} newDataSource
             */
            dataSource : function(newDataSource) {
                // Make a copy of the new dataSource to modify the state dataSource and not the prop
                this.state.dataSource = newDataSource.slice(0);
                this.state.isFiltering = false;
            }
        },

        destroyed : function() {
            // make sure the keydown listener is unbinded on destroy
            window.removeEventListener('keydown', this._preventWindowUpDownKeys);
        },

        components : {
            'wc-circular-loader' : CircularLoader,
            'wc-icon' : Icon,
            'wc-list-item' : ListItem,
            'wc-menu' : Menu,
            'wc-text-field' : TextField,
            'wc-avatar' : Avatar
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Autocomplete.EVENT = EVENT;

    return Autocomplete;
});
