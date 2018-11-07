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
 * @file Chip component
 * @requires vue
 * @requires web-components/images/avatar/avatar_component
 * @requires web-components/icons/icon_component
 * @requires web-components/utils/adaptive/adaptive
 * @requires web-components/chips/chip/chip_template.html
 * @requires web-components/chips/chip/chip_styles.css
 * @module web-components/components/chips/chip/chip_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/chip} for demos and documentation
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/icons/icon_component',
    'web-components/utils/adaptive/adaptive',
    'text!web-components/chips/chip/chip_template.html',
    'css-loader!web-components/chips/chip/chip_styles.css'
],
function(
    Vue,
    Avatar,
    Icon,
    AdaptiveUtil,
    Template
) {

    /**
     * List of chip component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLOSE : 'chip-close'
    };

    var Chip = Vue.extend({
        name : 'ChipComponent',
        template : Template,
        props : {
            // renders an alphanumeric avatar
            avatarText : {
                type : String
            },
            // shows the close button if set to true
            closeButtonVisible : {
                type : Boolean,
                default : false
            },
            // makes the chip red colored
            hasError : {
                type : Boolean,
                required : false,
                default : false
            },
            // renders an image avatar
            imagePath : {
                type : String,
                required : false
            },
            // detect mobile for handling focus state
            mobile : {
                type : Boolean,
                default : AdaptiveUtil.isMobile(),
                required : false
            },
            // text content for the chip component
            text : {
                type : String,
                required : true
            },
            // value of the chip
            value : {
                type : [String, Number],
                default : null
            }
        },
        computed : {
            /**
             * Computes the classes that will be added to the chip according to the state
             * @return {Object} modifier classes of chip block
             */
            classObject : function() {
                return {
                    'wc-Chip--avatar' : this.imagePath || this.avatarText,
                    'wc-Chip--closeButtonVisible' : this.closeButtonVisible,
                    'wc-Chip--desktop' : !this.mobile,
                    'has-error' : this.hasError
                };
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * it is false by default, when a chip component is generated
                     */
                    isClosed : false,
                    value : this.value
                }
            };
        },
        methods : {
            /**
             * Closes the chip
             * @public
             */
            close : function() {
                this._setClosedState(true);
            },
            /**
             * sets the close state to true
             * @param {Boolean} triggerState - activates the triggerCloseState if it is set to true
             */
            _setClosedState : function(triggerState) {
                this.state.isClosed = true;

                if (triggerState !== false) {
                    this._triggerCloseState();
                }
            },
            /**
             * Trigger the closed state for the parent component
             * @fires module:Chip#ON_CLOSE
             * @private
             */
            _triggerCloseState : function() {
                /**
                 * @typeDef {Object} module:Chip#OnClosePayload
                 * @property {Boolean} isClosed - Sets the isClosed state to true
                 * @property {String, Number} value - Chip value
                 */
                var payload = {
                    isClosed : this.state.isClosed,
                    value : this.state.value
                };
                /**
                 * isClosed event
                 *
                 * @event module:Chip#ON_CLOSE
                 * @type {OnClosePayload}
                 */
                this.$emit(EVENT.ON_CLOSE, payload);
            }
        },
        watch : {
            // update the value of the chip
            value : function(newValue) {
                this.state.value = newValue;
            }
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-icon' : Icon
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Chip.EVENT = EVENT;

    return Chip;
});
