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
 * @file gestures directive
 * @typedef {Object} BindingObject - @see https://vuejs.org/v2/guide/custom-directive.html#Directive-Hook-Arguments for structure details
 * @typedef {Object} TouchCustomEvent - @see function initDomCache, see touch attribute within
 * @typedef {Object} CacheElement - @see function initDomCache
 */
define([],
function() {

    /**
     * Library with the responsability of handling gesture events over vue components
     * Supports vue 2.0
     */
    var GestureDirectiveHandler = {

        /**
         * Adds all the required event listeners for the elements and saves them in cache.
         * @param {DOMElement}
         */
        addEventListeners : function($el) {

            var self = this,
                domCache = this._cache.get($el);

            domCache.listenTouchEvents.touchstart = function(e) {
                if (self.validateIsPrimaryTouch(e)) {
                    return;
                }

                self.touchstartHandler($el, e);
            };

            domCache.listenTouchEvents.touchmove = function(e) {
                if (self.validateIsPrimaryTouch(e)) {
                    return;
                }

                self.touchmoveHandler($el, e);
            };

            domCache.listenTouchEvents.touchend = function(e) {
                if (e.type != 'touchend' ||
                    self.validateIsPrimaryTouch(e)) {
                    return;
                }

                self.touchendHandler($el, e);
            };

            $el.addEventListener('touchstart',domCache.listenTouchEvents.touchstart, false);
            $el.addEventListener('touchmove',domCache.listenTouchEvents.touchmove, false);
            $el.addEventListener('touchend',domCache.listenTouchEvents.touchend, false);
        },

        /**
         * Remove all the event listeners specifically added to a particular element
         * @param {DOMElement} $el
         */
        removeEventListeners : function($el) {

            var domCache = this._cache.get($el);

            $el.removeEventListener('touchstart', domCache.listenTouchEvents.touchstart);
            $el.removeEventListener('touchmove', domCache.listenTouchEvents.touchmove);
            $el.removeEventListener('touchend', domCache.listenTouchEvents.touchend);
        },

        /**
         * Handles the touchstart event for a particular event
         *
         * @param {DOMElement} $el
         * @param {Event} e
         */
        touchstartHandler : function($el, e) {
            // e.stopPropagation(); -- comment due to problems with ripple effects
            e.preventDefault();

            var domCache = GestureDirectiveHandler._cache.get($el);
            var touch = domCache.touch;

            touch.touchstartTime = e.timeStamp;
            touch.touchstartCoord.pageX = e.touches[0].pageX;
            touch.touchstartCoord.pageY = e.touches[0].pageY;
        },

        /**
         * Handles the touchmove event for a particular event
         *
         * @param {DOMElement} $el
         * @param {Event} e
         */
        touchmoveHandler : function($el, e) {
            // e.stopPropagation(); -- comment due to problems with ripple effects
            e.preventDefault();

            var domCache = GestureDirectiveHandler._cache.get($el);
            var binding = domCache.gestureEvents.touchmove;

            if (binding) {
                this.executeFn(e, binding);
            }
        },

        /**
         * Handles the touchend event for a particular event
         *
         * @param {DOMElement} $el
         * @param {Event} e
         */
        touchendHandler : function($el, e) {
            // e.stopPropagation(); -- comment due to problems with ripple effects
            e.preventDefault();

            var domCache = GestureDirectiveHandler._cache.get($el);
            var touch = domCache.touch;

            touch.touchendTime = e.timeStamp;
            touch.touchendCoord.pageX = e.changedTouches[0].pageX;
            touch.touchendCoord.pageY = e.changedTouches[0].pageY;

            touch.lastTouchstartTime = touch.touchstartTime;
            touch.lastTouchendTime = touch.touchendTime;
            touch.lastTouchstartCoord = this._util.deepClone(touch.touchstartCoord);
            touch.lastTouchendCoord = this._util.deepClone(touch.touchendCoord);

            for (var gestureName in domCache.gestureEvents) {
                this.invokeHandler(e, domCache.gestureEvents[gestureName], touch, gestureName);
            }
        },

        /**
         * Validates if with the current information stored, there is any gesture
         * that applies and calls the linked function if so.
         *
         * @param {Event} e
         * @param {BindingObject} binding
         * @param {TouchCustomEvent} touch
         * @param {String} gestureName
         */
        invokeHandler : function(e, binding, touch, gestureName) {
            if (this._judgements[gestureName](touch)) {
                this.executeFn(e, binding);
            }
        },

        /**
         * Executes the function and passes a particular event
         * @param {Event} e
         * @param {BindingObject} binding
         */
        executeFn : function(e, binding) {
            binding.fn(e);
        },

        /**
         * Validates that the provided events or modifiers are supported
         *
         * @param {String} arg @see web-components.hulilabs.xyz/components/gestures
         * @return {boolean} true if all the events are valid
         */
        validateArg : function(arg) {

            if (!arg) {
                throw new Error('Valid arg (tap, longtap, swipe, etc) must be provided. Received ' + arg + '. See https://web-components.hulilabs.xyz/components/gestures for available arg');
            }

            if (!this._judgements[arg]) {
                throw new Error('Gesture "' + arg + '" modifier is not valid.');
            }

            return !!arg;
        },

        /**
         * Validates that the element to be used is a valid DOM element
         * @param {DOMElement} $el
         * @return {boolean} true if it is a DOM element
         */
        validateDOMElement : function($el) {
            var isValidDomElement = $el instanceof HTMLElement;

            if (!isValidDomElement) {
                throw new Error('Element provided is not a valid DOM element', $el);
            }

            return isValidDomElement;
        },

        /**
         * Validates if the current platform supports touch events.
         * Uses the user agent to validate whether or not the touch events are enabled.
         *
         * @return boolean
         */
        validateTouchEventsEnabled : function() {
            return ('ontouchstart' in window);
        },

        /**
         * Ensures that the user is swiping with one touch and not pinching
         *
         * @param {Event} e
         * @return {boolean}
         */
        validateIsPrimaryTouch : function(e) {
            return (e.touches &&
                e.touches.length > 1 ||
                e.scale && e.scale !== 1);
        },

        /**
         * Validates that the provided argument is of type function
         *
         * @param {Function} fn
         * @return {boolean} true if it is a function
         */
        validateFunction : function(fn) {
            var isFunction = typeof fn == 'function';

            if (!isFunction) {
                throw new Error('A function must be provided to handle the gesture');
            }
            return isFunction;
        },

        /**
         * Registers a new gesture to a binding
         * @param {DOMElement} $el
         * @param {BindingObject} binding
         */
        addGesture : function($el, binding) {

            var domCache = this._cache.get($el);
            domCache.gestureEvents[binding.arg] = {};
            domCache.gestureEvents[binding.arg].fn = binding.value;
            domCache.gestureEvents[binding.arg].modifiers = binding.arg;
        }
    };

    GestureDirectiveHandler._util = {
        /**
         * Deeps copy an object and returns the copy
         *
         * @param {object} object
         * @return {object} a copy of the provided object
         */
        deepClone : function(object) {
            return JSON.parse(JSON.stringify(object));
        }
    };

    GestureDirectiveHandler._cache = {

        INTERNAL_KEY_NAME : 'gesture-key',

        domUuid : 1,

        /**
         * Stores the cached objects
         */
        domCaches : {},

        /**
         * Returns whether an element is already in the cache or not
         * @param {DOMElement} $el
         * @return {boolean}
         */
        contains : function($el) {
            return !!this.domCaches[$el[this.INTERNAL_KEY_NAME]];
        },

        /**
         * Returns the cached object of the provided element. If it doesn't exist
         * then it creates a new one.
         *
         * @param {DOMElement} $el
         * @return {object}
         */
        get : function($el) {
            return this.domCaches[$el[this.INTERNAL_KEY_NAME]] ||
               (this.domCaches[$el[this.INTERNAL_KEY_NAME] = this.domUuid++] = this.initDomCache());
        },

        /**
         * Deletes a cached object from the cache if it exists.
         *
         * @param {DOMElement} $el
         */
        delete : function($el) {
            this.domCaches[$el[this.INTERNAL_KEY_NAME]] = null;
            delete this.domCaches[$el[this.INTERNAL_KEY_NAME]];
        },

        /**
         * Inits an empty cache object with all the information required to process an event
         *
         * @return {TouchEvent}
         */
        initDomCache : function() {
            return {
                touch : {
                    touchstartTime : 0,
                    touchendTime : 0,
                    touchstartCoord : {},
                    touchendCoord : {},

                    lastTouchendTime : 0,
                    lastTouchstartTime : 0,
                    lastTouchstartCoord : {},
                    lastTouchendCoord : {},

                    get timeInterval() {
                        // This won't work for calculating time differences on Firefox
                        // We shouldn't add support for mobile Firefox events or rethink this logic
                        // http://api.jquery.com/event.timestamp/
                        // https://bugs.webkit.org/show_bug.cgi?id=85665
                        // https://bugzilla.mozilla.org/show_bug.cgi?id=238041
                        return this.touchendTime - this.touchstartTime;
                    },
                    get pageXDistance() {
                        return this.touchendCoord.pageX - this.touchstartCoord.pageX;
                    },
                    get pageYDistance() {
                        return this.touchendCoord.pageY - this.touchstartCoord.pageY;
                    }
                },
                gestureEvents : {},
                listenTouchEvents : {}
            };
        }
    };

    /**
     * The judgements are the criterias used to know whether given the conditions(the
     * touch events, timings in-between, etc) a certain gesture was performed.
     */
    GestureDirectiveHandler._judgements = {

        _config : {
            maxSingleTapTimeInterval : 300, // milliseconds
            maxSingleTapPageDistanceSquared : 25, // within 5px we consider it as a single tap
            minLongtapTimeInterval : 700, // milliseconds
            maxDoubleTapPageDistanceSquared : 64, // 8px
            gestureEventsToClick : ['tap', 'longtap', 'touchstart']
        },

        /**
         * Criteria to be a tap event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        tap : function(touch) {
            return (touch.timeInterval < this._config.maxSingleTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < this._config.maxSingleTapPageDistanceSquared;
        },

        /**
         * Criteria to be a longtap event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        longtap : function(touch) {
            return (touch.timeInterval > this._config.minLongtapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < this._config.maxSingleTapPageDistanceSquared;
        },

        /**
         * Criteria to be a swipe event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        swipe : function(touch) {
            return (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) > this._config.maxSingleTapPageDistanceSquared;
        },

        /**
         * Criteria to be a swipeleft event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        swipeleft : function(touch) {
            if (!this.swipe(touch)) {
                return false;
            }
            return touch.pageXDistance < 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
        },

        /**
         * Criteria to be a swiperight event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        swiperight : function(touch) {
            if (!this.swipe(touch)) {
                return false;
            }
            return touch.pageXDistance > 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
        },

        /**
         * Criteria to be a swipeup event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        swipeup : function(touch) {
            if (!this.swipe(touch)) {
                return false;
            }
            return touch.pageYDistance < 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
        },

        /**
         * Criteria to be a swipedown event
         * @param {TouchEvent} touch event cached for a particular DOMElement
         * @return {Boolean}
         */
        swipedown : function(touch) {
            if (!this.swipe(touch)) {
                return false;
            }
            return touch.pageYDistance > 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
        }
    };

    /**
     * Attaches the events to an specific element
     * @param  {DOMElement} el           component's root el
     * @param  {object}  modifiers
     */
    var GestureDirective = {
        /**
         * Adds a new bindings added to a particular object
         * @param {DOMElement} $el
         * @param {BindingObject} binding
         */
        bind : function($el, binding) {

            if (!GestureDirectiveHandler.validateDOMElement($el) ||
                !GestureDirectiveHandler.validateArg(binding.arg) ||
                !GestureDirectiveHandler.validateFunction(binding.value) ||
                !GestureDirectiveHandler.validateTouchEventsEnabled()) {
                return;
            }

            if (!GestureDirectiveHandler._cache.contains($el)) {
                GestureDirectiveHandler.addEventListeners($el);
            }

            GestureDirectiveHandler.addGesture($el, binding);
        },

        /**
         * Attaches the events to an specific element
         * @param  {DOMElement} el           component's root el
         */
        unbind : function($el) {
            if (!GestureDirectiveHandler._cache.contains($el) ||
                !GestureDirectiveHandler.validateDOMElement($el)) {
                return;
            }

            GestureDirectiveHandler.removeEventListeners($el);
            GestureDirectiveHandler._cache.delete($el);
        },

        /**
         * Updates the bindings added to a particular object
         * @param {DOMElement} $el
         * @param {BindingObject} binding
         */
        update : function($el, binding) {
            if (!GestureDirectiveHandler.validateFunction(binding.value) ||
                !GestureDirectiveHandler.validateArg(binding.arg)) {
                return;
            }

            GestureDirectiveHandler.addGesture($el, binding);
        }
    };

    return GestureDirective;
});
