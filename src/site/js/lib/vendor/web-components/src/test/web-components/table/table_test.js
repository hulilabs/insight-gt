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
 * @file Table unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/table/table_component
 * @module test/web-components/tables/table_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tables/table_component'
],
function(
    Vue,
    VueTestHelper,
    Table
) {
    describe('Table', function() {
        before(function() {
            Vue.component('wc-table', Table);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    bodyClass : null,
                    title : null,
                    scrollable : false
                };

                var vm = new Table({ propsData : { totalRows : 4 }}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    bodyClass : 'SomeClass',
                    title : 'Mi tabla',
                    scrollable : true
                };

                var vm = new Table({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
