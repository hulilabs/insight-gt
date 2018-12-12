/**
 * Yeoman generator for our first-level huli web component documentation page (internal site)
 * This will ease the task of creating a new web component and force our naming conventions
 *
 * @see src/resource/generator-web-components/app/index
 *
 * @use
 *     yo web-components:site {name}
 *     yo web-components:site {name} --dry-run
 */

/* jshint node:true */

/**
 * Dependencies
 */
var generator = require('../base');

module.exports = generator.extend({
    /**
     * Writing
     * - Process site templates to repository structure
     */
    writing : function() {
        /**
         * Site files
         */
        this.shared.copy('','site/js/pages/' + this.name + '/',[{
            name : 'page_component.js',
            append : true
        },{
            name : 'page_template.html',
            append : true
        }],'-');
    }
});
