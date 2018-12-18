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
 * Dashboard Main Module
 */

require.config({
    baseUrl: '/',
});

require(['site/js/require-config'], function() {
    // At this point the baseUrl has already been configured
    require(['site/js/app']);
});
