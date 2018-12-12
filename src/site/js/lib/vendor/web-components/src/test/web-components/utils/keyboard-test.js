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
    'web-components/utils/keyboard'
],
function(
    KeyboardUtil
) {
    describe('KeyboardUtil', function() {

        context('#inSet', function() {
            it('keycode is in set', function() {
                expect(KeyboardUtil.inSet(KeyboardUtil.CODE.LEFT, KeyboardUtil.SETS.ARROWS)).to.be.true;
                expect(KeyboardUtil.inSet(KeyboardUtil.CODE.ENTER, KeyboardUtil.SETS.NAVIGATION)).to.be.true;
            });
            it('keycode not in set', function() {
                expect(KeyboardUtil.inSet(KeyboardUtil.CODE.LEFT, KeyboardUtil.SETS.NAVIGATION)).to.be.false;
                expect(KeyboardUtil.inSet(KeyboardUtil.CODE.ENTER, KeyboardUtil.SETS.ARROWS)).to.be.false;
            });
        });
    });
});
