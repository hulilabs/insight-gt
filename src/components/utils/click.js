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
 * @file ClickUtil - Useful click methods that can be used in components
 * @module components/utils/click
 */
define(function() {
    var DOUBLE_CLICK_DELAY = 200;

    /**
     * Utility for handling click events
     * @type {Object}
     */
    var ClickUtil = {
        /**
         * Attach the click and the double click events listeners for the same target
         * @param  {HTMLElement} target
         * @param  {Function} clickFunction
         * @param  {Function} doubleClickFunction
         */
        attachClickListeners: function(target, clickFunction, doubleClickFunction) {
            // Store the functions for the case when someone wants to remove these listeners
            this._clickHandlerFunction = this._clickHandler.bind(this, clickFunction);
            this._doubleClickHandlerFunction = this._doubleClickHandler.bind(
                this,
                doubleClickFunction
            );

            target.addEventListener('click', this._clickHandlerFunction);
            target.addEventListener('dblclick', this._doubleClickHandlerFunction);
        },
        /**
         * Remove the click and the double click events listeners for the same target
         * @param  {HTMLElement} target
         * @param  {Function} clickFunction
         * @param  {Function} doubleClickFunction
         */
        removeClickListeners: function(target) {
            if (this._clickHandlerFunction && this._doubleClickHandlerFunction) {
                target.removeEventListener('click', this._clickHandlerFunction);
                target.removeEventListener('dblclick', this._doubleClickHandlerFunction);
            }
        },
        /**
         * Click handler for the event callback
         * @param  {Function} clickFunction
         * @param  {MouseEvent} e
         */
        _clickHandler: function(clickFunction, e) {
            this.timer = setTimeout(function() {
                clickFunction(e);
            }, DOUBLE_CLICK_DELAY);
        },
        /**
         * Double click handler for the event callback
         * @param  {Function} doubleClickFunction
         * @param  {MouseEvent} e
         */
        _doubleClickHandler: function(doubleClickFunction, e) {
            clearTimeout(this.timer);
            doubleClickFunction(e);
        },
    };

    return ClickUtil;
});
