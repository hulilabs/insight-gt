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
 * @file PullUpDialog unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/dialogs/pull-up-dialog/pull-up-dialog_component
 * @module test/web-components/dialogs/pull-up-dialog_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/dialogs/pull-up/pull-up-dialog_component'
],
function(
    Vue,
    VueTestHelper,
    PullUpDialog
) {
    describe('PullUpDialog', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    title : ''
                };

                var vm = new PullUpDialog().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    title : 'test'
                };

                var vm = new PullUpDialog({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('#close', function(done) {
            var vm = new PullUpDialog().$mount(),
                closeSpy = sinon.spy();

            vm.$on(PullUpDialog.EVENTS.CLOSED, function() {
                closeSpy();
            });

            vm.close();

            setTimeout(function() {
                expect(closeSpy.callCount).to.equal(1);
                done();
            }.bind(this), 1300);
        });
    });
});
