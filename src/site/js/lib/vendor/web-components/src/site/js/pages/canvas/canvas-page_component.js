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
 * @file Canvas documentation page
 * @module pages/canvas/canvas-page_component
 * @extends Vue
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/canvas/canvas_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component',
    'text!web-components/canvas/readme.md',
    'text!pages/canvas/canvas-page_template.html',
    'css-loader!site/css/components/pages/sections/demo-table.css'
], function(
    Vue,
    FlatButton,
    Canvas,
    TextField,
    Markdown,
    Checkbox,
    Toggle,
    ToggleButton,
    CanvasReadme,
    Template
) {

    var CanvasPage = Vue.extend({
        template : Template,
        data : function() {
            return {
                state : {
                    backgroundColor : '#FFFFFF',
                    baseImage : '/site/img/odontograma-base-image.svg',
                    eraserThickness : 10,
                    height : '500px',
                    isUndoDisabled : true,
                    outlineImage : '/site/img/odontograma-outline-image.svg',
                    smooth : false,
                    snapshots : [],
                    strokeColor : 'black',
                    strokeThickness : 10,
                    tool : Canvas.TOOL.PEN,
                    width : '500px'
                },
                markdownSource : {
                    documentation : CanvasReadme
                }
            };
        },
        computed : {
            isEraserSelected : function() {
                return this.state.tool === Canvas.TOOL.ERASER;
            }
        },
        methods : {
            _canUndo : function(canUndo) {
                this.state.isUndoDisabled = !canUndo;
            },
            _clear : function() {
                this.$refs.canvas.clear();
            },
            _export : function() {
                var image = this.$refs.canvas.exportImage('png');
                this.state.snapshots.push(image);
            },
            _undo : function() {
                this.$refs.canvas.undo();
            },
        },
        components : {
            'wc-canvas' : Canvas,
            'wc-checkbox' : Checkbox,
            'wc-flat-button' : FlatButton,
            'wc-markdown' : Markdown,
            'wc-textfield' : TextField,
            'wc-toggle' : Toggle,
            'wc-toggle-button' : ToggleButton
        }
    });

    return CanvasPage;
});
