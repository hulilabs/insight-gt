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
 * @file CustomLogic unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/custom-logic/custom-logic_component
 * @module test/web-components/custom-logics/custom-logic_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/custom-logic/custom-logic_component'
],
function(
    Vue,
    VueTestHelper,
    CustomLogic
) {
    describe('CustomLogic', function() {

        var vm;

        function verifyCustomLogicSetup(callback, done) {
            vm = new CustomLogic({ propsData : {
                format : '#(#-#$#',
                value : null
            }});

            // Assertments
            expect(vm.state.value).to.be.empty;
            expect(vm.state.currentMaskedValue).to.be.empty;
            expect(vm.state.previousMaskedValue).to.be.empty;

            // Custom verifications
            callback(done);
        }

        before(function() {
            // registering the component globally
            Vue.component('wc-custom-logic', CustomLogic);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    actionDisabled : false,
                    autocomplete : 'off',
                    charCounter : false,
                    clear : false,
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
                    format : '#',
                    hasError : false,
                    hideInputHighlighter : false,
                    hintText : null,
                    id : null,
                    label : null,
                    max : null,
                    maxLength : null,
                    min : null,
                    minLength : null,
                    modifier : null,
                    name : null,
                    nativeError : false,
                    placeholder : null,
                    readonly : false,
                    required : false,
                    showSecondaryStyle : false,
                    step : null,
                    type : 'text',
                    value : null
                };
                var vm = new CustomLogic({ propsData : { format : props.format }}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    autocomplete : 'on',
                    charCounter : true,
                    clear : true,
                    color : '#D2126F',
                    disabled : true,
                    errorMessage : 'error message',
                    floatingLabel : true,
                    format : '#',
                    hasError : true,
                    hideInputHighlighter : true,
                    hintText : 'hint text',
                    id : 'test',
                    label : 'Label',
                    max : '5',
                    maxLength : 10,
                    min : '10',
                    minLength : 5,
                    modifier : null,
                    name : 'test',
                    nativeError : true,
                    placeholder : 'placeholder',
                    readonly : true,
                    required : true,
                    showSecondaryStyle : true,
                    step : 3,
                    type : 'text',
                    value : 'test'
                };
                var vm = new CustomLogic({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                // Bypasses text field events
                var EVENT = {
                    ON_FOCUS : 'focus',
                    ON_BLUR : 'blur',
                    ON_INPUT : 'input',
                    ON_INVALID : 'invalid',
                    ON_ACTION : 'textfield-action'
                };

                VueTestHelper.checkExposedEvents(EVENT, CustomLogic);
            });
        });

        context('on value change', function() {

            it('accepts only numbers', verifyCustomLogicSetup.bind(this, function(done) {
                vm.setValue('1234').then(function() {
                    expect(vm.state.value).to.be.equal('1234');
                    expect(vm.getValue()).to.be.equal('1234');
                    expect(vm.state.currentMaskedValue).to.be.equal('1(2-3$4');
                    expect(vm.getMaskedValue()).to.be.equal('1(2-3$4');
                    expect(vm.state.previousMaskedValue).to.be.empty;
                    done();
                });
            }));

            it('rejects non numeric characters', verifyCustomLogicSetup.bind(this, function(done) {
                vm.setValue('abcd').then(function() {
                    expect(vm.state.value).to.be.empty;
                    expect(vm.getValue()).to.be.empty;
                    expect(vm.state.currentMaskedValue).to.be.empty;
                    expect(vm.getMaskedValue()).to.be.empty;
                    expect(vm.state.previousMaskedValue).to.be.empty;
                    done();
                });
            }));

            it('extracts the valid characters', verifyCustomLogicSetup.bind(this, function(done) {
                vm.setValue('a1c2').then(function() {
                    expect(vm.state.value).to.be.equal('12');
                    expect(vm.getValue()).to.be.equal('12');
                    expect(vm.state.currentMaskedValue).to.be.equal('1(2-');
                    expect(vm.getMaskedValue()).to.be.equal('1(2-');
                    expect(vm.state.previousMaskedValue).to.be.empty;
                    done();
                });
            }));
        });

        it('#_onAction', verifyCustomLogicSetup.bind(this, function(done) {
            var spy = sinon.spy(),
                payload = { value : 'a1c2', event : null };

            vm.$on('textfield-action', spy);
            vm._onAction(payload);

            vm.$nextTick(function() {
                expect(spy.callCount).to.equal(1);
                done();
            });
        }));

        it('#_onBlur', verifyCustomLogicSetup.bind(this, function(done) {
            var spy = sinon.spy(),
                payload = { value : 'a1c2', event : null };

            vm.$on('blur', spy);
            vm._onBlur(payload);

            vm.$nextTick(function() {
                expect(spy.callCount).to.equal(1);
                done();
            });
        }));

        it('#_onFocus', verifyCustomLogicSetup.bind(this, function(done) {
            var spy = sinon.spy();
            vm.$on('focus', spy);
            vm._onFocus('a1c2').then(function() {
                expect(spy.callCount).to.equal(1);
                expect(vm.state.value).to.be.equal('12');
                expect(vm.state.currentMaskedValue).to.be.equal('1(2-');
                expect(vm.state.previousMaskedValue).to.be.empty;
                done();
            });
        }));

        context('#_onInput', function() {
            it('when pasting invalid characters', verifyCustomLogicSetup.bind(this, function(done) {
                var spy = sinon.spy();
                vm.$on('input', spy);
                vm._onInput('a1c2').then(function() {
                    expect(spy.callCount).to.equal(1);
                    expect(vm.state.value).to.be.equal('12');
                    expect(vm.state.currentMaskedValue).to.be.equal('1(2-');
                    expect(vm.state.previousMaskedValue).to.be.empty;
                    done();
                });
            }));
        });

        context('#_onDelete', function() {
            it('when deleting a masked character', verifyCustomLogicSetup.bind(this, function(done) {
                vm._onInput('123').then(function() {
                    vm._onDelete().then(function() {
                        expect(vm.state.value).to.be.equal('12');
                        expect(vm.state.currentMaskedValue).to.be.equal('1(2-');
                        expect(vm.state.previousMaskedValue).to.be.equal('1(2-3$');
                        done();
                    });
                });
            }));
        });

        context('property watchers', function() {
            it('format');
            it('value');
        });
    });
});
