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
 * @file CardOrchestrator unit tests
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/card/card-collection_component
 * @module test/web-components/cards/card-collection/card-collection_test
 */
define([
    'web-components/cards/card-collection/card-orchestrator',
    'web-components/cards/card/card_component'
],
function(
    CardOrchestrator,
    Card
) {
    describe('CardOrchestrator', function() {
        it('initializes card collection reference and transaction', function() {
            var dummyElement = document.createElement('div'),
                orchestrator = new CardOrchestrator(dummyElement);

            expect(orchestrator.cardCollectionElement).to.equal(dummyElement);
            expect(orchestrator.transaction).to.deep.equal(orchestrator._getNewtransaction());
        });

        it('binds events to card collection', function() {

            var addEventListenerSpy = sinon.spy();
            var orchestrator = new CardOrchestrator({
                addEventListener : addEventListenerSpy
            });

            var dummyBoundCardClose = sinon.spy();
            var cardCloseStub = sinon.stub(orchestrator._onCardClose, 'bind', function() {
                return dummyBoundCardClose;
            });

            var dummyBoundCardOpen = sinon.spy();
            var cardOpenStub = sinon.stub(orchestrator._onCardOpen, 'bind', function() {
                return dummyBoundCardOpen;
            });

            var dummyBoundCardFocus = sinon.spy();
            var cardFocusStub = sinon.stub(orchestrator._onCardFocus, 'bind', function() {
                return dummyBoundCardFocus;
            });

            orchestrator.bind();

            expect(cardCloseStub.callCount).to.equal(1);
            expect(cardOpenStub.callCount).to.equal(1);
            expect(cardFocusStub.callCount).to.equal(1);

            expect(addEventListenerSpy.firstCall.args).to.deep.equal([Card.EVENT.CLOSE, dummyBoundCardClose]);
            expect(addEventListenerSpy.secondCall.args).to.deep.equal([Card.EVENT.OPEN, dummyBoundCardOpen]);
            expect(addEventListenerSpy.thirdCall.args).to.deep.equal([Card.EVENT.FOCUS, dummyBoundCardFocus]);
        });

        context('when managing card close', function() {
            it('commits the transaction when the related target isn\'t a card', function() {
                var dummyCardCollectionElement = {
                    dispatchEvent : sinon.spy()
                };

                var orchestrator = new CardOrchestrator(dummyCardCollectionElement);

                var dummyCardCloseCustomEvent = {
                    preventDefault : sinon.spy(),
                    detail : {
                        relatedTarget : document.createElement('div'),
                        targetCard : { foo : 'bar' }
                    }
                };

                var commitChangesStub = sinon.stub(orchestrator, '_commitChange');

                orchestrator._onCardClose(dummyCardCloseCustomEvent);

                expect(commitChangesStub.callCount).to.equal(1);
                expect(commitChangesStub.firstCall.args).to.deep.equal([CardOrchestrator.CHANGE.CLOSE]);
                expect(orchestrator.transaction.closingCard).to.equal(dummyCardCloseCustomEvent.detail.targetCard);
                expect(orchestrator.transaction.eventInfo.close).to.deep.equal({
                    relatedTarget : dummyCardCloseCustomEvent.detail.relatedTarget
                });
                expect(dummyCardCloseCustomEvent.preventDefault.callCount).to.equal(1);
            });

            it('will not commit the transaction when the related target is a child card', function() {
                var dummyCardCollectionElement = {
                    dispatchEvent : sinon.spy(),
                    contains : function() {
                        // this will tell the method that the card is part of the orchestrated collection
                        return true;
                    }
                };

                var orchestrator = new CardOrchestrator(dummyCardCollectionElement);

                sinon.stub(orchestrator, '_isCardCollectionElement', function() {
                    // this will tell the method that the related target is a card
                    return true;
                });

                var dummyCardCloseCustomEvent = {
                    preventDefault : sinon.spy(),
                    detail : {
                        relatedTarget : document.createElement('div')
                    }
                };

                var commitChangesStub = sinon.stub(orchestrator, '_commitChange');

                orchestrator._onCardClose(dummyCardCloseCustomEvent);

                expect(commitChangesStub.callCount).to.equal(0);
            });
        });

        it('manages card open', function() {
            var dummyCardCollectionElement = {
                dispatchEvent : sinon.spy()
            };

            var dummyCardOpenCustomEvent = {
                preventDefault : sinon.spy(),
                detail : {
                    relatedTarget : document.createElement('div'),
                    targetCard : { foo : 'bar' }
                }
            };

            var orchestrator = new CardOrchestrator(dummyCardCollectionElement);
            var commitChangesStub = sinon.stub(orchestrator, '_commitChange');

            orchestrator._onCardOpen(dummyCardOpenCustomEvent);

            expect(commitChangesStub.callCount).to.equal(1);
            expect(commitChangesStub.firstCall.args).to.deep.equal([CardOrchestrator.CHANGE.OPEN]);

            expect(dummyCardOpenCustomEvent.preventDefault.callCount).to.equal(1);
        });

        context('when managing card focus', function() {
            var dummyCardCollectionElement,
                dummyCardOpenCustomEvent,
                orchestrator;

            beforeEach(function() {
                dummyCardCollectionElement = {
                    dispatchEvent : sinon.spy()
                };

                dummyCardOpenCustomEvent = {
                    preventDefault : sinon.spy(),
                    detail : {
                        relatedTarget : document.createElement('div'),
                        targetCard : { foo : 'bar' }
                    }
                };

                orchestrator = new CardOrchestrator(dummyCardCollectionElement);
            });

            it('commits the transaction when there is not an "open attempt"', function() {
                dummyCardOpenCustomEvent.detail.hasOpenAttempt = false;

                var commitChangesStub = sinon.stub(orchestrator, '_commitChange');

                orchestrator._onCardFocus(dummyCardOpenCustomEvent);

                expect(dummyCardOpenCustomEvent.preventDefault.callCount).to.equal(1);

                expect(commitChangesStub.callCount).to.equal(1);
                expect(commitChangesStub.firstCall.args).to.deep.equal([CardOrchestrator.CHANGE.FOCUS]);
            });

            it('does not commit the transaction when there is an "open attempt"', function() {
                dummyCardOpenCustomEvent.detail.hasOpenAttempt = true;

                var commitChangesStub = sinon.stub(orchestrator, '_commitChange');
                orchestrator._onCardFocus(dummyCardOpenCustomEvent);
                expect(commitChangesStub.callCount).to.equal(0);
            });
        });

        context('when commiting changes', function() {
            var dummyTransaction = {
                closingCard : {
                    close : sinon.spy()
                },

                focusingCard : {
                    focus : sinon.spy()
                },

                openingCard : {
                    open : sinon.spy()
                }
            };

            it('commits changes when the custom change event is not cancelled', function() {

                var dummyCardCollectionElement = {
                    dispatchEvent : function(cardChangeEvent) {
                        expect(cardChangeEvent.detail).to.deep.equal(dummyTransaction);

                        return true;
                    }
                };

                var dispatchSpy = sinon.spy(dummyCardCollectionElement, 'dispatchEvent');

                var orchestrator = new CardOrchestrator(dummyCardCollectionElement);
                orchestrator.transaction = dummyTransaction;

                var orchestratorExecuteTransactionSpy = sinon.spy(orchestrator, '_executeTransactionQueue'),
                    commitChangeSpy = sinon.spy(orchestrator, '_commitChange');

                orchestrator._commitChange('some-type');

                expect(dispatchSpy.callCount).to.equal(1);
                expect(commitChangeSpy.firstCall.args).to.deep.equal(['some-type']);
                expect(orchestrator.transaction).to.deep.equal(orchestrator._getNewtransaction());

                expect(dummyTransaction.closingCard.close.callCount).to.equal(1);
                expect(dummyTransaction.focusingCard.focus.callCount).to.equal(1);
                expect(dummyTransaction.openingCard.open.callCount).to.equal(1);

                expect(orchestratorExecuteTransactionSpy.callCount).to.equal(1);
            });

            it('doesn not commit changes when the custon cange event is cancelled', function() {
                var dummyCardCollectionElement = {
                    dispatchEvent : function() {
                        return false;
                    }
                };

                var dispatchSpy = sinon.spy(dummyCardCollectionElement, 'dispatchEvent');

                var orchestrator = new CardOrchestrator(dummyCardCollectionElement);
                orchestrator.transaction = dummyTransaction;

                var orchestratorExecuteTransactionSpy = sinon.spy(orchestrator, '_executeTransactionQueue');

                orchestrator._commitChange('some-type');

                expect(dispatchSpy.callCount).to.equal(1);
                expect(orchestratorExecuteTransactionSpy.callCount).to.equal(0);
            });
        });

        it('generates a new transaction object', function() {
            var orchestrator = new CardOrchestrator();

            var emptyTransaction = {
                eventInfo : {},
                closingCard : null,
                focusingCard : null,
                openingCard : null,
                type : null
            };

            expect(orchestrator._getNewtransaction()).to.deep.equal(emptyTransaction);
        });

        it('checks if an element is a card', function() {
            var dummyElement = document.createElement('div'),
                orchestrator = new CardOrchestrator();

            expect(orchestrator._isCardCollectionElement(dummyElement)).to.be.false;

            dummyElement.classList.add('wc-CardCollection__card');

            expect(orchestrator._isCardCollectionElement(dummyElement)).to.be.true;
        });
    });
});
