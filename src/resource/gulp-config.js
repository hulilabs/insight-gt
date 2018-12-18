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
    source : './../'
};

/**
 * tasks configuration
 * has a child with configuration for each gulp task
 */

var tasks = {
    lintScripts : {
        src : [
            paths.source + 'components/**/*.js',
            paths.source + 'site/js/**/*.js',
            '!' + paths.source + 'site/js/lib/**',
            '!' + paths.source + 'site/js/insight-gt/**'],
        jshint : {
            configuration : './jshint-config.jshintrc',
            reporter : 'jshint-stylish'
        },
        jscs : {
            configuration : {
                configPath : '.jscsrc'
            }
        }
    }
};

module.exports = {
    paths : paths,
    tasks : tasks
};
