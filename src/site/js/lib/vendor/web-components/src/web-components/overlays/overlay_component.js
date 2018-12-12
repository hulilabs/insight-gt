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
 * @file Overlay component
 * @requires vue
 * @requires web-components/utils/scroll/scroll
 * @requires web-components/utils/keyboard
 * @requires web-components/overlays/overlay_template.html
 * @requires web-components/components/overlays/overlay_styles.css
 * @module web-components/components/overlays/overlay_component
 * @extends Vue
 * @fires module:Overlay#ON_CLOSE
 * @see {@link https://web-components.hulilabs.xyz/components/overlay} for demos and documentation
 */
define([
    'vue',
    'web-components/directives/gestures/gestures_directive-handler',
    'web-components/utils/scroll/scroll',
    'web-components/utils/keyboard',
    'text!web-components/overlays/overlay_template.html',
    'css-loader!web-components/overlays/overlay_styles.css'
],
function(
    Vue,
    GestureDirectiveHandler,
    ScrollUtil,
    KeyboardUtil,
    Template
) {

    /**
     * List of overlay component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLOSE : 'overlay-close'
    };

    var Overlay = Vue.extend({
        name : 'OverlayComponent',
        template : Template,
        props : {
            /**
             * Set the state of the overlay, true if to open, false to close,
             */
            active : {
                type : Boolean,
                required : false
            },
            /**
             * Set to true to allow the user to close the overlay by clicking on it
             */
            closeOnClick : {
                type : Boolean,
                required : false,
                default : true
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
             * Blocks the scroll when the overlay is active
             */
            blockScroll : {
                type : Boolean,
                required : false,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * if it is true, the body has the js-wc-scrollFixed assigned, this sets position : fixed
                     * to block the scroll when the overlay is active or swiping
                     */
                    isBodyPositionBlocked : false
                },
                events : {
                    ON_CHANGE : 'change'
                }
            };
        },
        mounted : function() {
            this.scrollUtil = new ScrollUtil();
            this._toggleScrollBlocking(this.active);
            this._toggleListeners(this.active);
        },
        /**
         * Making sure that the listeners are removed before destroying the overlay
         */
        beforeDestroy : function() {
            this._toggleScrollBlocking(false);
            this._toggleListeners(false);
        },
        methods : {
            /**
             * when the overlay is active, it blocks the scroll in the body element
             * @param {Boolean} block - true to block the position false to unblock
             * @private
             */
            setBlockBodyPosition : function(block) {
                this.scrollUtil.toggleBodyPositionLock(block);
                this.state.isBodyPositionBlocked = block;
            },
            /**
             * Trigger the state of the component to the parent
             * @fires module:Overlay#ON_CLOSE
             * @private
             */
            _triggerState : function() {
                /**
                 * change event.
                 *
                 * @event module:Overlay#ON_CLOSE
                 */
                this.$emit(EVENT.ON_CLOSE);
            },
            /**
             * Adds or removes the scroll block depending on the state
             * @param  {Boolean} isActive flag for adding or removing the scroll block (related to the active state)
             * @private
             */
            _toggleScrollBlocking : function(isActive) {
                if (this.blockScroll) {
                    this.setBlockBodyPosition(isActive);
                }
            },
            /**
             * Adds or removes the event listeners depending in the state
             * @param {Boolean} isActive flag for adding or removing the listeners (related to the active state)
             * @private
             */
            _toggleListeners : function(isActive) {
                var actionXEventListener = isActive ? 'addEventListener' : 'removeEventListener',
                    gestureXBinder = isActive ? 'bind' : 'unbind';

                // Close on click listeners
                if (this.closeOnClick) {
                    // Binding tap event for mobile devices
                    var tapGesture = { arg : 'tap', value : this._onTouchOverlay };
                    GestureDirectiveHandler[gestureXBinder](this.$refs.overlay, tapGesture);

                    // Using mousedown, is faster than click
                    this.$refs.overlay[actionXEventListener]('mousedown', this._onTouchOverlay);
                }

                // Close on ESC key listeners
                if (this.closeOnEscKey) {
                    window[actionXEventListener]('keydown', this._onKeyUp);
                }
            },
            /**
             * Click event handler
             * @private
             */
            _onTouchOverlay : function(event) {
                event.stopPropagation();
                this._triggerState();
            },
            /**
             * keyup event handler
             * @private
             *
             * @todo figure out a better way to avoid navigation behind the overlay without preventDefault
             *       must support form navigation above the overlay, like in a dialogs with forms
             */
            _onKeyUp : function(event) {
                // Always stop progration to avoid actions behind the overlay
                event.stopPropagation();

                // Trigger close event on escape keydown
                if (event.keyCode === KeyboardUtil.CODE.ESCAPE) {
                    this._triggerState();
                }
            }
        },
        watch : {
            /**
             * Adds or removes the event listeners to
             * @param {boolean} newValue: new value defined in the prop
             */
            active : function(newValue) {
                this._toggleScrollBlocking(newValue);
                this._toggleListeners(newValue);
            }
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Overlay.EVENT = EVENT;

    return Overlay;
});
