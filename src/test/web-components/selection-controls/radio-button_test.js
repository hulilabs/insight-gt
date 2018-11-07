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
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/selection-controls/radio-button/radio-button_component',
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    RadioButton,
    SelectionControlFocusBehavior
) {
    describe('RadioButton', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-radio-button', RadioButton);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    customValue : null,
                    disabled : false,
                    name : null,
                    value : null
                };

                var vm = new RadioButton().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    customValue : 'custom',
                    disabled : true,
                    name : 'name',
                    value : 'value'
                };

                var vm = new RadioButton({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('doesn\'t set attributes that are not default', function() {
                var vm = new RadioButton({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input');

                expect(inputElement.attributes.disabled).to.not.exist;
                expect(inputElement.attributes.name).to.not.exist;
                expect(inputElement.checked).to.be.false;
            });

        });

        it('sets radio button <input> attributes', function() {
            var props = {
                disabled : true,
                name : 'name',
                customValue : 'value'
            };

            var vm = new RadioButton({ propsData : props }).$mount();

            var inputElement = vm.$el.querySelector('input');
            expect(inputElement.attributes.disabled.value).to.equal('disabled');
            expect(inputElement.attributes.name.value).to.equal('name');
            expect(inputElement.attributes.value.value).to.equal('value');
        });

        it('checks radio button element when the bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-radio-button v-model="value" custom-value="test" ref="radioButton"></wc-radio-button>',
                data : function() {
                    return {
                        value : null
                    };
                }
            }).$mount();

            expect(vm.$refs.radioButton.state.value).to.equal(vm.value);

            vm.value = 'test';

            vm.$nextTick(function() {
                expect(vm.$refs.radioButton.state.value).to.be.equal('test');
                expect(vm.$refs.radioButton.$refs.input.checked).to.be.true;
                done();
            });
        });

        context('on id generation', function() {
            it('generates random pseudo ids', function() {
                var vm = new RadioButton({propsData : {value : 'v'}}).$mount();
                expect(vm.pseudoId).to.be.a.string;

                var vm2 = new RadioButton({propsData : {value : 'v'}}).$mount();
                expect(vm2.pseudoId).to.be.a.string;

                expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
            });

            it('applies same id to input and label', function() {
                var vm = new RadioButton({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input'),
                    labelElement = vm.$el.querySelector('label');

                expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
            });

        });

        it('binds smart focus behavior', function() {
            var focusBindSpy = sinon.spy(SelectionControlFocusBehavior.prototype, 'bind');

            var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount();
            expect(focusBindSpy.callCount).to.equal(1);
            // will just check that the proper arguments were passed
            expect(focusBindSpy.thisValues[0].inputElement).to.equal(radioButton.$refs.input);
            expect(focusBindSpy.thisValues[0].componentFocusManager).to.equal(radioButton.$refs.ripple);
            expect(focusBindSpy.firstCall.args).to.deep.equal([radioButton, {changeEvent : radioButton.events.ON_INPUT}]);

            focusBindSpy.restore();
        });

        it('triggers change event when the selection changes', function() {
            var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount(),
                callSpy = sinon.spy();

                radioButton.$on(radioButton.events.ON_INPUT, callSpy);
                radioButton._toggle();
                expect(callSpy.callCount).to.equal(1);
        });

        it('applies ripple on change', function() {
            var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount(),
                rippleSpy = sinon.spy(radioButton.$refs.ripple, 'animate');

            radioButton._toggle();
            expect(rippleSpy.callCount).to.equal(1);

            rippleSpy.restore();
        });

        it('reads currently checked state', function() {
            var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount();
            expect(radioButton.isChecked()).to.be.false;
            expect(radioButton.$refs.input.checked).to.be.false;
            radioButton._toggle();
            expect(radioButton.isChecked()).to.be.true;
            expect(radioButton.$refs.input.checked).to.be.true;
        });

        it('toggles', function() {
            var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount();
            expect(radioButton.isChecked()).to.be.false;
            radioButton._toggle();
            expect(radioButton.isChecked()).to.be.true;
        });

        context('#_onChange', function() {
            it('calls _onChange when value changes', function() {
                var radioButton = (new RadioButton({propsData : {value : 'v'}})).$mount(),
                    changeSpy = sinon.spy(radioButton, '_onChange');
                radioButton._toggle();
                expect(changeSpy.callCount).to.equal(1);
                changeSpy.restore();
            });

            it('triggers ON_INPUT event with the given custom value when checked', function(done) {
                var vm = (new RadioButton({propsData : { customValue : 'test' }})).$mount(),
                    changeSpy = sinon.spy(vm, '_onChange');

                vm.$on('input', function(payload) {
                    expect(payload).to.equal('test');
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(changeSpy.callCount).to.equal(1);
                    done();
                });

            });

            it('triggers ON_INPUT event with null when unchecked', function(done) {
                var vm = (new RadioButton({propsData : { customValue : 'test', value : 'test' }})).$mount(),
                    changeSpy = sinon.spy(vm, '_onChange');

                vm.$on('input', function(payload) {
                    expect(payload).to.equal(null);
                });

                expect(vm.isChecked()).to.be.true;

                vm._toggle();

                vm.$nextTick(function() {
                    expect(changeSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers ON_INPUT event with a boolean when checked and no custom value is given', function(done) {
                var vm = (new RadioButton()).$mount(),
                    changeSpy = sinon.spy(vm, '_onChange');

                vm.$on('input', function(payload) {
                    expect(payload).to.be.boolean;
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(changeSpy.callCount).to.equal(1);
                    done();
                });
            });
        });
    });
});
