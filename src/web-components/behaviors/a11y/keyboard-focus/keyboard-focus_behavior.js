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
 * @file keyboard focus behavior - allows focus manipulation using keyboard keys
 * @requires web-components/utils/keyboard
 * @module web-components/behaviors/a11y/keyboard-focus/keyboard-focus_behavior
 */
define([
    'web-components/utils/keyboard'
],
function(
    KeyboardUtil
) {

    /**
     * Index offsets to move `focusableComponents` array pointer
     * @type {Object}
     */
    var DIRECTION = {
        // offset to go to down to last elements in the array
        DOWN : 1,
        RIGHT : 1,
        // offset to go up to the first element in the array
        UP : -1,
        LEFT : -1
    };

    // a focus index will be stored using this key, so we can detect focus originated
    // from external sources (like a click) to update this behavior's reference to currently
    // focused element
    var INDEX_ATTRIBUTE_NAME = 'data-focus-index';

    /**
     * Behavior constructor function
     * This behavior allows focus manipulation using keyboard keys,
     * mimics behavior achieved using TAB key
     */
    var KeyboardFocusBehavior = function() {
        // contains references to Vue components that can receive focus
        this.focusableComponents = [];
        // stores the index of the element that's currently focused
        this.currentIndex = 0;
    };

    KeyboardFocusBehavior.prototype = {
        /**
         * Main API method: applies behavior to a DOM element
         * @param  {Element} element to apply behavior to
         */
        bind : function(element) {
            element.addEventListener('focus', this.onFocus.bind(this), true);
            element.addEventListener('keydown', this._onKeyPress.bind(this), true);
        },

        /**
         * Returns the behavior to its initial state, removing the previously added
         * element's listeners
         * @param  {Element} element that the behavior was once added
         */
        unbind : function(element) {
            element.removeEventListener('focus', this.onFocus.bind(this), true);
            element.removeEventListener('keydown', this._onKeyPress.bind(this), true);
            this.focusableComponents = [];
            this.currentIndex = 0;
        },

        /**
         * Adds component reference to handle focus
         * @param {Vue} component
         */
        add : function(component) {
            var index = this.focusableComponents.indexOf(component);

            if (index === -1) {
                this.focusableComponents.push(component);
                index = (this.focusableComponents.length - 1);
            }

            // sets index so we can update the focus pointer whenever
            // an element is focused from an interaction external to this module
            var input = this._getFocusableElementFromComponent(component);
            input.setAttribute(INDEX_ATTRIBUTE_NAME, index);
        },

        /**
         * Moves focus to any enabled component that's down of the currently focused one
         */
        down : function() {
            this._move(DIRECTION.DOWN);
        },

        /**
         * Moves focus to any enabled component that's up of the currently focused one
         */
        up : function() {
            this._move(DIRECTION.UP);
        },

        /**
         * Moves focus to any enable component that's left to the currently focused one
         */
        left : function() {
            this._move(DIRECTION.LEFT);
        },

        /**
         * Moves focus to any enable component that's right to the currently focused one
         */
        right : function() {
            this._move(DIRECTION.RIGHT);
        },

        /**
         * Focus event delegate listener to update inner reference to focused element
         * when the focus is caused by an external source, like a click
         * @param  {Event} e
         */
        onFocus : function(e) {
            var targetFocusIndex = e.target.getAttribute(INDEX_ATTRIBUTE_NAME);

            if (targetFocusIndex) {
                // @todo should validate if on range? that scenario might happen on multiple behavior interaction
                // but that support isn't present/tested yet
                this.currentIndex = parseInt(targetFocusIndex);
            }
        },

        /**
         * Handles key press on bound element
         * - on UP_KEY press, moves focus up
         * - on DOWN_KEY press, moves focus down
         * - on RIGHT_KEY press, same as DOWN_KEY
         * - on LEFT_KEY press, same as UP_KEY
         * @param  {Event} e
         */
        _onKeyPress : function(e) {
            switch (e.which) {
                case KeyboardUtil.CODE.UP :
                    e.preventDefault();
                    return this.up();
                case KeyboardUtil.CODE.LEFT :
                    e.preventDefault();
                    return this.left();
                case KeyboardUtil.CODE.DOWN :
                    e.preventDefault();
                    return this.down();
                case KeyboardUtil.CODE.RIGHT :
                    e.preventDefault();
                    return this.right();
            }
        },

        /**
         * Moves focus to an enabled element that's immediatly up or down from the current
         * @param  {Number} directionOffset indicates direction, see `DIRECTION` object
         */
        _move : function(directionOffset) {
            var nextFocusableComponentIndex = this._getEnabledComponentIndexAhead(directionOffset, this.currentIndex);
            if (nextFocusableComponentIndex >= 0) {
                // updates reference with the element that's going to be focused
                this.currentIndex = nextFocusableComponentIndex;

                var componentToFocus = this.focusableComponents[this.currentIndex],
                    input = this._getFocusableElementFromComponent(componentToFocus);

                input.focus();
            }
        },

        /**
         * Iterates over `this.focusableComponents` in the direction indicated by `directionOffset`
         * until it finds a component that's not disabled
         * @param  {Number} directionOffset indicates direction, see `DIRECTION` object
         * @param  {Number} index           index to search from
         * @return {Number}                 index of enabled component or -1 if none was found
         */
        _getEnabledComponentIndexAhead : function(directionOffset, index) {
            // attempting to go past last or first, exit
            var currentIndex = index + directionOffset;
            if ((currentIndex >= (this.focusableComponents.length)) || (currentIndex < 0)) {
                return -1;
            }

            if (!this.focusableComponents[currentIndex].disabled) {
                // found component that can be focused
                return currentIndex;
            }

            // no results so far, recursively attempts search on next index
            return this._getEnabledComponentIndexAhead(directionOffset, currentIndex);
        },

        /**
         * Obtains an element to apply focus to, by:
         * - Attempting to use a component's `getInput` method that returns an element to add focus to
         * - The component's `$el` member
         * @param  {Vue} component    component to focus
         * @return {Element}          element to apply focus to
         */
        _getFocusableElementFromComponent : function(component) {
            if ('function' === typeof component.getInput) {
                return component.getInput();
            }

            return component.$el;
        }
    };

    return KeyboardFocusBehavior;
});
