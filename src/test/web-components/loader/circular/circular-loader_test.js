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
 * @file CircularLoader unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/loaders/circular/circular-loader_component
 * @module test/web-components/loaders/circular/circular-loader_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/loaders/circular/circular-loader_component'
],
function(
    Vue,
    VueTestHelper,
    CircularLoader
) {
    describe('CircularLoader', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    indeterminate : false,
                    progress : 0,
                    light : false,
                    isSaver : false
                };

                var vm = new CircularLoader().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    indeterminate : true,
                    progress : 15,
                    light : true,
                    isSaver : true
                };

                var vm = new CircularLoader({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
