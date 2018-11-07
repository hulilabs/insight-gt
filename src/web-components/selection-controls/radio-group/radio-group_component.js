/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/**
 * @file RadioGroup component
 * @requires vue
 * @requires web-components/selection-controls/radio-button/radio-button_component
 * @requires web-components/selection-controls/radio-group/radio-group_template.html
 * @requires web-components/components/selection-controls/radio-group/radio-group_styles.css
 * @module web-components/components/selection-controls/radio-group/radio-group_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/radio-button} for demos and documentation
 */
define([
    'vue',
    'web-components/selection-controls/radio-button/radio-button_component',
    'text!web-components/selection-controls/radio-group/radio-group_template.html',
    'css-loader!web-components/selection-controls/radio-group/radio-group_styles.css'
],
function(
    Vue,
    RadioButton,
    Template
) {
    /**
     * Available layouts
     * @type {Object}
     */
    var LAYOUT = {
        ROW : 'row',
        COLUMN : 'column',
        LIST : 'list'
    };

    /**
     * Map layout options to classes
     * @type {Object}
     */
    var LAYOUT_CLASS = {
        ROW : 'is-inRadioGroupRow',
        COLUMN : 'is-inRadioGroupColumn',
        LIST : 'is-inRadioGroupList'
    };

    /**
     * Modifier for a compact version of a radio button no matter what layout it has
     * @type {String}
     */
    var COMPACT_CLASS = 'is-compact';

    var RadioGroup = Vue.extend({
        name : 'RadioGroupComponent',
        template : Template,
        props : {
            // Determines the radios alignment or layout for displaying
            layout : {
                type : String,
                default : LAYOUT.LIST,
                validator : function(value) {
                    return LAYOUT.hasOwnProperty(value.toUpperCase());
                }
            },
            // Determines if the radio buttons should have a compact layout (less height than normal)
            compact : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            directionHorizontal : function() {
                return this.layout !== LAYOUT.LIST;
            }
        },
        mounted : function() {
            this._updateChildrenAlignment(this.layout);
        },
        methods : {
            /**
             * Updates the children radio buttons alignment class
             * @param {String} layout - target alignment layout class
             */
            _updateChildrenAlignment : function(layout) {
                // iterates over every radio-button to apply keys
                // management behavior and add the state class
                var layoutClass = LAYOUT_CLASS[layout.toUpperCase()],
                    childClass = this.compact ? [COMPACT_CLASS, layoutClass] : layoutClass;
                this.$children.map(function(child) {
                    if (child instanceof RadioButton) {
                        child.setAlignClass(childClass);
                    }
                }.bind(this));
            }
        },
        watch : {
            /**
             * Updates the alignment of the children when the layout prop is changed
             * @param {String} layout - target alignment layout class
             */
            layout : function(newValue) {
                this._updateChildrenAlignment(newValue);
            },
            /**
             * Listens to changes in the `compact` prop for updating its children classes
             * for adding/removing their 'compact' layout
             */
            compact : function() {
                this._updateChildrenAlignment(this.layout);
            }
        }
    });

    // Bypass available layouts
    RadioGroup.LAYOUT = LAYOUT;

    return RadioGroup;
});
