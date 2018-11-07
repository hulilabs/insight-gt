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
 * @file Expandable panel unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/panels/expandable-panel/expandable-panel_component
 * @module test/web-components/panels/expandable-panel_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/panels/expandable-panel/expandable-panel_component'
],
function(
    Vue,
    VueTestHelper,
    ExpandablePanel
) {
    describe('ExpandablePanel', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-expandable-panel', ExpandablePanel);
        });

        context('on instance creation', function() {

            it('sets props with default values', function() {
                var props = {
                    title : null
                };

                var vm = new ExpandablePanel().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    title : 'Testing title'
                };

                var vm = new ExpandablePanel({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                // Bypasses text field events
                var EVENT = {
                    ON_TOGGLE : 'expandable-panel-toggle'
                };

                VueTestHelper.checkExposedEvents(EVENT, ExpandablePanel);
            });
        });

        it('#_onToggleClick', function(done) {
            var vm = new ExpandablePanel().$mount(),
                spy = sinon.spy();

            // Initialize the panel opened
            expect(vm.state.isOpened).to.be.true;

            // Attach an spy on delete action
            vm.$on(ExpandablePanel.EVENT.ON_TOGGLE, spy);
            vm._onToggleClick();

            vm.$nextTick(function() {
                // The panel should be closed and the callback was called
                expect(vm.state.isOpened).to.be.false;
                expect(spy.callCount).to.equal(1);
                done();
            });
        });
    });
});
