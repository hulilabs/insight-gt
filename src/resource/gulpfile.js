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
 * @file gulpfile that contains all the gulp tasks
 * @description in charge of optimize the asset for the release
 *
 *
 * Available tasks:
 *
 * `gulp` aka gulp default, execute the development mode
 * `gulp development` watches the js and css files, on each file changed it lints the file and compiles it.
 * `gulp lintScripts` lint the scripts files (eslint)
 **/

/**
 * Dependencies
 */
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    eslint = require('gulp-eslint'),
    gulpConfig = require('./gulp-config');

require('gulp-stats')(gulp);

/**
 * Checks the code structure and syntax of the javascript files
 * #eslint
 */
gulp.task('lintScripts', function() {
    var config = gulpConfig.tasks.lintScripts;
    return lintScripts(config);
});

/**
 * Lints the scripts
 * @param {Object} config -  check build-process/gulp-config for more details
 * @param {String[]} [src] - overrides the config.src
 * @returns {*}
 */
function lintScripts(config, src) {
    return gulp
        .src(src || config.src)
        .pipe(eslint(config.eslint.options))
        .pipe(eslint.result(config.eslint.formatter))
        .pipe(eslint.failAfterError());
}

gulp.task('lint', ['lintScripts']);

/**
 * Development ---------
 */

gulp.task('watchJs', function() {
    var config = gulpConfig.tasks.lintScripts;
    gulp.watch(config.src, function(event) {
        console.log('#*----- Linting scripts ....');
        return lintScripts(config, event.path);
    });
});

gulp.task('development', ['watchJs']);

/***
 * Default task
 * gulp
 */
gulp.task('default', ['development']);
