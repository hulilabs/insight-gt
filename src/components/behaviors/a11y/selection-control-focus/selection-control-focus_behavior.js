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
 * @file selection control focus behavior - improved focus management for selection controls (checkbox, radios, switches)
 * @module web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior
 */
define([
],
function(
) {

    /**
     * This module will improve the focus management on selection controls (checkbox, radio, switch) in this way:
     *
     * + If you CHANGE the control state, the focus will dissaper
     *   - This is achieved by subscribing to the component's (not the input tag) CHANGE event
     *     i.e. is a requirement for the component to expose a CHANGE event
     * + If you FOCUS the control using he TAB button, it will display the focus state
     *
     * @param {Element} inputElement component's input tag
     * @param {Object} focusManagerElement exposes `show` and `hide` API methods to show/hide component's focus
     */
    var SelectionControlFocusBehavior = function(inputElement, focusManagerElement) {
        this.inputElement = inputElement;
        this.componentFocusManager = focusManagerElement;
    };

    SelectionControlFocusBehavior.prototype = {
        /**
         * Main API method, to apply focus behavior (described above) to an selection control
         * @param  {Vue} component    Vue component to apply behavior to
         * @param  {Object} settings
         * @param  {String} settings.changeEvent event triggered by the component when its value changes
         */
        bind : function(component, settings) {
            component.$on(settings.changeEvent, this._onChange.bind(null, this.componentFocusManager));
            this.inputElement.addEventListener('focus', this._onFocus.bind(null, this.componentFocusManager));
            this.inputElement.addEventListener('blur', this._onBlur.bind(null, this.componentFocusManager));
        },

        /**
         * Handles selection control value change
         * @param  {Object}   componentFocus
         * @param  {Function} componentFocus.hide hides the focus from the bound component
         */
        _onChange : function(componentFocus) {
            componentFocus.hide();
        },

        /**
         * Handles selection control focus event
         * @param  {Object}   componentFocus
         * @param  {Function} componentFocus.hide hides the focus from the bound component
         */
        _onFocus : function(componentFocus) {
            componentFocus.show();
        },

        /**
         * Handles selection control blur event
         * @param  {Object}   componentFocus
         * @param  {Function} componentFocus.hide hides the focus from the bound component
         */
        _onBlur : function(componentFocus) {
            componentFocus.hide();
        }
    };

    return SelectionControlFocusBehavior;
});
