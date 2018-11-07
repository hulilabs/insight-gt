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
    'web-components/buttons/icon/icon-button_component',
    'web-components/behaviors/a11y/button-focus/button-focus_behavior'
],
function(
    Vue,
    IconButton,
    ButtonFocusBehavior
) {

    describe('IconButton', function() {
        before(function() {
            Vue.component('wc-icon-button', IconButton);
        });

        it('passes props to wc-Icon child', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon-button ref="iconButton" icon-class="a-star" icon-content="star-content" notification image-icon-path="foo" image-icon-alt="bar"> </wc-icon-button>'
            });

            var vm = new ParentComponent().$mount(),
                iconButton = vm.$refs.iconButton,
                iconProps = iconButton.$refs.icon.$options.propsData;

            expect(iconProps).to.deep.equal({
                iconClass : 'a-star',
                iconContent : 'star-content',
                notification : true,
                imageIconPath : 'foo',
                imageIconAlt : 'bar'
            });
        });

        it('adds modifier to inner wc-Icon component', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon-button ref="iconButton" iconModifier="wc-Icon--size-6x"> </wc-icon-button>'
            });

            var vm = new ParentComponent().$mount(),
                iconButton = vm.$refs.iconButton,
                icon = iconButton.$refs.icon;

            expect(icon.$el.classList.contains('wc-Icon--size-6x')).to.be.true;
        });

        it('adds disabled attribute', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon-button ref="iconButton" disabled light colored> </wc-icon-button>'
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.iconButton.$el.attributes.disabled).to.exist;
        });

        it('adds a different image when disabled', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon-button ref="iconButton" disabled avatar-path="star.svg" disabled-avatar-path="star-disabled.svg"> </wc-icon-button>'
            });
            var vm = new ParentComponent().$mount(),
                imagePath = vm.$refs.iconButton.imagePath;

            expect(imagePath).to.equal('star-disabled.svg');
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
                    template : '<wc-icon-button ref="iconButton" smart-focus> </wc-icon-button>'
                });

                var vm = new ParentComponent().$mount();
                expect(focusBindStub.callCount).to.equal(1);
            });

            it('doesn\'t apply smart focus if prop isn\'t set', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-icon-button ref="iconButton"> </wc-icon-button>'
                });

                new ParentComponent().$mount();
                expect(focusBindStub.callCount).to.equal(0);
            });

        });
    });
});
