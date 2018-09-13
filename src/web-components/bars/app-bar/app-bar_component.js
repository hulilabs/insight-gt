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
 * @file AppBar component following material design, this is only a container, doesn't execute actions
 * @requires vue
 * @requires web-components/bars/app-bar/app-bar_template.html
 * @requires web-components/bars/app-bar/app-bar_styles.css
 * @module web-components/components/bars/app-bar/app-bar_component
 * @extends Vue
 * @fires module:AppBar#ON_CHANGE
 * @fires module:AppBar#action
 * @see {@link https://web-components.hulilabs.xyz/components/app-bar} for demos and documentation
 */
define([
    'vue',
    'text!web-components/bars/app-bar/app-bar_template.html',
    'css-loader!web-components/bars/app-bar/app-bar_styles.css'
],
function(
    Vue,
    Template
) {
    var AppBar = Vue.extend({
        name : 'AppBarComponent',
        template : Template,
        props : {
            /**
             * Set the state of the app bar, true to open, false to close,
             * this can be useful if you want to bind the state to the parent or vuex
             */
            active : {
                type : Boolean,
                required : false
            },
            /**
             * When set, adds modifier to remove shadow
             */
            noShadow : {
                type : Boolean,
                default : false
            },
            /**
             * Shows navigation when set
             */
            showNavigation : {
                type : Boolean,
                default : true
            },
            /**
             * Shows actions when set
             */
            showActions : {
                type : Boolean,
                default : true
            },
            /**
             * Title to show in the app bar
             */
            title : {
                type : String,
                default : null
            },
            /**
             * class to be assigned to the title DOM element
             */
            titleClass : {
                type : String,
                default : null
            },
            /**
             * Hint to be displayed next to main title
             */
            hintText : {
                type : String,
                default : null
            },
            /**
             * Class to add to hint text
             */
            hintClass : {
                type : String,
                default : null
            },
            /**
             * Determines if the app bar should have a more compact layout
             * that reduces the height of the app bar
             */
            compact : {
                type : Boolean,
                default : false
            }
        },
        computed : {
            /**
             * Object containing the class definition for the appbar component
             * @return {Object}
             */
            classObject : function() {
                return {
                    'is-active' : this.state.isActive,
                    'wc-AppBar--compact' : this.compact,
                    'wc-AppBar--noShadow' : this.noShadow
                };
            }
        },
        data : function() {
            return {
                state : {
                    // active when app bar is visible
                    isActive : false,
                    // active when the text in the title is overflowing
                    isTitleOverflowing : false
                }
            };
        },
        mounted : function() {
            this._setActive(this.active);
            this._setTitleOverflow();
        },
        methods : {
            /**
             * Activates or deactivates the component
             * @param {boolean} active - true to open, false to close it
             * @private
             */
            _setActive : function(active) {
                this.state.isActive = active;
            },
            /**
             * checks if the title text is overflowing, if it is, adds a class to the DOM element to activate the gradient
             * @private
             */
            _setTitleOverflow : function() {
                if (this.title && this.$refs.title) {
                    // waits until vue have updated the DOM
                    this.$nextTick(function() {
                        // another validation is required inside nextTick due to DOM changes
                        if (this.$refs.title) {
                            this.state.isTitleOverflowing = this.$refs.title.scrollWidth > this.$refs.title.offsetWidth;
                        }
                    }.bind(this));
                }
                this.state.isTitleOverflowing = false;
            }
        },
        watch : {
            /**
             * is updating the prop value to the state
             * @param {boolean} newValue: new value defined in the prop
             */
            active : function(newValue) {
                if (newValue != this.state.isActive) {
                    this._setActive(newValue);
                }
            },
            /**
             * watches the title to calculate if the text is overflowing
             */
            title : function() {
                this._setTitleOverflow();
            }
        }
    });

    return AppBar;
});
