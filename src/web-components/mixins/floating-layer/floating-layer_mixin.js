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
 * @file Floating layer behavior mixin
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/helper/vue-helper
 * @requires web-components/mixins/vue-refs_mixin
 * @module web-components/mixins/floating-layer/floating-layer_mixin
 */
define([
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/helper/vue-helper',
    'web-components/mixins/vue-refs_mixin'
], function(
    FloatingLayerBehavior,
    VueHelper,
    VueRefsMixin
) {

    /**
     * Floating layer injected computed properties
     * @type {Object}
     */
    var FLOATING_LAYER = {
        STATE : 'floatingLayerState',
        CLASSES : 'floatingLayerClasses'
    };

    /**
     * Floating layer DOM setup properties
     * @type {Object}
     */
    var PROPS = {
        /**
         * Enables connector element
         */
        floatingConnector : {
            type : Boolean,
            required : false,
            default : false
        },
        /**
         * Setup positiong based on direction
         */
        floatingDirection : {
            type : String,
            required : false,
            default : null
        },
        /**
         * Pixels offset between the floating block and trigger
         */
        floatingOffset : {
            type : Number,
            required : false,
            default : 0
        },
        /**
         * Floating block origin
         * @see FloatingLayerBehavior.ORIGIN
         */
        floatingOrigin : {
            type : String,
            required : false,
            default : null
        },
        /**
         * Setup smart positioning
         */
        floatingSmart : {
            type : Boolean,
            required : false,
            default : false
        },
        /**
         * Trigger event
         * @see FloatingLayerBehavior.EVENT
         */
        triggerEvent : {
            type : String,
            required : false,
            default : FloatingLayerBehavior.EVENT.NONE
        },
        /**
         * Trigger origin
         * @see FloatingLayerBehavior.ORIGIN
         */
        triggerOrigin : {
            type : String,
            required : false,
            default : null
        }
    };

    /**
     * This mixin allows a better integration of floating behavior options and the attached component properties
     * ~ Think of this like interface IFloatingLayerComponent
     *
     * 1. Implement this mixin by adding:
     *
     *      mixins: [FloatingLayerMixin],
     *
     * 2. Each prop supports a computed property adjustment. Just prepend "floatingLayer" like:
     *
     *    PROP           | COMPUTED                    | USAGE
     *    floatingOrigin | floatingLayerFloatingOrigin | Used to transform an alignment like "right" to Origin object
     *    triggerOrigin  | floatingLayerTriggerOrigin  | Used to transform an alignment like "up" to Origin object
     *
     * 3. Finally, call the bindFloatingLayerBehavior (mixin method) on mounted
     *
     *      mounted : function() {
     *          ...
     *          this.bindFloatingLayerBehavior({...});
     *      },
     *
     */
    var FloatingLayerMixin = {
        mixins : [VueRefsMixin],
        props : PROPS,
        computed : {
            /**
             * Required computed variable for floating layer binder setup
             * Bypasses isActive state for reactivity
             */
            floatingLayerState : {
                get : function() {
                    return this.state.isActive;
                },
                set : function(isActive) {
                    this.state.isActive = isActive;
                }
            },
            /**
             * Required computed variable for floating layer binder setup
             * Bypasses floatingLayerClasse state for reactivity
             */
            floatingLayerClasses : {
                get : function() {
                    return this.state.floatingLayerClasses;
                },
                set : function(classes) {
                    this.state.floatingLayerClasses = classes;
                }
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * Active state of the component
                     * @type {Boolean}
                     */
                    isActive : false,
                    /**
                     * Reactive bind of the floating layer classes
                     * @type {Boolean}
                     */
                    floatingLayerClasses : null
                }
            };
        },
        methods : {
            /**
             * Resolve floating layer option that is provided via (in order of priority):
             * - attribute / property
             * - computed property (format: floatingLayer{propKey.firstLetterUppercase})
             * - binding option
             * - default value
             *
             * @param  {String} propKey
             * @param  {Object} opts
             *
             * @return resolved floating layer option
             *
             * @private
             */
            _resolveFloatingLayerComputedProp : function(propKey, opts) {
                // Resolve by attribute
                // @note Boolean props (like floatingSmart) can have a falsy value
                //       Be aware of handling falsy values correctly
                var propsData = this.$options.propsData;
                if (propsData && propsData.hasOwnProperty(propKey)) {
                    return propsData[propKey];
                }

                // Resolve by computed, binder or default value
                var propDefault = PROPS[propKey].default,
                    propIsDefault = this[propKey] === propDefault,
                    computedKey = 'floatingLayer' + propKey.charAt(0).toUpperCase() + propKey.slice(1);

                return (propIsDefault && VueHelper.hasComputed(this, computedKey)) ? this[computedKey] :
                    (propIsDefault && opts && opts.hasOwnProperty(propKey) ? opts[propKey] : this[propKey]);
            },
            /**
             * Resolve floating layer by transforming string value into object
             * @return {Origin} x and y positioning
             * @private
             */
            _resolveFloatingOrigin : function() {
                var origin = this._resolveFloatingLayerComputedProp.apply(this, arguments),
                    origin = this._transformFloatingOrigin(origin);

                return origin;
            },
            /**
             * Transform string origin into object representation (x,y)
             * @param  {String} origin
             * @return {Origin}
             * @private
             */
            _transformFloatingOrigin : function(origin) {
                return (typeof origin === 'string') ?
                    FloatingLayerBehavior.ORIGIN[origin.split('-').join('_').toUpperCase()] : origin;
            },
            /**
             * Bind floating layer behavior to this component
             *
             * @param  {Object}        opts                    floating layer binding options
             * @param  {Boolean}       opts.floatingConnector  enable connector element
             * @param  {String}        opts.floatingDirection  setup positiong based on direction
             * @param  {HTMLElement}   opts.floatingElement    floating block element
             * @param  {Number}        opts.floatingOffset     pixels offset between the floating block and trigger
             * @param  {Origin}        opts.floatingOrigin     floating origin, see FloatingLayerBehavior.ORIGIN
             * @param  {HTMLElement}   opts.floatingPositioner positioner element
             * @param  {Boolean}       opts.floatingSmart      setup smart positioning
             * @param  {HTMLElement}   opts.triggerElement     trigger element
             * @param  {String}        opts.triggerEvent       trigger event, see FloatingLayerBehavior.EVENT
             * @param  {Origin}        opts.triggerOrigin      trigger origin, see FloatingLayerBehavior.ORIGIN
             *
             * @return {FloatingLayer}
             *
             * @public
             */
            bindFloatingLayerBehavior : function(opts) {
                // Instantiate behavior
                var floatingElement = opts.floatingElement || this.composeVueRef(opts.floatingElementReferenceKey),
                    floatingElements = {
                        element : floatingElement,
                        positioner : opts.floatingPositioner || floatingElement
                    },
                    behavior = FloatingLayerBehavior.bind(
                        this,
                        FLOATING_LAYER.STATE,
                        FLOATING_LAYER.CLASSES,
                        opts.triggerElement,
                        floatingElements
                    );

                // This are options that can be resolved via props, computed, opts or default
                // @see _resolveFloatingLayerComputedProp
                var tEvent = this._resolveFloatingLayerComputedProp('triggerEvent', opts),
                    tOrigin = this._resolveFloatingOrigin('triggerOrigin', opts),
                    fOrigin = this._resolveFloatingOrigin('floatingOrigin', opts),
                    connector = this._resolveFloatingLayerComputedProp('floatingConnector', opts),
                    direction = this._resolveFloatingLayerComputedProp('floatingDirection', opts),
                    offset = this._resolveFloatingLayerComputedProp('floatingOffset', opts),
                    smart = this._resolveFloatingLayerComputedProp('floatingSmart', opts);

                // Always set trigger event, origin and offset (basic setup)
                behavior.triggerOn(tEvent)
                        .setTriggerOrigin(tOrigin)
                        .setOffset(offset)
                        .toggleConnector(connector);

                // Resolve manual alignment
                if (fOrigin) {
                    behavior.setBlockOrigin(fOrigin);
                } else if (direction) {
                    behavior.setDirection(direction);
                } else if (smart) {
                    behavior.setSmart(true);
                }

                // Notify setup is completed
                // This will also recheck active state (computed state) and handle initial visibility
                behavior.resolve();

                // Store floating layer behavior
                // Keep it private to avoid direct access and use getFloatingBehavior instead
                this._floatingLayerBehavior = behavior;

                return behavior;
            },
            /**
             * Unbind the floating layer behavior from the component
             *
             * @public
             */
            unbindFloatingLayerBehavior : function() {
                if (this.isFloatingBehaviorBound()) {
                    this._floatingLayerBehavior.unbind();
                    this._floatingLayerBehavior = null;
                }
            },
            /**
             * Getter of the floating layer behavior
             *
             * @return {FloatingLayer}
             *
             * @public
             */
            getFloatingBehavior : function() {
                return this._floatingLayerBehavior;
            },
            /**
             * Check if floating behavior was bound
             *
             * @return {Boolean}
             *
             * @public
             */
            isFloatingBehaviorBound : function() {
                return !!this._floatingLayerBehavior;
            }
        }
    };

    return FloatingLayerMixin;
});
