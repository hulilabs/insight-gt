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
 * @file InputContainerBehaviorMixin defines common properties for containers of inputs that may
 *       have the floating label behavior, addons and the focused border bottom animation.
 * @requires web-components/utils/random
 * @module web-components/mixins/input/input-container_behavior
 */
define([], function() {

    var InputContainerBehaviorMixin = {
        props : {
            /**
             * Defines the label for the input element.
             * If given along with a placeholder, overwrites the placeholder behavior.
             */
            label : {
                type : String,
                default : null
            },
            /**
             * Defines if the label should have a floating-label behavior.
             * The label will start at the input's position as a placeholder and once
             * content is set, the label will float above the input element.
             * By default, inputs won't have the floating label behavior.
             * It has more precedence than the placeholder.
             * If given along with placeholder, the floating label behavior will prevail.
             */
            floatingLabel : {
                type : Boolean,
                default : false
            },
            /**
             * Input element's placeholder text.
             * It has less precedence than floatingLabel prop.
             * If given along with floatingLabel, it's ignored.
             */
            placeholder : {
                type : String,
                default : null
            },
            /**
             * Defines if the input is in its error state.
             * By default, inputs won't have errors.
             */
            hasError : {
                type : Boolean,
                default : false
            },
            /**
             * Sets the error message that will be displayed whenever the input is in its
             * error state. The error message will displace to the bottom the elements from below.
             */
            errorMessage : {
                type : String,
                default : null
            },
            /**
             * Hint message displayed below the input as an additional description of the input.
             */
            hintText : {
                type : String,
                default : null
            },
            /**
             * If the input should have a counter of its value's length.
             */
            charCounter : {
                type : Boolean,
                default : false
            },
            /**
             * Modifier for increasing the font size of the floating label
             */
            modifier : {
                type : String,
                default : null
            },

            /**
             * Whether the input highlighter should be shown or not.
             */
            hideInputHighlighter : {
                type : Boolean,
                default : false
            },

            /**
             * Whether the input should show the secondary style.
             * It was implemented to support the layout of https://zpl.io/Z29g75o
             */
            showSecondaryStyle : {
                type : Boolean,
                default : false
            },

            /**
             * Determines if the action button is disabled for interactions but still visible
             */
            actionDisabled : {
                type : Boolean,
                default : false
            },
            /**
             * String with the hexadecimal or rgba notation of a custom text color
             */
            color : {
                type : String,
                default : null
            }
        }
    };

    return InputContainerBehaviorMixin;
});
