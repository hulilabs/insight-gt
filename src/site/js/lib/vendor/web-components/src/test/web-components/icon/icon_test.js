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
define([
    'vue',
    'web-components/icons/icon_component'
],
function(
    Vue,
    Icon
) {

    describe('Icon', function() {
        before(function() {
            Vue.component('wc-icon', Icon);
        });

        context('as image icon', function() {
            var vm, iconElement;
            beforeEach(function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-icon ref="icon" image-icon-alt="star" image-icon-path="/site/img/star.svg" icon-class="a-star"> </wc-icon>'
                });

                vm = new ParentComponent().$mount();
                iconElement = vm.$refs.icon.$el.getElementsByClassName('wc-Icon__icon')[0];
            });

            it('renders an <img> tag', function() {
                expect(iconElement.tagName).to.equal('IMG');
            });

            it('renders an image\'s `alt`', function() {
                expect(iconElement.attributes.alt.value).to.equal('star');
            });

            it('adds a class to the image icon\'s image', function() {
                expect(iconElement.classList.contains('a-star')).to.equal(true);
            });
        });

        context('as a font icon', function() {
            var vm, iconElement;
            beforeEach(function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-icon ref="icon" icon-content="toys" icon-class="material-icons"></wc-icon>'
                });

                vm = new ParentComponent().$mount();
                iconElement = vm.$refs.icon.$el.getElementsByClassName('wc-Icon__icon')[0];
            });

            it('renders an <i> tag', function() {
                expect(iconElement.tagName).to.equal('I');
            });

            it('adds text to generated tag', function() {
                expect(iconElement.innerHTML).to.equal('toys');
            });
        });

        it('adds the `notification` prop', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-icon ref="icon" icon-class="some-icon" notification></wc-icon>'
            });

            var vm = new ParentComponent().$mount(),
                iconElement = vm.$refs.icon.$el;

            expect(iconElement.classList.contains('has-notification')).to.be.true;
        });

    });
});
