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
 * @file Card unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/card/card_component
 * @requires web-components/utils/adaptive/adaptive
 * @module test/web-components/cards/card/card_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/cards/card/card_component',
    'web-components/utils/adaptive/adaptive'
],
function(
    Vue,
    VueTestHelper,
    Card,
    AdaptiveUtil
) {
    describe('Card', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var fullscreenActive = AdaptiveUtil.isMobile(),
                    props = {
                        fullscreenActive : fullscreenActive,
                        name : null,
                        tabindex : '0',
                        raisedOnActive : true,
                        resizeOnContentChange : true,
                        focusStyle : Card.FOCUS.LINE,
                        restingMaxHeight : null,
                        activeMaxHeight : null,
                        title : null,
                        titleClass : null,
                        titleDivider : true,
                        showActions : true,
                        compactLayout : false,
                        loading : false,
                        hasError : false,
                        titleHintText : null,
                        titleHintClass : null,
                        stickHeaderTo : null,
                        compact : false
                };

                var vm = new Card({propsData : { fullscreenActive : fullscreenActive }}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    fullscreenActive : true,
                    name : 'name',
                    tabindex : '1',
                    raisedOnActive : false,
                    resizeOnContentChange : false,
                    focusStyle : Card.FOCUS.RAISE,
                    restingMaxHeight : 100,
                    activeMaxHeight : 200,
                    title : 'title',
                    titleClass : 'custom-class',
                    titleDivider : false,
                    showActions : false,
                    compactLayout : true,
                    loading : true,
                    hasError : true,
                    titleHintText : null,
                    titleHintClass : null,
                    stickHeaderTo : '#selector',
                    compact : true
                };

                var vm = new Card({propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('when opening', function() {
            it('changes to active state', function() {
                var card = new Card().$mount(),
                    changeToActiveStateSpy = sinon.spy(card, '_activateActiveSlot');

                card.open();

                expect(changeToActiveStateSpy.callCount).to.equal(1);
                expect(card.state.isActive).to.be.true;
            });

            it('opens fullscreen', function() {
                var card = new Card({ propsData : { fullscreenActive : true }}).$mount();

                card.open();

                expect(card.state.hasVisibleContent).to.be.true;
            });

            it('opens not fullscreen', function() {
                var card = new Card({ propsData : { fullscreenActive : false, title : 'title' }}).$mount(),
                    updateActiveHeightSpy = sinon.spy(card, '_updateActiveHeight'),
                    stickyHeaderSpy = sinon.spy(card.stickyHeader, 'bind'),
                    resizeWatchSpy = sinon.spy(card, '_watchContentChangeToResize');

                var onceStub = sinon.stub(card, '$once', function(event, callback) {
                    callback();
                });

                card.open();

                expect(updateActiveHeightSpy.callCount).to.equal(1);
                expect(stickyHeaderSpy.callCount).to.equal(1);
                expect(resizeWatchSpy.callCount).to.equal(1);

                onceStub.restore();
            });
        });

        context('when closing', function() {
            it('changes to not active state', function() {
                var card = new Card().$mount(),
                    updateRestingHeightSpy = sinon.spy(card, '_updateRestingHeight');

                card.close();

                // state check
                expect(card.state.isActive).to.be.false;
                expect(card.state.isFocused).to.be.false;

                // side effects check
                expect(updateRestingHeightSpy.callCount).to.equal(1);
            });

            it('closes when not fullscreen', function() {
                var card = new Card({ propsData : { fullscreenActive : false }}).$mount(),
                    stickyHeaderSpy = sinon.spy(card.stickyHeader, 'unbind'),
                    resizeWatchSpy = sinon.spy(card, '_stopWatchingContentChange');

                card.close();

                expect(stickyHeaderSpy.callCount).to.equal(1);
                expect(resizeWatchSpy.callCount).to.equal(1);
            });
        });

        it('focuses', function() {
            var card = new Card().$mount();
            card.focus();
            expect(card.state.isFocused).to.be.true;
        });

        context('when setting open attempt', function() {
            it('does not set open attempt if the card is active', function() {
                var card = new Card().$mount();

                card.state.isActive = true;

                card._setOpenAttempt();

                expect(card.state.hasOpenAttempt).to.be.false;
            });

            it('does not set open attempt if the target is a card action', function() {
                var card = new Card().$mount();

                card.state.isActive = true;

                card._setOpenAttempt({
                    target : {
                        classList : {
                            contains : function() {
                                return true;
                            }
                        }
                    }
                });

                expect(card.state.hasOpenAttempt).to.be.false;
            });

            it('sets an open attempt state', function() {
                var card = new Card().$mount();

                card.state.isActive = false;

                card._setOpenAttempt({
                    target : {
                        classList : {
                            contains : function() {
                                return false;
                            }
                        }
                    }
                });

                expect(card.state.hasOpenAttempt).to.be.true;
            });

        });

        it('manages close attempt', function() {
            var event = { relatedTarget : {foo : 'bar'}};

            var card = new Card().$mount(),
                dispatchEventSpy = sinon.spy(card, '_dispatchEvent');

            card._onCloseAttempt(event);

            expect(dispatchEventSpy.firstCall.args).to.deep.equal([{
                eventName : Card.EVENT.CLOSE,
                callback : card.close,
                detail : {
                    relatedTarget : event.relatedTarget,
                    isCardActive : card.state.isActive
                }
            }]);

            expect(dispatchEventSpy.callCount).to.equal(1);
        });

        context('when managing open attempt', function() {

            it('manages open attempt', function() {
                var card = new Card().$mount(),
                    dispatchEventSpy = sinon.spy(card, '_dispatchEvent');

                card._onOpenAttempt();

                expect(dispatchEventSpy.firstCall.args).to.deep.equal([{
                    eventName : Card.EVENT.OPEN,
                    callback : card.open
                }]);

                expect(dispatchEventSpy.callCount).to.equal(1);
            });

            it('does nothing if the card is active', function() {
                var card = new Card().$mount(),
                    dispatchEventSpy = sinon.spy(card, '_dispatchEvent');

                card.state.isActive = true;
                card._onOpenAttempt();
                expect(dispatchEventSpy.callCount).to.equal(0);
            });
        });

        context('when managing focus attempt', function() {
            it('manages focus attempt', function() {
                var card = new Card().$mount(),
                    dispatchEventSpy = sinon.spy(card, '_dispatchEvent');

                card._onFocusAttempt({preventDefault : sinon.spy()});

                expect(dispatchEventSpy.firstCall.args).to.deep.equal([{
                    eventName : Card.EVENT.FOCUS,
                    callback : card.focus,
                    detail : {
                        hasOpenAttempt : card.state.hasOpenAttempt
                    }
                }]);

                expect(dispatchEventSpy.callCount).to.equal(1);
            });

            it('does nothing if the card is active', function() {
                var card = new Card().$mount(),
                    dispatchEventSpy = sinon.spy(card, '_dispatchEvent');

                card.state.isActive = true;
                card._onFocusAttempt({preventDefault : sinon.spy()});
                expect(dispatchEventSpy.callCount).to.equal(0);
            });
        });

        it('dispatches an event', function() {
            var card = new Card({name : 'eilariom'}).$mount();

            var customEventStub = sinon.spy(card, '_emitCustomEvent');

            var dispatchEventStub = sinon.stub(card.$el, 'dispatchEvent', function() {
                // returned value when the event isn't cancelled
                return true;
            });

            var fakeDispatchEventPayload = {
                callback : sinon.spy(),
                eventName : 'foo',
                detail : {foo : 'bar'}
            };

            card._dispatchEvent(fakeDispatchEventPayload);

            expect(dispatchEventStub.callCount).to.equal(1);
            expect(fakeDispatchEventPayload.callback.callCount).to.equal(1);

            expect(customEventStub.callCount).to.equal(1);
            expect(customEventStub.firstCall.args).to.deep.equal([
                'foo',
                {
                    cancelable : true,
                    bubbles : true,
                    detail : {
                        foo : 'bar',
                        targetCard : card,
                        name : card.name
                    }
                }
            ]);

            customEventStub.restore();
        });

        context('when managing a header click', function() {
            it('does nothing if the card is not active', function() {
                var card = new Card().$mount();

                card.state.isActive = false;
                expect(card._onHeaderClick()).to.be.false;
            });

            it('does nothing if the card is fullscreen capable', function() {
                var card = new Card({propsData : { fullscreenActive : true }}).$mount();
                expect(card._onHeaderClick()).to.be.false;
            });

            it('handles header click as close attempt', function() {
                var card = new Card({propsData : { fullscreenActive : false }}).$mount(),
                    closeAttemptStub = sinon.stub(card, '_onCloseAttempt');

                var dummyEvent = { stopPropagation : sinon.spy() };

                card.state.isActive = true;
                card._onHeaderClick(dummyEvent);

                expect(closeAttemptStub.callCount).to.equal(1);
                expect(dummyEvent.stopPropagation.callCount).to.equal(1);
            });
        });

        it('stops event propagation when a header action is clicked', function() {
            var dummyEvent = {
                stopPropagation : sinon.spy(),
                stopImmediatePropagation : sinon.spy()
            };

            var card = new Card().$mount();

            card.state.isActive = true;
            card._onHeaderActionsClick(dummyEvent);

            expect(dummyEvent.stopPropagation.callCount).to.equal(1);
            expect(dummyEvent.stopImmediatePropagation.callCount).to.equal(1);
        });

        it('binds focus management', function() {
            var card = new Card().$mount();

            var focusAttemptBindStub = sinon.stub(card._onFocusAttempt, 'bind'),
                blurManagerBindStub = sinon.stub(card._onBlur, 'bind');

            focusAttemptBindStub.returns('focusbind');
            blurManagerBindStub.returns('blurbind');

            var addEventListenerStub = sinon.stub(card.$el, 'addEventListener');
            card._bindFocusManagement();

            expect(addEventListenerStub.firstCall.args).to.deep.equal(['focus', 'focusbind']);
            expect(addEventListenerStub.secondCall.args).to.deep.equal(['blur', 'blurbind', true]);
        });

        it('binds keyboard actions', function() {
            var card = new Card().$mount();

            var keydownManagerStub = sinon.stub(card._onKeyDown, 'bind');

            keydownManagerStub.returns('keybind');

            var addEventListenerStub = sinon.stub(card.$el, 'addEventListener');
            card._bindKeyboardActions();

            expect(addEventListenerStub.firstCall.args).to.deep.equal(['keydown', 'keybind']);
        });

        context('when managing key down events', function() {
            var card, dummyEvent;
            beforeEach(function() {
                dummyEvent = {
                    stopPropagation : sinon.spy(),
                    preventDefault : sinon.spy(),
                    keyCode : null
                };

                card = new Card().$mount();
                card.state.isActive = false;
            });

            it('does nothing when active', function() {
                card.state.isActive = true;
                expect(card._onKeyDown()).to.be.false;
            });

            it('handles space key as open attempt', function() {
                dummyEvent.keyCode = 32;
                var wasTheEventHandled = card._onKeyDown(dummyEvent);
                expect(wasTheEventHandled).to.be.true;

                expect(dummyEvent.stopPropagation.callCount).to.equal(1);
                expect(dummyEvent.preventDefault.callCount).to.equal(1);
            });

            it('handles enter key as open attempt', function() {
                dummyEvent.keyCode = 13;
                var wasTheEventHandled = card._onKeyDown(dummyEvent);
                expect(wasTheEventHandled).to.be.true;

                expect(dummyEvent.stopPropagation.callCount).to.equal(1);
                expect(dummyEvent.preventDefault.callCount).to.equal(1);
            });

            it('does nothing when received other keys', function() {
                dummyEvent.keyCode = 88;
                var wasTheEventHandled = card._onKeyDown(dummyEvent);
                expect(wasTheEventHandled).to.be.false;
            });
        });

        context('when updating its height', function() {
            var updateActiveHeightSpy, updateRestingHeightSpy;

            afterEach(function() {
                updateActiveHeightSpy.restore();
                updateRestingHeightSpy.restore();
            });

            it('updates its active height when the card is opened', function() {
                var card = new Card({ propsData : { fullscreenActive : false }}).$mount();

                updateActiveHeightSpy = sinon.spy(card, '_updateActiveHeight');
                updateRestingHeightSpy = sinon.spy(card, '_updateRestingHeight');

                card.open();
                expect(updateActiveHeightSpy.callCount).to.equal(1);

                card.updateHeight();
                expect(updateActiveHeightSpy.callCount).to.equal(2);
                expect(updateRestingHeightSpy.callCount).to.equal(0);
            });

            it('updates its resting height when the card isn\'t opened', function() {
                var card = new Card({ propsData : { fullscreenActive : false }}).$mount();

                updateActiveHeightSpy = sinon.spy(card, '_updateActiveHeight');
                updateRestingHeightSpy = sinon.spy(card, '_updateRestingHeight');

                card.updateHeight();
                expect(updateActiveHeightSpy.callCount).to.equal(0);
                expect(updateRestingHeightSpy.callCount).to.equal(1);
            });
        });
    });
});
