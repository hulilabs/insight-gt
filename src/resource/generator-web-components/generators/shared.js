/* jshint node:true */

/**
 * Dependencies
 */
var helper = require('./helper');

/**
 * Contextualize utilities
 * @param {object} generator
 * @class
 */
var Shared = function(generator) {
    this.generator = generator;

    /**
     * Copy a set of files
     *
     * @param  {string} baseSource      base folder
     * @param  {string} baseDestiny     destination folder
     * @param  {array}  filesDefinition array of objects containing:
     *                                  {string}  name   file name with extension
     *                                  {boolean} append (default: false) append component name on destiny file
     * @param  {string} appendStr       (dfault: _) union between filename and source filename
     */
    this.copy = function(baseSource, baseDestiny, filesDefinition, appendStr) {
        var tplVars = this.getTemplateVariables();
        appendStr = appendStr ? appendStr : '_';
        for (var i = 0; i < filesDefinition.length; i++) {
            var file = filesDefinition[i],
                destFile = file.append ? this.generator.name + appendStr + file.name : file.name,
                // Yeoman uses EJS template engine (http://ejs.co/)
                // All templates must be .ejs extension
                tplPath = this.generator.templatePath(baseSource + file.name + '.ejs'),
                destPath = this.generator.destinationPath(baseDestiny + destFile);
            // Output or copy file
            if (this.generator.options.dryRun) {
                this.generator.log('will create:', destPath);
            } else {
                this.generator.fs.copyTpl(tplPath, destPath, tplVars);
            }
        }
    };

    /**
     * Set parameter 'name'
     * Force value to be lower case
     *
     * @param {string} name (optional)
     */
    this.setName = function(name) {
        this.generator.name = (name ? name : this.generator.name ? this.generator.name : '').toLowerCase();
    };

    /**
     * @typedef  {Object} TemplateVars
     * @property {String} componentNameTitleCase       component name with first letter uppercase
     * @property {String} componentNameLowerCase       component name as provided via params
     * @property {String} componentNameLowerCasePlural component name in lower case plural
     */
    /**
     * Retrieve template variables for rendering
     *
     * @return {TemplateVars}
     */
    this.getTemplateVariables = function() {
        var name = this.generator.name;

        return {
            componentNameTitleCase : helper.toTitleCase(name),
            componentNameLowerCase : name,
            componentNameLowerCasePlural : helper.pluralize(name)
        };
    };
};

module.exports = Shared;