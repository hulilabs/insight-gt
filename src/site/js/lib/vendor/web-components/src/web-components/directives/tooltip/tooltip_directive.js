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
/**
 * @file tooltip directive
 * @requires vue
 * @requires web-components/tooltips/tooltip_component
 * @module web-components/directives/tooltip/tooltip_directive
 */
define([
    'vue',
    'web-components/tooltips/tooltip_component'
],
function(
    Vue,
    Tooltip
) {
    /**
     * TooltipDirective, adds a tooltip to any dom element (known as trigger)
     * Import this file on your main app repo and call `bind` method before any Vue setup
     * @see https://vuejs.org/guide/custom-directive.html for feature details
     *
     * Directive name: v-wc-tooltip
     */
    var TooltipDirective = {
        bind : function() {
            Vue.directive('wc-tooltip', {
                inserted : function(el, binding) {

                    // Validate value : only textual values are accepted (not null or undefined)
                    if (!binding.value) {
                        return;
                    }

                    // Validate DOM element
                    if (!el.parentNode) {
                        return console.log('wc-tooltip: trigger node has no parent node'); // jshint ignore:line
                    }

                    // Compose dynamic tooltip template
                    var template = ['<wc-tooltip'];

                    // Link trigger element on compile
                    template.push(' v-bind:triggerElement="triggerElement"');

                    // Process binder options
                    for (var key in binding.modifiers) {
                        var value = binding.modifiers[key];
                        if (key === 'active') {
                            template.push(' active');
                        } else if (key.indexOf('alignment') !== -1 && value) {
                            template.push(' alignment="' + key.split(':')[1] + '"');
                        }
                    }

                    // Insert tooltip default slot content
                    template.push('>' + binding.value + '</wc-tooltip>');

                    // Create a sibling div for mounting the tooltip component
                    var tooltipMount = document.createElement('div');
                    el.parentNode.insertBefore(tooltipMount, el.nextSibling);

                    // Create a dynamic component definition for the tooltip
                    var DynamicTooltip = Vue.extend({
                        name : 'DynamicTooltipComponent',
                        // A dynamic template is used because of the default slot content
                        template : template.join(''),
                        components : {
                            'wc-tooltip' : Tooltip
                        },
                        computed : {
                            // Use a computed property to link the trigger element
                            triggerElement : function() {
                                return el;
                            }
                        }
                    });

                    // Mount tooltip
                    new DynamicTooltip().$mount(tooltipMount);
                }
            });
        }
    };

    return TooltipDirective;
});
