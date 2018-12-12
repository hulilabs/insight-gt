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
    'web-components/directives/gestures/gestures_directive'
],
function(
    Vue,
    GestureDirective
) {

    var getEvent = function(type, touch) {
        var touchEvent = document.createEvent('Event');
            touchEvent.initEvent(type, true, true);
            touchEvent.touches = [ touch ];
            touchEvent.changedTouches = [ touch ];

        return touchEvent;
    };

    var bindGesture = function(fn) {
        var ComponentDefinition = Vue.extend({
            template : '<div v-if="active" v-wc-gesture:tap="onTap"></div>',
            data : function() {
                return {
                    active : true
                };
            },
            methods : {
                onTap : fn
            }
        });

        var component = new ComponentDefinition().$mount();

        component.$el.dispatchEvent(getEvent('touchstart', {
            identifier : "test",
            pageX : 100,
            pageY : 100,
            target : component.$el
        }));

        component.$el.dispatchEvent(getEvent('touchend', {
            identifier : "test",
            pageX : 100,
            pageY : 100,
            target : component.$el
        }));

        return component;
    }

    describe('Gesture directive', function() {

        before(function() {
            GestureDirective.bind();
        });

        it ("binds the gesture", function() {

            var fn = sinon.spy(),
                component = bindGesture(fn);

            expect(fn.callCount).to.equal(1);
        });

        it ("unbinds the gesture", function() {

            var fn = sinon.spy(),
                component = bindGesture(fn);

            expect(fn.callCount).to.equal(1);

            component.$destroy(true);

            component.$el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : component.$el
            }));

            component.$el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : component.$el
            }));

            expect(fn.callCount).to.equal(1);
        });
    });
});
