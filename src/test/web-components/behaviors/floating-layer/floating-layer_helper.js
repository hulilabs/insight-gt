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
 * @file Library of test helpers for floating layer behavior
 * @module web-components/behaviors/floating-layer/floating-layer_helper
 */
define([], function() {

    var FloatingLayerHelper = {
        /**
         * Default floating layer props
         */
        props : {
            floatingConnector : false,
            floatingDirection : null,
            floatingOffset : 0,
            floatingOrigin : null,
            floatingSmart : false,
            triggerEvent : 'none',
            triggerOrigin : null
        },
        /**
         * Merge default props into a props definition for validation
         * @param  {Object} props
         * @return {Object}
         */
        mergeDefaultProps : function(props) {
            for (var p in this.props) {
                if (!props[p]) {
                    props[p] = this.props[p];
                }
            }
            return props;
        }
    };

    return FloatingLayerHelper;
});
