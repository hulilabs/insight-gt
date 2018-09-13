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
 * @file Calendar unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/calendar/calendar_component
 * @requires web-components/directives/gestures/gestures_directive
 * @requires web-components/utils/date
 * @module test/web-components/inputs/calendar/calendar_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/calendar/calendar_component',
    'web-components/directives/gestures/gestures_directive',
    'web-components/utils/date'
],
function(
    Vue,
    VueTestHelper,
    Calendar,
    GestureDirective,
    DateUtil
) {
    describe('Calendar', function() {
        before(function() {
            GestureDirective.bind();
            // registering the component globally
            Vue.component('wc-calendar', Calendar);
        });

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'],
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var requiredProps = {
                    days : days,
                    months : months
                };

                var defaultProps = {
                    value : null,
                    min : null,
                    max : null
                };

                var vm = new Calendar({ propsData : requiredProps }).$mount();
                VueTestHelper.checkDefinedProps(Vue.util.extend(requiredProps, defaultProps), vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    days : days,
                    months : months,
                    value : '2017-01-01',
                    min : '2017-01-01',
                    max : '2017-01-31'
                };

                var vm = new Calendar({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('changes its value when the bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-calendar v-bind:months="months" v-bind:days="days" v-model="value" ref="calendar"></wc-calendar>', // jshint ignore:line
                data : function() {
                    return {
                        months : months,
                        days : days,
                        value : null
                    };
                }
            }).$mount();


            expect(vm.$refs.calendar.state.value).to.equal(vm.value);

            vm.value = '2017-01-01';

            vm.$nextTick(function() {
                expect(vm.$refs.calendar.state.value).to.equal(vm.value);
                done();
            });
        });

        context('#setValue', function() {
            var vm,
                props = {
                    days : days,
                    months : months
                };


            beforeEach(function() {
                vm = new Calendar({ propsData : props }).$mount();
            });

            it('correctly updates its value', function() {
                var value = '2017-01-01';

                vm.setValue(value);

                expect(vm.state.value).to.equal(value);
            });

            it('triggers the ON_INPUT event when the value is changed', function(done) {
                var onInputSpy = sinon.spy(),
                    value = '2017-01-01';

                vm.$on('input', function(payload) {
                    expect(payload).to.equal(value);
                    onInputSpy();
                });

                vm.setValue(value);

                vm.$nextTick(function() {
                    expect(onInputSpy.callCount).to.equal(1);
                    done();
                });
            });
        });

        it('#setCurrentDate', function() {
            var vm,
                props = {
                    days : days,
                    months : months
                };

            var targetMonth = 9,
                targetYear = 1994;

            vm = new Calendar({ propsData : props }).$mount();
            vm.setCurrentDate(targetMonth, targetYear);

            var currentDate = new Date(vm.state.currentTimestamp);

            expect(currentDate.getFullYear()).to.equal(targetYear);
            expect(currentDate.getMonth()).to.equal(targetMonth);
        });

        context('#_isDisabledDate', function() {
            it('returns true when a date is below the minimum allowed date', function() {
                var vm,
                    props = {
                        days : days,
                        months : months,
                        min : '2017-01-01'
                    };

                vm = new Calendar({ propsData : props }).$mount();

                expect(vm._isDisabledDate(new Date('2016-12-01'))).to.be.true;
            });

            it('returns true when a date is above the maximum allowed date', function() {
                var vm,
                    props = {
                        days : days,
                        months : months,
                        max : '2017-01-31'
                    };

                vm = new Calendar({ propsData : props }).$mount();
                expect(vm._isDisabledDate(new Date('2017-12-01'))).to.be.true;
            });

            it('returns false when a date is between the allowed min and max ranges', function() {
                var vm,
                    props = {
                        days : days,
                        months : months,
                        min : '2017-01-01',
                        max : '2017-01-31'
                    };

                vm = new Calendar({ propsData : props }).$mount();
                expect(vm._isDisabledDate(new Date('2017-01-15'))).to.be.false;
            });
        });

        it('#_previousMonthHandler', function() {
            var vm,
                props = {
                    days : days,
                    months : months
                };

            vm = new Calendar({ propsData : props }).$mount();

            var currentDate = new Date();
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() - 1);

            vm._previousMonthHandler();

            var calendarMonth = (new Date(vm.state.currentTimestamp)).getMonth();

            expect(calendarMonth).to.equal(currentDate.getMonth());
        });

        it('#_nextMonthHandler', function() {
            var vm,
                // must be a fixed date to avoid issues with leap year or february
                testingDate = '1991-05-11',
                props = {
                    days : days,
                    months : months,
                    value : testingDate
                };

            vm = new Calendar({ propsData : props }).$mount();

            var currentDate = new Date(testingDate);

            currentDate.setMonth(currentDate.getMonth() + 1);

            vm._nextMonthHandler();

            var calendarMonth = (new Date(vm.state.currentTimestamp)).getMonth();

            expect(calendarMonth).to.equal(currentDate.getMonth());
        });

        context('#_changeMonth', function() {
            var vm,
                props = {
                    days : days,
                    months : months
                };


            beforeEach(function() {
                vm = new Calendar({ propsData : props }).$mount();
            });

            it('triggers the ON_MONTH_CHANGED event when the month is changed', function(done) {
                var onMonthChangedSpy = sinon.spy(),
                    value = '2016-10-26';

                vm.setValue(value);

                vm.$on('calendar-month-changed', function(payload) {
                    expect(payload.value).to.equal(value);
                    expect(payload.offset).to.be.a.number;
                    onMonthChangedSpy();
                });

                vm._changeMonth(-1);

                vm.$nextTick(function() {
                    expect(onMonthChangedSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers the ON_YEAR_CHANGED event when going to another year', function(done) {
                var onYearChangedSpy = sinon.spy(),
                    value = '2017-01-15';

                vm.setValue(value);

                vm.$on('calendar-year-changed', function(payload) {
                    expect(payload.value).to.equal(value);
                    expect(payload.offset).to.be.a.number;
                    onYearChangedSpy();
                });

                vm._changeMonth(-1);

                vm.$nextTick(function() {
                    expect(onYearChangedSpy.callCount).to.equal(1);
                    done();
                });
            });
        });

        context('#_selectedDateHandler', function() {
            var vm,
                props = {
                    days : days,
                    months : months
                };


            beforeEach(function() {
                vm = new Calendar({ propsData : props }).$mount();
            });

            it('doesn\'t change the value if the selected date is disabled', function() {
                expect(vm.state.value).to.be.null;

                vm._selectedDateHandler({
                    isDisabled : true,
                    value : '2017-01-01'
                });

                expect(vm.state.value).to.be.null;
            });

            it('changes the calendar\'s value for an enabled date', function() {
                expect(vm.state.value).to.be.null;

                var value = '2017-01-01';

                vm._selectedDateHandler({
                    isDisabled : false,
                    value : value
                });

                expect(vm.state.value).to.equal(value);
            });
        });
    });
});
