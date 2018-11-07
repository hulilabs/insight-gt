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
 * @file Thumbnail unit test
 * @requires  vue
 * @requires  test/helpers/vue-components
 * @requires  web-components/images/thumbnail/thumbnail_component
 * @module  test/web-components/images/thumbnail/thumbnail_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/images/thumbnail/thumbnail_component'
],
function(
    Vue,
    VueTestHelper,
    Thumbnail
) {

    describe('Thumbnail', function() {
        before(function() {
            Vue.component('wc-thumbnail', Thumbnail);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    imagePath : '/site/img/doctor-male.svg',
                    size : 3
                };
                var vm = new Thumbnail({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom text value', function() {
                var props = {
                    imagePath : '/site/img/doctor-female.svg',
                    size : 12
                };
                var vm = new Thumbnail({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
