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
        'web-components/buttons/image/image-button_component'
    ],
    function(
        Vue,
        VueTestHelper,
        ImageButton
    ) {
        describe('ImageButton', function() {
            before(function() {
                // registering the component globally
                Vue.component('wc-image-button', ImageButton);
            });

            context('on instance creation', function() {
                it('sets props with default values', function() {
                    var props = {
                        allowSingleSelection : false,
                        checked : false,
                        customValue : null,
                        disabled : false,
                        name : null,
                        path : '/site/img/doctor-male.svg',
                        subtitle : null,
                        title : null,
                        value : null
                    };

                    var vm = new ImageButton({ propsData : { path : '/site/img/doctor-male.svg' }}).$mount();
                    VueTestHelper.checkDefinedProps(props, vm);
                });

                it('sets props with custom values', function() {
                    var props = {
                        allowSingleSelection : true,
                        checked : false,
                        customValue : 'custom',
                        disabled : true,
                        name : 'name',
                        path : '/site/img/doctor-male.svg',
                        subtitle : null,
                        title : null,
                        value : 'value'
                    };

                    var vm = new ImageButton({ propsData : props }).$mount();
                    VueTestHelper.checkDefinedProps(props, vm);
                });

                it('doesn\'t set attributes that are not default', function() {
                    var vm = new ImageButton({propsData : {
                        path : '/site/img/doctor-male.svg',
                        value : 'value'
                    }}).$mount(),
                        inputElement = vm.$el.querySelector('input');

                    expect(inputElement.attributes.disabled).to.not.exist;
                    expect(inputElement.attributes.name).to.not.exist;
                    expect(inputElement.checked).to.be.false;
                });

            });

            it('sets imageButton <input> attributes', function() {
                var props = {
                    disabled : true,
                    path : '/site/img/doctor-male.svg',
                    name : 'name',
                    customValue : 'value'
                };

                var vm = new ImageButton({ propsData : props }).$mount();

                var inputElement = vm.$el.querySelector('input');
                expect(inputElement.attributes.disabled.value).to.equal('disabled');
                expect(inputElement.attributes.name.value).to.equal('name');
                expect(inputElement.attributes.value.value).to.equal('value');
            });

            context('on id generation', function() {
                it('generates random pseudo ids', function() {
                    var vm = new ImageButton({propsData : {
                        value : 'v',
                        path : '/site/img/doctor-male.svg'
                    }}).$mount();
                    expect(vm.pseudoId).to.be.a.string;

                    var vm2 = new ImageButton({propsData : {
                        value : 'v',
                        path : '/site/img/doctor-male.svg'
                    }}).$mount();
                    expect(vm2.pseudoId).to.be.a.string;

                    expect(vm2.pseudoId).to.not.equal(vm.pseudoId);
                });
            });

            it('triggers input event when the selection changes', function() {
                var imageButton = (new ImageButton({propsData : {
                    value : 'v',
                    path : '/site/img/doctor-male.svg'
                }})).$mount(),
                    callSpy = sinon.spy();

                imageButton.$on(imageButton.events.ON_INPUT, callSpy);
                imageButton._toggle();
                expect(callSpy.callCount).to.equal(1);
            });

            it('reads currently checked state', function() {
                var imageButton = (new ImageButton({propsData : {
                    value : 'v',
                    path : '/site/img/doctor-male.svg'
                }})).$mount();

                expect(imageButton.isChecked()).to.be.false;
                expect(imageButton.$refs.input.checked).to.be.false;
                imageButton._toggle();
                expect(imageButton.isChecked()).to.be.true;
                expect(imageButton.$refs.input.checked).to.be.true;

                imageButton._onFocus();
                expect(imageButton.state.isFocused).to.be.true;
                imageButton._onBlur();
                expect(imageButton.state.isFocused).to.be.false;
            });
        });
    });
