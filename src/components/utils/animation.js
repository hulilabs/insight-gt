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
 * @file AnimationUtil - Animation & transition related generic helpers
 * @module components/utils/animation
 */
define([], function() {
    var AnimationUtil = {
        /**
         * Returns the transition end property that works with the current browser
         * Useful for listening for `transition end` event
         *
         * Supported browsers: Chrome, Firefox, opera, IE10+, Safari 8+
         *
         * @return {string}
         */
        getTransitionEndProperty: function() {
            var el = document.createElement('p');

            // only supported browser that requires a prefix is Safari
            var webkitTransitionEnd = 'webkitTransitionEnd',
                webkitTransition = 'webkitTransition';

            if (null != el.style[webkitTransition]) {
                return webkitTransitionEnd;
            }

            // standard transition end property
            return 'transitionend';
        },

        /**
         * Returns the animation end property that works with the current browser
         * Useful for listening for animation end event
         *
         * Supported browsers: Chrome, Firefox, opera, IE10+, Safari 8+
         *
         * @return {string}
         */
        getAnimationEndProperty: function() {
            var el = document.createElement('p');

            // only supported browser that requires a prefix is Safari
            var webkitanimationEnd = 'webkitAnimationEnd',
                webkitanimation = 'webkitAnimation';

            if (null != el.style[webkitanimation]) {
                return webkitanimationEnd;
            }

            // standard animation end property
            return 'animationend';
        },
    };

    return AnimationUtil;
});
