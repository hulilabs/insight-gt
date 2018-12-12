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
    'vue',
    'web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior',
    'web-components/utils/keyboard'
],
function(
    Vue,
    KeyboardFocusBehavior,
    KeyboardUtil
) {
    describe('KeyboardFocusBehavior', function() {
        it('initializes expected properties', function() {
            var behavior = new KeyboardFocusBehavior();

            expect(behavior.focusableComponents).to.deep.equal([]);
            expect(behavior.currentIndex).to.equal(0);
        });

        it('binds focus and keydown events', function() {
            var behavior = new KeyboardFocusBehavior();

            var onFocusStub = sinon.stub(behavior.onFocus, 'bind'),
                onKeyPressStub = sinon.stub(behavior._onKeyPress, 'bind');

            onFocusStub.onFirstCall().returns('focusHandler');
            onKeyPressStub.onFirstCall().returns('keydownHandler');

            // calls bind with fake Element
            behavior.bind({
                addEventListener : function(event, handler, capture) {
                    if (event === 'focus') {
                        expect(capture).to.be.true;
                        expect(handler).to.equal('focusHandler');
                    }

                    if (event === 'keydown') {
                        expect(handler).to.equal('keydownHandler');
                    }
                }
            });

            expect(onFocusStub.callCount).to.equal(1);
            expect(onKeyPressStub.callCount).to.equal(1);
        });

        it('checks key press selection', function() {
            var behavior = new KeyboardFocusBehavior(),
                // righ() stub to track calls
                rightStub = sinon.stub(behavior, 'right'),
                // fake event object
                event = {
                    which : KeyboardUtil.CODE.RIGHT,
                    preventDefault : function() {}
                };

            behavior._onKeyPress(event);

            expect(rightStub.callCount).to.equal(1);
        });

        it('adds component to focusable elements', function() {

            var dummyComponent = {
                getInput : function() {
                    return {
                        setAttribute : sinon.spy()
                    };
                }
            };

            var behavior = new KeyboardFocusBehavior();
            behavior.add(dummyComponent);
            expect(behavior.focusableComponents).to.contain(dummyComponent);
        });

        it('moves up on KeyboardFocusBehavior#up called', function() {
            var behavior = new KeyboardFocusBehavior();
            var moveStub = sinon.spy(behavior, '_move');

            behavior.up();

            expect(moveStub.firstCall.args).to.deep.equal([-1]);
        });

        it('moves down on KeyboardFocusBehavior#down called', function() {
            var behavior = new KeyboardFocusBehavior();
            var moveStub = sinon.spy(behavior, '_move');

            behavior.down();

            expect(moveStub.firstCall.args).to.deep.equal([1]);
        });

        it('moves up on KeyboardFocusBehavior#left called', function() {
            var behavior = new KeyboardFocusBehavior();
            var moveStub = sinon.spy(behavior, '_move');

            behavior.left();

            expect(moveStub.firstCall.args).to.deep.equal([-1]);
        });

        it('moves down on KeyboardFocusBehavior#right called', function() {
            var behavior = new KeyboardFocusBehavior();
            var moveStub = sinon.spy(behavior, '_move');

            behavior.right();

            expect(moveStub.firstCall.args).to.deep.equal([1]);
        });

        it('updates current focused element index when onFocus is called', function() {
            var behavior = new KeyboardFocusBehavior();

            behavior.onFocus({
                target : {
                    getAttribute : function() {
                        return 500;
                    }
                }
            });

            expect(behavior.currentIndex).to.equal(500);
        });

        it('moves focus', function() {
            var behavior = new KeyboardFocusBehavior();

            var fakeComponentFocusSpyDown = sinon.spy();
            var fakeComponentToFocusDown = {
                getInput : function() {
                    return {
                        focus : fakeComponentFocusSpyDown
                    };
                }
            };

            var fakeComponentFocusSpyUp = sinon.spy();
            var fakeComponentToFocusUp = {
                getInput : function() {
                    return {
                        focus : fakeComponentFocusSpyUp
                    };
                }
            };

            behavior.focusableComponents = [
                {
                    disabled : true
                },
                fakeComponentToFocusUp,
                {
                    disabled : true
                },
                fakeComponentToFocusDown,
                {
                    disabled : true
                }
            ];

            // implicitly tests _move(DOWN)
            behavior.currentIndex = 1;
            behavior.down();

            // the fake component was focused!
            expect(fakeComponentFocusSpyDown.callCount).to.equal(1);

            behavior.currentIndex = 3;
            behavior.up(); // implicitly tests _move(UP)
            expect(fakeComponentFocusSpyUp.callCount).to.equal(1);
        });

        it('obtains next component to apply focus to from array when moving', function() {
            var behavior = new KeyboardFocusBehavior();
            behavior.focusableComponents = [
                {
                    disabled : true
                },
                {
                    disabled : true
                },
                {
                    dummyComponent : 'focus me'
                },
                {
                    disabled : true
                }
            ];

            var nextComponentIndexToFocus = behavior._getEnabledComponentIndexAhead(1, 0);
            expect(nextComponentIndexToFocus).to.equal(2);
        });

        it('returns getInput if avaialable to obtains focusable element', function() {
            var getInputStub = sinon.stub();
            getInputStub.onFirstCall().returns('input');

            var behavior = new KeyboardFocusBehavior();
            var returnedInput = behavior._getFocusableElementFromComponent({
                getInput : getInputStub
            });

            expect(returnedInput).to.equal('input');
        });

        it('uses $el when obtaining focusable element and no getInput method is present', function() {
            var getInputStub = sinon.stub();
            getInputStub.onFirstCall().returns('input');

            var behavior = new KeyboardFocusBehavior();
            var returnedInput = behavior._getFocusableElementFromComponent({
                $el : 'el'
            });

            expect(returnedInput).to.equal('el');
        });
    });
});
