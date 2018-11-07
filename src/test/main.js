var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
        //allTestFiles.push(file);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl : '/base',

    // dynamically load all test files
    deps : allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback : window.__karma__.start,

    // alias for paths
    // jscs:disable disallowQuotedKeysInObjects, validateQuoteMarks
    paths : {
        "text" : "site/js/lib/vendor/text/text",
        "vue" : "site/js/lib/vendor/vue/dist/vue",
        "vuex" : "site/js/lib/vendor/vuex/dist/vuex",
        "vue-router" : "site/js/lib/vendor/vue-router/dist/vue-router",
        "marked" : "site/js/lib/vendor/marked/marked.min",
        "pages" : "site/js/pages",
        "highlight" : "site/js/lib/vendor/highlight/highlight.pack",
        "css-loader" : "site/js/lib/vendor/require-css/css",
        "waves" : "site/js/lib/vendor/Waves/dist",
        "jump" : "site/js/lib/vendor/jump.js/dist/jump"
    }
});
