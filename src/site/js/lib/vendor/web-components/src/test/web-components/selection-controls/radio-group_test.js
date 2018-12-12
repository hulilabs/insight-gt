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
    'test/helpers/vue-components',
    'web-components/selection-controls/radio-group/radio-group_component',
    'web-components/selection-controls/radio-button/radio-button_component'
],
function(
    Vue,
    VueTestHelper,
    RadioGroup,
    RadioButton
) {
    describe('RadioGroup', function() {
        before(function() {
            Vue.component('wc-radio-button', RadioButton);
            Vue.component('wc-radio-group', RadioGroup);
        });

        it('adds is-inRadioGroupList to inner wc-radio-button elements', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-radio-group><wc-radio-button value="a" ref="r1"></wc-radio-button><wc-radio-button value="b" ref="r2"></wc-radio-button></wc-radio-group>'
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.r1.cssClass).to.equal('is-inRadioGroupList');
            expect(vm.$refs.r2.cssClass).to.equal('is-inRadioGroupList');
        });

        it('adds is-compact to inner wc-radio-button elements', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-radio-group compact><wc-radio-button value="a" ref="r1"></wc-radio-button><wc-radio-button value="b" ref="r2"></wc-radio-button></wc-radio-group>'
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.r1.cssClass.indexOf('is-compact')).to.not.equal(-1);
            expect(vm.$refs.r2.cssClass.indexOf('is-compact')).to.not.equal(-1);
        });

        it('changes the layout when the bound props are changed', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-radio-group v-bind:layout="layout" v-bind:compact="compact"><wc-radio-button value="a" ref="r1"></wc-radio-button><wc-radio-button value="b" ref="r2"></wc-radio-button></wc-radio-group>',
                data : function() {
                    return {
                        layout : 'row',
                        compact : false
                    };
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.r1.cssClass).to.equal('is-inRadioGroupRow');
            expect(vm.$refs.r2.cssClass).to.equal('is-inRadioGroupRow');

            vm.layout = 'list';
            vm.compact = true;
            vm.$nextTick(function() {
                expect(vm.$refs.r1.cssClass).to.deep.equal(['is-compact', 'is-inRadioGroupList']);
                expect(vm.$refs.r2.cssClass).to.deep.equal(['is-compact', 'is-inRadioGroupList']);
                done();
            });
        });
    });
});
