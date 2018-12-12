
/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | "_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
// jscs:disable disallowQuotedKeysInObjects, validateQuoteMarks
/**
 *  Configure RequireJS baseUrl and paths
 */
require.config({
    "baseUrl" : "/",
    "paths" : {
        "text" : "site/js/lib/vendor/text/text",
        "vue" : "site/js/lib/vendor/vue/dist/vue",
        "vuex" : "site/js/lib/vendor/vuex/dist/vuex",
        "vue-router" : "site/js/lib/vendor/vue-router/dist/vue-router",
        "pages" : "site/js/pages",
        "highlight" : "site/js/lib/vendor/highlight/highlight.pack",
        "css-loader" : "/site/js/lib/vendor/require-css/css",
        "utilities" : "site/js/lib/insight/utilities/utilities",
        "floodfill" : "site/js/lib/insight/utilities/floodfill",
        "segmentation" : "site/js/insight-gt/segmentation",
        "morph" : "site/js/insight-gt/segmentation/morph",
        "web-components" : "site/js/lib/vendor/web-components/src/web-components"
    },
    "waitSeconds" : 30
});
