/* jshint node:true */

/**
 * Shared helpers
 */
module.exports = {
    /**
     * Pluralize string (append 's')
     *
     * @param  {string} str
     * @return {string}
     */
    pluralize : function(str) {
        return str + 's';
    },
    /**
     * Transform single-word to title case
     * app => App
     *
     * @param  {string} str
     *
     * @return {string}
     */
    wordTitleCase : function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    },
    /**
     * Transform name parameters to component name in title case with dashes removal
     * app-bar => AppBar
     *
     * @param  {string} str
     *
     * @return {string}
     */
    toTitleCase : function(str) {
        var self = this;
        // Split parameter by dashes
        str = str.split('-');
        // Transform first string
        str[0] = self.wordTitleCase(str[0]);
        // Reduce parts into a single string transforming them to title case
        return str.reduce(function(pV, cV) {
            return pV + self.wordTitleCase(cV);
        });
    }
};