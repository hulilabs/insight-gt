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
 * @file ComponentLoaderHelper
 * @description Helper for lazy-loading Vue components
 * @requires vue
 * @module web-components/utils/component-loader_helper
 */
define({
    /**
     * Returns a function tha returns a promise that will be used to lazy load components.
     * please notice it returns a function, this is used on vue and vue router
     * https://router.vuejs.org/en/advanced/lazy-loading.html
     * @param {string} module path to the component
     * @return {Function}
     */
    load : function(module) {
        return function() {
            return new Promise(function(resolve) {
                require([module], function(ComponentDefinition) {
                    resolve(ComponentDefinition);
                });
            });
        };
    }
});
