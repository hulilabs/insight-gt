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
 * @file FunctionUtil
 * @description helpers to be applied on functions
 * @module web-components/utils/function
 */
define([
],
function(
) {
    'use strict';

    return {
        /**
         * @see http://underscorejs.org/#debounce
         *
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered. The function will be called after it stops being called for
         * N milliseconds. If `immediate` is passed, trigger the function on the
         * leading edge, instead of the trailing.
         *
         * @param  {Function} func - function to debound
         * @param  {number} wait - time to wait
         * @param  {boolean} immediate - trigger the function on the leading edge,
         *                               instead of the trailing
         * @return {Function}
         */
        debounce : function(func, wait, immediate) {
            var timeout;
            return function() {
                var self = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(self, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(self, args);
                }
            };
        }
    };
});
