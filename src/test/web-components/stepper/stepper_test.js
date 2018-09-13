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
 * @file Stepper unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/stepper/stepper_component
 * @module test/web-components/steppers/stepper_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/directives/tooltip/tooltip_directive',
    'web-components/steppers/stepper_component'
],
function(
    Vue,
    VueTestHelper,
    TooltipDirective,
    Stepper
) {
    describe('Stepper', function() {

        before(function() {
            TooltipDirective.bind();
            Vue.component('wc-stepper', Stepper);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    steps : [],
                    active : null
                };

                var vm = new Stepper({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
                expect(vm.state.active).to.equal(null);
            });

            it('sets props with custom values', function() {
                var props = {
                    steps : [{
                        id : 1,
                        value : 'test',
                        tooltip : 'Test',
                        isEnabled : 'true'
                    }],
                    active : 'test'
                };

                var vm = new Stepper({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('#setActive', function() {
            var props = {
                steps : [{
                    id : 1,
                    value : 'test',
                    tooltip : 'Test',
                    isEnabled : 'true'
                }]
            };

            var vm = new Stepper({ propsData : props }).$mount();
            expect(vm.state.active).to.equal(null);

            vm.setActive('test');
            expect(vm.state.active).to.equal('test');
        });

        it('#_onStepClickedHandler', function() {
            var vm = new Stepper({ propsData : {
                steps : [{ id : 1, value : 'test', tooltip : 'Test', isEnabled : 'true' }],
                active : 'test'
            }}).$mount();

            var setActiveStub = sinon.stub(vm, 'setActive');

            vm._onStepClickedHandler(1);

            expect(setActiveStub.callCount).to.equal(1);
        });

        it('changes its active step when the bound prop "active" is changed', function(done) {
            var activeStep = 'foo',
                steps = [
                    { id: 1, value : 'foo', tooltip : 'Foo', isEnabled : true},
                    { id: 2, value : 'bar', tooltip : 'Bar', isEnabled : true}
                ];

            var ParentComponent = Vue.extend({
                template : '<wc-stepper ref="stepper" v-bind:steps="steps" v-bind:active="activeStep"></wc-stepper>',
                data : function() {
                    return {
                        steps : steps,
                        activeStep : activeStep
                    };
                }
            });

            var vm = new ParentComponent().$mount();
            // checking that the parent data was set correctly
            expect(vm.steps).to.equal(steps);
            expect(vm.activeStep).to.equal(activeStep);
            // checking that the active step of the stepper is equal to the parent's
            expect(vm.$refs.stepper.state.active).to.equal(vm.activeStep);
            // updating the active step of the parent's state
            vm.activeStep = 'bar';
            vm.$nextTick(function() {
                // checking that the parent's state was successfully changed
                expect(vm.activeStep).to.equal('bar');
                // checking that the stepper's state was also changed
                expect(vm.$refs.stepper.state.active).to.equal(vm.activeStep);
                done();
            });
        });
    });
});
