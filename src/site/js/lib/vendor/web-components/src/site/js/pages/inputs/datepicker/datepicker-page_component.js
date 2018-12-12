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
 * @file Datepicker documentation page
 * @requires vue
 * @requires web-components/inputs/datepicker/datepicker_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/datepicker/readme.md
 * @requires pages/datepicker/datepicker-page_template.html
 * @module pages/datepicker/datepicker-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/datepicker/datepicker_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/datepicker/readme.md',
    'text!pages/inputs/datepicker/datepicker-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    Datepicker,
    Textfield,
    Checkbox,
    Markdown,
    DatepickerReadme,
    Template
) {

    var DatepickerPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                value : null,
                full : true,
                native : false,
                max : null,
                min : null,
                hasError : false,
                errorMessage : null,
                hintText : null,
                disabled : false,
                required : false,
                placeholder : 'mm/dd/yyyy',
                format : '##/##/####',

                months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // jshint ignore:line

                days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

                markdownSource : {
                    documentation : DatepickerReadme
                }
            };
        },
        methods : {
            _onInvalidDate : function(value) {
                this.hasError = true;
                this.errorMessage = 'Invalid date value: ' + value;
            },
            _onDateChanged : function() {
                this.hasError = false;
            }
        },
        components : {
            'wc-datepicker' : Datepicker,
            'wc-textfield' : Textfield,
            'wc-checkbox' : Checkbox,
            'wc-markdown' : Markdown
        }
    });

    return DatepickerPage;
});
