define(['utilities/image/floodfill'], function(Floodfill) {
    function floodFill(canvasContext, x, y, outlineImageData, alpha) {
        Floodfill(canvasContext, x, y, outlineImageData, alpha);
    }

    function floodFill(canvasContext, x, y, outlineImageData, alpha, pixelCount, imageData) {
        Floodfill(canvasContext, x, y, outlineImageData, alpha, pixelCount, imageData);
    }

    return {
        floodFill,
    };
});
