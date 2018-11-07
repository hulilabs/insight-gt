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
 * @file StepDots unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/step-dots/step-dots_component
 * @module test/web-components/step-dots/step-dots_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/step-dots/step-dots_component'
],
function(
    Vue,
    VueTestHelper,
    StepDots
) {

    function getRandomIndex(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    describe('StepDots', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    size : 0,
                    selected : null
                };
                var vm = new StepDots({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    size : 5,
                    selected : 2
                };
                var vm = new StepDots({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom negative values', function() {
                var props = {
                    size : -1,
                    selected : -1
                };
                var vm = new StepDots({ propsData : props }).$mount();
                expect(vm.state.size).to.equal(0);
                expect(vm.state.selected).to.equal(1);
            });
        });

        var vm, props = { size : 5, selected : 2 };

        context('#setSize', function() {

            beforeEach(function() {
                vm = new StepDots({ propsData : props }).$mount();
                expect(vm.state.size).to.equal(props.size);
            });

            it('with a positive value', function() {
                var increasedSize = props.size + 1;
                vm.setSize(increasedSize);
                expect(vm.state.size).to.equal(increasedSize);
            });

            it('with a zero or negative index', function() {
                // Set no size
                var noSize = 0;
                vm.setSize(noSize);
                expect(vm.state.size).to.equal(noSize);

                // Negative size
                var negativeSize = -1;
                vm.setSize(negativeSize);
                expect(vm.state.size).to.equal(noSize);
            });
        });

        context('#setSelected', function() {

            beforeEach(function() {
                vm = new StepDots({ propsData : props }).$mount();
                expect(vm.state.selected).to.equal(props.selected);
            });

            it('with a positive index', function() {
                // Select first element
                var firstElement = 1;
                vm.setSelected(firstElement);
                expect(vm.state.selected).to.equal(firstElement);

                // Select a random element
                // Not including first neither last indexes
                var randomElement = getRandomIndex(1, props.size - 1);
                vm.setSelected(randomElement);
                expect(vm.state.selected).to.equal(randomElement);

                // Select last element
                var lastElement = props.size;
                vm.setSelected(lastElement);
                expect(vm.state.selected).to.equal(lastElement);
            });

            it('with a zero or negative index', function() {
                var firstIndex = 1;

                // Select zero index
                vm.setSelected(0);
                expect(vm.state.selected).to.equal(firstIndex);

                // Select negative index
                vm.setSelected(-1);
                expect(vm.state.selected).to.equal(firstIndex);
            });

            it('with a positive overflow index', function() {
                // overflow size
                vm.setSelected(props.size + 1);
                // max size
                expect(vm.state.selected).to.equal(props.size);
            });
        });
    });
});
