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
/* jshint mocha:true, expr:true *//* global expect */
/**
 * @file DOM utility unit tests
 * @requires web-components/utils/dom
 * @module test/web-components/utils/date-test
 */
define([
    'web-components/utils/dom'
],
function(
    DOMUtil
) {

    describe('DOMUtil', function() {
        var element;

        beforeEach(function() {
            var parent = document.createElement('div');
            element = document.createElement('div');
            parent.appendChild(element);
        });

        context('#hasHorizontalScroll', function() {
            it('no scroll', function() {
                expect(DOMUtil.hasHorizontalScroll(element)).to.be.false;
            });
        });

        context('#hasVerticalScroll', function() {
            it('no scroll', function() {
                expect(DOMUtil.hasVerticalScroll(element)).to.be.false;
            });
        });

        context('#getDocumentOffsetLeft', function() {
            it('at origin 0', function() {
                expect(DOMUtil.getDocumentOffsetLeft(element)).to.be.zero;
            });
        });

        context('#getDocumentOffsetTop', function() {
            it('at origin 0', function() {
                expect(DOMUtil.getDocumentOffsetTop(element)).to.be.zero;
            });
        });

        context('#getScrollOffsetLeft', function() {
            it('at origin 0', function() {
                expect(DOMUtil.getScrollOffsetLeft(element)).to.be.zero;
            });
        });

        context('#getScrollOffsetTop', function() {
            it('at origin 0', function() {
                expect(DOMUtil.getScrollOffsetTop(element)).to.be.zero;
            });
        });
    });
});
