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
/* global expect, describe, it*/
define([
    'vue',
    'web-components/buttons/raised/raised-button_component'
],
function(
    Vue,
    RaisedButton
) {

    describe('RaisedButton', function() {
        it('creates a button element', function() {
            var raisedButton = new RaisedButton().$mount();
            expect(raisedButton.$el.tagName).to.equal('BUTTON');
        });

        it('adds disabled attribute', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-raised-button ref="button" disabled>test</wc-raised-button>',
                components : {
                    'wc-raised-button' : RaisedButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.attributes.disabled).to.exist; // jshint ignore:line
        });

        it('adds `is-large` modifier', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-raised-button ref="button" large>test</wc-raised-button>',
                components : {
                    'wc-raised-button' : RaisedButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.classList.contains('is-large')).to.equal(true);
        });
    });
});
