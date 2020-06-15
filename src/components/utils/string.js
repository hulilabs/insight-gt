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
 * @file StringUtil - String generic helpers
 * @module components/utils/string
 */
define([], function() {
    var StringUtil = {
        /**
         * Escape the special characters that are included in the string
         * @param  {String} text
         * @return {String}
         */
        escapeSpecialCharacters: function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#]/gi, '\\$&').trim();
        },
        /**
         * Change the accent characters for its plain ascii representation
         * @param  {String} text
         * @return {String}
         */
        replaceAccentCharacters: function(text) {
            text = text.replace(/[ÀÁÂÃÄ]/g, 'A');
            text = text.replace(/[àáâãä]/g, 'a');
            text = text.replace(/[ÈÉÊẼË]/g, 'E');
            text = text.replace(/[èéêẽë]/g, 'e');
            text = text.replace(/[ÒÓÔÕÖ]/g, 'O');
            text = text.replace(/[òóôõö]/g, 'o');
            text = text.replace(/[ÌÍÎĨÏ]/g, 'I');
            text = text.replace(/[ìíîĩï]/g, 'i');
            text = text.replace(/[ÙÚÛŨÜ]/g, 'U');
            text = text.replace(/[ùúûũü]/g, 'u');

            return text;
        },
    };

    return StringUtil;
});
