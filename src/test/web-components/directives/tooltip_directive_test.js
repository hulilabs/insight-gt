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
/**
 * @file Tooltip unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/tooltip/tooltip_component
 * @module test/web-components/tooltips/tooltip_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tooltips/tooltip_component',
    'web-components/directives/tooltip/tooltip_directive'
],
function(
    Vue,
    VueTestHelper,
    Tooltip,
    TooltipDirective
) {
    describe('TooltipDirective', function() {

        before(function() {
            TooltipDirective.bind();

            // Register a dummy component for testing
            Vue.component('wc-component', Vue.extend({
                template : '<div></div>'
            }));
        });

        /**
         * Create a testing anchor with a tooltip define by a directive
         * @param  {Boolean}  active
         * @param  {String}   alignment
         * @param  {Function} customTest
         */
        function verifyTooltipDirective(tag, active, alignment, customTest) {
            // Open template
            var template = [
                '<div>',
                '<' + tag + ' ref="trigger" '
            ];

            // Directive, props and modifiers
            var directive = ['v-wc-tooltip'];
            if (active) { directive.push('.active'); }
            if (alignment) { directive.push('.alignment:' + alignment); }
            directive.push('="\'text\'">');
            template.push(directive.join(''));

            // Close template
            template.push('</' + tag + '>');
            template.push('</div>');

            // Generate testing component
            var ComponentDefinition = Vue.extend({
                    template : template.join('')
                }),
                vm = new ComponentDefinition().$mount();

            // Run custom test
            var trigger = vm.$refs.trigger;
            customTest(trigger, vm);
        }

        it('adds default tooltip to element', verifyTooltipDirective.bind(this, 'a', null, null, function(trigger) {
            var tooltip = trigger.$refs.tooltip;
            expect(tooltip.triggerElement).to.equal(trigger);
            expect(tooltip.state.isActive).to.equal(false);
            expect(tooltip.active).to.equal(false);
            expect(tooltip.alignment).to.equal('bottom');
        }));

        it('adds custom tooltip to element', verifyTooltipDirective.bind(this, 'a', true, 'right', function(trigger) {
            var tooltip = trigger.$refs.tooltip;
            expect(tooltip.triggerElement).to.equal(trigger);
            expect(tooltip.state.isActive).to.equal(true);
            expect(tooltip.active).to.equal(true);
            expect(tooltip.alignment).to.equal('right');
        }));

        it('adds default tooltip to a vue component');
    });
});
