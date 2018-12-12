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
 * @file Fab unit test
 * @module test/web-components/fabs/fab_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/buttons/fab/fab_component',
    'web-components/directives/tooltip/tooltip_directive'
],
function(
    Vue,
    VueTestHelper,
    Fab,
    TooltipDirective
) {
    describe('Fab', function() {

        before(function() {
            TooltipDirective.bind();
            Vue.component('wc-fab', Fab);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var defaultProps = {
                    position : null,
                    mini : false,
                    isMobile : false,
                    classObject : null,
                };

                var requiredProps = {
                    actions : [
                        {
                            name : 'test',
                            icon : 'icon',
                            tooltip : 'tooltip'
                        }
                    ]
                };

                var vm = new Fab({ propsData : requiredProps }).$mount();
                VueTestHelper.checkDefinedProps(Vue.util.extend(defaultProps, requiredProps), vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actions : [
                        {
                            name : 'test',
                            icon : 'icon',
                            tooltip : 'tooltip'
                        },
                        {
                            name : 'test2',
                            icon : 'icon2',
                            tooltip : 'tooltip2'
                        }
                    ],
                    position : 'top-right',
                    mini : true,
                    isMobile : true,
                    classObject : {
                        'wc-Fab--custom' : true
                    }
                };

                var vm = new Fab({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('throws a warning when the actions prop validation fails', function() {
                var creationFn = function() {
                    new Fab({
                        propsData : {
                            actions : [
                                {
                                    name : 'test'
                                }
                            ]
                        }
                    });
                }

                expect(creationFn).to.throw(Fab.ERROR.ACTIONS);
            });

            it('throws a warning when the position prop validation fails', function() {
                var creationFn = function() {
                    new Fab({
                        propsData : {
                            actions : [
                                {
                                    name : 'test',
                                    icon : 'test',
                                    tooltip : 'test'
                                }
                            ],

                            position : 'this-way'
                        }
                    });
                }

                expect(creationFn).to.throw(Fab.ERROR.POSITION);
            });
        });

        it('doesn\'t has extra actions if only one is given', function() {
            var vm = new Fab({
                propsData : {
                    actions : [
                        {
                            name : 'test',
                            icon : 'icon',
                            tooltip : 'tooltip'
                        }
                    ]
                }
            }).$mount();

            expect(vm.hasActions).to.be.false;
        });

        it('reorders the extra actions if the position is at the bottom', function() {
            var actions = [
                {
                    name : 'action1',
                    icon : 'icon1',
                    tooltip : 'tooltip1'
                },
                {
                    name : 'action2',
                    icon : 'icon2',
                    tooltip : 'tooltip2'
                },
                {
                    name : 'action3',
                    icon : 'icon3',
                    tooltip : 'tooltip3'
                }
            ];
            var vm = new Fab({
                propsData : {
                    actions : actions,
                    position : Fab.POSITION.BOTTOM_RIGHT
                }
            }).$mount();

            var orderedActions = actions.slice();
            orderedActions.splice(0, 1);

            expect(vm.orderedActions).to.deep.equal(orderedActions.reverse());
        });

        it('adds the appropriate modifier from the position', function() {
            var actions = [{
                name : 'test',
                icon : 'icon',
                tooltip : 'tooltip'
            }];

            var vm1 = new Fab({ propsData : { actions : actions, position : Fab.POSITION.TOP_RIGHT }}).$mount(),
                vm2 = new Fab({ propsData : { actions : actions, position : Fab.POSITION.BOTTOM_RIGHT }}).$mount(),
                vm3 = new Fab({ propsData : { actions : actions, position : Fab.POSITION.BOTTOM_LEFT }}).$mount(),
                vm4 = new Fab({ propsData : { actions : actions, position : Fab.POSITION.TOP_LEFT }}).$mount();

            expect(vm1.$el.classList.contains(Fab.MODIFIER.TOP_RIGHT)).to.be.true;
            expect(vm2.$el.classList.contains(Fab.MODIFIER.BOTTOM_RIGHT)).to.be.true;
            expect(vm3.$el.classList.contains(Fab.MODIFIER.BOTTOM_LEFT)).to.be.true;
            expect(vm4.$el.classList.contains(Fab.MODIFIER.TOP_LEFT)).to.be.true;

            expect(vm1.tooltipAlignment).to.equal('left');
            expect(vm2.tooltipAlignment).to.equal('left');
            expect(vm3.tooltipAlignment).to.equal('right');
            expect(vm4.tooltipAlignment).to.equal('right');
        });

        it('#open', function() {
            var vm = new Fab({
                propsData : {
                    actions : [{
                        name : 'test',
                        icon : 'icon',
                        tooltip : 'tooltip'
                    }]
                }
            }).$mount();

            vm.open();
            expect(vm.isActive).to.be.true;
        });

        it('#close', function() {
            var vm = new Fab({
                propsData : {
                    actions : [{
                        name : 'test',
                        icon : 'icon',
                        tooltip : 'tooltip'
                    }]
                }
            }).$mount();

            vm.close();
            expect(vm.isActive).to.be.false;
        });
    });
});
