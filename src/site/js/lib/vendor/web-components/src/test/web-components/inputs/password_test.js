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
 * @file Password unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/password/password_component
 * @module test/web-components/inputs/password_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/password/password_component'
],
function(
    Vue,
    VueTestHelper,
    Password
) {
    describe('Password', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-password', Password);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    actionDisabled : false,
                    autocomplete : 'off',
                    charCounter : false,
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
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
                    revealed : false,
                    showSecondaryStyle : false,
                    step : null,
                    type : 'text',
                    value : null
                };
                var vm = new Password().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    autocomplete : 'on',
                    charCounter : true,
                    color : 'orange',
                    disabled : true,
                    errorMessage : 'error message',
                    floatingLabel : true,
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
                    revealed : true,
                    showSecondaryStyle : true,
                    step : 3,
                    type : 'text',
                    value : 'test'
                };
                var vm = new Password({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                var EVENT = {
                    ON_BLUR : 'blur',
                    ON_FOCUS : 'focus',
                    ON_INPUT : 'input'
                };

                VueTestHelper.checkExposedEvents(EVENT, Password);
            });
        });

        it('changes its value when the bound prop is changed', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-password ref="password" v-bind:value="value"></wc-password>',
                data : function() {
                    return {
                        value : 'test'
                    };
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.password.state.value).to.equal(vm.value);

            vm.value = 'example';
            vm.$nextTick(function() {
                expect(vm.$refs.password.state.value).to.equal(vm.value);
                done();
            });
        });

        it('#setValue', function() {
            var value = 'test',
                vm = new Password().$mount();
            expect(vm.state.value).to.be.null;
            vm.setValue(value);

            expect(vm.state.value).to.equal(value);
        });

        it('changes the textfield type when the action is clicked', function(done) {
            var vm = new Password().$mount();
            expect(vm.state.isPasswordRevealed).to.be.false;
            expect(vm.textfieldType).to.equal('password');
            expect(vm.textfieldActionIconClass).to.equal('icon-nonvisible');
            vm._togglePasswordVisibility();
            vm.$nextTick(function() {
                expect(vm.state.isPasswordRevealed).to.be.true;
                expect(vm.textfieldType).to.equal('text');
                expect(vm.textfieldActionIconClass).to.equal('icon-visible');
                done();
            });
        });

        it('#focus', function(done) {
            var vm = new Password().$mount();
            vm.focus();

            Vue.nextTick(function() {
                expect(vm.$refs.textfield.state.isFocused).to.be.true;
                done();
            });
        });
    });
});
