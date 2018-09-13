/* jshint node:true */

/**
 * Dependencies
 */
var generator = require('yeoman-generator'),
    Shared = require('./shared');

/**
 * Constants
 */
var PARAM_NAME_LABEL = 'component name';

module.exports = generator.Base.extend({
    /**
     * Constructor
     * - Process optional parameter name
     */
    constructor : function() {
        generator.Base.apply(this, arguments);

        // Dry run would not create files
        this.option('dry-run');

        // Component name argument
        this.argument('name', {
            desc : PARAM_NAME_LABEL,
            type : String,
            optional : true,
            required : false
        });

        // Contextualize utilities
        this.shared = new Shared(this);
        this.shared.setName();
    },
    /**
     * Prompting
     * - Request for optional parameter name
     */
    prompting : function() {
        var prompts = [];

        if (!this.name) {
            prompts.push({
                type : 'input',
                name : 'name',
                message : PARAM_NAME_LABEL
            });
        }

        if (prompts.length > 0) {
            return this.prompt(prompts).then(function(answers) {
                this.shared.setName(answers.name);
            }.bind(this));
        } else {
            return Promise.resolve();
        }
    }
});