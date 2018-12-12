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
 * @file Datepicker unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/utils/date
 * @requires web-components/inputs/calendar/calendar_component
 * @requires web-components/inputs/datepicker/datepicker_component
 * @requires web-components/directives/gestures/gestures_directive
 * @module test/web-components/inputs/datepicker/datepicker_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/utils/date',
    'web-components/inputs/calendar/calendar_component',
    'web-components/inputs/datepicker/datepicker_component',
    'web-components/directives/gestures/gestures_directive'
],
function(
    Vue,
    VueTestHelper,
    DateUtil,
    Calendar,
    Datepicker,
    GesturesDirective
) {
    describe('Datepicker', function() {
        before(function() {
            GesturesDirective.bind();
            // registering the component globally
            Vue.component('wc-datepicker', Datepicker);
        });

        // Required definition of the listing of months and days names
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                      'August', 'September', 'October', 'November', 'December'],
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        var requiredProps = {
            months : months,
            days : days,
            monthLabel : 'Months',
            yearLabel : 'Years',
            format : '##/##/####',
            placeholder : 'mm/dd/yyyy'
        };

        context('on instance creation', function() {
            it('sets props with default values', function() {
                // Default values of the props obtained via mixins
                var defaultProps = {
                    actionDisabled : false,
                    autocomplete : 'off',
                    charCounter : false,
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
                    full : false,
                    hasError : false,
                    hideInputHighlighter : false,
                    hintText : null,
                    id : null,
                    label : null,
                    max : null,
                    maxLength : null,
                    min : null,
                    minLength : null,
                    modifier : null,
                    name : null,
                    native : false,
                    nativeError : false,
                    readonly : false,
                    required : false,
                    showSecondaryStyle : false,
                    step : null,
                    type : 'text',
                    value : null
                };

                var vm = new Datepicker({ propsData : requiredProps }).$mount();
                VueTestHelper.checkDefinedProps(Vue.util.extend(defaultProps, requiredProps), vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    autocomplete : 'on',
                    charCounter : true,
                    color : '#D2126F',
                    days : days,
                    disabled : true,
                    errorMessage : 'test',
                    floatingLabel : true,
                    format : '##/##/####',
                    full : true,
                    hasError : true,
                    hideInputHighlighter : true,
                    hintText : 'test',
                    id : 'test',
                    label : 'test',
                    max : '2017-01-01',
                    maxLength : 2,
                    min : '2017-01-01',
                    minLength : 0,
                    modifier : 'is-headline',
                    monthLabel : 'Months',
                    months : months,
                    name : 'test',
                    native : true,
                    nativeError : true,
                    placeholder : 'test',
                    readonly : true,
                    required : true,
                    showSecondaryStyle : true,
                    step : 0,
                    type : 'date',
                    value : 'test',
                    yearLabel : 'Years'
                };

                var vm = new Datepicker({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('#setValue', function() {
            var vm;

            beforeEach(function() {
                vm = new Datepicker({ propsData : requiredProps }).$mount();
            });

            it('correctly updates its value', function() {
                expect(vm.state.value).to.be.null;

                var value = DateUtil.getISOFormatValue(new Date());

                vm.setValue(value);
                expect(vm.currentMonth).to.equal(new Date().getMonth());
                expect(vm.currentYear).to.equal(new Date().getFullYear());
                expect(vm.state.value).to.equal(value);
            });

            it('triggers the ON_INPUT event when the value is changed', function(done) {
                var onInputSpy = sinon.spy();

                var value = DateUtil.getISOFormatValue(new Date());

                vm.$on(Datepicker.EVENT.ON_INPUT, function(payload) {
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

        it('changes its value when the bound prop is changed', function() {
            var vm = new Vue({
                template :
                    '<wc-datepicker ' +
                        'ref="datepicker" ' +
                        'v-model="value" ' +
                        'v-bind:days="days" ' +
                        'v-bind:months="months" ' +
                        'format="##/##/####"' +
                        'placeholder="mm/dd/yyyy"' +
                        'month-label="Months" ' +
                        'year-label="Years"' +
                        'max="2100-01-01">' +
                    '</wc-datepicker>',

                data : function() {
                    return {
                        days : days,
                        months : months,
                        value : null
                    };
                }
            }).$mount();

            expect(vm.value).to.be.null;
            expect(vm.$refs.datepicker.state.value).to.equal(vm.value);

            vm.value = DateUtil.getISOFormatValue(new Date());

            // @todo implement the other part of the test when custom logic problem is solved
            // vm.$nextTick(function() {
            //     vm.$nextTick(function() {
            //         expect(vm.$refs.datepicker.state.value).to.equal(vm.value);
            //         done();
            //     });
            // });
        });

        it('resets the value of the selected year and month if the value is cleared', function(done) {
            var date = new Date();

            var vm = new Datepicker({
                propsData : Vue.util.extend({
                    full : true,
                    value : DateUtil.getISOFormatValue(date)
                }, requiredProps)
            }).$mount();

            expect(vm.state.value).to.equal(DateUtil.getISOFormatValue(date));

            var targetYear = 1994,
                targetMonth = 01;

            vm.state.selectedYear = targetYear;
            vm.state.selectedMonth = targetMonth;

            expect(vm.state.selectedYear).to.equal(targetYear);
            expect(vm.state.selectedMonth).to.equal(targetMonth);

            vm.state.value = null;

            vm.$nextTick(function() {
                expect(vm.state.value).to.be.null;
                expect(vm.state.selectedYear).to.be.null;
                expect(vm.state.selectedMonth).to.be.null;

                done();
            });
        });

        context('event triggering', function() {
            var vm;

            beforeEach(function() {
                vm = new Datepicker({ propsData : requiredProps }).$mount();
            });

            it('#_onFocus', function(done) {
                var onFocusSpy = sinon.spy();

                vm.$on(Datepicker.EVENT.ON_FOCUS, function() {
                    onFocusSpy();
                });

                vm._onFocus();

                vm.$nextTick(function() {
                    expect(onFocusSpy.callCount).to.equal(1);
                    done();
                })
            });

            it('#_onBlur', function(done) {
                var onBlurSpy = sinon.spy();

                vm.$on(Datepicker.EVENT.ON_BLUR, function() {
                    onBlurSpy();
                });

                vm._onBlur();

                vm.$nextTick(function() {
                    expect(onBlurSpy.callCount).to.equal(1);
                    done();
                })
            });
        });

        context('on month and year selection', function() {
            var vm;

            beforeEach(function() {
                vm = new Datepicker({
                    propsData : Vue.util.extend({ full : true }, requiredProps)
                }).$mount();
                vm._openDialog();
            });

            afterEach(function() {
                vm._closeDialog();
            });

            it('updates its state and the calendar if a year is chosen', function(done) {
                expect(vm.state.selectedYear).to.be.null;

                var year = 1994,
                    targetDate = new Date(year, 0, 1).getTime();

                // waits for the calendar ref to be available
                vm.$nextTick(function() {
                    vm._selectYear(year);
                    expect(vm.state.selectedYear).to.equal(year);
                    expect(vm.$refs.calendar.state.currentTimestamp).to.equal(targetDate);
                    done();
                });
            });

            it('updates its state and the calendar if a month is chosen', function(done) {
                expect(vm.state.selectedMonth).to.be.null;

                var month = 9,
                    monthName = months[month],
                    targetDate = new Date(new Date().getFullYear(), month, 1).getTime();

                // waits for the calendar ref to be available
                vm.$nextTick(function() {
                    vm._selectMonth(monthName);
                    expect(vm.state.selectedMonth).to.equal(month);
                    expect(vm.$refs.calendar.state.currentTimestamp).to.equal(targetDate);
                    done();
                }.bind());
            });

        });

        context('on calendar event handling', function() {
            var vm;

            beforeEach(function() {
                vm = new Datepicker({ propsData : requiredProps }).$mount();
                vm._openDialog();
            });

            afterEach(function() {
                vm._closeDialog();
            });

            it('updates its current month with the calendar\'s ON_MONTH_CHANGED event', function(done) {
                var payload = {
                    value : DateUtil.getISOFormatValue(new Date()),
                    target : new Date().getMonth() + 1
                };

                vm.$nextTick(function() {
                    vm.$refs.calendar.$emit(Calendar.EVENT.ON_MONTH_CHANGED, payload);
                    expect(vm.state.selectedMonth).to.equal(payload.target);
                    done();
                });
            });

            it('updates its current year with the calendar\'s ON_YEAR_CHANGED event', function(done) {
                var payload = {
                    value : DateUtil.getISOFormatValue(new Date()),
                    target : new Date().getFullYear() + 1
                };

                vm.$nextTick(function() {
                    vm.$refs.calendar.$emit(Calendar.EVENT.ON_YEAR_CHANGED, payload);
                    expect(vm.state.selectedYear).to.equal(payload.target);
                    done();
                });
            });

            it('updates its value with the calendar\'s ON_INPUT event', function(done) {
                var value = DateUtil.getISOFormatValue(new Date());

                vm.$nextTick(function() {
                    vm.$refs.calendar.$emit(Calendar.EVENT.ON_INPUT, value);
                    expect(vm.state.value).to.equal(value);
                    done();
                });
            });
        });


        it('#_syncWithCustomLogic');

        // @todo implement test when the custom logic's need for a nextTick is solved
        /*
        it('#_syncWithCustomLogic', function(done) {
            var vm = new Datepicker({ propsData : Vue.util.extend({ full : true }, requiredProps)}).$mount();

            var customLogicValue = DateUtil.toString(new Date(), requiredProps.placeholder.split('/').join('')),
                customMaskedValue = DateUtil.toString(new Date(), requiredProps.placeholder),
                expectedValue = DateUtil.getISOFormatValue(DateUtil.toDate(customMaskedValue, requiredProps.placeholder));

            vm.state.customValue = customLogicValue;

            vm.$nextTick(function() {
                // Written like this because of the custom logic having a nextTick in its updateDataState method
                vm.$nextTick(function () {
                    vm.$nextTick(function () {
                        expect(vm.$refs.customLogic.state.value).to.equal(customLogicValue);
                        expect(vm.$refs.customLogic.getMaskedValue()).to.equal(customMaskedValue);

                        vm._openDialog();

                        expect(vm.state.value).to.equal(expectedValue);

                        done();
                    });
                });
            });
        });
        */
    });
});
