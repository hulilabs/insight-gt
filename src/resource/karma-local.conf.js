// Karma configuration
// Generated on Tue Jun 07 2016 20:10:52 GMT-0600 (CST)
module.exports = function(config) {

    // test coverage reporters
    var reporters = ['progress'];

    // if flag is provided, will also display coverage report
    if (config.coverage) {
        reporters.push('coverage');
    }

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath : '../',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // frameworks: ['jasmine', 'requirejs'],
        frameworks : ['requirejs', 'mocha', 'chai', 'sinon'],
        // aditional plugins
        plugins : [
          'karma-mocha',
          'karma-chai',
          'karma-sinon',
          'karma-requirejs',
          'karma-phantomjs-launcher',
          'karma-firefox-launcher',
          'karma-chrome-launcher',
          'karma-coverage'
        ],
        // list of files / patterns to load in the browser
        files : [
            // including polyfill twice, to support both docker and native test run
            'resource/node_modules/babel-polyfill/dist/polyfill.js',
            'test/main.js',
            {
                pattern : 'web-components/**/*',
                included : false
            },
            {
                pattern : 'test/**/*.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/text/text.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/vuex/dist/vuex.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/vue/dist/vue.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/require-css/css.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/Waves/dist/waves.*',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/marked/marked.min.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/highlight/highlight.pack.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/jump.js/dist/jump.js',
                included : false
            },
            {
                pattern : 'site/js/lib/vendor/interactjs/dist/interact.js',
                included : false
            }
        ],
        // list of files to exclude
        exclude : [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors : {
            // enables test coverage report in web-components JS files
            'web-components/**/*.js' : 'coverage'
        },
        coverageReporter : {
            // @see https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#reporters
            reporters : [{
                type : 'text'
            }],
            check : {
                // coverage thresholds, see: https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#check
                global : {
                    statements : 80,
                    lines : 80,
                    functions : 80,
                    // branches coverage check to be aded once more research about the measure is done
                    // branches : 80,
                    excludes : [
                        'web-components/chips/chip/*.js',
                        'web-components/directives/gestures/*.js',
                        'web-components/drawers/*.js',
                        'web-components/lists, *.js',
                        'web-components/menus/*.js',
                        'web-components/snackbars/*.js',
                        'web-components/steppers/*.js',
                        'web-components/tabs/*.js',
                        'web-components/text-fields/char-counter/*.js',
                        'web-components/tooltips/*.js',
                        'web-components/dialogs/pull-up/*.js',
                        'web-components/interactive/resize/*.js'
                    ]
                },

                each : {
                    statements: 80,
                    // branches coverage check to be added once more research about the measure is done
                    // branches: 80,
                    functions: 80,
                    lines: 80,
                    excludes : [
                        'web-components/chips/chip/*.js',
                        'web-components/directives/gestures/*.js',
                        'web-components/drawers/*.js',
                        'web-components/lists/*.js',
                        'web-components/steppers/*.js',
                        'web-components/menus/*.js',
                        'web-components/snackbars/*.js',
                        'web-components/step-dots/*.js',
                        'web-components/steppers/*.js',
                        'web-components/tabs/*.js',
                        'web-components/text-fields/*.js',
                        'web-components/text-fields/char-counter/*.js',
                        'web-components/tooltips/*.js',
                        'web-components/dialogs/pull-up/*.js',
                        'web-components/interactive/resize/*.js'
                    ]
                }
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters : reporters,
        // web server port
        port : 9876,
        // enable / disable colors in the output (reporters and logs)
        colors : true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel : config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers : config.browser ? config.browser.split(',') : ['Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun : false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency : Infinity
    });
};
