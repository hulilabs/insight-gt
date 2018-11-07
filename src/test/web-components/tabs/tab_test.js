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
 * @file Tab unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/tabs/tab_component
 * @module test/web-components/tabs/tab_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tabs/tab_component'
],
function(
    Vue,
    VueTestHelper,
    Tab
) {
    describe('Tab', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-tab', Tab);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                        autoSelectable : true,
                        disabled : false,
                        index : null
                    },
                    vm = new Tab().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with numeric custom value', function() {
                var props = {
                        autoSelectable : true,
                        disabled : false,
                        index : 1,
                    },
                    vm = new Tab({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with string custom value', function() {
                var props = {
                        autoSelectable : false,
                        disabled : false,
                        index : 'test'
                    },
                    vm = new Tab({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                var EVENT = {
                    ON_SELECTED : 'tab-selected',
                    ON_CLICK : 'tab-clicked'
                };

                VueTestHelper.checkExposedEvents(EVENT, Tab);
            });
        });

        context('properly generates slot content', function() {
            it('icon slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-tab'
                }, {
                    name : 'icon',
                    content : '<i class="icon-language"></i>',
                    styleClass : 'wc-Tab__icon'
                });
            });

            it('default slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-tab'
                }, {
                    name : '',
                    content : 'test',
                    styleClass : 'wc-Tab__label'
                });
            });
        });

        it('#setActive', function() {
            var vm = new Tab().$mount();
            expect(vm.state.isActive).to.equal(false);

            vm.setActive(true, false);
            expect(vm.state.isActive).to.equal(true);
        });

        context('#setIndex', function() {
            it('changes its state for setting the given value to the index', function() {
                var newIndex = 'newIndex',
                    vm = new Tab().$mount();

                vm.setIndex(newIndex);
                expect(vm.state.index).to.equal(newIndex);
            });

            it('doesn\'t overwrite the value given by the index prop', function() {
                var props = { index : 'test' },
                    vm = new Tab({ propsData : props }).$mount();

                vm.setIndex('newIndex');
                expect(vm.state.index).to.equal(props.index);
            });
        });

        it('#getIndex', function() {
            var index = 'indexValue',
                vm = new Tab().$mount();

            vm.setIndex(index);
            expect(vm.getIndex()).to.equal(index);
        });
    });
});
