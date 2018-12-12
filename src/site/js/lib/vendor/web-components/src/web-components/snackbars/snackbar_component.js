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
 * @file Snackbar component
 * @requires vue
 * @requires web-components/buttons/flat/flat-button_component
 * @requires web-components/lists/list-item_component
 * @requires web-components/images/avatar/avatar_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/directives/gestures/gestures_directive
 * @requires web-components/utils/animation
 * @requires web-components/snackbars/snackbar_template.html
 * @requires web-components/components/snackbars/snackbar_styles.css
 * @module web-components/components/snackbars/snackbar_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/snackbar} for demos and documentation
 */
define([
    'vue',
    'web-components/buttons/flat/flat-button_component',
    'web-components/lists/list-item_component',
    'web-components/images/avatar/avatar_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/utils/animation',
    'text!web-components/snackbars/snackbar_template.html',
    'css-loader!web-components/snackbars/snackbar_styles.css'
],
function(
    Vue,
    FlatButton,
    ListItem,
    Avatar,
    IconButton,
    AnimationUtils,
    Template
) {

    var Snackbar = Vue.extend({
        name : 'SnackbarComponent',
        template : Template,
        props : {
            /**
             * Used mainly for testing purposes.
             * It states whether the snackbar should use the transitionEnd
             * properties to manage the events
             */
            useCSSTransitionProperties : {
                type : Boolean,
                default : true
            },
            /**
             * How long is the snackbar going to be visible
             */
            duration : {
                type : Number,
                default : 8000
            }
        },
        data : function() {
            return {
                state : {
                    /**
                     * This is the object used to render the current snackbar
                     */
                    currentItem : {
                        text : '',
                        // if want to use a list item
                        listItem : false,
                        // for list item layout
                        secondaryText : '',
                        // for list item layout
                        avatarPath : '',
                        action : {
                            text : '',
                            handler : function() {}
                        },
                        close : false,
                        showAtBottom : false,
                        duration : null
                    },

                    /**
                     * Whether or not the snackbar is currently being shown.
                     * Is used in the html to bind a class that triggers the CSS animations.
                     */
                    isActive : false,

                    /**
                     * This queue will contain elements in the same format as in the current item
                     */
                    queue : [],

                    /**
                     * Whether or not the snackbar is trying to show all the notifications
                     * in the queue.
                     */
                    isProcessing : false,

                    /**
                     * Reference to the current interval. When it times out the current
                     * notification is then hidden.
                     */
                    timeout : null,

                    /**
                     * Enables the functionality to use the mouseout and mouseover
                     */
                    mouseOutEnabled : true
                }
            };
        },
        mounted : function() {
            if (this.useCSSTransitionProperties) {
                this.$el.addEventListener(
                    AnimationUtils.getTransitionEndProperty(),
                    this._onNotificationTransitionEnded.bind(this));
            }
        },
        methods : {
            /**
             * Adds one element to the queue
             * @param {typeDef NotificationData} with the format of the current element
             */
            show : function(NotificationData) {
                this._addNotification(NotificationData);

                if (!this.state.isProcessing) {
                    this._emptyNotificationQueue();
                }
            },

            /**
             * Pauses the process that shows all the notifications in the queue
             */
            pause : function() {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
            },

            /**
             * Resumes the process to display the notifications in the queue
             */
            resume : function() {
                if (!this.timeout && this.state.isProcessing) {
                    this._showNotification();
                }
            },

            /**
             * Adds one element to the queue
             * @param {Object} with the format of the current element
             */
            _addNotification : function(data) {

                var isValid = this._isValidNotification(data);

                if (isValid) {
                    this.state.queue.push(data);
                }
            },

            /**
             * Validates that the data provided complies with the
             * structure and has every information required to succesfully
             * show a notification
             *
             * @param {object} data
             * @return {boolean}
             */
            _isValidNotification : function(data) {

                var isValid = true;

                if (!data.text) {
                    isValid = false;
                    throw new Error('No label text provided', data);
                }

                if (data.action && !data.action.text) {
                    isValid = false;
                    throw new Error('No action text provided', data);
                }

                if (data.action && !data.action.handler) {
                    isValid = false;
                    throw new Error('No action handler provided', data);
                }

                return isValid;
            },

            /**
             * Takes one element of the queue and shows it. When there
             * are no elements in the queue then it changes the
             * state.processing flag to false.
             */
            _emptyNotificationQueue : function() {
                if (this.state.queue.length > 0) {
                    this.state.isProcessing = true;
                    this.mouseOutEnabled = true;
                    this.state.currentItem = this.state.queue.shift();
                    this._showNotification();
                } else {
                    this.state.isProcessing = false;
                }
            },
            /**
             * Displays a new notification and starts a new timer.
             * The state.isActive property is binded to a class that triggers the animations
             */
            _showNotification : function() {
                this.state.isActive = true;
                var duration = this.state.currentItem.duration || this.duration;
                this.timeout = setTimeout(this._hideNotification, duration);
            },

            /**
             * Hides the current notification and restarts the process
             * The state.isActive property is binded to a class that triggers the animations
             */
            _hideNotification : function() {
                this.state.isActive = false;
                if (!this.useCSSTransitionProperties) {
                    this._onNotificationTransitionEnded();
                }
            },

            /**
             * Triggered when a notification transition ends
             */
            _onNotificationTransitionEnded : function() {
                // Resets the action of the snackbar so it can be clicked for other notifications
                if (this.state.currentItem.action) {
                    this.state.currentItem.action.clicked = false;
                }
                if (!this.state.isActive) {
                    this._emptyNotificationQueue();
                }
            },

            /**
             * Called when the custom action of the notifaction (if available) is called.
             * It uses an external function instead of a v-on:clicked directive because
             * we need to also hide the notification.
             */
            _onActionClicked : function() {
                this.mouseOutEnabled = false;
                // Blocks the execution of the snackbar action if it was already executed
                if (!this.state.currentItem.action.clicked) {
                    this.state.currentItem.action.clicked = true;
                    this.state.currentItem.action.handler();
                }
                this._hideNotification();
            },

            /**
             * Called when the custom action of the notifaction (if available) is called.
             * It uses an external function instead of a v-on:clicked directive because
             * we need to also hide the notification.
             */
            _onCloseClicked : function() {
                this.mouseOutEnabled = false;
                this._hideNotification();
            },

            _onMouseOver : function() {
                if (this.mouseOutEnabled) {
                    this.pause();
                }
            },

            _onMouseOut : function() {
                if (this.mouseOutEnabled) {
                    this.resume();
                }
            },

            _onSwipe : function() {
                this._hideNotification();
            }
        },
        components : {
            'wc-avatar' : Avatar,
            'wc-flat-button' : FlatButton,
            'wc-list-item' : ListItem,
            'wc-icon-button' : IconButton
        }
    });

    return Snackbar;
});
