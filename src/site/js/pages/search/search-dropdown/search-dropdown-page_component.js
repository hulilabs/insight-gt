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
 * @requires web-components/search/search-dropdown/search-dropdown_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/search/readme.md
 * @requires pages/search/search-dropdown/search-dropdown-page_template.html
 * @module pages/search/search-dropdown/search-dropdown-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/search/search-dropdown/search-dropdown_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'text!web-components/search/search-dropdown/readme.md',
    'text!pages/search/search-dropdown/search-dropdown-page_template.html'
], function(
    Vue,
    SearchDropdown,
    TextField,
    Markdown,
    SearchReadme,
    Template
) {

    var SearchBoxPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                avatarSource : {
                    svgPath : '/site/img/doctor-male.svg'
                },
                boxPlaceholder : 'Type something',
                boxWidth : 0,
                dropdownPlaceholder : 'Type \'foo\' to match something',
                dropdownRows : 4,
                dropdownWidth : 0,
                notFoundLabel : 'No matches were found.',
                searchDropdownValue : null,
                searchValue : null,
                markdownSource : {
                    documentation : SearchReadme
                },
                resultItems : []
            };
        },
        computed : {
            getBoxWidth : function() {
                return this._getWidth(this.boxWidth);
            },
            getDropdownWidth : function() {
                return this._getWidth(this.dropdownWidth);
            }
        },
        methods : {
            _getWidth : function(value) {
                if (value) {
                    return 'width: ' + value + 'px';
                }
                return 'width: 100%';
            },
            _onSearchBoxHandler : function(value) {
                this.searchValue = value;
            },
            _onSearchDropdownHandler : function(value) {
                setTimeout(function() {
                    if (value && value.search('foo') !== -1) {
                        this.resultItems = [
                            {
                                title : '<strong>Foo</strong> bar 1',
                                subtitle : '<strong>foo</strong>bar1@world.com',
                                text : 'Foo bar 1',
                                value : 1
                            },
                            {
                                title : '<strong>Foo</strong> bar 2',
                                subtitle : '<strong>foo</strong>bar2@world.com',
                                text : 'Foo bar 2',
                                value : 2
                            },
                            {
                                title : '<strong>Foo</strong> bar 3',
                                subtitle : '<strong>foo</strong>bar3@world.com',
                                text : 'Foo bar 3',
                                imgPath : this.avatarSource.svgPath,
                                value : 3
                            },
                            {
                                title : '<strong>Foo</strong> bar 4',
                                subtitle : '<strong>foo</strong>bar4@world.com',
                                text : 'Foo bar 4',
                                value : 4
                            },
                            {
                                title : '<strong>Foo</strong> bar 5',
                                subtitle : '<strong>foo</strong>bar5@world.com',
                                text : 'Foo bar 5',
                                value : 5
                            },
                            {
                                title : '<strong>Foo</strong> bar 6',
                                subtitle : '<strong>foo</strong>bar6@world.com',
                                text : 'Foo bar 6',
                                imgPath : this.avatarSource.svgPath,
                                value : 6
                            },
                            {
                                title : '<strong>Foo</strong> bar 7',
                                subtitle : '<strong>foo</strong>bar7@world.com',
                                text : 'Foo bar 7',
                                value : 7
                            },
                            {
                                title : '<strong>Foo</strong> bar 8',
                                subtitle : '<strong>foo</strong>bar8@world.com',
                                text : 'Foo bar 8',
                                value : 8
                            },
                            {
                                title : '<strong>Foo</strong> bar 9',
                                subtitle : '<strong>foo</strong>bar9@world.com',
                                text : 'Foo bar 9',
                                imgPath : this.avatarSource.svgPath,
                                value : 9
                            },
                            {
                                title : '<strong>Foo</strong> bar 10',
                                subtitle : '<strong>foo</strong>bar10@world.com',
                                text : 'Foo bar 10',
                                value : 10
                            }
                        ];
                    } else {
                        this.resultItems = [];
                    }
                }.bind(this), 300);
            },
            _onSearchDropdownSelect : function(value) {
                this.searchDropdownValue = value;
            }
        },
        components : {
            'wc-search-dropdown' : SearchDropdown,
            'wc-markdown' : Markdown,
            'wc-text-field' : TextField
        }
    });

    return SearchBoxPage;
});
