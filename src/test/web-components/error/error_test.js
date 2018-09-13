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
 * @file Error unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/error/error_component
 * @module test/web-components/errors/error_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/errors/error_component'
],
function(
    Vue,
    VueTestHelper,
    ErrorComponent
) {
    describe('Error', function() {

        before(function() {
            Vue.component('wc-error', ErrorComponent);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    layout : 'none'
                };

                var vm = new ErrorComponent().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    layout : 'card'
                };

                var vm = new ErrorComponent({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
