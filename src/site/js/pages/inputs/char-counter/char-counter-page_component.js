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
 * @file CharCounter documentation page
 * @requires vue
 * @requires web-components/inputs/char-counter/char-counter_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires text!web-components/inputs/char-counter/readme.md
 * @requires text!pages/inputs/char-counter/char-counter-page_template.html
 * @module pages/inputs/char-counter/char-counter-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/inputs/char-counter/char-counter_component',
    'web-components/markdown/markdown_component',
    'web-components/inputs/textfield/textfield_component',
    'text!web-components/inputs/char-counter/readme.md',
    'text!pages/inputs/char-counter/char-counter-page_template.html'
], function(
    Vue,
    CharCounter,
    Markdown,
    TextField,
    CharCounterReadme,
    Template
) {

    var InputcontainerPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                value : '',
                maxLength : 15,
                hasError : false,
                markdownSource : {
                    documentation : CharCounterReadme
                }
            };
        },
        methods : {
            _onChange : function(payload) {
                this.hasError = payload.state !== 'compliant';
            }
        },
        components : {
            'wc-char-counter' : CharCounter,
            'wc-markdown' : Markdown,
            'wc-text-field' : TextField
        }
    });

    return InputcontainerPage;
});
