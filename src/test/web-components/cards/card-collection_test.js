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
 * @file CardCollection unit tests
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/card/card-collection_component
 * @requires web-components/cards/card-collection/card-orchestrator
 * @requires web-components/cards/card/card_component
 * @requires web-components/utils/scroll/scroll
 * @module test/web-components/cards/card-collection/card-collection_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/cards/card-collection/card-collection_component',
    'web-components/cards/card-collection/card-orchestrator',
    'web-components/cards/card/card_component',
    'web-components/utils/scroll/scroll'
],
function(
    Vue,
    VueTestHelper,
    CardCollection,
    CardOrchestrator,
    Card,
    ScrollUtil
) {
    describe('CardCollection', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    orchestrate : true,
                    hasOverlay : true,
                    scrollToCard : true,
                    container : undefined
                };

                var vm = new CardCollection().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    orchestrate : false,
                    hasOverlay : false,
                    scrollToCard : false,
                    container : document.createElement('div')
                };

                var vm = new CardCollection({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('binds card orchestration', function() {
            var vm = new CardCollection({
                propsData : {
                    orchestrate : true
                }
            });

            var dummyCardChangeBindListener = sinon.spy();

            var cardChangeStub = sinon.stub(vm._onCardChange, 'bind', function() {
                return dummyCardChangeBindListener;
            });

            var fakeEl = {
                addEventListener : function(event, handler) {
                    expect(event).to.equal('dummy-event');
                    expect(handler).to.equal(dummyCardChangeBindListener);
                }
            };
            vm.$el = fakeEl;

            var FakeOrchestrator = function(element, options) {
                expect(element).to.equal(vm.$el);
                expect(options).to.deep.equal({
                    scrollToActiveCard : vm.scrollToCard,

                });
            };

            FakeOrchestrator.prototype.bind = sinon.spy();

            FakeOrchestrator.EVENT = {
                CHANGE : 'dummy-event'
            };

            // FakeOrchestrator.prototype.bind = done;
            vm._bindOrchestration(FakeOrchestrator);

            expect(cardChangeStub.callCount).to.equal(1);
            expect(FakeOrchestrator.prototype.bind.callCount).to.equal(1);
        });

        context('on card change management', function() {
            it('updates state on card close', function() {
                var vm = new CardCollection().$mount();

                var fakeChangeEvent = {
                    detail : {
                        eventInfo : {
                            close : {
                                relatedTarget : null
                            }
                        },
                        closingCard : {
                            $el : null
                        },
                        type : CardOrchestrator.CHANGE.CLOSE
                    }
                };

                vm._onCardChange(fakeChangeEvent);

                expect(vm.state.hasOpenCard).to.be.false;
            });

            it('updates state on card focus', function() {
                var vm = new CardCollection().$mount();
                var fakeChangeEvent = {
                    detail : {
                        type : CardOrchestrator.CHANGE.FOCUS
                    }
                };

                vm._onCardChange(fakeChangeEvent);

                expect(vm.state.hasOpenCard).to.be.false;
            });

            it('updates state on card open', function() {
                var vm = new CardCollection().$mount();
                var fakeChangeEvent = {
                    detail : {
                        type : CardOrchestrator.CHANGE.OPEN,
                        openingCard : {
                            foo : 'bar',
                            $once : function(_, callback) {
                                callback();
                            }
                        }
                    }
                };

                var scrollCardIntoViewStub = sinon.stub(vm, '_scrollCardIntoView');
                vm._onCardChange(fakeChangeEvent);

                expect(scrollCardIntoViewStub.callCount).to.equal(1);
                expect(scrollCardIntoViewStub.firstCall.args).to.deep.equal([fakeChangeEvent.detail.openingCard]);

                expect(vm.state.hasOpenCard).to.be.true;
            });
        });

        context('when making sure a card visible', function() {
            it('scrolls to active card', function() {
                var scrollStub = sinon.stub(ScrollUtil, 'adjustVerticallyIntoView'),
                    fakeCard = {
                        $el : 'foo'
                    };

                var vm = new CardCollection().$mount();
                vm._scrollCardIntoView(fakeCard);

                expect(scrollStub.callCount).to.equal(1);
                expect(scrollStub.firstCall.args).to.deep.equal([fakeCard.$el, false, null]);

                scrollStub.restore();
            });

            it('ensures a closing card is visible', function() {
                var vm = new CardCollection().$mount();

                sinon.stub(vm, '_isCloseFocusingAnotherElement').returns(false);
                var scrollStub = sinon.stub(vm, '_scrollCardIntoView');

                vm.scrollToClosingCard = true;

                var dummyCloseEvent = {
                    detail : {
                        closingCard : {
                            foo : 'bar'
                        }
                    }
                };

                vm._ensureClosingCardIsVisible(dummyCloseEvent);
                expect(scrollStub.callCount).to.equal(1);
                expect(scrollStub.firstCall.args).to.deep.equal([dummyCloseEvent.detail.closingCard]);
            });

            it('ensures an opening card is visible', function() {
                var vm = new CardCollection().$mount();
                vm.scrollToActiveCard = true;

                sinon.stub(vm, '_isClosingCardAboveOpeningCard').returns(false);
                var scrollStub = sinon.stub(vm, '_scrollCardIntoView');

                var dummyClosingCard = {
                    foo : 'bar',
                    $once : sinon.spy()
                };

                var dummyOpeningCard = {
                    foo2 : 'bar',
                    $once : function(_, callback) {
                        callback();
                    }
                };

                vm._ensureOpeningCardIsVisible(dummyOpeningCard, dummyClosingCard);
                expect(scrollStub.callCount).to.equal(1);
                expect(scrollStub.firstCall.args).to.deep.equal([dummyOpeningCard]);
                expect(dummyClosingCard.$once.callCount).to.equal(0);
            });

            it('ensures an opening card is visible if a card above is closing', function() {
                var vm = new CardCollection().$mount();
                vm.scrollToActiveCard = true;

                var scrollBindStub = sinon.stub(vm._scrollCardIntoView, 'bind');
                sinon.stub(vm, '_isClosingCardAboveOpeningCard').returns(true);
                scrollBindStub.returns('bound function');

                var dummyClosingCard = {
                    foo : 'bar',
                    $once : sinon.spy()
                };

                var dummyOpeningCard = {
                    foo2 : 'bar'
                };

                vm._ensureOpeningCardIsVisible(dummyOpeningCard, dummyClosingCard);
                expect(scrollBindStub.callCount).to.equal(1);
                expect(scrollBindStub.firstCall.args).to.deep.equal([vm, dummyOpeningCard]);

                expect(dummyClosingCard.$once.callCount).to.equal(1);
                expect(dummyClosingCard.$once.firstCall.args).to.deep.equal([Card.EVENT.TRANSITION_END, 'bound function']);
            });
        });
    });
});
