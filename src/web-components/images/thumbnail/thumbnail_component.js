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
 * @file Thumbnail component
 * @requires vue
 * @requires web-components/images/thumbnail/thumbnail_template.html
 * @requires web-components/images/thumbnail/thumbnail_styles.css
 * @module web-components/images/thumbnail/thumbnail_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/thumbnail} for demos and documentation
 */
define([
    'vue',
    'text!web-components/images/thumbnail/thumbnail_template.html',
    'css-loader!web-components/images/thumbnail/thumbnail_styles.css'
],
function(
    Vue,
    Template
) {
    var Thumbnail = Vue.extend({
        name : 'ThumbnailComponent',
        template : Template,
        props : {
            /**
             * Image path to display as thumbnail
             */
            imagePath : {
                type : String,
                required : true
            },
            /**
             * Change the thumbnail dimensions following the grid size
             */
            size : {
                type : [String, Number],
                default : 3,
                required : false,
                validator : function(value) {
                    // 3=24px ... 12=96px
                    return value >= 3 && value <= 12;
                }
            }
        },
        computed : {
            /**
             * Insert image through CSS and define mask
             * @return {Object} dynamic css rules
             */
            stylesObject : function() {
                return {
                    'background-image' : 'url("' + this.imagePath + '")'
                };
            }
        }
    });

    return Thumbnail;
});
