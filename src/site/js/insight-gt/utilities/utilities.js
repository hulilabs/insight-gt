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
define(["./floodfill"],
function (Floodfill) {

    var floodfill = Floodfill;

    function fillFlood(canvasContext, x, y
    , outlineImageData, alpha){

        debugger;
        floodfill.fillContext(canvasContext, x,y,outlineImageData, alpha )

    }

  return {
    fillFlood : fillFlood
  };
});
