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
 * @file SearchBox component
 * @module web-components/search/search-box/search-box_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/search} for demos and documentation.
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/utils/animation',
    'web-components/utils/function',
    'text!web-components/search/search-box/search-box_template.html',
    'css-loader!web-components/search/search-box/search-box_styles.css'
],
function(
    Vue,
    Icon,
    IconButton,
    AnimationUtil,
    FunctionUtil,
    Template
) {
    /**
     * List of search events.
     * @type {Object}
     */
    var EVENT = {
        ON_SEARCH : 'searchbox-search',
        ON_CLOSE : 'searchbox-close'
    };

    /**
     * Time to wait for changes in the data prop.
     * @type {number}
     */
    var SEARCH_TIMEOUT = 300;

    var SearchBox = Vue.extend({
        template : Template,
        props : {
            /**
             * Determines whether or not the search box must always be active and open
             */
            active : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Optional class for the search dropdown
             */
            customClass : {
                type : [Array, Object, String],
                required : false,
                default : null
            },
            /**
             * Adds a delay in other to fire the search event
             */
            delay : {
                type : [Number],
                default : SEARCH_TIMEOUT
            },
            /**
             * The placeholder to be displayed when there is no input text.
             * @type {String}
             */
            placeholder : {
                type : String,
                required : false,
                default : null
            },

            /**
             * Text to load if it is needed
             * @type {String}
             */
            text : {
                type : String,
                default : null
            }
        },
        data : function() {
            return {
                state : {
                    displayHideAnimation : false,
                    placeholderReady : false,
                    focused : this.active || (this.text ? true : false),
                    input : this.text,
                    debounce : null
                }
            };
        },
        computed : {
            /**
             * Returns whether the placeholder should be displayed.
             * @return {Boolean}
             */
            showPlaceholder : function() {
                return this.placeholder && this.state.placeholderReady && !this.hasInput;
            },
            /**
             * Returns whether there is valid input in the search input
             * @return {Boolean}
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
             */
            _addAnimationListener : function() {
                this.$el.addEventListener(
                    AnimationUtil.getAnimationEndProperty(),
                    this._onAnimationEnd.bind(this)
                );
            },

            /**
             * Resets the state of the search box
             * @fires module:SearchBox#ON_CLOSE
             */
            _reset : function() {
                this.state.focused = this.active;
                this.state.placeholderReady = this.active;
                this.$emit(EVENT.ON_CLOSE);
            },

            /**
             * Focuses the text input once the placeholder has finished showing up.
             */
            _onAnimationEnd : function(event) {
                if (event.animationName === 'growSearchBox') {
                    this.$refs.input.focus();
                    this.state.placeholderReady = true;
                } else if (event.animationName === 'hideSearchBox') {
                    this._reset();
                    this.state.displayHideAnimation = false;
                }
            },

            /**
             * Handles clicking the search icon.
             */
            _onActionClick : function() {
                this.state.focused = true;
                this.$refs.actionIcon.$el.blur();
            },

            /**
             * Handles when the text input loses focus.
             */
            _onBlur : function() {
                if (!this.hasInput && !this.active) {
                    this.state.placeholderReady = false;
                    this.state.displayHideAnimation = true;
                }
            },

            /**
             * Debounces the execution of the input handler while the user is typing
             * @param  {Event} event
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
             */
            _onInputHandler : function(event) {
                var value = event.target.value ? event.target.value.trim() : '';
                if (value.length === 0) {
                    value = null;
                }

                this.state.input = value;
                this.$emit(EVENT.ON_SEARCH, this.state.input);
            },

            /**
             * Handles when the user clicks on the close/remove button
             * @fires module:SearchBox#ON_SEARCH
             */
            _onRemoveClick : function() {
                this.state.input = null;
                this.$refs.input.focus();
                this.$emit(EVENT.ON_SEARCH);
            }
        },
        watch : {
            /**
             * Watches changes on the active property for properly focusing the search box
             * @param  {boolean} value
             */
            active : function(value) {
                this.state.focused = value;
                if (!value) {
                    this._reset();
                }
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
