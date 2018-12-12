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
 * @file ComponentLoaderHelper unit tests
 * @requires web-components/utils/component-loader_helper
 * @module test/web-components/utils/component-loader-test
 */
define([
    'web-components/utils/component-loader_helper'
],
function(
    ComponentLoaderHelper
) {
    describe('ComponentLoaderHelper', function() {

        it('#load', function(done) {
            var loader = ComponentLoaderHelper.load('test/sample-component');
            loader().then(function(comp) {
                expect(comp).to.be.a('function');
                done();
            });
        });
    });
});
