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
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    Checkbox,
    SelectionControlFocusBehavior
) {
    describe('Checkbox', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-checkbox', Checkbox);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    customValue : null,
                    disabled : false,
                    name : null,
                    value : null,
                    color : null
                };

                var vm = new Checkbox().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    customValue : 'custom',
                    disabled : true,
                    name : 'name',
                    value : 'value',
                    color : 'red'
                };

                var vm = new Checkbox({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('doesn\'t set attributes that are not default', function() {
                var vm = new Checkbox({propsData : { customValue : 'v' }}).$mount(),
                    inputElement = vm.$el.querySelector('input');

                expect(inputElement.attributes.disabled).to.not.exist;
                expect(inputElement.attributes.name).to.not.exist;
                expect(inputElement.checked).to.be.false;
            });

        });

        it('sets checkbox <input> attributes', function() {
            var props = {
                disabled : true,
                name : 'name',
                customValue : 'value'
            };

            var vm = new Checkbox({ propsData : props }).$mount();

            var inputElement = vm.$el.querySelector('input');
            expect(inputElement.attributes.disabled.value).to.equal('disabled');
            expect(inputElement.attributes.name.value).to.equal('name');
            expect(inputElement.attributes.value.value).to.equal('value');
        });

        it('checks boolean checkbox element when the bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-checkbox v-model="value" ref="checkbox"></wc-checkbox>',
                data : function() {
                    return {
                        value : false
                    };
                }
            }).$mount();

            expect(vm.$refs.checkbox.state.value).to.equal(vm.value);

            vm.value = true;

            vm.$nextTick(function() {
                expect(vm.$refs.checkbox.state.value).to.be.true;
                expect(vm.$refs.checkbox.getInput().checked).to.be.true;
                done();
            });
        });

        it('checks custom value checkbox element when an array bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-checkbox v-model="value" custom-value="test" ref="checkbox"></wc-checkbox>',
                data : function() {
                    return {
                        value : []
                    };
                }
            }).$mount();

            expect(vm.$refs.checkbox.state.value).to.equal(vm.value);

            vm.value = ['test'];

            vm.$nextTick(function() {
                expect(vm.$refs.checkbox.state.value).to.equal(vm.value);
                expect(vm.$refs.checkbox.getInput().checked).to.be.true;
                done();
            });
        });

        context('on id generation', function() {
            it('generates random pseudo ids', function() {
                var vm = new Checkbox({propsData : {value : 'v'}}).$mount();
                expect(vm.pseudoId).to.be.a.string;

                var vm2 = new Checkbox({propsData : {value : 'v'}}).$mount();
                expect(vm2.pseudoId).to.be.a.string;

                expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
            });

            it('applies same id to input and label', function() {
                var vm = new Checkbox({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input'),
                    labelElement = vm.$el.querySelector('label');

                expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
            });

        });

        it('binds smart focus behavior', function() {
            var focusBindSpy = sinon.spy(SelectionControlFocusBehavior.prototype, 'bind');

            var checkbox = (new Checkbox({propsData : {value : 'v'}})).$mount();
            expect(focusBindSpy.callCount).to.equal(1);
            // will just check that the proper arguments were passed
            expect(focusBindSpy.thisValues[0].inputElement).to.equal(checkbox.$refs.input);
            expect(focusBindSpy.thisValues[0].componentFocusManager).to.equal(checkbox.$refs.ripple);
            expect(focusBindSpy.firstCall.args).to.deep.equal([checkbox, {changeEvent : checkbox.events.ON_INPUT}]);

            focusBindSpy.restore();
        });

        it('triggers input event when the selection changes', function() {
            var checkbox = (new Checkbox({propsData : {value : 'v'}})).$mount(),
                callSpy = sinon.spy();

                checkbox.$on(checkbox.events.ON_INPUT, callSpy);
                checkbox._toggle();
                expect(callSpy.callCount).to.equal(1);
        });

        it('applies ripple on input', function() {
            var checkbox = (new Checkbox({propsData : { customValue : 'v' }})).$mount(),
                rippleSpy = sinon.spy(checkbox.$refs.ripple, 'animate');

            checkbox._toggle();
            expect(rippleSpy.callCount).to.equal(1);

            rippleSpy.restore();
        });

        it('reads currently checked state', function() {
            var checkbox = (new Checkbox({propsData : { customValue : 'v' }})).$mount();
            expect(checkbox.isChecked()).to.be.false;
            expect(checkbox.$refs.input.checked).to.be.false;
            checkbox._toggle();
            expect(checkbox.isChecked()).to.be.true;
            expect(checkbox.$refs.input.checked).to.be.true;
        });

        it('toggles', function() {
            var checkbox = (new Checkbox({propsData : { customValue : 'v' }})).$mount();
            expect(checkbox.isChecked()).to.be.false;
            checkbox._toggle();
            expect(checkbox.isChecked()).to.be.true;
        });

        it('calls _onChange when value changes', function() {
            var checkbox = (new Checkbox({propsData : {value : 'v'}})).$mount(),
                changeSpy = sinon.spy(checkbox, '_onChange');
            checkbox._toggle();
            changeSpy.restore();
        });

        context('#_onChange', function() {
            it('sends true as value as payload when checked and no customValue prop is given', function(done) {
                var vm = new Checkbox().$mount(),
                    onChangeSpy = sinon.spy();

                expect(vm.getInput().checked).to.be.false;

                vm.$on('input', function(payload) {
                    expect(payload).to.be.true;
                    onChangeSpy();
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(onChangeSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('sends array containing customValue as payload when checked with a customValue given', function(done) {
                var vm = new Checkbox({ propsData : { customValue : 'test', value : [] } }).$mount(),
                    onChangeSpy = sinon.spy();

                expect(vm.getInput().checked).to.be.false;

                vm.$on('input', function(payload) {
                    expect(payload).to.deep.equal(['test']);
                    onChangeSpy();
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(onChangeSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('sends empty array as payload when unchecked with a customValue given', function(done) {
                var vm = new Checkbox({ propsData : { customValue : 'test', value : ['test'] } }).$mount(),
                    onChangeSpy = sinon.spy();

                expect(vm.getInput().checked).to.be.true;

                vm.$on('input', function(payload) {
                    expect(payload).to.deep.equal([]);
                    onChangeSpy();
                });

                vm._toggle();

                vm.$nextTick(function() {
                    expect(onChangeSpy.callCount).to.equal(1);
                    done();
                });
            });
        });
    });
});
