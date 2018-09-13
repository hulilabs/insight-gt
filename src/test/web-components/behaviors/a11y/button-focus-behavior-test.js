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
    'web-components/behaviors/a11y/button-focus/button-focus_behavior'
],
function(
    ButtonFocusBehavior
) {
    describe('ButtonFocusBehavior', function() {
        context('when binding focus behavior', function() {
            it('properly toggles NO_FOCUS class', function() {
                var dummyElement = {
                    addEventListener : function(listenerName, listenerHandler) {
                        listenerHandler();
                    },

                    classList : {
                        add : sinon.spy(),
                        remove : sinon.spy()
                    }
                };

                ButtonFocusBehavior.bind(dummyElement);

                expect(dummyElement.classList.add.calledWithExactly('is-focus-disabled')).to.be.true;
                expect(dummyElement.classList.add.callCount).to.equal(1);

                expect(dummyElement.classList.remove.alwaysCalledWithExactly('is-focus-disabled')).to.be.true;
                expect(dummyElement.classList.remove.callCount).to.equal(2);
            });

            it('properly adds event handlers to corresponding events', function() {
                var dummyElement = {
                    addEventListener : sinon.spy()
                };

                ButtonFocusBehavior.bind(dummyElement);

                expect(dummyElement.addEventListener.firstCall.args[0]).to.equal('mousedown');
                expect(dummyElement.addEventListener.secondCall.args[0]).to.equal('blur');
                expect(dummyElement.addEventListener.thirdCall.args[0]).to.equal('keyup');

                expect(dummyElement.addEventListener.callCount).to.equal(3);
            });
        });
    });
});
