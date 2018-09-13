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
 * @file Panel documentation page
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/icons/icon_component
 * @requires web-components/images/thumbnail/thumbnail_component
 * @requires web-components/inputs/textfield/textfield_component
 * @requires web-components/lists/list-item_component
 * @requires web-components/loaders/circular/circular-loader_component
 * @requires web-components/markdown/markdown_component
 * @requires web-components/panels/expandable-panel/expandable-panel_component
 * @requires web-components/selection-controls/checkbox/checkbox_component
 * @requires web-components/panels/expandable-panel/readme.md
 * @requires pages/panels/expandable-panel/expandable-panel-page_template.html
 * @requires site/css/components/pages/expandable-panel-page.css
 * @requires web-components/dividers/divider_styles.css
 * @module pages/panels/expandable-panel/expandable-panel-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/icons/icon_component',
    'web-components/images/thumbnail/thumbnail_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/lists/list-item_component',
    'web-components/loaders/circular/circular-loader_component',
    'web-components/markdown/markdown_component',
    'web-components/panels/expandable-panel/expandable-panel_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'text!web-components/panels/expandable-panel/readme.md',
    'text!pages/panels/expandable-panel/expandable-panel-page_template.html',
    'css-loader!site/css/components/pages/expandable-panel-page.css',
    'css-loader!web-components/dividers/divider_styles.css'
], function(
    Vue,
    FlatButton,
    IconButton,
    Icon,
    Thumbnail,
    TextField,
    ListItem,
    CircularLoader,
    Markdown,
    ExpandablePanel,
    Checkbox,
    ExpandablePanelReadme,
    Template
) {

    var ExpandablePanelPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    fixedPanel : false,
                    rowsToDisplay : 5
                },
                markdownSource : {
                    documentation : ExpandablePanelReadme
                }
            };
        },
        components : {
            'wc-checkbox' : Checkbox,
            'wc-circular-loader' : CircularLoader,
            'wc-expandable-panel' : ExpandablePanel,
            'wc-flat-button' : FlatButton,
            'wc-icon' : Icon,
            'wc-icon-button' : IconButton,
            'wc-list-item' : ListItem,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField,
            'wc-thumbnail' : Thumbnail
        }
    });

    return ExpandablePanelPage;
});
