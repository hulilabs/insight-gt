# `<wc-canvas>` documentation

The canvas component allows illustration like input. It can be used for diagrams, signatures, etc.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | --- | --- | ---
| `background-color` | String | true | white | main background
| `base-image` | String | false | empty string | background image, used for loading initial image state
| `cross-origin` | String | false | null | Define a cross origin for images loading. Values: anonymous, use-credentials
| `height` | Number | true | 0 | canvas height dimension
| `outline-image` | String | true | empty string | overlay image
| `smooth` | String | true | false | improves trace smoothness by adding a shadow to the stroke
| `stroke-color` | String | true | black | stroke color, any web color naming like 'red' or '#F00'
| `stroke-thickness` | String | true | 1 | stroke thickness
| `tool` | String | true | pen | currently in-use tool: pen or eraser
| `width` | Number | true | 0 | canvas width dimension

@see exported constants **DEFAULT**, **EVENT** and **TOOL** for setup options

### Methods

#### `areImagesReady() : Boolean`

Verify if the image assets are loaded

#### `clear()`

Clear all drawed strokes

#### `exportBlob(String type) : Promise(Blob)`

Export canvas as Blob (binary)
Supports `type := png | jpeg | gif` (BMP not supported)

#### `exportFile(String type, String filename) : Promise(File)`

Export canvas as File Object
Supports `type := png | jpeg | gif` (BMP not supported)

#### `exportImage(String type) : Image`

Export canvas as image (DOM Object)
Supports `type := png | jpeg | gif` (BMP not supported)

#### `getChanges() : Array drawStack`

Retrieve ongoing changes (draw stack)

#### `hasChanges() : Boolean`

Detect if the canvas has work in progress changes

#### `isTainted() : Boolean`

Verify if the canvas was marked as tainted

#### `setChanges(Array drawStack)`

Set draw stack (changes)

#### `undo()`

Undo the last drawed stroke

### Events

#### `CAN_UNDO` : { Boolean isDrawingStackEmpty }

## Notes

- Based on several device testing, there is no need to add a **scroll blocking** feature. Initially it was added but it produces several calculation errors of the painting position mostly because the screen blocked remove several pixels from the screen.
- Using base or outline images outside the domain, can potentially trigger a **CORS policy** error which marks the canvas as **tainted** meaning it can't be exported.

## Implementation

* `<body>`, page wrapper and any other scrollable in-the-middle areas must have `position:relative`

## Examples

``` html
<wc-canvas height="200px" tool="pen" width="350px"></wc-canvas>

<wc-canvas
    height="200px"
    outline-image="/site/img/odontograma-outline-image.svg"
    tool="eraser"
    width="350px">
</wc-canvas>
```

## References

### Examples in other libraries

* http://caniuse.com/#feat=canvas
* https://github.com/hongru/canvas2image
* http://eloquentjavascript.net/16_canvas.html
* https://www.html5rocks.com/en/tutorials/canvas/performance/
* http://perfectionkills.com/exploring-canvas-drawing-techniques/
* http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
* http://perfectionkills.com/exploring-canvas-drawing-techniques/
* http://codepen.io/getflourish/pen/EyqxYE
* https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
* https://www.paciellogroup.com/blog/2012/06/html5-canvas-accessibility-in-firefox-13/

### Issues history


