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
/* jshint mocha:true, expr:true */
/* global expect, describe, it, before, context */
/**
 * @file Chip unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/chip/chip_component
 * @requires web-components/utils/adaptive/adaptive
 * @module test/web-components/chips/chip_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/chips/chip/chip_component',
    'web-components/utils/adaptive/adaptive'
],
function(
    Vue,
    VueTestHelper,
    Chip,
    AdaptiveUtil
) {
    describe('Chip', function() {
        before(function() {
            Vue.component('wc-chip', Chip);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    avatarText : null,
                    closeButtonVisible : false,
                    hasError : false,
                    imagePath : null,
                    mobile : AdaptiveUtil.isMobile(),
                    text : 'Test',
                    value : null
                };

                var vm = new Chip({ propsData : props}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('as deletable', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-chip ref="chip" v-bind:text="text"></wc-chip>',
                    data : function() {
                        return {
                            text : 'test'
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('triggers the close action', function() {
                var chip = vm.$refs.chip;
                chip.close();
            });
        });
    });
});
