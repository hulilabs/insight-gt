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
/* jshint mocha:true, expr:true *//* global expect */
/**
 * @file Toggle unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/selection-controls/toggle/toggle_component
 * @requires web-components/selection-controls/toggle/toggle-button_component
 * @module test/web-components/selection-controls/toggle/toggle_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component'
],
function(
    Vue,
    VueTestHelper,
    Toggle,
    ToggleButton
) {
    describe('Toggle', function() {

        it('adds is-inToggleCollection to inner wc-toggle-button elements', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-toggle><wc-toggle-button value="a" ref="r1">test</wc-toggle-button></wc-toggle>',
                components : {
                    'wc-toggle' : Toggle,
                    'wc-toggle-button' : ToggleButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.r1.cssClass).to.equal('is-inToggleCollection');
        });
    });
});
