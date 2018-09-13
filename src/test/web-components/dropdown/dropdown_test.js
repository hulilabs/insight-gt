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
 * @file Dropdown unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/dropdowns/dropdown_component
 * @module test/web-components/dropdowns/dropdown_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/dropdowns/dropdown_component',
    'web-components/utils/keyboard'
],
function(
    Vue,
    VueTestHelper,
    Dropdown,
    KeyboardUtil
) {
    describe('Dropdown', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-dropdown', Dropdown);
        });

        function createDropdownComponent() {
            var Component = Vue.extend({
                template :
                    '<wc-dropdown ' +
                        'v-bind:options="options" ' +
                        'ref="dropdown">' +
                    '</wc-dropdown>',
                data : function() {
                    return {
                        options : [
                            {
                                text : 'A-option',
                                value : 1
                            },{
                                text : 'B-option',
                                value : 2
                            },{
                                text : 'C-option',
                                value : 3
                            }
                        ]
                    };
                }
            });

            return new Component().$mount();
        }

        context('on instance creation', function() {

            it('sets props with default values', function() {
                var props = {
                    altPlaceholder : null,
                    charCounter : false,
                    disabled : false,
                    ellipsis : false,
                    errorMessage : null,
                    floatingLabel : false,
                    modifier : null,
                    hasError : false,
                    hintText : null,
                    native : false,
                    label : null,
                    options : [],
                    placeholder : null,
                    required : false,
                    setIconOnly : false,
                    value : null,
                    hideInputHighlighter : false,
                    showSecondaryStyle : false,
                    actionDisabled : false,
                    color : null
                };

                var vm = new Dropdown({ propsData : { options : [] } }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets desktop props with custom values', function() {
                var props = {
                    altPlaceholder : 'test',
                    charCounter : true,
                    disabled : true,
                    ellipsis : true,
                    errorMessage : 'test',
                    floatingLabel : true,
                    modifier : null,
                    hasError : true,
                    hintText : 'test',
                    native : false,
                    label : 'test',
                    options : [{
                        text : 'test',
                        value : 1,
                        iconClass : 'test'
                    }],
                    placeholder : 'test',
                    setIconOnly : true,
                    required : true,
                    value : 1,
                    hideInputHighlighter : true,
                    showSecondaryStyle : true,
                    actionDisabled : true,
                    color : '#D2126F'
                };

                var vm = new Dropdown({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets mobile props with custom values', function() {
                var props = {
                    altPlaceholder : 'test',
                    charCounter : true,
                    disabled : true,
                    ellipsis : false,
                    errorMessage : 'test',
                    floatingLabel : true,
                    modifier : null,
                    hasError : true,
                    hintText : 'test',
                    native : true,
                    label : 'test',
                    options : [{
                        text : 'test',
                        value : 1,
                        iconClass : 'test'
                    }],
                    placeholder : 'test',
                    setIconOnly : true,
                    required : true,
                    value : 1,
                    hideInputHighlighter : true,
                    showSecondaryStyle : true,
                    actionDisabled : true,
                    color : '#D2126F'
                };

                var vm = new Dropdown({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('native component', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-dropdown ' +
                            'v-bind:alt-placeholder="altPlaceholder" ' +
                            'v-bind:floatingLabel="true" ' +
                            'v-bind:label="label" ' +
                            'v-bind:native="true" ' +
                            'v-bind:options="options" ' +
                            'v-bind:placeholder="label" ' +
                            'ref="dropdown">' +
                        '</wc-dropdown>',
                    data : function() {
                        return {
                            options : [
                                {
                                    text : 'test1',
                                    value : 1
                                },{
                                    text : 'test2',
                                    value : 2
                                },{
                                    text : 'test3',
                                    value : 3
                                }
                            ],
                            altPlaceholder : 'test',
                            label : 'test'
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('emmits the ON_CHANGE event with the select\'s value', function() {
                var dropdown = vm.$refs.dropdown;

                dropdown.setValue('1');

                var setValueStub = sinon.stub(dropdown, 'setValue'),
                    setInputTextStub = sinon.stub(dropdown, 'setInputText');

                dropdown.$refs.select.value = '1';

                dropdown._onMobileChangeHandler();

                expect(dropdown.getValue()).to.equal('1');
                expect(setValueStub.callCount).to.equal(1);
                expect(setInputTextStub.callCount).to.equal(1);
            });
        });

        context('on key events', function() {
            var vm;

            beforeEach(function() {
                vm = createDropdownComponent();
            });

            it('handles search', function() {
                var spy = sinon.spy();

                vm.$refs.dropdown._searchKeyInOptions({
                    keyCode : 66,
                    preventDefault : spy
                });

                expect(spy.callCount).to.equal(1);
            });

            it('handles space key', function() {
                var dropdown = vm.$refs.dropdown;

                dropdown.handleSpaceKey();

                expect(dropdown.$refs.dropdownMenu.state.isActive).to.equal(true);
            });
        });

        context('on setting values', function() {
            var vm;

            before(function() {
                vm = createDropdownComponent();
            });

            it('sets the state value', function() {
                var dropdown = vm.$refs.dropdown,
                    options = dropdown.options;

                dropdown.setValue(options[0].value);
                dropdown.setInputText(options[0].text);

                expect(dropdown.getValue()).to.equal(1);
                expect(dropdown.getInputText()).to.equal('A-option');
            });

            it('clears the values', function() {
                var dropdown = vm.$refs.dropdown;
                dropdown._clear();
                expect(dropdown.getInputText()).to.equal(null);
            });

            it('correctly watches the value', function(done) {
                var dropdown = vm.$refs.dropdown,
                    options = dropdown.options,
                    spy = sinon.spy(),
                    newValue = options[options.length - 1].value;

                dropdown.value = newValue;
                dropdown._checkSelectedOption = spy;

                dropdown.$nextTick(function() {
                    expect(dropdown.value).to.equal(newValue);
                    expect(dropdown.state.value).to.equal(newValue);
                    expect(spy.callCount).to.equal(1);
                    done();
                });
            });
        });

        context('click event', function() {
            var vm;

            before(function() {
                vm = createDropdownComponent();
            });

            it('in a dropdown menu option', function(done) {
                var dropdown = vm.$refs.dropdown;

                // Menu must be opened for the inner items to be visible
                dropdown.$refs.dropdownMenu.open();

                dropdown.$nextTick(function() {
                    var menuItem = dropdown.$refs.dropdownMenu.$children[1],
                        setAvatarStub = sinon.stub(dropdown, 'setAvatar'),
                        setColorStub = sinon.stub(dropdown, 'setColor'),
                        setInputTextStub = sinon.stub(dropdown, 'setInputText'),
                        setValueStub = sinon.stub(dropdown, 'setValue');


                    dropdown._selectOption(menuItem);

                    expect(setAvatarStub.callCount).to.equal(1);
                    expect(setColorStub.callCount).to.equal(1);
                    expect(setInputTextStub.callCount).to.equal(1);
                    expect(setValueStub.callCount).to.equal(1);

                    done();
                });
            });
        });

        context('bind new options', function() {
            var vm;

            before(function() {
                vm = createDropdownComponent();
            });

            it('in a dropdown menu option', function(done) {
                var dropdown = vm.$refs.dropdown,
                    processOptionsStub = sinon.stub(dropdown, '_processOptions');

                vm.options = [
                    {
                        text : 'A-option',
                        value : 1
                    },{
                        text : 'B-option',
                        value : 2
                    },{
                        text : 'C-option',
                        value : 3
                    }
                ];

                Vue.nextTick(function() {
                    expect(processOptionsStub.callCount).to.equal(1);
                    done();
                });
            });
        });

        context('positioning', function() {
            var vm;

            beforeEach(function() {
                vm = createDropdownComponent();
            });

            it('gets the index of the current selected value for the placeholder', function() {
                var dropdown = vm.$refs.dropdown;

                expect(dropdown._getSelectedOptionIndex(dropdown.getValue())).to.equal(null);
            });

            it('gets the index of the current selected value', function() {
                expect(vm.$refs.dropdown._getSelectedOptionIndex(1)).to.equal(0);
            });

            it('move dropdown menu to the placeholder position', function() {
                var dropdown = vm.$refs.dropdown;

                // the expected position will be the size of an item (48px) plus
                // the margin in the dropdown
                var expected = -58;
                expect(dropdown._moveMenuToSelectedItem({
                    calculatedPosition : -40,
                    dimensions : {
                        floating : {
                            height : 150
                        },
                        trigger : {
                            parentViewportTop : 350
                        }
                    }
                }) === expected).to.equal(true);
            });

            it('move dropdown menu to the selected value position', function() {
                var dropdown = vm.$refs.dropdown;

                dropdown.setValue(2);

                expect(dropdown._moveMenuToSelectedItem({
                    calculatedPosition : 40,
                    dimensions : {
                        floating : {
                            height : 150
                        },
                        trigger : {
                            parentViewportTop : 0
                        }
                    }
                }) < 0).to.equal(true);
            });
        });

        context('#_detectKeydown', function() {

            it('keydown right arrow', function(){
                var vm = createDropdownComponent(),
                    dropdown = vm.$refs.dropdown,
                    searchKeyInOptionsStub = sinon.stub(dropdown, '_searchKeyInOptions'),
                    spy = sinon.spy();

                dropdown._detectKeydown({
                    keyCode : KeyboardUtil.CODE.RIGHT,
                    preventDefault : spy
                });

                expect(searchKeyInOptionsStub.callCount).to.equal(0);
                expect(spy.callCount).to.equal(1);
            });


            it('keydown character', function(){
                var vm = createDropdownComponent(),
                    dropdown = vm.$refs.dropdown,
                    searchKeyInOptionsStub = sinon.stub(dropdown, '_searchKeyInOptions');

                dropdown._detectKeydown({
                    keyCode : 65 // letter 'A'
                });

                expect(searchKeyInOptionsStub.callCount).to.equal(1);
            });
        });
    });
});
