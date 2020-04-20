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
 * @file gestures directive
 * @requires vue
 * @typeDef {Object} BindingObject
 *
 */
define([
    'vue',
    'web-components/directives/gestures/gestures_directive-handler'
],
function(
    Vue,
    GestureDirectiveHandler
) {

    /**
     * GestureDirective, it adds the support for several gestures
     * Import this file on your main app repo and call `bind` method before any Vue setup
     * @see https://vuejs.org/guide/custom-directive.html for feature details
     *
     * Directive name: v-wc-gesture
     */
    var GestureDirective = {
        bind : function() {
            Vue.directive('wc-gesture', {
                /**
                 * called only once, when the directive is first bound to the element.
                 * This is where you can do one-time setup work.
                 * @param  {DOMElement} el           component's root el
                 * @param  {BindingObject}  binding with the structure
                 *                      {
                 *                          name,
                 *                          value,
                 *                          oldValue,
                 *                          expression,
                 *                          arg,
                 *                          modifiers
                 *                      }
                 */
                bind : function($el, binding) {
                    GestureDirectiveHandler.bind($el, binding);
                },

                /**
                 * Called when the object changes
                 * @param  {DOMElement} el           component's root el
                 * @param  {BindingObject}  binding with the structure
                 *                      {
                 *                          name,
                 *                          value,
                 *                          oldValue,
                 *                          expression,
                 *                          arg,
                 *                          modifiers
                 *                      }
                 */
                update : function($el, binding) {
                    GestureDirectiveHandler.update($el, binding);
                },

                /**
                 * Called only once, when the directive is unbound from the element.
                 * @param  {DOMElement} el  component's root el
                 * @param  {BindingObject}  binding with the structure
                 *                      {
                 *                          name,
                 *                          value,
                 *                          oldValue,
                 *                          expression,
                 *                          arg,
                 *                          modifiers
                 *                      }
                 */
                unbind : function($el) {
                    GestureDirectiveHandler.unbind($el);
                }
            });
        }
    };

    return GestureDirective;
});
