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
 * @file Stepper documentation page
 * @requires vue
 * @requires web-components/steppers/stepper_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/steppers/readme.md
 * @requires pages/stepper/stepper-page_template.html
 * @module pages/steppers/stepper-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/steppers/stepper_component',
    'web-components/markdown/markdown_component',
    'text!web-components/steppers/readme.md',
    'text!pages/stepper/stepper-page_template.html'
], function(
    Vue,
    Stepper,
    Markdown,
    StepperReadme,
    Template
) {

    var StepperPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    activeStep : 'orange',
                    hasInvalidSteps : false,
                    steps : [
                        {
                            id : 'apple',
                            tooltip : 'Apple',
                            isEnabled : true
                        },
                        {
                            id : 'orange',
                            tooltip : 'Orange',
                            isEnabled : true
                        },
                        {
                            id : 'pear',
                            tooltip : 'Pear',
                            isEnabled : true
                        },
                        {
                            id : 'grapes',
                            tooltip : 'Grapes',
                            isEnabled : true
                        },
                        {
                            id : 'cheese',
                            tooltip : 'Cheese',
                            isEnabled : true
                        }
                    ]
                },
                markdownSource : {
                    documentation : StepperReadme
                },
                ids : [],
                newStep : {
                    id : '',
                    tooltip : '',
                    isEnabled : true
                }
            };
        },
        mounted : function() {
            this.ids = this.state.steps.map(function(ele) {
                return ele.id;
            });
        },
        methods : {
            _addNewStep : function() {
                this.state.steps.push(this.newStep);

                this.state.hasInvalidSteps = this.ids.indexOf(this.newStep.id) !== -1;

                this.ids.push(this.newStep.id);

                this.newStep = {
                    id : '',
                    tooltip : '',
                    isEnabled : true
                };

            },

            _changeActiveStep : function(payload) {
                if (payload && payload.active) {
                    this.state.activeStep = payload.active;
                }
            }
        },
        components : {
            'wc-stepper' : Stepper,
            'wc-markdown' : Markdown
        }
    });

    return StepperPage;
});
