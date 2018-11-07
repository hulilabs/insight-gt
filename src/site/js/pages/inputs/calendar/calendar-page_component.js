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
 * @file Calendar documentation page
 * @requires vue
 * @requires web-components/inputs/calendar/calendar_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/calendar/readme.md
 * @requires pages/calendar/calendar-page_template.html
 * @module pages/calendar/calendar-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/calendar/calendar_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'text!web-components/inputs/calendar/readme.md',
    'text!pages/inputs/calendar/calendar-page_template.html'
], function(
    Vue,
    Calendar,
    Textfield,
    Markdown,
    CalendarReadme,
    Template
) {

    var CalendarPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                value : null,
                min : null,
                max : null,

                months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // jshint ignore:line

                days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

                markdownSource : {
                    documentation : CalendarReadme
                }
            };
        },
        components : {
            'wc-calendar' : Calendar,
            'wc-textfield' : Textfield,
            'wc-markdown' : Markdown
        }
    });

    return CalendarPage;
});
