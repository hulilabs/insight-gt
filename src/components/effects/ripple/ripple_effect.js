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
 * @file ripple effect, helper for adding material's ripple effect. It's a wrapper for `waves` vendor
 * @requires waves/waves.js
 * @requires waves/waves.css
 * @requires web-components/effects/ripple/ripple_styles.css'
 * @module web-components/effects/ripple
 */
define([
    'waves/waves',
    'css-loader!web-components/effects/ripple/ripple_styles.css',
    'css-loader!waves/waves.css'
],
function(
    Waves
) {

    var RippleEffect = {
        // default animation duration is 300ms
        DEFAULT_DURATION : 300,
        // classes to add to generated element
        // it allows using BEM modifiers
        BLOCK_CLASS : 'wc-RippleEffect',

        /**
         * Adds ripple effect to an element
         * @param  {Element} element        DOM element to attach ripple to
         * @param  {?String} opts.modifier  modifier to add to the wc-Ripple block
         * @param  {?number} opts.duration  overrides default ripple duration
         */
        bind : function(element, opts) {
            var providedOptions = opts || {};

            var modifier = 'string' === typeof providedOptions.modifier ? providedOptions.modifier : '';

            Waves.attach(element, [this.BLOCK_CLASS, modifier]);
            Waves.init({
                duration : providedOptions.duration || this.DEFAULT_DURATION
            });
        }
    };

    return RippleEffect;
});
