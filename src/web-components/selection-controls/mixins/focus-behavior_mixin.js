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
 * @file Selection control mixin - abstracts shared focus behavior used in some
 * selection controls.
 * @requires web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior
 * @module web-components/selection-controls/mixins/focus-behavior_mixin
 * @fires module:<SelectionControlImplementation>#ON_INPUT
 */
define([
    'web-components/behaviors/a11y/selection-control-focus/selection-control-focus_behavior'
],
function(
    SelectionControlFocusBehavior
) {
    var focusBehaviorMixin = {
        mounted : function() {
            // binds smart focus behavior
            // this allows showing focus when using TAB button but not when directly
            // toggling the checkbox
            var focusBehavior = new SelectionControlFocusBehavior(this.$refs.input, this.$refs.ripple);
            focusBehavior.bind(this, {changeEvent : this.events.ON_INPUT});
        }
    };

    return focusBehaviorMixin;
});
