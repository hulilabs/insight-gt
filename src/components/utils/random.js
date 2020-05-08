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
 * @file RandomUtil - String processing and generation util
 * @module components/utils/random
 */
define([], function() {
    var PSEUDO_ID_PREFIX = '__';

    var RandomUtil = {
        /**
         * Generates a pseudo id string with this format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
         * @return {String}
         */
        getPseudoId: function() {
            return (PSEUDO_ID_PREFIX + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(
                /[xy]/g,
                function(c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == 'x' ? r : (r & 0x3) | 0x8; // jshint ignore:line
                    return v.toString(16);
                }
            );
        },

        /**
         * Validates if the provided string matches the format of a pseudokey
         * @param {String}
         * @return {Boolean}
         */
        isPseudoId: function(str) {
            return /^__.{8}-.{4}-4.{3}-.{4}-.{12}$/.test(str);
        },
    };

    return RandomUtil;
});
