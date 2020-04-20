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
 * @file Deleter component
 * @requires vue
 * @requires web-components/deleters/deleter_template.html
 * @requires web-components/deleters/deleter_styles.css
 * @module web-components/deleters/deleter_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/deleter} for demos and documentation
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'text!web-components/deleters/deleter_template.html',
    'css-loader!web-components/deleters/deleter_styles.css'
],
function(
    Vue,
    IconButton,
    Template
) {

    /**
     * List of deleter component events
     * @type {Object}
     */
    var EVENT = {
        ON_DELETE : 'deleter-delete'
    };

    var Deleter = Vue.extend({
        name : 'DeleterComponent',
        template : Template,
        props : {
            /**
             * Defines a key from its parent context
             * Will be send as part of all events fired payload
             */
            itemKey : {
                type : [String, Number],
                default : null
            },
            /**
             * Add a separator when multiple inputs are set as content
             */
            multipleInputs : {
                type : Boolean,
                default : false
            },
            /**
             * Remove the action button padding when only one input without label is set as content
             */
            adjustPadding : {
                type : Boolean,
                default : false
            },
            /**
             * Instead of filling wide, the width will be adjusted compact to its inner content
             */
            adjustContent : {
                type : Boolean,
                default : false
            },
            /**
             * Some placeholder items should not be deletable
             * Display the icon but avoid triggering any event
             */
            disableDelete : {
                type : Boolean,
                default : false
            }
        },
        methods : {
            /**
             * Handler of the delete action button (trash can)
             * @fires module:Tab#ON_DELETE
             */
            _onTrashTap : function() {
                /**
                 * @typedef {Object} DeleteEventPayload
                 * @property {VueComponent}  this    deleter vue component instance, with $el reference
                 * @property {Number|String} itemKey deleter identifier within its parent's scope
                 */
                var payload = {
                    component : this,
                    itemKey : this.itemKey
                };

                /**
                 * Delete event
                 *
                 * @event module:Tab#ON_DELETE
                 * @type {DeleteEventPayload}
                 */
                this.$emit(EVENT.ON_DELETE, payload);
            }
        },
        components : {
            'wc-icon-button' : IconButton
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Deleter.EVENT = EVENT;

    return Deleter;
});
