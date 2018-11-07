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
define([
    'web-components/effects/ripple/ripple_component'
],
function(
    Ripple
) {

    describe('Ripple', function() {
        it('executes animation', function() {
            var vm = new Ripple().$mount();
            document.body.appendChild(vm.$el);

            vm.animate();
            expect(vm.hasAnimatedRipple()).to.be.true;
        });

        it('shows ripple element', function() {
            var vm = new Ripple().$mount();
            expect(vm.hasStaticRipple()).to.be.false;
            vm.show();
            expect(vm.hasStaticRipple()).to.be.true;
        });

        it('hides ripple element', function() {
            var vm = new Ripple().$mount();
            vm.show();
            vm.hide(); // ensures is hidden
            expect(vm.hasStaticRipple()).to.be.false;
        });

        it('knows if there\'s an active static ripple', function() {
            var vm = new Ripple().$mount();
            vm.show();
            expect(vm.hasStaticRipple()).to.be.true;
            expect(vm.$el.classList.contains('is-visible')).to.be.true;
            vm.hide();
            expect(vm.hasStaticRipple()).to.be.false;
            expect(vm.$el.classList.contains('is-visible')).to.be.false;
        });

        it('knows if there\'s an active animated ripple', function() {
            var vm = new Ripple().$mount();
            expect(vm.hasAnimatedRipple()).to.be.false;

            vm.$el.classList.add('has-ripple');
            expect(vm.hasAnimatedRipple()).to.be.true;
        });
    });
});
