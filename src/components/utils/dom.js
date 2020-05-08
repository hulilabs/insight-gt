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
 * @file DOM util - apply operations over DOM elements
 * @module components/utils/dom
 */
define([], function() {
    var DOMUtil = {
        /**
         * Detect if an element has horizontal scrollable area (x-axis scrollbar)
         * @param  {HTMLElement}  element
         * @return {Boolean}
         */
        hasHorizontalScroll: function(element) {
            return element.scrollWidth > element.clientWidth;
        },
        /**
         * Detect if an element has vertical scrollable area (y-axis scrollbar)
         * @param  {HTMLElement}  element
         * @return {Boolean}
         */
        hasVerticalScroll: function(element) {
            return element.scrollHeight > element.clientHeight;
        },
        /**
         * Calculate absolute element left position at document (not viewport)
         * @param  {HTMLElement}  element
         * @return {Integer}
         */
        getDocumentOffsetLeft: function(element) {
            return this._sumBranchProp('offsetLeft', element);
        },
        /**
         * Calculate absolute element top position at document (not viewport)
         * @param  {HTMLElement}  element
         * @return {Integer}
         */
        getDocumentOffsetTop: function(element) {
            return this._sumBranchProp('offsetTop', element);
        },
        /**
         * Calculate the scroll left offset up to the viewport
         * @param  {HTMLElement}  element
         * @return {Integer}
         */
        getScrollOffsetLeft: function(element) {
            return this._sumBranchProp('scrollLeft', element);
        },
        /**
         * Calculate the scroll top offset up to the viewport
         * @param  {HTMLElement}  element
         * @return {Integer}
         */
        getScrollOffsetTop: function(element) {
            return this._sumBranchProp('scrollTop', element);
        },
        /**
         * By recursion, traverse from element-[parents...]-viewport calculating a prop sum
         * @param  {String}       prop    DOM property to use for calculation
         * @param  {HTMLElement?} element DOM element position at another parent or document
         * @return {Number}
         * @private
         */
        _sumBranchProp: function(prop, element) {
            if (!element) {
                return 0;
            }
            var sum = element.offsetParent ? this._sumBranchProp(prop, element.offsetParent) : 0;
            return (element[prop] || 0) + sum;
        },
    };

    return DOMUtil;
});
