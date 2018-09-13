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
    'web-components/selection-controls/toggle/toggle-button_component',
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    ToggleButton,
    SelectionControlFocusBehavior
) {
    describe('ToggleButton', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-toggle-button', ToggleButton);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    customValue : null,
                    disabled : false,
                    name : null,
                    value : null
                };

                var vm = new ToggleButton().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    customValue : 'custom',
                    disabled : true,
                    name : 'name',
                    value : 'value'
                };

                var vm = new ToggleButton({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('doesn\'t set attributes that are not default', function() {
                var vm = new ToggleButton({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input');

                expect(inputElement.attributes.disabled).to.not.exist;
                expect(inputElement.attributes.name).to.not.exist;
                expect(inputElement.checked).to.be.false;
            });

        });

        it('sets toggleButton <input> attributes', function() {
            var props = {
                disabled : true,
                name : 'name',
                customValue : 'value'
            };

            var vm = new ToggleButton({ propsData : props }).$mount();

            var inputElement = vm.$el.querySelector('input');
            expect(inputElement.attributes.disabled.value).to.equal('disabled');
            expect(inputElement.attributes.name.value).to.equal('name');
            expect(inputElement.attributes.value.value).to.equal('value');
        });

        it('checks boolean toggleButton element when the bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-toggle-button v-model="value" ref="toggleButton"></wc-toggle-button>',
                data : function() {
                    return {
                        value : false
                    };
                }
            }).$mount();

            expect(vm.$refs.toggleButton.state.value).to.equal(vm.value);

            vm.value = true;

            vm.$nextTick(function() {
                expect(vm.$refs.toggleButton.state.value).to.be.true;
                expect(vm.$refs.toggleButton.getInput().checked).to.be.true;
                done();
            });
        });

        context('on id generation', function() {
            it('generates random pseudo ids', function() {
                var vm = new ToggleButton({propsData : {value : 'v'}}).$mount();
                expect(vm.pseudoId).to.be.a.string;

                var vm2 = new ToggleButton({propsData : {value : 'v'}}).$mount();
                expect(vm2.pseudoId).to.be.a.string;

                expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
            });

            it('applies same id to input and label', function() {
                var vm = new ToggleButton({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input'),
                    labelElement = vm.$el.querySelector('label');

                expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
            });

        });

        it('triggers input event when the selection changes', function() {
            var toggleButton = (new ToggleButton({propsData : {value : 'v'}})).$mount(),
                callSpy = sinon.spy();

                toggleButton.$on(toggleButton.events.ON_INPUT, callSpy);
                toggleButton._toggle();
                expect(callSpy.callCount).to.equal(1);
        });

        it('reads currently checked state', function() {
            var toggleButton = (new ToggleButton({propsData : {value : 'v'}})).$mount();
            expect(toggleButton.isChecked()).to.be.false;
            expect(toggleButton.$refs.input.checked).to.be.false;
            toggleButton._toggle();
            expect(toggleButton.isChecked()).to.be.true;
            expect(toggleButton.$refs.input.checked).to.be.true;
        });

        it('toggles', function() {
            var toggleButton = (new ToggleButton({propsData : {value : 'v'}})).$mount();
            expect(toggleButton.isChecked()).to.be.false;
            toggleButton._toggle();
            expect(toggleButton.isChecked()).to.be.true;
        });

        it('calls _onChange when value changes', function() {
            var toggleButton = (new ToggleButton({propsData : {value : 'v'}})).$mount(),
                changeSpy = sinon.spy(toggleButton, '_onChange');
            toggleButton._toggle();
            changeSpy.restore();
        });

        context('#_onChange', function() {
            it ('triggers the ON_INPUT event with the given custom value when checked', function(done) {
                var vm = new ToggleButton({ propsData : { customValue : 'test' }}).$mount(),
                    onChangeSpy = sinon.spy();

                expect(vm.getInput().checked).to.be.false;

                vm.$on('input', function(payload) {
                    expect(payload).to.equal('test');
                    onChangeSpy();
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(onChangeSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers ON_INPUT event with null when unchecked', function(done) {
                var vm = (new ToggleButton({propsData : { customValue : 'test', value : 'test' }})).$mount(),
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
                var vm = (new ToggleButton()).$mount(),
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
