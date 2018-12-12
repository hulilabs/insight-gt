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
 * @requires test/web-components/behaviors/floating-layer/floating-layer_helper
 * @requires web-components/mixins/vue-refs_mixin
 * @requires web-components/tooltip/tooltip_component
 * @requires web-components/utils/adaptive/adaptive
 * @module test/web-components/tooltips/tooltip_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'test/web-components/behaviors/floating-layer/floating-layer_helper',
    'web-components/mixins/vue-refs_mixin',
    'web-components/tooltips/tooltip_component',
    'web-components/utils/adaptive/adaptive'
],
function(
    Vue,
    VueTestHelper,
    FloatingLayerHelper,
    VueRefsMixin,
    Tooltip,
    AdaptiveUtil
) {

    describe('Tooltip', function() {

        /**
         * Compose a testing setup
         *
         * @param {boolean} active
         * @param {string}  alignment
         *
         * @return VueComponent tooltip component
         */
        function getTestingElements(props) {
            // Store template parts for composing
            var template = [
                '<div>',
                '<a ref="tooltipTrigger" href="#">trigger</a>',
                '<wc-tooltip ref="tooltip" v-bind:triggerElement="composeVueRef(\'tooltipTrigger\')"'
            ];

            // Append active state
            if (props.active) {
                template.push(' active');
            }

            // Append custom alignment
            if (props.alignment) {
                template.push(' alignment="' + props.alignment + '"');
            }

            // Handle mobile
            template.push(' v-bind:mobile="' + props.mobile + '"');

            // Close tooltip tag
            template.push('></wc-tooltip></div>');

            // Define testing component
            var ParentComponent = Vue.extend({
                template : template.join(''),
                mixins : [VueRefsMixin],
                components : {
                    'wc-tooltip' : Tooltip
                }
            });

            // Create testing setup, mount and return tooltip component
            var vm = new ParentComponent().$mount();
            return vm.$refs;
        }

        /**
         * Create a testing tooltip with an active state (open or close)
         * Verify the current state was set correctly before custom validations
         *
         * @param  {Boolean}  isOpen   open or close
         * @param  {Function} callback custom test
         */
        function verifyTooltipForState(isOpen, customTest) {
            var vm = getTestingElements({ active : isOpen }).tooltip;
            expect(vm.state.isActive).to.equal(isOpen);
            customTest(vm);
        }

        function verifyTooltipAlignment(alignment) {
            var vm = getTestingElements({ active : true, alignment : alignment }).tooltip;
            expect(vm.alignment).to.equal(alignment);
        }

        context('on instance creation', function() {

            it('sets props with default values', function() {
                var $elements = getTestingElements({});

                VueTestHelper.checkDefinedProps(FloatingLayerHelper.mergeDefaultProps({
                    active : false,
                    alignment : 'bottom',
                    // Hack for avoiding runtime, browser and jet-steps race conditions on detection
                    mobile : $elements.tooltip.mobile,
                    // @todo compose vue reference
                    triggerElement : { local : $elements, key : 'tooltipTrigger', index : 0 }
                }), $elements.tooltip);
            });

            it('sets props with custom values', function() {
                var props = FloatingLayerHelper.mergeDefaultProps({
                        active : true,
                        alignment : 'right',
                        mobile : false
                    }),
                    $elements = getTestingElements(props);

                // @todo compose vue reference
                props.triggerElement = { local : $elements, key : 'tooltipTrigger', index : 0 };

                VueTestHelper.checkDefinedProps(props, $elements.tooltip);
            });
        });

        context('for alignment', function() {
            it('top', verifyTooltipAlignment.bind(this, 'top'));
            it('right', verifyTooltipAlignment.bind(this, 'right'));
            it('bottom', verifyTooltipAlignment.bind(this, 'bottom'));
            it('left', verifyTooltipAlignment.bind(this, 'left'));
        });

        context('#close', function() {

            it('when tooltip is close', verifyTooltipForState.bind(this, false, function(vm) {
                vm.close();
                expect(vm.state.isActive).to.equal(false);
            }));

            it('when tooltip is open', verifyTooltipForState.bind(this, true, function(vm) {
                vm.close();
                expect(vm.state.isActive).to.equal(false);
            }));
        });

        context('#open', function() {

            it('when tooltip is close', verifyTooltipForState.bind(this, false, function(vm) {
                vm.open();
                expect(vm.state.isActive).to.equal(true);
            }));

            it('when tooltip is open', verifyTooltipForState.bind(this, true, function(vm) {
                vm.open();
                expect(vm.state.isActive).to.equal(true);
            }));
        });

        context('#toggle', function() {

            it('when tooltip is close', verifyTooltipForState.bind(this, false, function(vm) {
                vm.toggle();
                expect(vm.state.isActive).to.equal(true);
            }));

            it('when tooltip is open', verifyTooltipForState.bind(this, true, function(vm) {
                vm.toggle();
                expect(vm.state.isActive).to.equal(false);
            }));
        });
    });
});
