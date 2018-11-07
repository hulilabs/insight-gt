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
/* global expect, describe, it, sinon, context, beforeEach */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/overlays/overlay_component'
],
function(
    Vue,
    VueTestHelper,
    Overlay
) {
    describe('Overlay', function() {
        context('on instance creation', function() {
            it('sets props with default values', function() {
                VueTestHelper.checkDefinedProps({
                    active : false,
                    closeOnClick : true,
                    closeOnEscKey : true,
                    blockScroll : false
                },new Overlay().$mount());
            });

            it('sets props with custom values', function() {
                var props = {
                    active : true,
                    closeOnClick : false,
                    closeOnEscKey : false,
                    blockScroll : true
                };
                VueTestHelper.checkDefinedProps(props, new Overlay({ propsData : props }).$mount());
            });
        });

        it('#setBlockBodyPosition', function() {
            var bodyElement = document.getElementsByTagName('body')[0];
            var blockedClass = 'js-wc-scrollFixed';
            var vm = new Overlay().$mount();
            // default value
            expect(bodyElement.classList.contains(blockedClass)).to.equal(false);
            expect(vm.state.isBodyPositionBlocked).to.equal(false);
            // true
            vm.setBlockBodyPosition(true);
            expect(bodyElement.classList.contains(blockedClass)).to.equal(true);
            expect(vm.state.isBodyPositionBlocked).to.equal(true);
            // false
            vm.setBlockBodyPosition(false);
            expect(bodyElement.classList.contains(blockedClass)).to.equal(false);
            expect(vm.state.isBodyPositionBlocked).to.equal(false);
        });

        it('#_onTouchOverlay', function(done) {
            var spy = sinon.spy(),
                vm = new Overlay().$mount(),
                mockedEvent = {
                    stopPropagation : spy
                };

            vm.$on('overlay-close', function() {
                spy();
                expect(spy.callCount).to.equal(2);
                done();
            });

            vm._onTouchOverlay(mockedEvent);

        });

        it('#_onKeyUp', function(done) {
            var spy = sinon.spy(),
                vm = new Overlay().$mount(),
                mockedEvent = {
                    stopPropagation : spy,
                    keyCode : 27
                };

            vm.$on('overlay-close', function() {
                spy();
                expect(spy.callCount).to.equal(2);
                done();
            });

            vm._onKeyUp(mockedEvent);
        });
    });
});
