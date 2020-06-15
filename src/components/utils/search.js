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
 * @file Search
 * @module components/utils/search
 */
define(['components/utils/string'], function(StringUtil) {
    /**
     * Process the option text for setting the strong tag to the match string
     * If the input is 'na', this is the format example: {
     *     text : 'Panamá',
     *     match : 'Pa<strong>na</strong>má',
     *     value : 3
     * }
     * @param  {Object} option
     * @param  {string} buffer
     * @param  {String} optionKey - key to access in the option object
     */
    var _processOptionText = function(option, buffer, optionKey) {
        var optionText = option[optionKey],
            text = StringUtil.replaceAccentCharacters(optionText.toLowerCase()),
            optionTextPosition = 0,
            matchIndex = null,
            result = '';

        while (text.length) {
            matchIndex = text.indexOf(buffer);
            if (matchIndex === -1) {
                result += optionText.substring(optionTextPosition);
                break;
            }
            result += [
                optionText.substring(optionTextPosition, matchIndex + optionTextPosition),
                '<strong>',
                optionText.substring(
                    matchIndex + optionTextPosition,
                    matchIndex + optionTextPosition + buffer.length
                ),
                '</strong>',
            ].join('');

            text = text.substring(matchIndex + buffer.length);
            optionTextPosition += matchIndex + buffer.length;
        }

        option.match = result;
    };

    /**
     * Escapes the special characters and replace the accent characters from a string
     * @param  {String} text
     * @return {String}
     */
    var _processTextForFilter = function(text) {
        text = StringUtil.escapeSpecialCharacters(text);
        text = StringUtil.replaceAccentCharacters(text);

        return text;
    };

    /**
     * Filters the options to show the ones that match the text provided
     * @param {Array} options
     * @param {String} text
     * @param {string} optionKey - key to access in the options items
     * @return {Array}
     */
    var filter = function(options, text, optionKey) {
        var filteredOptions = [];

        optionKey = optionKey || 'text';
        text = text.trim();

        if (text.length > 0) {
            var re = new RegExp(_processTextForFilter(text), 'gi'),
                buffer = StringUtil.replaceAccentCharacters(text.toLowerCase());

            filteredOptions = options.filter(function(option) {
                if (StringUtil.replaceAccentCharacters(option[optionKey]).match(re)) {
                    _processOptionText(option, buffer, optionKey);
                    return option;
                }
            });
        } else {
            filteredOptions = options.map(function(option) {
                option.match = option[optionKey];
                return option;
            });
        }

        return filteredOptions;
    };

    return {
        filter: filter,
    };
});
