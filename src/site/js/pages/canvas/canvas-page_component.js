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
    'image-segmentation/segmentation',
    'web-components/buttons/flat/flat-button_component',
    'components/canvas/canvas_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component',
    'text!pages/canvas/canvas-page_template.html',
], function(Vue, Segmentation, FlatButton, Canvas, TextField, Toggle, ToggleButton, Template) {
    var DEFAULT = {
        // The alpha level of the canvas
        ALPHA: 0.4,
        // The active layer of the canvas
        ACTIVE_LAYER: '1',
        BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.5)',
        HEIGHT: 720,

        /**
         * Store the layers as an array of the form ["1", "2", ..., "n"]
         * Allows to bind the array values to toggle buttons that display the layer number
         * The numbers also act as index for the layer array of the canvas component.
         * There must be at least one layer
         */
        LAYERS: ['1'],

        // Indicates if the canvas is drawable
        OUTLINE_IMAGE: true,
        WIDTH: 1280,
        SUPERPIXEL_SIZE: 40,

        // SLIC is the most common superpixels implementation and one of the most effectives.
        SUPERPIXELS_METHOD: 'slic',

        // Default color is red
        STROKE_COLOR: '#DB0404',

        // Default filename for the masks file.
        FILENAME: 'masks.xml',
    };

    var MAX_RGB = 255;
    var PIXEL_SIZE = 4;

    return Vue.extend({
        template: Template,
        data: function() {
            return {
                state: {
                    alpha: DEFAULT.ALPHA,
                    activeLayer: DEFAULT.ACTIVE_LAYER,
                    backgroundColor: DEFAULT.BACKGROUND_COLOR,
                    baseImage: '',
                    eraserThickness: 10,
                    height: DEFAULT.HEIGHT,
                    isUndoEnabled: false,
                    outlineImage: DEFAULT.OUTLINE_IMAGE,
                    smooth: false,
                    snapshots: [],
                    layers: DEFAULT.LAYERS,
                    strokeColor: DEFAULT.STROKE_COLOR,
                    strokeThickness: 10,
                    regionSize: DEFAULT.SUPERPIXEL_SIZE,
                    tool: Canvas.TOOL.PEN,
                    width: DEFAULT.WIDTH,
                    zoom: 1,
                },

                styles: {
                    width: '',
                    height: '',
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                },
            };
        },
        computed: {
            /**
             * Detects if the eraser tool is selected
             */
            isEraserSelected: function() {
                return this.state.tool === Canvas.TOOL.ERASER;
            },
            /**
             * Detects if the rectangle tool is selected
             */
            isRectSelected: function() {
                return this.state.tool === Canvas.TOOL.RECT;
            },
            /**
             * Detects if the bucket tool is selected
             */
            isBucketSelected: function() {
                return this.state.tool == Canvas.TOOL.BUCKET;
            },
            /**
             * Get the current width as a pixel units
             */
            myWidthPx: function() {
                return this.state.width + 'px';
            },

            /**
             * Get the current height as a pixel units
             */
            myHeightPx: function() {
                return this.state.height + 'px';
            },
            /**
             * Get the integer representation of the width
             */
            myWidth: function() {
                return parseInt(this.state.width);
            },
            /**
             * Get the integer representation of the heigth
             */
            myHeight: function() {
                return parseInt(this.state.height);
            },
            /**
             * Returns the current layer index
             */
            myActiveLayer: function() {
                return parseInt(this.state.activeLayer) - 1;
            },
            /**
             * Get the current region size for the calculation of superpixels
             */
            myRegionSize: function() {
                return parseInt(this.state.regionSize);
            },
            /**
             * Get the zoom level of the canvas
             */
            zoomFactor: function() {
                return this.state.zoom <= 0 ? 1 / Math.abs(this.state.zoom - 2) : this.state.zoom;
            },
        },
        mounted: function() {
            //Updates the styles to set the canvas width and height
            this._updateStyle();
        },
        methods: {
            /**
             * Add a layer to the layer array
             */
            _addLayer: function() {
                this.state.layers.push((this.state.layers.length + 1).toString());
            },
            /**
             * Set the isUndoEnabled property
             */
            _setCanUndo: function(canUndo) {
                this.state.isUndoEnabled = canUndo;
            },
            /**
             * Clear the canvas
             */
            _clear: function() {
                this.$refs.canvas2.clear();
            },
            _detectBorders: function(imageData) {
                var xAxis = imageData.height,
                    yAxis = imageData.width,
                    data = imageData.data,
                    currentRow = 0 * xAxis;
                // Initialize an empty array to store the borders
                var borders = new Uint8ClampedArray(yAxis * xAxis * PIXEL_SIZE);
                // Traverse the data that represents the image. Each 4 entries in the array represent a pixel
                for (var j = 0; j < xAxis * PIXEL_SIZE; j += PIXEL_SIZE) {
                    currentRow = j * yAxis;
                    //
                    for (var offset = 0; offset < yAxis * PIXEL_SIZE; offset += PIXEL_SIZE) {
                        var currentPixel = data.slice(
                            currentRow + offset,
                            currentRow + (offset + PIXEL_SIZE)
                        );
                        // flags that indicate if the algorithm is traversing the borders of the image
                        var upperBorder = currentRow == 0 ? true : false,
                            lowerBorder =
                                currentRow == (xAxis - 1) * PIXEL_SIZE * yAxis ? true : false,
                            leftmostBorder = offset == 0 ? true : false,
                            rightmostBorder = offset == (yAxis - 1) * PIXEL_SIZE ? true : false;
                        var neighbors = this._getPixelNeighbors(
                            currentRow,
                            offset,
                            upperBorder,
                            lowerBorder,
                            leftmostBorder,
                            rightmostBorder,
                            yAxis
                        );
                        for (var i = 0; i < neighbors.length; i++) {
                            var currentNeighbor = neighbors[i];
                            if (currentNeighbor !== null) {
                                var neighborPixel = data.slice(
                                    currentNeighbor[0],
                                    currentNeighbor[1]
                                );
                                var isSamePixel =
                                    neighborPixel[0] === currentPixel[0] &&
                                    neighborPixel[1] === currentPixel[1] &&
                                    neighborPixel[2] === currentPixel[2] &&
                                    neighborPixel[3] === currentPixel[3];
                                if (!isSamePixel) {
                                    borders[currentRow + offset] = MAX_RGB;
                                    borders[currentRow + offset + 1] = MAX_RGB;
                                    borders[currentRow + offset + 2] = MAX_RGB;
                                    borders[currentRow + offset + 3] = MAX_RGB;
                                }
                            }
                        }
                    }
                }
                return borders;
            },
            /**
             * Export the current layer as an image
             * Store the image in the snapshots array
             */
            _export: function() {
                var image = this.$refs.canvas2.exportLayer();
                this.state.snapshots.push(image);
            },
            /**
             * Export the layers of the canvas as an XmlFile
             *
             */
            _exportMasks: function() {
                //Get the masks as an XML file
                var xmlFile = this.$refs.canvas2.exportMasks(),
                    downloader = this.$refs.downloader;

                // Creates an URL from the xml file
                var url = window.URL.createObjectURL(
                    /* eslint-disable no-undef */
                    new Blob([xmlFile.documentElement.innerHTML], {
                        type: 'text/plain',
                    })
                    /* eslint-enable no-undef */
                );
                downloader.setAttribute('href', url);
                downloader.setAttribute('download', DEFAULT.FILENAME);
            },
            /**
             * Generates an invisible outline image that represents the superpixels regions
             * The invisible images contains regions of different colors
             */
            _getOutlineImage: function() {
                // The canvas1 reference contains the original background image.
                this.$refs.canvas1.drawContext.clearRect(0, 0, this.state.width, this.state.height);
                this.$refs.canvas1._redrawBaseImage();
                var imageData = this.$refs.canvas1.drawContext.getImageData(
                        0,
                        0,
                        this.state.width,
                        this.state.height
                    ),
                    options = {};
                //Set the default superpixels method and region size
                options.method = DEFAULT.SUPERPIXELS_METHOD;
                options.regionSize = this.myRegionSize;

                // Creates the superpixels outline image, and sets it as invisible outline image of the drawable canvas
                var superpixelsImage = Segmentation.create(imageData, options).result;
                this.$refs.canvas2.outlineImageData = superpixelsImage;

                this.$refs.canvas1.maskBorders = new ImageData( // eslint-disable-line no-undef
                    this._detectBorders(superpixelsImage),
                    imageData.width,
                    imageData.height
                );
                this.$refs.canvas1._redraw();
            },
            _getPixelNeighbors: function(
                currentRow,
                offset,
                upperBorder,
                lowerBorder,
                leftmostBorder,
                rightmostBorder,
                yAxis
            ) {
                var neighbors = [];
                var previousRow = currentRow - yAxis * PIXEL_SIZE;
                var nextRow = currentRow + yAxis * PIXEL_SIZE;
                var topLeftPixel =
                        upperBorder || leftmostBorder
                            ? null
                            : [previousRow + (offset - PIXEL_SIZE), previousRow + offset],
                    topRightPixel =
                        upperBorder || rightmostBorder
                            ? null
                            : [
                                  previousRow + (offset + PIXEL_SIZE),
                                  previousRow + (offset + PIXEL_SIZE * 2),
                              ],
                    bottomLeftPixel =
                        lowerBorder || leftmostBorder
                            ? null
                            : [nextRow + (offset - PIXEL_SIZE), nextRow + offset],
                    bottomRightPixel =
                        lowerBorder || rightmostBorder
                            ? null
                            : [nextRow + (offset + PIXEL_SIZE), nextRow + (offset + 8)],
                    topPixel = upperBorder
                        ? null
                        : [previousRow + offset, previousRow + (offset + PIXEL_SIZE)],
                    bottomPixel = lowerBorder
                        ? null
                        : [nextRow + offset, nextRow + (offset + PIXEL_SIZE * 2)],
                    leftPixel = leftmostBorder
                        ? null
                        : [currentRow + (offset - PIXEL_SIZE), currentRow + offset],
                    rightPixel = rightmostBorder
                        ? null
                        : [nextRow + (offset + PIXEL_SIZE), nextRow + (offset + PIXEL_SIZE * 2)];

                neighbors.push(
                    topLeftPixel,
                    topRightPixel,
                    bottomLeftPixel,
                    bottomRightPixel,
                    topPixel,
                    bottomPixel,
                    leftPixel,
                    rightPixel
                );
                return neighbors;
            },
            /**
             * Loads a new image into the canvas1
             */
            _openImage: function(e) {
                //Reset the canvas page to a default state

                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;

                var file = files[0],
                    reader = new FileReader(), // eslint-disable-line no-undef
                    self = this;

                this._resetCanvasState();
                this.state.width = 0;
                this.state.height = 0;
                // Wait for the file to load
                reader.onload = function() {
                    var image = new Image(); // eslint-disable-line no-undef
                    // Wait for the image to load
                    image.onload = function() {
                        // Reset the state
                        self.state.width = image.width;
                        self.state.height = image.height;
                        self.state.zoom = 1;
                        self._updateZoom();

                        // Update the canvas
                        self._updateStyle();

                        //Reset the layers and the base image
                        self.state.baseImage = reader.result;
                        self.state.layers = ['1'];
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            },
            /**
             * Open a XML file that contains the enconded masks
             */
            _openMasks: function(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;

                this._resetCanvasState();

                var xmlFile = files[0],
                    reader = new FileReader(), // eslint-disable-line no-undef
                    self = this,
                    parser = new DOMParser(); // eslint-disable-line no-undef

                reader.onload = function() {
                    // Send the XML file to the canvas component for processing.
                    var xmlDoc = parser.parseFromString(reader.result, 'text/xml'); //important to use "text/xml"
                    var body = xmlDoc.getElementsByTagName('masks');
                    var masks = body[0].getElementsByTagName('mask');
                    for (var i = 1; i < masks.length; i++) {
                        self.state.layers.push(i + 1);
                    }
                    self.$refs.canvas2._loadMasks(masks);
                };
                reader.readAsText(xmlFile);
            },
            _updateZoom: function() {
                this.styles.width = (this.myWidth * this.zoomFactor).toString() + 'px';
                this.styles.height = (this.myHeight * this.zoomFactor).toString() + 'px';
            },

            _resetCanvasState: function() {
                this.$refs.canvas2._resetCanvas();
                this.state.activeLayer = DEFAULT.ACTIVE_LAYER;
                this.state.layers = ['1'];
                this.state.zoom = 1;
                this._updateZoom();
            },
            /**
             * Undo the last action
             */
            _undo: function() {
                if (this.state.isUndoEnabled) {
                    this.$refs.canvas2.undo();
                }
            },
            /**
             * Set the styles as pixel values
             */
            _updateStyle: function() {
                this.styles.width = this.myWidthPx;
                this.styles.height = this.myHeightPx;
            },
            /**
             * Increment the zoom by one
             */
            _zoomIn: function() {
                this.state.zoom = this.state.zoom + 1;
                this._updateZoom();
            },
            /**
             * Decrease the zoom by one
             */
            _zoomOut: function() {
                this.state.zoom = this.state.zoom - 1;
                this._updateZoom();
            },
        },
        components: {
            'wc-canvas': Canvas,
            'wc-flat-button': FlatButton,
            'wc-textfield': TextField,
            'wc-toggle': Toggle,
            'wc-toggle-button': ToggleButton,
        },
    });
});
