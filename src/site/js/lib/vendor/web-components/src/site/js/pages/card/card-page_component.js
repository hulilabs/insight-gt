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
 * @file Card documentation page
 * @requires vue
 * @requires web-components/autocompletes/autocomplete_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/cards/card/card_component
 * @requires web-components/cards/card-collection/card-collection_component
 * @requires web-components/dropdowns/dropdown_component
 * @requires web-components/errors/error_component
 * @requires web-components/icons/icon_component
 * @requires web-components/selection-controls/radio-button/radio-button_component
 * @requires web-components/selection-controls/radio-group/radio-group_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/deleters/deleter_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/utils/adaptive/adaptive
 * @requires web-components/cards/readme.md
 * @requires web-components/cards/card-collection/readme.md
 * @requires pages/card/card-page_template.html
 * @requires pages/card/card-page_styles.css
 * @module pages/card/card-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/autocompletes/autocomplete_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/buttons/flat/flat-button_component',
    'web-components/cards/card/card_component',
    'web-components/cards/card-collection/card-collection_component',
    'web-components/dropdowns/dropdown_component',
    'web-components/errors/error_component',
    'web-components/bars/app-bar/app-bar_component',
    'web-components/icons/icon_component',
    'web-components/selection-controls/radio-button/radio-button_component',
    'web-components/selection-controls/radio-group/radio-group_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/deleters/deleter_component',
    'web-components/markdown/markdown_component',
    'web-components/utils/adaptive/adaptive',
    'text!web-components/cards/card/readme.md',
    'text!web-components/cards/card-collection/readme.md',
    'text!pages/card/card-page_template.html',
    'css-loader!pages/card/card-page_styles.css'
], function(
    Vue,
    Autocomplete,
    IconButton,
    FlatButton,
    Card,
    CardCollection,
    Dropdown,
    ErrorComponent,
    AppBar,
    Icon,
    RadioButton,
    RadioGroup,
    TextField,
    Deleter,
    Markdown,
    AdaptiveUtil,
    CardReadme,
    CardCollectionReadme,
    Template
) {

    var CardPage = Vue.extend({
        template : Template,
        props : {
            suspiciousPrivateNotes : {
                type : String
            }
        },
        computed : {
            positiveCardValue : function() {
                return 'Card value: ' + ((this.state.positiveCardState) ? this.state.positiveCardState : 'empty');
            }
        },
        data : function() {
            return {
                isMobile : AdaptiveUtil.isMobile(),
                state : {
                    positiveCardState : null,
                    cardWithActionState : null,
                    boundCardState : null,
                    // used for In Case of Emergency contact suspiciously realistic demo
                    // to render a form subsection every time it is clicked
                    ices : [
                        {}
                    ]
                },
                markdownSource : {
                    documentation : CardReadme,
                    cardCollectionDocumentation : CardCollectionReadme
                },
                selectedCity : null,
                cities : [
                    {
                        text : 'Alajuela',
                        value : '2'
                    },
                    {
                        text : 'Cartago',
                        value : '3'
                    },
                    {
                        text : 'Guanacaste',
                        value : '6'
                    },
                    {
                        text : 'Heredia',
                        value : '4'
                    },
                    {
                        text : 'Limón',
                        value : '7'
                    },
                    {
                        text : 'Puntarenas',
                        value : '5'
                    },
                    {
                        text : 'San José',
                        value : '1'
                    }
                ]
            };
        },

        methods : {
            _alert : function() {
                console.log(arguments); //jshint ignore:line
            },

            _addICE : function() {
                this.state.ices.push({});
            },

            /**
             * Handles deleter click on 'in case of emergency' card demo
             * @param  {Object} deleterPayload - see deleter component
             */
            _removeICE : function(deleterPayload) {
                this.state.ices.splice(deleterPayload.itemKey, 1);
            }
        },

        components : {
            'wc-autocomplete' : Autocomplete,
            'wc-card' : Card,
            'wc-card-collection' : CardCollection,
            'wc-dropdown' : Dropdown,
            'wc-error' : ErrorComponent,
            'wc-markdown' : Markdown,
            'wc-radio-group' : RadioGroup,
            'wc-radio-button' : RadioButton,
            'wc-icon' : Icon,
            'wc-icon-button' : IconButton,
            'wc-flat-button' : FlatButton,
            'wc-textfield' : TextField,
            'wc-app-bar' : AppBar,
            'wc-deleter' : Deleter
        }
    });

    return CardPage;
});
