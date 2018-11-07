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
 * @file pull up dialog component test
 * @requires vue
 * @requires web-components/dialogs/pull-up/pull-up-dialog_component
 * @requires text!pages/pull-up-dialog/pull-up-dialog-page_template.html
 * @requires text!web-components/dialogs/pull-up/readme.md
 * @requires web-components/markdown/markdown_component
 * @requires web-components/images/avatar/avatar_component
 * @requires web-components/buttons/raised/raised-button_component
 * @requires web-components/buttons/icon/icon-button_component
 */
define([
    'vue',
    'web-components/dialogs/pull-up/pull-up-dialog_component',
    'text!pages/pull-up-dialog/pull-up-dialog-page_template.html',
    'text!web-components/dialogs/pull-up/readme.md',
    'web-components/markdown/markdown_component',
    'web-components/images/avatar/avatar_component',
    'web-components/buttons/raised/raised-button_component',
    'web-components/buttons/icon/icon-button_component'
], function(
    Vue,
    PullUpDialog,
    Template,
    Readme,
    Markdown,
    Avatar,
    RaisedButton,
    IconButton
) {

    var PullUpDialogPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    active : false
                },
                styles : {
                    root : {
                        position : 'relative',
                        width : '100%',
                        height : '100vh',
                        overflow : 'auto',
                        top : 'initial'
                    }
                },
                markdownSource : {
                    documentation : Readme
                }
            };
        },
        methods : {
            openDialog : function() {
                this.state.active = true;
                this.styles.root.position = 'absolute';
                this.styles.root.top = 0;
                this.styles.root.overflow = 'hidden';
                document.body.classList.add('is-pullUpDialogActive');
            },
            onPullUpClosed : function() {
                this.state.active = false;
                this.styles.root.position = 'relative';
                this.styles.root.top = 'initial';
                this.styles.root.overflow = 'auto';
                document.body.classList.remove('is-pullUpDialogActive');
            },
            closePullUp : function() {
                this.$refs.pullUpDialog.close();
            }
        },
        components : {
            'wc-pull-up-dialog' : PullUpDialog,
            'wc-avatar' : Avatar,
            'wc-raised-button' : RaisedButton,
            'wc-icon-button' : IconButton,
            'wc-markdown' : Markdown
        }
    });

    return PullUpDialogPage;
});
