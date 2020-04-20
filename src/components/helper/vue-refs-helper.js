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
 * @file Vue DOM references helper
 * @module web-components/helper/vue-refs-helper
 */
define(['vue'], function(Vue) {

    /**
     * @typedef {VueReference}
     * @property {local} vue component logical reference to $refs
     * @property {key}   $refs key
     * @property {index} $refs index for v-for references
     */

    /**
     * Resolves a vue reference DOM element
     * @param  {VueReference} definition
     * @return {HTMLElement}
     */
    function resolveVueRef(definition) {
        if (definition instanceof HTMLElement) {
            return definition;
        } else if (definition instanceof Node) {
            // Text, Comment, Element (others different from HTMLElement)
            // Return no references as this elements do not API for dimensions
            return null;
        } else if (typeof definition === 'object') {
            var element = definition.local[definition.key];

            // Extract DOM element from referenced vue component
            // On v-for, referenced elements are stored in an array
            element = (element instanceof Array && element[definition.index]) ? element[definition.index] : element;

            return element instanceof Vue ? element.$el : element;
        } else {
            return null;
        }
    }

    /**
     * Define a component property that can be a HTMLElement or a VueReference
     * @param  {Boolean} required
     * @return {Object}  vue property definition
     */
    function prop(required) {
        return {
            type : [HTMLElement, Object],
            required : required || false,
            // Verifies if the provided value its a HTMLElement or a VueReference
            validator : function(value) {
                if (value instanceof HTMLElement) {
                    return true;
                } else if (typeof value === 'object') {
                    return value.hasOwnProperty('local') && value.hasOwnProperty('key');
                } else {
                    return false;
                }
            }
        };
    }

    return {
        resolveVueRef : resolveVueRef,
        prop : prop
    };
});
