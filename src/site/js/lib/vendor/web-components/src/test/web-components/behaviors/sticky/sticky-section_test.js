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
 * @file StickySectionBehavior unit tests
 * @requires web-components/behaviors/sticky/sticky-section_behavior
 * @module   test/web-components/behaviors/sticky/sticky-section_test
 */
define([
    'web-components/behaviors/sticky/sticky-section_behavior'
],
function(
    StickySectionBehavior
) {

    describe('StickySectionBehavior', function() {
        it('initializes', function() {
            var stickyBehavior = new StickySectionBehavior('a', 'b', 'c');

            expect(stickyBehavior.stickyElement).to.equal('a');
            expect(stickyBehavior.wrapper).to.equal('b');
            expect(stickyBehavior.onStickyChange).to.equal('c');

            expect(stickyBehavior.isSticky).to.be.false;
            expect(stickyBehavior.pageScrollListener).to.be.null;
        });

        it('binds', function() {
            var stickyBehavior = new StickySectionBehavior(
                                        document.createElement('div'),
                                        document.createElement('div'),
                                        sinon.spy());

            var windowScrollListenerStub = sinon.stub(window, 'addEventListener');
            stickyBehavior.bind();

            expect(stickyBehavior.pageScrollListener).to.be.a.function;
            expect(windowScrollListenerStub.callCount).to.equal(1);
            expect(windowScrollListenerStub.firstCall.args).to.deep.equal([
                'scroll',
                stickyBehavior.pageScrollListener,
                false
            ]);

            windowScrollListenerStub.restore();
        });

        it('unbinds', function() {
            var stickyBehavior = new StickySectionBehavior(
                                        document.createElement('div'),
                                        document.createElement('div'),
                                        sinon.spy());

            var windowScrollListenerStub = sinon.stub(window, 'removeEventListener');

            stickyBehavior.bind();
            stickyBehavior.unbind();

            expect(windowScrollListenerStub.callCount).to.equal(1);
            expect(windowScrollListenerStub.firstCall.args).to.deep.equal([
                'scroll',
                stickyBehavior.pageScrollListener,
                false
            ]);

            // Remove stub
            window.removeEventListener.restore();
        });

        context('when handling scroll', function() {
            var stickyChangeSpy, stickyBehavior;

            beforeEach(function() {
                stickyChangeSpy = sinon.spy();
                stickyBehavior = new StickySectionBehavior(
                                            document.createElement('div'),
                                            document.createElement('div'),
                                            stickyChangeSpy);

                stickyBehavior.bind();
            });

            it('makes element sticky when handling scroll', function() {
                var shouldBeStickyStub = sinon.stub(stickyBehavior, '_shouldBeSticky');

                shouldBeStickyStub.returns(true);

                stickyBehavior._handleStickySection(stickyBehavior.wrapper, stickyBehavior.stickyElement, 10);

                expect(stickyBehavior.isSticky).to.be.true;
                expect(stickyChangeSpy.callCount).to.equal(1);
                expect(stickyChangeSpy.firstCall.args).to.deep.equal([true]);
                expect(stickyBehavior.stickyElement.style.position).to.equal('fixed');
            });

            it('makes section not sticky', function() {
                var shouldBeStickyStub = sinon.stub(stickyBehavior, '_shouldBeSticky'),
                    removeStickySpy = sinon.spy(stickyBehavior, '_removeStickyHeader');

                shouldBeStickyStub.returns(false);

                stickyBehavior._handleStickySection(stickyBehavior.wrapper, stickyBehavior.stickyElement, 10);

                expect(removeStickySpy.callCount).to.equal(1);
                expect(removeStickySpy.firstCall.args).to.deep.equal([stickyBehavior.stickyElement]);
            });
        });

        it('removes sticky header', function() {
            var stickyChangeSpy = sinon.spy();
            var stickyBehavior = new StickySectionBehavior(
                                        document.createElement('div'),
                                        document.createElement('div'),
                                        stickyChangeSpy);

            stickyBehavior.bind();
            stickyBehavior.isSticky = true;

            var dummyElement = { style : {} };

            stickyBehavior._removeStickyHeader(dummyElement);

            expect(stickyBehavior.isSticky).to.be.false;
            expect(stickyChangeSpy.callCount).to.equal(1);
            expect(stickyChangeSpy.firstCall.args).to.deep.equal([false]);

            expect(dummyElement.style.position).to.equal('');
            expect(dummyElement.style.width).to.equal('');
            expect(dummyElement.style.left).to.equal('');
        });

        it('knows if element should be sticky', function() {
            var stickyBehavior = new StickySectionBehavior();

            // the top of the element is less than the window top -> NO STICKY
            expect(stickyBehavior._shouldBeSticky(10, 5)).to.be.false;

            // the scroll if over the element -> STICKY
            var windowScroll = 500,
                // distance from window top to sticky element
                stickyTop = 300,
                wrapperHeight = 300,
                wrapperOffset = windowScroll;

            var expectedSticky = stickyBehavior._shouldBeSticky(
                                    stickyTop,
                                    windowScroll,
                                    {offsetHeight : wrapperHeight},
                                    wrapperOffset);

            expect(expectedSticky).to.be.true;
        });
    });
});
