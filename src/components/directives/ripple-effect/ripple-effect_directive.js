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
 * @file ripple effect directive
 * @requires vue
 * @requires web-components/effects/ripple/ripple_effect
 */
define([
    'vue',
    'web-components/effects/ripple/ripple_effect'
],
function(
    Vue,
    RippleEffect
) {

    /**
     * RippleEffectDirective, adds ripple effect to a Vue component
     * Import this file on your main app repo and call `bind` method before any Vue setup
     * @see https://vuejs.org/guide/custom-directive.html for feature details
     *
     * Directive name: v-wc-ripple
     */
    var RippleEffectDirective = {
        bind : function() {
            Vue.directive('wc-ripple', {
                /**
                 * Directive is applied at bind stage
                 * @param  {Element} el           component's root el
                 * @param  {String}  binding.arg  will be added as a BEM modifier to the ripple effect block
                 */
                bind : function(el, binding) {
                    RippleEffect.bind(el, {
                        modifier : binding.arg
                    });
                }
            });
        }
    };

    return RippleEffectDirective;
});
