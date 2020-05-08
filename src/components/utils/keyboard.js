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
 * @file KeyboardUtil - Keyboard mapping and event management util
 * @module components/utils/keyboard
 */
define([], function() {
    /**
     * Common keyboard key codes
     * @type {Object}
     */
    var CODE = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        TAB: 9,
    };

    /**
     * Set of navigation keyboard codes
     * @type {Array}
     */
    var NAVIGATION = [CODE.ENTER, CODE.ESCAPE, CODE.SPACE, CODE.TAB];

    /**
     * Set of arrow keyboard codes
     * @type {Array}
     */
    var ARROWS = [CODE.LEFT, CODE.UP, CODE.RIGHT, CODE.DOWN];

    /**
     * Utility for keyboard events
     * @type {Object}
     */
    var KeyboardUtil = {
        /**
         * Common keyboard key codes
         * @type {Object}
         */
        CODE: CODE,
        /**
         * Common sets of keyboard key codes
         * @type {Object}
         */
        SETS: {
            ARROWS: ARROWS,
            NAVIGATION: NAVIGATION,
        },
        /**
         * Detect if a keycode belongs to a common set of keycodes
         * @param  {Number}  keyCode
         * @param  {Array}   keyCodesSet
         * @return {Boolean}
         */
        inSet: function(keyCode, keyCodesSet) {
            return keyCodesSet.indexOf(keyCode) !== -1;
        },
    };

    return KeyboardUtil;
});
