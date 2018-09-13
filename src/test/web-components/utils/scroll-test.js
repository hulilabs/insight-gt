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
 * @file ScrollUtil unit tests
 * @requires  web-components/utils/scroll/scroll
 * @module  test/web-components/utils/scroll-test
 */
define([
    'web-components/utils/scroll/scroll'
],
function(
    ScrollUtil
) {
    describe('ScrollUtil', function() {
        context('on page scroll locking', function() {

            var scrollUtil;
            beforeEach(function() {
                scrollUtil = new ScrollUtil();
            });

            it('locks body position', function() {
                var fakeBodyElement = {
                    style : {},
                    classList : {
                        add : sinon.spy()
                    }
                };

                sinon.stub(scrollUtil, '_getBodyElement', function() {
                    return fakeBodyElement;
                });

                scrollUtil.toggleBodyPositionLock(true);

                expect(fakeBodyElement.classList.add.callCount).to.equal(1);
                expect(fakeBodyElement.classList.add.firstCall.args).to.deep.equal([ScrollUtil.BLOCK_BODY_POSITION_CLASS]);

                expect(fakeBodyElement.style.top).to.equal('0px');

                expect(scrollUtil.getBlockedOffsetX()).to.equal(window.pageXOffset);
                expect(scrollUtil.getBlockedOffsetY()).to.equal(window.pageYOffset);
            });

            it('unlocks body position', function() {
                var windowScrollToStub = sinon.stub(window, 'scrollTo');

                var fakeBodyElement = {
                    style : {},
                    classList : {
                        remove : sinon.spy()
                    }
                };

                sinon.stub(scrollUtil, '_getBodyElement', function() {
                    return fakeBodyElement;
                });

                scrollUtil.toggleBodyPositionLock(false);

                expect(fakeBodyElement.classList.remove.callCount).to.equal(1);
                expect(fakeBodyElement.classList.remove.firstCall.args).to.deep.equal([ScrollUtil.BLOCK_BODY_POSITION_CLASS]);

                expect(fakeBodyElement.style.top).to.equal('auto');

                expect(windowScrollToStub.firstCall.args).to.deep.equal([window.pageXOffset, scrollUtil.offsetY]);

                windowScrollToStub.restore();
            });
        });

        it('obtains an element\'s offsetY', function() {
            var fakeElement = {
                getBoundingClientRect : function() {
                    return {
                        top : 999
                    };
                }
            };

            expect(ScrollUtil.offsetY(fakeElement)).to.equal(999);
        });



        context('when scrolling to an element', function() {

            var fakeElement = {
                foo : 'bar'
            };

            it('animates scroll with default duration', function() {
                var animateScrollHelperSpy = sinon.spy();
                var animateScrollHelperStub = sinon.stub(ScrollUtil, '_getAnimatedScrollHelper', function() {
                    return animateScrollHelperSpy;
                });

                ScrollUtil.scrollTo(fakeElement, true, 20);

                expect(animateScrollHelperSpy.firstCall.args).to.deep.equal([fakeElement, {
                    duration : ScrollUtil.DEFAULT_SCROLL_ANIMATION_DURATION,
                    offset : 20,
                    container : undefined
                }]);

                animateScrollHelperStub.restore();
            });

            it('animates scroll with custom duration', function() {
                var animateScrollHelperSpy = sinon.spy();
                var animateScrollHelperStub = sinon.stub(ScrollUtil, '_getAnimatedScrollHelper', function() {
                    return animateScrollHelperSpy;
                });

                ScrollUtil.scrollTo(fakeElement, 9999);

                expect(animateScrollHelperSpy.firstCall.args).to.deep.equal([fakeElement, {
                    duration : 9999,
                    offset : undefined,
                    container : undefined
                }]);

                animateScrollHelperStub.restore();
            });

            context('when scrolling without animation', function() {
                var windowScrollToStub, offsetYStub;

                beforeEach(function() {
                    windowScrollToStub = sinon.stub(window, 'scrollTo');
                    offsetYStub = sinon.stub(ScrollUtil, 'offsetY', function() {
                        return 10;
                    });
                });

                afterEach(function() {
                    windowScrollToStub.restore();
                    offsetYStub.restore();
                });

                it('scrolls without offset', function() {
                    ScrollUtil.scrollTo(fakeElement);

                    expect(windowScrollToStub.callCount).to.equal(1);
                    expect(windowScrollToStub.firstCall.args).to.deep.equal([window.pageXOffset, 10]);
                });

                it('scrolls with offset', function() {
                    ScrollUtil.scrollTo(fakeElement, false, 100);

                    expect(windowScrollToStub.callCount).to.equal(1);
                    expect(windowScrollToStub.firstCall.args).to.deep.equal([window.pageXOffset, 110]);
                });
            });

            it('knows if an element is vertically centered', function() {
                var getViewportHeightStub = sinon.stub(ScrollUtil, 'getViewPortHeight');
                getViewportHeightStub.returns(900);

                var fakeCenteredElement = {
                    getBoundingClientRect : function() {
                        return {
                            top : 300,
                            height : 200
                        };
                    }
                };
                expect(ScrollUtil.isVerticallyCentered(fakeCenteredElement)).to.be.true;

                var fakeTooBigElement = {
                    getBoundingClientRect : function() {
                        return {
                            top : 300,
                            height : 500
                        };
                    }
                };
                expect(ScrollUtil.isVerticallyCentered(fakeTooBigElement)).to.be.false;

                var fakeTooDownElement = {
                    getBoundingClientRect : function() {
                        return {
                            top : 500,
                            height : 200
                        };
                    }
                };
                expect(ScrollUtil.isVerticallyCentered(fakeTooDownElement)).to.be.false;

                getViewportHeightStub.restore();
            });

            context('when centering an element into the view', function() {
                var isCenterdStub, scrollToStub;

                beforeEach(function() {
                    isCenterdStub = sinon.stub(ScrollUtil, 'isVerticallyCentered');
                    scrollToStub = sinon.stub(ScrollUtil, 'scrollTo');
                });

                afterEach(function() {
                    isCenterdStub.restore();
                    scrollToStub.restore();
                });

                it('adjusts into view', function() {
                    isCenterdStub.returns(false);

                    var dummyElement = {};

                    ScrollUtil.adjustVerticallyIntoView(dummyElement);

                    expect(scrollToStub.callCount).to.equal(1);
                    expect(scrollToStub.firstCall.args).to.deep.equal([dummyElement, true, ScrollUtil.getViewPortHeight() * -0.125, undefined]);
                });

                it('does not adjust into view if already centered', function() {
                    isCenterdStub.returns(true);

                    ScrollUtil.adjustVerticallyIntoView({});
                    expect(scrollToStub.callCount).to.equal(0);
                });

                it('adjusts into view when skipped check', function() {
                    isCenterdStub.returns(true);

                    var dummyElement = {};

                    ScrollUtil.adjustVerticallyIntoView(dummyElement, true);

                    expect(scrollToStub.callCount).to.equal(1);
                    expect(scrollToStub.firstCall.args).to.deep.equal([dummyElement, true, ScrollUtil.getViewPortHeight() * -0.125, undefined]);
                });
            });
        });
    });
});
