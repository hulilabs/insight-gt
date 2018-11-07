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
define([
    'web-components/utils/animation'
],
function(
    AnimationUtil
) {
    describe('AnimationUtil', function() {
        context('when obtaining transition end property', function() {
            it('obtains webkit transition end property', function() {
                var stub = sinon.stub(document, 'createElement');

                stub.onCall(0).returns({
                    style : {
                        webkitTransition : true
                    }
                });

                var transitionEnd = AnimationUtil.getTransitionEndProperty();
                expect(transitionEnd).to.equal('webkitTransitionEnd');

                stub.restore();
            });

            it('obtains default transition end property', function() {
                var stub = sinon.stub(document, 'createElement');

                stub.onCall(0).returns({
                    // return empty style object, so the util won't find
                    // any custom properties, making it return the default
                    style : {}
                });

                var transitionEnd = AnimationUtil.getTransitionEndProperty();
                expect(transitionEnd).to.equal('transitionend');

                stub.restore();
            });
        });

        context('when obtaining animation end property', function() {
            it('obtains webkit animation end property', function() {
                var stub = sinon.stub(document, 'createElement');

                stub.onCall(0).returns({
                    style : {
                        webkitAnimation : true
                    }
                });

                var animationEnd = AnimationUtil.getAnimationEndProperty();
                expect(animationEnd).to.equal('webkitAnimationEnd');

                stub.restore();
            });

            it('obtains default animation end property', function() {
                var stub = sinon.stub(document, 'createElement');

                stub.onCall(0).returns({
                    // return empty style object, so the util won't find
                    // any custom properties, making it return the default
                    style : {}
                });

                var animationEnd = AnimationUtil.getAnimationEndProperty();
                expect(animationEnd).to.equal('animationend');

                stub.restore();
            });
        });
    });
});
