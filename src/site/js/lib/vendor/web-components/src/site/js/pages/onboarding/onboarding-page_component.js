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
 * @file Onboarding documentation page
 * @requires vue
 * @requires web-components/mixins/vue-refs_mixin
 * @requires web-components/icons/icon_component
 * @requires web-components/onboardings/onboarding_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/onboardings/readme.md
 * @requires pages/onboarding/onboarding-page_template.html
 * @module pages/onboarding/onboarding-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/mixins/vue-refs_mixin',
    'web-components/icons/icon_component',
    'web-components/onboardings/onboarding_component',
    'web-components/markdown/markdown_component',
    'text!web-components/onboardings/readme.md',
    'text!pages/onboarding/onboarding-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    VueRefsMixin,
    Icon,
    Onboarding,
    Markdown,
    OnboardingReadme,
    Template
) {

    var OnboardingPage = Vue.extend({
        template : Template,
        mixins : [VueRefsMixin],
        data : function() {
            return {
                onboardings : {
                    initialOnboarding : {
                        mustShow : false,
                        selected : null,
                        numberOfSteps : 4,
                        completed : false
                    },
                    singleOnboarding : {
                        mustShow : false,
                        selected : null,
                        numberOfSteps : 1,
                        completed : false
                    },
                    skippableOnboarding : {
                        mustShow : false,
                        selected : null,
                        numberOfSteps : 4,
                        completed : false,
                        skipped : false
                    }
                },
                markdownSource : {
                    documentation : OnboardingReadme
                }
            };
        },
        computed : {
            contentStyle : function() {
                if (this.onboardings.initialOnboarding.selected !== null ||
                    this.onboardings.singleOnboarding.selected !== null ||
                    this.onboardings.skippableOnboarding.selected !== null) {
                    return {
                        position : 'relative',
                        zIndex : '-1'
                    };
                } else {
                    return null;
                }
            }
        },
        methods : {
            startOnboarding : function(onboardingId) {
                this.onboardings[onboardingId].selected = 1;
                this.onboardings[onboardingId].mustShow = true;
            },

            onboardingChanged : function(payload) {
                if (payload.action !== 'completed' && payload.action !== 'skipped') {
                    var offset = (payload.action == 'previous') ? -1 : 1;
                    this.onboardings[payload.id].selected = payload.step + offset;
                } else {
                    this.onboardings[payload.id].selected = null;
                    this.onboardings[payload.id].completed = payload.action === 'completed';
                    this.onboardings[payload.id].skipped = payload.action === 'skipped';
                    window.setTimeout(function() {
                        this.onboardings[payload.id].mustShow = false;
                    }.bind(this), 200);
                }
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-onboarding' : Onboarding,
            'wc-markdown' : Markdown
        }
    });

    return OnboardingPage;
});
