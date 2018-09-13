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
/* global expect, describe, it, context, before, sinon, console */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/lists/list-item_component'
],
function(
    Vue,
    VueTestHelper,
    ListItem
) {
    describe('ListItem', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-list-item', ListItem);
        });

        context('on instance creation', function() {
            var spy;
            before(function() {
                spy = sinon.spy();
                console.error = spy;
            });

            it('sets props with default values', function() {
                VueTestHelper.checkDefinedProps({
                    blockClass : [],
                    expanded : false,
                    horizontalPadding : 2,
                    layout : 'single',
                    disabled : false,
                    primaryTextClass : undefined,
                    secondaryTextClass : undefined,
                    wrapperClass : [],
                    value : null,
                    multiline: false
                }, new ListItem().$mount());
            });

            it('sets props with valid values', function() {
                var props = {
                    blockClass : [],
                    expanded : true,
                    horizontalPadding : 3,
                    layout : 'single',
                    disabled : false,
                    primaryTextClass : 'classes',
                    secondaryTextClass : 'classes',
                    wrapperClass : [],
                    value : 1,
                    multiline: true
                };
                VueTestHelper.checkDefinedProps(props, new ListItem({ propsData : props }).$mount());
                expect(spy.callCount).to.equal(0);

                props.layout = 'double';
                VueTestHelper.checkDefinedProps(props, new ListItem({ propsData : props }).$mount());
                expect(spy.callCount).to.equal(0);

                props.layout = 'triple';
                VueTestHelper.checkDefinedProps(props, new ListItem({ propsData : props }).$mount());
                expect(spy.callCount).to.equal(0);
            });

            it('warms the user when set props with invalid values', function() {
                var props = {
                    blockClass : ['blockCustomClass'],
                    expanded : false,
                    horizontalPadding : 2,
                    layout : 'invalidProp',
                    disabled : false,
                    value : null,
                    primaryTextClass : 'classes',
                    secondaryTextClass : 'classes',
                    wrapperClass : ['wrapperCustomClass'],
                    multiline: 34
                };
                VueTestHelper.checkDefinedProps(props, new ListItem({ propsData : props }).$mount());
                expect(spy.callCount).to.equal(2);
            });
        });

        context('on using setters', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-list>' +
                            '<wc-list-item ref="listItem">Click me!<div slot="description">Hi!</div></wc-list-item>' +
                        '</wc-list>'
                });

                vm = new Component().$mount();
            });

            it('sets the expanded state', function() {
                var listItem = vm.$refs.listItem;

                listItem.setExpanded(true);

                expect(listItem.state.isExpanded).to.be.true;
            });
        });
    });
});
