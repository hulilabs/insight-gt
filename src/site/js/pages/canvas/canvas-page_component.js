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
    'filesaver',
    'jszip',
    'image-segmentation/segmentation',
    'web-components/buttons/flat/flat-button_component',
    'components/canvas/canvas_component',
    'web-components/inputs/textfield/textfield_component',
    'web-components/selection-controls/toggle/toggle_component',
    'web-components/selection-controls/toggle/toggle-button_component',
    'text!pages/canvas/canvas-page_template.html',
], function(
    Vue,
    Filesaver,
    JSZip,
    Segmentation,
    FlatButton,
    Canvas,
    TextField,
    Toggle,
    ToggleButton,
    Template
) {
    var DEFAULT = {
        // The alpha level of the canvas
        ALPHA: 0.4,
        // The active layer of the canvas
        ACTIVE_LAYER: '1',
        BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.5)',
        // Default filename for the masks file.
        FILENAME: 'masks.xml',
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
        SUPERPIXEL_SIZE: 40,
        // SLIC is the most common superpixels implementation and one of the most effectives.
        SUPERPIXELS_METHOD: 'slic',
        // Default color is red
        STROKE_COLOR: '#DB0404',
        WIDTH: 1280,
    };

    // The max value for a 8 bit color channel
    var MAX_RGB = 255;
    // The number of channels in a RGBA pixel.
    var PIXEL_SIZE = 4;

    return Vue.extend({
        template: Template,
        data: function() {
            return {
                // The selected frame
                currentFrame: '1',
                // Common properties across all the frames
                common: {
                    alpha: DEFAULT.ALPHA,
                    activeLayer: DEFAULT.ACTIVE_LAYER,
                    backgroundColor: DEFAULT.BACKGROUND_COLOR,
                    eraserThickness: 10,
                    height: DEFAULT.HEIGHT,
                    isUndoEnabled: false,
                    layers: DEFAULT.LAYERS,
                    layoutOpacity: DEFAULT.ALPHA,
                    smooth: false,
                    regionSize: DEFAULT.SUPERPIXEL_SIZE,
                    snapshots: [],
                    strokeColor: DEFAULT.STROKE_COLOR,
                    strokeThickness: 10,
                    tool: Canvas.TOOL.PEN,
                    width: DEFAULT.WIDTH,
                    zoom: 1,
                },
                // Properties of each individual frame
                states: [],

                // Set of descriptors for each layer.
                descriptors: [],
            };
        },
        computed: {
            /**
             * Detects if the eraser tool is selected
             */
            isEraserSelected: function() {
                return this.common.tool === Canvas.TOOL.ERASER;
            },
            /**
             * Detects if the rectangle tool is selected
             */
            isRectSelected: function() {
                return this.common.tool === Canvas.TOOL.RECT;
            },
            /**
             * Detects if the bucket tool is selected
             */
            isBucketSelected: function() {
                return this.common.tool === Canvas.TOOL.BUCKET;
            },
            /**
             * Detects if the bucket tool is selected
             */
            isBackgroundBucketSelected: function() {
                return this.common.tool === Canvas.TOOL.BACKGROUNDBUCKET;
            },
            /**
             * Get the current width as a pixel units
             */
            myWidthPx: function() {
                return this.common.width + 'px';
            },

            /**
             * Get the current height as a pixel units
             */
            myHeightPx: function() {
                return this.common.height + 'px';
            },
            /**
             * Get the integer representation of the width
             */
            myWidth: function() {
                return parseInt(this.common.width);
            },
            /**
             * Get the integer representation of the heigth
             */
            myHeight: function() {
                return parseInt(this.common.height);
            },
            /**
             * Returns the current layer index
             */
            myActiveLayer: function() {
                return parseInt(this.common.activeLayer) - 1;
            },
            /**
             * Get the current region size for the calculation of superpixels
             */
            myRegionSize: function() {
                return parseInt(this.common.regionSize);
            },
            /**
             * Get the zoom level of the canvas
             */
            zoomFactor: function() {
                return this.common.zoom <= 0
                    ? 1 / Math.abs(this.common.zoom - 2)
                    : this.common.zoom;
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
                this.common.layers.push((this.common.layers.length + 1).toString());
            },
            /**
             * Add a frame for image processing. Each frame is defined by its state
             */
            _addFrame: function() {
                var currentLength = this.states.length;
                this.states.push({
                    baseImage: '0',
                    outlineImage: DEFAULT.OUTLINE_IMAGE,
                    canvasId: (currentLength + 1).toString(),
                    styleWidth: '',
                    styleHeight: '',
                    position: 'absolute',
                    left: '-10000x',
                    right: '0px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                });
            },
            /**
             * Classificates the superpixels of the current frame, using the current layer descriptors
             */
            _classifyImage: function() {
                this._getOutlineImage();
                var baseCanvas = this.$refs['canvas1' + this.currentFrame][0];
                var baseImage = baseCanvas.drawContext.getImageData(
                    0,
                    0,
                    baseCanvas.width,
                    baseCanvas.height
                );
                this.$refs['canvas2' + this.currentFrame][0].classifyFrame(
                    baseImage.data,
                    this.descriptors[this.myActiveLayer]
                );
            },
            /**
             * Clear the canvas
             */
            _clear: function() {
                this.$refs['canvas2' + this.currentFrame][0].clear();
            },
            /**
             * Detects the superpixels outline mask for a given image
             * @param {*} imageData
             */
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
                var zip = new JSZip();
                this.common.snapshots.length = 0;
                // Creates a zip file, storing each layer inside folders named as their respective frame.
                for (var i = 0; i < this.states.length; i++) {
                    var imageFolder = zip.folder('frame' + this.states[i].canvasId);
                    var images = this.$refs['canvas2' + this.states[i].canvasId][0].exportLayers();
                    for (var index = 0; index < images.length; index++) {
                        imageFolder.file(
                            'layer' + index + '.png',
                            images[index].src.split(',')[1],
                            {
                                base64: true,
                            }
                        );
                    }
                }

                /* eslint-disable no-undef */
                zip.generateAsync({ type: 'blob' }).then(function(content) {
                    window.saveAs(content, 'export.zip'); //
                });
                /* eslint-enable no-undef */
            },
            /**
             * Export the layers of the canvas as an XmlFile
             */
            _exportMasks: function() {
                var xmlDoc = document.implementation.createDocument(null, 'xml'),
                    body = document.createElementNS(null, 'segmentation');

                var downloader = this.$refs.downloader;
                for (var index = 0; index < this.states.length; index++) {
                    var currentFrame = this.$refs['canvas2' + this.states[index].canvasId][0];
                    //Get the masks as an XML file
                    var frameMask = currentFrame.exportMasks();
                    body.appendChild(frameMask);
                }
                var layerCount = frameMask.getElementsByTagName('mask').length;
                body.setAttribute('layerCount', layerCount);
                xmlDoc.documentElement.append(body);
                // Creates an URL from the xml file
                var url = window.URL.createObjectURL(
                    /* eslint-disable no-undef */
                    new Blob([xmlDoc.documentElement.innerHTML], {
                        type: 'text/plain',
                    })
                    /* eslint-enable no-undef */
                );
                downloader.setAttribute('href', url);
                downloader.setAttribute('download', DEFAULT.FILENAME);
            },
            /**
             * Get the descriptors of the current layer
             * The algorithm generates a histogram of each frame, for the current layer.
             */
            _getLayerDescriptors: function() {
                // For each frame, get the color histogram of the active layer.
                this.descriptors[this.myActiveLayer] = [];
                for (var i = 0; i < this.states.length; i++) {
                    var baseCanvas = this.$refs['canvas1' + this.states[i].canvasId][0];
                    var baseImage = baseCanvas.drawContext.getImageData(
                        0,
                        0,
                        baseCanvas.width,
                        baseCanvas.height
                    );
                    var histograms = this.$refs[
                        'canvas2' + this.states[i].canvasId
                    ][0].getHistograms(baseImage.data);
                    if (histograms !== null) {
                        this.descriptors[this.myActiveLayer].push(histograms);
                    }
                }
            },
            /**
             * Generates an invisible outline image that represents the superpixels regions
             * The invisible images contains regions of different colors
             */
            _getOutlineImage: function() {
                // The canvas1 reference contains the original background image.
                var currentBackgroundImage = this.$refs['canvas1' + this.currentFrame][0];
                currentBackgroundImage.drawContext.clearRect(
                    0,
                    0,
                    this.common.width,
                    this.common.height
                );
                currentBackgroundImage._redrawBaseImage();
                var imageData = currentBackgroundImage.drawContext.getImageData(
                        0,
                        0,
                        this.common.width,
                        this.common.height
                    ),
                    options = {};
                //Set the default superpixels method and region size
                options.method = DEFAULT.SUPERPIXELS_METHOD;
                options.regionSize = this.myRegionSize;

                // Creates the superpixels outline image, and sets it as invisible outline image of the drawable canvas
                var superpixelsImage = Segmentation.create(imageData, options).result;
                var currentForegroundImage = this.$refs['canvas2' + this.currentFrame][0];
                currentForegroundImage.outlineImageData = superpixelsImage;

                currentBackgroundImage.maskBorders = new ImageData( // eslint-disable-line no-undef
                    this._detectBorders(superpixelsImage),
                    imageData.width,
                    imageData.height
                );
                currentBackgroundImage._redraw();
            },
            /**
             * Obtains the neighbors for the give pixel coordinates
             */
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
             * Load a set of images as frames, creating a new states array
             */
            _loadImage: function(file, files, frame) {
                var reader = new FileReader(), // eslint-disable-line no-undef
                    self = this;
                this.common.width = 0;
                this.common.height = 0;
                reader.onload = function() {
                    var image = new Image(); // eslint-disable-line no-undef
                    // Wait for the image to load
                    image.onload = function() {
                        // Reset the state
                        self.common.width = image.width;
                        self.common.height = image.height;
                        self.common.zoom = 1;
                        self._updateZoom();
                        // Update the canvas
                        self._updateStyle();
                        //Reset the layers and the base image
                        self.states[frame].baseImage = image.src;
                        if (files.length === 0) {
                            return;
                        } else {
                            var nextFile = files[0][1];
                            self._loadImage(nextFile, files.slice(1, files.length), frame + 1);
                        }
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            },
            /**
             * Loads a new image into the canvas1
             */
            _openImages: function(e) {
                //Reset the canvas page to a default state

                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                var fileArray = Object.entries(files);
                this._resetEnvironment();
                for (var index = 0; index < files.length; index++) {
                    this._addFrame();
                }
                this._swapFrame(this.currentFrame);
                var file = fileArray[0][1];
                this._loadImage(file, fileArray.slice(1, fileArray.length), 0);

                // Wait for the file to load
            },
            /**
             * Open a XML file that contains the enconded masks
             */
            _openMasks: function(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;

                var xmlFile = files[0],
                    reader = new FileReader(), // eslint-disable-line no-undef
                    self = this,
                    parser = new DOMParser(); // eslint-disable-line no-undef

                reader.onload = function() {
                    self.common.layers.length = 0;
                    // Send the XML file to the canvas component for processing.
                    var xmlDoc = parser.parseFromString(reader.result, 'text/xml'); //important to use "text/xml"
                    var body = xmlDoc.getElementsByTagName('segmentation');
                    var layerCount = body[0].getAttribute('layerCount'),
                        frames = body[0].getElementsByTagName('frame');

                    for (var i = 1; i < layerCount; i++) {
                        self.common.layers.push(i + 1);
                    }
                    for (var index = 0; index < frames.length; index++) {
                        var mask = frames[index].getElementsByTagName('mask');
                        var currentForegroundImage = self.$refs['canvas2' + (index + 1)][0];
                        currentForegroundImage._loadMasks(mask);
                    }
                };
                reader.readAsText(xmlFile);
            },
            /**
             * Reset the tool environment to begin anew
             */
            _resetEnvironment: function() {
                this.states.length = 0;
                this.common.layers = ['1'];
                this.common.activeLayer = 1;
                this.common.zoom = 1;
                this.common.alpha = DEFAULT.ALPHA;
                this.common.activeLayer = DEFAULT.ACTIVE_LAYER;
                this.common.backgroundColor = DEFAULT.BACKGROUND_COLOR;
                this.common.eraserThickness = 10;
                this.common.height = DEFAULT.HEIGHT;
                this.common.smooth = false;
                this.common.strokeColor = DEFAULT.STROKE_COLOR;
                this.common.strokeThickness = 10;
                this.common.regionSize = DEFAULT.SUPERPIXEL_SIZE;
                this.common.tool = Canvas.TOOL.PEN;
                this.common.width = DEFAULT.WIDTH;
                this.common.zoom = 1;
                this.common.layers = DEFAULT.LAYERS;
                this.common.isUndoEnabled = false;
                this.currentFrame = '1';
            },
            /**
             * Set the isUndoEnabled property
             */
            _setCanUndo: function(canUndo) {
                this.common.isUndoEnabled = canUndo;
            },
            /**
             * Swap the current frame for another
             */
            _swapFrame: function() {
                this.common.zoom = 1;
                this._updateZoom();
                this._updateStyle();
                for (var i = 0; i < this.states.length; i++) {
                    if (this.states[i].canvasId != this.currentFrame) {
                        this.states[i].left = '-10000px';
                    } else {
                        this.states[i].left = '0px';
                    }
                }
            },
            /**
             * Undo the last action
             */
            _undo: function() {
                if (this.common.isUndoEnabled) {
                    this.$refs['canvas2' + this.currentFrame][0].undo();
                }
            },
            /**
             * Set the styles as pixel values
             */
            _updateStyle: function() {
                this.states.styleWidth = this.myWidthPx;
                this.states.styleHeight = this.myHeightPx;
            },
            /**
             * Updates the style according to the current zoom level
             */
            _updateZoom: function() {
                this.states[this.currentFrame - 1].styleWidth =
                    (this.myWidth * this.zoomFactor).toString() + 'px';
                this.states[this.currentFrame - 1].styleHeight =
                    (this.myHeight * this.zoomFactor).toString() + 'px';
            },
            /**
             * Increment the zoom by one
             */
            _zoomIn: function() {
                this.common.zoom = this.common.zoom + 1;
                this._updateZoom();
            },
            /**
             * Decrease the zoom by one
             */
            _zoomOut: function() {
                this.common.zoom = this.common.zoom - 1;
                this._updateZoom();
            },
        },
        watch: {
            /**
             * On frame changes, set the isUndoEnabled property
             */
            currentFrame: function() {
                this.$refs['canvas2' + this.currentFrame][0]._notifyCanUndo();
                this._swapFrame(this.currentFrame);
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
