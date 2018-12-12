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
 * @file Switch documentation page
 * @requires vue
 * @requires web-components/selection-controls/switch/switch_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/switch/readme.md
 * @requires pages/switch/switch-page_template.html
 * @module pages/switch/switch-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/lists/list-item_component',
    'web-components/selection-controls/switch/switch_component',
    'web-components/markdown/markdown_component',
    'text!web-components/selection-controls/switch/readme.md',
    'text!pages/selection-controls/switch/switch-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css',
], function(
    Vue,
    ListItem,
    Switch,
    Markdown,
    SwitchReadme,
    Template
) {

    var SwitchPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                switchValue : [0,1],
                switchValue2 : false,
                switchValue3 : true,
                switchList : [0],
                listValue : [3],
                switchList2 : true,
                switchList3 : false,
                state : {
                },
                markdownSource : {
                    documentation : SwitchReadme,
                }
            };
        },
        components : {
            'wc-list-item' : ListItem,
            'wc-switch' : Switch,
            'wc-markdown' : Markdown
        }
    });

    return SwitchPage;
});
