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
define([
    'vue',
    'web-components/markdown/markdown_component',
    'web-components/directives/gestures/gestures_directive',
    'text!web-components/directives/gestures/readme.md',
    'text!pages/gestures/gestures-page_template.html',
    'css-loader!site/css/components/pages/gestures-page.css'
], function(
    Vue,
    Markdown,
    GesturesDirective,
    GesturesReadme,
    Template
) {

    var GesturesPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                markdownSource : {
                    documentation : GesturesReadme
                }
            };
        },
        methods : {
            _onTap : function() {
                alert('tap'); // jshint ignore:line
            },
            _onLongTap : function() {
                alert('Long tap'); // jshint ignore:line
            },
            _onSwipe : function() {
                alert('Swipe'); // jshint ignore:line
            },
            _onSwipeLeft : function() {
                alert('Swipe left'); // jshint ignore:line
            },
            _onSwipeRight : function() {
                alert('Swipe right'); // jshint ignore:line
            },
            _onSwipeDown : function() {
                alert('Swipe down'); // jshint ignore:line
            },
            _onSwipeUp : function() {
                alert('Swipe up'); // jshint ignore:line
            }

        },
        components : {
            'wc-Markdown' : Markdown
        }
    });

    return GesturesPage;
});
