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
 * @file Card component
 * @requires vue
 * @requires web-components/buttons/icon/icon-button_component
 * @requires web-components/bars/app-bar/app-bar_component
 * @requires web-components/overlays/overlay_component
 * @requires web-components/loaders/linear/linear-loader_component
 * @requires web-components/utils/adaptive/adaptive
 * @requires web-components/utils/keyboard
 * @requires web-components/utils/animation
 * @requires web-components/behaviors/sticky/sticky-section_behavior
 * @requires web-components/cards/card/card_template.html
 * @requires web-components/cards/card/card_styles.css
 * @requires web-components/dividers/divider_styles.css
 * @module web-components/cards/card/card_component
 * @extends Vue
 * @fires module:Card#Event.CLOSE
 * @fires module:Card#Event.CLOSED
 * @fires module:Card#Event.OPEN
 * @fires module:Card#Event.OPENED
 * @fires module:Card#Event.FOCUS
 * @fires module:Card#Event.TRANSITION_END
 * @fires module:Card#Event.FULLSCREEN_CHANGE
 *
 * @see {@link https://web-components.hulilabs.xyz/components/card} for demos and documentation
 */
define([
    'vue',
    'web-components/buttons/icon/icon-button_component',
    'web-components/bars/app-bar/app-bar_component',
    'web-components/overlays/overlay_component',
    'web-components/loaders/linear/linear-loader_component',
    'web-components/utils/adaptive/adaptive',
    'web-components/utils/keyboard',
    'web-components/utils/animation',
    'web-components/behaviors/sticky/sticky-section_behavior',
    'text!web-components/cards/card/card_template.html',
    'css-loader!web-components/cards/card/card_styles.css',
    'css-loader!web-components/dividers/divider_styles.css'
],
function(
    Vue,
    IconButton,
    AppBar,
    Overlay,
    Loader,
    AdaptiveUtil,
    KeyboardUtil,
    AnimationUtil,
    StickySectionBehavior,
    Template
) {

    /**
     * Available focus types for `focus` prop
     * @type {Object}
     */
    var FOCUS = {
        LINE : 'line',
        NONE : 'none',
        RAISE : 'raise'
    };

    /**
     * A material inspired card component
     */
    var Card = Vue.extend({
        name : 'CardComponent',
        template : Template,
        props : {
            /**
             * Limits active height and adds a vertical scroll if needed
             */
            activeMaxHeight : {
                type : Number,
                default : null
            },

            /**
             * Should display the card without margins when resting?
             */
            compactLayout : {
                type : Boolean,
                default : false
            },

            /**
             * Card focus visual feedback type
             */
            focusStyle : {
                type : String,
                default : FOCUS.LINE,
                validator : function(value) {
                    return FOCUS.hasOwnProperty(value.toUpperCase());
                }
            },

            /**
             * Should the card appear full screen when raised?
             * @type {Object}
             */
            fullscreenActive : {
                type : Boolean,
                default : AdaptiveUtil.isMobile()
            },

            /**
             * A programmatic card identifier
             */
            name : {
                type : String,
                default : null
            },

            /**
             * Enable raise animation when card becomes active
             */
            raisedOnActive : {
                type : Boolean,
                default : true
            },

            /**
             * if true, the card will resize automatically
             * when its content changes
             */
            resizeOnContentChange : {
                type : Boolean,
                default : true
            },

            /**
             * Limits resting height and adds a vertical scroll if needed
             */
            restingMaxHeight : {
                type : Number,
                default : null
            },

            /**
             * Should display the actions in the header?
             */
            showActions : {
                type : Boolean,
                default : true
            },

            /**
             * Card's tabindex attribute, please don't modify unless
             * you're implementing a deeply thought focus management lib
             */
            tabindex : {
                type : String,
                default : '0'
            },

            /**
             * Text to be displayed in the card's header
             */
            title : {
                type : String,
                default : null
            },

            /**
             * CSS class to apply to card's title
             */
            titleClass : {
                type : String,
                default : null
            },

            /**
             * On active state, include a divider between title and content
             */
            titleDivider : {
                type : Boolean,
                default : true
            },

            /**
             * shows the loader in the header
             */
            loading : {
                type : Boolean,
                default : false
            },

            /**
             * Shows card-level feedback to let the user know
             * that there are errors while the card is closed
             * @type {Object}
             */
            hasError : {
                type : Boolean,
                default : false
            },

            /**
             * Text to be displayed next to the title
             */
            titleHintText : {
                type : String,
                default : null
            },

            /**
             * Class to add to hint text
             */
            titleHintClass : {
                type : String,
                default : null
            },

            /**
             * Selector to make the card's header sticky to an element instead of the window
             */
            stickHeaderTo : {
                type : String,
                default : null
            },

            /**
             * Bypasses the appbar's compact prop for reducing the height of the card's header
             */
            compact : {
                type : Boolean,
                default : false
            }
        },

        data : function() {
            return {
                state : {
                    // is the card raised/active?
                    isActive : false,
                    // is the card currently focused?
                    isFocused : false,
                    // is the card currently on an open attempt?
                    // this is useful to know if the card is focused
                    // as a result of an open attempt, for example, when the card
                    // is clicked
                    hasOpenAttempt : false,
                    // fixed header that's displayed when scrolling a card that's not fullscreen
                    hasFixedHeader : false,
                    // has the card anything visible inside its content section?
                    // i.e. anything visible apart from the header?
                    hasVisibleContent : false,
                    // should the card display a scroll?
                    isScrollable : false,
                    // should the `resting` slot's content be visible?
                    restingContentVisible : false,
                    // should the `active` slot's content be visible?
                    activeContentVisible : false
                },
                styles : {
                    // main block's inline styles
                    card : {
                        maxHeight : ''
                    },
                    // this wrapper contains the default, active and resting content
                    contentWrapper : {
                        height : ''
                    }
                }
            };
        },

        computed : {
            /**
             * Returns true if the card currently has a visible header
             * @return {Boolean}
             */
            hasHeader : function() {
                return this.title || this.$slots.header || (this.fullscreenActive && this.state.isActive);
            },

            /**
             * Returns true if a header must be rendered, visible or not
             */
            shouldRenderHeader : function() {
                return this.title || this.$slots.header || this.fullscreenActive;
            },

            showNavigation : function() {
                return this.fullscreenActive && this.state.isActive;
            },

            hasHeaderShadow : function() {
                return this.fullscreenActive && this.state.isActive;
            },

            hasFocusLine : function() {
                return this.focusStyle === FOCUS.LINE;
            },

            hasFocusRaise : function() {
                return this.focusStyle === FOCUS.RAISE;
            },

            raisesOnActive : function() {
                return !this.fullscreenActive && this.raisedOnActive;
            },

            /**
             * Appends wc-Card__title class to class passed to card's header
             * to properly control the margin
             * @return {String}
             */
            titleTextClass : function() {
                return [
                    this.titleClass || '',
                    'wc-Card__title'
                ].join(' ');
            },

            /**
             * Computes the classes that will be added to the card main block according to the state
             * @return {Object} modifier classes of card main block
             */
            classObject : function() {
                var classes = Vue.util.extend({
                    'has-header' : this.hasHeader,
                    'wc-Card--focusLine' : this.hasFocusLine,
                    'wc-Card--focusRaise' : this.hasFocusRaise,
                    'wc-Card--raisesOnActive' : this.raisesOnActive,
                    'has-error' : this.hasError,
                    'is-compact' : this.compact
                }, this.state ? {
                    'is-active' : this.state.isActive,
                    'is-focused' : !this.state.isActive && this.state.isFocused,
                    'is-fullscreen' : this.fullscreenActive && this.state.isActive,
                    'is-raisedOnActive' : this.state.isActive && this.raisesOnActive,
                    'is-resting' : !this.state.isActive && !this.compactLayout,
                    'is-restingCompact' : this.compactLayout && (!this.state.isActive || !this.raisedOnActive),
                    'is-scrollable' : this.state.isScrollable,
                    'has-fixedHeader' : this.state.isActive && this.state.hasFixedHeader,
                    'has-fastHeightTransition' : this.resizeOnContentChange && this.state.isActive,
                    'has-noContent' : !this.state.hasVisibleContent
                } : {});

                return classes;
            },
            /**
             * determines if the card must show the divider
             * @return {boolean}
             */
            showDivider : function() {
                return this.titleDivider && !this.fullscreenActive &&
                    this.state.isActive && !this.state.hasFixedHeader && !this.loading;
            }
        },

        mounted : function() {
            // makes sure that the resting slot is the only one visible
            this._activateRestingSlot();
            // sets the card height depending on its content when resting
            // adds an scroll if needed
            // removes paddings if no content
            this._updateRestingHeight();

            // helper for making the header fixed or "sticky"
            this.stickyHeader = new StickySectionBehavior(this.$refs.header, this.$el, this._onFixedHeaderChange.bind(this), this.stickHeaderTo);

            // triggers an event every time a transition ends
            this._triggerOnAnimationEnd();

            this._bindFocusManagement();
            this._bindKeyboardActions();
        },

        destroyed : function() {
            // makes sure that listeners are shutdown when the component is destroyed
            if (!this.fullscreenActive) {
                // prevents sticky header (if any) from floating around after closed
                this.stickyHeader.unbind();

                // removes any mutations observers set
                this._stopWatchingContentChange();
            }
        },

        methods : {
            open : function() {
                // makes sure that the active slot is the only one visible
                this._activateActiveSlot();

                if (this.fullscreenActive) {
                    // in fullscreen mode, the content container is expanded to fill the screen
                    // so we _do have visible content_ event if it's a white layer
                    this.state.hasVisibleContent = true;

                    // ensures that there are no scroll-related limits set
                    // this is because if the resting state was limited, we have to make sure
                    // any size limitations are removed on fullscreen
                    this._removeScrollableState();

                } else {
                    // updates the height with an animation
                    // adds an scroll if needed
                    // removes paddings if no content
                    this._updateActiveHeight();

                    // binds sticky header once we're sure the card is in its final position
                    this.$once(Card.EVENT.TRANSITION_END, this.stickyHeader.bind.bind(this.stickyHeader));

                    // automatically updates the card's height when the content changes
                    this._watchContentChangeToResize();
                }

                this.state.isActive = true;

                // Fires the event notifying the successful open operation
                this.$emit(Card.EVENT.OPENED);
            },

            /**
             * Updates whenever the card changes between fixed or not
             * @param  {Boolean} isFixed is the header currently fixed ?
             */
            _onFixedHeaderChange : function(isFixed) {
                this.state.hasFixedHeader = isFixed;
            },

            close : function() {
                // makes sure that the resting slot is the only one visible
                this._activateRestingSlot();

                if (!this.fullscreenActive) {
                    // prevents sticky header (if any) from floating around after closed
                    this.stickyHeader.unbind();

                    // removes any mutations observers set
                    this._stopWatchingContentChange();
                }

                // sets the card height depending on its content when resting
                // adds an scroll if needed
                // removes paddings if no content
                this._updateRestingHeight();

                this.$el.scrollTop = 0;

                this.state.isActive = false;
                this.state.isFocused = false;

                // Fires the event notifying the successful close operation
                this.$emit(Card.EVENT.CLOSED);
            },

            /**
             * Makes the card look focused
             * i.e. changes the state to add is-focused state
             */
            focus : function() {
                this.$el.focus();
                this.state.isFocused = true;
            },

            /**
             * Updates the card's height based on the currently displayed content (resting or active)
             */
            updateHeight : function() {
                if (this.state.isActive) {
                    return this._updateActiveHeight();
                }

                return this._updateRestingHeight();
            },

            /**
             * Ensures active slot is displayed and resting slot is not
             */
            _activateActiveSlot : function() {
                this.state.activeContentVisible = true;
                this.state.restingContentVisible = false;
            },

            /**
             * Ensures resting slot is displayed and active is not
             */
            _activateRestingSlot : function() {
                this.state.activeContentVisible = false;
                this.state.restingContentVisible = true;
            },

            /**
             * Adds a mutation observer to resize an active card if the content changes
             */
            _watchContentChangeToResize : function() {
                if (this.resizeOnContentChange) {
                    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                    this.mutationObserver = new MutationObserver(this._updateActiveHeight.bind(this, null));

                    this.mutationObserver.observe(this.$el, {
                        childList : true,
                        subtree : true
                    });
                }
            },

            /**
             * Removes a mutation observer set using _watchContentChangeToResize
             */
            _stopWatchingContentChange : function() {
                if (this.mutationObserver) {
                    this.mutationObserver.disconnect();
                    this.mutationObserver = null;
                }
            },

            /**
             * Sets card's height depending on the content to be displayed when resting
             * which includes:
             * - resting only content
             * - content that's always visible
             *
             * doesn't include:
             * - card header (the header saves its own space)
             *
             */
            _updateRestingHeight : function() {
                // awaits for the next tick to make sure the content is rendered after the slot transition
                return Vue.nextTick()
                       .then(this._updateContentHeight.bind(this, this.$slots.resting, 'restingContent'))
                       // test content to remove paddings if empty
                       .then(this._setHasVisibleContent.bind(this))
                       // adds an scroll if needed
                       .then(this._setScrollableState.bind(this, this.restingMaxHeight));
            },

            /**
             * Sets card's height depending on the content to be displayed when active
             * which includes:
             * - active only content
             * - content that's always visible
             *
             * doesn't include:
             * - card header (the header saves its own space)
             *
             */
            _updateActiveHeight : function() {
                // awaits for the next tick to make sure the content is rendered after the slot transition
                return Vue.nextTick()
                       .then(this._updateContentHeight.bind(this, this.$slots.active, 'activeContent'))
                       // test content to remove paddings if empty
                       .then(this._setHasVisibleContent.bind(this))
                       // adds an scroll if needed
                       .then(this._setScrollableState.bind(this, this.activeMaxHeight));
            },

            /**
             * Updates this card's content wrapper height during state change
             * @param  {Slot}   slot       Card slot to calculate heights (`resting` or `active` slot)
             * @param  {String} contentRef name of the inner ref stored inside `slot` argument, e.g. `restingContent`
             * @return {Number}            calculated height
             */
            _updateContentHeight : function(slot, contentRef) {
                var activeSlotheight = (slot && this.$refs[contentRef]) ? this.$refs[contentRef].clientHeight : 0,
                    contentHeight = this.$refs.content ? this.$refs.content.clientHeight : 0,
                    cardWrapperHeight = contentHeight + activeSlotheight;

                // updates the inner content height
                this.styles.contentWrapper.height = cardWrapperHeight + 'px';

                return cardWrapperHeight;
            },

            /**
             * If the card's content calculated height exceeds a max height provided
             * for the current state (using either `activeMaxHeight` or `restingMaxHeight` props),
             * adds the scroll behavior or removes it otherwise
             * @param {Number} currentStateMaxHeight   provided max height for current state (active or resting) by prop
             * @param {Number} calculatedContentHeight height calculated and set using `_updateContentHeight`
             */
            _setScrollableState : function(currentStateMaxHeight, calculatedContentHeight) {
                if (currentStateMaxHeight && (calculatedContentHeight > currentStateMaxHeight)) {
                    this.styles.card.maxHeight = currentStateMaxHeight + 'px';
                    this.state.isScrollable = true;

                    return true;

                } else {
                    this._removeScrollableState();
                    return false;
                }
            },

            _removeScrollableState : function() {
                this.styles.card.maxHeight = '';
                this.state.isScrollable = false;
            },

            /**
             * Sets this.state.hasVisibleContent to true if currentContentHeight > 0
             * @param  {Number} currentContentHeight current card's inner content wrapper height
             * @return {Number} currentContentHeight for fluent chaining
             */
            _setHasVisibleContent : function(currentContentHeight) {
                this.state.hasVisibleContent = (currentContentHeight > 0);
                return currentContentHeight;
            },

            /**
             * Used to tell apart the focus from a click and the focus from a tab
             * @param {e} Event - mouse down event
             */
            _setOpenAttempt : function(e) {
                // if the card isn't active and this method as a result of an interaction
                // with a custom card action, set the open attempt
                if (!this.state.isActive && !e.target.classList.contains(Card.ACTION_CLASS)) {
                    this.state.hasOpenAttempt = true;
                }
            },

            /**
             * Handles cancelable card close event
             * Every event that comes from user interaction should use this method
             * @param  {?FocusEvent} e - blur event that caused the card to close
             * @fires module:Card#Event.CLOSE
             */
            _onCloseAttempt : function(e) {
                var target = e.relatedTarget || e.explicitOriginalTarget;

                return this._dispatchEvent({
                    eventName : Card.EVENT.CLOSE,
                    callback : this.close,
                    detail : {
                        relatedTarget : target,
                        isCardActive : this.state.isActive
                    }
                });
            },

            /**
             * Handles cancelable card open event
             * Every event that comes from user interaction should use this method
             * @fires module:Card#Event.OPEN
             */
            _onOpenAttempt : function() {
                this.state.hasOpenAttempt = false;

                // action is executed only if the card isn't already open
                if (!this.state.isActive) {

                    return this._dispatchEvent({
                        eventName : Card.EVENT.OPEN,
                        callback : this.open
                    });
                }
            },

            /**
             * Handles cancelable card focus event
             * Every event that comes from user interaction should use this method
             * @fires module:Card#Event.FOCUS
             */
            _onFocusAttempt : function(e) {
                e.preventDefault();

                // ignores focus attempts if already active
                if (!this.state.isActive) {
                    return this._dispatchEvent({
                        eventName : Card.EVENT.FOCUS,
                        callback : this.focus,
                        detail : {
                            hasOpenAttempt : this.state.hasOpenAttempt
                        }
                    });
                }
            },

            /**
             * Triggers a custom event, that can be either a custom focus, open or close
             * @param {Object}   options.detail - custom event base detail payload
             * @param {String}   options.eventName - CustomEvent name
             * @param {Function} options.callback - called if the CustomEvent isn't canceled
             */
            _dispatchEvent : function(options) {
                var eventDetail = Object.assign({}, options.detail);

                // common payload
                eventDetail.targetCard = this;
                eventDetail.name = this.name;

                var cancelled = !this._emitCustomEvent(options.eventName, {
                    cancelable : true,
                    bubbles : true,
                    detail : eventDetail
                });

                if (!cancelled) {
                    options.callback();
                }
            },

            /**
             * Emits a CustomEvent (separated method for easier testing)
             * @param  {String} eventName emitted event name
             * @param  {Object} options    `detail` field for CustomEvent
             * @return {Boolean}          `false` if `preventDefault` was called for this event, `true` otherwise
             */
            _emitCustomEvent : function(eventName, options) {
                var customEvent = new CustomEvent(eventName, options);
                return this.$el.dispatchEvent(customEvent);
            },

            /**
             * Handles mousedown event on card's header
             * It is handled as mousedown since if we add actions to the card header and they're clicked
             * the mouse release on the header will cause the card to close immediately
             * @param   {Event} e
             * @returns {Boolean}  was the click handled?
             */
            _onHeaderClick : function(e) {
                if (this.state.isActive && !this.fullscreenActive) {
                    e.stopPropagation();
                    this._onCloseAttempt(e);

                    return true;
                }

                return false;
            },

            /**
             * Prevents card closing when a mousedown is detected on the card's actions section
             * @param  {Event} e
             */
            _onHeaderActionsClick : function(e) {
                if (this.state.isActive) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            },

            /**
             * Listens for focus.. to focus & listens for blur to close the card
             */
            _bindFocusManagement : function() {
                this.$el.addEventListener('focus', this._onFocusAttempt.bind(this));

                // captures `blur` event to close the card on click outside
                this.$el.addEventListener('blur', this._onBlur.bind(this), true);
            },

            /**
             * Handles blur as a close attempt if the target isn't related to the card
             * @param  {FocusEvent} e
             */
            _onBlur : function(e) {
                /**
                 * DISCLAIMER
                 *
                 * This is a fix for Firefox as the relatedTarget on blur events
                 * are always null by spec. The explicitOriginalTarget has several
                 * implications:
                 *
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/explicitOriginalTarget
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/Comparison_of_Event_Targets
                 *
                 * The most important one is that the explicitOriginalTarget contains the first
                 * element that was clicked, if in the bubbling process the event was rerouted to
                 * other element that would not be reflected in the target. However for the current
                 * usage case it doesn't matter if it is rerouted as we only need to know whether the
                 * element is out of the current selected card or not.
                 *
                 */
                var target = e.relatedTarget || e.explicitOriginalTarget;

                /*
                 * the card shouldn't be closed if the focus was lost as a result of
                 * an inner element deletion while focused
                 */
                if (this._wasFocusLostOnInnerElementDelete(target)) {
                    return this.focus();
                }

                /**
                 * prevents focusout trigger when the focused element is a child of
                 * the current card
                 */
                if (target && !this.$el.contains(target)) {
                    return this._onCloseAttempt(e);
                }
            },

            /**
             * This method returns true when, associated to a close attempt's blur event,
             * the focus is set on the body and there's no related target in the provided FocusEvent argument;
             * which happens when a focused element inside of this card was removed from the DOM
             *
             * @warn for this workaround to properly work, you must add a `tabindex="-1"`
             *       to the app's higher level parent DOM element, that's different from the app's body
             *       because it will isolate the condtion `document.activeElement === document.body`
             *       to cases where the focus is actually lost due to an inner element delete
             *       and not due to a click outside
             *
             * @param  {FocusEvent} e
             * @return {Boolean}
             */
            _wasFocusLostOnInnerElementDelete : function(target) {
                return !target && document.activeElement === document.body;
            },

            /**
             * Binds a single listener for multiple actions, like opening the card with SPACE/ENTER
             */
            _bindKeyboardActions : function() {
                this.$el.addEventListener('keydown', this._onKeyDown.bind(this));
            },

            /**
             * Handles ENTER and SPACE as card open attempts
             * @param   {Event} e  key down event
             * @returns {Boolean} was the event handled?
             */
            _onKeyDown : function(e) {
                if (!this.state.isActive) {
                    // listens for space and enter keys to open the card
                    if (e.keyCode === KeyboardUtil.CODE.ENTER ||
                        e.keyCode === KeyboardUtil.CODE.SPACE) {

                        e.preventDefault();
                        e.stopPropagation();

                        // attempts to open the card
                        this._onOpenAttempt();

                        return true;
                    }
                }

                return false;
            },

            /**
             * Triggers a transition end event when the card's transition is done
             * it relies on the width transition to make sure that it is triggered only
             * once for every transition
             */
            _triggerOnAnimationEnd : function() {
                this.$el.addEventListener(AnimationUtil.getTransitionEndProperty(), this._onAnimationEnd.bind(this));
            },

            /**
             * Triggers a transition end event when the card's transition is done
             * it relies on the width transition to make sure that it is triggered only
             * once for every transition
             * @param {Event} transitionEndEvent - event triggered when a card's transition ends
             * @fires Card#TRANSITION_END
             */
            _onAnimationEnd : function(transitionEndEvent) {
                if (transitionEndEvent.target == this.$el && transitionEndEvent.propertyName === 'width') {
                    this.$emit(Card.EVENT.TRANSITION_END);
                }
            }
        },

        watch : {
            /**
             * Handles fullscreen state switch while the card is active
             * @param  {Boolean} isFullscreenActive
             * @fires  module:Card#Event.FULLSCREEN_CHANGE
             */
            fullscreenActive : function(isFullscreenActive) {
                if (this.state.isActive) {
                    if (isFullscreenActive) {
                        // removes sticky header binding that isn't needed in fullscreen cards
                        this.stickyHeader.unbind();

                        // removes any mutations observers set
                        this._stopWatchingContentChange();

                    } else {
                        // initializes sticky header once it is on its final position
                        this.$once(Card.EVENT.TRANSITION_END, this.stickyHeader.bind.bind(this.stickyHeader));

                        // starts watching for content change
                        this._watchContentChangeToResize();
                    }
                }

                this.$emit(Card.EVENT.FULLSCREEN_CHANGE, isFullscreenActive, this.state.isActive);
            }
        },

        components : {
            'wc-icon-button' : IconButton,
            'wc-app-bar' : AppBar,
            'wc-overlay' : Overlay,
            'wc-linear-loader' : Loader
        }
    });

    /**
     * This module triggers the following custom events
     * @type {Object}
     */
    Card.EVENT = {
        // custom event triggered by an open attempt that may be cancelled
        OPEN : 'card-open',
        // triggered when the card is successfully opened
        OPENED : 'card-opened',
        // custom event triggered by a close attempt that may be cancelled
        CLOSE : 'card-close',
        // triggered when the card is successfully closed
        CLOSED : 'card-closed',
        // triggered when a card is focused
        FOCUS : 'card-focus',
        // triggered once when the card's transition is done
        TRANSITION_END : 'card-transition-end',
        // triggered when the fullscreen state changes (gains fullscreen status or loses it)
        FULLSCREEN_CHANGE : 'card-fullscreen-change'
    };

    // This class must be added to custom card actions containers
    // that won't raise the card
    Card.ACTION_CLASS = 'js-wc-card-action';

    // Focus types
    Card.FOCUS = FOCUS;

    return Card;
});
