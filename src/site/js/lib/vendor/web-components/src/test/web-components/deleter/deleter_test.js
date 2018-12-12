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
 * @file Deleter unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/deleter/deleter_component
 * @module test/web-components/deleters/deleter_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/deleters/deleter_component',
    'web-components/directives/gestures/gestures_directive'
],
function(
    Vue,
    VueTestHelper,
    Deleter,
    GestureDirective
) {
    describe('Deleter', function() {

        before(function() {
            // registering the component globally
            Vue.component('wc-deleter', Deleter);

            // Required directive
            GestureDirective.bind();
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    itemKey : null,
                    disableDelete : false,
                    multipleInputs : false,
                    adjustPadding : false,
                    adjustContent : false
                };

                var vm = new Deleter().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    itemKey : 1,
                    disableDelete : true,
                    multipleInputs : true,
                    adjustPadding : true,
                    adjustContent : true
                };

                var vm = new Deleter({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('contains the expected exposed events', function() {
                // Bypasses text field events
                var EVENT = {
                    ON_DELETE : 'deleter-delete'
                };

                VueTestHelper.checkExposedEvents(EVENT, Deleter);
            });
        });

        it('#_onTrashTap', function(done) {
            var key = 'testKey',
                vm = new Deleter({ propsData : { itemKey : key }}),
                spy = sinon.spy();

            // Verify the key was stored
            expect(vm.itemKey).to.be.equal(key);

            // Attach an spy on delete action
            vm.$on(Deleter.EVENT.ON_DELETE, spy);
            vm._onTrashTap();

            vm.$nextTick(function() {
                expect(spy.callCount).to.equal(1);

                // Verify the event payload contains the provided itemKey
                var payload = spy.args[0][0];
                expect(payload.itemKey).to.be.equal(key);
                done();
            });
        });
    });
});
