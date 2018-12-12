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
 * @file Textarea unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/textarea/textarea_component
 * @module test/web-components/textareas/textarea_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/textarea/textarea_component'
],
function(
    Vue,
    VueTestHelper,
    TextArea
) {
    describe('TextArea', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-textarea', TextArea);
        });
        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    actionDisabled : false,
                    autocomplete : 'off',
                    charCounter : false,
                    classObject : {
                        inputClass : '',
                        inputContainerClass : ''
                    },
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
                    focusHint : null,
                    hasError : false,
                    hideInputHighlighter : false,
                    hintText : null,
                    id : null,
                    label : null,
                    max : null,
                    maxLength : null,
                    min : null,
                    minLength : null,
                    mobile : false,
                    modifier : null,
                    name : null,
                    nativeError : false,
                    placeholder : null,
                    readonly : false,
                    required : false,
                    showSecondaryStyle : false,
                    step : null,
                    trim : true,
                    // these can be set but are ignored for textarea
                    type : 'text',
                    value : null
                };
                var vm = new TextArea().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    autocomplete : 'on',
                    charCounter : true,
                    classObject : {
                        inputContainerClass : 'test'
                    },
                    color : '#D2126F',
                    disabled : true,
                    errorMessage : 'error message',
                    floatingLabel : true,
                    focusHint : 'focus hint text',
                    hasError : true,
                    hideInputHighlighter : true,
                    hintText : 'hint text',
                    id : 'test',
                    label : 'Label',
                    max : '5',
                    maxLength : 10,
                    min : '10',
                    minLength : 5,
                    mobile : true,
                    modifier : null,
                    name : 'test',
                    nativeError : true,
                    placeholder : 'placeholder',
                    readonly : true,
                    required : true,
                    showSecondaryStyle : true,
                    step : 3,
                    trim : false,
                    // these can be set but are ignored for textarea
                    type : 'text',
                    value : 'test'
                };
                var vm = new TextArea({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                var EVENT = {
                    ON_FOCUS : 'focus',
                    ON_BLUR : 'blur',
                    ON_INPUT : 'input'
                };

                VueTestHelper.checkExposedEvents(EVENT, TextArea);
            });

            context('on id generation', function() {
                it('generates random pseudo ids', function() {
                    var vm = new TextArea().$mount();
                    expect(vm.pseudoId).to.be.a.string;

                    var vm2 = new TextArea().$mount();
                    expect(vm2.pseudoId).to.be.a.string;

                    expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
                });

                it('applies same id to input and label', function(done) {
                    var vm = new TextArea({ propsData : { label : 'label' }}).$mount(),
                        inputElement = vm.$el.querySelector('textarea'),
                        labelElement = vm.$el.querySelector('label');

                    vm.$nextTick(function() {
                        expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
                        done();
                    });
                });
            });

            it('#setValue', function() {
                var value = 'test',
                    vm = new TextArea().$mount();
                expect(vm.state.value).to.be.null;
                vm.setValue(value);

                expect(vm.state.value).to.equal(value);
            });

            it('#getValue', function() {
                var value = 'test',
                    vm = new TextArea().$mount();
                expect(vm.state.value).to.be.null;
                vm.setValue(value);

                expect(vm.getValue()).to.equal(value);
            });

            it('#focus', function(done) {
                var vm = new TextArea().$mount();
                vm.focus();

                vm.$nextTick(function() {
                    expect(vm.state.isFocused).to.be.true;
                    done();
                });
            });

            var mockedEvent = {
                target : {
                    value : 'test'
                },
                relatedTarget : null
            };

            it('#_onChange', function() {
                var vm = new TextArea().$mount();
                vm._onChange(mockedEvent);
                expect(vm.state.value).to.equal(mockedEvent.target.value);
            });

            it('#_onFocus', function() {
                var vm = new TextArea().$mount();
                vm._onFocus();
                expect(vm.state.isFocused).to.be.true;
            });

            context('#_onBlur', function() {

                it('updates its isFocused state to false', function() {
                    var vm = new TextArea().$mount();
                    vm._onFocus();
                    expect(vm.state.isFocused).to.be.true;

                    vm._onBlur({
                        e : mockedEvent,
                    });

                    expect(vm.state.isFocused).to.be.false;
                });
            });

            it('changes its value when the bound prop is changed', function(done) {
                var ParentComponent = Vue.extend({
                    template : '<wc-textarea ref="textarea" v-bind:value="value"></wc-textarea>',
                    data : function() {
                        return {
                            value : 'test'
                        };
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.textarea.state.value).to.equal(vm.value);

                vm.value = 'example';
                vm.$nextTick(function() {
                    expect(vm.$refs.textarea.state.value).to.equal(vm.value);
                    done();
                });
            });
        });
    });
});
