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
 * @file Menu component
 * @requires vue
 * @requires web-components/helper/vue-helper
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/mixins/floating-layer/floating-layer_mixin
 * @requires web-components/overlays/overlay_component
 * @requires web-components/menus/menu_template.html
 * @requires web-components/menus/menu_styles.css
 * @module web-components/menus/menu_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/menu} for demos and documentation
 */
define([
    'vue',
    'web-components/helper/vue-helper',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/floating-layer/floating-layer_mixin',
    'web-components/overlays/overlay_component',
    'text!web-components/menus/menu_template.html',
    'css-loader!web-components/menus/menu_styles.css'
],
function(
    Vue,
    VueHelper,
    FloatingLayerBehavior,
    FloatingLayerMixin,
    Overlay,
    Template
) {

    /**
     * List of menu component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLOSE : 'menu-close',
        ON_OPEN : 'menu-open',
        SCROLL : 'scroll'
    };

    /**
     * Key constants
     * @type {Object}
     */
    var KEY_CODES = {
        TAB : 9,
        ENTER : 13,
        ESCAPE : 27,
        SPACE : 32,
        UP_ARROW : 38,
        DOWN_ARROW : 40
    };

    var Menu = Vue.extend({
        name : 'MenuComponent',
        mixins : [FloatingLayerMixin],
        template : Template,
        props : {
            /**
             * Set the state of the component:
             * true to open, false to close
             */
            active : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * CSS Selector for the element that activates the menu
             */
            triggerElementSelector : {
                type : String,
                required : true
            },
            /**
             * Whether the menu should trigger the scroll event or not
             * @type {boolean}
             */
            triggerScroll : {
                type : Boolean,
                default : false
            },
            /**
             * Optional class for the menu
             */
            menuClass : {
                type : [Array, Object, String],
                required : false,
                default : null
            },
            /**
             * Set to true to allow the user to close the overlay by pressing the ESC key
             */
            closeOnEscKey : {
                type : Boolean,
                required : false,
                default : true
            },
            /**
             * Flag to bind the floating layer behavior
             */
            hasFloatingLayer : {
                type : Boolean,
                required : false,
                default : true
            },
            /**
             * inline styles for the menu component
             */
            customStyles : {
                type : Object,
                required : false
            },
            /**
             * Removes the overlay component within the menu
             */
            removeOverlay : {
                type : Boolean,
                default : false
            },
            /**
             * Prevents the menu for autoclosing whenever an item is clicked. This is
             * specially useful when there are checkboxes as the menu's children
             */
            preventCloseOnItemClick : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                /**
                 * state of the menu
                 */
                state : {
                    /**
                     * Active state of the tooltip
                     * Reactively bound through the floatingLayerState to the floating layer behavior
                     * @type {Boolean}
                     */
                    isActive : this.active,
                    /**
                     * Reactive bind of the floating layer classes
                     * @type {Boolean}
                     */
                    floatingLayerClasses : null
                },
                /**
                 * DOM element that triggers the menu
                 */
                triggerElement : null,
                /**
                 * Children items (only vue items), without the disabled
                 */
                menuItems : []
            };
        },
        mounted : function() {
            /**
             * Next tick is required to delay the DOM lookup. In several scenarios, the trigger element
             * is at the same DOM level as the menu component, meaning that both are rendered simultaneously
             * and can't be reached through DOM selectors
             * @todo HULI-3774 change to vue references (more reactive approach) instead of selectors
             */
            this.$nextTick(function() {
                this.triggerElement = document.querySelector(this.triggerElementSelector);
                if (this.triggerElement) {
                    this.setupChildren();
                }
            }.bind(this));
        },
        methods : {
            /**
             * opens the menu
             */
            open : function() {
                this._setActive(true);
            },
            /**
             * closes the menu
             */
            close : function() {
                this._setActive(false);
                this.$emit(EVENT.ON_CLOSE);
            },
            /**
             * opens or closes the menu
             */
            toggle : function() {
                this._setActive(!this.state.isActive);
            },
            /**
             * Get the active state
             * Useful for watching state changes, also related to the floating layer behavior actions
             * @return {Boolean}
             */
            getActive : function() {
                return this.state.isActive;
            },
            /**
             * Returns the height of the menu
             * @return {number}
             */
            getHeight : function() {
                return this.$refs.menu ? this.$refs.menu.offsetHeight : 0;
            },
            /**
             * Sets the component state
             * @param {boolean} active     - new state
             * @param {boolean} timeout    - if the menu should wait a little bit before closing for allowing
             *                               the ripple effect animation to end
             * @fires module.Menu#ON_CLOSE
             * @fires module:Menu#ON_OPEN
             * @private
             */
            _setActive : function(active, timeout) {
                if (this.state.isActive !== active) {
                    if (active) {
                        this.state.isActive = true;
                        this.$emit(EVENT.ON_OPEN);
                    } else if (timeout) {
                        // timeout to show the ripple effect
                        setTimeout(function() {
                            this.state.isActive = false;
                            this.$emit(EVENT.ON_CLOSE);
                        }.bind(this), 300); // must be under 2000 or tests will timeout
                    } else {
                        this.state.isActive = false;
                        this.$emit(EVENT.ON_CLOSE);
                    }
                }
            },
            /**
             * add the listeners to the menu items and trigger element
             * @private
             */
            _addListeners : function() {
                if (this.triggerElement) {
                    this.triggerElement.addEventListener('keydown', this._onKeyUpOnTriggerElement);
                }

                this.activeMenuItems.map(function(item) {
                    item.$el.addEventListener('click', this._onClickInMenuItem);
                    item.$el.addEventListener('keydown', this._onKeyUpInMenuItem);
                    item.$el.tabIndex = '-1';
                }.bind(this));
            },
            /**
             * Handle the click event in the menu items
             * @private
             */
            _onClickInMenuItem : function() {
                if (!this.preventCloseOnItemClick) {
                    this._setActive(false, true);
                }
            },
            /**
             * Handle the keyup event in the trigger elements
             * @param event
             * @private
             */
            _onKeyUpOnTriggerElement : function(event) {
                if (this.state.isActive) {
                    if (event.keyCode === KEY_CODES.UP_ARROW) {
                        event.preventDefault();
                        this.activeMenuItems[this.activeMenuItems.length - 1].$el.focus();
                        return;
                    } if (event.keyCode === KEY_CODES.DOWN_ARROW) {
                        event.preventDefault();
                        this.activeMenuItems[0].$el.focus();
                        return;
                    } if (event.keyCode === KEY_CODES.TAB) {
                        // don't prevent default in the tab key to keep the default navigation
                        if (!this.preventCloseOnItemClick) {
                            this._setActive(false);
                        }
                    }
                }
            },
            /**
             * Handle the keyup event in the menu items
             * @param event
             * @private
             */
            _onKeyUpInMenuItem : function(event) {
                if (this.state.isActive) {
                    var selectedItemIndex = this._getSelectedItemIndex(event.currentTarget);
                    if (event.keyCode === KEY_CODES.UP_ARROW) {
                        event.preventDefault();
                        if (selectedItemIndex === 0) {
                            this.activeMenuItems[this.activeMenuItems.length - 1].$el.focus();
                        } else {
                            this.activeMenuItems[selectedItemIndex - 1].$el.focus();
                        }
                        return;
                    } if (event.keyCode === KEY_CODES.DOWN_ARROW) {
                        if (selectedItemIndex === this.activeMenuItems.length - 1) {
                            this.activeMenuItems[0].$el.focus();
                        } else {
                            this.activeMenuItems[selectedItemIndex + 1].$el.focus();
                        }
                        return;
                    } if (event.keyCode === KEY_CODES.SPACE || event.keyCode === KEY_CODES.ENTER) {
                        event.preventDefault();
                        event.target.click();
                        return;
                    } if (event.keyCode === KEY_CODES.TAB) {
                        event.preventDefault();
                        if (!this.preventCloseOnItemClick) {
                            this._setActive(false);
                        }
                    }
                }
            },

            /**
             * Triggers a on scroll event
             * @fires menu#EVENT.SCROLL
             * @param {Event} event
             */
            _onScroll : function(event) {
                var element = event && event.target ? event.target : null;
                if (this.triggerScroll && element) {
                    this.$emit(EVENT.SCROLL, {
                        offsetHeight : element.offsetHeight,
                        scrollTop : element.scrollTop,
                        scrollHeight : element.scrollHeight
                    });
                }
            },

            /**
             * Returns the index of the element
             * @param {DOMElement} element, the selected element
             * @return {Number} the index
             * @private
             */
            _getSelectedItemIndex : function(element) {
                for (var current = 0, total = this.activeMenuItems.length; current < total;current++) {
                    if (this.activeMenuItems[current].$el === element) {
                        return current;
                    }
                }
                return -1;
            },
            /**
             * Returns the children elements
             * @return {Array.<Vue>}
             * @private
             */
            _getActiveMenuItems : function() {
                return this.$children.filter(function(item) {
                    if (item instanceof Vue && !item.disabled &&
                        (item.role === 'menuitem' || (item.$el.getAttribute('role') === 'menuitem'))) {
                        return item;
                    }
                });
            },
            /**
             * Setup of the children
             * Sets the active menu items and the floating layer behavior
             * @public
             */
            setupChildren : function() {
                this._setupActiveMenuItems();
                this._setupFloatingLayerBehavior();
            },
            /**
             * Sets the items of the menu to have their corresponding listeners
             * @private
             */
            _setupActiveMenuItems : function() {
                this.activeMenuItems = this._getActiveMenuItems();
                this._addListeners();
            },
            /**
             * Sets the menu to have the floating layer behavior
             * @private
             */
            _setupFloatingLayerBehavior : function() {
                if (this.hasFloatingLayer) {
                    // Initial floating layer setup
                    this.bindFloatingLayerBehavior({
                        floatingElementReferenceKey : 'menu',
                        floatingPositioner : this.$el,
                        floatingSmart : true,
                        triggerElement : this.triggerElement,
                        triggerEvent : FloatingLayerBehavior.EVENT.CLICK
                    });
                }
            }
        },
        updated : function() {
            // track new children once DOM has rerendered
            this._setupActiveMenuItems();
        },
        watch : {
            /**
             * When the floating layer changes the active
             * state trigger the component toggle events
             * @param  {string} newValue
             * @fires module.Menu#ON_CLOSE
             * @fires module:Menu#ON_OPEN
             */
            'state.isActive' : function(newValue) {
                this.$emit(newValue ? EVENT.ON_OPEN : EVENT.ON_CLOSE);
            },
            /**
             * is updating the prop value to the state
             * @param {boolean} newValue: new value defined in the prop
             */
            active : function(newValue) {
                this._setActive(newValue);
            }
        },
        components : {
            'wc-overlay' : Overlay
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Menu.EVENT = EVENT;

    return Menu;
});
