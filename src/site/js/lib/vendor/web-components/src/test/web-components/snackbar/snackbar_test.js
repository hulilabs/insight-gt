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
/* jshint mocha:true, expr:true *//* global expect */
/**
 * @file Snackbar unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/snackbar/snackbar_component
 * @module test/web-components/snackbars/snackbar_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/snackbars/snackbar_component'
],
function(
    Vue,
    VueTestHelper,
    Snackbar
) {

    var getEvent = function(type, touch) {
        var touchEvent = document.createEvent('Event');
            touchEvent.initEvent(type, true, true);
            touchEvent.touches = [ touch ];
            touchEvent.changedTouches = [ touch ];

        return touchEvent;
    };

    describe('Snackbar', function() {

        it('throws an error when no text is provided', function() {
            var actionFunction = sinon.spy(),
                data = {};

            var vm = new Snackbar().$mount();

            expect(function() { vm.show(data); }).to.throw("No label text provided");
        });

        it('throws an error when no action text is provided', function() {
            var actionFunction = sinon.spy(),
                data = {
                    text: "sample text 123" ,
                    action : {}
                };

            var vm = new Snackbar().$mount();

            expect(function() { vm.show(data); }).to.throw("No action text provided");
        });

        it('throws an error when no action handler is provided', function() {
            var actionFunction = sinon.spy(),
                data = {
                    text: "sample text 123" ,
                    action : {
                        text: "action text"
                    }
                };

            var vm = new Snackbar().$mount();

            expect(function() { vm.show(data); }).to.throw("No action handler provided");
        });

        it('calls the function when the user hits on the action button', function() {
            var actionFunction = sinon.spy(),
                data = {
                            text: "sample text 123" ,
                            action : {
                                text: "action text" ,
                                handler : actionFunction
                            },
                            // must be under 2000 or the test will timeout
                            duration : 100
                        };

            var vm = new Snackbar().$mount();
            vm.show(data);
            vm._onActionClicked();

            expect(actionFunction.callCount).to.equal(1);
        });

        it('pauses the execution of the snackbars', function(done) {
            var vm = new Snackbar({
                propsData : {
                    useCSSTransitionProperties : false
                }}).$mount();

            var data = {
                text : "sample text 123",
                duration : 250
            };

            var addNotificationSpy = sinon.spy(vm, "_addNotification");
            var showNotificationSpy = sinon.spy(vm, "_showNotification");

            vm.show(data);
            vm.pause();
            vm.show(data);
            vm.show(data);

            setTimeout(function() {
                expect(addNotificationSpy.callCount).to.equal(3);
                expect(showNotificationSpy.callCount).to.equal(1);
                expect(vm.state.queue.length).to.equal(2);
                done();
            }, 1500); // must be under 2000 or the test will timeout
        });

        it('resumes the execution of the snackbars', function(done) {
            var vm = new Snackbar({
                propsData : {
                    useCSSTransitionProperties : false
                }}).$mount();

            var data = {
                text: "sample text 123",
                duration : 10
            };

            var addNotificationSpy = sinon.spy(vm, "_addNotification");
            var showNotificationSpy = sinon.spy(vm, "_showNotification");

            vm.show(data);
            vm.pause();
            vm.show(data);
            vm.show(data);
            vm.resume();

            setTimeout(function() {
                expect(addNotificationSpy.callCount).to.equal(3);
                expect(showNotificationSpy.callCount).to.equal(4);
                expect(vm.state.queue.length).to.equal(0);
                done();
            }, 1500);
        });

        it('dissapears after the action is clicked', sinon.test(function() {
            var notification = {
                text: "sample text 123" ,
                action : {
                    text: "action text" ,
                    handler : function() {}
                }
            };

            var vm = new Snackbar().$mount();
            var hideNotificationSpy = this.spy(vm, "_hideNotification");
            vm.show(notification);
            vm._onActionClicked();

            expect(hideNotificationSpy.callCount).to.equal(1);
        }));

        it('dissapears after the close button is clicked', sinon.test(function() {
            var notification = {
                text: "sample text 123" ,
                action : {
                    text: "action text" ,
                    handler : function() {}
                }
            };

            var vm = new Snackbar().$mount();
            var hideNotificationSpy = this.spy(vm, "_hideNotification");
            vm.show(notification);
            vm._onCloseClicked();

            expect(hideNotificationSpy.callCount).to.equal(1);
        }));

        it('dissapears when it is swiped off', sinon.test(function() {

            var notification = {
                text: "sample text 123" ,
                action : {
                    text: "action text" ,
                    handler : function() {}
                }
            };

            var vm = new Snackbar().$mount();
            var hideNotificationSpy = this.spy(vm, "_hideNotification");
            vm.show(notification);

            vm.$el.dispatchEvent(getEvent('touchstart', {
                identifier : "test",
                pageX : 100,
                pageY : 100,
                target : vm.$el
            }));

            vm.$el.dispatchEvent(getEvent('touchend', {
                identifier : "test",
                pageX : 100,
                pageY : 80,
                target : vm.$el
            }));

            expect(hideNotificationSpy.callCount).to.equal(1);
        }));

        it('dissapears after 8 seconds', sinon.test(function() {
            var data = {
                            text: "sample text 123"
                        };

            var vm = new Snackbar().$mount();
            var timeoutSpy = this.spy(window, "setTimeout");
            vm.show(data);

            expect(timeoutSpy.args[0][1]).to.equal(8000);
        }));

        it('shows only one at a time', sinon.test(function() {
            var testText = "sample text 123"
                data = {
                    text: testText
                };

            var vm = new Snackbar().$mount();
            var addNotificationSpy = this.spy(vm, "_addNotification");
            var showNotificationSpy = this.stub(vm, "_showNotification");

            vm.show(data);
            vm.show(data);

            expect(addNotificationSpy.callCount).to.equal(2);
            expect(showNotificationSpy.callCount).to.equal(1);
        }));

        it('shows the action button when a callback is provided', function() {
            var testText = "sample text 123"
                data = {
                    text: testText,
                    action : {
                        text : testText,
                        action : function() {}
                    }
                };

            var vm = new Snackbar({data : data}).$mount();
            expect(vm.$el.classList.contains('is-custom-enabled')).to.equal(true);
        });

        it('shows the text provided', function() {
            var testText = "sample text 123";

            var vm = new Snackbar({
                data : {
                    state : {
                        currentItem : {
                            text: testText
                        }
                    }
                }
            }).$mount();
            expect(vm.$el.querySelector(".wc-Snackbar__label").innerHTML).to.equal(testText);
        });

        it('shows the close button when specified', function() {
            var testText = "sample text 123";

            var vm = new Snackbar({
                data : {
                    state : {
                        currentItem : {
                            text: testText,
                            close: true
                        }
                    }
                }
            }).$mount();

            expect(vm.$el.classList.contains('is-close-enabled')).to.equal(true);
        });

        it('allows the action to be clicked just once', function() {
            var actionSpy = sinon.spy(),
                data = {
                    text: "sample action click text" ,
                    action : {
                        text: "action text",
                        handler : actionSpy
                    },
                    duration : 100
                };

            var vm = new Snackbar().$mount();
            vm.show(data);

            // Simulating a lot of clicks on the action
            vm._onActionClicked();
            vm._onActionClicked();
            vm._onActionClicked();
            vm._onActionClicked();
            vm._onActionClicked();

            expect(actionSpy.callCount).to.equal(1);
        });
    });
});
