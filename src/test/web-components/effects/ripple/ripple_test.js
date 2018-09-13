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
/* global expect, describe, it, beforeEach, sinon */
define([
    'vue',
    'waves/waves',
    'web-components/effects/ripple/ripple_effect'
],
function(
    Vue,
    Waves,
    RippleEffect
) {

    describe('RippleEffect', function() {
        // global element to attach ripple to
        var element;

        beforeEach(function() {
            element = document.createElement('div');
        });

        it('adds ripple effect to element', function() {
            RippleEffect.bind(element);
            expect(element.classList.contains(RippleEffect.BLOCK_CLASS)).to.equal(true);
            expect(element.classList.contains('waves-effect')).to.equal(true);
        });

        it('adds modifier to bound element', function() {
            RippleEffect.bind(element, {
                modifier : 'test-modifier'
            });
            expect(element.classList.contains('test-modifier')).to.equal(true);
        });

        it('passes the default duration to Waves library', function() {
            var fakeWavesInit = sinon.stub(Waves, 'init');
            RippleEffect.bind(element);

            // will just test that the duration argument is passed as expected
            // we won't test that the ripple actually lasts for 9999ms, as that's
            // the responsibility of Waves lib
            expect(fakeWavesInit.firstCall.args[0].duration).to.equal(RippleEffect.DEFAULT_DURATION);
            fakeWavesInit.restore();
        });

        it('allows duration override', function() {
            var fakeWavesInit = sinon.stub(Waves, 'init');
            RippleEffect.bind(element, {
                duration : 9999
            });

            // will just test that the duration argument is passed as expected
            // we won't test that the ripple actually lasts for 9999ms, as that's
            // the responsibility of Waves lib
            expect(fakeWavesInit.firstCall.args[0].duration).to.equal(9999);
            fakeWavesInit.restore();
        });

    });
});
