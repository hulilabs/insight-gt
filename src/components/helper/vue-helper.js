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
 * @file Vue helpers
 * @module web-components/helper/vue-helper
 */
define([], function() {

    var VueHelper = {
        /**
         * Defines a computed value (reactive object property)
         * Works as a wrapper for Object utilities
         * The object is modified by reference
         *
         * @param  {Object} object      instance by reference
         * @param  {String} computedKey computed property name
         * @param  {Object} definition  see below link
         *
         * @see  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
         */
        defineComputed : function(object, computedKey, definition) {
            Object.defineProperty(object, computedKey, definition);
        },
        /**
         * Check if a component instance has some computed property
         * @param  {VueComponent}  component    component instance
         * @param  {String}        computedKey  computed propery name
         * @return {Boolean}
         */
        hasComputed : function(component, computedKey) {
            // Detect if computer property is local or part of prototype
            var proto = Object.getPrototypeOf(component);
            return component.hasOwnProperty(computedKey) || (proto && proto.hasOwnProperty(computedKey));
        },
        /**
         * Bypass a vue component computed property to another object definition
         * Commonly used by binders for bypassing reactive properties
         * The object is modified by reference
         *
         * @param  {VueComponent}  component    component instance
         * @param  {String}        computedKey  computed propery name
         * @param  {Object}        storeVar     variable used to bypass computed property
         * @param  {string}        storeKey     destiny property name
         *
         * @see  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
         *       https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
         */
        bypassComputed : function(component, computedKey, storeVar, storeKey) {
            var descriptor = {};

            if (component.hasOwnProperty(computedKey)) {
                descriptor = Object.getOwnPropertyDescriptor(component, computedKey);
            } else if (this.hasComputed(component, computedKey)) {
                // After vue 2.2.x, computed properties were moved to the prototype instead of local properties
                // The following is a hack to retrieve the computed definition by binding its context
                descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(component), computedKey);
            } else {
                // @todo log cant bypass computed
                return;
            }

            // Force component context to avoid `this` binding
            descriptor.get = descriptor.get.bind(component);
            descriptor.set = descriptor.set.bind(component);

            Object.defineProperty(storeVar, storeKey, descriptor);
        }
    };

    return VueHelper;
});
