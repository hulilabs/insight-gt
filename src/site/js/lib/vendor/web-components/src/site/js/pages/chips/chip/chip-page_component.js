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
 * @file Chip documentation page
 * @requires vue
 * @requires web-components/chips/chip/chip_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/chips/chip/readme.md
 * @requires pages/chip/chip-page_template.html
 * @module pages/chips/chip-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/chips/chip/chip_component',
    'web-components/markdown/markdown_component',
    'text!web-components/chips/chip/readme.md',
    'text!pages/chips/chip/chip-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Chip,
    Markdown,
    ChipReadme,
    Template
) {

    var ChipPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : ChipReadme
                },
                avatarText : 'Julio Health',
                avatarSource : {
                    imagePath : '/site/img/patient-female-1.svg'
                },
                closeButtonVisible : true,
                text : 'Julio Health Text'
            };
        },
        methods : {
            closeChip : function(index) {
                this.$refs['chipContainer' + index].removeChild(this.$refs['chip' + index].$el);
            }
        },
        components : {
            'wc-chip' : Chip,
            'wc-markdown' : Markdown
        }
    });

    return ChipPage;
});
