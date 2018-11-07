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
    'test/helpers/vue-components',
    'web-components/buttons/flat/flat-button_component',
    'web-components/behaviors/a11y/button-focus/button-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    FlatButton,
    ButtonFocusBehavior
) {

    describe('FlatButton', function() {
        it('creates a button element', function() {
            var flatButton = new FlatButton().$mount();
            expect(flatButton.$el.tagName).to.equal('BUTTON');
        });

        it('exposes the expected props', function() {
            var props = {
                disabled : true,
                large : true,
                smartFocus : true,
                link : true,
                active : true
            };
            var vm = new FlatButton({ propsData : props }).$mount();
            VueTestHelper.checkDefinedProps(props, vm);
        });

        it('adds disabled attribute', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-flat-button ref="button" disabled>test</wc-flat-button>',
                components : {
                    'wc-flat-button' : FlatButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.attributes.disabled).to.exist; // jshint ignore:line
        });

        it('adds `is-large` modifier', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-flat-button ref="button" large>test</wc-flat-button>',
                components : {
                    'wc-flat-button' : FlatButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.classList.contains('is-large')).to.equal(true);
        });

        it('adds `is-link` modifier', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-flat-button ref="button" link>test</wc-flat-button>',
                components : {
                    'wc-flat-button' : FlatButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.classList.contains('is-link')).to.equal(true);
        });

        it('adds `is-active` modifier', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-flat-button ref="button" active>test</wc-flat-button>',
                components : {
                    'wc-flat-button' : FlatButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.classList.contains('is-active')).to.equal(true);
        });

        context('when handling smartFocus prop', function() {
            var focusBindStub;
            beforeEach(function() {
                focusBindStub = sinon.spy(ButtonFocusBehavior, 'bind');
            });

            afterEach(function() {
                focusBindStub.restore();
            });

            it('applies smart focus when the prop is set', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-flat-button ref="button" smart-focus> </wc-flat-button>',
                    components : {
                        'wc-flat-button' : FlatButton
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(focusBindStub.callCount).to.equal(1);
            });

            it('doesn\'t apply smart focus if prop isn\'t set', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-flat-button> </wc-flat-button>',
                    components : {
                        'wc-flat-button' : FlatButton
                    }
                });

                new ParentComponent().$mount();
                expect(focusBindStub.callCount).to.equal(0);
            });

        });
    });
});
