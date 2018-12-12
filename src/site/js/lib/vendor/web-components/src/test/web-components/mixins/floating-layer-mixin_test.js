/*  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * |  _  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/* jshint mocha:true, expr:true *//* global expect */
define([
    'vue',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/floating-layer/floating-layer_mixin'
],
function(
    Vue,
    FloatingLayerBehavior,
    FloatingLayerMixin
) {

    describe('FloatingLayerMixin', function() {

        var ComponentDefinition = Vue.extend({
            mixins : [FloatingLayerMixin],
            template : '<div><div ref="trigger"></div><div ref="block"></div></div>',
            computed : {
                floatingLayerState : {
                    get : function() {
                        return this.state.isActive;
                    },
                    set : function(isActive) {
                        this.state.isActive = isActive;
                    }
                }
            },
            mounted : function() {
                this.bindFloatingLayerBehavior({
                    computedStateKey : 'floatingLayerState',
                    floatingElementReferenceKey : 'block',
                    triggerElement : this.$refs.trigger,
                    triggerEvent : FloatingLayerBehavior.EVENT.NONE
                });
            }
        });

        it('#unbindFloatingLayerBehavior', function() {
            var vm = new ComponentDefinition({ propsData : {} }).$mount();
            vm.unbindFloatingLayerBehavior();
            expect(vm.isFloatingBehaviorBound()).to.be.false;
        });

        it('#getFloatingBehavior', function() {
            var vm = new ComponentDefinition({ propsData : {} }).$mount();
            expect(vm.getFloatingBehavior()).to.be.object; // FloatingLayer
        });

        it('#isFloatingBehaviorBound', function() {
            var vm = new ComponentDefinition({ propsData : {} }).$mount();
            expect(vm.isFloatingBehaviorBound()).to.be.true;
        });
    });
});