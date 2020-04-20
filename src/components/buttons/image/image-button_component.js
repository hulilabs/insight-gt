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
 * @file image button component
 * @module web-components/buttons/image/image-button_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/icons/icon_component',
    'web-components/selection-controls/mixins/selection-control_mixin',
    'text!web-components/buttons/image/image-button_template.html',
    'css-loader!web-components/buttons/image/image-button_styles.css'
],
function(
    Vue,
    AvatarComponent,
    IconComponent,
    selectionControlMixin,
    Template
) {

    var ImageButton = Vue.extend({
        name : 'ImageButtonComponent',
        template : Template,
        mixins : [selectionControlMixin],
        props : {
            /**
             * Flag to define the component in a single selection group
             * Use this when you need this image button to behave as
             * a group of radio buttons
             * You should turn on this flag and send the same value as
             * the v-model statement for all the elements of the group
             */
            allowSingleSelection : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Whether the component starts with checked state or not
             */
            checked : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Image path
             */
            path : {
                type : String,
                required : true
            },
            /**
             * Subtitle text
             */
            subtitle : {
                type : String,
                default : null,
                required : false
            },
            /**
             * Title text
             */
            title : {
                type : String,
                default : null,
                required : false
            }
        },
        data : function() {
            return {
                state : {
                    isChecked : this.checked,
                    isDisabled : this.disabled,
                    isFocused : false
                }
            };
        },
        computed : {
            /**
             * Determines if the image button is currently checked
             * according to the given value.
             * @return {Boolean} if the image button is currently checked
             */
            isActive : function() {
                return this.allowSingleSelection ?
                    (this.value === true || (this.customValue && this.value === this.customValue)) :
                    this.state.isChecked;
            }
        },
        methods : {
            /**
             * Returns the input reference
             * @see web-components/selection-controls/mixins/selection-control_mixin
             */
            getInput : function() {
                return this.$refs.input;
            },

            /**
             * Handler for the input event
             * @fires module:ImageButton#ON_INPUT
             * @private
             */
            _onChange : function() {
                var payload;

                this.state.isChecked = payload = this.isChecked();

                if (this.customValue || this.customValue === 0) {
                    payload = this.state.isChecked ? this.customValue : null;
                }

                this.$emit(this.events.ON_INPUT, payload);
            },

            /**
             * Handler for the focus event of the checkbox reference
             * @private
             */
            _onFocus : function() {
                this.state.isFocused = true;
            },

            /**
             * Handler for the blur event of the checkbox reference
             * @private
             */
            _onBlur : function() {
                this.state.isFocused = false;
            }
        },
        components : {
            'wc-avatar' : AvatarComponent,
            'wc-icon' : IconComponent
        }
    });

    return ImageButton;
});
