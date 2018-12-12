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
 * @file Floating layer connector element
 * @module web-components/behaviors/floating-layer/floating-layer_connector
 */
define([
    'web-components/helper/vue-refs-helper'
], function(
    VueRefsHelper
) {

    /**
     * Connector block class
     * @type {String}
     */
    var CONNECTOR_CLASS = 'is-floatingBlockConnector';

    /**
     * Floating layer connector handler
     *
     * @param {HTMLElement} floatingBlock floating element for positioning
     */
    var FloatingLayerConnector = function(floatingBlock) {
        // Disable by default
        this.enable = false;

        // Store floating element reference
        this.floatingBlock = floatingBlock;

        // Connector element
        this.element = null;
    };

    FloatingLayerConnector.prototype = {
        /**
         * Resolve floating layer block DOM element
         * @return {HTMLElement}
         * @private
         */
        _getFloatingBlock : function() {
            return VueRefsHelper.resolveVueRef(this.floatingBlock);
        },
        /**
         * Find connector DOM element
         * @return {HTMLElement}
         * @private
         */
        _find : function(floatingBlock) {
            if (this.enable && floatingBlock) {
                var connector = floatingBlock.getElementsByClassName(CONNECTOR_CLASS),
                    connector = connector.length > 0 ? connector[0] : null;
                if (connector) {
                    this.element = connector;
                }
            }
            return this.element;
        },
        /**
         * Add connector DOM element
         * @return {FloatingLayerConnector}
         * @public
         */
        add : function() {
            var floatingBlock = this._getFloatingBlock();
            if (this.enable && floatingBlock) {
                var connector = this._find(floatingBlock);
                if (!connector) {
                    connector = document.createElement('div');
                    floatingBlock.appendChild(connector);
                }
                this.element = connector;
            }
            return this;
        },
        /**
         * Place connector inside floating block at the matching point
         * @param  {Object} position - trigger : trigger dimensions
         *                           - floating : floating dimensions
         *                           - offset : provided by options
         * @return {FloatingLayerConnector}
         * @public
         */
        match : function(left, top, floatingOrigin) {
            var floatingBlock = this._getFloatingBlock();
            if (this.enable && floatingBlock) {
                // Find connector
                var connector = this._find(floatingBlock);

                // If connector is not found, then avoid matching
                if (!connector) { return; }

                // Set connector modifier
                connector.className = '';
                connector.classList.add(CONNECTOR_CLASS);

                // compose direction+origin class
                var modifier = [];
                if (this.direction) {
                    modifier.push('dir');
                    modifier.push(this.direction);
                } else {
                    modifier.push('pos');
                    modifier.push(floatingOrigin.y);
                    modifier.push(floatingOrigin.x);
                }
                connector.classList.add(CONNECTOR_CLASS + '--' + modifier.join('-'));

                // Set position styles
                connector.style.top = top + 'px';
                connector.style.left = left + 'px';
            }
            return this;
        },
        /**
         * Remove connector DOM element
         * @return {FloatingLayerConnector}
         * @public
         */
        remove : function() {
            var floatingBlock = this._getFloatingBlock();
            if (!this.enable && floatingBlock) {
                var connector = this._find(floatingBlock);
                if (connector) {
                    connector.remove();
                } else if (this.element) {
                    this.element.remove();
                }
                this.element = null;
            }
            return this;
        },
        /**
         * Sets connector direction
         * @param {String} direction
         * @return {FloatingLayerConnector}
         * @public
         */
        setDirection : function(direction) {
            this.direction = direction;
            return this;
        },
        /**
         * Toggle DOM element
         * @param  {Boolean} toggle
         * @return {FloatingLayerConnector}
         * @public
         */
        toggle : function(toggle) {
            this.enable = toggle;
            if (toggle) {
                this.add();
            } else {
                this.remove();
            }
            return this;
        }
    };

    return FloatingLayerConnector;
});
