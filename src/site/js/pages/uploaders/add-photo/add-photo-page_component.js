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
 * @file AddPhoto documentation page
 * @requires vue
 * @requires web-components/uploaders/add-photo/add-photo_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/uploaders/add-photo/readme.md
 * @requires pages/add-photo/add-photo-page_template.html
 * @module pages/add-photo/add-photo-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/uploaders/add-photo/add-photo_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'text!web-components/uploaders/add-photo/readme.md',
    'text!pages/uploaders/add-photo/add-photo-page_template.html'
], function(
    Vue,
    AddPhoto,
    Checkbox,
    TextField,
    Markdown,
    AddPhotoReadme,
    Template
) {

    var AddPhotoPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                imagePath : '/site/img/doctor-male.svg',
                text : 'User',
                deletable : false,
                retry : false,
                uploadable : true,
                error : '',
                progress : 0,
                size : 9,
                markdownSource : {
                    documentation : AddPhotoReadme
                }
            };
        },
        components : {
            'wc-add-photo' : AddPhoto,
            'wc-checkbox' : Checkbox,
            'wc-textfield' : TextField,
            'wc-markdown' : Markdown
        }
    });

    return AddPhotoPage;
});
