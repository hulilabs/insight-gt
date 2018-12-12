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
 * @file search selector unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/search-selector/search-selector_component
 * @module test/web-components/search/search-selector/search-selector_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/search/search-selector/search-selector_component'
],
function(
    Vue,
    VueTestHelper,
    SearchSelector
) {

    describe('SearchSelector', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new SearchSelector().$mount();
                VueTestHelper.checkDefinedProps({
                    isSelfContained : false,
                    isMobile : false,
                    notFoundLabel : 'not found',
                    placeholder : null,
                    dataSource : [],
                    value : null
                }, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    isSelfContained : true,
                    isMobile : true,
                    notFoundLabel : 'No lo encuentro',
                    placeholder : 'placeholders',
                    dataSource : [
                        {
                            text : 'Costa Rica',
                            avatar : '/site/img/doctor-male.svg',
                            hint : 'America',
                            value : 1,
                            icon : 'icon-lock',
                            disabled : true
                        },
                        {
                            text : 'Mexico',
                            avatar : '/site/img/doctor-male.svg',
                            hint : 'America',
                            value : 2
                        }
                    ],
                    value : null
                };
                var vm = new SearchSelector({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets the state on focus', function() {
                var setValueSpy = sinon.spy(),
                    openMenuSpy = sinon.spy(),
                    clearSpy = sinon.spy(),
                    props = {
                        isSelfContained : true,
                        isMobile : true,
                        notFoundLabel : 'No lo encuentro',
                        value : 1,
                        dataSource : [
                            {
                                text : 'Costa Rica',
                                avatar : '/site/img/doctor-male.svg',
                                hint : 'America',
                                value : 1,
                                icon : 'icon-lock',
                                disabled : true
                            },
                            {
                                text : 'Mexico',
                                avatar : '/site/img/doctor-male.svg',
                                hint : 'America',
                                value : 2
                            }
                        ]
                    };

                var vm = new SearchSelector({propsData : props}).$mount();
                vm.$refs = {
                    autocomplete : {
                        setValue : setValueSpy,
                        openMenu : openMenuSpy,
                        clear : clearSpy
                    }
                };
                vm._onFocus();
                expect(vm.state.focused).to.be.true;

            });

            it('sets the state on menu closed', function() {
                var setValueSpy = sinon.spy(),
                    checkSelectedOptionSpy = sinon.spy(),
                    props = {
                        isSelfContained : true,
                        isMobile : true,
                        notFoundLabel : 'No lo encuentro',
                        dataSource : [
                            {
                                text : 'Costa Rica',
                                avatar : '/site/img/doctor-male.svg',
                                hint : 'America',
                                value : 1,
                                icon : 'icon-lock',
                                disabled : true
                            },
                            {
                                text : 'Mexico',
                                avatar : '/site/img/doctor-male.svg',
                                hint : 'America',
                                value : 2
                            }
                        ]
                    };

                var vm = new SearchSelector({propsData : props}).$mount();
                vm.$refs = {
                    autocomplete : {
                        setValue : setValueSpy,
                        checkSelectedOption : checkSelectedOptionSpy
                    }
                };
                vm._onMenuClosed();
                expect(vm.state.focused).to.be.false;

            });

            it('sets the appropiate class object', function(){
                var props = {
                    isSelfContained : true,
                    isMobile : true,
                    notFoundLabel : 'No lo encuentro',
                    dataSource : [
                        {
                            text : 'Costa Rica',
                            avatar : '/site/img/doctor-male.svg',
                            hint : 'America',
                            value : 1,
                            icon : 'icon-lock',
                            disabled : true
                        },
                        {
                            text : 'Mexico',
                            avatar : '/site/img/doctor-male.svg',
                            hint : 'America',
                            value : 2
                        }
                    ]
                };

                var vm = new SearchSelector({propsData : props}).$mount();
                vm.state.focused = true;
                expect(vm.classObject).to.deep.equal({
                    'is-focused' : true,
                    'is-self-contained' : true,
                });
            });
        });
    });
});
