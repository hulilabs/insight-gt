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
 * @file AvatarPage documentation page
 * @requires vue
 * @requires web-components/images/avatar/avatar_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/images/avatar/readme.md
 * @requires pages/images/avatar/avatar-page_template.html
 * @module pages/images/avatar/avatar-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/images/avatar/avatar_component',
    'web-components/markdown/markdown_component',
    'text!web-components/images/avatar/readme.md',
    'text!pages/images/avatar/avatar-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Avatar,
    Markdown,
    AvatarReadme,
    Template
) {

    var AvatarPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : AvatarReadme
                },
                avatarSource : {
                    svgPath : '/site/img/doctor-male.svg'
                },
                avatarBehavior : {
                    username : 'Julio Health'
                }
            };
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-markdown' : Markdown
        }
    });

    return AvatarPage;
});
