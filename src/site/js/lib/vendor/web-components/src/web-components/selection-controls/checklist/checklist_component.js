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
 * @file Checklist component
 * @requires vue
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior
 * @requires web-components/selection-controls/checklist/checklist_template.html
 * @requires web-components/components/selection-controls/checklist/checklist_styles.css
 * @module web-components/components/selection-controls/checklist/checklist_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/checkbox} for demos and documentation
 */
define([
    'vue',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior',
    'text!web-components/selection-controls/checklist/checklist_template.html',
    'css-loader!web-components/selection-controls/checklist/checklist_styles.css'
],
function(
    Vue,
    Checkbox,
    KeyboardFocusBehavior,
    Template
) {

    // state to let the checkbox know that's part of a checklist
    var CHECKLIST_STATE_CLASS = 'is-inCheckList';
    var CHECKROW_STATE_CLASS = 'is-inCheckRow';

    var Checklist = Vue.extend({
        name : 'ChecklistComponent',
        template : Template,
        props : {
            // sets whether the radio group should be displayed in a row
            // (horizontal) instead of a list (vertical)
            displayRow : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                /**
                 * Behavior for allowing keyboard navigation between checklist elements
                 */
                checklistArrowBehavior : null
            };
        },
        mounted : function() {
            // binds behavior to allow keyboard arrow interaction
            // to move focus using UP and DOWN keys
            this.checklistArrowBehavior = new KeyboardFocusBehavior();
            this.checklistArrowBehavior.bind(this.$el);

            this._updateChildrenAlignment(this.displayRow);
        },
        methods : {
            /**
             * Updates the children checkboxes alignment class
             */
            _updateChildrenAlignment : function(displayRow) {
                // vertical or horizontal alignment state
                var childClass = displayRow ? CHECKROW_STATE_CLASS : CHECKLIST_STATE_CLASS;

                // iterates over every checkbox to apply keys management behavior and
                // add the state class
                this.$children.map(function(child) {
                    if (child instanceof Checkbox) {
                        this.checklistArrowBehavior.add(child);
                        child.setAlignClass(childClass);
                    }
                }.bind(this));
            }
        },

        watch : {
            /**
             * Updates the alignment of the children when the displayRow prop is changed
             * @param  {Boolean} newValue
             */
            displayRow : function(newValue) {
                this._updateChildrenAlignment(newValue);
            }
        }
    });

    return Checklist;
});
