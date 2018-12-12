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
 * @file TimePicker unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/time-picker/time-picker_component
 * @module test/web-components/inputs/time-picker_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/time-picker/time-picker_component'
],
function(
    Vue,
    VueTestHelper,
    TimePicker
) {
    describe('TimePicker', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-time-picker', TimePicker);
        });

        var requiredProps = {
            hoursLabel : 'Hours',
            minutesLabel : 'Minutes'
        };

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    actionDisabled : false,
                    autocomplete : 'off',
                    charCounter : false,
                    color : null,
                    disabled : false,
                    errorMessage : null,
                    floatingLabel : false,
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
                    placeholder : null,
                    readonly : false,
                    required : false,
                    showSecondaryStyle : false,
                    step : 1,
                    type : 'text',
                    value : null
                };

                var vm = new TimePicker({ propsData : requiredProps }).$mount();
                VueTestHelper.checkDefinedProps(Vue.util.extend(props, requiredProps), vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    actionDisabled : true,
                    autocomplete : 'on',
                    charCounter : true,
                    color : '#D2126F',
                    disabled : true,
                    errorMessage : 'error message',
                    floatingLabel : true,
                    hasError : true,
                    hideInputHighlighter : true,
                    hintText : 'hint text',
                    id : 'test',
                    label : 'Label',
                    max : '5',
                    maxLength : 10,
                    min : '10',
                    minLength : 5,
                    modifier : null,
                    name : 'test',
                    native : true,
                    nativeError : true,
                    placeholder : 'placeholder',
                    readonly : true,
                    required : true,
                    showSecondaryStyle : true,
                    step : 10,
                    type : 'text',
                    value : 'test'
                };

                var vm = new TimePicker({ propsData : Vue.util.extend(props, requiredProps) }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('changes its value when the bound prop is changed', function(done) {
            var vm = new Vue({
                template : '<wc-time-picker ref="timepicker" ' +
                                'hours-label="hours" ' +
                                'minutes-label="minutes" ' +
                                'v-model="value">' +
                            '</wc-time-picker>',
                data : function() {
                    return {
                        value : null
                    };
                }
            }).$mount();

            vm.value = new Date().getHours() + ':' + new Date().getMinutes();

            vm.$nextTick(function() {
                expect(vm.$refs.timepicker.state.value).to.equal(vm.value);
                done();
            });
        });

        context('on option selection', function() {
            var vm;

            beforeEach(function() {
                vm = new TimePicker({ propsData : requiredProps }).$mount();
                vm._openDialog();
            });

            afterEach(function() {
                vm._closeDialog();
            });

            it('#_selectHours', function() {
                var value = vm.hours[Math.floor(Math.random() * vm.hours.length)].value;
                vm._selectHours(value);

                expect(vm.state.selectedHours).to.equal(value);
            });

            it('#_selectMinutes', function() {
                var value = vm.minutes[Math.floor(Math.random() * vm.minutes.length)].value;
                vm._selectMinutes(value);

                expect(vm.state.selectedMinutes).to.equal(value);
            });

            it('#_selectMeridian', function() {
                var value = vm.meridians[Math.floor(Math.random() * vm.meridians.length)].value;
                vm._selectMeridian(value);

                expect(vm.state.selectedMeridian).to.equal(value);
            });

            it('updates its value when all options are selected', function(done) {
                var hours = '10',
                    minutes = '30',
                    meridian = 'AM';

                vm._selectHours(hours);
                vm._selectMinutes(minutes);
                vm._selectMeridian(meridian);

                vm.$nextTick(function() {
                    expect(vm.state.value).to.equal(hours + ':' + minutes);
                    done();
                });
            });

            it('closes the dialog when all options are selected and the hours are selected last', function() {
                expect(vm.state.isTimepickerDialogVisible).to.be.true;
                expect(vm.shouldDisplayDialog).to.be.true;

                vm._selectMeridian(vm.meridians[Math.floor(Math.random() * vm.meridians.length)].value);
                vm._selectMinutes(vm.minutes[Math.floor(Math.random() * vm.minutes.length)].value);
                vm._selectHours(vm.hours[Math.floor(Math.random() * vm.hours.length)].value);

                expect(vm.state.isTimepickerDialogVisible).to.be.false;
                expect(vm.shouldDisplayDialog).to.be.false;
            });

            it('closes the dialog when all options are selected and the minutes are selected last', function() {
                expect(vm.state.isTimepickerDialogVisible).to.be.true;
                expect(vm.shouldDisplayDialog).to.be.true;

                vm._selectHours(vm.hours[Math.floor(Math.random() * vm.hours.length)].value);
                vm._selectMeridian(vm.meridians[Math.floor(Math.random() * vm.meridians.length)].value);
                vm._selectMinutes(vm.minutes[Math.floor(Math.random() * vm.minutes.length)].value);

                expect(vm.state.isTimepickerDialogVisible).to.be.false;
                expect(vm.shouldDisplayDialog).to.be.false;
            });

            it('closes the dialog when all options are selected and the meridian is selected last', function() {
                expect(vm.state.isTimepickerDialogVisible).to.be.true;
                expect(vm.shouldDisplayDialog).to.be.true;

                vm._selectHours(vm.hours[Math.floor(Math.random() * vm.hours.length)].value);
                vm._selectMinutes(vm.minutes[Math.floor(Math.random() * vm.minutes.length)].value);
                vm._selectMeridian(vm.meridians[Math.floor(Math.random() * vm.meridians.length)].value);

                expect(vm.state.isTimepickerDialogVisible).to.be.false;
                expect(vm.shouldDisplayDialog).to.be.false;
            });
        });

        it('#setValue', function(done) {
            var vm = new TimePicker({ propsData : requiredProps }).$mount(),
                hours = new Date().getHours(),
                minutes = new Date().getMinutes(),
                value = hours + ':' + minutes;

            var onInputSpy = sinon.spy();

            vm.$on(TimePicker.EVENT.ON_INPUT, function(payload) {
                expect(payload).to.equal(value);
                onInputSpy();
            });

            vm.setValue(value);

            vm.$nextTick(function() {
                expect(vm.state.value).to.equal(value);
                expect(onInputSpy.callCount).to.equal(1);
                done();
            });
        });

        context('on event handling', function() {
            var vm;

            beforeEach(function() {
                vm = new TimePicker({ propsData : requiredProps }).$mount();
            });

            it('triggers the focus event when on focus', function(done) {
                var onFocusSpy = sinon.spy();

                vm.$on(TimePicker.EVENT.ON_FOCUS, function(payload) {
                    expect(payload).to.be.null;
                    onFocusSpy();
                });

                vm._onFocus();

                vm.$nextTick(function() {
                    expect(onFocusSpy.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers the blur event when on blur', function(done) {
                var onBlurSpy = sinon.spy();

                vm.$on(TimePicker.EVENT.ON_BLUR, function(payload) {
                    expect(payload).to.be.null;
                    onBlurSpy();
                });

                vm._onBlur();

                vm.$nextTick(function() {
                    expect(onBlurSpy.callCount).to.equal(1);
                    done();
                });
            });
        });

        context('#_convertToTwoDigitString', function() {
            var vm;

            beforeEach(function() {
                vm = new TimePicker({ propsData : requiredProps }).$mount();
            });

            it('converts a one digit value to a two digit value', function() {
                expect(vm._convertToTwoDigitString(1)).to.equal('01');
            });

            it('returns the same value when it has two digits', function() {
                expect(vm._convertToTwoDigitString(20)).to.equal('20');
            });

            it('returns null for a non numeric value', function() {
                expect(vm._convertToTwoDigitString('invalid')).to.be.null;
            });

            it('returns null for a null value', function() {
                expect(vm._convertToTwoDigitString(null)).to.be.null;
            });
        });
    });
});
