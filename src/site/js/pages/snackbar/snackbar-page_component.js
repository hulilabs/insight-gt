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
 * @file Snackbar documentation page
 * @requires vue
 * @requires web-components/snackbars/snackbar_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/buttons/raised/raised-button_component
 * @requires web-components/snackbars/readme.md
 * @requires pages/snackbar/snackbar-page_template.html
 * @module pages/snackbars/snackbar-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/snackbars/snackbar_component',
    'web-components/markdown/markdown_component',
    'web-components/buttons/flat/flat-button_component',
    'web-components/buttons/raised/raised-button_component',
    'text!web-components/snackbars/readme.md',
    'text!pages/snackbar/snackbar-page_template.html'
], function(
    Vue,
    Snackbar,
    Markdown,
    FlatButton,
    RaisedButton,
    SnackbarReadme,
    Template
) {

    var configs = {
        'single-line' : {
            text : 'Single line snackbar'
        },
        'single-line-action' : {
            duration : 3000,
            text : 'single-line-action',
            action : {
                text : 'Action',
                handler : function() {
                    this.timesClicked = !this.timesClicked ? 1 : this.timesClicked + 1;
                    console.log('Times clicked: ' + this.timesClicked);  // jshint ignore:line
                }
            }
        },
        'single-line-action-close' : {
            duration : 3000,
            text : 'single-line-action-close',
            action : {
                text : 'Action',
                handler : function() {
                    alert('clicked');  // jshint ignore:line
                }
            },
            close : true
        },
        'double-line' : {
            duration : 3000,
            text : 'This is a long text.' +
                    'Snackbars that have long texts will render them in two lines.' +
                    'When using the snackbar validate that the text fits correctly'
        },
        'double-line-action' : {
            duration : 3000,
            text : 'This is a long text with an action.' +
                    'Long texts and actions will render the later at the right' +
                    'When using the snackbar validate that the text fits correctly',
            action : {
                text : 'Action',
                handler : function() {
                    alert('clicked');  // jshint ignore:line
                }
            }
        },
        'double-line-action-close' : {
            duration : 3000,
            text : 'Long text with an action and a close button (only available in desktop version)',
            action : {
                text : 'Action',
                handler : function() {
                    alert('clicked');  // jshint ignore:line
                }
            },
            close : true
        },
        'double-line-action-bottom' : {
            duration : 3000,
            text : 'This is a long text with an action at the bottom.' +
                    'When using the snackbar validate that the text fits correctly',
            action : {
                text : 'Action',
                handler : function() {
                    alert('clicked');  // jshint ignore:line
                }
            },
            showAtBottom : true
        },
        'list-item-layout' : {
            listItem : true,
            text : 'First Line',
            secondaryText : 'Second line',
            avatarPath : '/site/img/doctor-male.svg',
            duration : 3000
        }
    };

    var SnackbarPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : SnackbarReadme
                }
            };
        },
        methods : {
            showSnackbar : function(type) {
                this.$refs.snackbar.show(configs[type]);
            },
            pauseSnackbar : function() {
                this.$refs.snackbar.pause();
            },
            resumeSnackbar : function() {
                this.$refs.snackbar.resume();
            }
        },
        components : {
            'wc-flat-button' : FlatButton,
            'wc-raised-button' : RaisedButton,
            'wc-snackbar' : Snackbar,
            'wc-markdown' : Markdown
        }
    });

    return SnackbarPage;
});
