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
 * @file AddPhoto component
 * @see {@link https://web-components.hulilabs.xyz/components/add-photo} for demos and documentation
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/behaviors/a11y/button-focus/button-focus_behavior',
    'web-components/icons/icon_component',
    'web-components/utils/component-loader_helper',
    'text!web-components/uploaders/add-photo/add-photo_template.html',
    'css-loader!web-components/uploaders/add-photo/add-photo_styles.css'
],
function(
    Vue,
    Avatar,
    ButtonFocusBehavior,
    Icon,
    ComponentLoaderHelper,
    Template
) {
    /**
     * List of AddPhoto component events
     * @type {Object}
     */
    var EVENT = {
        ON_DELETE : 'add-photo-delete',
        ON_UPLOAD : 'add-photo-upload',
        ON_RETRY : 'add-photo-retry'
    };

    var AddPhoto = Vue.extend({
        name : 'AddPhotoComponent',
        template : Template,
        props : {
            /**
             * Determines if the photo is deletable, for displaying the remove option
             */
            deletable : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             * Shows the error to be shown on upload failed.
             */
            error : {
                type : String,
                required : false,
                default : null
            },

            /**
             * Image to be displayed in the avatar component
             */
            imagePath : {
                type : String,
                required : false,
                default : null
            },

            /**
             * Represents the progress of the upload
             */
            progress : {
                type : Number,
                required : false,
                default : 0
            },

            /**
             * On error, display a retry icon
             */
            retry : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             * Change the avatar dimensions following the grid size
             */
            size : {
                type : [String, Number],
                default : 9,
                required : false,
                validator : function(value) {
                    // 6=48px ... 12=96px
                    return value >= 6 && value <= 12;
                }
            },

            /**
             * Text from which the avatar will generate a placeholder
             * Used in case a placeholder or an already uploaded image isn't given
             */
            text : {
                type : String,
                required : false,
                default : null
            },

            /**
             * Determines if a photo can be uploaded
             */
            uploadable : {
                type : Boolean,
                required : false,
                default : true
            },

            /**
             * Avatar square prop
             */
            square : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             *  Avatar expand prop
             *  Indicates if the avatar image should expand to full width and height
             */
            expand : {
                type : Boolean,
                required : false,
                default : false
            },

            /**
             *  Loader indeterminate prop
             *  Indicates if the loader is in indeterminate mode.
             */
            indeterminate : {
                type : Boolean,
                required : false,
                default : false
            }
        },
        mounted : function() {
            ButtonFocusBehavior.bind(this.$el);
        },
        methods : {
            /**
             * Triggers the event for when it's desired to add a photo
             * @fires module:AddPhoto#ON_RETRY
             * @fires module:AddPhoto#ON_UPLOAD
             */
            _upload : function() {
                if ((this.uploadable || this.retry) && !this.progress) {
                    if (this.error && this.retry) {
                        this.$emit(EVENT.ON_RETRY);
                    } else {
                        this.$emit(EVENT.ON_UPLOAD);
                    }
                }
            },
            /**
             * Triggers the event for notifying the deletion of the current photo
             * @fires module:AddPhoto#ON_DELETE
             */
            _delete : function() {
                this.$emit(EVENT.ON_DELETE);
            }
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-icon' : Icon,
            'wc-circular-loader' : ComponentLoaderHelper.load('web-components/loaders/circular/circular-loader_component'),
            'wc-linear-loader' : ComponentLoaderHelper.load('web-components/loaders/linear/linear-loader_component')
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    AddPhoto.EVENT = EVENT;

    return AddPhoto;
});
