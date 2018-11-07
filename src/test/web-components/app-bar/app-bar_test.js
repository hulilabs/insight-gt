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
/* global expect, describe, it, context, before */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/bars/app-bar/app-bar_component'
],
function(
    Vue,
    VueTestHelper,
    AppBar
) {
    describe('AppBar', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-app-bar', AppBar);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new AppBar().$mount();
                VueTestHelper.checkDefinedProps({
                    active : false,
                    title : null,
                    titleClass : null,
                    noShadow : false,
                    showNavigation : true,
                    showActions : true,
                    hintText : null,
                    hintClass : null,
                    compact : false
                }, vm);
                expect(vm.state.isActive).to.equal(false);
            });

            it('sets props with custom values', function() {
                var props = {
                    active : true,
                    title : 'title',
                    titleClass : 'titleClass',
                    noShadow : true,
                    showNavigation : false,
                    showActions : false,
                    hintText : 'a hint',
                    hintClass : 'u-body',
                    compact : true
                };
                var vm = new AppBar({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
                expect(vm.state.isActive).to.equal(true);
            });
        });

        context('on prop binding', function() {
            it('active', function(done) {
                var ParentComponent = Vue.extend({
                    template : '<wc-app-bar ref="appBar" v-bind:active="status"></wc-app-bar>',
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
                expect(vm.$refs.appBar.state.isActive).to.equal(true);
                // updating the state of the parent
                vm.status = false;
                vm.$nextTick(function() {
                    // checking the parent status
                    expect(vm.status).to.equal(false);
                    // checking the dialog value bound to the parent status
                    expect(vm.$refs.appBar.state.isActive).to.equal(false);
                    done();
                });
            });
        });

        context('properly generates content', function() {
            it('navigation slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-app-bar'
                }, {
                    name : 'navigation',
                    content : '<button>close</button>',
                    styleClass : 'wc-AppBar__navigation'
                });
            });

            it('actions slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-app-bar'
                }, {
                    name : 'actions',
                    content : '<button>close</button>',
                    styleClass : 'wc-AppBar__actions'
                });
            });
        });
    });
});
