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
 * @file Onboarding unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires test/web-components/behaviors/floating-layer/floating-layer_helper
 * @requires web-components/onboardings/onboarding_component
 * @requires web-components/directives/ripple-effect/ripple-effect_directive
 * @module test/web-components/onboardings/onboarding_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'test/web-components/behaviors/floating-layer/floating-layer_helper',
    'web-components/onboardings/onboarding_component',
    'web-components/directives/ripple-effect/ripple-effect_directive'
],
function(
    Vue,
    VueTestHelper,
    FloatingLayerHelper,
    Onboarding,
    RippleEffectDirective
) {

    /**
     * Gets the refs of a Vue component, containing a reference to an onboarding component
     * configured with the given params and a reference to its target.
     * @param  {Number}  stepNumber  value for the onboarding's stepNumber prop
     * @param  {Boolean} skippable   value for the onboarding's skippable prop
     * @return {Object}  references of an onboarding component and its target
     */
    function getOnboardingDefinition(stepNumber, skippable, direction) {
        var template = [
            '<div>',
                '<div ref="target">Hello, World!</div>',
                '<wc-onboarding ref="onboarding"',
                    'v-bind:target="{\'local\' : $refs, \'key\' : \'target\'}"',
                    'v-bind:number-of-steps="2"',
                    'v-bind:step-number="' + stepNumber + '"',
                    'v-bind:skippable="' + skippable + '"',
                    'onboarding-id="test"',
                    'trigger-origin="top-left"',
                    'floating-direction="' + direction + '">',
                    'Content',
                '</wc-onboarding>',
            '</div>'
        ];

        return new Vue({ template : template.join('') }).$mount().$refs;
    };

    describe('Onboarding', function() {
        before(function() {
            // registering required components and directive globally
            RippleEffectDirective.bind();
            Vue.component('wc-onboarding', Onboarding);
        });

        context('on instance creation', function() {
            var ref;

            beforeEach(function() {
                ref = getOnboardingDefinition(1, false, 'up').target;
            });

            it('sets props with default values', function() {
                var props = FloatingLayerHelper.mergeDefaultProps({
                    onboardingId : 'test',
                    target : ref,
                    numberOfSteps : 1,
                    stepNumber : 1,
                    active : false,
                    skippable : false,
                    previousBtnLabel : null,
                    nextBtnLabel : null,
                    confirmBtnLabel : null
                });

                var vm = new Onboarding({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = FloatingLayerHelper.mergeDefaultProps({
                    onboardingId : 'test',
                    target : ref,
                    numberOfSteps : 1,
                    stepNumber : 1,
                    active : true,
                    skippable : true,
                    previousBtnLabel : 'test',
                    nextBtnLabel : 'test',
                    confirmBtnLabel : 'test',
                    triggerOrigin : 'top-center',
                    floatingDirection : 'up'
                });

                var vm = new Onboarding({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('assigns the correct size to the step dots child', function() {
                var props = FloatingLayerHelper.mergeDefaultProps({
                    onboardingId : 'test',
                    target : ref,
                    numberOfSteps : 10
                });

                var vm = new Onboarding({ propsData : props }).$mount();
                expect(vm.$refs.stepDots.state.size).to.equal(props.numberOfSteps);
            });

            it('contains the expected exposed events', function() {
                var EV = {
                    ON_CHANGE : Onboarding.EVENT.ON_CHANGE
                };

                VueTestHelper.checkExposedEvents(EV, Onboarding);
            });
        });


        it('changes its isActive state when the bound prop is changed', function(done) {
            var vm = new Vue({
                template :
                    '<div>' +
                        '<div ref="target">Hello, World!</div>' +
                        '<wc-onboarding ref="onboarding"' +
                            'v-bind:active="active"' +
                            'v-bind:target="{\'local\' : $refs, \'key\' : \'target\'}"' +
                            'onboarding-id="test"' +
                            'trigger-origin="top-left"' +
                            'floating-direction="down">' +
                            'Content' +
                        '</wc-onboarding>' +
                    '</div>',
                data : function() {
                    return {
                        active : false
                    };
                }
            }).$mount();

            expect(vm.$refs.onboarding.state.isActive).to.be.false;

            vm.active = true;

            vm.$nextTick(function() {
                expect(vm.$refs.onboarding.state.isActive).to.be.true;
                done();
            });
        });

        context('on moving to other steps', function() {
            var onChangeHandler;

            beforeEach(function() {
                onChangeHandler = sinon.spy();
            });

            it('triggers the ON_CHANGE event with the next action as payload', function(done) {
                var vm = getOnboardingDefinition(1, false, 'up').onboarding;

                vm.$on(Onboarding.EVENT.ON_CHANGE, function(payload) {
                    expect(payload).to.be.object;
                    expect(payload.action).to.equal('next');
                    onChangeHandler();
                });

                vm._nextStepHandler();

                vm.$nextTick(function() {
                    expect(onChangeHandler.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers the ON_CHANGE event with the completed action as payload when is a last step', function(done) {
                var vm = getOnboardingDefinition(2, false, 'right').onboarding;

                vm.$on(Onboarding.EVENT.ON_CHANGE, function(payload) {
                    expect(payload).to.be.object;
                    expect(payload.action).to.equal('completed');
                    onChangeHandler();
                });

                vm._nextStepHandler();

                vm.$nextTick(function() {
                    expect(onChangeHandler.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers the ON_CHANGE event with the previous action as payload', function(done) {
                var vm = getOnboardingDefinition(2, false, 'down').onboarding;

                vm.$on(Onboarding.EVENT.ON_CHANGE, function(payload) {
                    expect(payload).to.be.object;
                    expect(payload.action).to.equal('previous');
                    onChangeHandler();
                });

                vm._previousStepHandler();

                vm.$nextTick(function() {
                    expect(onChangeHandler.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers the ON_CHANGE event with the skipped action as payload', function(done) {
                var vm = getOnboardingDefinition(1, true, 'left').onboarding;

                vm.$on(Onboarding.EVENT.ON_CHANGE, function(payload) {
                    expect(payload).to.be.object;
                    expect(payload.action).to.equal('skipped');
                    onChangeHandler();
                });

                vm._skipOnboarding();

                vm.$nextTick(function() {
                    expect(onChangeHandler.callCount).to.equal(1);
                    done();
                });
            });
        });
    });
});
