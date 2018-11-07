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
/* jshint mocha:true, expr:true *//* global expect */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/mixins/input/input_behavior'
],
function(
    Vue,
    VueTestHelper,
    InputBehaviorMixin
) {

    describe('InputBehaviorMixin', function() {

        var ComponentDefinition = Vue.extend({
            mixins : [InputBehaviorMixin],
            template : '<div></div>'
        });

        context('when used in a component', function() {
            var vm;

            it('sets the expected props with their default values', function() {
                var props = {
                    type : null,
                    name : null,
                    id : null,
                    value : null,
                    disabled : null,
                    required : null,
                    maxLength : null,
                    minLength : null,
                    readonly : null,
                    min : null,
                    max : null,
                    step : null,
                    autocomplete : null
                };

                vm = new ComponentDefinition({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets the expected props with custom values', function() {
                var props = {
                    type : 'text',
                    name : 'test',
                    id : 'test',
                    value : 'test',
                    disabled : true,
                    required : true,
                    maxLength : 10,
                    minLength : 5,
                    readonly : true,
                    min : "10",
                    max : "5",
                    step : 3,
                    autocomplete : true
                };

                vm = new ComponentDefinition({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });
    });
});
