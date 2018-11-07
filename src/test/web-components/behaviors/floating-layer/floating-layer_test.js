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
/* jshint mocha:true, expr:true *//* global expect, sinon */
define([
    'vue',
    'test/web-components/behaviors/floating-layer/floating-layer_helper',
    'web-components/behaviors/floating-layer/floating-layer_behavior'
],
function(
    Vue,
    FloatingLayerHelper,
    FloatingLayerBehavior
) {

    describe('FloatingLayerBehavior', function() {

        /**
         * Creates a testing floating layer with a custom setup
         *
         * @param  {Function} customSetup
         *
         * @return {Object}
         */
        function setupTest(customSetup) {
            // Generate a component for wrapping testing elements
            var ParentComponent = Vue.extend({
                template : '<div><a ref="trigger">trigger</a><div ref="floating">floating</div></div>',
                computed : {
                    floatingLayerState : {
                        get : function() {
                            return this.state.isActive;
                        },
                        set : function(newValue) {
                            this.state.isActive = newValue;
                        }
                    },
                    floatingLayerClasses : {
                        get : function() {
                            return this.state.floatingLayerClasses;
                        },
                        set : function(classes) {
                            this.state.floatingLayerClasses = classes;
                        }
                    }
                },
                data : function() {
                    return {
                        state : {
                            isActive : false,
                            floatingLayerClasses : null
                        }
                    }
                }
            });

            var testingComponent = new ParentComponent().$mount(),
                trigger = testingComponent.$refs.trigger,
                floating = testingComponent.$refs.floating;

            // Bind floating layer behavior
            var binder = FloatingLayerBehavior.bind(
                            testingComponent,
                            'floatingLayerState',
                            'floatingLayerClasses',
                            trigger,
                            {
                                element : floating,
                                positioner : trigger
                            });

            binder.triggerOn(FloatingLayerBehavior.EVENT.CLICK)
                  .setOffset(0);

            // Apply custom setup changes
            if (customSetup) {
                customSetup(binder);
            }

            binder.resolve();

            return {
                binder : binder,
                floating : floating,
                trigger : trigger
            };
        }

        /**
         * Verify the setup helper is setup as expected
         *
         * @param  {Function} customSetup bypass to setup helper
         * @param  {Function} customTest  first argument is the binder
         */
        function verifyFloatingLayerSetup(customSetup, customTest) {
            var setup = setupTest(customSetup),
                binder = setup.binder;

            // Verify known setup
            expect(binder.trigger.element).to.equal(setup.trigger);
            expect(binder.floating.element).to.equal(setup.floating);
            expect(binder.floating.positioner).to.equal(setup.trigger);
            expect(binder.options.offset).to.deep.equal(0);

            // Verify custom setup via callback
            customTest(binder);
        }

        /**
         * Verify the current state is synchronize between binder and component
         *
         * @param  {FloatinhLayer} binder
         * @param  {Boolean}       state
         */
        function verifyFloatingLayerState(binder, state) {
            expect(binder.component.floatingLayerState).to.equal(binder.state);
            expect(binder.component.floatingLayerState).to.equal(state);
            expect(binder.state).to.equal(state);
        }

        /**
         * Verify the current state was set correctly before custom action validations
         *
         * @param  {Boolean}  isOpen   open or close
         * @param  {Function} callback custom test
         */
        function verifyFloatingLayerForState(isOpen, customTest) {
            verifyFloatingLayerSetup(function(binder) {
                // Force state
                binder.setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                binder.state = isOpen;
            }, function(binder) {
                // Verify forced state
                verifyFloatingLayerState(binder, isOpen);
                customTest(binder);
            });
        }

        function verifyFloatingLayerMatch(triggerOrigin, floatingOrigin) {
            verifyFloatingLayerSetup(function(binder) {
                binder.setTriggerOrigin(triggerOrigin)
                      .setBlockOrigin(floatingOrigin)
                      .toggleConnector(true)
                      .reposition();
            }, function(binder) {
                expect(binder.trigger.origin).to.deep.equal(triggerOrigin);
                expect(binder.floating.origin).to.deep.equal(floatingOrigin);
                expect(binder.options.direction).to.equal(null);
                expect(binder.options.smart).to.equal(false);
            });
        }

        function verifyFloatingLayerDirection(direction) {
            verifyFloatingLayerSetup(function(binder) {
                binder.setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                binder.setDirection(direction);
                binder.reposition();
            }, function(binder) {
                expect(binder.trigger.origin).to.deep.equal(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                expect(binder.options.direction).to.equal(direction);
                expect(binder.options.smart).to.equal(false);
            });
        }

        context('can be setup for match alignment', function() {

            // Ready for 64 combinations?
            // Testing each combination verifies also direction and smart positioning logics

            // trigger top-left

            it('trigger top-left with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger top-left with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger top-left with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger top-left with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger top-left with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger top-left with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger top-left with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger top-left with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger top-left with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger top-center

            it('trigger top-center with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger top-center with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger top-center with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger top-center with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger top-center with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger top-center with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger top-center with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger top-center with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger top-center with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger top-right

            it('trigger top-right with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger top-right with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger top-right with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger top-right with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger top-right with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger top-right with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger top-right with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger top-right with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger top-right with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.TOP_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger middle-left

            it('trigger middle-left with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger middle-left with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger middle-left with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger middle-left with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger middle-left with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger middle-left with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger middle-left with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger middle-left with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger middle-left with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger middle-center

            it('trigger middle-center with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger middle-center with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger middle-center with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger middle-center with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger middle-center with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger middle-center with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger middle-center with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger middle-center with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger middle-center with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger middle-right

            it('trigger middle-right with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger middle-right with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger middle-right with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger middle-right with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger middle-right with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger middle-right with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger middle-right with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger middle-right with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger middle-right with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger bottom-left

            it('trigger bottom-left with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger bottom-left with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger bottom-left with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger bottom-left with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger bottom-left with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger bottom-left with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger bottom-left with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger bottom-left with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger bottom-left with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger bottom-center

            it('trigger bottom-center with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger bottom-center with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger bottom-center with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger bottom-center with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger bottom-center with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger bottom-center with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger bottom-center with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger bottom-center with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger bottom-center with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));

            // trigger bottom-right

            it('trigger bottom-right with floating top-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_LEFT));

            it('trigger bottom-right with floating top-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_CENTER));

            it('trigger bottom-right with floating top-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.TOP_RIGHT));

            it('trigger bottom-right with floating middle-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_LEFT));

            it('trigger bottom-right with floating middle-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_CENTER));

            it('trigger bottom-right with floating middle-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.MIDDLE_RIGHT));

            it('trigger bottom-right with floating bottom-left',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_LEFT));

            it('trigger bottom-right with floating bottom-center',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_CENTER));

            it('trigger bottom-right with floating bottom-right',
                verifyFloatingLayerMatch.bind(this,
                    FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT, FloatingLayerBehavior.ORIGIN.BOTTOM_RIGHT));
        });

        context('can be setup to direction', function() {
            it('up', verifyFloatingLayerDirection.bind(this, FloatingLayerBehavior.DIRECTION.UP));
            it('right', verifyFloatingLayerDirection.bind(this, FloatingLayerBehavior.DIRECTION.RIGHT));
            it('down', verifyFloatingLayerDirection.bind(this, FloatingLayerBehavior.DIRECTION.DOWN));
            it('left', verifyFloatingLayerDirection.bind(this, FloatingLayerBehavior.DIRECTION.LEFT));
        });

        it('can be setup to use smart positioning', function() {
            verifyFloatingLayerSetup(function(binder) {
                binder.setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                binder.setSmart(true);
                binder.reposition();
            }, function(binder) {
                expect(binder.trigger.origin).to.deep.equal(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                expect(binder.floating.origin).to.equal(null);
                expect(binder.options.direction).to.equal(null);
                expect(binder.options.smart).to.equal(true);
            });
        });

        context('#fitsInsideViewportAxis', function() {

            it('fits perfectly in axis', function() {
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(0, 100, 5, 110)).to.be.true;
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(5, 100, 0, 110)).to.be.true;
            });

            it('is negative in axis', function() {
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(-100, 100, 0, 150)).to.be.false;
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(0, 100, -100, 110)).to.be.false;
            });

            it('exceeds axis', function() {
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(0, 200, 5, 110)).to.be.false;
                expect(FloatingLayerBehavior.fitsInsideViewportAxis(5, 200, 0, 110)).to.be.false;
            });
        });

        context('#close', function() {

            it('when the floating layer is close', verifyFloatingLayerForState.bind(this, false, function(binder) {
                binder.close();
                verifyFloatingLayerState(binder, false);
            }));

            it('when the floating layer is open', verifyFloatingLayerForState.bind(this, true, function(binder) {
                binder.close();
                verifyFloatingLayerState(binder, false);
            }));
        });

        it('#onHook', function() {
            var hookToTest = FloatingLayerBehavior.HOOK.AFTER_VERTICAL_POSITION_CALCULATED;
            verifyFloatingLayerSetup(function(binder) {
                binder.setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                binder.onHook(hookToTest, function(data) {
                    return data.calculatedPosition;
                });
                binder.reposition();
            }, function(binder) {
                expect(binder._hooks._isHandlerDefined(hookToTest)).to.be.true;
            });
        });

        context('#open', function() {

            it('when the floating layer is close', verifyFloatingLayerForState.bind(this, false, function(binder) {
                binder.open();
                verifyFloatingLayerState(binder, true);
            }));

            it('when the floating layer is open', verifyFloatingLayerForState.bind(this, true, function(binder) {
                binder.open();
                verifyFloatingLayerState(binder, true);
            }));
        });

        context('#toggle', function() {

            it('when the floating layer is close', verifyFloatingLayerForState.bind(this, false, function(binder) {
                binder.toggle();
                verifyFloatingLayerState(binder, true);
            }));

            it('when the floating layer is open', verifyFloatingLayerForState.bind(this, true, function(binder) {
                binder.toggle();
                verifyFloatingLayerState(binder, false);
            }));
        });

        it('#toggleConnector', function() {
            verifyFloatingLayerSetup(function(binder) {
                binder.setTriggerOrigin(FloatingLayerBehavior.ORIGIN.TOP_LEFT);
                binder.toggleConnector(true);
                binder.reposition();
            }, function(binder) {
                expect(binder.options.connector).to.equal(true);
                expect(binder.connector.enable).to.equal(true);
            });
        });

        it('#unbind');
    });
});
