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
 * @file Error documentation page
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/cards/card/card_component
 * @requires web-components/chips/chip/chip_component
 * @requires web-components/deleters/deleter_component
 * @requires web-components/dialogs/dialog/dialog_component
 * @requires web-components/errors/error_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/snackbars/snackbar_component
 * @requires web-components/uploaders/add-photo/add-photo_component
 * @requires web-components/utils/adaptive/adaptive
 * @requires web-components/errors/readme.md
 * @requires pages/error/error-page_template.html
 * @module pages/error/error-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/cards/card/card_component',
    'web-components/chips/chip/chip_component',
    'web-components/deleters/deleter_component',
    'web-components/dialogs/dialog/dialog_component',
    'web-components/errors/error_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/snackbars/snackbar_component',
    'web-components/uploaders/add-photo/add-photo_component',
    'web-components/utils/adaptive/adaptive',
    'text!web-components/errors/readme.md',
    'text!pages/errors/errors-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    FlatButton,
    Card,
    Chip,
    Deleter,
    Dialog,
    ErrorComponent,
    TextField,
    Markdown,
    Checkbox,
    Snackbar,
    AddPhoto,
    AdaptiveUtil,
    ErrorReadme,
    Template
) {

    var ErrorPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    retry : false,
                    showErrors : true
                },
                markdownSource : {
                    documentation : ErrorReadme
                }
            };
        },
        mounted : function() {
            if (AdaptiveUtil.isDesktop()) {
                this.$refs.cardError.open();
            }
        },
        methods : {
            showErrorDialog : function() {
                this.$refs.errorDialog.open();
            },
            closeErrorDialog : function() {
                this.$refs.errorDialog.close();
            },
            showNoInternetError : function() {
                this.$refs.errorSnackbar.show({
                    close : true,
                    duration : 1000,
                    text : 'No internet connection'
                });
            },
            onCardClose : function(e) {
                if (AdaptiveUtil.isDesktop()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        },
        components : {
            'wc-add-photo' : AddPhoto,
            'wc-card' : Card,
            'wc-checkbox' : Checkbox,
            'wc-chip' : Chip,
            'wc-deleter' : Deleter,
            'wc-dialog' : Dialog,
            'wc-error' : ErrorComponent,
            'wc-flat-button' : FlatButton,
            'wc-snackbar' : Snackbar,
            'wc-textfield' : TextField,
            'wc-markdown' : Markdown
        }
    });

    return ErrorPage;
});
