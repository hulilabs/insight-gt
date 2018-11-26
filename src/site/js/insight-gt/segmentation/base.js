/**
 * Base class for over-segmentation algorithms.
 *
 * Copyright 2015  Kota Yamaguchi
 */
define(function() {
    function BaseSegmentation(imageData) {
        var context = document.createElement('canvas').getContext('2d');
        this.imageData = context.createImageData(imageData.width, imageData.height);
        this.imageData.data.set(imageData.data);
    }

    BaseSegmentation.prototype.finer = function() {};

    BaseSegmentation.prototype.coarser = function() {};

    return BaseSegmentation;
});
