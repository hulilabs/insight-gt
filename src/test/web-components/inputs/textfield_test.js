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
/* jshint mocha:true, expr:true *//* global expect, sinon */
/**
 * @file TextField unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/textfield/textfield_component
 * @module test/web-components/inputs/textfield_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/textfield/textfield_component'
],
function(
    Vue,
    VueTestHelper,
    TextField
) {
    describe('TextField', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-textfield', TextField);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    clear : false,
                    type : 'text',
                    name : null,
                    id : null,
                    inputClass : '',
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
                    signed : false,
                    pattern : null,
                    trim : true,
                    color : null
                };
                var vm = new TextField().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    clear : true,
                    type : 'text',
                    name : 'test',
                    id : 'test',
                    inputClass : '',
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
                    signed : true,
                    pattern : /^[0-9]*$/,
                    trim : false,
                    color : '#D2126F'
                };
                var vm = new TextField({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                var EVENT = {
                    ON_FOCUS : 'focus',
                    ON_BLUR : 'blur',
                    ON_INPUT : 'input',
                    ON_ACTION : 'textfield-action'
                };

                VueTestHelper.checkExposedEvents(EVENT, TextField);
            });
        });

        context('on id generation', function() {
            it('generates random pseudo ids', function() {
                var vm = new TextField().$mount();
                expect(vm.pseudoId).to.be.a.string;

                var vm2 = new TextField().$mount();
                expect(vm2.pseudoId).to.be.a.string;

                expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
            });

            it('applies same id to input and label', function(done) {
                var vm = new TextField({ propsData : { label : 'label' }}).$mount(),
                    inputElement = vm.$el.querySelector('input'),
                    labelElement = vm.$el.querySelector('label');

                vm.$nextTick(function() {
                    expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
                    done();
                });
            });
        });

        it('#setValue', function() {
            var value = 'test',
                vm = new TextField().$mount();
            expect(vm.state.value).to.be.null;
            vm.setValue(value);

            expect(vm.state.value).to.equal(value);
        });

        it('#getValue', function() {
            var value = 'test',
                vm = new TextField().$mount();
            expect(vm.state.value).to.be.null;
            vm.setValue(value);

            expect(vm.getValue()).to.equal(value);
        });

        var mockedEvent = {
            target : {
                value : 'test'
            },
            relatedTarget : null
        };

        it('#_onChange', function() {
            var vm = new TextField().$mount();
            vm._onChange(mockedEvent);
            expect(vm.state.value).to.equal(mockedEvent.target.value);
        });

        it('cancels _onChange based on pattern', function() {
            var vm = new TextField({propsData : {pattern : /^[0-9]*$/}}).$mount();
            var fakeEvent = {
                preventDefault : sinon.spy(),
                target : {
                    value : 'a'
                }
            };

            // value to be set after cancel
            vm.state.value = 123;

            vm._onChange(fakeEvent);
            expect(fakeEvent.preventDefault.callCount).to.equal(1);
            expect(vm.state.value).to.equal(123);
        });

        it('#focus', function(done) {
            var vm = new TextField().$mount();
            vm.focus();

            Vue.nextTick(function() {
                expect(vm.state.isFocused).to.be.true;
                done();
            });
        });

        context('#_onBlur', function() {

            it('updates its isFocused state to false', function() {
                var vm = new TextField().$mount();
                vm._onFocus();
                expect(vm.state.isFocused).to.be.true;

                vm._onBlur({
                    e : mockedEvent,
                });

                expect(vm.state.isFocused).to.be.false;
            });

            it('clear the value if the clear prop was given', function() {
                var value = 'test',
                    vm = new TextField({ propsData : { clear : true }}).$mount();

                vm._onFocus();
                expect(vm.state.isFocused).to.be.true;
                expect(vm.isClearVisible).to.be.false;
                expect(vm.hasAction).to.be.true;

                vm.setValue(value);
                expect(vm.getValue()).to.equal(value);

                mockedEvent.relatedTarget = vm.$refs.action;

                vm._onBlur({
                    e : mockedEvent
                });

                expect(vm.getValue()).to.equal('');
            });

        });

        it('changes its value when the bound prop is changed', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-textfield ref="textfield" v-bind:value="value"></wc-textfield>',
                data : function() {
                    return {
                        value : 'test'
                    };
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.textfield.state.value).to.equal(vm.value);

            vm.value = 'example';
            vm.$nextTick(function() {
                expect(vm.$refs.textfield.state.value).to.equal(vm.value);
                done();
            });
        });

        it('generates the action content if the slot is given', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-textfield ref="textfield"><span slot="action"></span></wc-textfield>'
            });

            var vm = new ParentComponent().$mount();

            expect(vm.$refs.textfield.$refs.action).to.not.be.null;
            expect(vm.$refs.textfield.$refs.action).to.not.be.undefined;
            expect(vm.$refs.textfield.hasAction).to.be.true;
        });

        context('#_onKeyPress', function() {
            it('prevents KeyPress events for entering non-numeric characters', function() {
                var vm = new TextField({ propsData : { type : 'number' }}).$mount(),
                    spy = sinon.spy();

                var mockedEvent = {
                    key : 'a',
                    keyCode : 97,
                    charCode : 97,
                    preventDefault : spy,
                    target : {
                        value : ''
                    }
                };

                vm._onKeyPress(mockedEvent);
                expect(spy.callCount).to.equal(1);
            });

            it('handles dot (.) inputs', function() {
                var vm = new TextField({ propsData : { type : 'number' }}).$mount(),
                    spy = sinon.spy();

                var mockedEvent = {
                    key : '.',
                    keyCode : 46,
                    charCode : 46,
                    preventDefault : spy,
                    target : {
                        value : '1'
                    }
                };

                vm._onKeyPress(mockedEvent);
                expect(spy.callCount).to.equal(0);

                var mockedEvent2 = {
                    key : '.',
                    keyCode : 46,
                    charCode : 46,
                    preventDefault : spy,
                    target : {
                        value : '1.2'
                    }
                };

                vm._onKeyPress(mockedEvent2);
                expect(spy.callCount).to.equal(1);
            });

            it('handles hyphens (-) when the signed prop is given', function() {
                var vm = new TextField({ propsData : { type : 'number', signed : true }}).$mount(),
                    spy = sinon.spy();

                var mockedEvent1 = {
                    key : '-',
                    keyCode : 45,
                    charCode : 45,
                    preventDefault : spy,
                    target : {
                        value : ''
                    }
                };

                vm._onKeyPress(mockedEvent1);
                expect(spy.callCount).to.equal(0);

                var mockedEvent2 = {
                    key : '-',
                    keyCode : 45,
                    charCode : 45,
                    preventDefault : spy,
                    target : {
                        value : '-'
                    }
                };

                vm._onKeyPress(mockedEvent2);
                expect(spy.callCount).to.equal(1);
            });
        });
    });
});
