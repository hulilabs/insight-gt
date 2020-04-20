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
 * @file sticky header behavior - makes a part of an element sticky when the element is cut due to scrolling
 * @requires web-components/utils/scroll/scroll,
 * @module web-components/behaviors/sticky/sticky-section_behavior
 */
define([
    'web-components/utils/scroll/scroll'
],
function(
    ScrollUtil
) {

    /**
     * Constructor
     * @param {Element} stickySection          section to make sticky/fixed
     * @param {Element} wrapper                element that wraps the sticky section and that triggers the sticky when cut
     * @param {Function} onStickyChange        called when the sticky status change (i.e. began being sticky or stopped)
     * @oaram {String} relativeElementSelector allows elements that are sticky to a container instead of the window
     */
    var StickySectionBehavior = function(stickySection, wrapper, onStickyChange, relativeElementSelector) {
        this.stickyElement = stickySection;
        this.wrapper = wrapper;
        this.onStickyChange = onStickyChange;

        // this selector allows sticky elements that are relative to a container,
        // to stick to the container's top instead of the window's
        this.relativeElementSelector = relativeElementSelector;
        // container to stick element to , when relativeElementSelector is provided
        this.relativeMainContainer = null;
        // whenever we listen for scrolling on a relative container, we need to capture
        // the scroll event; otherwise we can just listen for scroll in the window normally
        this.useCaptureForScroll = false;

        // is currently sticky?
        this.isSticky = false;

        // here will
        this.pageScrollListener = null;
    };

    StickySectionBehavior.prototype = {
        /**
         * Adds page scroll listener to make an element sticky
         */
        bind : function() {
            if (this.stickyElement) {

                // initializes container
                if (this.relativeElementSelector) {
                    this.relativeMainContainer = document.querySelector(this.relativeElementSelector);
                    this.useCaptureForScroll = true;
                }

                var stickyTop = this._getRelativeOffsetY(this.stickyElement);
                this.pageScrollListener = this._handleStickySection.bind(this, this.wrapper, this.stickyElement, stickyTop);

                // we bind the listener to 'capture' to make sure we can support both window and any other DOM elements
                window.addEventListener('scroll', this.pageScrollListener, this.useCaptureForScroll);
            }
        },

        /**
         * Removes scroll listeners added in StickySectionBehavior#bind and removes sticky section leftovers
         */
        unbind : function() {
            if (this.stickyElement) {
                window.removeEventListener('scroll', this.pageScrollListener, this.useCaptureForScroll);

                this._removeStickyHeader(this.stickyElement);
            }
        },

        /**
         * Called when a window scroll event is triggered, to toggle the sticky section
         * @param  {Element} wrapper   sticky section wrapper
         * @param  {Element} section   sticky section
         * @param  {Number}  stickyTop sticky section offset top
         */
        _handleStickySection : function(wrapper, section, stickyTop) {
            var windowTop = this._getMainStickyContainerTop();

            if (this._shouldBeSticky(stickyTop, windowTop, wrapper, this._getRelativeOffsetY(wrapper))) {
                // fixes width to prevent increase when setting the position to fixed
                // fixes left offset to prevent sticky section to be moved all the way to left
                if ('' === section.style.width) {
                    var sectionBoundingClientRect = section.getBoundingClientRect();
                    section.style.width = sectionBoundingClientRect.width + 'px';
                    section.style.left = sectionBoundingClientRect.left + 'px';
                }

                section.style.position = 'fixed';

                // if the sticky element is relative to another container and not the window
                // adds any offset to the sticky element so it aligns with the top of the relative
                // element; otherwise no `top` styling is added
                section.style.top = this._getTopOffsetForStickyElement();

                this.isSticky = true;
                this.onStickyChange(this.isSticky);

            } else {
                this._removeStickyHeader(this.stickyElement);
            }
        },

        /**
         * When scrolling, shoud the section be sticky?
         * @param  {Number}  stickyTop sticky section offset top
         * @param  {Number}  windowTop window offset
         * @param  {Element} wrapper   sticky section wrapper
         * @param  {Number}  wrapperOffsetY wrapper's offset in window lplus scroll
         */
        _shouldBeSticky : function(stickyTop, windowTop, wrapper, wrapperOffsetY) {
            // if the section is visible
            // AND the scroll is over the wrapper (i.e. the window scrolled offset is greater than the element's)
            return (stickyTop < windowTop) &&
                   (wrapper.offsetHeight + wrapperOffsetY > windowTop);
        },

        /**
         * Removes sticky-related properties (if any) from the header
         */
        _removeStickyHeader : function(stickyElement) {
            if (this.isSticky) {
                // prevents fixed header from floating around if the card is closed
                this.isSticky = false;
                this.onStickyChange(this.isSticky);

                stickyElement.style.position = '';
                stickyElement.style.width = '';
                stickyElement.style.left = '';

                // clears any offset added for relative container alignment
                stickyElement.style.top = '';
            }
        },

        /**
         * Obtains an element's offsetY considering a relative container's scroll (if any)
         * @param  {Element} element - element to calculate offset from
         * @return {number}
         */
        _getRelativeOffsetY : function(element) {
            return ScrollUtil.offsetY(element) + (this.relativeMainContainer ? this.relativeMainContainer.scrollTop : 0);
        },

        /**
         * Obtains the offset of the element to stick the element to
         * @return {Number}
         */
        _getMainStickyContainerTop : function() {
            return this.relativeMainContainer ? this._getRelativeOffsetY(this.relativeMainContainer) : window.pageYOffset;
        },

        /**
         * If the sticky element is relative to another container and not the window
         * calculates any offset to the sticky element so it aligns with the top of the relative
         * element; in other words, calculates the 'top margin' of the sticky element
         *
         * @return {String} offset in pixels
         */
        _getTopOffsetForStickyElement : function() {
            return this.relativeMainContainer ? this.relativeMainContainer.getBoundingClientRect().top + 'px' : '';
        }
    };

    return StickySectionBehavior;
});
