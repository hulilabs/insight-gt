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
 * @file OSUtil - detects operating system using user agent tests
 * @module components/utils/os
 */
define([], function() {
    /**
     * Possible OS options
     * @type {Object}
     */
    var OS = {
        ANDROID: 'android',
        IOS: 'ios',
        UNKNOWN: 'unknown',
        WINDOWS_PHONE: 'windows-phone',
    };

    /**
     * Data for matching OS and related information
     * Must ordered in evaluation sequence
     * @type {Array}
     */
    var OS_MATCHES = [
        // Windows Phone must come first because its UA also contains "Android"
        {
            match: /windows phone/i,
            name: OS.WINDOWS_PHONE,
        },
        {
            match: /android/i,
            name: OS.ANDROID,
        },
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        {
            match: /iPad|iPhone|iPod/,
            name: OS.IOS,
        },
    ];

    var OperatingSystem = function() {
        // defaults to unknown
        this.os = OS.UNKNOWN;
    };

    OperatingSystem.prototype = {
        /**
         * Detects current user agent and stores the matching OS
         * @return {OperatingSystem} this
         */
        detect: function() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            for (var s = 0; s < OS_MATCHES.length; s++) {
                var data = OS_MATCHES[s];
                if (data.match.test(userAgent)) {
                    this.os = data.name;
                    break;
                }
            }

            return this;
        },
        /**
         * Returns true if current OS is Android
         * @return {Boolean}
         */
        isAndroid: function() {
            return this.os === OS.ANDROID;
        },
    };

    return new OperatingSystem().detect();
});
