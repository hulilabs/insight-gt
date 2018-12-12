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
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    Vue,
    SelectionControlFocusBehavior
) {
    describe('SelectionControlFocusBehavior', function() {
        it('stores references to provided input and focus manager on initialization', function() {
            var focusBehavior = new SelectionControlFocusBehavior('input-element-fake', 'focus-manager-fake');

            expect(focusBehavior.inputElement).to.equal('input-element-fake');
            expect(focusBehavior.componentFocusManager).to.equal('focus-manager-fake');
        });

        context('on smart focus binding', function() {
            var vm, fakeFocusManager, focusBehavior;

            beforeEach(function() {
                var Component = Vue.extend({
                    template : '<input type="checkbox" ref="checkbox"/>'
                });

                vm = (new Component()).$mount();

                fakeFocusManager = {
                    hide : sinon.spy(),
                    show : sinon.spy()
                };

                focusBehavior = new SelectionControlFocusBehavior(vm.$el, fakeFocusManager);
            });

            it('binds change event handler to bound component', function() {
                var changeSpy = sinon.spy(focusBehavior, '_onChange');

                focusBehavior.bind(vm, {changeEvent : 'change'});
                vm.$emit('change');

                expect(changeSpy.callCount).to.equal(1);
            });

            it('binds focus/blur event handlers to provided <input>', function() {
                focusBehavior.inputElement = {
                    addEventListener : function(event, listener) {
                        listener(event);
                    }
                };

                var focusSpy = sinon.spy(focusBehavior, '_onFocus'),
                    blurSpy = sinon.spy(focusBehavior, '_onBlur');

                focusBehavior.bind(vm, {changeEvent : 'change'});

                expect(focusSpy.firstCall.args).to.deep.equal([fakeFocusManager, 'focus']);
                expect(blurSpy.firstCall.args).to.deep.equal([fakeFocusManager, 'blur']);
            });

            it('calls componentFocusManager.hide when calling _onChange', function() {
                focusBehavior.bind(vm, {changeEvent : 'change'});

                focusBehavior._onChange(fakeFocusManager);
                expect(fakeFocusManager.hide.callCount).to.equal(1);
                expect(fakeFocusManager.show.callCount).to.equal(0);
            });

            it('calls componentFocusManager.show when calling _onFocus', function() {
                focusBehavior.bind(vm, {changeEvent : 'change'});

                focusBehavior._onFocus(fakeFocusManager);
                expect(fakeFocusManager.hide.callCount).to.equal(0);
                expect(fakeFocusManager.show.callCount).to.equal(1);
            });

            it('calls componentFocusManager.hide when calling _onBlur', function() {
                focusBehavior.bind(vm, {changeEvent : 'change'});

                focusBehavior._onBlur(fakeFocusManager);
                expect(fakeFocusManager.hide.callCount).to.equal(1);
                expect(fakeFocusManager.show.callCount).to.equal(0);
            });
        });
    });
});
