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
/* global expect, describe, it, beforeEach, before */
define([
    'vue',
    'web-components/effects/ripple/ripple_effect',
    'web-components/directives/ripple-effect/ripple-effect_directive'
],
function(
    Vue,
    RippleEffect,
    RippleEffectDirective
) {

    describe('RippleEffectDirective', function() {
        before(function() {
            RippleEffectDirective.bind();
        });

        // global element to attach ripple to
        var element;

        beforeEach(function() {
            element = document.createElement('div');
        });

        it('adds ripple effect to element', function() {

            var ComponentDefinition = Vue.extend({
                template : '<div v-wc-ripple></div>'
            });

            var component = new ComponentDefinition().$mount();
            expect(component.$el.classList.contains(RippleEffect.BLOCK_CLASS)).to.equal(true);
        });

        it('adds modifier to bound element', function() {
            var ComponentDefinition = Vue.extend({
                template : '<div v-wc-ripple:is-dark></div>'
            });

            var component = new ComponentDefinition().$mount();
            expect(component.$el.classList.contains('is-dark')).to.equal(true);
        });

    });
});
