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
    'segmentation',
    'web-components/buttons/flat/flat-button_component',
    'web-components/canvas/canvas_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/markdown/markdown_component',
    'web-components/selection-controls/checkbox/checkbox_component',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component',
    'text!web-components/canvas/readme.md',
    'text!pages/canvas/canvas-page_template.html'
], function (
    Vue,
    Segmentation,
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
            template: Template,
            data: function () {
                return {
                    state: {
                        alpha: 0.4,
                        activeLayer: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        baseImage: '',
                        bucket: false,
                        eraserThickness: 10,
                        height: '720',
                        isUndoDisabled: true,
                        outlineImage: true,
                        smooth: false,
                        snapshots: [],
                        layers: [1],
                        strokeColor: '#DB0404',
                        strokeThickness: 10,
                        rect: false,
                        regionSize: 40,
                        tool: Canvas.TOOL.PEN,
                        width: '1280',
                        zoom: 1
                    },

                    styles: {
                        width: '',
                        height: '',
                        position: 'absolute',
                        left: '0',
                        right: '0',
                        marginLeft: 'auto',
                        marginRight: 'auto'

                    },
                    markdownSource: {
                        documentation: CanvasReadme
                    }
                };
            },

            computed: {
                isEraserSelected: function () {
                    return this.state.tool === Canvas.TOOL.ERASER;
                },

                isRectSelected: function () {
                    return this.state.tool === Canvas.TOOL.RECT;
                },

                isBucketSelected: function () {
                    return this.state.tool == Canvas.TOOL.BUCKET;
                },
                myWidth: function () {
                    return parseInt(this.state.width);
                },
                myHeight: function () {
                    return parseInt(this.state.height);

                },
                myActiveLayer: function () {
                    return this.state.activeLayer - 1
                }
            },
            mounted: function () {
                this._updateStyle();
            },
            methods: {

                _getOutlineImage: function () {
                    segmentator = Segmentation;
                    imageData = this.$refs.canvas1.drawContext.getImageData(0, 0, this.state.width, this.state.height); 
                    options = {};
                    options.method = "slic";
                    options.regionSize = parseInt(this.state.regionSize);
                    this.$refs.canvas2.outlineImageData = segmentator.create(imageData,options).result;
                },
                _addLayer: function () {
                    this.state.layers.push(this.state.layers.length + 1);

                },
                _canUndo: function (canUndo) {
                    this.state.isUndoDisabled = !canUndo;
                },
                _clear: function () {
                    this.$refs.canvas2.clear();
                },
                _export: function () {
                    var image = this.$refs.canvas2.exportLayer();
                    this.state.snapshots.push(image);
                },                
                _exportMasks: function () {
                    var xmlFile = this.$refs.canvas2.exportMasks();
                    var downloader = document.createElement('a');
                    var filename = "masks.xml";
                    var blob = new Blob([xmlFile.documentElement.innerHTML], {type: 'text/plain'});
                    downloader.setAttribute('href', window.URL.createObjectURL(blob));
                    downloader.setAttribute('download', filename );
                    downloader.click();
                    
                },
                _undo: function () {
                    this.$refs.canvas2.undo();
                },
                _updateStyle: function () {
                    this.styles.width = this.state.width + 'px';
                    this.styles.height = this.state.height + 'px';
                },
                _zoomIn: function () {
                    this.state.zoom = this.state.zoom + 1;

                    var zoom = this.state.zoom;
                    if (zoom <= 0) {
                        zoom = 1/Math.abs(zoom-2)
                    }

                    this.styles.width = (this.myWidth * zoom).toString() + 'px';
                    this.styles.height = (this.myHeight * zoom).toString() + 'px';

                },
                _zoomOut: function () {

                    this.state.zoom = this.state.zoom - 1;

                    var zoom = this.state.zoom;
                    if (zoom <= 0) {
                        zoom = 1/Math.abs(zoom-2)
                    }
                    this.styles.width = (this.myWidth * zoom).toString() + 'px';
                    this.styles.height = (this.myHeight * zoom).toString() + 'px';
                },
                _openImage: function (e) {
                    var files = e.target.files || e.dataTransfer.files;
                    if (!files.length)
                        return;

                    file = files[0]
                    reader = new FileReader();
                    obj = this;
                    reader.onload = function (e) {
                        var i = new Image();
                        i.onload = function (e) {
                            obj.state.width = i.width;
                            obj.state.height = i.height;
                            obj.state.zoom = 1;
                            obj._updateStyle();
                            obj.state.baseImage = reader.result;
                            obj.state.layers = [1]
                        }
                        i.src = reader.result;

                    }

                    reader.readAsDataURL(file);

                }, 
                _openMasks: function (e) {
                    var files = e.target.files || e.dataTransfer.files;
                    if (!files.length)
                        return;

                    file = files[0]
                    reader = new FileReader();
                    obj = this;
                    reader.onload = function (e) {
                        obj.$refs.canvas2._loadMasks(reader.result);
                        }
                    reader.readAsText(file);
                    
                }


            },
            components: {
                'wc-canvas': Canvas,
                'wc-checkbox': Checkbox,
                'wc-flat-button': FlatButton,
                'wc-markdown': Markdown,
                'wc-textfield': TextField,
                'wc-toggle': Toggle,
                'wc-toggle-button': ToggleButton
            }
        });

        return CanvasPage;
    });
