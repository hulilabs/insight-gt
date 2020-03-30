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
 * @file Canvas component
 * @requires vue
 * @requires web-components/utils/dom
 * @requires components/canvas/canvas_template.html
 * @requires components/canvas/canvas_styles.css
 * @module components/canvas/canvas_component
 * @extends Vue
 * @fires module:Canvas#EVENT.CAN_UNDO
 * @see {@link https://www.html5rocks.com/en/tutorials/canvas/performance/} for canvas performance optimizations
 * @see {@link http://perfectionkills.com/exploring-canvas-drawing-techniques/} for mindblowing drawing techniques
 * @see {@link http://eloquentjavascript.net/16_canvas.html} canvas for gaming
 * @see {@link https://web-components.hulilabs.xyz/components/canvas} for demos and documentation
 */
define([
    'vue',
    'utilities/utilities',
    'colors',
    'web-components/utils/dom',
    'text!components/canvas/canvas_template.html',
    'css-loader!components/canvas/canvas_styles.css',
], function(Vue, Utilities, Colors, DOMUtil, Template) {
    /**
     * @typedef  {Object}  Coordinate
     * @property {Number}  x    - point X-axis coordinate position
     * @property {Number}  y    - point Y-axis coordinate position
     */

    /**
     * @typedef  {Object}  ImageState
     * @property {boolean} loaded   - is image loaded
     * @property {Image}   instance - image dom object
     */

    /**
     * @typedef  {Object}  Point
     * @property {boolean} drag - was the point part stored from a move event
     * @property {Number}  x    - point X-axis coordinate position
     * @property {Number}  y    - point Y-axis coordinate position
     */

    /**
     * @typedef  {Object}  Stroke
     * @property {string}  color     - stroke color
     *                                 @note When the erasing tool is selected, the stored color
     *                                       is not reliable due to background color changes
     * @property {Point[]} points    - set of points that compose a stroke
     * @property {string}  tool      - tool used for the stroke
     * @property {Number}  thickness - stroke thickness
     */

    /**
     * Contains the default values for the first layer of the canvas.
     * When the canvas is initialized, a layer will be initialized as well.
     * @type {Object}
     */
    var DEFAULT = {
        BACKGROUND_COLOR: 'rgb(200,200,200)',
        LINE_COLOR: '#000000',
        STROKE_COLOR: '#DB0404',
        STROKE_ARRAY: [[219, 4, 4]],
        POPPED_IMAGES_BUFFER: [''],
        ERASER_COLOR: 'rgba(0,0,0,1)',
        PIXEL_SIZE: 4,
    };

    /**
     * List of events
     * @type {Object}
     */
    var EVENT = {
        CAN_UNDO: 'can-undo',
    };

    /**
     * List of tracing tools
     * @type {Object}
     */
    var TOOL = {
        PEN: 'pen',
        ERASER: 'eraser',
        RECTANGLE: 'rectangle',
        BUCKET: 'bucket',
        BACKGROUNDBUCKET: 'backgroundBucket',
    };

    /**
     * Export quality
     * @type {Number}
     */
    var EXPORT_QUALITY = 1;

    /**
     * Security error code
     * @type {Number}
     */
    var ERROR_CODE_CANVAS_TAINTED = 18;

    var Canvas = Vue.extend({
        name: 'CanvasComponent',
        template: Template,
        props: {
            /**
             * Alpha level of the canvas
             */
            alpha: {
                type: [Number, String],
                default: 0.4,
            },
            /**
             * Current layer on which operations are performed
             */
            activeLayer: {
                type: Number,
                default: 0,
            },
            /**
             * Canvas main background color
             */
            backgroundColor: {
                type: String,
                default: DEFAULT.BACKGROUND_COLOR,
            },
            /**
             * Background image
             * Used for loading initial image state
             * If a canvas is for drawing operations, the base image acts as the canvas pixels state
             */
            baseImage: {
                type: String,
                default: '',
            },
            /**
             * Define a cross origin for images loading
             * Values: anonymous, use-credentials
             * @see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes
             */
            crossOrigin: {
                type: String,
                default: null,
                required: false,
            },
            /**
             * Eraser thickness
             */
            eraserThickness: {
                type: [Number, String],
                default: 1,
            },
            /**
             * Canvas height dimension
             */
            height: {
                type: [Number, String],
                default: 0,
            },
            /**
             * The layout image opacity
             */
            layoutOpacity: {
                type: [Number, String],
                default: 0.4,
            },
            /**
             * Flag that indicates if a canvas has an outline image
             * If a canvas has an outline image, drawing operations can be performed on the canvas
             */
            outlineImage: {
                type: Boolean,
                default: false,
            },
            /**
             * Improves trace smoothness by adding a shadow to the stroke
             * This is a heavy task, so the performance may be impacted on continuous drawing
             */
            smooth: {
                type: Boolean,
                default: false,
            },
            /**
             * Current stroke color
             * Accepts any web color naming like 'red' or '#F00'
             */
            strokeColor: {
                type: String,
                default: DEFAULT.STROKE_COLOR,
            },

            /**
             * Stroke thickness
             */
            strokeThickness: {
                type: [Number, String],
                default: 1,
            },
            /**
             * Currently in-use tool
             * @see Canvas.TOOL
             */
            tool: {
                type: String,
                default: TOOL.PEN,
                validator: function(value) {
                    return TOOL.hasOwnProperty(value.toUpperCase());
                },
            },
            /**
             * Canvas width dimension
             */
            width: {
                type: [Number, String],
                default: 0,
            },
            /**
             * Zoom level
             */
            zoom: {
                type: Number,
                default: 1,
            },
        },
        data: function() {
            return {
                /**
                 * Contains the base image encoded in a base64 string
                 */
                baseImageData: '',
                /**
                 * The color of the current layer
                 */
                activeStrokeColor: '',
                /**
                 * Stores drawing in-progress points
                 * @type {Array}
                 */
                drawBuffer: [[]],
                /**
                 * Canvas 2D context
                 */
                drawContext: null,
                /**
                 * For each layer, stores up to 10 frames of the canvas, encoded in a base64 string
                 * Each frame represents the state of the canvas of the last 10 draw operations
                 * @type {Array}
                 */
                drawStack: [[]],
                /**
                 * base image state
                 * @see {ImageState}
                 */
                baseImageState: {
                    loaded: false,
                    instance: null,
                },
                /**
                 * The outline image borders.
                 */
                maskBorders: null,
                /**
                 * outline image state
                 * @see {ImageState}
                 */
                outlineImageState: {
                    loaded: false,
                    instance: null,
                },
                /**
                 * The superpixels outline image
                 */
                outlineImageData: null,
                /**
                 *State of the canvas
                 */
                state: {
                    activeLayer: 0,
                    lastBufferedPoint: null,
                    painting: false,
                    tainted: false,
                },
                /**
                 * Store the colors corresponding to each layer
                 */
                strokeColors: [DEFAULT.STROKE_COLOR],
                /**
                 * Store the colors corresponding to each layer.
                 * Each color is encoded as an RGB int array.
                 */
                strokeArray: DEFAULT.STROKE_ARRAY,
                /**
                 * Buffer that contains frames that are popped from the drawStack, for each layer
                 * When a maximum of undo operations is reached, the last popped image will be redrawn and the undo button will be disabled.
                 */
                lastPoppedImageArray: DEFAULT.POPPED_IMAGES_BUFFER,
            };
        },
        computed: {
            /**
             * Get current stroke color based on selected tool
             * @return {string}
             */
            currentStrokeColor: function() {
                return this._getColorByTool();
            },
            /**
             * Get current stroke thickness based on selected tool
             * @return {string}
             */
            currentStrokeThickness: function() {
                return this._getThicknessByTool();
            },
            /**
             * Get draw area height
             * @return {number} pixels
             */
            drawHeight: function() {
                return this.height;
            },
            /**
             * Get draw area width
             * @return {number} pixels
             */
            drawWidth: function() {
                return this.width;
            },
            /**
             * Detect if base image was provided
             * @return {boolean}
             */
            hasBaseImage: function() {
                return this.baseImageData !== '';
            },
            /**
             * Detect if outline image was provided
             * @return {boolean}
             */
            hasOutlineImage: function() {
                return this.outlineImage;
            },
            /**
             * Detects if the eraser tool is selected
             * @return {boolean}
             */
            isEraser: function() {
                return this.tool === TOOL.ERASER;
            },
            /**
             * Detects if the rectangle tool is selected
             * @return {boolean}
             */
            isRectangle: function() {
                return this.tool === TOOL.RECTANGLE;
            },
            /**
             * Detects if the bucket fill tool is selected
             * @return {boolean}
             */
            isBucket: function() {
                return this.tool === TOOL.BUCKET;
            },
            /**
             * Detects if the background bucket tool is selected
             * @return {boolean}
             */
            isBackgroundBucket: function() {
                return this.tool === TOOL.BACKGROUNDBUCKET;
            },
        },
        mounted: function() {
            // Draw context must be initialized before any other setup
            this._resetCanvas();
        },
        methods: {
            /**
             * Add a new layer
             */
            addLayer: function() {
                this.drawBuffer.push([]);
                this.drawStack.push([]);
            },
            /**
             * Add a new color to the color array
             * @param color
             */
            addColor: function(color) {
                this.strokeColors.push(color);
                var encodedColor = color.match(/[a-f0-9]{2}/gi);
                this.strokeArray.push(
                    encodedColor.map(function(v) {
                        return parseInt(v, 16);
                    })
                );
            },
            /**
             * Verify if the image assets are loaded
             * @return {boolean}
             */
            areImagesReady: function() {
                return (
                    (!this.hasBaseImage || (this.hasBaseImage && this.baseImageState.loaded)) &&
                    (!this.hasOutlineImage ||
                        (this.hasOutlineImage && this.outlineImageState.loaded))
                );
            },
            /**
             * Classify the superpixels image according to the given descriptors.
             */
            classifyFrame: function(baseImageData, descriptors) {
                var xAxis = this.outlineImageData.height,
                    yAxis = this.outlineImageData.width,
                    data = this.outlineImageData.data,
                    currentRow = 0 * xAxis,
                    defaultPixel = new Uint8ClampedArray(4),
                    canvas = document.createElement('canvas'),
                    pixelCount = [];

                var ctx = canvas.getContext('2d');
                ctx.globalAlpha = 1;
                canvas.width = yAxis;
                canvas.height = xAxis;

                var currentRed = 0,
                    currentGreen = 0,
                    currentBlue = 1;
                var image = ctx.getImageData(0, 0, this.width, this.height);
                var data = image.data;
                for (var j = 0; j < xAxis * DEFAULT.PIXEL_SIZE; j += DEFAULT.PIXEL_SIZE) {
                    var currentRow = j * yAxis;
                    for (
                        var offset = 0;
                        offset < yAxis * DEFAULT.PIXEL_SIZE;
                        offset += DEFAULT.PIXEL_SIZE
                    ) {
                        var currentPixel = data.slice(
                            currentRow + offset,
                            currentRow + (offset + DEFAULT.PIXEL_SIZE)
                        );
                        if (currentBlue >= 256) {
                            currentBlue = 0;
                            currentGreen++;
                        }
                        if (currentGreen >= 256) {
                            currentGreen = 0;
                            currentRed++;
                        }

                        ctx.strokeStyle =
                            'rgb(' + currentRed + ', ' + currentGreen + ', ' + currentBlue + ')';
                        ctx.fillStyle =
                            'rgb(' + currentRed + ', ' + currentGreen + ', ' + currentBlue + ')';

                        currentBlue++;

                        if (currentBlue == currentGreen && currentGreen == currentRed) {
                            currentBlue++;
                        }

                        if (
                            currentPixel.length === defaultPixel.length &&
                            currentPixel.every(function(value, index) {
                                return value === defaultPixel[index];
                            })
                        ) {
                            var xPoint = offset / DEFAULT.PIXEL_SIZE,
                                yPoint = j / DEFAULT.PIXEL_SIZE;
                            Utilities.floodFill(
                                ctx,
                                xPoint,
                                yPoint,
                                this.outlineImageData,
                                255,
                                pixelCount,
                                data
                            );
                            var redHistogram = new Array(256).fill(0),
                                greenHistogram = new Array(256).fill(0),
                                blueHistogram = new Array(256).fill(0),
                                normalizationIndex = 0;

                            for (var pixelIndex = 0; pixelIndex < pixelCount.length; pixelIndex++) {
                                normalizationIndex++;
                                redHistogram[baseImageData[pixelCount[pixelIndex]]]++;
                                greenHistogram[baseImageData[pixelCount[pixelIndex] + 1]]++;
                                blueHistogram[baseImageData[pixelCount[pixelIndex] + 2]]++;
                            }
                            pixelCount = [];
                            // Perform normalization of the color histograms, to get an array with values in the range [0,1]
                            var redHistogramNormalized = redHistogram.map(function(element) {
                                    return element / normalizationIndex;
                                }),
                                greenHistogramNormalized = greenHistogram.map(function(element) {
                                    return element / normalizationIndex;
                                }),
                                blueHistogramNormalized = blueHistogram.map(function(element) {
                                    return element / normalizationIndex;
                                });
                            var redMinima = 0,
                                greenMinima,
                                blueMinima;
                            for (
                                var descriptorIndex = 0;
                                descriptorIndex < descriptors.length;
                                descriptorIndex++
                            ) {
                                for (var index = 0; index < 256; index++) {
                                    redMinima += Math.min(
                                        redHistogramNormalized[index],
                                        descriptors[descriptorIndex][0][index]
                                    );
                                    greenMinima += Math.min(
                                        greenHistogramNormalized[index],
                                        descriptors[descriptorIndex][1][index]
                                    );
                                    blueMinima += Math.min(
                                        blueHistogramNormalized[index],
                                        descriptors[descriptorIndex][2][index]
                                    );
                                }
                            }
                            redMinima /= descriptors.length;
                            greenMinima /= descriptors.length;
                            blueMinima /= descriptors.length;
                            if (redMinima >= 0.5) {
                                this._fillSuperpixel(xPoint, yPoint, this.currentStrokeColor);
                            }
                        }
                    }
                }
                // Create a representation of the floodfill operation
                this.drawBuffer[this.state.activeLayer].push(null);

                // Commit the changes
                this.baseImageData = this._commitStroke(this.state.activeLayer);
                this._notifyCanUndo();
                this._clearBuffer();
            },
            /**
             * Clear all drawn strokes
             * @note this basically flush the stack and buffer and then redraw
             */
            clear: function() {
                this.drawStack[this.state.activeLayer] = [];
                this._notifyCanUndo();
                this._clearBuffer();
                if (this.hasOutlineImage) {
                    this.baseImageData = '';
                }

                this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                this._redrawBaseImage();
                this.lastPoppedImage[this.state.activeLayer] = '';
                this._redraw();
            },
            /**
             * Export canvas as blob (raw) data
             * @see https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
             * @see https://github.com/eligrey/canvas-toBlob.js
             * @param  {string} type
             * @return {Promise} - resolves Blob as first argument
             */
            exportBlob: function(type) {
                var mime = 'image/' + type,
                    canvas = this.$refs.canvas;

                return new Promise(
                    function(resolve, reject) {
                        if (this.isTainted()) {
                            // exit and reject
                            return reject();
                        }

                        // Quickiest method (not supported by most browsers)
                        if (canvas.toBlob) {
                            canvas.toBlob(
                                function(blob) {
                                    resolve(blob);
                                },
                                mime,
                                EXPORT_QUALITY
                            );
                        } else {
                            // Fallback way to transform dataUrl into a Blob
                            var data = canvas.toDataURL(mime).split(','),
                                binary;

                            // convert base64/URLEncoded data component to raw binary data held in a string
                            if (data[0].indexOf('base64') >= 0) {
                                binary = atob(data[1]); // eslint-disable-line no-undef
                            } else {
                                binary = unescape(data[1]); // decodeURI
                            }

                            // write the bytes of the string to a typed array
                            var content = [];
                            for (var i = 0; i < binary.length; i++) {
                                content[i] = binary.charCodeAt(i);
                            }

                            var arrayBuffer = new Uint8Array(content),
                                blob = new Blob([arrayBuffer.buffer], { type: mime }); // eslint-disable-line no-undef

                            resolve(blob);
                        }
                    }.bind(this)
                );
            },
            /**
             * Export canvas as File object
             * @note avoid File object due to bad Safari support
             * @param  {string} type
             * @param  {string} filename
             * @return {Promise} - resolves File as first argument
             */
            exportFile: function(type, filename) {
                return this.exportBlob(type).then(function(blob) {
                    return new File([blob], filename, { type: blob.type }); // eslint-disable-line no-undef
                });
            },
            /**
             * Exports all the layers as png images
             * @returns {HTMLImageElement}
             */
            exportLayers: function() {
                var images = [];
                if (!this.isTainted()) {
                    try {
                        for (var index = 0; index < this.drawStack.length; index++) {
                            var layer = this.drawStack[index];
                            var image = new Image(); // eslint-disable-line no-undef
                            image.src = layer[layer.length - 1];
                            images.push(image);
                        }
                    } catch (e) {
                        // Do nothing, avoid log error
                        this._detectTainted(e);
                    }
                }
                return images;
            },
            /**
             * Export the canvas layers as a xml file
             * @return {Array}
             */
            exportMasks: function() {
                var body = document.createElementNS(null, 'frame');

                for (var i = 0; i < this.drawStack.length; i++) {
                    var layer = this.drawStack[i];

                    var mask = document.createElementNS(null, 'mask');
                    if (layer.length > 0) {
                        mask.setAttribute('layer', layer[layer.length - 1].toString());
                    } else {
                        mask.setAttribute('layer', 'null');
                    }
                    mask.setAttribute('color', this.strokeColors[i].toString());
                    body.appendChild(mask);
                }
                return body;
            },
            /**
             * Get the histogram for the active layer
             */
            getHistograms: function(baseImage) {
                var layer = this.drawStack[this.state.activeLayer];
                if (layer.length > 0) {
                    var image = this.drawContext.getImageData(0, 0, this.width, this.height);
                    var data = image.data;
                    var redHistogram = new Array(256).fill(0);
                    var greenHistogram = new Array(256).fill(0);
                    var blueHistogram = new Array(256).fill(0);
                    var normalizationIndex = 0;
                    for (var i = 3; i < data.length; i += 4) {
                        if (!(data[i - 3] === data[i - 2] && data[i - 2] === data[i - 1])) {
                            normalizationIndex++;
                            redHistogram[baseImage[i - 3]]++;
                            greenHistogram[baseImage[i - 2]]++;
                            blueHistogram[baseImage[i - 1]]++;
                        }
                    }

                    // Perform normalization of the color histograms, to get an array with values in the range [0,1]
                    var redHistogramNormalized = redHistogram.map(function(element) {
                            return element / normalizationIndex;
                        }),
                        greenHistogramNormalized = greenHistogram.map(function(element) {
                            return element / normalizationIndex;
                        }),
                        blueHistogramNormalized = blueHistogram.map(function(element) {
                            return element / normalizationIndex;
                        });

                    return [
                        redHistogramNormalized,
                        greenHistogramNormalized,
                        blueHistogramNormalized,
                    ];
                } else {
                    return null;
                }
            },
            /**
             * Verify if the canvas was marked as tainted
             * @return {boolean}
             */
            isTainted: function() {
                return this.state.tainted;
            },
            /**
             * Undo the last drawn stroke
             * @note remove the last commited stroke from the stack and then redraw
             */
            undo: function() {
                this.drawStack[this.state.activeLayer].pop();
                this._notifyCanUndo();
                this._redraw();
            },
            /**
             * Buffer one draw point
             * @param  {Event}   e    - trigger event
             * @param  {boolean} drag - is move event
             * @return {Point}        - the buffered point
             * @private
             */
            _bufferPoint: function(e, drag) {
                var zoom = this.zoom;
                if (zoom <= 0) {
                    zoom = 1 / Math.abs(zoom - 2);
                }
                var positions = this._getPositions(e),
                    // @see {Point}
                    point = {
                        drag: drag,
                        x: positions.x / zoom,
                        y: positions.y / zoom,
                    };

                this.state.lastBufferedPoint = point;
                this.drawBuffer[this.state.activeLayer].push(point);

                return point;
            },
            /**
             * Flush the buffered points
             * @private
             */
            _clearBuffer: function() {
                this.state.lastBufferedPoint = null;
                this.drawBuffer[this.state.activeLayer] = [];
            },
            /**
             * Transforms the canvas into an image to load it in the redraw step.
             * @private
             */
            _commitStroke: function(layer) {
                var imagedata = this._smoothCanvas(),
                    canvas = document.createElement('canvas');
                if (this.drawBuffer[layer].length > 0) {
                    var ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 1;
                    canvas.width = imagedata.width;
                    canvas.height = imagedata.height;
                    ctx.putImageData(imagedata, 0, 0);

                    if (this.drawStack[layer].length >= 10) {
                        this.lastPoppedImage[layer] = this.drawStack[layer].shift();
                    }
                    this.drawStack[layer].push(canvas.toDataURL());
                }
                return canvas.toDataURL();
            },
            /**
             * Detect tainted canvas state
             * @param  {Error} e - SecurityError
             */
            _detectTainted: function(e) {
                if (e.code === ERROR_CODE_CANVAS_TAINTED) {
                    this.state.tainted = true;
                }
            },
            /**
             * Flood the superpixel in the x and y coordinates with the current color.
             */
            _fillSuperpixel: function(xCoor, yCoor, strokeColor) {
                var operation = this.drawContext.globalCompositeOperation;
                // Eraser stroke is always transparent black color
                // Eraser thickness is stored as is, no need to verify it
                strokeColor = this.isEraser
                    ? DEFAULT.ERASER_COLOR
                    : this.strokeColors[this.state.activeLayer];
                if (this.isEraser) {
                    this.drawContext.globalAlpha = 1;
                }

                // Optimization: adding shadow is an expensive task
                if (this.smooth) {
                    this.drawContext.shadowBlur = 2;
                    this.drawContext.shadowColor = strokeColor;
                }
                // Setup stroke drawing conditions

                this.drawContext.strokeStyle = strokeColor;
                this.drawContext.fillStyle = strokeColor;

                Utilities.floodFill(
                    this.drawContext,
                    xCoor,
                    yCoor,
                    this.outlineImageData,
                    this.alpha * 255
                );
                this.drawContext.globalCompositeOperation = operation;
                this._setAlpha();
            },
            /**
             * Get the current color for the chosen tool
             *
             * @note the eraser does not "delete" strokes, it just simulates the same
             *       visual effect by painting a stroke of the current background color
             *
             * @param  {string} tool - @see module:CANVAS#TOOL
             * @return {string}      - web color
             * @private
             */
            _getColorByTool: function() {
                return this.isEraser ? this.backgroundColor : this.activeStrokeColor;
            },
            /**
             * Get the current thickness for the chosen tool
             *
             * @param  {string} tool - @see module:CANVAS#TOOL
             * @return {number}
             * @private
             */
            _getThicknessByTool: function() {
                return this.isEraser ? this.eraserThickness : this.strokeThickness;
            },
            /**
             * Get the coordinate (x,y) from the drawing event and context
             *
             * @notes
             * - pageX and pageY is retrieved differently for touch events
             * - in-the-middle scrollable areas need position:relative for offset parents calculation
             *
             * @param  {Event}      e    - trigger event
             * @return {Coordinate}      - position coordinate
             *
             * @private
             */
            _getPositions: function(e) {
                var element = this.$refs.canvas,
                    isTouchEvent = !!e.changedTouches,
                    // using e.touches instead of changedTouches makes no difference
                    positionSource = isTouchEvent ? e.changedTouches[0] : e,
                    offsetLeft = DOMUtil.getDocumentOffsetLeft(element),
                    offsetTop = DOMUtil.getDocumentOffsetTop(element);

                /**
                 * Following lines decide how the coordinates are calculated for drawing purposes
                 * considering the scroll position, offset parents and viewport offset
                 *
                 * @note sometimes the offset is negative, meaning the canvas is out of the viewport
                 *       (probably because of the scroll) and then the scroll offset is added
                 *
                 * @warning beware of changing how the scroll offset is calculated
                 *          keep in mind checking mobile scenarios
                 */
                var scrollLeft = this._isInsideSeveralScrollableArea(DOMUtil.hasHorizontalScroll)
                        ? DOMUtil.getScrollOffsetLeft(element)
                        : 0,
                    scrollTop = this._isInsideSeveralScrollableArea(DOMUtil.hasVerticalScroll)
                        ? DOMUtil.getScrollOffsetTop(element)
                        : 0,
                    x = positionSource.pageX - offsetLeft + scrollLeft,
                    y = positionSource.pageY - offsetTop + scrollTop;

                // @see {Coordinate}
                return {
                    x: x,
                    y: y,
                };
            },
            /**
             * Detect if the canvas has any in-the-middle scrollable areas
             * like when several position:relative with overflow:scroll divs are nested
             * @param  {Function} scrollDetector - function to detect by recursion if an element has scroll
             * @return {boolean}
             * @private
             */
            _isInsideSeveralScrollableArea: function(scrollDetector) {
                var element = this.$refs.canvas,
                    inside = false;

                while (element) {
                    if (scrollDetector(element)) {
                        inside = true;
                        break;
                    } else {
                        element = element.offsetParent;
                    }
                }
                return inside;
            },
            /**
             * Load base image
             * @private
             */
            _loadBaseImage: function() {
                this._loadImage(this.baseImageData, this.hasBaseImage, this.baseImageState);
            },

            /**
             * Load outline image
             * @private
             */
            _loadOutlineImage: function() {
                this._loadImage(
                    this.outlineImageData,
                    this.hasOutlineImage,
                    this.outlineImageState
                );
            },
            /**
             * Abstract method for loading an in-memory image to be draw inside the canvas
             * @param  {string}     imagePath  - url
             * @param  {boolean}    hasImage   - image property checker
             * @param  {ImageState} imageState - image loaded flag and instance
             * @private
             */
            _loadImage: function(imagePath, hasImage, imageState) {
                if (hasImage && !imageState.loaded && !imageState.instance) {
                    // Create an in-memory image DOM object
                    imageState.instance = new Image(); // eslint-disable-line no-undef

                    /**
                     * To avoid CORS policy errors on image loading,
                     * a cross origina can be defined preventing also
                     * tainted canvas problems
                     */
                    if (this.crossOrigin) {
                        imageState.instance.crossOrigin = this.crossOrigin;
                    }

                    // Handle loaded image state
                    imageState.instance.addEventListener(
                        'load',
                        function() {
                            imageState.loaded = true;

                            this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                            this._redrawBaseImage();
                            this._redraw();
                        }.bind(this),
                        false
                    );

                    // Handle errors on load, like CORS policy or missing assets
                    // this prevents an error to be thrown at logger
                    imageState.instance.addEventListener(
                        'error',
                        function(e) {
                            e.preventDefault();
                        },
                        false
                    );

                    // Set source to trigger image loading
                    imageState.instance.src = imagePath;
                } else {
                    this._redraw();
                }
            },
            /**
             * Load masks from a xml file
             * @param xmlFile that represents the masks
             * @private
             */
            _loadMasks: function(masks) {
                //Validate masks file
                this._resetCanvas();
                this.drawStack[0][0] = masks[0].getAttribute('layer');
                this.strokeColors = [];
                this.strokeArray = [];
                this.addColor(masks[0].getAttribute('color'));
                for (var i = 1; i < masks.length; i++) {
                    this.addLayer();
                    this.drawStack[i][0] = masks[i].getAttribute('layer');
                    this.addColor(masks[i].getAttribute('color'));
                }
                this._redraw();
                this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                this._redrawBaseImage();
            },
            /**
             * Triggers the 'can undo' event
             * Provides a parameter for knowing the state (fill or empty) of the drawing stack
             * @fires module:Canvas#EVENT.CAN_UNDO
             * @private
             */
            _notifyCanUndo: function() {
                this.$emit(EVENT.CAN_UNDO, this.drawStack[this.state.activeLayer].length > 0);
            },
            /**
             * Handles drawing moving event
             * @param {Event} e
             * @private
             */
            _onDraw: function(e) {
                e.preventDefault();
                if (this.state.painting) {
                    // Capture mouse interaction
                    this._bufferPoint(e, true);
                    this._redraw();
                }
            },
            /**
             * Handles the draw ended or leaving canvas events
             * @param {Event} e
             * @private
             */
            _onDrawEnd: function(e) {
                e.preventDefault();
                if (this.state.painting) {
                    this.state.painting = false;
                    this.baseImageData = this._commitStroke(this.state.activeLayer);
                    this._notifyCanUndo();
                    this._clearBuffer();
                }
            },
            /**
             * Handles the starting draw event (mouse down or touch start)
             * @param  {Event} e
             * @private
             */
            _onDrawStart: function(e) {
                e.preventDefault();
                // Set the state
                this.state.painting = true;
                this._clearBuffer();
                // Record the initial point
                this._bufferPoint(e, false);
                this._redraw();
            },
            /**
             * Avoid canvas selection on mobile
             * @param  {Event} e
             * @return {boolean}
             * @private
             */
            _onSelectStart: function(e) {
                e.preventDefault();
                return false;
            },
            /**
             * Returns a color from COLORS, based on the current layer
             * @returns {*}
             * @private
             */
            _nextColor: function(currentLayer) {
                return Colors[currentLayer % Colors.length];
            },
            /**
             * Main painting cycle
             *
             *      -------
             *    ------- |  LAYERS
             *   ------ | |
             * ------ | |-- --> 1. Base image
             * |    | |-- ----> 2. Invisible outline image, if applies
             * |    |-- ------> 3. Strokes and drawings, if applies
             *
             * On each painting cycle, the following steps are done:
             * 1. Clear the whole canvas if the canvas has no outline image
             * 2. If the canvas has been manipulated, get the latest changes
             * 3. Set up the canvas for drawing operations
             * 4. Drawing operations are performed
             *
             * @private
             */
            _redraw: function() {
                // Skips the redraw task if the canvas has no outline image
                if (!this.hasOutlineImage) {
                    this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                    this._redrawBaseImage();
                    if (this.maskBorders !== null && (this.isBucket || this.isBackgroundBucket)) {
                        var self = this;
                        /* eslint-disable no-undef */
                        createImageBitmap(this.maskBorders).then(function(imgBitmap) {
                            var tempAlpha = self.drawContext.globalAlpha;
                            self.drawContext.globalAlpha = self.layoutOpacity;
                            self.drawContext.drawImage(imgBitmap, 0, 0);
                            self.drawContext.globalAlpha = tempAlpha;
                        });
                        /* eslint-enable no-undef */
                    }
                } else {
                    if (!this.state.painting) {
                        var layer = this.drawStack[this.state.activeLayer];
                        if (layer.length > 0) {
                            var src = layer[layer.length - 1];
                            if (this.baseImageData != src) {
                                this.baseImageData = src;
                            }
                        } else {
                            this.baseImageData = this.lastPoppedImage[this.state.activeLayer];
                        }
                        this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                        this._redrawBaseImage();
                    }
                    // Clear the canvas if a bucket tool is not selected
                    if (!(this.isBucket || this.isBackgroundBucket)) {
                        this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                        this._redrawBaseImage();
                    }

                    // Sets the fill style for rectangle and bucket based operations
                    this.drawContext.fillStyle = this.backgroundColor;
                    this.drawContext.imageSmoothingEnabled = false;
                    this.drawContext.lineCap = 'round';
                    this.drawContext.lineJoin = 'round';

                    // Saves the global composite operation,
                    var compositeOperation = this.drawContext.globalCompositeOperation;
                    // Performs the drawing
                    this._redrawStroke(
                        this.drawBuffer[this.state.activeLayer],
                        this.currentStrokeColor,
                        this.currentStrokeThickness
                    );
                    this.drawContext.globalCompositeOperation = compositeOperation;
                }
            },

            /**
             * Redraw base image
             * @private
             */
            _redrawBaseImage: function() {
                this._redrawImage(this.hasBaseImage, this.baseImageState);
            },
            /**
             * Redraw an image
             * @param {boolean}    hasImage   - image property checker
             * @param {ImageState} imageState - image loaded flag and instance
             * @private
             */
            _redrawImage: function(hasImage, imageState) {
                if (hasImage && imageState.loaded) {
                    this._resetShadow();

                    // Draw image
                    var img = imageState.instance;

                    // Centers the image horizontally
                    var canvas = this.drawContext.canvas;
                    var horizontalRatio = canvas.width / img.width;
                    var verticalRatio = canvas.height / img.height;
                    var ratio = Math.min(horizontalRatio, verticalRatio);
                    var centerShiftX = (canvas.width - img.width * ratio) / 2;
                    var centerShiftY = (canvas.height - img.height * ratio) / 2;

                    this.drawContext.drawImage(
                        img,
                        0,
                        0,
                        img.width,
                        img.height,
                        centerShiftX,
                        centerShiftY,
                        img.width * ratio,
                        img.height * ratio
                    );

                    if (!this.isTainted()) {
                        try {
                            // Do a hit to canvas data for detecting tainted images
                            this.drawContext.getImageData(0, 0, 1, 1);
                        } catch (e) {
                            // Do nothing, avoid log error
                            this._detectTainted(e);
                        }
                    }
                }
            },
            /**
             * Perform draw operation.
             * @param {Point[]} strokePoints    - points to be compose as a stroke
             * @param {string}  strokeColor     - stroke color
             * @param {Number}  strokeThickness - stroke thickness
             * @private
             */
            _redrawStroke: function(strokePoints, strokeColor, strokeThickness) {
                var operation = this.drawContext.globalCompositeOperation;
                // Eraser stroke is always transparent black color
                // Eraser thickness is stored as is, no need to verify it
                strokeColor = this.isEraser
                    ? DEFAULT.ERASER_COLOR
                    : this.strokeColors[this.state.activeLayer];
                if (this.isEraser) {
                    this.drawContext.globalAlpha = 1;
                }
                //Flag that indicates if a bucket tool is selected
                var isBucketTool = this.isBucket || this.isBackgroundBucket;
                strokeColor = this.isBackgroundBucket ? DEFAULT.BACKGROUND_COLOR : strokeColor;

                // Optimization: adding shadow is an expensive task
                if (this.smooth) {
                    this.drawContext.shadowBlur = 2;
                    this.drawContext.shadowColor = strokeColor;
                }
                // Setup stroke drawing conditions

                this.drawContext.strokeStyle = strokeColor;
                this.drawContext.fillStyle = strokeColor;
                this.drawContext.lineWidth = strokeThickness;

                // Optimization: compose the whole stroke in a single path, then paint it
                //  Perform drawing operation based on the selected tool
                if (isBucketTool && strokePoints.length > 0) {
                    var i = strokePoints.length - 1;
                    var stroke = strokePoints[i],
                        previousStroke = i !== 0 ? strokePoints[i - 1] : null;
                    Utilities.floodFill(
                        this.drawContext,
                        stroke.x,
                        stroke.y,
                        this.outlineImageData,
                        this.alpha * 255
                    );
                } else if (this.isRectangle && strokePoints.length > 0) {
                    var i = 0;
                    var stroke1 = strokePoints[i],
                        previousStroke = i !== 0 ? strokePoints[i - 1] : null;
                    var i = strokePoints.length - 1;
                    var stroke2 = strokePoints[i],
                        previousStroke = i !== 0 ? strokePoints[i - 1] : null;
                    this.drawContext.fillRect(
                        stroke1.x,
                        stroke1.y,
                        stroke2.x - stroke1.x,
                        stroke2.y - stroke1.y
                    );
                } else {
                    this.drawContext.beginPath();
                    for (var i = 0; i < strokePoints.length; i++) {
                        var stroke = strokePoints[i],
                            previousStroke = i !== 0 ? strokePoints[i - 1] : null;
                        if (stroke.drag && previousStroke) {
                            this.drawContext.moveTo(previousStroke.x, previousStroke.y);
                        } else {
                            this.drawContext.moveTo(stroke.x - 1, stroke.y);
                        }
                        this.drawContext.lineTo(stroke.x, stroke.y);
                    }
                    if (this.isEraser) {
                        this.drawContext.globalCompositeOperation = 'destination-out';
                    }
                    this.drawContext.closePath();
                    this.drawContext.stroke();
                }
                this.drawContext.globalCompositeOperation = operation;
                this._setAlpha();
            },
            /**
             * Reset the whole canvas, clearing all the layers and the undo buffer
             * @private
             */
            _resetCanvas: function() {
                // Reset the canvas to a default state and initializes a layer with the default values
                this.baseImageData = this.baseImage;
                this.activeStrokeColor = this.strokeColor;
                this.activeLayer = 0;
                this.state.activeLayer = this.activeLayer;
                this.drawStack = [[]];
                this.drawBuffer = [[]];
                this.strokeArray = [];
                this.strokeColors = [];
                this.lastPoppedImage = [''];
                this.addColor(this.currentStrokeColor);
                // sets the draw context for subsequent operations, such as load images or drawing strokes.
                this._setDrawContext();
                // Load external images into the draw context
                this._loadBaseImage();
                // Set the alpha level for the drawing operations
                this._setAlpha();
                // Run the initial draw flow
                this._notifyCanUndo();
                this._redraw();
            },
            /**
             * Reset image state
             * @param {object} imageState - reference to local image state
             */
            _resetImageState: function(imageState) {
                imageState.instance = null;
                imageState.loaded = false;
            },
            /**
             * Clear stroke shadow properties
             * @private
             */
            _resetShadow: function() {
                this.drawContext.shadowBlur = 0;
                this.drawContext.shadowColor = DEFAULT.LINE_COLOR;
            },
            /**
             * Sets the alpha level for the canvas context.
             * @private
             */
            _setAlpha: function() {
                this.drawContext.globalAlpha = this.alpha;
            },
            /**
             * Define drawing context
             * @private
             */
            _setDrawContext: function() {
                this.drawContext = this.$refs.canvas.getContext('2d');
            },
            /**
             * Transforms the canvas into an image with transparent background and solid color
             * @returns {ImageData}
             * @private
             */
            _smoothCanvas: function() {
                var image = this.drawContext.getImageData(0, 0, this.width, this.height);
                var data = image.data;
                for (var i = 3; i < data.length; i += 4) {
                    if (data[i - 3] === data[i - 2] && data[i - 2] === data[i - 1]) {
                        data[i] = 0;
                        data[i - 1] = 0;
                        data[i - 2] = 0;
                        data[i - 3] = 0;
                    } else {
                        data[i] = 255;

                        data[i - 1] = this.strokeArray[this.state.activeLayer][2];
                        data[i - 2] = this.strokeArray[this.state.activeLayer][1];
                        data[i - 3] = this.strokeArray[this.state.activeLayer][0];
                    }
                }
                image.data = data;
                return image;
            },
            /**
             * Clear the canvas, redraw the base image and update the undo flag
             * @private
             */
            _updateState: function() {
                //Canvas clear
                this.drawContext.clearRect(0, 0, this.drawWidth, this.drawHeight);
                //Redraw canvas
                this._redrawBaseImage();
                this._redraw();
                //Updates undo flag
                this._notifyCanUndo();
            },
            /**
             * Add a new layer or select an existing one
             * @private
             */
            _updateLayer: function() {
                while (this.drawStack.length < this.state.activeLayer + 1) {
                    this.addColor(this._nextColor(this.drawStack.length));
                    this.addLayer();
                    this.lastPoppedImage.push('');
                }

                this.activeStrokeColor = this.strokeColors[this.state.activeLayer];
            },
            /**
             * Updates the color array when a new layer is added or the user picks another color.
             * @private
             */
            _updateColorArray: function() {
                if (this.hasOutlineImage) {
                    var encodedColor = this.currentStrokeColor.match(/[a-f0-9]{2}/gi);
                    this.strokeArray[this.state.activeLayer] = encodedColor.map(function(v) {
                        return parseInt(v, 16);
                    });
                    this.strokeColors[this.state.activeLayer] = this.currentStrokeColor;

                    this._smoothCanvas();

                    var imagedata = this._smoothCanvas(),
                        canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 1;
                    canvas.width = imagedata.width;
                    canvas.height = imagedata.height;
                    ctx.putImageData(imagedata, 0, 0);

                    this.drawStack[this.state.activeLayer].pop();
                    this.drawStack[this.state.activeLayer].push(canvas.toDataURL());
                    this._redraw();
                }
            },
        },
        watch: {
            /**
             * On alpha changes, update the canvas
             */
            alpha: function() {
                this._setAlpha();
                this._updateState();
            },
            /**
             * Updates the canvas when a layer is selected
             */
            activeLayer: function() {
                this.state.activeLayer = this.activeLayer;
                this._updateLayer();
                this._updateState();
            },
            /**
             * Redraws the base image
             */
            baseImageData: function() {
                this._resetImageState(this.baseImageState);
                this._loadBaseImage();
            },
            /**
             * On draw stack clear, fire notify event
             * @fires module:Canvas#EVENT.CAN_UNDO
             */
            drawStack: function() {
                this._notifyCanUndo();
            },
            /**
             * On height changes, reset the whole canvas
             */
            height: function() {
                this._resetCanvas();
            },
            /**
             * On layout alpha changes, update the canvas
             */
            layoutOpacity: function() {
                this._updateState();
            },
            /**
             * On outline image changes, load image into canvas
             */
            outlineImageData: function() {
                this._resetImageState(this.outlineImageState);
                this._loadOutlineImage();
            },
            /**
             * On smooth prop changes, handle shadow and performance updates
             * @param  {boolean} enable
             */
            smooth: function(enable) {
                if (!enable) {
                    this._resetShadow();
                }
                this._redraw();
            },
            /**
             * On stroke color changes, update the color array
             */
            strokeColor: function() {
                this.activeStrokeColor = this.strokeColor;
                this._updateColorArray();
            },
            /**
             * On tool change, redraw the canvas
             */
            tool: function() {
                this._redraw();
            },
            /**
             * On width changes, reset the whole canvas
             */
            width: function() {
                this._resetCanvas();
            },
        },
    });

    /**
     * Component-exposed defaults
     * @type {Object}
     */
    Canvas.DEFAULT = DEFAULT;

    /**
     * Component-exposed events
     * @type {Object}
     */
    Canvas.EVENT = EVENT;

    /**
     * Component-exposed tools
     * @type {Object}
     */
    Canvas.TOOL = TOOL;

    return Canvas;
});
