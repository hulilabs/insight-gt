
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
        "marked" : "site/js/lib/vendor/marked/marked.min",
        "pages" : "site/js/pages",
        "highlight" : "site/js/lib/vendor/highlight/highlight.pack",
        "css-loader" : "site/js/lib/vendor/require-css/css",
        "waves" : "site/js/lib/vendor/Waves/dist",
        "jump" : "site/js/lib/vendor/jump.js/dist/jump",
        "jszip": "site/js/lib/vendor/jszip/dist/jszip",
        "filesaver": "site/js/lib/vendor/file-saver/dist/FileSaver",
        "zxcvbn" : "site/js/lib/vendor/zxcvbn/dist/zxcvbn",
        "utilities" : "site/js/insight-gt/utilities",
        "colors" : "site/js/insight-gt/utilities/colors",
        "image-segmentation" : "site/js/insight-gt/image",
        "morph" : "site/js/insight-gt/image/morph",
        "web-components" : "site/js/lib/vendor/web-components/src/web-components"
    },
    "waitSeconds" : 30
});
