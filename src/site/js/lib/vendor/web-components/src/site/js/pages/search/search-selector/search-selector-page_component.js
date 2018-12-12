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
 * @file SearchBox documentation page
 * @requires vue
 * @requires web-components/search/search-selector/search-selector_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/search/readme.md
 * @requires pages/search/search-selector/search-selector-page_template.html
 * @module pages/search/search-selector/search-selector-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/search/search-selector/search-selector_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/search/search-selector/readme.md',
    'text!pages/search/search-selector/search-selector-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    SearchSelector,
    TextField,
    CheckBox,
    Markdown,
    SearchReadme,
    Template
) {

    var SearchBoxPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                dataSource : [
                    {
                        text : 'Foo bar 1',
                        value : 1,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 2',
                        value : 2,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 3',
                        value : 3,
                        icon : null,
                        disabled : false,
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 1',
                        value : 4,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 2',
                        value : 5,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 3',
                        value : 6,
                        icon : null,
                        disabled : false,
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 1',
                        value : 7,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 2',
                        value : 8,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 3',
                        value : 9,
                        icon : null,
                        disabled : false,
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 1',
                        value : 10,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 2',
                        value : 11,
                        icon : 'icon-lock',
                        disabled : true,
                        iconTooltip : 'Icon tooltip example',
                        avatar : '/site/img/doctor-male.svg'
                    },
                    {
                        text : 'Foo bar 3',
                        value : 12,
                        icon : null,
                        disabled : false,
                        avatar : '/site/img/doctor-male.svg'
                    },
                ],
                placeholder : 'placeholder string',
                notFoundLabel : 'No matches were found.',
                searchSelectorValue : null,
                markdownSource : {
                    documentation : SearchReadme
                },
                selfContainedMode : false,
                resultItems : []
            };
        },
        methods : {
            valueChanged : function(value) {
                this.searchSelectorValue = value;
            }
        },
        components : {
            'wc-search-selector' : SearchSelector,
            'wc-checkbox' : CheckBox,
            'wc-markdown' : Markdown,
            'wc-text-field' : TextField
        }
    });

    return SearchBoxPage;
});
