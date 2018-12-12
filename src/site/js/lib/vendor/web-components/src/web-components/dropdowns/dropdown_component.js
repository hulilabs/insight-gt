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
 * @file Dropdown component
 * @requires vue
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/icons/icon_component
 * @requires web-components/inputs/input-container/input-container_component
 * @requires web-components/mixins/input/input-container_behavior
 * @requires web-components/lists/list-item_component
 * @requires web-components/menus/menu_component
 * @requires web-components/utils/keyboard
 * @requires web-components/utils/random
 * @requires web-components/dropdowns/dropdown_template.html
 * @requires web-components/dropdowns/dropdown_styles.css
 * @module web-components/dropdowns/dropdown_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/dropdown} for demos and documentation
 */
define([
    'vue',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/icons/icon_component',
    'web-components/images/avatar/avatar_component',
    'web-components/inputs/input-container/input-container_component',
    'web-components/mixins/input/input-container_behavior',
    'web-components/lists/list-item_component',
    'web-components/menus/menu_component',
    'web-components/utils/keyboard',
    'web-components/utils/random',
    'text!web-components/dropdowns/dropdown_template.html',
    'css-loader!web-components/dropdowns/dropdown_styles.css',
    'css-loader!web-components/dividers/divider_styles.css'
],
function(
    Vue,
    FloatingLayerBehavior,
    Icon,
    Avatar,
    InputContainer,
    InputContainerBehavior,
    ListItem,
    Menu,
    KeyboardUtil,
    RandomUtil,
    Template
) {
    var PLACEHOLDER_CLASS = 'wc-Dropdown__placeholderOption';

    var LIST_ITEM_HEIGHT = 48;

    var DOUBLE_LAYOUT_LIST_ITEM_HEIGHT = 72;

    var DIVIDER_MARGINS = 17;

    var MENU_MARGIN = 10;

    var SECONDARY_STYLE_BOTTOM_MARGIN = 4;

    /**
     * List of Dropdown component events
     * @type {Object}
     */
    var EVENT = {
        ON_INPUT : 'input'
    };

    /**
     * Custom attributes bound to the select tag when the dropdown is in its native form
     * @type {Object}
     */
    var ATTRIBUTE = {
        AVATAR : 'data-avatar',
        COLOR : 'data-color'
    };

    /* @see web-components/mixins/input/input-container_behavior
     * Properties set via InputContainerBehavior:
     *     - label : {?String}
     *     - floatingLabel : {Boolean}
     *     - placeholder : {?String}
     *     - hasError : {Boolean}
     *     - nativeError : {Boolean}
     *     - errorMessage : {?String}
     *     - hintText : {?String}
     *     - charCounter  : {Boolean}
     *     - modifier : {?String}
     *     - hideInputHighlighter : {boolean}
     *     - actionDisabled : {Boolean}
     */

    var Dropdown = Vue.extend({
        name : 'DropdownComponent',
        template : Template,
        mixins : [InputContainerBehavior],
        props : {
            /**
             * Used only for native dropdown component
             * It is used as the first option in the dropdown menu
             *     and when it's set, it change its color as a placeholder
             */
            altPlaceholder : {
                type : String,
                default : null
            },
            /**
             * Flag to set the dropdown component as disabled
             */
            disabled : {
                type : Boolean,
                default : false
            },
            /**
             * Use ellipsis when input content overflows
             */
            ellipsis : {
                type : Boolean,
                default : false
            },
            /**
             * Flag to set the dropdown as a native component (used for mobile devices)
             */
            native : {
                type : Boolean,
                default : false
            },
            /**
             * @description Specifies the format of the options supported by the dropdown component
             * @typedef  {Object} DropdownOption
             * @property {string}        text        - option's text to be displayed
             * @property {string|number} value       - component's value also bound by v-model
             * @property {string}        [iconClass] - used for displaying an icon beside the option in the menu
             * @property {string}        [hint]      - an extra text to be displayed beside the option
             * @property {string}        [avatar]    - path for an image to be displayed as an avatar besie the option
             * @property {boolean}       [disabled]  - determines if the option must be disabled for selection
             */
            /**
             * Options to display in the dropdown's menu
             * @type {DropdownOption[]}
             */
            options : {
                type : Array,
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
             * Flag to set only the iconClass sent in the options as the selected text,
             * ignoring the text of the option
             */
            setIconOnly : {
                type : Boolean,
                default : false
            },
            /**
             * Used to set a previously or default value for the dropdown,
             * it has to match with the value of the given dropdown options
             */
            value : {
                type : [String, Number],
                default : null
            }
        },
        computed : {
            /**
             * Builds a style object based on whether or not a
             * custom color prop was given
             * @return {Object}
             */
            inlineCssDropdown : function() {
                var inlineCss = {};

                if (this.color || this.state.color) {
                    inlineCss.color = this.color || this.state.color;
                }

                return inlineCss;
            }
        },
        data : function() {
            return {
                state : {
                    icon : null,
                    id : RandomUtil.getPseudoId(),
                    inputText : '',
                    processedOptions : {},
                    placeholderText : this.label || this.placeholder,
                    value : this.value,
                    color : null,
                    avatar : null
                }
            };
        },
        created : function() {
            this._processOptions();
        },
        mounted : function() {
            if (!this.native && !this.disabled) {
                if (this.setIconOnly) {
                    this.state.placeholderText = null;
                }

                // we skip falsy non numeric values
                if (this.value || Number.isInteger(this.value)) {
                    this._checkSelectedOption(false);
                }

                this._watchMenuDisplay();
            } else {
                this._checkSelectedOption(false);
            }
        },
        methods : {
            /**
             * Checks if one of the options have a secondary text property
             * @return {boolean} True if it has one option with secondary text property
             */
            _checkOptionsDoubleLayout : function() {
                return this.options.some(function(option) {
                    return option.secondaryText ? true : false;
                });
            },

            /**
             * Use the floating layer hooks to move the dropdown menu to the best position
             */
            _attachFloatingLayerPositioning : function() {
                var $dropdownMenu = this.$refs.dropdownMenu;

                // Attach handler for modifing vertical position of the displayed menu
                if ($dropdownMenu.isFloatingBehaviorBound()) {
                    $dropdownMenu.getFloatingBehavior().onHook(
                        FloatingLayerBehavior.HOOK.AFTER_VERTICAL_POSITION_CALCULATED,
                        this._moveMenuToSelectedItem.bind(this)
                    );
                }
            },

            /**
             * Handler for the space key
             * It opens the dropdown menu
             */
            handleSpaceKey : function() {
                this.$refs.dropdownMenu.open();
            },
            /**
             * Maps the given options to a new key-value structure where each key will correspond
             * to the value of each given option. This allows to access directly an option's data
             * without having to search the option in the array everytime
             * @see web-components/dropdowns/dropdown_component#DropdownOption
             */
            _processOptions : function() {
                for (var option in this.options) {
                    var optionData = this.options[option];

                    this.state.processedOptions[optionData.value] = {
                        avatar : optionData.avatar,
                        color : optionData.color,
                        disabled : optionData.disabled,
                        hint : optionData.hint,
                        iconClass : optionData.iconClass,
                        text : optionData.text,
                        value : optionData.value
                    };
                }
            },
            /**
             * Checks if one of the options value sent via prop is equal to the value prop
             * @param {boolean} [shouldTriggerState] - if the component must notify the changes of its value
             */
            _checkSelectedOption : function(shouldTriggerState) {
                var selectedOption = this.state.processedOptions[this.value];
                if (selectedOption) {
                    this._selectOption(selectedOption, shouldTriggerState);
                }
            },
            /**
             * Focus the selected option in the dropdown
             * @param {Boolean} isMenuDisplayed
             */
            _setSelectedItemFocus : function(isMenuDisplayed) {
                if (isMenuDisplayed) {
                    this.$refs.dropdownMenu.$children.map(function(child) {
                        if (child instanceof ListItem && child.$el.getAttribute('role') == 'menuitem') {
                            if (child.value == this.state.value) {
                                // wait for menu._addListeners to add tabIndex="-1"
                                this.$nextTick(function() {
                                    child.$el.focus();
                                });
                            }
                        }
                    }.bind(this));
                }
            },
            /**
             * Sets the information of the given option as the component's state
             * @param {DropdownOption} option               - selected option from the dropdown's menu
             * @param {boolean}        [shouldTriggerState] - if the component must notify the changes of its value
             */
            _selectOption : function(option, shouldTriggerState) {
                if (this.setIconOnly) {
                    this.setIconClass(option.iconClass);
                } else {
                    this.setInputText(option.text);
                }

                this.setAvatar(option.avatar);
                this.setColor(option.color);
                this.setValue(option.value, shouldTriggerState);
            },
            /**
             * Modify vertical position on menu display
             * @param  {AxisResult} data
             * @return {number} modified vertical position
             */
            _moveMenuToSelectedItem : function(data) {
                if (this.showSecondaryStyle) {
                    return SECONDARY_STYLE_BOTTOM_MARGIN;
                }

                var calculatedPosition = 0,
                    selectedValueIndex = 0,
                    indexOffset = 1,
                    margin = MENU_MARGIN,
                    $dropdownMenu = this.$refs.dropdownMenu,
                    optionHeight = this._checkOptionsDoubleLayout() ? DOUBLE_LAYOUT_LIST_ITEM_HEIGHT : LIST_ITEM_HEIGHT;

                if (this.state.value) {
                    selectedValueIndex = this._getSelectedOptionIndex(this.state.value);

                    if (this.placeholder) {
                        indexOffset = 2;
                    }
                }

                if (this.placeholder) {
                    margin += DIVIDER_MARGINS;
                }

                // this is the calculated position for normal behavior where the selected options is
                // positioned under the cursor
                calculatedPosition += -1 * ((selectedValueIndex + indexOffset) * optionHeight + margin);

                if ($dropdownMenu.isFloatingBehaviorBound()) {
                    var isInViewport = FloatingLayerBehavior.fitsInsideViewportAxis(
                        calculatedPosition + data.dimensions.trigger.height,
                        data.dimensions.floating.height,
                        data.dimensions.trigger.parentViewportTop,
                        window.innerHeight
                    );

                    // If the calculated position makes the menu overflow the
                    // viewport, a new position will be provided
                    if (!isInViewport) {
                        if (data.calculatedPosition < -1 * ((this.options.length) * optionHeight + DIVIDER_MARGINS)) {
                            return -1 * ((this.options.length) * optionHeight + DIVIDER_MARGINS);
                        }

                        // in the case that the bottom viewport position exceeds the total
                        // viewport size, take the offset and add it to the position
                        var viewportPosition = data.dimensions.trigger.parentViewportTop + calculatedPosition + data.dimensions.floating.height;
                        var offset = viewportPosition - window.innerHeight;
                        if (offset > 0) {
                            return calculatedPosition - offset - margin - data.dimensions.trigger.height;
                        }

                        // use the trigger height to offset the position because the dropdown
                        // has relative positioning
                        return data.calculatedPosition - data.dimensions.trigger.height;
                    }
                }

                return calculatedPosition;
            },
            /**
             * Sets the component value
             * @param {string|number}   value
             * @param {boolean}         [shouldTriggerState] - if the component must notify the changes of its value
             */
            setValue : function(value, shouldTriggerState) {
                this.state.value = value;
                if (shouldTriggerState !== false) {
                    this.$emit(EVENT.ON_INPUT, this.state.value);
                }
            },
            /**
             * Sets the component input text
             * @param {string} text
             */
            setInputText : function(text) {
                this.state.inputText = text;
                this.state.placeholderText = text ? '-' : this.label || this.placeholder;
            },
            /**
             * Sets the component iconClass
             * @param {string} iconClass
             */
            setIconClass : function(iconClass) {
                this.state.icon = iconClass;
            },
            /**
             * Sets the component color
             * @param {string} [color]
             */
            setColor : function(color) {
                this.state.color = color;
            },
            /**
             * Sets the component's avatar
             * @param {string} avatar
             */
            setAvatar : function(avatar) {
                this.state.avatar = avatar;
            },
            /**
             * Obtains the current value of the dropdown
             * @return {string | number}
             */
            getValue : function() {
                return this.state.value;
            },
            /**
             * Obtains the current text of the dropdown input
             * @return {string}
             */
            getInputText : function() {
                return this.state.inputText;
            },
            /**
             * Handle keydown actions related to a dropdown
             * @param {Event} event
             * @private
             */
            _detectKeydown : function(event) {
                if (KeyboardUtil.inSet(event.keyCode, KeyboardUtil.SETS.ARROWS)) {
                    event.preventDefault();
                } else {
                    this._searchKeyInOptions(event);
                }
            },
            /**
             *
             * Search for the first option that matches with the key pressed by the user
             * @param  {Event} event
             */
            _searchKeyInOptions : function(event) {
                var keyCode = event.keyCode;
                if (keyCode >= 65 && keyCode <= 90) {
                    event.preventDefault();

                    var character = String.fromCharCode(keyCode);

                    if (this.$refs.dropdownMenu) {
                        this.$refs.dropdownMenu.$children.map(function(child) {
                            if (child instanceof ListItem && child.$el.getAttribute('role') == 'menuitem') {
                                if (!child.$el.classList.contains(PLACEHOLDER_CLASS) && child.$el.textContent.trim()[0] == character) {
                                    child.$el.focus();
                                }
                            }
                        }.bind(this));
                    }
                }
            },
            /**
             * Handler for the native select component change event
             */
            _onMobileChangeHandler : function() {
                var select = this.$refs.select,
                    selectedOption = select.selectedOptions[0];
                this.setAvatar(selectedOption.getAttribute(ATTRIBUTE.AVATAR));
                this.setColor(selectedOption.getAttribute(ATTRIBUTE.COLOR));
                this.setInputText(selectedOption.text);
                this.setValue(select.value);
            },

            /**
             * Clears the component's state, leaving it as empty
             * @param {boolean} [shouldTriggerState] - if the component must notify the changes of its value
             * @private
             */
            _clear : function(shouldTriggerState) {
                if (!this.setIconOnly) {
                    this.setInputText(null);
                }

                this.setAvatar(null);
                this.setColor(null);
                this.setIconClass(null);
                this.setValue(null, shouldTriggerState);
            },

            /**
             * Obtains the index of a given value from the options
             * @param  {string | number} value
             * @return {number}       index of the current selected value
             */
            _getSelectedOptionIndex : function(value) {
                for (var index in this.options) {
                    if (this.options[index].value == value) {
                        return parseInt(index);
                    }
                }
                return null;
            },
            /**
             * Adds a watch method for the getActive method of the dropdown menu
             */
            _watchMenuDisplay : function() {
                var self = this,
                    $dropdownMenu = self.$refs.dropdownMenu;

                // watch over the menu isActive state
                $dropdownMenu.$watch($dropdownMenu.getActive, function(newValue) {
                    self._setSelectedItemFocus(newValue);
                });
            },
            /**
             * Put the input in focus state after closing the dropdown menu
             */
            _onMenuClosed : function() {
                this.$refs.inputContainer.focus();
                this.$refs.input.focus();
            },
            /**
             * Attach floating layer positioning hook
             */
            _onMenuOpened : function() {
                this._attachFloatingLayerPositioning();
            },
        },
        watch : {
            // Value must be watched for listening parent or vuex changes
            value : function(newValue) {
                if (newValue !== this.state.value) {
                    // Set the value but don't trigger the on input event
                    this.state.value = newValue;
                    // visually updates the selected value
                    if (newValue) {
                        this._checkSelectedOption(false);
                    } else {
                        this._clear(false);
                    }
                }
            },
            options : function() {
                if (!this.native && !this.disabled) {
                    this.state.processedOptions = {};
                    this._processOptions();
                    if (this.value !== undefined) {
                        this._checkSelectedOption(false);
                    }
                }
            }
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-icon' : Icon,
            'wc-input-container' : InputContainer,
            'wc-list-item' : ListItem,
            'wc-menu' : Menu
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Dropdown.EVENT = EVENT;

    return Dropdown;
});
