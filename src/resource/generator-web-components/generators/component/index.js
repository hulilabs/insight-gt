/**
 * Yeoman generator for any first-level huli web components
 * This will ease the task of creating a new web component and force our naming conventions
 *
 * @see src/resource/generator-web-components/app/index
 *
 * @use
 *     yo web-components:component {name}
 *     yo web-components:component {name} --dry-run
 */

/* jshint node:true */

/**
 * Dependencies
 */
var generator = require('../base'),
    helper = require('../helper');

module.exports = generator.extend({
    /**
     * Writing
     * - Process component templates to repository structure
     */
    writing : function() {
        /**
         * Component files
         */
        this.shared.copy('component/','web-components/' + helper.pluralize(this.name) + '/',[{
            name : 'component.js',
            append : true
        },{
            name : 'readme.md',
            append : false
        },{
            name : 'styles.scss',
            append : true
        },{
            name : 'template.html',
            append : true
        }]);

        /**
         * Test files
         */
        this.shared.copy('','test/web-components/' + this.name + '/',[{
            name : 'test.js',
            append : true
        }]);
    }
});
