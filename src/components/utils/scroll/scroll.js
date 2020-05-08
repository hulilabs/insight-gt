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
 * @file scrollUtil - enhances scroll and page position management
 * @requires jump
 * @requires components/utils/scroll/scroll_styles.css
 * @module components/utils/scroll/scroll
 */
define([
    'jump',
    'css-loader!components/utils/scroll/scroll_styles.css'
],
function(
    jump
) {

    /**
     * Constructor, use this in case you need to lock body position
     * Otherwise you may want to use the static methods
     */
    var ScrollUtil = function() {
        this.offsetX = 0;
        this.offsetY = 0;
    };

    ScrollUtil.prototype = {
        /**
         * Getter for document.body for easier testing
         * @return {Element} document.body
         */
        _getBodyElement : function() {
            return document.body;
        },

        /**
         * Get the number of x-axis scroll pixels
         * Useful for calculating lost pixels on block
         * @return {number}
         */
        getBlockedOffsetX : function() {
            return this.offsetX;
        },

        /**
         * Get the number of y-axis scroll pixels
         * Useful for calculating lost pixels on block
         * @return {number}
         */
        getBlockedOffsetY : function() {
            return this.offsetY;
        },

        /**
         * Locks/unlocks the body position
         * @note only y-axis is currently supported
         * @param  {Boolean} shouldLockPosition
         */
        toggleBodyPositionLock : function(shouldLockPosition) {
            var bodyElement = this._getBodyElement();

            if (shouldLockPosition) {
                this.offsetX = window.pageXOffset;
                this.offsetY = window.pageYOffset;
                bodyElement.style.left = -this.offsetX + 'px';
                bodyElement.style.top = -this.offsetY + 'px';
                bodyElement.classList.add(ScrollUtil.BLOCK_BODY_POSITION_CLASS);
            } else {
                bodyElement.classList.remove(ScrollUtil.BLOCK_BODY_POSITION_CLASS);
                bodyElement.style.left = 'auto';
                bodyElement.style.top = 'auto';
                window.scrollTo(this.offsetX, this.offsetY);
            }
        }
    };

    /**
     * Calculates offset from the top of the page
     * i.e. the sum of the page scroll and the element's offset in the viewport
     * @param  {Element} element
     * @return {Number}          element offset in Y axis
     */
    ScrollUtil.offsetY = function(element) {
        var elementBoundingClientRect = element.getBoundingClientRect();
        return elementBoundingClientRect.top + window.pageYOffset;
    };

    /**
     * Scrolls the page vertically to an element
     * @param  {Element}        element
     * @param  {Number|Boolean} animationDuration truthy to animate the scroll or a number to specify scroll duration
     * @param  {Number}         offset to add it to the final scrolled position
     * @param  {Element}        container to scroll instead of the `window`
     */
    ScrollUtil.scrollTo = function(element, animationDuration, offset, container) {

        if (animationDuration) {
            var animateScroll = ScrollUtil._getAnimatedScrollHelper();
            animateScroll(element, {
                duration : ('number' === typeof animationDuration) ? animationDuration : ScrollUtil.DEFAULT_SCROLL_ANIMATION_DURATION,
                offset : offset,
                container : container
            });

        } else {
            var offsetToAdd = offset ? offset : 0,
                finalScrollPosition = ScrollUtil.offsetY(element) + offsetToAdd;
            window.scrollTo(window.pageXOffset, finalScrollPosition);
        }
    };

    /**
     * Returns true if an element is contained in the second third part of the page
     * @param  {Element}  element
     * @return {Boolean}
     */
    ScrollUtil.isVerticallyCentered = function(element) {
        var viewportHeight = ScrollUtil.getViewPortHeight(),
            elementBoundingClientRect = element.getBoundingClientRect(),
            offset = elementBoundingClientRect.top,
            elementHeight = elementBoundingClientRect.height;

        // returns true if:
        // - not past 2/3 of the viewport
        // - not before 1/3 of the viewport
        // - not bigger than 1/2 of the viewport
        return (viewportHeight - offset > (viewportHeight * 0.6)) &&
               (offset > viewportHeight * 0.3) &&
               (elementHeight < viewportHeight * 0.5);
    };

    /**
     * Moves page scroll to an element's top plus 1/8 of the viewport
     * if the element doesn't look vertically centered
     * @param  {Element} element
     * @param  {Boolean} skipCheck just move it! verification to check if the element is centered
     * @param  {Element} container to be adjusted (scrolled) instead of the `window`
     */
    ScrollUtil.adjustVerticallyIntoView = function(element, skipCheck, container) {
        if (skipCheck || !ScrollUtil.isVerticallyCentered(element)) {
            var viewportHeight = ScrollUtil.getViewPortHeight();
            // if the element isn't centered, we'll move it to be in after the first 1/8 of the viewport
            ScrollUtil.scrollTo(element, true, viewportHeight * -0.125, container);
        }
    };

    /**
     * Getter for jump vendor
     * @return {Function}
     */
    ScrollUtil._getAnimatedScrollHelper = function() {
        return jump;
    };

    /**
     * Getter for window.innerHeight
     */
    ScrollUtil.getViewPortHeight = function() {
        return window.innerHeight;
    };

    /**
     * Module's constants
     */

    // This CSS class is added to the body when the component is active in order to block the scroll
    ScrollUtil.BLOCK_BODY_POSITION_CLASS = 'js-wc-scrollFixed';
    // default to 250ms for animated page scroll, as design approved (/)
    ScrollUtil.DEFAULT_SCROLL_ANIMATION_DURATION = 250;

    return ScrollUtil;
});
