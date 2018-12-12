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
 * @file Autocomplete documentation page
 * @requires vue
 * @requires web-components/autocompletes/autocomplete_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/utils/random
 * @requires web-components/utils/scroll/scroll
 * @requires web-components/utils/string
 * @requires web-components/autocompletes/readme.md
 * @requires pages/autocomplete/autocomplete-page_template.html
 * @module pages/autocomplete/autocomplete-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/autocompletes/autocomplete_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'web-components/utils/random',
    'web-components/utils/scroll/scroll',
    'web-components/utils/string',
    'text!web-components/autocompletes/readme.md',
    'text!pages/autocomplete/autocomplete-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Autocomplete,
    TextField,
    Checkbox,
    Markdown,
    // Utils
    RandomUtil,
    ScrollUtil,
    StringUtil,
    AutocompleteReadme,
    Template
) {

    var AutocompletePage = Vue.extend({
        template : Template,
        data : function() {
            return {
                eventFired : '',
                allowAddingItems : false,
                bufferLimitForRequest : 2,
                disabled : false,
                floatingLabel : false,
                hasError : false,
                hintText : false,
                label : false,
                maxLength : null,
                minLength : null,
                mobile : false,
                placeholder : false,
                required : false,
                search : false,
                selectedOption : {},
                fullWidth : true,
                showSecondaryStyle : false,
                value : null,
                multiline : false,
                markdownSource : {
                    documentation : AutocompleteReadme
                },
                dataSource : [
                    {
                        text : 'Costa Rica',
                        hint : 'America',
                        value : 1
                    },
                    {
                        text : 'Costa Rica officially the Republic of Costa Rica is a country in Central America, bordered by Nicaragua to the north, Panama to the southeast, the Pacific Ocean',
                        value : 1
                    },
                    {
                        text : 'Mexico',
                        disabled : true,
                        hint : 'America',
                        value : 2
                    },
                    {
                        text : 'Panamá',
                        hint : 'America',
                        value : 3
                    },
                    {
                        text : 'Iran',
                        hint : 'Asia',
                        value : 'F234D4FB-D5E2-847F-B283-407B2BB13DAB'
                    },
                    {
                        text : 'Bahrain',
                        hint : 'Asia',
                        value : '1DBEDD56-D60D-4443-E7E2-C74C91080AF5'
                    },
                    {
                        text : 'Bermuda',
                        value : 'AC8EC27F-2377-3B24-1CC3-8812E8CAB588'
                    },
                    {
                        text : 'Laos',
                        value : '397D31ED-A9E7-446D-DFA4-67C05386B379'
                    },
                    {
                        text : 'Kuwait',
                        value : '65DF8631-398A-F99C-DB67-FE71C5B3B57A'
                    },
                    {
                        text : 'Norway',
                        hint : 'Europe',
                        value : 'BF2DD89F-7B5B-FEDE-3C86-61E592EA844D'
                    },
                    {
                        text : 'Honduras',
                        hint : 'America',
                        value : '2EF45022-BB98-E951-F24F-7FAB5FDA2A20'
                    },
                    {
                        text : 'Taiwan',
                        value : 'A726A448-3CFB-1396-8ED4-10BF3E7B7635'
                    },
                    {
                        text : 'Philippines',
                        value : '86C944FB-BEC3-D806-152F-E1DD8B2E6EDD'
                    },
                    {
                        text : 'Brunei',
                        value : '3E0F87F4-3B82-190C-E161-53E1205D44E2'
                    },
                    {
                        text : 'Switzerland',
                        hint : 'Europe',
                        value : 'D9BC0831-6D79-1226-3495-E139C84592A9'
                    },
                    {
                        text : 'Iceland',
                        value : '7C608F01-9437-CE2D-1498-275F8F4F6B2B'
                    },
                    {
                        text : 'Guadeloupe',
                        value : '5E149982-D895-4F80-2CB2-967B3A5B198A'
                    },
                    {
                        text : 'Israel',
                        value : 'B5D35981-0423-0B89-A34C-791D86A95D91'
                    },
                    {
                        text : 'New Zealand',
                        hint : 'Oceania',
                        value : '96E0A60A-5308-9C5B-FF1D-E5A44D99BECA'
                    },
                    {
                        text : 'Virgin Islands, British',
                        value : '9A45047C-EFD3-A0F9-EDA3-FA5D4EE5B065'
                    },
                    {
                        text : 'Brazil',
                        value : '308E0A60-4753-2B61-31B9-0960F5BB7988'
                    },
                    {
                        text : 'Germany',
                        value : 'D179C0CD-3814-12DB-132D-D59DF381851A'
                    },
                    {
                        text : 'Paraguay',
                        value : 'CB0ADCEC-7C7E-2BBD-7DDD-4194E074AE0A'
                    },
                    {
                        text : 'American Samoa',
                        value : '47B6128A-F536-9496-1C66-8920C1099F3D'
                    },
                    {
                        text : 'Madagascar',
                        value : '2D50B745-54D4-C270-3D23-5034E30B917C'
                    },
                    {
                        text : 'Macedonia',
                        value : 'B6044B7F-11C0-8EDA-A391-A810324B8387'
                    },
                    {
                        text : 'Lithuania',
                        value : 'EEAB9175-EA22-765D-7F32-A0A5509FE0D2'
                    },
                    {
                        text : 'Venezuela',
                        value : '7E9BD248-913B-9D15-B0D0-768391F8F3BE'
                    },
                    {
                        text : 'San Marino',
                        value : 'B85422D5-2094-1002-3B71-ADEBF8E4FF69'
                    },
                    {
                        text : 'Niger',
                        value : 'DFA7D260-0320-F940-696B-259D549F92DA'
                    },
                    {
                        text : 'Croatia',
                        value : '83A8A3A3-0B5E-2724-2512-63CD9EBDB2D3'
                    },
                    {
                        text : 'Jersey',
                        value : 'F74D1B5C-41C1-380A-CE0B-45B3D4A13AF9'
                    },
                    {
                        text : 'Slovenia',
                        value : '4D4D74B2-1389-0FA7-E403-F20EB58CE30C'
                    },
                    {
                        text : 'Belgium',
                        value : '23A7EE99-BBCF-DF60-52C5-A518255140DE'
                    },
                    {
                        text : 'Antigua and Barbuda',
                        value : '956A285E-A23E-FDF7-11CD-B5DC654367F9'
                    },
                    {
                        text : 'Burundi',
                        value : '70BAAF53-529C-5C54-83DB-586DD3E89809'
                    },
                    {
                        text : 'Niue',
                        value : 'D8B8722F-688C-0BEA-FEBA-1BA6AC44D97B'
                    },
                    {
                        text : 'Spain',
                        value : '287F7952-96BA-4FE2-EDE4-63E41D15AE39'
                    },
                    {
                        text : 'Mauritius',
                        value : 'AC3FB70E-8863-70C2-673D-46ADE6B5023C'
                    },
                    {
                        text : 'Canada',
                        value : 'F6DF9998-EC35-898B-AB6E-3CB299179C29'
                    },
                    {
                        text : 'Tajikistan',
                        value : '055DBFD8-62A4-D3F9-0D6D-5C396C9B7A9E'
                    },
                    {
                        text : 'Andorra',
                        value : 'AE55D3F8-21C9-2988-83DA-F53D38B05427'
                    },
                    {
                        text : 'Maldives',
                        value : '9715F4A1-00FC-141B-FAB8-A362EA82EB33'
                    },
                    {
                        text : 'Faroe Islands',
                        value : 'CCD70A3D-C9CC-8B04-0FF5-9CF28CAB2CA0'
                    },
                    {
                        text : 'China',
                        value : 'D9F8ACB4-C5F5-B6E5-D548-741658009DDD'
                    },
                    {
                        text : 'Zimbabwe',
                        value : 'EF7FEEF3-A09E-C021-555F-8752ABA62BCE'
                    },
                    {
                        text : 'Monaco',
                        value : '7014A195-E530-C1A9-DD3E-DFEDAC38CAF0'
                    },
                    {
                        text : 'Sri Lanka',
                        value : '5A623B1B-1734-6816-E963-59231B5ED964'
                    },
                    {
                        text : 'Nepal',
                        value : 'EA459B83-F21E-71F4-C5D8-152AEE17036A'
                    },
                    {
                        text : 'Turks and Caicos Islands',
                        value : '1F74E5A2-A33B-52B4-FCA2-C5A19D0C4FE1'
                    },
                    {
                        text : 'Latvia',
                        value : 'E60FC039-2A7D-578D-6EFD-3943DFA15FBB'
                    },
                    {
                        text : 'Malta',
                        value : '54F4B1C7-9C9E-DDD1-D6D1-93CC7613127C'
                    },
                    {
                        text : 'Micronesia',
                        value : 'F2EC874E-EAE9-80ED-3943-C24F0DE2DBBF'
                    },
                    {
                        text : 'Haiti',
                        value : '86C17AB0-900F-3426-4250-2597A0F54AF2'
                    },
                    {
                        text : 'Bangladesh',
                        value : '196D5A81-6EEF-52B9-89E9-789CCE484248'
                    },
                    {
                        text : 'Virgin Islands, United States',
                        value : '74CD34AC-E2DE-846A-94F6-C50B2924720C'
                    },
                    {
                        text : 'Poland',
                        value : 'ED28BB58-9E44-A5AB-F08E-559CF1020687'
                    },
                    {
                        text : 'Guinea-Bissau',
                        value : 'A90FE091-76CA-F328-D4EA-3C05577F29FB'
                    },
                    {
                        text : 'United States',
                        value : '53CC5BB0-8E97-1659-E46E-7CEDC1678128'
                    },
                    {
                        text : 'Togo',
                        value : '8C1CA1E2-E1C8-A997-ED15-40EF344E1F95'
                    },
                    {
                        text : 'Chad',
                        value : '4F1A552B-5AA4-6EB0-FAD4-127255E023A5'
                    },
                    {
                        text : 'Heard Island and Mcdonald Islands',
                        value : '3E500DEB-B898-9746-E91C-7BE96B77AD09'
                    },
                    {
                        text : 'Iraq',
                        value : 'EA7AF0C8-5686-2741-8A6F-3505383A9DEF'
                    },
                    {
                        text : 'Bolivia',
                        value : '1BBB2C39-D771-BC15-8C94-BF13917CBC6F'
                    },
                    {
                        text : 'Equatorial Guinea',
                        value : '9664F39B-212E-17A6-201E-D71F6FE2E2BE'
                    },
                    {
                        text : 'Argentina',
                        value : 'F18119D7-F342-2D67-56CD-2C185A7B9ADE'
                    },
                    {
                        text : 'Tanzania',
                        value : 'E382BC33-0BE4-F7B3-2042-4D3DAED5DB4B'
                    },
                    {
                        text : 'Fiji',
                        value : 'FD38D54B-8593-1AC1-E99B-C9C784D973DA'
                    },
                    {
                        text : 'Syria',
                        value : 'EDBA8A10-7051-FA89-0495-2669B1D3688A'
                    },
                    {
                        text : 'Angola',
                        value : '16612929-5EF6-F84D-19CA-6393C9762ACA'
                    },
                    {
                        text : 'Antarctica',
                        value : '3E5BCDEB-7573-27C8-51C2-1474FD494601'
                    },
                    {
                        text : 'Luxembourg',
                        value : '901C3D58-244B-D07C-B744-2F66F702026E'
                    },
                    {
                        text : 'Dominican Republic',
                        value : '922FE1A9-BCC2-9651-BA59-0D590C40220A'
                    },
                    {
                        text : 'Kenya',
                        value : '1215F194-4308-3800-F7BA-26765E8B0BD9'
                    },
                    {
                        text : 'Papua New Guinea',
                        value : '1D3F3888-D179-9AAC-1F3A-65AB949BE20F'
                    },
                    {
                        text : 'Hungary',
                        value : '735EB419-3E3A-8477-42C1-6A0A1CDCB361'
                    },
                    {
                        text : 'Tuvalu',
                        value : '294855A3-4476-9832-DE28-3CE00D11405C'
                    },
                    {
                        text : 'United States Minor Outlying Islands',
                        value : '7BE3A545-E457-88C1-84E1-83D8228F4442'
                    },
                    {
                        text : 'Morocco',
                        value : 'F029D2F3-61E8-37BC-25C8-609CBECA9D6D'
                    },
                    {
                        text : 'Guyana',
                        value : '8D3F4B72-940C-3A8F-E220-4953EC525E02'
                    },
                    {
                        text : 'Gambia',
                        value : 'D330391A-DCD0-94E5-7A37-F678FFAA6BE7'
                    },
                    {
                        text : 'Pakistan',
                        value : 'A796FDFC-CFE6-1BC4-F98E-1E17C7CC7CBA'
                    },
                    {
                        text : 'Saint Kitts and Nevis',
                        value : '54D56388-F6D0-B7E6-BB24-2FE00FF32CB6'
                    },
                    {
                        text : 'Guatemala',
                        value : '23C85E61-0A7B-5245-7650-C832F0844A38'
                    },
                    {
                        text : 'Rwanda',
                        value : '19F8889E-8BE7-1A04-42E4-F7F5F8A4302F'
                    },
                    {
                        text : 'Martinique',
                        value : 'D1B3FBD0-668C-9742-CFF6-3FF1997C533D'
                    },
                    {
                        text : 'Afghanistan',
                        value : '45138EC0-3B58-6FAE-0B86-96AF0DAFC803'
                    }
                ]
            };
        },
        mounted : function() {
            this.originalDataSource = this.dataSource;

            this.$refs.sandboxInput.focus();
        },
        computed : {
            description : function() {
                var c = [], d = [];

                if (this.disabled) {
                    d.push('disabled');
                }

                if (this.required) {
                    d.push('required');
                }

                if (this.mobile) {
                    d.push('mobile');
                }
                d.push('autocomplete');

                if (this.placeholder) {
                    c.push('placeholder');
                }

                if (this.floatingLabel) {
                    c.push('floating label');
                }

                if (this.label && !this.floatingLabel) {
                    c.push('label');
                }

                if (this.hasError) {
                    c.push('error message');
                }

                if (this.fullWidth) {
                    c.push('menu width equal to the input width');
                }

                if (this.allowAddingItems) {
                    c.push('allowing insert new items');
                }

                if (this.search) {
                    c.push('simulating server requests');
                }

                if (c.length > 0) {
                    var last = c.pop();
                    d.push('with');

                    if (c.length > 1) {
                        d.push(c.join(', '));
                    } else if (c.length === 1) {
                        d.push(c[0]);
                    }

                    if (c.length >= 1) {
                        d.push('and');
                    }

                    d.push(last);
                }

                return d.join(' ');
            }
        },
        methods : {
            /**
             * Handler for the search event triggered by the autocomplete component
             * @param  {String} value
             */
            _onSearch : function(value) {
                this.eventFired = 'autocomplete-search';
                this.simulateRequest(value).then(function(filtered) {
                    this.dataSource = filtered;
                }.bind(this));
            },
            /**
             * Simulates the search for the autocomplete when it has the search flag enabled
             * @param  {String} value
             * @return {Array}
             */
            simulateRequest : function(value) {
                var options = this.filterOptions(value);
                var p = new Promise(function(resolve) {
                    setTimeout(function() {
                        return resolve(options);
                    }, 2000);
                });

                return p;
            },
            filterOptions : function(value) {
                var re = new RegExp(this.processTextForFilter(value), 'gi'),
                    options = this.originalDataSource.filter(function(option) {
                        if (StringUtil.replaceAccentCharacters(option.text).match(re)) {
                            this._processOptionText(option, value);
                            return option;
                        }
                    }, this);

                return options;
            },
            /**
             * Handler for the add event triggered by the autocomplete component
             * @param  {String} newText
             * @return {String}
             */
            _onAdd : function(newText) {
                this.eventFired = 'autocomplete-add';
                var value = RandomUtil.getPseudoId();

                this.dataSource.push({
                    text : newText,
                    value : value
                });

                this.$refs.sandboxInput.setValue(value);
            },
            /**
             * Handler for the input event of the focusExample autocomplete
             */
            _onInputFocusExample : function() {
                setTimeout(function() {
                    this.$refs.focusExampleTextField.focus(false);
                }.bind(this), 0);
            },
            /**
             * Handler for the clear event triggered by the autocomplete
             */
            _onClear : function() {
                this.eventFired = 'autocomplete-clear';
                this.selectedOption = {};
            },
            /**
             * Handler for the enter event triggered by the autocomplete
             */
            _onEnter : function(text) {
                this.eventFired = 'autocomplete-enter';
                if (this.allowAddingItems) {
                    this._onAdd(text);
                    this.$refs.sandboxInput.closeMenu();
                }
            },
            /**
             * Handler for the input event triggered by the autocomplete component
             * @param  {Object} payload
             */
            _onInput : function(payload) {
                this.eventFired = 'autocomplete-input';
                this.selectedOption = payload.option;
            },
            /**
             * Handler for the overflows_viewport event triggered by the autocomplete component
             * @param  {String} element
             */
            _onOverflowsViewport : function(element) {
                this.eventFired = 'autocomplete-overflows-viewport';
                var offset = Math.round(window.innerHeight / 10);
                ScrollUtil.scrollTo(element, true, offset);
            },

            /**
             * Handles the load more event
             */
            _onLoadMore : function() {
                this.eventFired = 'autocomplete-load-more';
            },
            /**
             * This function is used to simulate the way that the server process the text of an option
             * @see web-components/autocompletes/autocomplete_component@_processOptionText
             */
            _processOptionText : function(option, buffer) {
                var text = option.text.toLowerCase(),
                    buffer = buffer.toLowerCase().trim(),
                    optionTextPosition = 0,
                    matchIndex = null,
                    result = '';

                while (text.length) {
                    matchIndex = text.indexOf(buffer);
                    if (matchIndex === -1) {
                        result += option.text.substring(optionTextPosition);
                        break;
                    }
                    result += [
                        option.text.substring(optionTextPosition, matchIndex + optionTextPosition),
                        '<strong>',
                        option.text.substring(matchIndex + optionTextPosition, matchIndex + optionTextPosition + buffer.length),
                        '</strong>'
                    ].join('');

                    text = text.substring(matchIndex + buffer.length);
                    optionTextPosition += matchIndex + buffer.length;
                }

                option.match = result;
            },
            /**
             * This function process the text (escape the special characters and replace accent characters)
             * @see web-components/autocompletes/autocomplete_component@processTextForFilter
             */
            processTextForFilter : function(text) {
                text = StringUtil.escapeSpecialCharacters(text);
                text = StringUtil.replaceAccentCharacters(text);

                return text;
            }
        },
        components : {
            'wc-autocomplete' : Autocomplete,
            'wc-checkbox' : Checkbox,
            'wc-markdown' : Markdown,
            'wc-text-field' : TextField
        }
    });

    return AutocompletePage;
});
