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
    'web-components/dialogs/dialog/dialog_component'
],
function(
    Vue,
    Vuex,
    VueTestHelper,
    Dialog
) {
    describe('Dialog', function() {
        before(function() {
            // registering the dialog globally
            Vue.component('wc-dialog', Dialog);
            Vue.use(Vuex);
        });
        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new Dialog().$mount();
                var props = {
                    active : false,
                    action : undefined,
                    closeOnClick : true,
                    closeOnEscKey : true,
                    title : null,
                    stylesObject : {
                        dialog : {},
                        title : {},
                        content : {},
                        actions : {}
                    }
                };
                VueTestHelper.checkDefinedProps(props, vm);
                expect(vm.state.isActive).to.equal(false);
                expect(vm.styles).to.deep.equal(props.stylesObject);
            });

            it('sets props with custom values', function() {
                var props = {
                    active : true,
                    action : 'theVuexAction',
                    closeOnClick : false,
                    closeOnEscKey : false,
                    title : 'title',
                    stylesObject : {
                        dialog : {
                            width : '98%',
                            'max-width' : '98%'
                        },
                        title : {
                            color : 'red'
                        },
                        content : {
                            'font-size' : '10px'
                        },
                        actions : {
                            'background-color' : 'green'
                        }
                    }
                };
                var vm = new Dialog({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
                expect(vm.state.isActive).to.equal(true);
                expect(vm.styles).to.deep.equal(props.stylesObject);
            });
        });

        it('#open', function() {
            var vm = new Dialog().$mount();
            // default value
            expect(vm.state.isActive).to.equal(false);
            vm.open();
            expect(vm.state.isActive).to.equal(true);
        });

        it('#close', function() {
            var vm = new Dialog().$mount();
            // default value
            expect(vm.state.isActive).to.equal(false);
            vm.open();
            expect(vm.state.isActive).to.equal(true);
            vm.close();
            expect(vm.state.isActive).to.equal(false);
        });

        it('changes its state when the "active" prop is bound active', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-dialog ref="dialog" v-bind:active="status"></wc-dialog>',
                data : function() {
                    return {
                        status : true
                    };
                }
            });
            var vm = new ParentComponent().$mount();
            // checking the parent status
            expect(vm.status).to.equal(true);
            // checking the dialog value bound to the parent status
            expect(vm.$refs.dialog.state.isActive).to.equal(true);
            // updating the state of the parent
            vm.status = false;
            vm.$nextTick(function() {
                // checking the parent status
                expect(vm.status).to.equal(false);
                // checking the dialog value bound to the parent status
                expect(vm.$refs.dialog.state.isActive).to.equal(false);
                done();
            });
        });

        context('on content generation', function() {
            it('generates "content" slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-dialog'
                }, {
                    name : 'content',
                    content : '<p>Here from the wild dream come true</p>',
                    styleClass : 'wc-Dialog__content'
                });
            });
            it('generates "actions" slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-dialog'
                }, {
                    name : 'actions',
                    content : '<button>close</button><button>accept</button>',
                    styleClass : 'wc-Dialog__actions'
                });
            });
        });


        it('height is calculated correctly', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-dialog ref="childComponent"><div slot="content"><div style="height:50px"></div></div></wc-dialog>'
            });
            var vm = new ParentComponent().$mount();
            vm.$refs.childComponent.state.isActive = true;
            vm.$refs.childComponent.recalculateHeight();
            Vue.nextTick(function() {
                var contentHeight = vm.$refs.childComponent.$refs.content.style.maxHeight;
                // default value
                expect(contentHeight).to.not.be.null;
                done();
            });
        });


        context('properly triggers vuex actions', function() {
            it('change', function() {
                // spy for the vuex action
                var spyAction = sinon.spy();
                // spy for the event binding
                var spyEvent = sinon.spy();
                var ParentComponent = Vue.extend({
                    template : '<wc-dialog ref="dialog" action="changeDialog" v-on:change="_onDialogChange"></wc-dialog>',
                    store : new Vuex.Store({
                        actions : {
                            changeDialog : spyAction
                        }
                    }),
                    methods : {
                        _onDialogChange : spyEvent
                    }
                });
                var vm = new ParentComponent().$mount();
                vm.$refs.dialog.open();
                // check the payload of the action
                expect(spyAction.firstCall.args[1]).to.deep.equal({
                    active : true
                });
                vm.$refs.dialog.close();
                vm.$refs.dialog.open();
                // the action must be called three times, for each change
                expect(spyAction.callCount).to.equal(3);
                // the event should not triggered if using actions
                expect(spyEvent.callCount).to.equal(0);
            });
        });

        describe('#_setActive', function() {
            var vm = null;
            var spy = null;

            beforeEach(function() {
                spy = sinon.spy();
                vm = new Dialog().$mount();
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

            it('doesn\'t trigger the event when there is not a state change', function() {
                vm._setActive(true);
                vm._setActive(true);
                expect(spy.callCount).to.equal(1);
            });

            it('doesn\'t trigger the event when there are not parameters', function() {
                vm._setActive();
                expect(spy.callCount).to.equal(0);
            });
        });

        describe('#_triggerState', function() {
            context('when there is a state change', function() {
                it('triggers the event with the correct arguments', function() {
                    var spy = sinon.spy();
                    var ParentComponent = Vue.extend({
                        template : '<wc-dialog ref="dialog" v-on:change="_onDialogChange"></wc-dialog>',
                        methods : {
                            _onDialogChange : spy
                        }
                    });
                    var vm = new ParentComponent().$mount();
                    // first call, opening the dialog
                    vm.$refs.dialog._setActive(true, false);
                    vm.$refs.dialog._triggerState();
                    expect(spy.firstCall.args[0]).to.deep.equal({
                        active : true
                    });
                    // second call, closing the dialog
                    vm.$refs.dialog._setActive(false, false);
                    vm.$refs.dialog._triggerState();
                    expect(spy.secondCall.args[0]).to.deep.equal({
                        active : false
                    });
                    expect(spy.callCount).to.equal(2);
                });
            });
        });
    });
});
