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
                    active : false,
                    animate : false,
                    delay : null,
                    outline : false,
                    placeholder : null,
                    text : null
                }, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    active : true,
                    animate : true,
                    delay : 100,
                    outline : true,
                    placeholder : 'Type something',
                    text : 'test'
                };
                var vm = new SearchBox({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
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
        });

        context('#_onBlur', function() {
            it('loose focus', function() {
                var vm = new SearchBox({ propsData : { active : true }}).$mount();
                vm._onBlur();
                expect(vm.state.expanded).to.be.true;
                expect(vm.state.focused).to.be.false;
            });
            it('refocus on action click', function() {
                var vm = new SearchBox({ propsData : { active : true }}).$mount(),
                    actionElem = vm.$refs.actionIcon.$el,
                    callSpy = sinon.spy();
                vm.$on(SearchBox.EVENT.ON_CLOSE, callSpy);
                vm.$on(SearchBox.EVENT.ON_TOGGLE, callSpy);
                vm._onBlur({ relatedTarget : actionElem });
                expect(vm.state.expanded).to.be.true;
                expect(callSpy.callCount).to.be.zero;
            });
        });

        context('#_setExpanded', function() {
            it('expand', function() {
                var vm = new SearchBox().$mount();
                vm._setExpanded(true);
                expect(vm.state.expanded).to.be.true;
            });
            it('collapse', function(done) {
                var vm = new SearchBox().$mount(),
                    callSpy = sinon.spy();
                vm.$on(SearchBox.EVENT.ON_CLOSE, callSpy);
                vm._setExpanded(false);
                expect(vm.state.expanded).to.be.false;
                vm.$nextTick(function() {
                    expect(callSpy.callCount).to.be.equal(1);
                    done();
                });
            });
        });

        context('when watching prop', function() {
            it('active', function(done) {
                var vm = new SearchBox({ propsData : { active : false }}).$mount();
                expect(vm.active).to.be.false;
                // Become active
                vm.active = true;
                vm.$nextTick(function() {
                    expect(vm.active).to.be.true;
                    expect(vm.state.focused).to.be.true;
                    expect(vm.state.expanded).to.be.true;
                    done();
                });
            });
            it('text', function(done) {
                var vm = new SearchBox({ propsData : { text : 'test1' }}).$mount(),
                    callSpy = sinon.spy();
                vm.$on(SearchBox.EVENT.ON_SEARCH, callSpy);
                expect(vm.text).to.be.equal('test1');
                // Become active
                vm.text = 'test2';
                vm.$nextTick(function() {
                    expect(vm.text).to.be.equal('test2');
                    expect(vm.state.expanded).to.be.true;
                    expect(vm.state.input).to.be.equal('test2');
                    expect(callSpy.callCount).to.be.equal(1);
                    done();
                });
            });
        });
    });
});
