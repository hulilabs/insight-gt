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
 * @file ClickUtil unit tests
 * @requires  web-components/utils/click
 * @module  test/web-components/utils/click-test
 */
define([
    'web-components/utils/click'
],
function(
    ClickUtil
) {
    describe('ClickUtil', function() {
        it('adds listeners for double click and click to the same element', function() {
            var div = document.createElement('div'),
                addEventListenersStub = sinon.stub(div, 'addEventListener', function(event, callback) {
                    callback();
                }),
                spy = sinon.spy();

            ClickUtil.attachClickListeners(div, spy, spy);

            expect(spy.callCount).to.be.equal(1);
            expect(addEventListenersStub.callCount).to.be.equal(2);

            ClickUtil.removeClickListeners(div);

            addEventListenersStub.restore();
        });

        it('adds listeners for click to the same element', function(done) {
            var div = document.createElement('div'),
                 addEventListenersStub = sinon.stub(div, 'addEventListener', function(event, callback) {
                    if (event !== 'dblclick') {
                        callback();
                    }
                });

            ClickUtil.attachClickListeners(div, done);
        });
    });
});
