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
 * @file Selection control mixin - abstracts common selection control behavior and props
 * @requires web-components/utils/random
 * @module web-components/selection-controls/mixins/selection-control_mixin
 *
 *
 * IMPORTANT! HOW TO USE:
 * + If you need to add conditional logic to know what's the current component context,
 *   that doesn't belong here
 * + If you need to override a method in a component, you MUST remove it from this mixin and implement
 *   it in all the components. i.e. method overriding IS NOT allowed
 * + A method added here MUST be used in ALL the components that implement the mixin. Otherwise, the method
 *   doesn't belong here
 * + Adding a method here MUST be the last option, as a mixin might hurt usability if misused
 */
define([
    'web-components/utils/random'
],
function(
    RandomUtil
) {
    var selectionControlMixin = {
        props : {
            /**
             * Corresponds to the checked state of selection control components.
             * Required for use with by v-model.
             */
            value : {
                type : [Array, Boolean, Number, Object, String],
                required : false,
                default : null
            },
            /**
             * Alternative value to the Boolean returned by native checkboxes and radio buttons
             *
             */
            customValue : {
                type : [String, Number, Object],
                required : false,
                default : null
            },
            /**
             * Determines the component's disabled state.
             * Bound to the component's <input> tag disabled attribute
             */
            disabled : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Selection control component's <input> name attribute
             */
            name : {
                type : String,
                required : false,
                default : null
            }
        },
        computed : {
            /**
             * Obtains a pseudo id to be able to fake the radio-button
             * by sharing a random id between the label and the radio-button
             * @return {String}
             */
            pseudoId : function() {
                return RandomUtil.getPseudoId();
            },
            /**
             * Returns the alignment class, usually used to change from
             * vertical to horizontal configuration.
             * @return {String[]}
             */
            alignClass : function() {
                return this.cssClass;
            }
        },
        data : function() {
            return {
                state : {
                    value : this.value
                },
                events : {
                    ON_INPUT : 'input'
                },
                cssClass : null
            };
        },
        methods : {
            /**
             * Is the selection control component currently checked?
             * @return {Boolean}
             * @public
             */
            isChecked : function() {
                return this.$refs.input.checked;
            },
            /**
             * Sets a CSS class used to change the orientation.
             * @param {String[]} alignClass
             * @private
             */
            setAlignClass : function(alignClass) {
                this.cssClass = alignClass;
            },
            /**
             * Changes the `checked` attribute of inner the component's <input> element
             * @private
             */
            _toggle : function() {
                this.$refs.input.checked = !this.isChecked();
                this._onChange();
            }
        },
        watch : {
            value : function(newValue) {
                this.state.value = newValue;
            }
        }
    };

    return selectionControlMixin;
});
