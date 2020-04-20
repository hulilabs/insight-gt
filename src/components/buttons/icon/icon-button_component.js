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
 * @file icon button component, follows material design spec
 * @requires vue
 * @requires web-components/icons/icon_component
 * @requires web-components/images/avatar/avatar_component
 * @requires web-components/behaviors/a11y/button-focus/button-focus_behavior
 * @requires web-components/buttons/icon/icon-button_template.html
 * @requires web-components/buttons/icon/icon-button_styles.css
 * @module web-components/buttons/icon/icon-button_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/images/avatar/avatar_component',
    'web-components/behaviors/a11y/button-focus/button-focus_behavior',
    'text!web-components/buttons/icon/icon-button_template.html',
    'css-loader!web-components/buttons/icon/icon-button_styles.css'
],
function(
    Vue,
    Icon,
    Avatar,
    ButtonFocusBehavior,
    Template
) {

    var IconButton = Vue.extend({
        name : 'IconButtonComponent',
        template : Template,
        props : {
            // applies styles and behavior for disabled state
            disabled : {
                type : Boolean,
                default : false
            },
            // properties to setup a button that uses an icon
            iconClass : {
                type : [Array, String, Object]
            },
            // icon's inner text
            iconContent : {
                type : String
            },
            // properties to display a button that uses an image
            imageIconAlt : {
                type : String
            },
            // properties to display a button that uses an image
            imageIconPath : {
                type : String
            },
            // properties to display a button that uses an avatar
            avatarPath : {
                type : String
            },
            // properties to display a button that uses an avatar
            avatarText : {
                type : String
            },
            avatarClass : {
                type : String
            },
            // image to show when avatar is disabled
            disabledAvatarPath : {
                type : String
            },
            // allows adding a modifier to the inner icon component
            iconModifier : {
                type : [String, Object]
            },
            // light color
            light : {
                type : Boolean,
                default : false
            },
            // wc-icon's `notification` prop
            notification : {
                type : Boolean,
                default : false
            },
            // combines the raised button styles
            raised : {
                type : Boolean,
                default : false
            },
            // toggles smart focus behavior
            // @see web-components/behaviors/a11y/button-focus/button-focus_behavior
            smartFocus : {
                type : Boolean,
                default : false
            },
            hover : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            /**
             * Obtains the image path to display
             * If disabled, shows `disabledImageIconPath` or `imageIconPath` if none available
             * @return {String}
             */
            imagePath : function() {
                if (this.disabled && this.disabledAvatarPath) {
                    return this.disabledAvatarPath;
                }

                return this.avatarPath;
            }
        },
        mounted : function() {
            this._addSmartFocus();
        },
        methods : {
            /**
             * Attaches `ButtonFocusBehavior` if `smartFocus` prop is set
             * @see web-components/behaviors/a11y/button-focus/button-focus_behavior
             */
            _addSmartFocus : function() {
                if (this.smartFocus) {
                    ButtonFocusBehavior.bind(this.$el);
                }
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-avatar' : Avatar
        }
    });

    return IconButton;
});
