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
 * @file Tabs unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/tabs/tab_component
 * @requires web-components/tabs/tabs_component
 * @module test/web-components/tabs/tabs_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tabs/tab_component',
    'web-components/tabs/tabs_component'
],
function(
    Vue,
    VueTestHelper,
    Tab,
    Tabs
) {

    var getEvent = function(type, touch) {
        var touchEvent = document.createEvent('Event');
            touchEvent.initEvent(type, true, true);

        return touchEvent;
    };

    describe('Tabs', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-tab', Tab);
            Vue.component('wc-tabs', Tabs);

            // Mockup requestAnimationFrame
            window.requestAnimationFrame = function(callback) { callback(); }
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = { selected : null },
                    vm = new Tabs({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with numeric custom value', function() {
                var props = { selected : 0 },
                    vm = new Tabs({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with string custom value', function() {
                var props = { selected : 'test' },
                    vm = new Tabs({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                var EVENT = {
                    ON_CHANGE : 'tabs-change',
                };

                VueTestHelper.checkExposedEvents(EVENT, Tabs);
            });
        });

        it('properly generates tabs', function() {
            var tabsDefinition = [
                '<wc-tab>foo</wc-tab>',
                '<wc-tab>bar</wc-tab>',
                '<wc-tab>hello</wc-tab>',
                '<wc-tab>world</wc-tab>'
            ];

            var ParentComponent = Vue.extend({
                template : '<wc-tabs ref="tabs">' + tabsDefinition.join('') + '</wc-tabs>'
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.tabs.$children.length).to.equal(tabsDefinition.length);
        });

        context('when clicking an item', function() {

            it('changes the selected item', function() {
                var tabsDefinition = [
                    '<wc-tab>foo</wc-tab>',
                    '<wc-tab ref="tabItem" index="bar">bar</wc-tab>',
                    '<wc-tab>hello</wc-tab>',
                    '<wc-tab>world</wc-tab>'
                ];

                var ParentComponent = Vue.extend({
                    template : '<wc-tabs ref="tabs">' + tabsDefinition.join('') + '</wc-tabs>'
                });

                var vm = new ParentComponent().$mount(),
                    $tabs = vm.$refs.tabs,
                    moveIndicatorSpy = sinon.spy($tabs, '_moveIndicator'),
                    scrollToTabSpy = sinon.spy($tabs, '_scrollToTab');

                // Mockup a click event on tabItem
                vm.$refs.tabItem.$el.dispatchEvent(getEvent('click'));

                // The selected item was changed
                expect($tabs.state.selected).to.be.equal('bar');
                expect(scrollToTabSpy.called).to.be.true;
                expect(moveIndicatorSpy.called).to.be.true;
            });

            // There is currently no way to mock the scrollable view
            it('scrolls to the selected item');
        });

        it('on window resize', function() {
            var customIndex = 'selected';

            var tabsDefinition = [
                '<wc-tab>foo</wc-tab>',
                '<wc-tab>bar</wc-tab>',
                '<wc-tab>hello</wc-tab>',
                '<wc-tab>world</wc-tab>',
                '<wc-tab index="' + customIndex + '">test</wc-tab>'
            ];

            var ParentComponent = Vue.extend({
                template : '<wc-tabs ref="tabs">' + tabsDefinition.join('') + '</wc-tabs>'
            });

            var vm = new ParentComponent().$mount(),
                $tabs = vm.$refs.tabs,
                moveIndicatorSpy = sinon.spy($tabs, '_moveIndicator');

            $tabs.setSelected(customIndex);
            $tabs._onWindowResizedHandler();
            expect(moveIndicatorSpy.called).to.be.true;
        });

        context('#setSelected', function() {

            it('sets a default numeric index as selected', function() {
                var tabsDefinition = [
                    '<wc-tab>foo</wc-tab>',
                    '<wc-tab>bar</wc-tab>',
                    '<wc-tab>hello</wc-tab>',
                    '<wc-tab>world</wc-tab>'
                ];

                var ParentComponent = Vue.extend({
                    template : '<wc-tabs ref="tabs">' + tabsDefinition.join('') + '</wc-tabs>'
                });

                var vm = new ParentComponent().$mount();
                vm.$refs.tabs.setSelected(0);
                expect(vm.$refs.tabs.state.selected).to.equal(0);
            });

            it('sets a custom index as selected', function() {
                var customIndex = 'custom';

                var tabsDefinition = [
                    '<wc-tab>foo</wc-tab>',
                    '<wc-tab>bar</wc-tab>',
                    '<wc-tab>hello</wc-tab>',
                    '<wc-tab>world</wc-tab>',
                    '<wc-tab index="' + customIndex + '">test</wc-tab>'
                ];

                var ParentComponent = Vue.extend({
                    template : '<wc-tabs ref="tabs">' + tabsDefinition.join('') + '</wc-tabs>'
                });

                var vm = new ParentComponent().$mount();
                vm.$refs.tabs.setSelected(customIndex);
                expect(vm.$refs.tabs.state.selected).to.equal(customIndex);
            });
        });
    });
});
