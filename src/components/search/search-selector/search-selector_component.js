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
 * @file Search selector component
 * @module web-components/search/search-selector/search-selector_component
 * @see {@link https://web-components.hulilabs.xyz/components/search} for demos and documentation
 */
define([
    'vue',
    'web-components/autocompletes/autocomplete_component',
    'web-components/search/search-list/search-list_component',
    'text!web-components/search/search-selector/search-selector_template.html',
    'css-loader!web-components/search/search-selector/search-selector_styles.css'
],
function(
    Vue,
    AutocompleteComponent,
    SearchListComponent,
    Template
) {

    var EVENT = {
        VALUE_CHANGED : 'search-selector-value-changed'
    };

    var SearchDropdown = Vue.extend({
        template : Template,
        props : {
            /**
             * Determines whether this search selector will be displayed
             * in the selfcontained version.
             * @see Zeplin Docs https://zpl.io/Z29g75o
             */
            isSelfContained : {
                type : Boolean,
                default : false
            },

            /**
             * Flag set to know if the component will have a mobile behavior
             */
            isMobile : {
                type : Boolean,
                default : false
            },

            /**
             * Flag set to know if the component will have a mobile behavior
             */
            notFoundLabel : {
                type : String,
                required : true,
                default : 'not found'
            },

            /**
             * Placeholder displayed in the search input
             * @type {String}
             */
            placeholder : {
                type : String,
                default : null
            },

            /**
             * The objects in this array should have this format, e.g.:
             * {
             *      text : String
             *      value : Number
             *      icon : String - icon name
             *      disabled : Boolean
             *      avatar : String - img path
             * }
             */
            dataSource : {
                type : Array,
                required : true,
                default : function() {
                    return [];
                }
            },

            /**
             * Sets the selected value for the current search selector
             */
            value : {
                type : [String, Number],
                default : null
            }
        },

        data : function() {
            return {
                state : {
                    focused : false,
                    value : this.value
                }
            };
        },

        computed : {
            classObject : function() {
                return {
                    'is-focused' : this.state.focused,
                    'is-self-contained' : this.isSelfContained
                };
            }
        },

        methods : {
            _onFocus : function() {
                this.state.focused = true;
                this.$refs.autocomplete.openMenu();
                this.$refs.autocomplete.clear();
            },

            _onMenuClosed : function() {
                this.state.focused = false;
                this.$refs.autocomplete.setValue(this.state.value);
                this.$refs.autocomplete.checkSelectedOption();
            },

            _onValueChanged : function(payload) {
                this.state.value = payload.option.value;
                this.$emit(EVENT.VALUE_CHANGED, payload.option.value);
            }
        },

        components : {
            'wc-search-list' : SearchListComponent,
            'wc-autocomplete' : AutocompleteComponent
        }
    });

    return SearchDropdown;
});
