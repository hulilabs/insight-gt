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
 * @file Tabs component
 * @requires vue
 * @requires web-components/tabs/tab_component
 * @requires web-components/tabs/tabs_template.html
 * @requires web-components/components/tabs/tabs_styles.css
 * @module web-components/components/tabs/tabs_component
 * @extends Vue
 * @fires module:Tabs#ON_CHANGE
 * @see {@link https://web-components.hulilabs.xyz/components/tabs} for demos and documentation
 */
define([
    'vue',
    'web-components/tabs/tab_component',
    'text!web-components/tabs/tabs_template.html',
    'css-loader!web-components/tabs/tabs_styles.css'
],
function(
    Vue,
    Tab,
    Template
) {
    /**
     * List of tabs component events
     * @type {Object}
     */
    var EVENT = {
        ON_CHANGE : 'tabs-change'
    };

    var Tabs = Vue.extend({
        name : 'TabsComponent',
        template : Template,
        props : {
            /**
             * Sets which is the currently selected tab for the set of Tab components definition
             * given as the component's dfinition.
             */
            selected : {
                type : [Number, String],
                required : false,
                default : null
            }
        },
        data : function() {
            return {
                state : {
                    selected : this.selected
                }
            };
        },
        mounted : function() {
            // Prepares each Tab child for the interaction with this Tabs component
            this._prepareTabChildren();
            this._setIndicator(this._getTabByIndex(this.state.selected));
            // Adds the window's resize event listener for readjusting the tab highlighter
            window.addEventListener('resize', this._onWindowResizedHandler);
        },
        /**
         * Removes the previous listeners and adds listeners for handling the
         * Tab component ON_SELECTED event. This allows to give the same behavior
         * to dynamically generated tabs.
         */
        updated : function() {
            this._prepareTabChildren();
            this._setIndicator(this._getTabByIndex(this.state.selected));
        },
        methods : {
            /**
             * Sets a Tab child as active if its index matches the given value.
             * @param {Number|String} index an index value of a Tab
             */
            setSelected : function(index) {
                var selectedTab = this._getTabByIndex(index);

                if (selectedTab) {
                    selectedTab.setActive(true);
                }
            },
            /**
             * Updates the tab selected highlighter so it matches both
             * the width and the position of the currently selected tab
             */
            updateIndicator : function() {
                var $selectedTab = this._getTabByIndex(this.state.selected);
                if ($selectedTab) {
                    this._moveIndicator($selectedTab.$el.offsetLeft, $selectedTab.$el.clientWidth);
                }
            },
            /**
             * Gets a Tab child that matches the given index.
             * @param  {Number|String} index value of the tab within the tabs component scope
             * @return {Tab} instance of the Tab child which index matches the given index
             * @private
             */
            _getTabByIndex : function(index) {
                for (var i = 0; i < this.$children.length; i++) {
                    var child = this.$children[i];
                    if (child instanceof Tab && child.getIndex() === index) {
                        return child;
                    }
                }
                return null;
            },
            /**
             * Updates the component's state and updates the active state of both the previously
             * selected tab and the new one. It also emmits an event for notifying
             * the component's state changes if required.
             * @param {TabEventSelectPayload}  payload             payload of the tab ON_SELECTED event
             * @param {Boolean}                shouldTriggerState  if the component should trigger its state's changes
             * @private
             */
            _onSelectedTabHandler : function(payload, shouldTriggerState) {
                // the payload is null if the selected tab has the prop auto-selectable in false
                if (payload && (this.state.selected !== payload.index)) {
                    var selectedTab = this._getTabByIndex(this.state.selected);

                    // Removes the active state of the currently selected tab
                    if (selectedTab) {
                        selectedTab.setActive(false, false);
                    }

                    this.state.selected = payload.index;

                    this._setIndicator(payload.component);

                    if (shouldTriggerState !== false) {
                        this._triggerState();
                    }
                }
            },
            /**
             * Moves the indicator to the tab
             * @param {Tab} component
             * @private
             */
            _setIndicator : function(component) {
                if (component && component.$el) {
                    requestAnimationFrame(function() {
                        var tabComponent = component.$el,
                            tabLeft = tabComponent.offsetLeft,
                            tabWidth = tabComponent.clientWidth;
                        this._scrollToTab(tabLeft, tabWidth);
                        this._moveIndicator(tabLeft, tabWidth);
                    }.bind(this));
                }
            },
            /**
             * On scrollable tabs, moves the horizontal scroll to show the selected tab
             * @param  {Integer} tabLeft  selected tab left offset
             * @param  {Integer} tabWidth selected tab width
             * @note create a smooth scroll-x transition including the highlighter animation
             * @private
             */
            _scrollToTab : function(tabLeft, tabWidth) {
                var visibleWidth = this.$el.clientWidth,
                    scrollPosition = this.$el.scrollLeft;

                if (this.$el.scrollWidth !== visibleWidth) {
                    var tabRight = tabLeft + tabWidth,
                        visibility = scrollPosition + visibleWidth,
                        // 4 tabs of min-width 22% are shown (88% totally)
                        // A 12% adjustment is added either side to show the nearby tab
                        adjustment = (0.12 * visibleWidth);

                    if (scrollPosition > tabLeft) {
                        // Outside LEFT
                        this.$el.scrollLeft = tabLeft - adjustment;
                    } else if (visibility < tabRight) {
                        // Outside RIGHT
                        this.$el.scrollLeft = tabRight - visibleWidth + adjustment;
                    }
                }
            },
            /**
             * Moves and resizes (with the transform:translateX rule) the active tab indicator
             * to match the currently active tab position and width.
             * @param  {Integer} tabLeft  selected tab left offset
             * @param  {Integer} tabWidth selected tab width
             * @private
             */
            _moveIndicator : function(tabLeft, tabWidth) {
                if (this.$refs.highlighter) {
                    this.$refs.highlighter.style.transform = 'translateX(' + tabLeft + 'px)';
                    this.$refs.highlighter.style.width = tabWidth + 'px';
                }
            },
            /**
             * Attaches the ON_SELECTED event listener and assigns an index to each Tab children
             * component that was given at the component's definition. Sets as active the
             * child which index was set as the component's selected tab.
             * It also calculates the amount of pixels for making the tabs' index fit their containers.
             * @warning these indexes won't overwrite the value that was already assigned to the tabs
             * via their "index" attribute at their definition.
             * @private
             */
            _prepareTabChildren : function() {
                var self = this;

                self.$children.forEach(function(child, index) {
                    if (child instanceof Tab) {
                        child.setIndex(index);
                        child.$off(Tab.EVENT.ON_SELECTED);
                        // Attach event listeners only when it is enabled
                        if (!child.isDisabled()) {
                            child.$on(Tab.EVENT.ON_SELECTED, self._onSelectedTabHandler.bind(self));
                            // Activates the child tab if its the one selected
                            if (self.selected === child.getIndex()) {
                                child.setActive(true, false);
                            }
                        }
                    }
                });
            },
            /**
             * Handler of the window's resize event for relocating the tab highlighter to the
             * adjusted position of the selected tab.
             * @private
             */
            _onWindowResizedHandler : function() {
                requestAnimationFrame(this.updateIndicator);
            },
            /**
             * Triggers the event for notifying the parent that a Tab child was selected, sending
             * as the event's payload the currently selected child.
             * @fires module:Tabs#ON_CHANGE
             * @private
             */
            _triggerState : function() {
                /**
                 * @typedef {Object} OnChangePayload
                 * @property {Number} selected the currently selected tab
                 */
                var payload = {
                    selected : this.state.selected
                };

                /**
                 * change event
                 *
                 * @event module:Tabs#ON_CHANGE
                 * @type {OnChangePayload}
                 */
                this.$emit(EVENT.ON_CHANGE, payload);
            }
        },
        watch : {
            /**
             * Updates the state of the currently selected tab whenever the "selected" bound prop
             * is changed by the component's parent.
             * @param  {Number} index tab that must be set as selected
             */
            selected : function(index) {
                this.setSelected(index);
            }
        },
        destroyed : function() {
            // make sure the resize listener is unbinded on destroy
            window.removeEventListener('resize', this._onWindowResizedHandler);
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Tabs.EVENT = EVENT;

    return Tabs;
});
