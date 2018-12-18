/** Image segmentation factory.
 *
 *  var segm = segmentation.create(imageData);
 *  var segmentData = segm.result;  // imageData with numSegments.
 *
 *  segm.finer();
 *  segm.coarser();
 *
 * Copyright 2015  Kota Yamaguchi
 */
define(["./image/floodfill"],
function (Floodfill) {

    function floodFill(canvasContext, x, y
    , outlineImageData, alpha){
        Floodfill(canvasContext, x,y,outlineImageData, alpha )
    }
      
  return {
    floodFill
  }; 
});
