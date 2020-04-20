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
 * @file button focus behavior - provides smart focus management for buttons
 * @requires web-components/behaviors/a11y/button-focus/button-focus_styles.css
 * @module web-components/behaviors/a11y/button-focus/button-focus_behavior
 */
define([
    'css-loader!web-components/behaviors/a11y/button-focus/button-focus_styles.css'
],
function(
) {

    /**
     * Adds one css class to an element
     * @param {HTMLElement} element
     * @param {String} className
     */
    function addClass(element, className) {
        element.classList.add(className);
    }

    /**
     * Removes one css class from an element
     * @param {HTMLElement} element
     * @param {String} className
     */
    function removeClass(element, className) {
        element.classList.remove(className);
    }

    /**
     * Utility class to disable focus when a button is focused due to a click
     * @type {String}
     */
    var NO_FOCUS = 'is-focus-disabled';

    var ButtonFocusBehavior = {
        /**
         * Binds events to `this.element` to:
         * + add utility class when clicked, to disable focus styles
         * + remove that class on blur
         * + remove that class on keyup, to display focus styles on tab
         */
        bind : function(element) {
            // we'll use this module's helpers for adding/removing classes as the `event` argument related
            // to the binding will cause troubles with `element.classList` methods that can take N arguments
            element.addEventListener('mousedown', addClass.bind(null, element, NO_FOCUS));
            element.addEventListener('blur', removeClass.bind(null, element, NO_FOCUS));
            element.addEventListener('keyup', removeClass.bind(null, element, NO_FOCUS));
        }
    };

    return ButtonFocusBehavior;
});
