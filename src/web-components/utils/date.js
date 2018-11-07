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
 * @file DateUtil - Common functions for date objects
 * @module web-components/utils/date
 */
define(function() {
    /**
     * Adjustment in seconds for converting a 12h format date to 24h
     * @type {Number}
     */
    var TIMEZONE_ADJUSTMENT = 60000;
    /**
     * International Standard format.
     * String values extracted from inputs type date use this format.
     * @type {String}
     */
    var ISO_FORMAT = 'yyyy-mm-dd';

    /**
     * Formats for the values of minutes, hours, day, month, year
     * @type {Object}
     */
    var FORMAT = {
        MINUTE : 'mi',
        HOUR : 'hh',
        DAY : 'dd',
        MONTH : 'mm',
        YEAR : 'yyyy'
    };

    /**
     * Determines if a format complies with the rules for a date format string.
     * Currently, there's support only for strings that represent each date
     * element with the characters defined in the FORMAT object above.
     * @param  {String}  format value to be evaluated as a valid format
     * @return {Boolean} if the value complies with the format rules
     */
    function _isValidFormat(format) {
        var containsDay = format.indexOf(FORMAT.DAY) !== -1,
            containsMonth = format.indexOf(FORMAT.MONTH) !== -1,
            containsYear = format.indexOf(FORMAT.YEAR) !== -1;

        return containsDay && containsMonth && containsYear;
    }

    /**
     * Determines if a given date is valid.
     * This only ensures the value is a Date object, but doesn't validate
     * months or days (e.g.: february 30th).
     * @param  {Date|String} date value to be evaluated
     * @return {Boolean} if the given value is valid
     */
    function isValidDate(date) {
        if (!date) {
            return false;
        }

        date = (typeof date === 'string') ? new Date(date) : date;
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getDate());
    }

    /**
     * Determines if two date object are equal.
     * This is based in the string notation of the date object, so the criteria
     * to determine if they are equal is their respective day of the week, month, date and year.
     * @param  {Date} date1 first value to be evaluated
     * @param  {Date} date2 second value to be evaluated
     * @return {Boolean} if the given dates are equal
     */
    function areEqual(date1, date2) {
        if (!isValidDate(date1)) {
            return false;
        }

        if (!isValidDate(date2)) {
            return false;
        }

        return date1.toDateString() === date2.toDateString();
    }

    /**
     * Gets the UTC (delocalized) value of a date object.
     * It removes the timezone adjustments and converts the date to a 24h format.
     * @param  {Date|String} date value that will be transformed to UTC
     * @return {?Date} delocalized value of the given date or null if the params are invalid
     */
    function getUTCValue(date) {
        if (!isValidDate(date)) {
            return null;
        }

        var date = (typeof date === 'string') ? new Date(date) : date;
        return new Date(date.getTime() + (date.getTimezoneOffset() * TIMEZONE_ADJUSTMENT));
    }

    /**
     * Gets the amount of days the given month of the given year has.
     * @param  {Number} month number corresponding to a month (0-based)
     * @param  {Number} year  required year for calculating february days in leap-years
     * @return {?Number} amount of days of the respective month or null if the params are invalid
     */
    function getMonthDays(month, year) {
        if (month === undefined || month === null || isNaN(month)) {
            return null;
        } else if (year === undefined || year === null || isNaN(year)) {
            return null;
        }

        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    /**
     * Translates a date represented by a Date object or a string, into a string
     * with the specified format. This method only allows target formats compliant of the
     * following rules:
     *     - Representing minutes with 'mi'
     *     - Representing hours with 'hh'
     *     - Representing days with 'dd'
     *     - Representing months with 'mm'
     *     - Representing years with 'yyyy'
     * @param  {String|Date} date   value to be translated to a string into the target format
     * @param  {String}      format target string format
     * @return {?String} string representation of the given date in the given format
     */
    function toString(date, format) {
        if (!isValidDate(date) || !format || !_isValidFormat(format)) {
            return null;
        }

        var dateObj = new Date(date),
            result = format,
            hours = dateObj.getHours().toString(),
            minutes = dateObj.getMinutes().toString(),
            day = dateObj.getDate().toString(),
            month = (dateObj.getMonth() + 1).toString(),
            year = dateObj.getFullYear().toString();

        hours = (hours.length === 2) ? hours : '0' + hours;
        minutes = (minutes.length === 2) ? minutes : '0' + minutes;
        day = (day.length === 2) ? day : '0' + day;
        month = (month.length === 2) ? month : '0' + month;

        return result.replace(FORMAT.YEAR, year)
                     .replace(FORMAT.MONTH, month)
                     .replace(FORMAT.DAY, day)
                     .replace(FORMAT.HOUR, hours)
                     .replace(FORMAT.MINUTE, minutes);
    }

    /**
     * Translates a date string that is given in the specified format, into a date object.
     * This method only allows formats that comply with:
     *     - Representing minutes with 'mi'
     *     - Representing hours with 'hh'
     *     - Representing days with 'dd'
     *     - Representing months with 'mm'
     *     - Representing years with 'yyyy'
     * If the given string doesn't match the format, if the format doesn't comply
     * with the rules or if the resulting date isn't a valid date, null will be returned.
     * @param  {String} dateString string representation of a date in the given format
     * @param  {String} format     string compliant with the format rules
     * @return {?Date}  the parsed value of the given date string or null if the result isn't valid
     */
    function toDate(dateString, format) {
        if (!dateString || !format || !_isValidFormat(format)) {
            return null;
        }

        // Obtaining the positions where the date elements are placed in the format
        var dayIndex = format.indexOf(FORMAT.DAY),
            monthIndex = format.indexOf(FORMAT.MONTH),
            yearIndex = format.indexOf(FORMAT.YEAR),
            minuteIndex = format.indexOf(FORMAT.MINUTE),
            hourIndex = format.indexOf(FORMAT.HOUR);

        // The values are obtained from the given date string,
        // according to the position of the elements in the format
        var day = dateString.slice(dayIndex, dayIndex + FORMAT.DAY.length),
            month = dateString.slice(monthIndex, monthIndex + FORMAT.MONTH.length),
            year = dateString.slice(yearIndex, yearIndex + FORMAT.YEAR.length),
            hours = (hourIndex > -1) ? dateString.slice(hourIndex, hourIndex + FORMAT.HOUR.length) : '00',
            minutes = (minuteIndex > -1) ? dateString.slice(minuteIndex, minuteIndex + FORMAT.MINUTE.length) : '00';

        // Creates a new date from an ISO format string according to the calculated year/month/day values
        // we add zero seconds and a 'Z' to make sure that the date is parsed as UTC
        var dateString = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':00Z',
            date = getUTCValue(new Date(dateString));

        return isValidDate(date) ? date : null;
    }

    /**
     * Gets an ISO formatted string representation of the given date value.
     * @param  {Date|String} date value to be formatted
     * @return {?String} the given value with ISO format or null if the params are invalid
     */
    function getISOFormatValue(date) {
        return toString(date, ISO_FORMAT);
    }

    return {
        areEqual : areEqual,
        getISOFormatValue : getISOFormatValue,
        getMonthDays : getMonthDays,
        getUTCValue : getUTCValue,
        isValidDate : isValidDate,
        toDate : toDate,
        toString : toString
    };
});
