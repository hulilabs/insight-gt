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
 * @file Fab documentation page
 * @module pages/buttons/fab/fab-page_component
 */
define([
    'vue',
    'web-components/buttons/fab/fab_component',
    'web-components/dropdowns/dropdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/tooltips/tooltip_component',
    'web-components/markdown/markdown_component',
    'text!web-components/buttons/fab/readme.md',
    'text!pages/buttons/fab/fab-page_template.html'
], function(
    Vue,
    Fab,
    Dropdown,
    Checkbox,
    Tooltip,
    Markdown,
    FabReadme,
    Template
) {

    var FabPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                actionsDefinition : [
                    {
                        name : 'baby-clicked',
                        icon : 'icon-age-baby',
                        tooltip : 'Give love to the baby'
                    },
                    {
                        name : 'kid-clicked',
                        icon : 'icon-age-kid',
                        tooltip : 'Give dreams to the kid'
                    },
                    {
                        name : 'adult-clicked',
                        icon : 'icon-age-adult',
                        tooltip : 'Give hope to the adult'
                    },
                    {
                        name : 'elder-clicked',
                        icon : 'icon-age-elder',
                        tooltip : 'Give respect to the elder'
                    }
                ],

                exampleAction : [
                    {
                        name : 'example-action-name',
                        icon : 'icon-edit',
                        tooltip : 'This is just an example FAB with nothing special',
                        tooltipAlignment : Tooltip.ALIGNMENT.LEFT
                    }
                ],

                isMobile : false,

                mini : false,

                position : Fab.POSITION.BOTTOM_RIGHT,

                singleAction : false,

                markdownSource : {
                    documentation : FabReadme
                }
            };
        },

        computed : {
            actions : function() {
                return this.singleAction ? [this.actionsDefinition[0]] : this.actionsDefinition;
            },

            positionOptions : function() {
                return Object.keys(Fab.POSITION).map(function(key) {
                    return {
                        text : Fab.POSITION[key],
                        value : Fab.POSITION[key]
                    };
                });
            }
        },

        methods : {
            _babyClicked : function() {
                alert('Love was given to the baby');  // jshint ignore:line
            },
            _kidClicked : function() {
                alert('Dreams were given to the kid');  // jshint ignore:line
            },
            _adultClicked : function() {
                alert('Hope was given to the adult');  // jshint ignore:line
            },
            _elderClicked : function() {
                alert('Respect was given to the elder');  // jshint ignore:line
            }
        },
        components : {
            'wc-dropdown' : Dropdown,
            'wc-checkbox' : Checkbox,
            'wc-fab' : Fab,
            'wc-markdown' : Markdown
        }
    });

    return FabPage;
});
