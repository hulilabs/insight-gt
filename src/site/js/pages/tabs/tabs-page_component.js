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
 * @file Tabs documentation page
 * @requires vue
 * @requires web-components/tabs/tab_component
 * @requires web-components/tabs/tabs_component
 * @requires web-components/icons/icon_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/tabs/readme.md
 * @requires pages/tabs/tabs-page_template.html
 * @module pages/tabs/tabs-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/tabs/tab_component',
    'web-components/tabs/tabs_component',
    'web-components/icons/icon_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/tabs/readme.md',
    'text!pages/tabs/tabs-page_template.html',
    'css-loader!site/css/components/pages/tabs-page.css'
], function(
    Vue,
    Tab,
    Tabs,
    Icon,
    Checkbox,
    Markdown,
    TabsReadme,
    Template
) {

    var TabsPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    currentSelected : 0,
                    currentCustomSelected : 'foo',
                    currentDynamicSelected : 'orange',
                    generateMoreTabs : false
                },
                markdownSource : {
                    documentation : TabsReadme
                },
                customTabs : [
                    { index : 'apple', label : 'apple' },
                    { index : 'orange', label : 'orange'},
                    { index : 'pear', label : 'pear'},
                    { index : 'grapes', label : 'grapes'},
                    { index : 'cheese', label : 'cheese'},
                    { index : 'pineapple', label : 'pineapple'},
                    { index : 'mango', label : 'mango'}
                ]
            };
        },
        methods : {
            _changeCurrentSelected : function(payload) {
                this.state.currentSelected = payload.selected;
            },

            _changeCurrentCustomSelected : function(payload) {
                this.state.currentCustomSelected = payload.selected;
            },

            _changeCurrentDynamicSelected : function(payload) {
                this.state.currentDynamicSelected = payload.selected;
            }
        },
        components : {
            'wc-tab' : Tab,
            'wc-tabs' : Tabs,
            'wc-icon' : Icon,
            'wc-markdown' : Markdown,
            'wc-checkbox' : Checkbox
        }
    });

    return TabsPage;
});
