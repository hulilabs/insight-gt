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
 * @file Vue DOM references mixin
 * @module web-components/mixins/vue-refs_mixin
 */
define([], function() {

    /**
     * @typedef {VueReference}
     * @property {local} vue component logical reference to $refs
     * @property {key}   $refs key
     * @property {index} $refs index for v-for references
     */

    return {
        methods : {
            /**
             * Compose a bindable object to bypass a vue reference in a parent-child dependency
             *
             * <wc-target ref="target"></wc-target>
             * <wc-component v-bind:trigger="composeVueRef('target')"></wc-component>
             *
             * We should avoid using selectors (ie. #target) for this purpose.
             * It is not a component-oriented neither reactive way to bind a DOM reference
             *
             * @param  {String} refKey $refs key
             * @param  {Number} index  useful for v-for references
             * @return {VueReference}
             */
            composeVueRef : function(refKey, index) {
                return { local : this.$refs, key : refKey, index : index || 0 };
            }
        }
    };

});
