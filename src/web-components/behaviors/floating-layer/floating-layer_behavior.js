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
 * @file Floating layer behavior binder
 * @requires web-components/behaviors/floating-layer/floating-layer_connector
 * @requires web-components/behaviors/floating-layer/floating-layer_hooks
 * @requires web-components/directives/gestures/gestures_directive-handler
 * @requires web-components/helper/vue-helper
 * @requires web-components/helper/vue-refs-helper
 * @requires web-components/utils/dom
 * @requires web-components/behaviors/floating-layer/floating-layer_styles.css
 * @module web-components/behaviors/floating-layer/floating-layer_behavior
 */
define([
    'web-components/behaviors/floating-layer/floating-layer_connector',
    'web-components/behaviors/floating-layer/floating-layer_hooks',
    'web-components/directives/gestures/gestures_directive-handler',
    'web-components/helper/vue-helper',
    'web-components/helper/vue-refs-helper',
    'web-components/utils/dom',
    'css-loader!web-components/behaviors/floating-layer/floating-layer_styles'
], function(
    FloatingLayerConnector,
    FloatingLayerHooks,
    GestureDirectiveHandler,
    VueHelper,
    VueRefsHelper,
    DOMUtil
) {

    /**
     * @typedef  {Object}      Dimension
     * @property {HTMLElement} element             element to reference for dimensions
     * @property {HTMLElement} parent              parent relative element
     * @property {Number}      height              element height
     * @property {Number}      left                current element relative left position
     * @property {Number}      top                 current element relative top position
     * @property {Number}      width               element width
     * @property {Number}      scrollLeft          current scroll left
     * @property {Number}      scrollTop           current scroll top
     * @property {Number}      viewportLeft        element viewport left
     * @property {Number}      viewportTop         element viewport top
     * @property {Number}      parentViewportLeft  parent viewport left
     * @property {Number}      parentViewportTop   parent viewport top
     */

    /**
     * @typedef  {Object}    Dimensions
     * @property {Dimension} trigger    trigger dimensions
     * @property {Dimension} floating   floating dimensions
     * @property {Number}    offset     provided by options (default: 0)
     */

    /**
     * @typedef  {Object}  Origin
     * @property {Number}  adjust_x floating block x-axis adjustment
     * @property {Number}  adjust_y floating block y-axix adjustment
     * @property {String}  x        floating block x-axis origin
     * @property {String}  y        floating block y-axis origin
     */

    /**
     * @typedef  {Object}     AxisResult
     * @property {Number}     calculatedPosition  best alignment result for given axis
     * @property {Dimensions} dimensions          dimensions used for calculations
     * @property {Origin}     resultOrigin        best alignment origin data
     */

    /**
     * Origin constants
     *
     * Based on trigger and floating block dom elements dimensions
     *
     *                       [x-axis]
     *
     *                left   center  right
     *              top x      x      x
     *                    -----------
     * [y-axis]  middle x |         | x
     *                    -----------
     *           bottom x      x      x
     *
     * Note: middle-center not supported
     */

    /**
     * X-Axis origins
     * @type {Object}
     */
    var X_ORIGIN = {
        LEFT : 'left',
        CENTER : 'center',
        RIGHT : 'right'
    };

    /**
     * Y-Axis origins
     * @type {Object}
     */
    var Y_ORIGIN = {
        TOP : 'top',
        MIDDLE : 'middle',
        BOTTOM : 'bottom'
    };

    /**
     * Origin combinations (y,x)
     * @type {Object}
     */
    var ORIGIN = {
        TOP_LEFT : {
            x : X_ORIGIN.LEFT,
            y : Y_ORIGIN.TOP
        },
        TOP_CENTER : {
            x : X_ORIGIN.CENTER,
            y : Y_ORIGIN.TOP
        },
        TOP_RIGHT : {
            x : X_ORIGIN.RIGHT,
            y : Y_ORIGIN.TOP
        },
        MIDDLE_LEFT : {
            x : X_ORIGIN.LEFT,
            y : Y_ORIGIN.MIDDLE
        },
        MIDDLE_CENTER : {
            x : X_ORIGIN.CENTER,
            y : Y_ORIGIN.MIDDLE
        },
        MIDDLE_RIGHT : {
            x : X_ORIGIN.RIGHT,
            y : Y_ORIGIN.MIDDLE
        },
        BOTTOM_LEFT : {
            x : X_ORIGIN.LEFT,
            y : Y_ORIGIN.BOTTOM
        },
        BOTTOM_CENTER : {
            x : X_ORIGIN.CENTER,
            y : Y_ORIGIN.BOTTOM
        },
        BOTTOM_RIGHT : {
            x : X_ORIGIN.RIGHT,
            y : Y_ORIGIN.BOTTOM
        }
    };

    /**
     * Opening animation direction
     *
     *                      [x-axis]
     *
     *             up-left~   UP    ~up-right
     *                      \  |  /
     *                       \ | /
     *  [y-axis]     LEFT <--- x --> RIGHT
     *                       / | \
     *                      /  |  \
     *           down-left~  DOWN   ~down-right
     *
     * @todo add animation support
     * @type {Object}
     */
    var DIRECTION = {
        UP : 'up',
        RIGHT : 'right',
        DOWN : 'down',
        LEFT : 'left'
    };

    /**
     * Supported main trigger events
     * @type {Object}
     */
    var EVENT = {
        CLICK : 'click',
        HOVER : 'hover',
        LONGTAP : 'longtap',
        NONE : 'none'
    };

    /**
     * Classes
     * @type {String}
     */
    var FLOATING_BLOCK_CLASS = 'is-floatingBlock',
        FLOATING_BLOCK_OPENED_CLASS = 'is-floatingBlock--opened';

    /**
     * Pixels adjustment on origin and position for connector display
     * @todo move adjustment to options
     * @type {Number}
     */
    var CORNER_ADJUSTMENT = 20;

    /**
     * Pixels adjustments to avoid the floating element being to near of the viewport border
     * @todo move adjustment to options
     * @type {Number}
     */
    var VIEWPORT_MARGIN = 5;

    /**
     * Checks if an element fits inside a viewport axis considering the provided dimensions
     * @param  {Number} calculatedPosition posible position for the axis relative to its parent
     * @param  {Number} floatingDim        width (x) or height (y)
     * @param  {Number} parentViewportDim  parent element viewport position
     * @param  {Number} viewportDim        viewport width (x) or height (y)
     * @return {Boolean}
     * @public
     */
    var fitsInsideViewportAxis = function(calculatedPosition, floatingDim, parentViewportDim, viewportDim) {
        // matcher calculates relative to element.offsetParent (not necessarily document or viewport)
        // then the parent viewport position is added to adjust measure relative to the viewport
        var viewportPosition = parentViewportDim + calculatedPosition;

        // Compare to viewport position
        // must not be negative and at least VIEWPORT_MARGIN apart
        // must be positive, not exceed viewport dimension and VIEWPORT_MARGIN aways from the border
        return (viewportPosition >= VIEWPORT_MARGIN && (viewportPosition + floatingDim + VIEWPORT_MARGIN) <= viewportDim);
    };

    /**
     * Floating layer behavior handler (constructor)
     *
     * @param {VueComponent} component        binded component
     * @param {String}       computedStateKey binded component computed property state key
     * @param {HTMLElement}  triggerElement   element that opens the floating block
     * @param {HTMLElement}  floatingElement  floating block element
     */
    var FloatingLayer = function(
        component,
        computedStateKey,
        computedClassesKey,
        triggerElement,
        floatingElement
    ) {
        // Store related component
        this.component = component;

        // Define trigger options: element and origin
        this._defineTriggerProperties(triggerElement);

        // Define floating options: element, positioner and origin
        this._defineFloatingProperties(floatingElement);

        // Define behavior options
        this._defineOptions();

        // Setup
        this._setup();
        this._linkState(computedStateKey);
        this._linkClasses(computedClassesKey);
    };

    FloatingLayer.prototype = {
        /**
         * Define trigger properties : element and origin
         * @param  {HTMLElement} triggerElement
         */
        _defineTriggerProperties : function(triggerElement) {
            // Trigger options
            this.trigger = {
                /**
                 * DOM element of the trigger block (ie. button, link)
                 * @type {HTMLElement}
                 */
                element : triggerElement,
                /**
                 * Position setup for the trigger block.
                 * @see FloatingLayerBehavior.ORIGIN
                 * @type {Origin}
                 */
                origin : null
            };
        },
        /**
         * Define floating properties : floating element, floating positioner and origin,
         * @param  {HTMLElement|VueReference} floatingElement
         */
        _defineFloatingProperties : function(floatingElement) {

            this.floating = {
                /**
                 * Position setup for the floating layer
                 * @see FloatingLayerBehavior.ORIGIN
                 * @type {Origin?}
                 */
                origin : null
            };

            /**
             * DOM element which is the body block of the floating layer
             * @note must have block height and width
             * @type {HTMLElement}
             */
            VueHelper.defineComputed(this.floating, 'element', {
                get : function() {
                    return floatingElement.positioner ? floatingElement.element : floatingElement;
                }
            });

            /**
             * DOM element to reference for top-left position.
             * @note may not have height or width
             * @type {HTMLElement}
             */
            VueHelper.defineComputed(this.floating, 'positioner', {
                get : function() {
                    return floatingElement.positioner ? floatingElement.positioner : floatingElement;
                }
            });
        },
        /**
         * Define options and computed options (reactive pattern)
         * Options are changed via setters
         */
        _defineOptions : function() {

            this.options = {
                /**
                 * Include a connector element at matched element
                 * @type {Boolean}
                 */
                connector : false,
                /**
                 * Main trigger event to listen
                 * Default: FloatingLayerBehavior.EVENT.NONE
                 * @type {FloatingLayerBehavior.EVENT}
                 */
                event : EVENT.NONE,
                /**
                 * Spacing floating block outside the trigger area
                 * @todo pending support for mobile-desktop
                 * @type {Number}
                 */
                offset : 0
            };

            /**
             * Opening direction which determines floating block origin
             * @type {String?}
             */
            var _direction = null;
            VueHelper.defineComputed(this.options, 'direction', {
                get : function() {
                    return _direction;
                },
                set : function(newValue) {
                    // @todo add DIRECTION validator
                    _direction = newValue;
                    this.connector.setDirection(newValue);
                    // Update smart and origin only when direction is not null
                    if (newValue !== null) {
                        this.options.smart = false;
                        this.floating.origin = null;
                    }
                }.bind(this)
            });

            /**
             * Smart positioning which tries to figure out the best floating block origin for a given trigger origin
             * @type {Boolean}
             */
            var _smart = null;
            VueHelper.defineComputed(this.options, 'smart', {
                get : function() {
                    return _smart;
                },
                set : function(newValue) {
                    _smart = !!newValue;
                    // Update direction and origin only when smart is true
                    if (_smart === true) {
                        this.options.direction = null;
                        this.floating.origin = null;
                    }
                }.bind(this)
            });
        },
        /**
         * Initial floating layer setup
         * @private
         */
        _setup : function() {
            // Initialize connector
            this._initializeConnector();

            // Initialize hooks
            this._initializeHooks();

            // Setup initial classes
            this._updateClasses();

            // Bind listeners
            this._addListeners();
        },
        /**
         * Setup link between component state and floating layer state (visibility)
         * @param  {String} computedStateKey binded component computed property state key
         * @private
         */
        _linkState : function(computedStateKey) {
            // Connect floating layer visibility state to the component state
            // through a computed property to keep reactivity working ($watch)
            // Defines this.state
            VueHelper.bypassComputed(this.component, computedStateKey, this, 'state');
            this._bindComputedWatcher();
        },
        /**
         * Bind a data state to handle dom classes on rendering and active state changes
         * @param  {String} computedClassesKey
         */
        _linkClasses : function(computedClassesKey) {
            VueHelper.bypassComputed(this.component, computedClassesKey, this, 'classes');
            this._updateClasses();
        },
        /**
         * Resolve floating element as DOM node
         * @return {HTMLElement}
         */
        _getFloatingElement : function() {
            return VueRefsHelper.resolveVueRef(this.floating.element);
        },
        /**
         * Resolve positioner element as DOM node
         * @return {HTMLElement}
         */
        _getPositionerElement : function() {
            return VueRefsHelper.resolveVueRef(this.floating.positioner);
        },
        /**
         * Initialize connector handler
         * @private
         */
        _initializeConnector : function() {
            // Visiblity is handle by add and remove methods
            // Bypass floating element directly for binding definition to connector
            this.connector = new FloatingLayerConnector(this.floating.element)
                .toggle(this.options.connector);
        },
        /**
         * Initialize hooks handler
         * @private
         */
        _initializeHooks : function() {
            this._hooks = new FloatingLayerHooks();
        },
        /**
         * Add event listeners
         * @private
         */
        _addListeners : function() {
            // Main toggle event
            this._bindTriggerToggleListener();
        },
        /**
         * Remove event listeners
         * @private
         */
        _removeListeners : function() {
            this._unbindTriggerToggleListener();
        },
        /**
         * Attach toggle to computed property (reactivity)
         * @private
         */
        _bindComputedWatcher : function() {
            // Remove any previously attached computed watcher
            this._unbindComputedWatcher();

            // Attach toggle to computed property (reactivity)
            var $unwatch = null;
            if (typeof this.state !== 'undefined' && this.component.$watch) {
                // Bind reactive computed property to the floating layer state
                // DO NOT add 'immediate' or call _resolveComputed yet.
                // Origins might not be set yet, so call 'resolve' method when the behavior setup is completed
                $unwatch = this.component.$watch(this._wrapComputed.bind(this), this._resolveComputed.bind(this));
            }

            // Store unwatch callback
            this.$unwatch = $unwatch;
        },
        /**
         * Dettach computed property watcher
         * @private
         */
        _unbindComputedWatcher : function() {
            if (this.$unwatch) {
                this.$unwatch();
            }
        },
        /**
         * Bind an observer for detecting DOM changes
         * Mostly used to handle width or height updates when opened
         * @see http://caniuse.com/#feat=mutationobserver
         * @see https://davidwalsh.name/mutationobserver-api
         * @private
         */
        _bindObserver : function() {
            // If element is not in DOM, then avoid creating an observer
            var element = this._getFloatingElement();
            if (element) {
                // Observer DOM changes (width, height) mainly due to children updates
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                this._mutationObserver = new MutationObserver(this.reposition.bind(this));
                this._mutationObserver.observe(element, {
                    childList : true,
                    subtree : true
                });
            }
        },
        /**
         * Unbind the DOM changes observer
         * @private
         */
        _unbindObserver : function() {
            if (this._mutationObserver) {
                this._mutationObserver.disconnect();
                this._mutationObserver = null;
            }
        },
        /**
         * Bind trigger toggle listener
         * @see FloatingLayerBehavior.EVENT
         * @private
         */
        _bindTriggerToggleListener : function() {
            var element = this.trigger.element,
                $listeners = [],
                close = this.close.bind(this, false),
                open = this.open.bind(this, false),
                toggle = this.toggle.bind(this, false);

            switch (this.options.event) {
                case EVENT.CLICK:
                    $listeners.push({ event : 'click', listener : toggle, gesture : false });
                    break;
                case EVENT.HOVER:
                    $listeners.push({ event : 'focus', listener : open, gesture : false });
                    $listeners.push({ event : 'mouseenter', listener : open, gesture : false });
                    $listeners.push({ event : 'blur', listener : close, gesture : false });
                    $listeners.push({ event : 'mouseleave', listener : close, gesture : false });
                    break;
                case EVENT.LONGTAP:
                    $listeners.push({ event : 'longtap', listener : function() {
                        open();
                        setTimeout(function() {
                            close();
                        }, 1500);
                    }, gesture : true });
                    break;
                case EVENT.NONE:
                    break;
                default:
                    throw new Error('FloatingLayer : unsupported event', this.options.event);
            }

            for (var l in $listeners) {
                var definition = $listeners[l];

                if (definition.gesture) {
                    GestureDirectiveHandler.bind(element, {
                        arg : definition.event,
                        value : definition.listener
                    });
                } else {
                    element.addEventListener(definition.event, definition.listener);
                }
            }

            this.$listeners = $listeners;
        },
        /**
         * Unbind trigger toggle listener
         * @see FloatingLayerBehavior.EVENT
         * @private
         */
        _unbindTriggerToggleListener : function() {
            if (this.$listeners && this.$listeners.length > 0) {
                var element = this.trigger.element,
                    unbindGestures = false;

                for (var l in this.$listeners) {
                    var definition = this.$listeners[l];
                    if (definition.gesture) {
                        unbindGestures = true;
                        break;
                    } else {
                        element.removeEventListener(definition.event, definition.listener);
                    }
                }

                // Gesture are unbind once
                if (unbindGestures) {
                    GestureDirectiveHandler.unbind(element);
                }

                this.$listeners = [];
            }
        },
        /**
         * Compose an axis result object
         * @param  {Number}     calculatedPosition best alignment result for given axis
         * @param  {Dimensions} dimensions         dimensions used for calculations
         * @param  {Origin}     resultOrigin       best alignment origin data
         * @return {AxisResult}
         */
        _composeAxisResult : function(calculatedPosition, dimensions, resultOrigin) {
            return {
                calculatedPosition : calculatedPosition,
                dimensions : dimensions,
                resultOrigin : resultOrigin
            };
        },
        /**
         * Compose relative offsets for an element
         * This helps calculate the position from a position:relative perspective
         * @param {HTMLElement?} element can be NULL when element is not in DOM due to v-if
         * @return {Dimensions}
         * @private
         *
         * @bug relative positioning inside table is undefined
         *      https://www.w3.org/TR/CSS21/visuren.html#propdef-position
         */
        _getOffsetDimensions : function(element) {
            // Positioning from top-left combination
            // bottom or right are not calculated
            var viewportDim = this._getViewportDim(element),
                // Parent may be null on document. Validation required for tests
                parentViewportDim = this._getViewportDim(element && element.offsetParent);

            return {
                element : element,
                parent : element ? element.offsetParent : null, // useful to identify parent
                height : element ? element.offsetHeight : 0, // do not use element.clientHeight
                left : element ? element.offsetLeft : 0,
                top : element ? element.offsetTop : 0,
                width : element ? element.offsetWidth : 0,
                scrollLeft : DOMUtil.getDocumentOffsetLeft(element),
                scrollTop : DOMUtil.getDocumentOffsetTop(element),
                viewportLeft : viewportDim.left,
                viewportTop : viewportDim.top,
                parentViewportLeft : parentViewportDim.left,
                parentViewportTop : parentViewportDim.top
            };
        },
        /**
         * Get DOM node position (top and left) measures relative to its parent
         * @param  {HTMLElement} element
         * @return {Object}      left and top measures
         */
        _getViewportDim : function(element) {
            return element && element.getBoundingClientRect ? element.getBoundingClientRect() : { left : 0, top : 0 };
        },
        /**
         * Compose trigger and floating block dimensions and positions
         * required by "matchers" for positioning calculation
         * @return {Dimensions}
         * @private
         */
        _getDimensions : function() {
            return {
                trigger : this._getOffsetDimensions(this.trigger.element),
                floating : this._getOffsetDimensions(this._getFloatingElement()),
                offset : this.options.offset || 0
            };
        },
        /**
         * Determine the best axis origin trying each option and looking for
         * inside-viewport status. This method is only used on direction calculations
         *
         * @param   {String[]}  trySequence        origin options to test in order
         * @param   {Function}  adjust             calculate each option adjustments
         * @param   {Function}  matcher            calculate positions for each option
         * @param   {Integer}   floatingDim        width (x) or height (y)
         * @param   {Integer}   parentViewportDim  parent element viewport position
         * @param   {Integer}   viewportDim        viewport width (x) or height (y)
         * @return  {String}                       best alignment from the provided axis options
         *
         * @private
         */
        _resolveFloatingBlockAxisOrigin : function(
            trySequence,
            adjust,
            matcher,
            floatingDim,
            parentViewportDim,
            viewportDim
        ) {
            // First alignment is the default
            // If no better align is found, then return the default
            var goodAlign = trySequence[0];

            // Try to find a better alignment
            for (var i in trySequence) {
                var tryAlign = trySequence[i];
                if (fitsInsideViewportAxis(matcher(tryAlign, adjust(tryAlign)), floatingDim, parentViewportDim, viewportDim)) {
                    // We found the best alignment
                    goodAlign = tryAlign;
                    break;
                }
            }

            return goodAlign;
        },
        /**
         * Determine the best X-axis origin
         * @see this._resolveFloatingBlockAxisOrigin
         * @param  {Dimensions} dimensions floating block dimensions
         * @return {String} best alignment for x-axis
         * @private
         */
        _resolveFloatingBlockXOrigin : function(dimensions) {
            return this._resolveFloatingBlockAxisOrigin(
                [X_ORIGIN.CENTER, X_ORIGIN.LEFT, X_ORIGIN.RIGHT],
                this._adjustXOrigin.bind(this),
                this._getMatchXFor.bind(this, dimensions),
                dimensions.floating.width,
                dimensions.trigger.parentViewportLeft,
                window.innerWidth // viewport width
            );
        },
        /**
         * Determine the best Y-axis origin
         * @see this._resolveFloatingBlockAxisOrigin
         * @param  {Dimensions} dimensions floating block dimensions
         * @return {String} best alignment for y-axis
         * @private
         */
        _resolveFloatingBlockYOrigin : function(dimensions) {
            return this._resolveFloatingBlockAxisOrigin(
                [Y_ORIGIN.MIDDLE, Y_ORIGIN.TOP, Y_ORIGIN.BOTTOM],
                this._adjustYOrigin.bind(this),
                this._getMatchYFor.bind(this, dimensions),
                dimensions.floating.height,
                dimensions.trigger.parentViewportTop,
                window.innerHeight // viewport height
            );
        },
        /**
         * Determine the best origin combination for the floating block
         * @param  {Dimensions} dimensions floating block dimensions
         * @return {Origin} optimized {x,y} combination
         * @private
         */
        _resolveFloatingBlockOrigin : function(dimensions) {
            var origin = { x : null, y : null };

            if (this.floating.origin) {
                // Do not assign the object to avoid memory references and changes
                origin = { x : this.floating.origin.x, y : this.floating.origin.y };
            } else if (this.options.direction) {
                origin = this._resolveFloatingBlockOriginByDirection(dimensions);
            } else if (this.options.smart) {
                origin = this._resolveFloatingBlockSmartOrigin(dimensions);
            }

            // Detect corners for matching adjustments
            origin.adjust_x = this._adjustXOrigin(origin.x);
            origin.adjust_y = this._adjustYOrigin(origin.y);

            return origin;
        },
        /**
         * Determine the best origin combination for the floating block on direction option setup
         * @param  {Dimensions} dimensions floating block dimensions
         * @return {Origin} optimized {x,y} combination
         * @private
         */
        _resolveFloatingBlockOriginByDirection : function(dimensions) {
            var x, y;

            // Do NOT store floating block origin, always recalculate when direction option is provided
            // this.floating.origin = origin;
            switch (this.options.direction) {
                case DIRECTION.UP:
                    y = Y_ORIGIN.BOTTOM;
                    x = this._resolveFloatingBlockXOrigin(dimensions);
                    break;
                case DIRECTION.RIGHT:
                    y = this._resolveFloatingBlockYOrigin(dimensions);
                    x = X_ORIGIN.LEFT;
                    break;
                case DIRECTION.DOWN:
                    y = Y_ORIGIN.TOP;
                    x = this._resolveFloatingBlockXOrigin(dimensions);
                    break;
                case DIRECTION.LEFT:
                    y = this._resolveFloatingBlockYOrigin(dimensions);
                    x = X_ORIGIN.RIGHT;
                    break;
                default:
                    throw new Error('FloatingLayer : unsupported direction', this.options.direction);
            }

            return { x : x, y : y };
        },
        /**
         * Determine the best origin combination for the floating block when smart positioning option is enabled
         * @param  {Dimensions} dimensions floating block dimensions
         * @return {Origin} optimized {x,y} combination
         * @private
         */
        _resolveFloatingBlockSmartOrigin : function(dimensions) {
            var x = this._resolveFloatingBlockXOrigin(dimensions),
                y = this._resolveFloatingBlockYOrigin(dimensions);

            return { x : x, y : y };
        },
        /**
         * Determine origin adjustment when option.direction is provided
         * @param  {String}  axis         axis option name
         * @param  {String}  axisCenter   axis center option name
         * @param  {String}  axisPositive axis positive (add-adjustment) option name
         * @param  {String}  axisDirA     axis extremes option A
         * @param  {String}  axisDirB     axis extremes option B
         * @return {Integer}              corner adjustment
         * @private
         */
        _adjustOrigin : function(axis, axisCenter, axisPositive, axisDirA, axisDirB) {
            var dir = this.options.direction;
            return ((axis !== axisCenter && !!dir && (dir === axisDirA || dir === axisDirB)) ?
                     ((axis === axisPositive) ? CORNER_ADJUSTMENT : (-1 * CORNER_ADJUSTMENT)) : 0);
        },
        /**
         * Determine x-origin adjustment when option.direction is provided
         * @param  {String}  axis x-axis option name
         * @return {Integer}      x-origin corner adjustment
         * @private
         */
        _adjustXOrigin : function(axis) {
            return this._adjustOrigin(axis, X_ORIGIN.CENTER, X_ORIGIN.RIGHT, DIRECTION.DOWN, DIRECTION.UP);
        },
        /**
         * Determine y-origin adjustment when option.direction is provided
         * @param  {String}  axis y-axis option name
         * @return {Integer}      y-origin corner adjustment
         * @private
         */
        _adjustYOrigin : function(axis) {
            return this._adjustOrigin(axis, Y_ORIGIN.MIDDLE, Y_ORIGIN.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT);
        },
        /**
         * Calculate trigger and floating block matching X (horizontal) position
         * @param  {Dimensions}  dimensions blocks dimensions
         * @param  {String}      floatingX  x-axis option name
         * @param  {Integer}     adjustX    calculated x-axis adjustment
         * @return {Integer} x-axis left position absolute value
         * @private
         */
        _getMatchXFor : function(dimensions, floatingX, adjustX) {
            var triggerLeft = dimensions.trigger.left,
                triggerWidth = dimensions.trigger.width,
                triggerRight = triggerLeft + triggerWidth,
                floatingWidth = dimensions.floating.width,
                offset = dimensions.offset,
                triggerX = this.trigger.origin.x,
                left = 0;

            /**
             * Floating is outside at the LEFT of the trigger
             * - Applies offset
             */
            if (triggerX === X_ORIGIN.LEFT && floatingX === X_ORIGIN.RIGHT) {
                left = triggerLeft + (-1 * floatingWidth) - offset; // -100%
            /**
             * Floating is over and horizontally centered on the trigger LEFT
             * - DO NOT applies offset (in which direction left or right?)
             */
            } else if (triggerX === X_ORIGIN.LEFT && floatingX === X_ORIGIN.CENTER) {
                left = triggerLeft + (-1 * (floatingWidth / 2)); // centered at -50% of floating
            } else if (triggerX === X_ORIGIN.CENTER && floatingX === X_ORIGIN.RIGHT) {
                left = triggerLeft + (triggerWidth / 2) - floatingWidth;
            /**
             * Floating is over and MATCHES horizontal position
             * - Both aligned at left, cente or right
             * - Keep in mind floating could be bigger than trigger block or vice versa
             * - DO NOT applies offset (in which direction left or right?)
             */
            } else if (triggerX === floatingX) {
                switch (triggerX) {
                    case X_ORIGIN.LEFT:
                        left = triggerLeft; // 0
                        break;
                    case X_ORIGIN.CENTER:
                        left = triggerLeft + (triggerWidth / 2) - (floatingWidth / 2);
                        break;
                    case X_ORIGIN.RIGHT:
                        left = triggerRight - floatingWidth; // 0
                        break;
                }
            /**
             * Floating is over and horizontally centered on the trigger RIGHT
             * - DO NOT applies offset (in which direction left or right?)
             */
            } else if (triggerX === X_ORIGIN.CENTER && floatingX === X_ORIGIN.LEFT) {
                left = triggerLeft + (triggerWidth / 2); // centered at 50% of trigger
            } else if (triggerX === X_ORIGIN.RIGHT && floatingX === X_ORIGIN.CENTER) {
                left = triggerLeft + triggerWidth - (floatingWidth / 2);
            /**
             * Floating is outside at the RIGHT of the trigger
             * - Applies offset
             */
            } else if (triggerX === X_ORIGIN.RIGHT && floatingX === X_ORIGIN.LEFT) {
                left = triggerRight + offset; // 100%
            }

            // Apply corner adjustment
            left = left + adjustX;

            return left;
        },
        /**
         * Match trigger and floating block requested X (horizontal) position
         * @param   {Dimensions} dimensions     floating block dimensions
         * @param   {Origin}     floatingOrigin optimized floating block origin
         * @private
         */
        _matchXAlignment : function(dimensions, floatingOrigin) {
            var left = this._getMatchXFor(dimensions, floatingOrigin.x, floatingOrigin.adjust_x),
                axisResult = this._composeAxisResult(left, dimensions, floatingOrigin);

            // Adjust left through a hook
            left = this._hooks.afterHorizontalPositionCalculated(axisResult);

            // Set 'left' style of the floating block
            var positioner = this._getPositionerElement();
            if (positioner) {
                positioner.style.left = left + 'px';
            }
        },
        /**
         * Calculate trigger and floating block matching Y (vertical) position
         * @param  {Dimensions} dimensions floating block dimensions
         * @param  {String}     floatingY  y-axis option name
         * @param  {Integer}    adjustY    calculated y-axis adjustment
         * @return {Integer}               y-axis left position absolute value
         * @private
         */
        _getMatchYFor : function(dimensions, floatingY, adjustY) {
            var triggerTop = dimensions.trigger.top,
                triggerHeight = dimensions.trigger.height,
                triggerBottom = triggerTop + triggerHeight,
                floatingHeight = dimensions.floating.height,
                offset = dimensions.offset,
                triggerY = this.trigger.origin.y,
                top = 0;

            /**
             * Floating is outside ABOVE the trigger
             * - Applies offset
             */
            if (triggerY === Y_ORIGIN.TOP && floatingY === Y_ORIGIN.BOTTOM) {
                top = triggerTop + (-1 * floatingHeight) - offset; // -100%
            /**
             * Floating is over and vertically centered on the trigger TOP
             * - DO NOT applies offset (in which direction up or down?)
             */
            } else if (triggerY === Y_ORIGIN.TOP && floatingY === Y_ORIGIN.MIDDLE) {
                top = triggerTop + (-1 * (floatingHeight / 2)); // centered at -50% of floating
            } else if (triggerY === Y_ORIGIN.MIDDLE && floatingY === Y_ORIGIN.BOTTOM) {
                top = triggerTop + (triggerHeight / 2) - floatingHeight;
            /**
             * Floating is over and MATCHES vertical position
             * - Both aligned at top, middle or bottom
             * - Keep in mind floating could be bigger than trigger block or vice versa
             * - DO NOT applies offset (in which direction up or down?)
             */
            } else if (triggerY === floatingY) {
                switch (triggerY) {
                    case Y_ORIGIN.TOP:
                        top = triggerTop; // 0
                        break;
                    case Y_ORIGIN.MIDDLE:
                        top = triggerTop + (triggerHeight / 2) - (floatingHeight / 2);
                        break;
                    case Y_ORIGIN.BOTTOM:
                        top = triggerBottom - floatingHeight; // 0
                        break;
                }
            /**
             * Floating is over and vertically centered on the trigger BOTTOM
             * - DO NOT applies offset (in which direction up or down?)
             */
            } else if (triggerY === Y_ORIGIN.MIDDLE && floatingY === Y_ORIGIN.TOP) {
                top = triggerTop + (triggerHeight / 2); // centered at 50% of trigger
            } else if (triggerY === Y_ORIGIN.BOTTOM && floatingY === Y_ORIGIN.MIDDLE) {
                top = triggerTop + triggerHeight - (floatingHeight / 2);
            /**
             * Floating is outside UNDER the trigger
             * - Applies offset
             */
            } else if (triggerY === Y_ORIGIN.BOTTOM && floatingY === Y_ORIGIN.TOP) {
                top = triggerBottom + offset; // 100%
            }

            // Apply corner adjustment
            top = top + adjustY;

            return top;
        },
        /**
         * Match trigger and floating block requested Y (vertical) position
         * @param   {Dimensions} dimensions     floating block dimensions
         * @param   {Origin}     floatingOrigin optimized floating block origin
         * @private
         */
        _matchYAlignment : function(dimensions, floatingOrigin) {
            var top = this._getMatchYFor(dimensions, floatingOrigin.y, floatingOrigin.adjust_y),
                axisResult = this._composeAxisResult(top, dimensions, floatingOrigin);

            // Adjust top through a hook
            top = this._hooks.afterVerticalPositionCalculated(axisResult);

            // Set 'top' style of the floating block
            var positioner = this._getPositionerElement();
            if (positioner) {
                positioner.style.top = top + 'px';
            }
        },
        /**
         * Match connector block X-Y position based on the optimized floating block origin
         * @param  {Dimensions} dimensions     floating block dimensions
         * @param  {Origin}     floatingOrigin optimized floating block origin
         * @private
         */
        _matchConnector : function(dimensions, floatingOrigin) {
            if (this.options.connector) {
                var height = dimensions.floating.height,
                    width = dimensions.floating.width,
                    left, top;

                // Set connector at matching position
                switch (floatingOrigin.x) {
                    case X_ORIGIN.LEFT:
                        left = 0;
                        break;
                    case X_ORIGIN.CENTER:
                        left = width / 2;
                        break;
                    case X_ORIGIN.RIGHT:
                        left = width;
                        break;
                }

                left = left + (-1 * floatingOrigin.adjust_x);

                switch (floatingOrigin.y) {
                    case Y_ORIGIN.TOP:
                        top = 0;
                        break;
                    case Y_ORIGIN.MIDDLE:
                        top = height / 2;
                        break;
                    case Y_ORIGIN.BOTTOM:
                        top = height;
                        break;
                }

                top = top + (-1 * floatingOrigin.adjust_y);

                this.connector.match(left, top, floatingOrigin);
            }
        },
        /**
         * Renders connector based on current option state
         * On display, if the connector is not in DOM, one will be created
         * On hide, if the connector is attached to DOM, it will be removed
         * @private
         */
        _renderConnector : function() {
            this.connector.toggle(this.options.connector);
        },
        /**
         * Position floating block based on trigger position
         * @private
         */
        _positionFloatingBlock : function() {
            var dimensions = this._getDimensions(),
                floatingOrigin = this._resolveFloatingBlockOrigin(dimensions);
            this._matchXAlignment(dimensions, floatingOrigin);
            this._matchYAlignment(dimensions, floatingOrigin);
            this._matchConnector(dimensions, floatingOrigin);
        },
        /**
         * Compute active state determine by the computed option
         * @param  {Boolean} isActive computed option get value
         * @private
         */
        _resolveComputed : function(isActive) {
            if (isActive) {
                this.open(true);
            } else {
                this.close(true);
            }
        },
        /**
         * Update bound classes in render cycles and specific states
         */
        _updateClasses : function() {
            // Create a new object for triggering render on assignment
            var classes = {};

            // Class binding as an object
            classes[FLOATING_BLOCK_CLASS] = true;
            classes[FLOATING_BLOCK_OPENED_CLASS] = this.state;

            // Change bound data state property
            this.classes = classes;
        },
        /**
         * Wrap computed option for $watch purposes
         * @return {Boolean} computed option get value
         * @private
         */
        _wrapComputed : function() {
            return this.state;
        },
        /**
         * Toggle between open or close floating block
         * @public
         */
        toggle : function() {
            var isActive = this.state;
            this.state = !isActive;
            // There is no need to resolve the state property because the watcher handles this. If any scenario
            // is found where the resolve is neccesary, keep it mind to avoid calling twice the reposition method
            // this._resolveComputed(this.state);
        },
        /**
         * Set hook callback handler
         * @param  {String}   hookName see FloatingLayerBehavior.HOOK
         * @param  {Function} callback
         * @public
         */
        onHook : function(hookName, callback) {
            return this._hooks.setHandler(hookName, callback);
        },
        /**
         * Shows floating block
         * @param {Boolean} setterResolved run without changing the computed property
         * @public
         */
        open : function(setterResolved) {
            this.reposition();

            if (!setterResolved) {
                this.state = true;
            }

            this._updateClasses();
            this._bindObserver();
        },
        /**
         * Hide floating block
         * @param {Boolean} setterResolved run without changing the computed property
         * @public
         */
        close : function(setterResolved) {
            this._unbindObserver();
            if (!setterResolved) {
                this.state = false;
            }
            this._updateClasses();
        },
        /**
         * Resolve current state visibility
         * - Force visibility after the behavior setup is completed
         * @return {FloatingLayer}
         * @public
         */
        resolve : function() {
            // nextTick is required to process active state changes on load
            this.component.$nextTick(this._resolveComputed.bind(this, this.state));
            return this;
        },
        /**
         * Reposition floating block
         * It does not change visibility (show or hidden)
         * @return {FloatingLayer}
         * @public
         */
        reposition : function() {
            this._renderConnector();
            this._positionFloatingBlock();
            return this;
        },
        /**
         * Replace main trigger event
         * @see FloatingLayerBehavior.EVENT
         * @param  {String} eventName supported event name
         * @return {FloatingLayer}
         * @public
         */
        triggerOn : function(eventName) {
            if (this.options.event !== eventName) {
                this._unbindTriggerToggleListener();
                this.options.event = eventName;
                this._bindTriggerToggleListener();
            }
            return this;
        },
        /**
         * Sets block origin
         * @param {Origin} origin
         * @return {FloatingLayer}
         * @public
         */
        setBlockOrigin : function(origin) {
            this.floating.origin = origin;
            if (origin !== null) {
                this.options.direction = null;
                this.options.smart = false;
            }
            return this;
        },
        /**
         * Sets opening direction
         * @param {String} direction
         * @return {FloatingLayer}
         * @public
         */
        setDirection : function(direction) {
            this.options.direction = direction;
            return this;
        },
        /**
         * Sets offset
         * @param {Integer} offset
         * @return {FloatingLayer}
         * @public
         */
        setOffset : function(offset) {
            this.options.offset = offset || 0;
            return this;
        },
        /**
         * Sets the smart positioning
         * @param {Boolean} smart
         * @return {FloatingLayer}
         * @public
         */
        setSmart : function(smart) {
            this.options.smart = smart;
            return this;
        },
        /**
         * Sets trigger origin
         * @param {Origin} origin
         * @return {FloatingLayer}
         * @public
         */
        setTriggerOrigin : function(origin) {
            this.trigger.origin = origin;
            return this;
        },
        /**
         * Toggles connector usage and visibility
         * @param  {Boolean} toggle
         * @return {FloatingLayer}
         * @public
         */
        toggleConnector : function(toggle) {
            this.options.connector = toggle;
            this._renderConnector();
            return this;
        },
        /**
         * Removes the event listeners and the CSS classes that were attached to the trigger element
         * @public
         */
        unbind : function() {
            // Remove listeners
            this._removeListeners();
            this._unbindComputedWatcher();

            // Reset classes
            this.classes = {};

            // Remove connector
            this.connector.remove();
        }
    };

    var FloatingLayerBehavior = {
        /**
         * Expose supported directions, events, hooks and origins definitions
         */
        DIRECTION : DIRECTION,
        EVENT : EVENT,
        HOOK : FloatingLayerHooks.HOOK,
        ORIGIN : ORIGIN,
        /**
         * Bind floating layer behavior to a component
         *
         * @param {VueComponent} component        binded component
         * @param {String}       computedStateKey binded component computed property state key
         * @param {HTMLElement}  triggerElement   element that opens the floating block
         * @param {HTMLElement}  floatingElement  floating block element
         *
         * @see FloatingLayer
         */
        bind : function(component, computedStateKey, computedClassesKey, triggerElement, floatingElement) {
            return new FloatingLayer(component, computedStateKey, computedClassesKey, triggerElement, floatingElement);
        },
        /**
         * Checks if an element fits inside a viewport axis considering the provided dimensions
         * @param  {Number} calculatedPosition posible position for the axis relative to its parent
         * @param  {Number} floatingDim        width (x) or height (y)
         * @param  {Number} parentViewportDim  parent element viewport position
         * @param  {Number} viewportDim        viewport width (x) or height (y)
         * @return {Boolean}
         * @public
         */
        fitsInsideViewportAxis : fitsInsideViewportAxis,
        /**
         * Unbind floating layer behavior from a component
         *
         * Avoid using unbind, it should only be used when any of the constructor arguments changes
         * Unbind its a bad practice if it could solved by setter+reposition methods
         *
         * @param  {FloatingLayer} floatingLayerBehavior
         */
        unbind : function(floatingLayerBehavior) {
            floatingLayerBehavior.unbind.call(floatingLayerBehavior);
        }
    };

    return FloatingLayerBehavior;
});
