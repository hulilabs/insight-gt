
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
 * @requires web-components/canvas/canvas_template.html
 * @requires web-components/canvas/canvas_styles.css
 * @module web-components/canvas/canvas_component
 * @extends Vue
 * @fires module:Canvas#EVENT.CAN_UNDO
 * @see {@link https://www.html5rocks.com/en/tutorials/canvas/performance/} for canvas performance optimizations
 * @see {@link http://perfectionkills.com/exploring-canvas-drawing-techniques/} for mindblowing drawing techniques
 * @see {@link http://eloquentjavascript.net/16_canvas.html} canvas for gaming
 * @see {@link https://web-components.hulilabs.xyz/components/canvas} for demos and documentation
 */
define([
    'vue',
    'web-components/utils/dom',
    'text!web-components/canvas/canvas_template.html',
    'css-loader!web-components/canvas/canvas_styles.css'
],
function(
    Vue,
    DOMUtil,
    Template
) {

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
     * Canvas drawing default values
     * @type {Object}
     */
    var DEFAULT = {
        BACKGROUND_COLOR : '#FFFFFF',
        LINE_COLOR : '#000000'
    };

    /**
     * List of events
     * @type {Object}
     */
    var EVENT = {
        CAN_UNDO : 'can-undo'
    };

    /**
     * List of tracing tools
     * @type {Object}
     */
    var TOOL = {
        PEN : 'pen',
        ERASER : 'eraser'
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
        name : 'CanvasComponent',
        template : Template,
        props : {
            /**
             * Canvas main background color
             * Also used for simulating erasing behavior
             */
            backgroundColor : {
                type : String,
                default : DEFAULT.BACKGROUND_COLOR
            },
            /**
             * Background image
             * Used for loading initial image state
             */
            baseImage : {
                type : String,
                default : ''
            },
            /**
             * Define a cross origin for images loading
             * Values: anonymous, use-credentials
             * @see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes
             */
            crossOrigin : {
                type : String,
                default : null,
                required : false
            },
            /**
             * Eraser thickness
             */
            eraserThickness : {
                type : [Number, String],
                default : 1
            },
            /**
             * Canvas height dimension
             */
            height : {
                type : [Number, String],
                default : 0
            },
            /**
             * Overlay image
             * As an outline, it acts as a painting guide
             */
            outlineImage : {
                type : String,
                default : ''
            },
            /**
             * Improves trace smoothness by adding a shadow to the stroke
             * This is a heavy task, so the performance may be impacted on continuous drawing
             */
            smooth : {
                type : Boolean,
                default : false
            },
            /**
             * Stroke color
             * Accepts any web color naming like 'red' or '#F00'
             */
            strokeColor : {
                type : String,
                default : DEFAULT.LINE_COLOR
            },
            /**
             * Stroke thickness
             */
            strokeThickness : {
                type : [Number, String],
                default : 1
            },
            /**
             * Currently in-use tool
             * @see Canvas.TOOL
             */
            tool : {
                type : String,
                default : TOOL.PEN,
                validator : function(value) {
                    return TOOL.hasOwnProperty(value.toUpperCase());
                }
            },
            /**
             * Canvas width dimension
             */
            width : {
                type : [Number, String],
                default : 0
            }
        },
        data : function() {
            return {
                /**
                 * Stores drawing in-progress points
                 * @type {Array}
                 */
                drawBuffer : [],
                /**
                 * Canvas 2D context
                 */
                drawContext : null,
                /**
                 * Stores all drawed/commited points
                 * @type {Array}
                 */
                drawStack : [],
                /**
                 * base image state
                 * @see {ImageState}
                 */
                baseImageState : {
                    loaded : false,
                    instance : null
                },
                /**
                 * outline image state
                 * @see {ImageState}
                 */
                outlineImageState : {
                    loaded : false,
                    instance : null
                },
                /**
                 * canvas state
                 */
                state : {
                    lastBufferedPoint : null,
                    painting : false,
                    tainted : false
                }
            };
        },
        computed : {
            /**
             * Get current stroke color based on selected tool
             * @return {string}
             */
            currentStrokeColor : function() {
                return this._getColorByTool(this.tool);
            },
            /**
             * Get current stroke thickness based on selected tool
             * @return {string}
             */
            currentStrokeThickness : function() {
                return this._getThicknessByTool(this.tool);
            },
            /**
             * Get draw area height
             * @return {number} pixels
             */
            drawHeight : function() {
                return this.$refs.canvas.height;
            },
            /**
             * Get draw area width
             * @return {number} pixels
             */
            drawWidth : function() {
                return this.$refs.canvas.width;
            },
            /**
             * Detect if base image was provided
             * @return {boolean}
             */
            hasBaseImage : function() {
                return this.baseImage !== '';
            },
            /**
             * Detect if outline image was provided
             * @return {boolean}
             */
            hasOutlineImage : function() {
                return this.outlineImage !== '';
            }
        },
        mounted : function() {
            // Draw context must be initialized before any other setup
            this._setDrawContext();

            // Load external images
            this._loadBaseImage();
            this._loadOutlineImage();

            // Run the initial draw flow
            this._redraw();
        },
        methods : {
            /**
             * Verify if the image assets are loaded
             * @return {boolean}
             */
            areImagesReady : function() {
                return (!this.hasBaseImage || (this.hasBaseImage && this.baseImageState.loaded)) &&
                       (!this.hasOutlineImage || (this.hasOutlineImage && this.outlineImageState.loaded));
            },
            /**
             * Clear all drawed strokes
             * @note this basically flush the stack and buffer and then redraw
             */
            clear : function() {
                this.drawStack = [];
                this._clearBuffer();
                this._redraw();
            },
            /**
             * Export canvas as blob (raw) data
             * @see https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
             * @see https://github.com/eligrey/canvas-toBlob.js
             * @param  {string} type
             * @return {Promise} - resolves Blob as first argument
             */
            exportBlob : function(type) {
                var mime = 'image/' + type,
                    canvas = this.$refs.canvas;

                return new Promise(function(resolve, reject) {
                    if (this.isTainted()) {
                        // exit and reject
                        return reject();
                    }

                    // Quickiest method (not supported by most browsers)
                    if (canvas.toBlob) {
                        canvas.toBlob(function(blob) {
                            resolve(blob);
                        }, mime, EXPORT_QUALITY);
                    } else {
                        // Fallback way to transform dataUrl into a Blob
                        var data = canvas.toDataURL(mime).split(','),
                            binary;

                        // convert base64/URLEncoded data component to raw binary data held in a string
                        if (data[0].indexOf('base64') >= 0) {
                            binary = atob(data[1]);
                        } else {
                            binary = unescape(data[1]); // decodeURI
                        }

                        // write the bytes of the string to a typed array
                        var content = [];
                        for (var i = 0; i < binary.length; i++) {
                            content[i] = binary.charCodeAt(i);
                        }

                        var arrayBuffer = new Uint8Array(content),
                            blob = new Blob([arrayBuffer.buffer], { type : mime });

                        resolve(blob);
                    }
                }.bind(this));
            },
            /**
             * Export canvas as File object
             * @note avoid File object due to bad Safari support
             * @param  {string} type
             * @param  {string} filename
             * @return {Promise} - resolves File as first argument
             */
            exportFile : function(type, filename) {
                return this.exportBlob(type).then(function(blob) {
                    return new File([blob], filename, { type : blob.type });
                });
            },
            /**
             * Export canvas as image
             * @notes
             * - Supports png|jpeg|gif
             * - BMP not supported
             * @see {@link http://caniuse.com/#feat=canvas} for browsers exporting support
             * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image} for tainted canvas
             * @see {@link https://github.com/hongru/canvas2image/blob/master/canvas2image.js} for exporting mechanics
             * @param  {string} type
             * @return {Image}
             */
            exportImage : function(type) {
                var image = new Image();

                if (!this.isTainted()) {
                    try {
                        image.src = this.$refs.canvas.toDataURL('image/' + type);
                    } catch (e) {
                        // Do nothing, avoid log error
                        this._detectTainted(e);
                    }
                }

                return image;
            },
            /**
             * Detect if the canvas has work in progress changes
             * @return {Array}
             */
            getChanges : function() {
                return this.drawStack;
            },
            /**
             * Detect if the canvas has changes
             * @return {boolean}
             */
            hasChanges : function() {
                return this.drawStack.length > 0;
            },
            /**
             * Verify if the canvas was marked as tainted
             * @return {boolean}
             */
            isTainted : function() {
                return this.state.tainted;
            },
            /**
             * Set draw stack
             * @param {Array} drawStack
             */
            setChanges : function(drawStack) {
                this.drawStack = drawStack;
                this._clearBuffer();
                this._redraw();
            },
            /**
             * Undo the last drawed stroke
             * @note remove the last commited stroke from the stack and then redraw
             */
            undo : function() {
                this.drawStack.pop();
                this._redraw();
            },
            /**
             * Buffer one draw point
             * @param  {Event}   e    - trigger event
             * @param  {boolean} drag - is move event
             * @return {Point}        - the buffered point
             * @private
             */
            _bufferPoint : function(e, drag) {
                var positions = this._getPositions(e),
                    // @see {Point}
                    point = {
                        drag : drag,
                        x : positions.x,
                        y : positions.y
                    };

                this.state.lastBufferedPoint = point;
                this.drawBuffer.push(point);

                return point;
            },
            /**
             * Flush the buffered points
             * @private
             */
            _clearBuffer : function() {
                this.state.lastBufferedPoint = null;
                this.drawBuffer = [];
            },
            /**
             * Transform the drawing buffer (set of points) into a stroke
             * Each stroke is later used for redrawing the whole canvas
             * @private
             */
            _commitStroke : function() {
                if (this.drawBuffer.length > 0) {
                    // @see {Stroke}
                    var stroke = {
                        color : this.currentStrokeColor,
                        points : this.drawBuffer,
                        tool : this.tool,
                        thickness : this.currentStrokeThickness
                    };
                    this.drawStack.push(stroke);
                }

                this._clearBuffer();
            },
            /**
             * Detect tainted canvas state
             * @param  {Error} e - SecurityError
             */
            _detectTainted : function(e) {
                if (e.code === ERROR_CODE_CANVAS_TAINTED) {
                    this.state.tainted = true;
                }
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
            _getColorByTool : function(tool) {
                return this._isEraser(tool) ? this.backgroundColor : this.strokeColor;
            },
            /**
             * Get the current thickness for the chosen tool
             *
             * @param  {string} tool - @see module:CANVAS#TOOL
             * @return {number}
             * @private
             */
            _getThicknessByTool : function(tool) {
                return this._isEraser(tool) ? this.eraserThickness : this.strokeThickness;
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
            _getPositions : function(e) {
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
                var scrollLeft = this._isInsideSeveralScrollableArea(DOMUtil.hasHorizontalScroll) ?
                                    DOMUtil.getScrollOffsetLeft(element) : 0,
                    scrollTop = this._isInsideSeveralScrollableArea(DOMUtil.hasVerticalScroll) ?
                                    DOMUtil.getScrollOffsetTop(element) : 0,
                    x = positionSource.pageX - offsetLeft + scrollLeft,
                    y = positionSource.pageY - offsetTop + scrollTop;

                // @see {Coordinate}
                return { x : x, y : y };
            },
            /**
             * Detect if tool is the eraser
             * @param  {string}  tool
             * @return {boolean}
             * @private
             */
            _isEraser : function(tool) {
                return tool === TOOL.ERASER;
            },
            /**
             * Detect if the canvas has any in-the-middle scrollable areas
             * like when several position:relative with overflow:scroll divs are nested
             * @param  {Function} scrollDetector - function to detect by recursion if an element has scroll
             * @return {boolean}
             * @private
             */
            _isInsideSeveralScrollableArea : function(scrollDetector) {
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
            _loadBaseImage : function() {
                this._loadImage(this.baseImage, this.hasBaseImage, this.baseImageState);
            },
            /**
             * Abstract method for loading an in-memory image to be draw inside the canvas
             * @param  {string}     imagePath  - url
             * @param  {boolean}    hasImage   - image property checker
             * @param  {ImageState} imageState - image loaded flag and instance
             * @private
             */
            _loadImage : function(imagePath, hasImage, imageState) {
                if (hasImage && !imageState.loaded && !imageState.instance) {
                    // Create an in-memory image DOM object
                    imageState.instance = new Image();

                    /**
                     * To avoid CORS policy errors on image loading,
                     * a cross origina can be defined preventing also
                     * tainted canvas problems
                     */
                    if (this.crossOrigin) {
                        imageState.instance.crossOrigin = this.crossOrigin;
                    }

                    // Handle loaded image state
                    imageState.instance.addEventListener('load', function() {
                        imageState.loaded = true;
                        this._redraw();
                    }.bind(this), false);

                    // Handle errors on load, like CORS policy or missing assets
                    // this prevents an error to be thrown at logger
                    imageState.instance.addEventListener('error', function(e) {
                        e.preventDefault();
                    }, false);

                    // Set source to trigger image loading
                    imageState.instance.src = imagePath;
                } else {
                    this._redraw();
                }
            },
            /**
             * Load outline image
             * @private
             */
            _loadOutlineImage : function() {
                this._loadImage(this.outlineImage, this.hasOutlineImage, this.outlineImageState);
            },
            /**
             * Triggers the 'can undo' event
             * Provides a parameter for knowing the state (fill or empty) of the drawing stack
             * @fires module:Canvas#EVENT.CAN_UNDO
             * @private
             */
            _notifyCanUndo : function() {
                this.$emit(EVENT.CAN_UNDO, (this.drawStack.length > 0));
            },
            /**
             * Handles drawing moving event
             * @param {Event} e
             * @private
             */
            _onDraw : function(e) {
                e.preventDefault();
                if (this.state.painting) {
                    this._bufferPoint(e, true);
                    this._redraw();
                }
            },
            /**
             * Handles the draw ended or leaving canvas events
             * @param {Event} e
             * @private
             */
            _onDrawEnd : function(e) {
                e.preventDefault();
                this.state.painting = false;
                this._commitStroke();
                this._redraw();
            },
            /**
             * Handles the starting draw event (mouse down or touch start)
             * @param  {Event} e
             * @private
             */
            _onDrawStart : function(e) {
                e.preventDefault();

                // Set the state
                this._clearBuffer();
                this.state.painting = true;

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
            _onSelectStart : function(e) {
                e.preventDefault();
                return false;
            },
            /**
             * Main painting cycle
             *
             *      -------
             *    ------- |  LAYERS
             *   ------ | |
             * ------ | |-- --> 1. base image
             * |    | |-- ----> 2. stack of commited strokes
             * |    |-- ------> 3. buffer of points, in progress stroke,
             * ------ --------> 4. outline image
             *
             * On each painting cycle, the following steps are done:
             * 1. Clear the whole canvas using the background color property
             * 2. Paint the base image (aka. background image)               --> Layer 1
             * 3. Over it, draw all commited strokes (aka. saved strokes)    --> Layer 2
             * 4. Over it , draw the buffer of points (aka. work in progess) --> Layer 3
             * 5. Above all, draw the outline image (aka. painting guide)    --> Layer 4
             *
             * @private
             */
            _redraw : function() {
                this._resetShadow();

                // (1) Can't use clearRect due to the dynamic background color
                this.drawContext.fillStyle = this.backgroundColor;
                this.drawContext.fillRect(0, 0, this.drawWidth, this.drawHeight);

                // (2) Base image
                this._redrawBaseImage();

                // Optimization: smoothen the stroke corners
                this.drawContext.imageSmoothingEnabled = false;
                this.drawContext.lineCap = 'round';
                this.drawContext.lineJoin = 'round';

                // (3) Stack
                for (var i = 0; i < this.drawStack.length; i++) {
                    var stroke = this.drawStack[i];
                    this._redrawStroke(stroke.points, stroke.color, stroke.thickness, stroke.tool);
                }

                // (4) Buffer
                this._redrawStroke(this.drawBuffer, this.currentStrokeColor, this.currentStrokeThickness, this.tool);

                // (5) Outline image
                this._redrawOutlineImage();
            },
            /**
             * Redraw base image
             * @private
             */
            _redrawBaseImage : function() {
                this._redrawImage(this.hasBaseImage, this.baseImageState);
            },
            /**
             * Redraw an image
             * @param {boolean}    hasImage   - image property checker
             * @param {ImageState} imageState - image loaded flag and instance
             * @private
             */
            _redrawImage : function(hasImage, imageState) {
                if (hasImage && imageState.loaded) {
                    this._resetShadow();

                    // Draw image
                    this.drawContext.drawImage(imageState.instance, 0, 0);

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
             * Redraw outline image
             * @private
             */
            _redrawOutlineImage : function() {
                this._redrawImage(this.hasOutlineImage, this.outlineImageState);
            },
            /**
             * Redraw a single stroke
             * @param {Point[]} strokePoints    - points to be compose as a stroke
             * @param {string}  strokeColor     - stroke color
             * @param {Number}  strokeThickness - stroke thickness
             * @param {string}  strokeTool      - stroke tool
             * @private
             */
            _redrawStroke : function(strokePoints, strokeColor, strokeThickness, strokeTool) {
                // Eraser stroke is always the current background color
                // Eraser thickness is stored as is, no need to verify it
                strokeColor = this._isEraser(strokeTool) ? this.backgroundColor : strokeColor;

                // Optimization: adding shadow is an expensive task
                if (this.smooth) {
                    this.drawContext.shadowBlur = 2;
                    this.drawContext.shadowColor = strokeColor;
                }

                // Setup stroke drawing conditions
                this.drawContext.strokeStyle = strokeColor;
                this.drawContext.lineWidth = strokeThickness;

                // Optimization: compose the whole stroke in a single path, then paint it
                this.drawContext.beginPath();

                for (var i = 0; i < strokePoints.length; i++) {
                    var stroke = strokePoints[i],
                        previousStroke = (i !== 0) ? strokePoints[i - 1] : null;

                    if (stroke.drag && previousStroke) {
                        this.drawContext.moveTo(previousStroke.x, previousStroke.y);
                    } else {
                        this.drawContext.moveTo(stroke.x - 1, stroke.y);
                    }

                    this.drawContext.lineTo(stroke.x, stroke.y);
                }

                this.drawContext.closePath();
                this.drawContext.stroke();
            },
            /**
             * Reset image state
             * @param {object} imageState - reference to local image state
             */
            _resetImageState : function(imageState) {
                imageState.instance = null;
                imageState.loaded = false;
            },
            /**
             * Clear stroke shadow properties
             * @private
             */
            _resetShadow : function() {
                this.drawContext.shadowBlur = 0;
                this.drawContext.shadowColor = DEFAULT.LINE_COLOR;
            },
            /**
             * Define drawing context
             * @private
             */
            _setDrawContext : function() {
                this.drawContext = this.$refs.canvas.getContext('2d');
            }
        },
        watch : {
            /**
             * Watch background color prop changes for redrawing
             */
            backgroundColor : function() {
                this._redraw();
            },
            /**
             * On draw stack clear, fire notify event
             * @fires module:Canvas#EVENT.CAN_UNDO
             */
            drawStack : function() {
                this._notifyCanUndo();
            },
            /**
             * On base image prop changes, load it then redraw
             */
            baseImage : function() {
                this._resetImageState(this.baseImageState);
                this._loadBaseImage();
            },
            /**
             * On outline image prop changes, load it then redraw
             */
            outlineImage : function() {
                this._resetImageState(this.outlineImageState);
                this._loadOutlineImage();
            },
            /**
             * On smooth prop changes, handle shadow and performance updates
             * @param  {boolean} enable
             */
            smooth : function(enable) {
                if (!enable) {
                    this._resetShadow();
                }
                this._redraw();
            }
        }
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
