/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 *
 * @file environment and configuration variables for gulp
 **/

/**
 * paths configuration
 */
var paths = {
    source: './../',
};

/**
 * tasks configuration
 * has a child with configuration for each gulp task
 */

var tasks = {
    lintScripts: {
        src: [
            paths.source + 'web-components/**/*.js',
            paths.source + 'site/js/**/*.js',
            '!' + paths.source + 'site/js/lib/**',
            '!' + paths.source + 'site/js/insight-gt/**',
            '!' + paths.source + 'site/js/require-config.js',
        ],
        eslint: {
            formatter: result => {
                if (result.messages.length || result.warningCount || result.errorCount) {
                    // Called for each ESLint result.
                    console.log(`\nESLint result: ${result.filePath}`);
                    result.messages.forEach(function(message) {
                        let isAnError = message.fatal || message.severity === 2;
                        let severity = isAnError ? 'error' : 'warning';
                        let position = `${message.line}:${message.column}`;
                        console.log(
                            `${position} \t ${severity} \t ${message.ruleId} \t ${message.message}`
                        );
                    });
                    console.log('\n');
                }
            },
            options: {
                configFile: '../../.eslintrc',
            },
        },
    },
};

module.exports = {
    paths: paths,
    tasks: tasks,
};
