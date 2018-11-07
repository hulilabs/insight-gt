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
/* global expect, describe, it, context, beforeEach */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/markdown/markdown_component'
],
function(
    Vue,
    VueTestHelper,
    Markdown
) {
    describe('Markdown', function() {

        beforeEach(function() {
            markdownContent = '# Title \n## Subtitle\n``` javascript\nvar a;\n```';
            generatedHtml = '<h1 id="title">Title</h1>\n<h2 id="subtitle">Subtitle</h2>\n<pre><code class="lang-javascript"><span class="hljs-keyword">var</span> a;\n</code></pre>\n';
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                VueTestHelper.checkDefinedProps({
                    source : null
                },new Markdown().$mount());
            });

            it('sets props with custom values', function() {
                var props = {
                    source : '# title'
                };
                VueTestHelper.checkDefinedProps(props, new Markdown({ propsData : props }).$mount());
            });
        });

        context('properly generates html', function() {
            it('using content prop', function() {
                var vm = new Markdown({
                    propsData : {
                        source : markdownContent
                    }
                }).$mount();
                expect(vm.content).to.equal(generatedHtml);
            });

            it('using slot', function() {
                var ParentComponent = Vue.extend({
                    template : '<markdown ref="markdown">' + markdownContent + '</markdown>',
                    data : function() {
                        return {};
                    },
                    components : {
                        markdown : Markdown
                    }
                });
                var vm = new ParentComponent().$mount();
                expect(vm.$refs.markdown.content).to.equal(generatedHtml);
            });
        });
    });
});
