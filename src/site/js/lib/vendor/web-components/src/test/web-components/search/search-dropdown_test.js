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
 * @file SearchDropdown unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/search-box/search-dropdown_component
 * @module test/web-components/search/search-dropdown/search-dropdown_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/search/search-dropdown/search-dropdown_component',
    'web-components/utils/keyboard'
],
function(
    Vue,
    VueTestHelper,
    SearchDropdown,
    KeyboardUtil
) {
    var _getProps = function(custom) {
        var props = {
            animate : false,
            dataSource : [],
            notFoundLabel : 'Not found',
            outline : false,
            placeholder : 'Type something',
            rows : 4,
            text : null,
            useThumbnail : false
        };
        if (custom) {
            Object.assign(props, custom);
        }
        return props;
    };

    describe('SearchDropdown', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();
                VueTestHelper.checkDefinedProps(_getProps(), vm);
            });

            it('sets props with custom values', function() {
                var props = _getProps({
                    animate : true,
                    dataSource : [{value : 1, text : 'abc'}],
                    notFoundLabel : 'notFoundLabel',
                    outline : true,
                    placeholder : 'placeholder',
                    rows : 10,
                    text : 'test',
                    useThumbnail : true
                });
                var vm = new SearchDropdown({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('check menu open/close listeners', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();
                vm._onMenuOpen();
                expect(vm.state.isMenuActive).to.be.true;
                vm._onMenuClose();
                expect(vm.state.isMenuActive).to.be.false;
            });

            it('checks the event when the user selects an item', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount(),
                    callSpy = sinon.spy();

                    vm.$on(SearchDropdown.EVENT.ON_SELECT, callSpy);
                    vm._selectItem(1, 'foo');
                    expect(callSpy.callCount).to.equal(1);
            });

            it('checks the event when input is entered', function() {
                var data = [
                    ['foobar', true, 1],
                    ['', false, 0],
                    [null, false, 0]
                ];
                for (var i = 0; i < data.length; i++) {
                    var vm = new SearchDropdown({propsData : _getProps()}).$mount(),
                        callSpy = sinon.spy(),
                        val = data[i];

                    vm.$on(SearchDropdown.EVENT.ON_SEARCH, callSpy);
                    vm._onInputHandler(val[0]);
                    // the event is called once
                    expect(callSpy.callCount).to.equal(val[2]);
                    // the input passed to the spy corresponds to expected values
                    expect(callSpy.calledWith(val[0])).to.be.equal(val[1]);

                    vm._onInputClosed();
                    expect(vm.$refs.menu.getActive()).to.be.false;
                }
            });

            it('check computed', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();
                expect(vm.getMenuStyle.height).to.be.equal('304px');

                vm = new SearchDropdown({propsData : _getProps({rows : 10})}).$mount();
                expect(vm.getMenuStyle.height).to.be.equal('736px');
            });

            it('check dataSource', function(done) {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();
                vm.dataSource = [
                    {
                        text : 'foo bar',
                        title : '<strong>foo</strong> bar',
                        subtitle : 'bar@test.com'
                    }
                ];

                vm.$nextTick(function() {
                    expect(vm.state.isResultEmpty).to.be.false;
                    done();
                });
            });
        });

        context('destroy', function() {

            it('remove listeners', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount(),
                    removeListenerStub = sinon.stub(window, 'removeEventListener');
                vm.$destroy();
                expect(removeListenerStub.callCount).to.equal(1);
                // Remove stub
                window.removeEventListener.restore();
            });
        });

        context('#_preventWindowUpDownKeys', function() {

            it('down key', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();

                var dummyEvent = {
                    keyCode : KeyboardUtil.CODE.DOWN,
                    stopPropagation : sinon.spy(),
                    preventDefault : sinon.spy()
                };

                vm._preventWindowUpDownKeys(dummyEvent);

                expect(dummyEvent.stopPropagation.callCount).to.equal(1);
                expect(dummyEvent.preventDefault.callCount).to.equal(1);
            });

            it('up key', function() {
                var vm = new SearchDropdown({propsData : _getProps()}).$mount();

                var dummyEvent = {
                    keyCode : KeyboardUtil.CODE.UP,
                    stopPropagation : sinon.spy(),
                    preventDefault : sinon.spy()
                };

                vm._preventWindowUpDownKeys(dummyEvent);

                expect(dummyEvent.stopPropagation.callCount).to.equal(1);
                expect(dummyEvent.preventDefault.callCount).to.equal(1);
            });
        });
    });
});