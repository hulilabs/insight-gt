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
 * @file Tooltip component
 * @requires vue
 * @requires web-components/helper/vue-helper
 * @requires web-components/helper/vue-refs-helper
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/mixins/floating-layer/floating-layer_mixin
 * @requires web-components/tooltips/tooltip_template.html
 * @requires web-components/tooltips/tooltip_styles.css
 * @module web-components/tooltips/tooltip_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/tooltip} for demos and documentation
 */
define([
    'vue',
    'web-components/helper/vue-helper',
    'web-components/helper/vue-refs-helper',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/floating-layer/floating-layer_mixin',
    'web-components/utils/adaptive/adaptive',
    'text!web-components/tooltips/tooltip_template.html',
    'css-loader!web-components/tooltips/tooltip_styles.css'
],
function(
    Vue,
    VueHelper,
    VueRefsHelper,
    FloatingLayerBehavior,
    FloatingLayerMixin,
    AdaptiveUtil,
    Template
) {

    /**
     * Supported alignments
     * @see FloatingLayerBehavior.ORIGIN
     * @type {Object}
     */
    var ALIGNMENT = {
        BOTTOM : 'bottom',
        LEFT : 'left',
        TOP : 'top',
        RIGHT : 'right'
    };

    var Tooltip = Vue.extend({
        name : 'TooltipComponent',
        template : Template,
        mixins : [FloatingLayerMixin],
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
             * Element that toggles tooltip visibility
             */
            triggerElement : VueRefsHelper.prop(),
            /**
             * Alignment property, sets the origin point of the
             * trigger element where the tooltip will be shown
             * @see ALIGNMENT
             * @see FloatingLayerBehavior
             */
            alignment : {
                type : String,
                required : false,
                default : ALIGNMENT.BOTTOM,
                validator : function(value) {
                    var key = value.toUpperCase();
                    return ALIGNMENT.hasOwnProperty(key) && ALIGNMENT[key] === value;
                }
            },
            /**
             * Change the tooltip behavior deviced-based
             */
            mobile : {
                type : Boolean,
                default : AdaptiveUtil.isMobile()
            }
        },
        data : function() {
            return {
                /**
                 * state of the tooltip
                 */
                state : {
                    /**
                     * Active state of the tooltip
                     * @see FloatingLayerMixin
                     * @type {Boolean}
                     */
                    isActive : this.active
                }
            };
        },
        mounted : function() {
            this._bindFloatingLayerBehavior();
        },
        methods : {
            /**
             * Opens the tooltip
             * @public
             */
            open : function() {
                this._setActive(true);
            },
            /**
             * Closes the tooltip
             * @public
             */
            close : function() {
                this._setActive(false);
            },
            /**
             * Toggle between close or open states
             * @public
             */
            toggle : function() {
                this._setActive(!this.state.isActive);
            },
            /**
             * Sets the component state
             * @param {Boolean} active - new state
             * @private
             */
            _setActive : function(active) {
                if (this.state.isActive !== active) {
                    this.state.isActive = active;
                }
            },
            /**
             * Based on the alignment property, calculates the floating layer origin
             * This also helps avoiding support for corner floating layer origins (ie. top-left)
             * @private
             */
            _getFloatingOrigin : function() {
                var alignment;
                switch (this.alignment) {
                    case ALIGNMENT.TOP:
                        alignment = FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER;
                        break;
                    case ALIGNMENT.RIGHT:
                        alignment = FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT;
                        break;
                    case ALIGNMENT.BOTTOM:
                        alignment = FloatingLayerBehavior.ORIGIN.TOP_CENTER;
                        break;
                    case ALIGNMENT.LEFT:
                        alignment = FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT;
                        break;
                }
                return alignment;
            },
            /**
             * Based on the alignment property, calculates the trigger origin
             * This also helps avoiding support for corner trigger origins (ie. top-left)
             * @private
             */
            _getTriggerOrigin : function() {
                var alignment;
                switch (this.alignment) {
                    case ALIGNMENT.TOP:
                        alignment = FloatingLayerBehavior.ORIGIN.TOP_CENTER;
                        break;
                    case ALIGNMENT.RIGHT:
                        alignment = FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT;
                        break;
                    case ALIGNMENT.BOTTOM:
                        alignment = FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER;
                        break;
                    case ALIGNMENT.LEFT:
                        alignment = FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT;
                        break;
                }
                return alignment;
            },
            /**
             * Performs the setup of the floating layer behavior so the tooltip
             * can be positioned correctly according to the given configuration
             * @private
             */
            _bindFloatingLayerBehavior : function() {
                // Trigger options
                var trigger = VueRefsHelper.resolveVueRef(this.triggerElement);

                // Store tooltip inside trigger element dom. Required for unit testing
                trigger.$refs = trigger.$refs || {};
                trigger.$refs.tooltip = this;

                // Setup per device options
                var floatingLayerBehaviorForDevice = this.mobile ? {
                    floatingOffset : 12,
                    triggerEvent : FloatingLayerBehavior.EVENT.NONE
                } : {
                    floatingOffset : 8,
                    triggerEvent : FloatingLayerBehavior.EVENT.HOVER
                };

                this.bindFloatingLayerBehavior(Vue.util.extend({
                    floatingElementReferenceKey : 'tooltip',
                    floatingOrigin : this._getFloatingOrigin(),
                    triggerElement : trigger,
                    triggerOrigin : this._getTriggerOrigin()
                }, floatingLayerBehaviorForDevice));
            }
        },
        watch : {
            /**
             * Changes the `active` state of the component and recalculates the
             * position for a correct display of the tooltip
             * @param {boolean} newValue new value defined through the prop
             */
            active : function(newValue) {
                this._setActive(newValue);
                // The next tick is required for appropriately recalculate the position
                // of the tooltip according to the trigger element in scenarios for example,
                // when the alignment of the tooltip changed
                this.$nextTick(function() {
                    this.getFloatingBehavior().reposition();
                }.bind(this));
            },
            /**
             * Removes the original floating layer setup and performs a new one
             * with the freshly updated alignment value
             */
            alignment : function() {
                this.unbindFloatingLayerBehavior();
                this._bindFloatingLayerBehavior();
            }
        }
    });

    /**
     * Exposing the alignments
     */
    Tooltip.ALIGNMENT = ALIGNMENT;

    return Tooltip;
});
