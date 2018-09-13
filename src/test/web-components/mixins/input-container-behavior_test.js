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
                    label : null,
                    floatingLabel : false,
                    modifier : null,
                    placeholder : null,
                    hasError : false,
                    charCounter : false,
                    errorMessage : null,
                    hideInputHighlighter : false,
                    showSecondaryStyle : false,
                    hintText : null,
                    actionDisabled : false,
                    color : null
                };

                vm = new ComponentDefinition().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets the expected props with custom values', function() {
                var props = {
                    label : 'test',
                    floatingLabel : true,
                    modifier : null,
                    placeholder : 'placeholder',
                    hasError : true,
                    charCounter : true,
                    errorMessage : 'test',
                    hideInputHighlighter : true,
                    showSecondaryStyle : true,
                    hintText : 'test',
                    actionDisabled : true,
                    color : 'orange'
                };

                vm = new ComponentDefinition({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
