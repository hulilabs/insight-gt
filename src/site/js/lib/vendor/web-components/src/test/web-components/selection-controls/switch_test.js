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
 * @file Switch unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/switch/switch_component
 * @module test/web-components/switchs/switch_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/selection-controls/switch/switch_component',
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    Switch,
    SelectionControlFocusBehavior
) {
    describe('Switch', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-switch', Switch);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    customValue : null,
                    disabled : false,
                    name : null,
                    value : null
                };

                var vm = new Switch().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    customValue : 'custom',
                    disabled : true,
                    name : 'name',
                    value : 'value'
                };

                var vm = new Switch({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets checkbox <input> attributes', function() {
                var props = {
                    disabled : true,
                    name : 'name',
                    customValue : 'value',
                    value : 'value'
                };

                var vm = new Switch({ propsData : props }).$mount();

                var inputElement = vm.$el.querySelector('input');
                expect(inputElement.attributes.disabled.value).to.equal('disabled');
                expect(inputElement.attributes.name.value).to.equal('name');
                expect(inputElement.attributes.value.value).to.equal('value');
            });

            it('doesn\'t set attributes that are not default', function() {
                var vm = new Switch({propsData : { customValue : 'v' }}).$mount(),
                    inputElement = vm.$el.querySelector('input');

                expect(inputElement.attributes.disabled).to.not.exist;
                expect(inputElement.attributes.name).to.not.exist;
                expect(inputElement.checked).to.be.false;
            });
        });

        context('on id generation', function() {
            it('generates random pseudo ids', function() {
                var vm = new Switch({propsData : {value : 'v'}}).$mount();
                expect(vm.pseudoId).to.be.a.string;

                var vm2 = new Switch({propsData : {value : 'v'}}).$mount();
                expect(vm2.pseudoId).to.be.a.string;

                expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
            });

            it('applies same id to input and label', function() {
                var vm = new Switch({propsData : {value : 'v'}}).$mount(),
                    inputElement = vm.$el.querySelector('input'),
                    labelElement = vm.$el.querySelector('label');

                expect(inputElement.attributes.id.value).to.equal(labelElement.attributes.for.value);
            });

        });

        it('calls _onChange when value changes', function() {
            var sw = (new Switch({propsData : {value : 'v'}})).$mount(),
                changeSpy = sinon.spy(sw, '_onChange');
            sw._toggle();
            changeSpy.restore();
        });

        it('applies ripple on change', function() {
            var vm = (new Switch({propsData : {value : 'v'}})).$mount(),
                rippleSpy = sinon.spy(vm.$refs.ripple, 'animate');

            vm._toggle();
            expect(rippleSpy.callCount).to.equal(1);

            rippleSpy.restore();
        });

        it('sends array containing customValue as payload when checked with a customValue given', function(done) {
            var vm = new Switch({ propsData : { customValue : 'test', value : [] } }).$mount(),
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

    });
});
