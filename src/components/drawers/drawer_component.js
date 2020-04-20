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
 * @file Drawer component following material design
 * @requires vue
 * @requires web-components/overlays/overlay_component
 * @requires web-components/drawers/drawer_template.html
 * @requires web-components/drawers/drawer_styles.css
 * @module web-components/components/drawers/drawer_component
 * @extends Vue
 * @listens module:Overlay#ON_CHANGE
 * @fires module:Drawer#ON_CHANGE
 * @fires module:Drawer#action
 * @see {@link https://web-components.hulilabs.xyz/components/drawer} for demos and documentation
 */
define([
    'vue',
    'web-components/overlays/overlay_component',
    'text!web-components/drawers/drawer_template.html',
    'css-loader!web-components/drawers/drawer_styles.css'
],
function(
    Vue,
    Overlay,
    Template
) {

    var DEFAULT_TRANSFORM_NAV = 'translateX(-102%)';

    var Drawer = Vue.extend({
        name : 'DrawerComponent',
        template : Template,
        props : {
            /**
             * Set the state of the nav, true if to open, false to close,
             * this can be useful if you want to bind the state of the nav to the parent or vuex
             */
            active : {
                type : Boolean,
                required : false
            },
            /**
             * action to be executed when the nav changes its state
             */
            action : {
                type : String,
                required : false
            },
            /**
             * set false to disable the swipe functionality
             */
            swipe : {
                type : Boolean,
                default : true,
                required : false
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * it is true when the nav is open otherwise is false.
                     * important to know that some CSS animation depends on this.
                     */
                    isActive : false,
                    /**
                     * tracking touch events variables
                     */
                    startPointInX : 0,
                    currentPointInX : 0,
                    /**
                     * it is true when the nav is NOT active, and the user is trying to open it
                     * with a swipe gesture.
                     */
                    isSwipingNav : false,
                    /**
                     * this flag is true when the browser support passive events
                     * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
                     */
                    isPassiveEventsSupported : false,
                    /**
                     * There is a small edge div element that is used to detect if the user wants to
                     * do a swipe event, if the user goes beyond this edge, the swipe event starts.
                     * peeking true is when the user is on the edge.
                     */
                    isPeeking : true,
                    /**
                     * if it is true, the body has the js-wc-scrollFixed assigned, this sets position : fixed
                     * to block the scroll when the nav is active or swiping
                     */
                    isBodyPositionBlocked : false
                },
                events : {
                    ON_CHANGE : 'change'
                },
                styles : {
                    nav : {
                        transform : DEFAULT_TRANSFORM_NAV,
                        transition : 'transform 0.33s cubic-bezier(0, 0, 0.3, 1)'
                    },
                    drawer : {
                        /** when the drawer is inactive(default), the component(overlay and nav) can not trigger
                         pointer events */
                        'pointer-events' : 'none'
                    }
                },
                navWidth : 0,
                edgeWidth : 0,
                /**
                 * Is the point in the X axis to detect the intention of the user when the swipe
                 * event is finished, if the current touch X value is more than it, It will open the nav,
                 * if it less, it will close it.
                 * default value is 40% of the nav width.
                 */
                swipeBreakpoint : 0
            };
        },
        mounted : function() {
            this._checkPassiveSupport();
            this._addEventListeners();
            this.navWidth = this.$refs.nav.offsetWidth;
            this.edgeWidth = this.$refs.edge.offsetWidth;
            this.swipeBreakpoint = Math.round(this.navWidth * 0.4);
            this._setActive(this.active, false);
        },
        methods : {
            /**
             * Open the nav
             * @public
             */
            open : function() {
                this._setActive(true);
            },
            /**
             * Close the nav
             * @public
             */
            close : function() {
                this._setActive(false);
            },
            /**
             * toggle the nav
             * @public
             */
            toggle : function() {
                this._setActive(!this.state.isActive);
            },
            /**
             * Open or closes the nav
             * @param {boolean} active - true if want to open the nav or false if want to close it.
             * @param {boolean} [triggerState] - set to false if you don't want to trigger the 'change' state event
             * @private
             */
            _setActive : function(active, triggerState) {
                if (active == null) {
                    return;
                }
                this.state.isActive = active;
                if (this.state.isActive) {
                    this.styles.nav.transform = 'none';
                    this.styles.drawer['pointer-events'] = 'auto';
                } else {
                    this.styles.nav.transform = DEFAULT_TRANSFORM_NAV;
                    this.styles.drawer['pointer-events'] = 'none';
                    this.$refs.overlay.setBlockBodyPosition(false);
                }
                if (triggerState !== false) {
                    this._triggerState();
                }
            },
            /**
             * Trigger the state of the component to the parent or execute an action(vuex)
             * @fires module:Drawer#ON_CHANGE
             * @fires module:Drawer#action
             * @private
             */
            _triggerState : function() {
                /**
                 * @typedef {Object} OnChangePayload
                 * @property {boolean} active - Indicates whether the dialog is active or not.
                 */
                var payload = {
                    active : this.state.isActive
                };
                if (this.action && this.$store) {
                    /**
                     * change action.
                     *
                     * @event module:Drawer#action
                     * @type {OnChangePayload}
                     */
                    this.$store.dispatch(this.action, payload);
                } else {
                    /**
                     * change event.
                     *
                     * @event module:Drawer#ON_CHANGE
                     * @type {OnChangePayload}
                     */
                    this.$emit(this.events.ON_CHANGE, payload);
                }
            },
            /**
             * Add the event listeners
             * Not using v.$on because it doesn't support all of the events.
             * @private
             */
            _addEventListeners : function() {
                this.$refs.nav.addEventListener('click', this._blockClicks);
                if (this.swipe) {
                    this.$el.addEventListener('touchstart', this._onTouchStart, this.state.isPassiveEventsSupported);
                }
            },
            /**
             * Start tracking the touch event
             * @param {Object} event - DOM native event object
             * @private
             */
            _onTouchStart : function(event) {
                /** the nav is close and the user is swiping the nav */
                if (!this.state.isActive) {
                    this.state.isSwipingNav = true;
                    this.state.isPeeking = true;
                    this.$el.addEventListener('touchmove', this._onTouchMove, this.state.isPassiveEventsSupported);
                    this.$el.addEventListener('touchend', this._onTouchEnd, this.state.isPassiveEventsSupported);
                    this.state.startPointInX = event.touches[0].pageX;
                    this.state.currentPointInX = this.state.startPointInX;
                }
            },
            /**
             * Track  when the user is moving the finger in the nav
             * @param event
             * @private
             */
            _onTouchMove : function(event) {
                var currentX = event.touches[0].pageX;
                /** if the user is swiping the nav (open action) and it passed the edge element
                 * move the drawer to the new position using requestAnimationFrame */
                if (this.state.isSwipingNav && (currentX > this.edgeWidth)) {
                    /** block the body only one time **/
                    if (!this.state.blockBodyPosition) {
                        this.$refs.overlay.setBlockBodyPosition(true);
                    }
                    this.state.isPeeking = false;
                    this.state.currentPointInX = currentX;
                    requestAnimationFrame(this._touchAnimationUpdate);
                }
            },
            /**
             * Handle what to do when the touch event has ended
             * @private
             */
            _onTouchEnd : function() {
                if (this.state.isSwipingNav) {
                    /** it will open or keep close the drawer depending on the touch X position */
                    this._setActive(this.state.currentPointInX >= this.swipeBreakpoint);
                    this.state.isSwipingNav = false;
                    this.$el.removeEventListener('touchmove', this._onTouchMove, this.state.isPassiveEventsSupported);
                    this.$el.removeEventListener('touchend', this._onTouchEnd, this.state.isPassiveEventsSupported);
                }
            },
            /**
             * Updates the animation depending on the touch event
             * @private
             */
            _touchAnimationUpdate : function() {
                /** this function moves the drawer depending on the X position */
                if (this.state.isSwipingNav && !this.state.isPeeking) {
                    this._moveDrawer(Math.min(0, -this.navWidth + this.state.currentPointInX));
                }
            },
            /**
             * Moves the drawer using transform and requestAnimationFrame
             * @param {Number} translateX - new TranslateX value for the transform
             * @private
             */
            _moveDrawer : function(translateX) {
                this.styles.nav.transform = 'translateX(' + translateX + 'px)';
                requestAnimationFrame(this._touchAnimationUpdate);
            },
            /**
             * if the overlay is closed by a click, change the state of the dialog
             * @listens module:Overlay#ON_CHANGE
             */
            _onOverlayClosed : function() {
                this._setActive(false);
            },
            /**
             * Block clicks in the nav, stop the propagation of them
             * @param {Object} event - DOM native event object
             * @private
             */
            _blockClicks : function(event) {
                event.stopPropagation();
            },
            /**
             * Check if the browser supports passive events and set the state in
             * this.state.isPassiveEventsSupported
             * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection} for more details
             * @todo move this to an util library detection
             * @private
             */
            _checkPassiveSupport : function() {
                try {
                    var options = Object.defineProperty({}, 'passive', {
                        get : function() {
                            this.state.isPassiveEventsSupported = { passive : true };
                        }.bind(this)
                    });
                    window.addEventListener('test', null, options);
                } catch (e) {}
            },
            /**
             * Unbind the listener required for passive events support detection
             * @see _checkPassiveSupport
             * @private
             */
            _unbindPassiveSupportChecker : function() {
                try {
                    window.removeEventListener('test', null);
                } catch (e) {}
            }
        },
        watch : {
            /**
             * is updating the prop value to the state
             * @param {boolean} newValue: new value defined in the prop
             */
            active : function(newValue) {
                if (newValue != this.state.isActive) {
                    this._setActive(newValue, false);
                }
            }
        },
        components : {
            'wc-overlay' : Overlay
        },
        destroyed : function() {
            this._unbindPassiveSupportChecker();
        }
    });

    return Drawer;
});
