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
 * @file Saver unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/saver/saver_component
 * @module test/web-components/savers/saver_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/savers/saver_component'
],
function(
    Vue,
    VueTestHelper,
    Saver
) {
    describe('Saver', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var vm = new Saver().$mount();
            });
        });

        context('on listening animation end event', function() {
            var fadeOutAnimationEvent = {
                    animationName : 'fadeOut'
                },
                saverCircleAnimationEvent = {
                    animationName : 'saverCircle'
                };

            it('triggers the close event', function() {
                var vm = new Saver().$mount(),
                    emitStub = sinon.stub(vm, '$emit');

                vm.close(fadeOutAnimationEvent);

                expect(emitStub.firstCall.args[0]).to.equal(Saver.EVENT.ON_CLOSE);
                expect(emitStub.callCount).to.equal(1);
            });

            it('validates other animations different than fadeOut', function() {
                var vm = new Saver().$mount(),
                    emitStub = sinon.stub(vm, '$emit');

                vm.close(saverCircleAnimationEvent);

                expect(emitStub.callCount).to.equal(0);
            });
        });
    });
});
