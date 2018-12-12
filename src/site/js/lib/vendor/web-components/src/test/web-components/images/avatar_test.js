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
/* global expect, describe, it, before, beforeEach, context */
/**
 * @file Avatar unit test
 * @requires  vue
 * @requires  test/helpers/vue-components
 * @requires  web-components/images/avatar/avatar_component
 * @module  test/web-components/images/avatar/avatar_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/images/avatar/avatar_component'
],
function(
    Vue,
    VueTestHelper,
    Avatar
) {

    describe('Avatar', function() {
        before(function() {
            Vue.component('wc-avatar', Avatar);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    imagePath : null,
                    text : null,
                    square : false,
                    expand : false
                };
                var vm = new Avatar({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom text value', function() {
                var props = {
                    text : 'Julio Health',
                    imagePath : null,
                    square : false,
                    expand : false
                };
                var vm = new Avatar({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom imagePath value', function() {
                var props = {
                    text : null,
                    imagePath : '/site/img/doctor-male.svg',
                    square : false,
                    expand : false
                };
                var vm = new Avatar({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('as image avatar', function() {
            var vm;
            beforeEach(function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-avatar ref="avatar" class="wc-Avatar--size-9x" v-bind:imagePath="avatarSource.svgPath"></wc-avatar>',
                    data : function() {
                        return {
                            avatarSource : {
                                svgPath : '/site/img/doctor-male.svg'
                            }
                        };
                    }
                });

                vm = new ParentComponent().$mount();
            });

            it('renders an <wc-avatar> tag with the class wc-Avatar--transparent', function() {
                expect(vm.$refs.avatar.$el.classList.contains('wc-Avatar--transparent')).to.equal(true);
            });
        });
    });
});
