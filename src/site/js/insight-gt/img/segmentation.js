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
define([
    'img/superpixels/pff',
    'img/superpixels/slic',
    'img/superpixels/slico',
    'img/superpixels/watershed',
], function(pff, slic, slico, watershed) {
    var methods = {
        pff: pff,
        slic: slic,
        slico: slico,
        watershed: watershed,
    };

    methods.create = function(imageData, options) {
        options = options || {};
        options.method = options.method || 'slico';
        if (!methods[options.method]) {
            throw 'Invalid method: ' + options.method;
        }
        return new methods[options.method](imageData, options);
    };

    return methods;
});
