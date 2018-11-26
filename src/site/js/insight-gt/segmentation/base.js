/**
 * Base class for over-segmentation algorithms.
 *
 * Copyright 2015  Kota Yamaguchi
 */
define(["segmentation/compat"],
function (compat) {
  
    function BaseSegmentation(imageData, options) {
    if (!(imageData instanceof ImageData))
      throw "Invalid ImageData";
    
    var context = document.createElement("canvas").getContext("2d");
    this.imageData = context.createImageData(imageData.width,  imageData.height);
    this.imageData.data.set(imageData.data);
    }


  BaseSegmentation.prototype.finer = function () {};

  BaseSegmentation.prototype.coarser = function () {};

  return BaseSegmentation;
});
