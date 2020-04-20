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
 * @file Expandable ExpandablePanel component
 * @requires vue
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/panels/expandable-panel/expandable-panel_template.html
 * @requires web-components/panels/expandable-panel/expandable-panel_styles.css
 * @module web-components/panels/expandable-panel/expandable-panel_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/expandable-panel} for demos and documentation
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'text!web-components/panels/expandable-panel/expandable-panel_template.html',
    'css-loader!web-components/panels/expandable-panel/expandable-panel_styles.css'
],
function(
    Vue,
    IconButton,
    Template
) {
    /**
     * List of expandable panel component events
     * @type {Object}
     */
    var EVENT = {
        ON_TOGGLE : 'expandable-panel-toggle'
    };

    var ExpandablePanel = Vue.extend({
        name : 'ExpandablePanelComponent',
        template : Template,
        props : {
            /**
             * Define panel title shown at header
             */
            title : {
                type : String,
                default : null
            }
        },
        computed : {
            /**
             * Determines if the body content should be render
             * Avoids content inside panel to be tab-able when closed
             * @return {Boolean}
             */
            renderBody : function() {
                return this.state.isOpened && (this.$slots.beforeContent || this.$slots.content);
            },
            /**
             * Determine toggle icon based on component state
             * @return {String} icon class
             */
            toggleIcon : function() {
                return this.state.isOpened ? 'icon-angle-down' : 'icon-angle-up';
            }
        },
        data : function() {
            return {
                state : {
                    isOpened : true
                }
            };
        },
        methods : {
            /**
             * Toggle between open or close state
             * @fires module: ExpandablePanel#ON_TOGGLE
             */
            _onToggleClick : function() {
                var payload = {
                    wasOpened : this.state.isOpened,
                    isOpened : !this.state.isOpened
                };
                this.state.isOpened = payload.isOpened;
                this.$emit(EVENT.ON_TOGGLE, payload);
            }
        },
        components : {
            'wc-icon-button' : IconButton
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    ExpandablePanel.EVENT = EVENT;

    return ExpandablePanel;
});
