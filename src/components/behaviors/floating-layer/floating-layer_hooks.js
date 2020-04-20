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
 * @file Floating layer hooks
 * @module web-components/behaviors/floating-layer/floating-layer_hooks
 */
define([], function() {

    /**
     * Floating layer hooks handler
     * CONSTRUCTOR
     */
    var FloatingLayerHooks = function() {
        this._handlers = {};
    };

    /**
     * Supported hooks
     * Expose hooks for behavior binding
     * @type {Object}
     */
    var HOOK = {
        AFTER_VERTICAL_POSITION_CALCULATED : 'after_vertical_position_calculated',
        AFTER_HORIZONTAL_POSITION_CALCULATED : 'after_horizontal_position_calculated'
    };
    FloatingLayerHooks.HOOK = HOOK;

    /**
     * INSTANCE METHODS
     */
    FloatingLayerHooks.prototype = {
        /**
         * Check if a handler was defined for a hook
         * @param  {String}  hookName see FloatingLayerHooks.HOOK
         * @return {Boolean}
         * @private
         */
        _isHandlerDefined : function(hookName) {
            return this._handlers.hasOwnProperty(hookName);
        },
        /**
         * Call the hook handler
         * @param  {String} hookName see FloatingLayerHooks.HOOK
         * @param  {Object} dara     handler data
         * @return handler result
         * @private
         */
        _runHandler : function(hookName, data) {
            // Do not modify handler context
            return this._handlers[hookName](data);
        },
        /**
         * Verify if there is any handler set for a hook and call it, or default to the original value
         * @param  {String} hookName      see FloatingLayerHooks.HOOK
         * @param  {Object} resolveValue  default value to return
         * @param  {Object} data          handler data
         * @return original value or the handler result
         * @private
         */
        _resolveHandler : function(hookName, resolveValue, data) {
            return this._isHandlerDefined(hookName) ? this._runHandler(hookName, data) : resolveValue;
        },
        /**
         * Define a hook handler
         * @param {String}   hookName see FloatingLayerHooks.HOOK
         * @param {Function} callback hook handler
         * @public
         */
        setHandler : function(hookName, callback) {
            this._handlers[hookName] = callback;
        },
        /**
         * MAIN HOOK HANDLER
         */
        /**
         * Apply horizontal adjustments after the behavior calculates the ideal horizontal position
         * @param  {AxisResult} result x-axis result
         * @return {Number} original or adjusted left position
         * @public
         */
        afterHorizontalPositionCalculated : function(result) {
            return this._resolveHandler(
                HOOK.AFTER_HORIZONTAL_POSITION_CALCULATED,
                result.calculatedPosition,
                result
            );
        },
        /**
         * Apply vertical adjustments after the behavior calculates the ideal vertical position
         * @param  {AxisResult} result y-axis result
         * @return {Number} original or adjusted top position
         * @public
         */
        afterVerticalPositionCalculated : function(result) {
            return this._resolveHandler(
                HOOK.AFTER_VERTICAL_POSITION_CALCULATED,
                result.calculatedPosition,
                result
            );
        }
    };

    return FloatingLayerHooks;
});
