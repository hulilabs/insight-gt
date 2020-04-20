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
 * @file Dialog component following material design
 * @requires vue
 * @requires web-components/overlays/overlay_component
 * @requires web-components/dialogs/dialog/dialog_template.html
 * @requires web-components/dialogs/dialog/dialog_styles.css

 * @module web-components/components/dialogs/dialog/dialog_component
 * @extends Vue
 * @listens module:Overlay#ON_CHANGE
 * @fires module:Dialog#ON_CHANGE
 * @fires module:Dialog#action
 * @see {@link https://web-components.hulilabs.xyz/components/dialog} for demos and documentation
 */
define([
    'vue',
    'web-components/overlays/overlay_component',
    'text!web-components/dialogs/dialog/dialog_template.html',
    'css-loader!web-components/dialogs/dialog/dialog_styles.css'
],
function(
    Vue,
    Overlay,
    Template
) {
    // 24px of padding top
    var TOP_ELEMENTS_HEIGHT = 24;

    // 42px of title height
    var TITLE_HEIGHT = 42;

    var Dialog = Vue.extend({
        name : 'DialogComponent',
        template : Template,
        props : {
            /**
             * Set the state of the nav, true to open, false to close,
             * this can be useful if you want to bind the state of the nav to the parent or vuex
             */
            active : {
                type : Boolean,
                required : false
            },
            /**
             * action to be executed when the dialog changes its state
             */
            action : {
                type : String,
                required : false
            },
            /**
             * Set to true to allow the user to close the dialog by clicking in the overlay
             */
            closeOnClick : {
                type : Boolean,
                required : false,
                default : true
            },
            /**
             * Set to true to allow the user to close the dialog by pressing the ESC key
             */
            closeOnEscKey : {
                type : Boolean,
                required : false,
                default : true
            },
            /**
             * Title to show in the dialog
             */
            title : {
                type : String,
                required : false,
                default : null
            },
            /**
             * Object that overrides the styles in the component.
             * Possible keys:
             * - dialog : Rules apply to the dialog component, the window
             * - title : Rules apply to the prop title
             * - content : Rules apply to the slot content
             * - actions : Rules apply to the slot actions
             * @example :
             * {
                    dialog : {
                        width : '98%',
                        'max-width' : '98%'
                    },
                    title : {
                        color : 'red'
                    },
                    content : {
                        'font-size' : '10px'
                    },
                    actions : {
                        'background-color' : 'green'
                    }
                }
             */
            stylesObject : {
                type : Object,
                required : false,
                default : function() {
                    return {
                        dialog : {},
                        title : {},
                        content : {},
                        actions : {}
                    };
                }
            }
        },
        data : function() {
            return {
                state : {
                    // Dialog state
                    isActive : false,
                    // Flag to know if the dialog should show the scroll.
                    isScrollable : false,
                    // Used to determine if the height have been calculated
                    hasBeenInitialized : false
                },
                events : {
                    ON_CHANGE : 'change'
                },
                /**
                 * Styles bound to the elements of the component, there is not styles by default, but can be override
                 * by the stylesObject prop.
                 */
                styles : {
                    dialog : this.stylesObject.dialog,
                    title : this.stylesObject.title,
                    content : this.stylesObject.content,
                    actions : this.stylesObject.actions
                }
            };
        },
        mounted : function() {
            this._setActive(this.active, false);
        },
        methods : {
            /**
             * Open the dialog
             * @public
             */
            open : function() {
                this._setActive(true);
            },
            /**
             * Close the dialog
             * @public
             */
            close : function() {
                this._setActive(false);
            },
            /**
             * Controls dialog's inner scroll
             * @param  {number} scrollAmount
             */
            scrollTop : function(scrollAmount) {
                this.$refs.content.scrollTop = scrollAmount;
            },
            /**
             * Method used by parent components to recalculate the
             * height of the dialog, based on updated content after
             * the dialog has been initialized
             */
            recalculateHeight : function() {
                // Flush any previously set max height to
                // avoid wrong content height calculation
                this.$refs.content.style.maxHeight = '';

                Vue.nextTick(function() {
                    this._setHeight();
                }.bind(this));
            },
            /**
             * Activates or deactivates the dialog
             * @param {boolean} active - true to open the dialog, false to close it
             * @param {boolean} [triggerState] - set to false if you don't want to trigger the 'change' state event
             * @private
             */
            _setActive : function(active, triggerState) {
                if (active == null || this.state.isActive === active) {
                    return;
                }
                if (active) {
                    if (!this.state.hasBeenInitialized) {
                        this.state.hasBeenInitialized = true;
                        Vue.nextTick(function() {
                            this._setHeight();
                        }.bind(this));
                    }
                }
                this.state.isActive = active;
                if (triggerState !== false) {
                    this._triggerState();
                }
            },
            /**
             * Trigger the state of the component to the parent or execute an action(vuex)
             * @fires module:Dialog#ON_CHANGE
             * @fires module:Dialog#action
             * @private
             */
            _triggerState : function() {
                /**
                 * @typedef {Object} OnChangePayload
                 * @property {boolean} active - Indicates whether the drawer is active or not.
                 */
                var payload = {
                    active : this.state.isActive
                };
                if (this.action && this.$store) {
                    /**
                     * change action.
                     *
                     * @event module:Dialog#action
                     * @type {OnChangePayload}
                     */
                    this.$store.dispatch(this.action, payload);
                } else {
                    /**
                     * change event.
                     *
                     * @event module:Dialog#ON_CHANGE
                     * @type {OnChangePayload}
                     */
                    this.$emit(this.events.ON_CHANGE, payload);
                }
            },
            /**
             * Calculates the height of the dialog depending on the content, activates the scroll if necessary
             * @private
             */
            _setHeight : function() {
                var dialogHeight = this.$refs.dialog.offsetHeight,
                    contentHeight = this.$refs.content.offsetHeight,
                    elementsHeight = this.$refs.actions.offsetHeight;

                if (this.title !== null) {
                    elementsHeight += TITLE_HEIGHT + TOP_ELEMENTS_HEIGHT;
                }

                // show the scroll if the content is bigger and/or equal
                // (avoid minor content height difference) than the dialog
                this.state.isScrollable = (contentHeight > (dialogHeight - elementsHeight));

                if (this.state.isScrollable) {
                    this.$refs.content.style.maxHeight = dialogHeight - elementsHeight + 'px';
                } else {
                    this.$refs.content.style.maxHeight = 'calc(100% - ' + elementsHeight + 'px)';
                }
            },
            /**
             * if the overlay is closed by a click, change the state of the dialog
             * @listens module:Overlay#ON_CHANGE
             */
            _onOverlayClosed : function() {
                this._setActive(false);
            }
        },

        watch : {
            /**
             * is updating the prop value to the state
             * @param {boolean} newValue: new value defined in the prop
             */
            active : function(newValue) {
                if (newValue != this.state.isActive) {
                    this._setActive(newValue, false);
                }
            }
        },

        components : {
            'wc-overlay' : Overlay
        }
    });

    return Dialog;
});
