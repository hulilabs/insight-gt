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
 * @file Avatar component
 * @requires vue
 * @requires web-components/images/avatar/avatar_template.html
 * @requires web-components/images/avatar/avatar_styles.css
 * @module web-components/images/avatar/avatar_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/avatar} for demos and documentation
 */
define([
    'vue',
    'text!web-components/images/avatar/avatar_template.html',
    'css-loader!web-components/images/avatar/avatar_styles.css'
],
function(
    Vue,
    Template
) {
    var Avatar = Vue.extend({
        name : 'AvatarComponent',
        template : Template,
        props : {
            text : {
                type : String,
                required : false
            },
            imagePath : {
                type : String,
                required : false
            }
        },
        computed : {
            // It extracts the first character in the text property to render it
            textInitial : function() {
                if (!this.imagePath && this.text) {
                    return this.text.charAt(0);
                }
            }
        }
    });

    return Avatar;
});
