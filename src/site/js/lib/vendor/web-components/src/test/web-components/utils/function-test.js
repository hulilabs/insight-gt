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
 * @file FunctionUtil unit tests
 * @requires  web-components/utils/function
 * @module  test/web-components/utils/function-test
 */
define([
    'web-components/utils/function'
],
function(
    FunctionUtil
) {
    var TIMEOUT = 300;

    describe('FunctionUtil', function() {

        it('#debounce', function() {
            var spy = sinon.spy();
            FunctionUtil.debounce(spy, TIMEOUT);
            expect(spy.notCalled).to.be.true;
        });
    });
});
