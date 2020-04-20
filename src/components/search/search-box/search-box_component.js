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
 * @file SearchBox
 * @module web-components/search/search-box/search-box_component
 * @extends Vue
 * @fires module:SearchBox#ON_BLUR
 * @fires module:SearchBox#ON_CLOSE
 * @fires module:SearchBox#ON_FOCUS
 * @fires module:SearchBox#ON_OPEN
 * @fires module:SearchBox#ON_SEARCH
 * @fires module:SearchBox#ON_TOGGLE
 * @see {@link https://web-components.hulilabs.xyz/components/search} for demos and documentation.
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/icons/icon_component',
    'web-components/utils/animation',
    'web-components/utils/function',
    'text!web-components/search/search-box/search-box_template.html',
    'css-loader!web-components/search/search-box/search-box_styles.css'
],
function(
    Vue,
    IconButton,
    Icon,
    AnimationUtil,
    FunctionUtil,
    template
) {
    /**
     * List of search events.
     * @type {Object}
     */
    var EVENT = {
        ON_BLUR : 'searchbox-blur',
        ON_CLOSE : 'searchbox-close',
        ON_FOCUS : 'searchbox-focus',
        ON_OPEN : 'searchbox-open',
        ON_SEARCH : 'searchbox-search',
        ON_TOGGLE : 'searchbox-toggle'
    };

    /**
     * Time to wait for changes in the data prop.
     * @type {number}
     */
    var SEARCH_TIMEOUT = 300;

    var SearchBox = Vue.extend({
        template : template,
        props : {
            /**
             * Determines whether or not the search box must always be active and expanded
             */
            active : {
                type : Boolean,
                default : false
            },
            /**
             * Makes the search box grow/hide using an animation
             * By default, the box will only toggle between collapse/expanded states
             */
            animate : {
                type : Boolean,
                default : false
            },
            /**
             * Adds a delay in order to fire the search event
             */
            delay : {
                type : [Number],
                default : SEARCH_TIMEOUT
            },
            /**
             * Shows an outline on the input
             */
            outline : {
                type : Boolean,
                default : false
            },
            /**
             * The placeholder to be displayed when there is no input text.
             */
            placeholder : {
                type : String,
                required : false,
                default : null
            },
            /**
             * Text to load if it is needed
             */
            text : {
                type : String,
                default : null
            }
        },
        data : function() {
            return {
                state : {
                    // delay input value updates
                    debounce : null,
                    // control if the box is expanded
                    // MUST be changed only when animation starts or ends
                    expanded : this.active,
                    // control if the input is focused
                    // its the only way to force a box-grow
                    focused : false,
                    // local model
                    // MUST be in sync with text prop
                    input : this.text
                }
            };
        },
        computed : {
            /**
             * Trigger the hide animation (collapse)
             * @return {boolean}
             */
            displayHideAnimation : function() {
                return this.animate && !this.active && !this.hasInput && !this.state.focused && this.state.expanded;
            },
            /**
             * Returns true when the input must be displayed
             * @return {boolean}
             */
            showInput : function() {
                return this.active || this.state.focused || (this.animate && this.state.expanded) || this.hasInput;
            },
            /**
             * Returns whether the placeholder should be displayed.
             * @return {boolean}
             */
            showPlaceholder : function() {
                return this.placeholder && !this.hasInput && this.state.expanded && !this.displayHideAnimation;
            },
            /**
             * Returns whether there is valid input in the search input
             * @return {boolean}
             */
            hasInput : function() {
                return !!this.state.input;
            }
        },
        mounted : function() {
            this._addAnimationListener();
        },
        methods : {
            /**
             * Adds a listener for the animation end event
             * @private
             */
            _addAnimationListener : function() {
                this.$el.addEventListener(
                    AnimationUtil.getAnimationEndProperty(),
                    this._onAnimationEnd.bind(this)
                );
            },
            /**
             * Forces input focus
             * @fires module:SearchBox#ON_TOGGLE
             * @private
             */
            _focusInput : function() {
                this.$refs.input.focus();
                this._setExpanded(true);
            },
            /**
             * Checks if the search box is displayed expanded
             * @return {boolean}
             * @public
             */
            isExpanded : function() {
                return this.state.expanded;
            },
            /**
             * Focuses the text input once the placeholder has finished showing up.
             * @fires module:SearchBox#ON_CLOSE
             * @fires module:SearchBox#ON_TOGGLE
             * @private
             */
            _onAnimationEnd : function(event) {
                if (event.animationName === 'growSearchBox') {
                    this._focusInput();
                } else if (event.animationName === 'hideSearchBox') {
                    this._setExpanded(this.active);
                }
            },
            /**
             * Handles clicking the search icon.
             * @fires module:SearchBox#ON_FOCUS
             * @fires module:SearchBox#ON_OPEN
             * @fires module:SearchBox#ON_TOGGLE
             * @private
             */
            _onActionClick : function() {
                // Force the focused state to trigger the grow animation
                this._setFocused(true);
                // Notify the animation
                if (!this.isExpanded()) {
                    this.$emit(EVENT.ON_OPEN);
                    this.$emit(EVENT.ON_TOGGLE, true);
                }
                // If the animation is disabled, then focus immediately
                this.$nextTick(function() {
                    if (!this.animate) {
                        this._focusInput();
                    }
                }.bind(this));
            },
            /**
             * Handles when the text input loses focus.
             * @param {Event} e
             * @fires module:SearchBox#ON_BLUR
             * @fires module:SearchBox#ON_CLOSE
             * @fires module:SearchBox#ON_TOGGLE
             * @private
             */
            _onBlur : function(e) {
                // Avoid action icon clicks
                if (e && e.relatedTarget === this.$refs.actionIcon.$el) {
                    // Reset the focus on the input
                    this._focusInput();
                    return;
                }
                // Must unfocus first to hide the inpit
                this._setFocused(false);
                // then signal it to collapse
                this._setExpanded(this.showInput);
            },
            /**
             * Debounces the execution of the input handler while the user is typing
             * The `state.input` is still updated by the v-model
             * @param  {Event} event
             * @private
             */
            _onInputDebounce : function(event) {
                if (!this.state.debounce) {
                    this.state.debounce = FunctionUtil.debounce(this._onInputHandler, this.delay);
                }
                this.state.debounce(event);
            },
            /**
             * Handler for the input event of the text field component.
             * Triggers the search event.
             * @param  {Event} event
             * @fires module:SearchBox#ON_SEARCH
             * @private
             */
            _onInputHandler : function(event) {
                var value = event.target.value ? event.target.value.trim() : '';
                if (value.length === 0) {
                    value = null;
                }
                this._setValue(value);
            },
            /**
             * Handles when the user clicks on the close/remove button
             * @fires module:SearchBox#ON_SEARCH
             * @private
             */
            _onRemoveClick : function() {
                this._setValue(null);
                this._focusInput();
            },
            /**
             * Handles when the input is completely expanded
             * MUST be changed only when animation starts or ends
             * @param {boolean} expanded
             * @fires module:SearchBox#ON_CLOSE
             * @fires module:SearchBox#ON_TOGGLE
             * @private
             */
            _setExpanded : function(expanded) {
                this.state.expanded = expanded;
                if (!expanded) {
                    this.$emit(EVENT.ON_CLOSE);
                    this.$emit(EVENT.ON_TOGGLE, false);
                }
            },
            /**
             * Handles when the text input gains focus
             * its the only way to force a box-grow
             * @param {boolean} focused
             * @fires module:SearchBox#ON_BLUR
             * @fires module:SearchBox#ON_FOCUS
             * @private
             */
            _setFocused : function(focused) {
                this.state.focused = focused;
                if (focused) {
                    this.$refs.actionIcon.$el.blur();
                    this.$emit(EVENT.ON_FOCUS);
                } else {
                    this.$emit(EVENT.ON_BLUR);
                }
            },
            /**
             * Sets the input value
             * @param {string?} value
             * @fires module:SearchBox#ON_SEARCH
             * @private
             */
            _setValue : function(value) {
                this.state.input = value;
                // Notify the parent about the value changes
                this.$emit(EVENT.ON_SEARCH, this.state.input);
            }
        },
        watch : {
            /**
             * Watches changes on the active property for properly focusing the search box
             * @param  {boolean} value
             * @fires module:SearchBox#ON_BLUR
             * @fires module:SearchBox#ON_CLOSE
             * @fires module:SearchBox#ON_FOCUS
             * @fires module:SearchBox#ON_TOGGLE
             */
            active : function(isActive) {
                this._setFocused(isActive);
                if (!isActive) {
                    this._setExpanded(this.active);
                } else if (!this.isExpanded()) {
                    this._setExpanded(true);
                }
            },
            /**
             * Watches changes on the text property for synching the input value
             * @param  {string?} value
             * @fires module:SearchBox#ON_CLOSE
             * @fires module:SearchBox#ON_TOGGLE
             */
            text : function(value) {
                this._setValue(value);
                // After setting the value, lets check the visual status
                this._setExpanded(this.showInput);
            }
        },
        components : {
            'wc-icon' : Icon,
            'wc-icon-button' : IconButton
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    SearchBox.EVENT = EVENT;

    return SearchBox;
});
