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
 * @file TimePicker documentation page
 * @requires vue
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/inputs/time-picker/time-picker_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/time-picker/readme.md
 * @requires pages/time-picker/time-picker-page_template.html
 * @module pages/time-picker/time-picker-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/textfield/textfield_component',
    'web-components/inputs/time-picker/time-picker_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/time-picker/readme.md',
    'text!pages/inputs/time-picker/time-picker-page_template.html'
], function(
    Vue,
    Textfield,
    TimePicker,
    Checkbox,
    Markdown,
    TimePickerReadme,
    Template
) {

    var TimePickerPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                value : null,
                native : false,
                step : 1,
                hasError : false,
                hintText : null,
                disabled : false,
                required : false,
                markdownSource : {
                    documentation : TimePickerReadme
                }
            };
        },
        components : {
            'wc-time-picker' : TimePicker,
            'wc-textfield' : Textfield,
            'wc-checkbox' : Checkbox,
            'wc-markdown' : Markdown
        }
    });

    return TimePickerPage;
});
