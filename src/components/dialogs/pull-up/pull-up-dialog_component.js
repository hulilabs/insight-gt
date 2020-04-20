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
 * @file Pull up dialog for small touch devices
 * @requires vue
 * @requires web-components/bars/app-bar/app-bar_component
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/overlays/overlay_component
 * @requires text!web-components/dialogs/pull-up/pull-up-dialog_template.html
 * @requires css-loader!web-components/dialogs/pull-up/pull-up-dialog_styles.css
 * @module web-components/dialogs/pull-up/pull-up-dialog_component
 * @fires module:PullUpDialog#CLOSED
 * @fires module:PullUpDialog#HIT_BOTTOM
 */
define([
    'vue',
    'web-components/bars/app-bar/app-bar_component',
    'web-components/buttons/icon/icon-button_component',
    'web-components/overlays/overlay_component',
    'text!web-components/dialogs/pull-up/pull-up-dialog_template.html',
    'css-loader!web-components/dialogs/pull-up/pull-up-dialog_styles.css'
],
function(
    Vue,
    AppBar,
    IconButton,
    Overlay,
    Template
) {
    // Constants
    var DIRECTION = {
        COLLAPSE : 1,
        EXPAND : 0
    };
    var EVENTS = {
        CLOSED : 'pull-up-closed',
        HIT_BOTTOM : 'pull-up-hit-bottom'
    };
    var TRANSITIONS = {
        OPACITY_1S : 'opacity 1s ease-out',
        OPACITY_300MS : 'opacity 0.3s ease-out',
        COLLAPSED_SPEED : 300,
        EXPANDED_SPEED : 1000
    };

    var APP_BAR_HEIGHT = 56;
    var ANIMATION_VELOCITY = 20;
    var TOUCH_SIZE = 50;

    var PullUpDialog = Vue.extend({
        template : Template,
        props : {
            title : {
                type : String,
                required : false,
                default : ''
            }
        },
        data : function() {
            return {
                state : {
                    isCollapsed : false
                },
                styles : {
                    wrapper : {
                        transition : TRANSITIONS.OPACITY_1S,
                        opacity : 1,
                        overflow : 'hidden'
                    },
                    overlay : {
                        transition : TRANSITIONS.OPACITY_1S,
                        opacity : 1
                    },
                    dialog : {
                        transform : 'none'
                    },
                    cover : {
                        transform : 'none',
                        height : '100%',
                        display : 'block',
                        'will-change' : 'transform'
                    },
                    header : {
                        transform : 'none',
                        height : 'initial',
                        'will-change' : 'transform, height'
                    },
                    headerExpandedContent : {
                        opacity : 1,
                        'will-change' : 'opacity'
                    },
                    headerCollapsedContent : {
                        opacity : 0,
                        'will-change' : 'opacity',
                        height : APP_BAR_HEIGHT + 'px'
                    },
                    content : {
                        transform : 'none',
                        'will-change' : 'transform'
                    }
                },
                // this variables are set when the content is ready
                headerHeight : 0,
                headerContainerHeight : 0,
                /**
                 * There are two breakpoint in the animation, from 0 to 25%, only moves up the dialog
                 * from 25% to 100%, increases/decreases the headers height
                 */
                breakpoint25 : 0,
                breakpoint75 : 0,
                /**
                 * variable to track the touch position in the Y axis
                 */
                startYPoint : 0,
                currentYPoint : 0,
                contentPosition : 0
            };
        },
        mounted : function() {
            this._addEventListeners();
            // set default values of the component
            this.refresh();
        },

        methods : {
            /**
             * Executes the close animation depending on the state, when the animation is done
             * emits a close event
             */
            close : function() {
                var transitionTime = TRANSITIONS.EXPANDED_SPEED;
                if (!this.state.isCollapsed) {
                    this.styles.wrapper.transition = TRANSITIONS.OPACITY_1S;
                    this.styles.overlay.transition = TRANSITIONS.OPACITY_1S;
                    this.styles.dialog.transform = 'translateY(100vh)';
                } else {
                    this.styles.wrapper.transition = TRANSITIONS.OPACITY_300MS;
                    this.styles.overlay.transition = TRANSITIONS.OPACITY_300MS;
                    transitionTime = TRANSITIONS.COLLAPSED_SPEED;
                }
                this.styles.wrapper.opacity = 0;
                this.styles.overlay.opacity = 0;
                setTimeout(function() {
                    /**
                     * Event triggered when the dialog is closed.
                     *
                     * @event module:PullUpDialog#CLOSED
                     */
                    this.$emit(EVENTS.CLOSED);
                }.bind(this), transitionTime);
            },
            /**
             * Starts the collapse animation
             */
            collapse : function() {
                window.requestAnimationFrame(this._animateDialog.bind(this, 0, DIRECTION.COLLAPSE));
            },
            /**
             * Starts the expand animation
             */
            expand : function() {
                window.requestAnimationFrame(this._animateDialog.bind(this, this.headerHeight + 1, DIRECTION.EXPAND));
            },
            /**
             * Handles the collapse/expand animation for the dialog
             * @param {Number} current - current animation point in the Y axis
             * @param {Number} direction - indicates if the animation is to collapse or expand the content
             * Check DIRECTION constant
             * @private
             */
            _animateDialog : function(current, direction) {
                var animationYPosition = current;
                //this is the state when the header is expanded
                if (animationYPosition <= 0) {
                    this.styles.header.height = this.headerHeight + 'px';
                    this.styles.header.transform = 'none';
                    this.styles.cover.transform = 'none';
                    this.styles.cover.display = 'block';
                    this.styles.content.transform = 'translateY(' + this.headerContainerHeight + 'px)';
                    this.styles.headerExpandedContent.opacity = 1;
                    this.styles.headerCollapsedContent.opacity = 0;
                    this.state.isCollapsed = false;
                    if (!direction) {
                        return;
                    }
                // when animationYPosition is in the first 25% of the header's height, the header is moving up very slowly
                } else if (animationYPosition > 0 && animationYPosition < this.breakpoint25) {
                    this.styles.header.transform = 'translateY(-' + animationYPosition + 'px)';
                    this.styles.content.transform = 'translateY(' + (this.headerContainerHeight - animationYPosition) + 'px)';
                // from the 25% to the 100% the header scales down to the size of the appBar and decrease the opacity of its content.
                } else if (animationYPosition >= this.breakpoint25 && animationYPosition <= this.headerHeight) {
                    var newHeaderHeight = (this.headerHeight - animationYPosition) + this.breakpoint25;
                    // the header's height can not be smaller than the app bar size.
                    if (newHeaderHeight >= APP_BAR_HEIGHT) {
                        this.styles.header.height = newHeaderHeight + 'px';
                        this.styles.content.transform = 'translateY(' + (this.headerContainerHeight - (this.headerHeight - newHeaderHeight) - animationYPosition) + 'px)';
                    } else {
                        this.styles.content.transform = 'translateY(' + APP_BAR_HEIGHT + 'px)';
                    }
                    this.styles.header.transform = 'translateY(-' + animationYPosition + 'px)';
                    this.styles.cover.transform = 'translateY(-' + (animationYPosition - this.breakpoint25) + 'px)';
                    this.styles.headerExpandedContent.opacity = (this.headerHeight - animationYPosition) / this.headerHeight;
                // when the Y position is bigger than the header's height, show the appbar(collapsed content)
                } else {
                    this.styles.header.height = APP_BAR_HEIGHT + 'px';
                    if (!direction) {
                        this.styles.header.transform = 'translateY(-' + this.headerHeight + 'px)';
                        this.styles.cover.transform = 'translateY(-' + this.headerHeight + 'px)';
                        this.styles.cover.display = 'block';
                    } else {
                        this.styles.header.transform = 'none';
                        this.styles.cover.display = 'none';
                    }
                    this.styles.headerCollapsedContent.opacity = 1;
                    this.styles.headerExpandedContent.opacity = 0;
                    this.state.isCollapsed = true;
                    if (direction) {
                        return;
                    }
                }
                // from 75% to the 100%px, increase the opacity of the collapseContent(appbar)
                if (animationYPosition > this.breakpoint75 && animationYPosition <= this.headerHeight) {
                    this.styles.headerCollapsedContent.opacity = (this.breakpoint25 - (this.headerHeight - animationYPosition)) / this.breakpoint25;
                }
                if (direction) {
                    window.requestAnimationFrame(this._animateDialog.bind(this, current + ANIMATION_VELOCITY, direction));
                } else {
                    window.requestAnimationFrame(this._animateDialog.bind(this, current - ANIMATION_VELOCITY, direction));
                }
            },
            /**
             * Refresh the values of the state when the content changes
             */
            refresh : function() {
                this.headerHeight = this.$refs.header.offsetHeight;
                if (!(this.$slots.cover && this.$slots.cover.length > 0)) {
                    this.styles.cover.height = this.headerHeight + 'px';
                }
                this.$nextTick(function() {
                    this.headerContainerHeight = this.$refs.headerContainer.offsetHeight;
                    this.breakpoint25 = this.headerHeight * 0.25;
                    this.breakpoint75 = this.headerHeight * 0.75;
                    this.styles.content.transform = 'translateY(' + this.headerContainerHeight + 'px)';
                }.bind(this));
            },
            /**
             * Handles the touch start event, tracks the position in the Y axis
             * @param event
             * @private
             */
            _onTouchStart : function(event) {
                this.contentPosition = this.$refs.content.getBoundingClientRect().top;
                this.$el.addEventListener('touchend', this._onTouchEnd);
                this.$el.addEventListener('touchmove', this._onTouchMove);
                this.startYPoint = event.touches[0].pageY;
                this.currentYPoint = event.touches[0].pageY;
            },
            /**
             * Handles the touch move event, tracks the position in the Y axis
             * @param event
             * @private
             */
            _onTouchMove : function(event) {
                this.currentYPoint = event.touches[0].pageY;
            },
            /**
             * Handles the touch end event, execute the animation depending on the
             * touch position
             * @private
             */
            _onTouchEnd : function() {
                var positionState = this._getPositionState();
                if (positionState.isTouchValid) {
                    if (positionState.isSwipeDown) {
                        if (positionState.isContentAtTop && this.state.isCollapsed) {
                            this.expand();
                        } else if (!this.state.isCollapsed) {
                            this.close();
                        }
                    } else { //swipe up
                        if (!this.state.isCollapsed) {
                            this.collapse();
                        }
                    }
                }

                if (positionState.isSwipeUp && this.state.isCollapsed) {
                    var position = this.$refs.content.getBoundingClientRect();
                    if (Math.abs(window.innerHeight - position.bottom) <= 90) {
                        /**
                         * Event triggered when the use hits the bottom of the content
                         *
                         * @event module:PullUpDialog#HIT_BOTTOM
                         */
                        this.$emit(EVENTS.HIT_BOTTOM);
                    }
                }
                this.$el.removeEventListener('touchmove', this._onTouchMove);
                this.$el.removeEventListener('touchend', this._onTouchEnd);
            },
            /**
             * Analyze the touch positions
             * @return {{isSwipeDown: boolean, isSwipeUp: boolean, isTouchValid: boolean, isContentAtTop: boolean}}
             * @private
             */
            _getPositionState : function() {
                return {
                    isSwipeDown : this.currentYPoint >= this.startYPoint,
                    isSwipeUp : this.currentYPoint < this.startYPoint,
                    isTouchValid : Math.abs(this.startYPoint - this.currentYPoint) > TOUCH_SIZE,
                    isContentAtTop : this.contentPosition <= 60 && this.contentPosition > 10
                };
            },

            _addEventListeners : function() {
                this.$el.addEventListener('touchstart', this._onTouchStart);
            }
        },

        watch : {
            'state.isCollapsed' : function(newValue) {
                if (newValue) {
                    this.styles.wrapper.overflow = 'auto';
                } else {
                    this.styles.wrapper.overflow = 'hidden';
                }
            }
        },

        components : {
            'wc-app-bar' : AppBar,
            'wc-icon-button' : IconButton,
            'wc-overlay' : Overlay
        }
    });

    PullUpDialog.EVENTS = EVENTS;

    return PullUpDialog;
});
