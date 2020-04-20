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
 * @file icon component, follows material design spec
 * @requires vue
 * @requires web-components/icons/icon_template.html
 * @requires web-components/icons/icon_styles.css
 * @module web-components/components/icon/icon_component
 * @extends Vue
 */
define([
    'vue',
    'text!web-components/icons/icon_template.html',
    'css-loader!web-components/icons/icon_styles.css'
],
function(
    Vue,
    Template
) {

    var Icon = Vue.extend({
        name : 'IconComponent',
        template : Template,
        props : {
            // class to add to the icon, useful for font icons or modifiers
            iconClass : {
                type : [String, Array, Object]
            },
            // can be used for cases like the material icons, which require
            // a certain innerText to be rendered
            iconContent : {
                type : String
            },
            // renders the icon using an image
            imageIconPath : {
                type : String
            },
            // `alt` property for image icons, use together with `imageIconPath`
            imageIconAlt : {
                type : String
            },
            // shows the notification block if set to true
            notification : {
                type : Boolean
            }
        }
    });

    return Icon;
});
