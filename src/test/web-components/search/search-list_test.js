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
 * @requires web-components/search-list/search-list_component
 * @module test/web-components/search/search-list/search-selector_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/search/search-list/search-list_component'
],
function(
    Vue,
    VueTestHelper,
    SearchList
) {

    describe('SearchList', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-search-list', SearchList);
        });

        before(function() {
            // registering the component globally
            Vue.component('wc-search-list', SearchList);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new SearchList().$mount();
                VueTestHelper.checkDefinedProps({
                    search : true,
                    notFoundLabel : 'not found',
                    placeholder : null,
                    loading : true,
                    loadingLabel : 'loading',
                    searching : false,
                    searchingLabel : 'searching',
                    dataSource : [],
                    value : null
                }, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    search : true,
                    notFoundLabel : 'No lo encuentro',
                    placeholder : 'placeholders',
                    loading : true,
                    loadingLabel : 'loading',
                    searching : false,
                    searchingLabel : 'searching',
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
                var vm = new SearchList({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('correctly shows an icon when it is supposed to', function() {

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();

            expect(vm._showItemIcon(1, 'icon')).to.be.truly;
        });

        it('correctly gets an icon when it is supposed to', function() {

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();

            expect(vm._getItemIcon(1, false, 'icon')).to.equal('icon-check');
            expect(vm._getItemIcon(2, false, 'icon')).to.equal('icon');
        });

        it('correctly filters options', function() {

            var props = {
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
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm.state.text = 'costa';
            vm._onInputHandler();

            expect(vm.state.options.length).to.equal(1);
        });

        it('correctly handles the input with search flag', function() {

            var props = {
                search : true,
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
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm.state.text = 'costa';
            vm._onInputHandler();

            expect(vm.state.isTyping).to.equal(true);
        });

        it('correctly uses external data source with search flag', function() {

            var newDataSource = [
                {
                    text : 'Mexico',
                    avatar : '/site/img/doctor-male.svg',
                    hint : 'America',
                    value : 2
                }
            ];

            var props = {
                search : true,
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
                    }
                ],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm.dataSource = newDataSource;

            expect(vm.options).to.equal(newDataSource);
        });

        it('correctly selects an item', function() {

            var selectedOption = {
                text : 'Mexico',
                avatar : '/site/img/doctor-male.svg',
                hint : 'America',
                value : 2
            };

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm._onItemSelected(selectedOption);

            expect(vm.state.text).to.equal(selectedOption.text);
            expect(vm.state.avatar).to.equal(selectedOption.avatar);
            expect(vm.state.value).to.equal(selectedOption.value);
        });

        it('correctly sets the input focus', function() {

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm._onInputFocus();

            expect(vm.state.focused).to.be.truly;
        });

        it('correctly sets the input blur', function() {

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm._onInputBlur();

            expect(vm.state.focused).to.be.falsy;
        });

        it('correctly clears the values', function() {

            var selectedOption = {
                text : 'Mexico',
                avatar : '/site/img/doctor-male.svg',
                hint : 'America',
                value : 2
            };

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();
            vm._onItemSelected(selectedOption);
            vm._clear();

            expect(vm.state.text).to.equal(null);
            expect(vm.state.avatar).to.equal(null);
            expect(vm.state.value).to.equal(null);
        });

        it('correctly watches the dataSource', function(done) {

            var ParentComponent = Vue.extend({
                template : '<wc-search-list ref="searchList" not-found-label="test" v-bind:data-source="dataSource"></wc-search-list>',
                data : function() {
                    return {
                        dataSource : []
                    };
                }
            });

            var vm = new ParentComponent().$mount(),
                searchList = vm.$refs.searchList;

            expect(searchList.dataSource.length).to.equal(0);

            var spy = sinon.spy();
            searchList._onInputHandler = spy;

            vm.dataSource = [
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
            ];

            vm.$nextTick(function() {
                expect(spy.callCount).to.equal(1);
                expect(searchList.dataSource.length).to.equal(2);
                done();
            });
        });

        it('correctly watches the searching prop', function(done) {


            var ParentComponent = Vue.extend({
                template : '<wc-search-list ref="searchList" not-found-label="test" v-bind:searching="searching"></wc-search-list>',
                data : function() {
                    return {
                        searching : false
                    };
                }
            });

            var vm = new ParentComponent().$mount(),
                searchList = vm.$refs.searchList;

            expect(searchList.state.isTyping).to.equal(false);
            vm.searching = true;

            vm.$nextTick(function() {
                expect(searchList.state.isTyping).to.equal(true);
                done();
            });
        });

        it('has the correct data structure', function() {

            var props = {
                notFoundLabel : 'No lo encuentro',
                placeholder : 'placeholders',
                dataSource : [],
                value : 1
            };
            var vm = new SearchList({propsData : props}).$mount();

            var data = {
                state : {
                    focused : false,
                    value : 1,
                    text : '',
                    avatar : '',
                    options : [],
                    isTyping : false,
                    typingTimeout : null
                }
            }

            var str = JSON.stringify(vm.$data);
                expected = JSON.stringify(data);

            expect(str).to.equal(expected);
        });


        it('has correct default prop values', function() {

            var props = {
                notFoundLabel : 'not found',
                dataSource : []
            };
            var vm = new SearchList({propsData : props}).$mount();

            expect(vm.placeholder).to.equal(null);
            expect(vm.value).to.equal(null);
        });
    });
});
