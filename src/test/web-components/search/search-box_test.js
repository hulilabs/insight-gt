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
 * @file SearchBox unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/search-box/search-box_component
 * @module test/web-components/search/search-box/search-box_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/search/search-box/search-box_component'
],
function(
    Vue,
    VueTestHelper,
    SearchBox
) {
    var getEventData = function(value) {
        return {
            target : {
                value : value
            }
        };
    };

    describe('SearchBox', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-search-box', SearchBox);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new SearchBox().$mount();
                VueTestHelper.checkDefinedProps({
                    customClass : null,
                    delay : null,
                    placeholder : null,
                    text : null,
                    active : false
                }, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    customClass : 'wc-CustomTestClass',
                    delay : 100,
                    placeholder : 'Type something',
                    text : 'test',
                    active : true
                };
                var vm = new SearchBox({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('check reset function', function() {
                var vm = new SearchBox().$mount(),
                    callSpy = sinon.spy();
                vm.state.focused = true;
                vm.state.placeholderReady = true;
                vm.$on(SearchBox.EVENT.ON_CLOSE, callSpy);
                vm._reset();
                expect(vm.state.focused).to.be.false;
                expect(vm.state.focused).to.be.false;
                expect(callSpy.callCount).to.equal(1);
            });

            it('checks the event when the remove button is clicked', function() {
                var vm = new SearchBox().$mount(),
                    callSpy = sinon.spy();
                    vm.$on(SearchBox.EVENT.ON_SEARCH, callSpy);
                    vm._onActionClick();
                    vm.$nextTick(function() {
                        vm._onRemoveClick();
                        expect(callSpy.callCount).to.equal(1);
                    });
            });

            it('checks the event when input is entered', function() {
                var data = [
                    [getEventData('foobar'), true],
                    [getEventData(''), false],
                    [getEventData('  '), false],
                    [getEventData(null), true]
                ];
                for (var i = 0; i < data.length; i++) {
                    var vm = new SearchBox().$mount(),
                        callSpy = sinon.spy(),
                        val = data[i];

                    vm.$on(SearchBox.EVENT.ON_SEARCH, callSpy);
                    vm._onInputHandler(val[0]);
                    // the event is called once
                    expect(callSpy.callCount).to.equal(1);
                    // the input passed to the spy corresponds to expected values
                    expect(callSpy.calledWith(val[0].target.value)).to.be.equal(val[1]);
                }
            });

            it('checks the on debounce event', function() {
                var vm = new SearchBox().$mount();
                vm._onInputDebounce(getEventData('foobar'));
                // the debounce function is now set.
                expect(vm.state.debounce).to.be.an('Function');
            });

            it('checks the event when the action button is clicked', function() {
                var vm = new SearchBox().$mount();
                vm._onActionClick();
                expect(vm.state.focused).to.be.true;
            });

            it('checks the callback on blur', function() {
                var vm = new SearchBox().$mount();
                vm.state.placeholderReady = true;
                vm._onBlur();
                expect(vm.state.placeholderReady).to.be.false;
                expect(vm.state.displayHideAnimation).to.be.true;
            });

            it('changes its focused state when the active bound prop is changed', function(done) {
                var vm = new Vue({
                    template : '<wc-search-box ref="search" v-bind:active="active"></wc-search-box>',
                    data : function() {
                        return {
                            active : true
                        };
                    }
                }).$mount();

                expect(vm.$refs.search.state.focused).to.be.true;

                vm.active = false;

                vm.$nextTick(function() {
                    expect(vm.$refs.search.state.focused).to.be.false;
                    done();
                });
            });
        });
    });
});
