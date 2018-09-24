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
    var DEFAULT = {
        ALPHA : 0.4,
        ACTIVE_LAYER : 1,
        BACKGROUND_COLOR : 'rgba(0, 0, 0, 0.5)',
        HEIGHT : 720,
        WIDTH : 1280,
        SUPERPIXEL_SIZE : 40,
        SUPERPIXELS_METHOD : 'slic',
        STROKE_COLOR : '#DB0404',
        FILENAME : "masks.xml"
    };

    return Vue.extend({
        template: Template,
        data: function () {
            return {
                state: {
                    alpha: DEFAULT.ALPHA,
                    activeLayer: DEFAULT.ACTIVE_LAYER,
                    backgroundColor: DEFAULT.BACKGROUND_COLOR,
                    baseImage: '',
                    eraserThickness: 10,
                    height: DEFAULT.HEIGHT,
                    isUndoEnabled: false,
                    outlineImage: true,
                    smooth: false,
                    snapshots: [],
                    layers: [1],
                    strokeColor: DEFAULT.STROKE_COLOR,
                    strokeThickness: 10,
                    regionSize: DEFAULT.SUPERPIXEL_SIZE,
                    tool: Canvas.TOOL.PEN,
                    width: DEFAULT.WIDTH,
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
            myWidthPx: function () {
                return this.state.width + 'px';
            },
            myHeightPx: function () {
                return this.state.height + 'px';
            },
            myWidth: function () {
                return parseInt(this.state.width);
            },
            myHeight: function () {
                return parseInt(this.state.height);
            },
            myActiveLayer: function () {
                return this.state.activeLayer - 1;
            },
            myRegionSize: function () {
                return parseInt(this.state.regionSize);
            },
            zoomFactor: function () {
                return this.state.zoom <= 0 ? 1 / Math.abs(this.state.zoom - 2) : this.state.zoom;
            },
        },
        mounted: function () {
            this._updateStyle();
        },
        methods: {
            _getOutlineImage: function () {
                var imageData = this.$refs.canvas1.drawContext.getImageData(0, 0, this.state.width, this.state.height),
                    options = {};
                options.method = DEFAULT.SUPERPIXELS_METHOD;
                options.regionSize = this.myRegionSize;
                this.$refs.canvas2.outlineImageData = Segmentation.create(imageData, options).result;
            },
            _addLayer: function () {
                this.state.layers.push(this.state.layers.length + 1);
            },
            _canUndo: function (canUndo) {
                this.state.isUndoEnabled = canUndo;
            },
            _clear: function () {
                this.$refs.canvas2.clear();
            },
            _export: function () {
                var image = this.$refs.canvas2.exportLayer();
                this.state.snapshots.push(image);
            },
            _exportMasks: function () {
                var xmlFile = this.$refs.canvas2.exportMasks(),
                    downloader = this.$refs.exportMasks;
                var url = window.URL.createObjectURL(new Blob([xmlFile.documentElement.innerHTML], {type: 'text/plain'}));

                downloader.setAttribute('href', url);
                downloader.setAttribute('download', DEFAULT.FILENAME);
                downloader.click();
            },
            _undo: function () {
                if (this.state.isUndoEnabled) {
                    this.$refs.canvas2.undo();
                }
            },
            _updateStyle: function () {
                this.styles.width = this.myWidthPx;
                this.styles.height = this.myHeightPx;
            },
            _zoomIn: function () {
                this.state.zoom = this.state.zoom + 1;
                this.styles.width = (this.myWidth * this.zoomFactor).toString() + 'px';
                this.styles.height = (this.myHeight * this.zoomFactor).toString() + 'px';
            },
            _zoomOut: function () {
                this.state.zoom = this.state.zoom - 1;
                this.styles.width = (this.myWidth * this.zoomFactor).toString() + 'px';
                this.styles.height = (this.myHeight * this.zoomFactor).toString() + 'px';
            },
            _openImage: function (e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;

                var file = files[0],
                    reader = new FileReader(),
                    self = this;

                reader.onload = function (e) {
                    var image = new Image();
                    image.onload = function (e) {
                        self.state.width = image.width;
                        self.state.height = image.height;
                        self.state.zoom = 1;
                        self._updateStyle();
                        self.state.baseImage = reader.result;
                        self.state.layers = [1];
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            },
            _openMasks: function (e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;

                var file = files[0],
                    reader = new FileReader(),
                    self = this;
                reader.onload = function (e) {
                    self.$refs.canvas2._loadMasks(reader.result);
                };
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
});
