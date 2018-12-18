define(['./image/floodfill'], function(Floodfill) {
    function floodFill(canvasContext, x, y, outlineImageData, alpha) {
        Floodfill(canvasContext, x, y, outlineImageData, alpha);
    }

    return {
        floodFill,
    };
});
