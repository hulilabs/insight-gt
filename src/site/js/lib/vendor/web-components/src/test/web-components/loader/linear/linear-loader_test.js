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
 * @file LinearLoader unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/loaders/linear/linear-loader_component
 * @module test/web-components/loaders/loader_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/loaders/linear/linear-loader_component'
],
function(
    Vue,
    VueTestHelper,
    LinearLoader
) {
    describe('LinearLoader', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    indeterminate : false,
                    progress : 0
                };

                var vm = new LinearLoader().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    indeterminate : true,
                    progress : 15
                };

                var vm = new LinearLoader({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
