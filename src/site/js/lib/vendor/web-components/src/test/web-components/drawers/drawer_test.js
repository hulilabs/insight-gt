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
/* global expect, describe, it, context, sinon, before, beforeEach */
define([
    'vue',
    'vuex',
    'test/helpers/vue-components',
    'web-components/drawers/drawer_component'
],
function(
    Vue,
    Vuex,
    VueTestHelper,
    Drawer
) {
    describe('Drawer', function() {

        before(function() {
            Vue.component('wc-drawer', Drawer);
            Vue.use(Vuex);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new Drawer().$mount();
                expect(vm.active).to.equal(false);
                expect(vm.action).to.equal(undefined);
                expect(vm.swipe).to.equal(true);
            });

            it('sets props with custom values', function() {
                var vm = new Drawer({
                    propsData : {
                        active : true,
                        action : 'theVuexAction',
                        swipe : false
                    }
                }).$mount();
                expect(vm.active).to.equal(true);
                expect(vm.action).to.equal('theVuexAction');
                expect(vm.swipe).to.equal(false);
            });
        });

        it('#open', function() {
            var vm = new Drawer().$mount();
            // default value
            expect(vm.state.isActive).to.equal(false);
            vm.open();
            expect(vm.state.isActive).to.equal(true);
        });

        it('#close', function() {
            var vm = new Drawer().$mount();
            // default value
            expect(vm.state.isActive).to.equal(false);
            vm.open();
            expect(vm.state.isActive).to.equal(true);
            vm.close();
            expect(vm.state.isActive).to.equal(false);
        });

        it('#toggle', function() {
            var vm = new Drawer().$mount();
            // default value
            expect(vm.state.isActive).to.equal(false);
            // true
            vm.toggle();
            expect(vm.state.isActive).to.equal(true);
            // false
            vm.toggle();
            expect(vm.state.isActive).to.equal(false);
        });

        it('changes its state when the "active" prop is bound', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-drawer ref="drawer" v-bind:active="status"></wc-drawer>',
                data : function() {
                    return {
                        status : true
                    };
                }
            });
            var vm = new ParentComponent().$mount();
            // checking the parent status
            expect(vm.status).to.equal(true);
            // checking the drawer value bound to the parent status
            expect(vm.$refs.drawer.state.isActive).to.equal(true);
            // updating the state of the parent
            vm.status = false;
            vm.$nextTick(function() {
                // checking the parent status
                expect(vm.status).to.equal(false);
                // checking the drawer value bound to the parent status
                expect(vm.$refs.drawer.state.isActive).to.equal(false);
                done();
            });
        });

        context('on content generation', function() {
            it('generates "content" slot', function() {
                // drawer content
                var content = '<div slot="content"><button>Close</button></div>';
                // expected generated content
                var generatedContent = '<div><button>Close</button></div>';
                var ParentComponent = Vue.extend({
                    template : '<wc-drawer ref="drawer">' + content + '</wc-drawer>',
                    data : function() {
                        return {};
                    },
                    components : {
                        drawer : Drawer
                    }
                });
                var vm = new ParentComponent().$mount();
                var drawerNavContent = vm.$refs.drawer.$el.getElementsByClassName('wc-Drawer__content')[0].innerHTML;
                expect(generatedContent).to.equal(drawerNavContent);
            });
        });

        context('properly triggers vuex actions', function() {
            it('change', function() {
                // spy for the vuex action
                var spyAction = sinon.spy();
                // spy for the event binding
                var spyEvent = sinon.spy();
                var ParentComponent = Vue.extend({
                    template : '<wc-drawer ref="drawer" action="changeDrawer" v-on:change="_onDrawerChange"></wc-drawer>',
                    data : function() {
                        return {};
                    },
                    store : new Vuex.Store({
                        actions : {
                            changeDrawer : spyAction
                        }
                    }),
                    methods : {
                        _onDrawerChange : spyEvent
                    }
                });
                var vm = new ParentComponent().$mount();
                vm.$refs.drawer.open();
                // checks the payload of the action
                expect(spyAction.firstCall.args[1]).to.deep.equal({
                    active : true
                });
                vm.$refs.drawer.toggle();
                vm.$refs.drawer.toggle();
                // the action must be called three times, for each change
                expect(spyAction.callCount).to.equal(3);
                // the event should not triggered if using actions
                expect(spyEvent.callCount).to.equal(0);
            });
        });

        describe('#_triggerState', function() {
            context('when there is a state change', function() {
                it('triggers the event with the correct arguments', function() {
                    var spy = sinon.spy();
                    var ParentComponent = Vue.extend({
                        template : '<wc-drawer ref="drawer" v-on:change="_onDrawerChange"></wc-drawer>',
                        methods : {
                            _onDrawerChange : spy
                        }
                    });
                    var vm = new ParentComponent().$mount();
                    // first call, opening the nav
                    vm.$refs.drawer._setActive(true, false);
                    vm.$refs.drawer._triggerState();
                    expect(spy.firstCall.args[0]).to.deep.equal({
                        active : true
                    });
                    // second call, closing the nav
                    vm.$refs.drawer._setActive(false, false);
                    vm.$refs.drawer._triggerState();
                    expect(spy.secondCall.args[0]).to.deep.equal({
                        active : false
                    });
                    expect(spy.callCount).to.equal(2);
                });
            });
        });

        describe('#_setActive', function() {
            var vm = null;
            var spy = null;

            beforeEach(function() {
                spy = sinon.spy();
                vm = new Drawer().$mount();
                vm._triggerState = spy;
            });

            it('changes the state depending on the parameter "active"', function() {
                vm._setActive(true);
                expect(vm.state.isActive).to.equal(true);
                vm._setActive(false);
                expect(vm.state.isActive).to.equal(false);
            });

            it('triggers the event when the parameter "triggerState" is not defined', function() {
                vm._setActive(true);
                expect(spy.callCount).to.equal(1);
            });

            it('triggers the event when the parameter "triggerState" is true', function() {
                vm._setActive(true, true);
                expect(spy.callCount).to.equal(1);
            });

            it('doesn\'t trigger the event when the parameter "triggerState" is false', function() {
                vm._setActive(true, false);
                expect(spy.callCount).to.equal(0);
            });

            it('doesn\'t trigger the event when there are not parameters', function() {
                vm._setActive();
                expect(spy.callCount).to.equal(0);
            });
        });
    });
});
