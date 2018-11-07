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
/* global expect, describe, it, beforeEach, before */
define([
    'vue',
    'web-components/directives/gestures/gestures_directive-handler'
],
function(
    Vue,
    GestureDirectiveHandler
) {

    var getEvent = function(type, touch, scale) {

        var array = Array.isArray(touch) ? touch : [ touch ];

        var touchEvent = document.createEvent('Event');
            touchEvent.initEvent(type, true, true);
            touchEvent.touches = array;
            touchEvent.changedTouches = array;
            touchEvent.scale = scale;

        return touchEvent;
    };

    before(function() {
        // Mockup touch events to bypass validateTouchEventsEnabled check
        if (!('ontouchstart' in window)) {
            window.ontouchstart = sinon.spy();
        }
    });

    describe('Gesture bind', function() {

        it ("throws an error when an invalid element is provided is added", function() {
        	expect(function() {
                GestureDirectiveHandler.bind(null, {})
            }).to.throw('Element provided is not a valid DOM element');
        });

        it ("throws an error when an invalid gesture is added", function() {
            var bindings = {
                arg : "invalid_gesture"
            };
            expect(function() {
                GestureDirectiveHandler.bind(document.createElement("div"), bindings)
            }).to.throw('Gesture "invalid_gesture" modifier is not valid.');
        });

        it ("throws an error if no gesture is provided", function() {
            var bindings = {};
            expect(function() {
                GestureDirectiveHandler.bind(document.createElement("div"), bindings)
            }).to.throw('Valid arg (tap, longtap, swipe, etc) must be provided. Received undefined. See https://web-components.hulilabs.xyz/components/gestures for available arg');
        });

        it ("throws an error is not a function", function() {
            var bindings = {
                arg : "tap"
            };
            expect(function() {
                GestureDirectiveHandler.bind(document.createElement("div"), bindings)
            }).to.throw('A function must be provided to handle the gesture');
        });

        it ("does nothing when there is no touch available", function() {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });

        it("handles the tap gesture", function(done) {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            setTimeout(function() {

                $el.dispatchEvent(getEvent('touchend', {
                    identifier : "test",
                    pageX : 100,
                    pageY : 100,
                    target : $el
                }));

                // This works only on Chrome due to a bug on Firefox timeStamp differences
                // See GestureDirectiveHandler._cache.initDomCache.timeInterval for more details
                expect(fn.callCount).to.equal(1);
                done();
            }, 100);
        });

        it("handles the longtap gesture", function(done) {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "longtap"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            setTimeout(function() {
                $el.dispatchEvent(getEvent('touchend', {
                    identifier : "test",
                    pageX : 100,
                    pageY : 100,
                    target : $el
                }));

                expect(fn.callCount).to.equal(1);
                done();
            }, 1100);
        });

        it ("handles the swipeLeft gesture", function() {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipeleft"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 50,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });

        it ("handles a small swipeLeft as a tap gesture", function() {
            var fn = sinon.spy(),
                tapFn = sinon.spy(),
                $el = document.createElement("div"),
                bindings = {
                    value : fn,
                    arg : "swipeleft"
                },
                bindingTap = {
                    value : tapFn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);
            GestureDirectiveHandler.bind($el, bindingTap);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 98,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(0);
            expect(tapFn.callCount).to.equal(1);
        });

        it ("handles the swiperight gesture", function() {
             var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swiperight"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 150,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });

        it ("handles a small swiperight as a tap gesture", function() {
            var fn = sinon.spy(),
                tapFn = sinon.spy(),
                $el = document.createElement("div"),
                bindings = {
                    value : fn,
                    arg : "swiperight"
                },
                bindingTap = {
                    value : tapFn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);
            GestureDirectiveHandler.bind($el, bindingTap);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 102,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(0);
            expect(tapFn.callCount).to.equal(1);
        });

        it ("handles the swipeup gesture", function() {
             var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipeup"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 50,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });

        it ("handles a small swipeup as a tap gesture", function() {
            var fn = sinon.spy(),
                tapFn = sinon.spy(),
                $el = document.createElement("div"),
                bindings = {
                    value : fn,
                    arg : "swipeup"
                },
                bindingTap = {
                    value : tapFn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);
            GestureDirectiveHandler.bind($el, bindingTap);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 98,
                target : $el
            }));

            expect(fn.callCount).to.equal(0);
            expect(tapFn.callCount).to.equal(1);
        });

        it ("handles the swipedown gesture", function() {
             var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipedown"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 150,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });

        it ("handles a small swipedown as a tap gesture", function() {
            var fn = sinon.spy(),
                tapFn = sinon.spy(),
                $el = document.createElement("div"),
                bindings = {
                    value : fn,
                    arg : "swipedown"
                },
                bindingTap = {
                    value : tapFn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);
            GestureDirectiveHandler.bind($el, bindingTap);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 102,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(0);
            expect(tapFn.callCount).to.equal(1);
        });

        it ("handles when there are multiple touches", function() {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipedown"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', [{
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el,
                scale : 2
            }, {
                identifier : "test",
                pageX : 200,
                pageY : 100,
                target : $el
            }]));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 150,
                target : $el,
                scale : 2
            }));

            expect(fn.callCount).to.equal(0);
        });

        it ("handles when there are one touch with scale", function() {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipedown"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }, 2));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 150,
                target : $el
            }));

            expect(fn.callCount).to.equal(0);
        });

        it ("handles when there are multiple touches on toucheend", function() {
            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "swipedown"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 150,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', [{
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el,
                scale : 2
            }, {
                identifier : "test",
                pageX : 200,
                pageY : 100
            }]));

            expect(fn.callCount).to.equal(0);
        });
    });

    describe('Gesture unbind', function() {

        it ("throws an error when an invalid element is provided is added", function() {
            expect(function() {
                GestureDirectiveHandler.bind(null, {})
            }).to.throw('Element provided is not a valid DOM element');
        });

        it ("doesn't handle the tap gesture once it is unbinded", function() {

            var fn = sinon.spy(),
                $el = document.createElement("div");
                bindings = {
                    value : fn,
                    arg : "tap"
                };

            GestureDirectiveHandler.bind($el, bindings);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);

            GestureDirectiveHandler.unbind($el);

            $el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            $el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : $el
            }));

            expect(fn.callCount).to.equal(1);
        });
    });
});
