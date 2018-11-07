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
 * @file Autocomplete unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/autocompletes/autocomplete_component
 * @module test/web-components/autocomplete/autocomplete_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/autocompletes/autocomplete_component'
],
function(
    Vue,
    VueTestHelper,
    Autocomplete
) {
    describe('Autocomplete', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-autocomplete', Autocomplete);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    isLoadingMore : false,
                    addItemLabel : null,
                    allowAddingItems : false,
                    bufferLimitForRequest : 2,
                    charCounter : false,
                    dataSource : [],
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
                    hasError : false,
                    hintText : null,
                    isMobile : false,
                    label : null,
                    maxLength : null,
                    minLength : null,
                    modifier : null,
                    notFoundLabel : '',
                    placeholder : null,
                    required : false,
                    search : false,
                    fullWidth : false,
                    hideSelectedAvatar : false,
                    hideInputHighlighter : false,
                    showSecondaryStyle : false,
                    showSelectedOption : false,
                    actionDisabled : false,
                    text : null,
                    value : null,
                    multiline: false,
                    color : null
                };

                var vm = new Autocomplete({
                    propsData : {
                        notFoundLabel : '',
                        dataSource : []
                    }
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    isLoadingMore : true,
                    addItemLabel : 'Agregar',
                    allowAddingItems : true,
                    bufferLimitForRequest : 3,
                    charCounter : false,
                    dataSource : [{
                        text : 'test',
                        value : 1
                    }],
                    disabled : false,
                    errorMessage : 'error message',
                    floatingLabel : true,
                    hasError : false,
                    hintText : null,
                    isMobile : true,
                    label : 'label',
                    maxLength : 255,
                    minLength : null,
                    modifier : 'is-headline',
                    notFoundLabel : 'No se encontró',
                    placeholder : 'placeholder',
                    required : true,
                    search : true,
                    fullWidth : true,
                    hideInputHighlighter : true,
                    hideSelectedAvatar : true,
                    showSecondaryStyle : true,
                    showSelectedOption : true,
                    actionDisabled : false,
                    text : null,
                    value : 1,
                    multiline: true,
                    color : '#D2126F'
                };

                var vm = new Autocomplete({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('on value set', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template : '<wc-autocomplete ' +
                                    'ref="autocomplete" ' +
                                    'v-bind:data-source="options" ' +
                                    'v-bind:value="value" ' +
                                    'add-item-label="Agregar" ' +
                                    'not-found-label="No se encuentra">' +
                                '</wc-autocomplete>',
                    data : function() {
                        return {
                            value : 1,
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                },
                                {
                                    text : 'test2',
                                    value : 2
                                },
                                {
                                    text : 'test3',
                                    value : 3
                                }
                            ]
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('checks the selected option', function() {
                var autocomplete = vm.$refs.autocomplete;

                expect(autocomplete.state.value).to.equal(1);
            });
        });

        context('on clicking menu scrollbar', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template : '<wc-autocomplete ' +
                                    'ref="autocomplete" ' +
                                    'v-bind:data-source="options" ' +
                                    'v-bind:value="value" ' +
                                    'add-item-label="Agregar" ' +
                                    'not-found-label="No se encuentra">' +
                                '</wc-autocomplete>',
                    data : function() {
                        return {
                            value : 1,
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                },
                                {
                                    text : 'test2',
                                    value : 2
                                },
                                {
                                    text : 'test3',
                                    value : 3
                                }
                            ]
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('handles the menu mousedown event', function() {
                var autocomplete = vm.$refs.autocomplete;

                var containsStub = sinon.stub(autocomplete.$el, 'contains', function() {
                    return true;
                });

                autocomplete._handleMenuMousedown({
                    target : {
                        classList : {
                            contains : function() {
                                return true;
                            }
                        }
                    }
                });

                expect(containsStub.callCount).to.equal(1);
                expect(autocomplete.state.isMenuTargeted).to.be.true;
            });

            it('handles the menu mouseup event', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete.state.isMenuTargeted = true;

                autocomplete._handleMenuMouseup();

                expect(autocomplete.state.isMenuTargeted).to.be.false;
            });
        });

        context('on scroll positioning', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template : '<wc-autocomplete ' +
                                    'ref="autocomplete" ' +
                                    'v-bind:data-source="options" ' +
                                    'add-item-label="Agregar" ' +
                                    'not-found-label="No se encuentra">' +
                                '</wc-autocomplete>',
                    data : function() {
                        return {
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                },
                                {
                                    text : 'test2',
                                    value : 2
                                },
                                {
                                    text : 'test3',
                                    value : 3
                                },
                                {
                                    text : 'test4',
                                    value : 4
                                },
                                {
                                    text : 'test5',
                                    value : 5
                                },
                                {
                                    text : 'test6',
                                    value : 6
                                },
                                {
                                    text : 'test7',
                                    value : 7
                                }
                            ]
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('knows that the menu fits inside the viewport', function() {
                vm.$refs.autocomplete._checkMenuOutOfScreen();

                expect(vm.$refs.autocomplete._getMenuHeight()).to.equal(296);
                expect(vm.$refs.autocomplete._getInputHeight()).to.equal(52);
            });
        });

        context('on interacting with events of the input', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template : '<wc-autocomplete ' +
                                    'ref="autocomplete" ' +
                                    'v-bind:data-source="options" ' +
                                    'v-bind:value="1" ' +
                                    'v-bind:search="true" ' +
                                    'v-bind:is-mobile="true" ' +
                                    'add-item-label="Agregar" ' +
                                    'not-found-label="No se encuentra">' +
                                '</wc-autocomplete>',
                    data : function() {
                        return {
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                }
                            ]
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('focus the autocomplete input', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete.focus();

                expect(autocomplete.state.isInputFocused).to.be.true;
            });

            it('clears the autocomplete input', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete.clear(true);

                expect(autocomplete.getValue()).to.equal(null);
                expect(autocomplete.getInputText()).to.equal(null);
            });

            it('change the isInputFocused state to true', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete._onInputFocus();

                expect(autocomplete.state.isInputFocused).to.be.true;
            });

            it('handles the click event of the input', function() {
                var autocomplete = vm.$refs.autocomplete,
                    spy = sinon.spy();

                autocomplete.state.isInputFocused = true;

                autocomplete._onInputClick({
                    stopPropagation : spy
                });

                expect(spy.callCount).to.equal(1);
            });

            it('change the isInputFocused state to false', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete._onInputBlur('test', { relatedTarget : null });

                expect(autocomplete.state.isInputFocused).to.be.false;

                var containsStub = sinon.stub(autocomplete.$el, 'contains', function() {
                    return true;
                });

                autocomplete._onInputBlur('test', { relatedTarget : { foo : 'bar' } });

                expect(containsStub.callCount).to.equal(1);
                expect(autocomplete.state.isInputFocused).to.be.false;

            });

            it('open or close the menu', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete.openMenu();

                expect(autocomplete.state.isMenuOpened).to.be.true;

                autocomplete.closeMenu();

                expect(autocomplete.state.isMenuOpened).to.be.false;

                var openMenuStub = sinon.stub(autocomplete, 'openMenu'),
                    closeMenuStub = sinon.stub(autocomplete, 'closeMenu'),
                    dummyTestMatch = 'test1',
                    dummyTest = 'a';

                autocomplete._onInputHandler(null);

                autocomplete.setInputText(dummyTestMatch);
                autocomplete._onInputHandler(dummyTestMatch);

                expect(openMenuStub.callCount).to.equal(1);

                autocomplete._onInputHandler(dummyTest);

                expect(closeMenuStub.callCount).to.equal(1);
            });

            it('handle the window event', function() {
                var spy = sinon.spy();

                vm.$refs.autocomplete._preventWindowUpDownKeys({
                    keyCode : 38,
                    preventDefault : spy,
                    stopPropagation : spy
                });

                expect(spy.callCount).to.equal(2);
            });

            it('clears the input text', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete.clear();

                expect(autocomplete.getInputText()).to.equal(null);
                expect(autocomplete.getValue()).to.equal(null);
            });
        });

        context('on handling option selection', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template : '<wc-autocomplete ' +
                                    'ref="autocomplete" ' +
                                    'v-bind:allow-adding-items="true" ' +
                                    'v-bind:data-source="options" ' +
                                    'add-item-label="Agregar" ' +
                                    'not-found-label="No se encuentra">' +
                                '</wc-autocomplete>',
                    data : function() {
                        return {
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                }
                            ]
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('normal option is selected', function() {
                var autocomplete = vm.$refs.autocomplete;

                autocomplete._setSelectedOption({
                    text : 'test1',
                    value : 1
                });

                expect(autocomplete.getValue()).to.equal(1);
            });

            it('add new option is selected', function() {
                var autocomplete = vm.$refs.autocomplete,
                    emitStub = sinon.stub(autocomplete, '$emit');

                autocomplete._addNewItem('test2');
                expect(emitStub.callCount).to.equal(1);
            });
        });
    });
});
