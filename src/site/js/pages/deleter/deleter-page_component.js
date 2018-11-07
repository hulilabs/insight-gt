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
 * @file Deleter documentation page
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/deleters/deleter_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/deleters/readme.md
 * @requires pages/deleter/deleter-page_template.html
 * @module pages/deleter/deleter-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/deleters/deleter_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/markdown/markdown_component',
    'text!web-components/deleters/readme.md',
    'text!pages/deleter/deleter-page_template.html'
], function(
    Vue,
    FlatButton,
    Deleter,
    TextField,
    Checkbox,
    Markdown,
    DeleterReadme,
    Template
) {

    var DeleterPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                // Sandbox demo
                disableDelete : false,
                multipleInputs : false,
                adjustPadding : true,
                adjustContent : false,
                // Deletable list demo
                counter : 1,
                items : [],
                // Readme
                markdownSource : {
                    documentation : DeleterReadme
                }
            };
        },
        methods : {
            _addItem : function() {
                this.items.push({
                    key : this.counter,
                    value : 'List item #' + this.counter
                });
                this.counter++;
            },
            _removeItem : function(payload) {
                this.items.splice(payload.itemKey, 1);
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-deleter' : Deleter,
            'wc-flat-button' : FlatButton,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField
        }
    });

    return DeleterPage;
});
