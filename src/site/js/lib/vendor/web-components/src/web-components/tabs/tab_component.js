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
 * @file Tab component
 * @requires vue
 * @requires web-components/directives/gestures/gestures_directive-handler
 * @requires web-components/tabs/tab_template.html
 * @requires web-components/components/tabs/tab_styles.css
 * @module web-components/components/tabs/tab_component
 * @extends Vue
 * @fires module:Tab#ON_SELECTED
 * @see {@link https://web-components.hulilabs.xyz/components/tabs} for demos and documentation
 */
define([
    'vue',
    'web-components/directives/gestures/gestures_directive-handler',
    'text!web-components/tabs/tab_template.html',
    'css-loader!web-components/tabs/tab_styles.css'
],
function(
    Vue,
    GestureDirectiveHandler,
    Template
) {
    /**
     * List of tab component events
     * @type {Object}
     */
    var EVENT = {
        ON_SELECTED : 'tab-selected',
        ON_CLICK : 'tab-clicked'
    };

    var Tab = Vue.extend({
        name : 'TabComponent',
        template : Template,
        props : {
            /**
             * Index that identifies the tab within the children scope of a "tabs" parent component.
             * This attribute is optional as it may be set by the parent of a tabs component
             * or assigned directly by a tabs component.
             */
            index : {
                type : [Number, String],
                required : false,
                default : null
            },
            /**
             * Indicates if the component should set as selected once is clicked.
             */
            autoSelectable : {
                type : Boolean,
                default : true
            },
            /**
             * Make the tab not selectable
             */
            disabled : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * State for highlighting the tab if it's active
                     * @type {Boolean}
                     */
                    isActive : false,
                    /**
                     * Identification of the tab within its parent's scope
                     * @type {?Number|?String}
                     */
                    index : this.index
                }
            };
        },
        mounted : function() {
            // Bind listener when enable
            if (!this.disabled) {
                // Click listener
                this.$el.addEventListener('click', this._onTabSelectedHandler.bind(this));
                // Gesture binder
                GestureDirectiveHandler.bind(this.$el, {
                    arg : 'tap',
                    value : this._onTouchTabSelectedHandler.bind(this)
                });
                GestureDirectiveHandler.bind(this.$el, {
                    arg : 'longtap',
                    value : this._onTouchTabSelectedHandler.bind(this)
                });
            }
        },
        methods : {
            /**
             * Changes the value for the component's isActive state and if required, triggers
             * the changes of the current state of the component.
             * @param {Boolean} value new value for the component's isActive state
             * @param {Boolean} shouldTriggerState if the component should trigger its state's changes
             */
            setActive : function(value, shouldTriggerState) {
                if (this.state.isActive !== value) {
                    this.state.isActive = value;

                    if (shouldTriggerState !== false) {
                        this._triggerState();
                    }
                }
            },
            /**
             * Sets the component's index value if it hasn't already been set (for not
             * overwriting the value that was given as a property).
             * @param {Number|String} index the tab's index value
             */
            setIndex : function(index) {
                if (this.state.index === null) {
                    this.state.index = index;
                }
            },
            /**
             * Gets the value of the Tab's index.
             * @return {Number|String} the index assigned to the tab
             */
            getIndex : function() {
                return this.state.index;
            },
            /**
             * Gets the disable state
             * @return {Boolean}
             */
            isDisabled : function() {
                return this.disabled;
            },

            /**
             * Sets the currently tab as active.
             */
            _onTouchTabSelectedHandler : function() {
                this.$el.focus();
                this._onTabSelectedHandler();
            },

            /**
             * Sets the currently tab as active.
             */
            _onTabSelectedHandler : function() {
                if (this.autoSelectable) {
                    this.setActive(true);
                } else {
                    this.$emit(EVENT.ON_CLICK);
                }
            },
            /**
             * Triggers the event for notifying the parent that the tab was selected, sending
             * as the event's payload the respective tab's index that was set by its parent.
             * @fires module:Tab#ON_SELECTED
             * @private
             */
            _triggerState : function() {
                /**
                 * @typedef {Object} TabEventSelectPayload
                 * @property {VueComponent}  this tab vue component instance, with $el reference
                 * @property {Number|String} index tab's index within its parent's children scope
                 */
                var payload = {
                    component : this,
                    index : this.state.index
                };

                /**
                 * selected event, the payload is null if the auto-selected prop is false
                 *
                 * @event module:Tab#ON_SELECTED
                 * @type {TabEventSelectPayload}
                 */
                this.$emit(EVENT.ON_SELECTED, payload);
            }
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Tab.EVENT = EVENT;

    return Tab;
});
