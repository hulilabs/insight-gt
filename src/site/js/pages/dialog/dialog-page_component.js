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
 * @file TextField documentation page
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/dialogs/dialog/dialog_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/buttons/raised/raised-button_component
 * @requires text!web-components/dialogs/readme.md
 * @requires text!pages/dialog/dialog-page_template.html
 * @module pages/inputs/textfield/textfield-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/selection-controls/checklist/checklist_component',
    'web-components/dialogs/dialog/dialog_component',
    'web-components/inputs/textarea/textarea_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/buttons/raised/raised-button_component',
    'text!web-components/dialogs/dialog/readme.md',
    'text!pages/dialog/dialog-page_template.html'
], function(
    Vue,
    FlatButton,
    Checkbox,
    Checklist,
    Dialog,
    Textarea,
    TextField,
    Markdown,
    RaisedButton,
    DialogReadme,
    Template
) {

    var DialogPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    showNav : false
                },
                markdownSource : {
                    documentation : DialogReadme
                },
                customStyles : {
                    dialog : {
                        width : '98%',
                        'max-width' : '98%'
                    },
                    title : {
                        color : 'red'
                    },
                    content : {
                        'font-size' : '10px'
                    },
                    actions : {
                        'background-color' : 'green'
                    }
                }
            };
        },
        methods : {
            openDialog : function(dialog) {
                this.$refs[dialog].open();
            },
            closeDialog : function(dialog) {
                this.$refs[dialog].close();
            }
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-checklist' : Checklist,
            'wc-dialog' : Dialog,
            'wc-flat-button' : FlatButton,
            'wc-raised-button' : RaisedButton,
            'wc-textarea' : Textarea,
            'wc-textfield' : TextField,
            'wc-markdown' : Markdown
        }
    });

    return DialogPage;
});
