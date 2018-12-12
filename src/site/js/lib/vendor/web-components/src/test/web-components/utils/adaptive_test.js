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
 * @file ScrollUtil unit tests
 * @requires  web-components/utils/adaptive/adaptive
 * @module  test/web-components/utils/adaptive_test
 */
define([
    'web-components/utils/adaptive/adaptive'
],
function(
    AdaptiveUtil
) {
    describe('AdaptiveUtil', function() {
        it('generates dummy element for media detection', function() {
            var dummy = AdaptiveUtil._generateDummyElementForDetection();
            expect(dummy.classList.contains('wc-MediaStatus')).to.be.true;
        });

        it('reads media from dummy element', function() {
            var dummy = AdaptiveUtil._generateDummyElementForDetection();

            document.body.appendChild(dummy);

            var media = AdaptiveUtil._getMediaValueFromElement(dummy);

            if (media === 'desktop' || media === '\"desktop\"') {
                expect(AdaptiveUtil.isDesktop()).to.be.true;
            } else {
                expect(AdaptiveUtil.isMobile()).to.be.true;
            }
        });

        it('detects all desktop media variations', function() {
            AdaptiveUtil.media = 'desktop';
            expect(AdaptiveUtil.isDesktop()).to.be.true;

            AdaptiveUtil.media = '\"desktop\"';
            expect(AdaptiveUtil.isDesktop()).to.be.true;
        });

        it('detects all mobile media variations', function() {
            AdaptiveUtil.media = 'phone';
            expect(AdaptiveUtil.isMobile()).to.be.true;

            AdaptiveUtil.media = '\"phone\"';
            expect(AdaptiveUtil.isMobile()).to.be.true;
        });
    });
});
