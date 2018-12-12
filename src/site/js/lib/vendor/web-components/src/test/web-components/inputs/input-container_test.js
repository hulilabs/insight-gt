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
 * @file Input unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/input-container/input-container_component
 * @module test/web-components/inputs/input-container/input-container_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/input-container/input-container_component'
],
function(
    Vue,
    VueTestHelper,
    InputContainer
) {
    describe('InputContainer', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-input-container', InputContainer);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    actionDisabled : false,
                    charCounter : false,
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
                    hasError : false,
                    hideInputHighlighter : false,
                    hintText : null,
                    label : null,
                    labelFor : null,
                    maxLength : null,
                    minLength : null,
                    modifier : null,
                    nativeError : false,
                    placeholder : null,
                    required : false,
                    showSecondaryStyle : false,
                    value : null
                };

                var vm = new InputContainer().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    charCounter : true,
                    color : '#D2126F',
                    disabled : true,
                    errorMessage : 'test',
                    floatingLabel : false,
                    hasError : true,
                    hideInputHighlighter : true,
                    hintText : 'test',
                    label : 'test',
                    labelFor : 'test',
                    maxLength : 50,
                    minLength : 30,
                    modifier : 'is-headline',
                    nativeError : true,
                    placeholder : 'placeholder',
                    required : true,
                    showSecondaryStyle : true,
                    value : 'test'
                };

                var vm = new InputContainer({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('adds the respective modifiers when given', function() {
                var vm = new InputContainer({ propsData : { modifier : 'is-headline' } }).$mount();
                expect(vm.$el.classList.contains('is-headline')).to.be.true;

                var vm2 = new InputContainer({ propsData : { modifier : 'is-title' } }).$mount();
                expect(vm2.$el.classList.contains('is-title')).to.be.true;
            });
        });

        context('on event handling', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-input-container ref="container" v-bind:value="value">' +
                            '<input ref="input" v-model="value"/> ' +
                        '</wc-input-container>',
                    data : function() {
                        return {
                            value : 'test'
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('emmits the ON_FOCUS event with the input\'s value as payload', function(done) {
                vm.$refs.container.$on('focus', function(payload) {
                    expect(payload.value).to.equal(vm.value);
                    done();
                });

                Vue.nextTick(function() {
                    vm.$refs.container._onFocus();
                });
            });

            it('emmits the ON_BLUR event with the input\'s value as payload', function(done) {
                vm.$refs.container.$on('blur', function(payload) {
                    expect(payload.value).to.equal(vm.value);
                    done();
                });

                Vue.nextTick(function() {
                    vm.$refs.container._onBlur();
                });
            });

            it('focus', function() {
                vm.$refs.container.focus();

                expect(vm.$refs.container.state.isFocused).to.be.true;
            });
        });
    });
});
