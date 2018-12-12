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
    'web-components/selection-controls/checklist/checklist_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior'
],
function(
    Vue,
    VueTestHelper,
    Checklist,
    Checkbox,
    KeyboardFocusBehavior
) {
    describe('Checklist', function() {
        it('binds KeyboardFocusBehavior', function() {
            var keyboardBehaviorBindStub = sinon.stub(KeyboardFocusBehavior.prototype, 'bind');

            var keyboardBehaviorAddSpy = sinon.spy(KeyboardFocusBehavior.prototype, 'add');

            var ParentComponent = Vue.extend({
                template : '<wc-checklist ref="checklist"><wc-checkbox ref="ch1"></wc-checkbox><wc-checkbox ref="ch2"></wc-checkbox></wc-checklist>',
                components : {
                    'wc-checklist' : Checklist,
                    'wc-checkbox' : Checkbox
                }
            });

            var vm = new ParentComponent().$mount();

            expect(keyboardBehaviorBindStub.firstCall.args[0]).to.equal(vm.$refs.checklist.$el);

            expect(keyboardBehaviorAddSpy.callCount).to.equal(2);
            expect(keyboardBehaviorAddSpy.firstCall.args[0]).to.equal((vm.$refs.ch1));
            expect(keyboardBehaviorAddSpy.secondCall.args[0]).to.equal((vm.$refs.ch2));

            keyboardBehaviorBindStub.restore();
            keyboardBehaviorAddSpy.restore();
        });

        it('adds is-inCheckList to inner wc-checkbox elements', function() {
            var ParentComponent = Vue.extend({
                template : '<wc-checklist ref="checklist"><wc-checkbox ref="ch1"></wc-checkbox><wc-checkbox ref="ch2"></wc-checkbox></wc-checklist>',
                components : {
                    'wc-checklist' : Checklist,
                    'wc-checkbox' : Checkbox
                }
            });

            var vm = new ParentComponent().$mount();
            expect(vm.$refs.ch1.cssClass).to.equal('is-inCheckList');
            expect(vm.$refs.ch2.cssClass).to.equal('is-inCheckList');
        });

        it('_updateChildrenAlignment', function(done) {
            var ParentComponent = Vue.extend({
                template : '<wc-checklist ref="checklist"><wc-checkbox ref="ch1"></wc-checkbox><wc-checkbox ref="ch2"></wc-checkbox></wc-checklist>',
                components : {
                    'wc-checklist' : Checklist,
                    'wc-checkbox' : Checkbox
                }
            });

            var vm = new ParentComponent().$mount();
            vm.$refs.checklist.displayRow = true;

            vm.$nextTick(function() {
                expect(vm.$refs['ch1'].cssClass).to.equal('is-inCheckRow');
                done();
            });
        });
    });
});
