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
/**
 * @file Icon button unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/buttons/icon/icon-button_component
 * @module test/web-components/button/icon-button-test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/buttons/icon/icon-button_component'
],
function(
    Vue,
    VueTestHelper,
    IconButton
) {
    describe('IconButton', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    avatarClass : undefined,
                    avatarPath : undefined,
                    avatarText : undefined,
                    disabled : false,
                    disabledAvatarPath : undefined,
                    hover : false,
                    iconClass : undefined,
                    iconContent : undefined,
                    iconModifier : undefined,
                    imageIconAlt : undefined,
                    imageIconPath : undefined,
                    light : false,
                    notification : false,
                    raised : false,
                    smartFocus : false
                };

                var vm = new IconButton().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    avatarClass : 'avatar-class',
                    avatarPath : '/to/some/file',
                    avatarText : 'test',
                    disabled : true,
                    disabledAvatarPath : '/to/another/file',
                    hover : true,
                    iconClass : 'some-icon',
                    iconContent : 'test icon',
                    iconModifier : 'light',
                    imageIconAlt : 'description',
                    imageIconPath : '/icon/path',
                    light : true,
                    notification : true,
                    raised : true,
                    smartFocus : true
                };

                var vm = new IconButton({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('creates a button element', function() {
            var iconButton = new IconButton().$mount();
            expect(iconButton.$el.tagName).to.equal('BUTTON');
        });

        it('adds disabled attribute', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon-button ref="button" disabled>test</wc-icon-button>',
                components : {
                    'wc-icon-button' : IconButton
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.button.$el.attributes.disabled).to.exist; // jshint ignore:line
        });
    });
});
