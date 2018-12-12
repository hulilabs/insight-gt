/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * |  _  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/* jshint mocha:true, expr:true *//* global expect, sinon */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/mixins/input/input-container_behavior'
],
function(
    Vue,
    VueTestHelper,
    InputContainerBehaviorMixin
) {

    describe('InputContainerBehaviorMixin', function() {

        var ComponentDefinition = Vue.extend({
            mixins : [ InputContainerBehaviorMixin ],
            template : '<div></div>'
        });

        context('when used in a component', function() {

            it('sets the expected props with their default values', function() {
                var props = {
                    actionDisabled : false,
                    charCounter : false,
                    color : null,
                    errorMessage : null,
                    floatingLabel : false,
                    hasError : false,
                    nativeError : false,
                    hideInputHighlighter : false,
                    hintText : null,
                    label : null,
                    modifier : null,
                    placeholder : null,
                    showSecondaryStyle : false
                };

                vm = new ComponentDefinition().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets the expected props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    charCounter : true,
                    color : 'orange',
                    errorMessage : 'test',
                    floatingLabel : true,
                    hasError : true,
                    nativeError : true,
                    hideInputHighlighter : true,
                    hintText : 'test',
                    label : 'test',
                    modifier : null,
                    placeholder : 'placeholder',
                    showSecondaryStyle : true
                };

                vm = new ComponentDefinition({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
