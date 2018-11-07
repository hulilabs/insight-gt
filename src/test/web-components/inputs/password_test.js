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
                    type : 'text',
                    name : null,
                    id : null,
                    value : null,
                    disabled : false,
                    required : false,
                    maxLength : null,
                    minLength : null,
                    readonly : false,
                    min : null,
                    max : null,
                    step : null,
                    autocomplete : false,
                    label : null,
                    floatingLabel : false,
                    modifier : null,
                    placeholder : null,
                    hasError : false,
                    charCounter : false,
                    errorMessage : null,
                    hideInputHighlighter : false,
                    showSecondaryStyle : false,
                    hintText : null,
                    actionDisabled : false,
                    color : null
                };
                var vm = new Password().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    type : 'text',
                    name : 'test',
                    id : 'test',
                    value : 'test',
                    disabled : true,
                    required : true,
                    maxLength : 10,
                    minLength : 5,
                    readonly : true,
                    min : '10',
                    max : '5',
                    step : 3,
                    autocomplete : true,
                    label : 'Label',
                    floatingLabel : true,
                    modifier : null,
                    placeholder : 'placeholder',
                    hasError : true,
                    charCounter : true,
                    errorMessage : 'error message',
                    hideInputHighlighter : true,
                    showSecondaryStyle : true,
                    hintText : 'hint text',
                    actionDisabled : true,
                    color : 'orange'
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
