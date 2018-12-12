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
                    compact : false,
                    fillSpace : false,
                    fixed : false,
                    hintClass : null,
                    hintText : null,
                    noShadow : false,
                    showActions : true,
                    showNavigation : true,
                    title : null,
                    titleClass : null,
                }, vm);
                expect(vm.state.isActive).to.equal(false);
            });

            it('sets props with custom values', function() {
                var props = {
                    active : true,
                    compact : true,
                    fillSpace : true,
                    fixed : true,
                    hintClass : 'u-body',
                    hintText : 'a hint',
                    noShadow : true,
                    showActions : false,
                    showNavigation : false,
                    title : 'title',
                    titleClass : 'titleClass',
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

            it('progress slot', function() {
                VueTestHelper.checkSlotContentGeneration({
                    tag : 'wc-app-bar'
                }, {
                    name : 'progress',
                    content : '<div>progress</div>',
                    styleClass : 'wc-AppBar__progress'
                });
            });
        });
    });
});
