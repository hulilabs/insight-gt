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
 * @file Toggle documentation page
 * @requires vue
 * @requires web-components/toggles/toggle_component
 * @requires web-components/toggles/toggle-button_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/toggles/readme.md
 * @requires pages/selection-control/toggle/toggle-page_template.html
 * @module pages/selection-control/toggle/toggle-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component',
    'web-components/icons/icon_component',
    'web-components/markdown/markdown_component',
    'text!web-components/selection-controls/toggle/readme.md',
    'text!pages/selection-controls/toggle/toggle-page_template.html'
], function(
    Vue,
    Toggle,
    ToggleButton,
    Icon,
    Markdown,
    ToggleReadme,
    Template
) {

    var TogglePage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    labelBasic : 'Basic example',
                    noTopSpacingLabel : 'Basic example with no top spacing',
                    labelWithIcon : 'Example with restricted container width and icons',
                    errorText : 'Example error text',
                    selectedBasicValue : 'a',
                    selectedIconValue : 'a',
                    selectedNoTopSpacingValue : 'a'
                },
                itemsWithIcons : [
                    {
                        id : 'a',
                        label : 'This is option A',
                        tooltip : 'Toggle A',
                        isEnabled : true,
                        checked : true
                    },
                    {
                        id : 'b',
                        label : 'This is option B',
                        tooltip : 'Toggle B',
                        isEnabled : true
                    },
                    {
                        id : 'c',
                        label : 'This is option C',
                        tooltip : 'Toggle C',
                        isEnabled : true
                    },
                    {
                        id : 'd',
                        label : 'This is option D',
                        tooltip : 'Toggle D',
                        isEnabled : true
                    },
                    {
                        id : 'e',
                        label : 'This is option E',
                        tooltip : 'Toggle E',
                        isEnabled : true
                    },
                    {
                        id : 'f',
                        label : 'This is option F',
                        tooltip : 'Toggle F',
                        isEnabled : false
                    }
                ],
                markdownSource : {
                    documentation : ToggleReadme
                },
            };
        },
        components : {
            'wc-toggle' : Toggle,
            'wc-toggle-button' : ToggleButton,
            'wc-icon' : Icon,
            'wc-markdown' : Markdown
        }
    });

    return TogglePage;
});
