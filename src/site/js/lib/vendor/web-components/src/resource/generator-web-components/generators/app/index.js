/**
 * Yeoman generator for any first-level huli web components
 * This will ease the task of creating a new web component and force our naming conventions
 *
 * Repository: https://github.com/hulilabs/web-components/
 *
 * @todo
 *     - nested-level examples: bars/app-bar , buttons/raised-button
 *       define a naming convention for nested-level and they may run
 *       as a generator subcontroller (yo web-components:nested {name})
 *
 * @arguments
 *     name: component name
 *
 * @options
 *     dry-run: outputs folder paths and files without creation
 *
 * @install
 *     cd src/resource/generator-web-components/  # change to generator root folder
 *     npm install -g yo                          # install yeoman
 *     npm install                                # install generator node modules (dependencies)
 *     npm link                                   # create a symlink to local generator
 *
 * @compose
 *     component : creates component boilerplate       # css, html, js, unit test
 *     site      : creates component site boilerplate  #      html, js
 *
 * @use
 *     # root folder is defined at src/.yo-rc.json
 *     # generator can be run at src/resource/generator-web-components/  OR  src/
 *     yo web-components {name}
 *     yo web-components {name} --dry-run
 */

/* jshint node:true */

/**
 * Dependencies
 */
var generator = require('../base');

/**
 * Constants
 */
var PARAM_NAME_LABEL = 'component name';

module.exports = generator.extend({
    /**
     * Configuring
     * - Update components storage
     */
    configuring : function() {
        // Define default configuration
        this.config.defaults({
            components : []
        });

        // End execution if the component is found at the storage
        if (this.config.get('components').indexOf(this.name) !== -1) {
            // var done = this.aync(); done(err)
            this.env.error('Component "' + this.name + '" is already registered');
        }
    },
    /**
     * Writing
     * - Compose component generator
     * - Compose site generator
     */
    writing : function() {
        // Output template variables for verification
        var tplVars = this.shared.getTemplateVariables();
        this.log('Template variables:', JSON.stringify(tplVars));

        // Output bypass options
        var options = {
            args : [this.name],
            options : {
                dryRun : this.options.dryRun
            }
        };
        this.log('Compose options:', JSON.stringify(options));

        // Compose sub-generators
        this.composeWith('web-components:component', options);
        this.composeWith('web-components:site', options);
    },
    /**
     * End
     * - Update components storage
     */
    end : function() {
        // Update components storage
        if (!this.options.dryRun) {
            var components = this.config.get('components');
            components.push(this.name);
            this.config.set('components', components);
        }
    }
});