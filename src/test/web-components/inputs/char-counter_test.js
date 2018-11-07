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
 * @file CharCounter unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/inputs/char-counter/char-counter_component
 * @module test/web-components/inputs/char-counter_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/inputs/char-counter/char-counter_component'
],
function(
    Vue,
    VueTestHelper,
    CharCounter
) {
    describe('CharCounter', function() {
        before(function() {
            // registering the component globally
            Vue.component('wc-char-counter', CharCounter);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    target : 'test',
                    maxLength : null,
                    minLength : null
                };

                var vm = new CharCounter({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    target : 'test',
                    maxLength : 10,
                    minLength : 3
                };

                var vm = new CharCounter({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('on max length exceeded', function() {
            var vm;

            beforeEach(function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-char-counter ref="counter" v-bind:target="target" v-bind:max-length="10"></wc-char-counter>', // jshint ignore:line
                    data : function() {
                        return {
                            target : 'test'
                        };
                    }
                });

                vm = new ParentComponent().$mount();
            });

            it('triggers change event when the target is longer than allowed', function(done) {
                expect(vm.$refs.counter.state.isAboveMaximum).to.equal(false);

                var onChange = sinon.spy();
                vm.$refs.counter.$on('change', function(payload) {
                    expect(vm.$refs.counter.state.isAboveMaximum).to.equal(true);
                    expect(typeof payload).to.equal('object');
                    expect(payload.state).to.equal('longer');
                    onChange();
                });

                vm.target = 'Hendrerit, quam ad consectetuer eros et class ullamcorper purus dapibus';

                vm.$nextTick(function() {
                    expect(onChange.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers change event when the target has the appropriate length again', function(done) {
                expect(vm.$refs.counter.state.isAboveMaximum).to.equal(false);
                // Making the target exceed the max length
                vm.target = 'Hendrerit, quam ad consectetuer eros et class ullamcorper purus dapibus';

                // Waiting for the target to be invalid before changing its length again
                vm.$nextTick(function() {
                    expect(vm.$refs.counter.state.isAboveMaximum).to.equal(true);

                    vm.$refs.counter.$on('change', function(payload) {
                        // Checking that the target is actually compliant of the given length
                        expect(vm.$refs.counter.state.isAboveMaximum).to.equal(false);
                        expect(typeof payload).to.equal('object');
                        expect(payload.state).to.equal('compliant');
                        done();
                    });

                    // Making the target back to the allowed length
                    vm.target = 'Valid';
                });
            });
        });

        context('on min length not fulfilled', function() {
            var vm;

            beforeEach(function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-char-counter ref="counter" v-bind:target="target" v-bind:min-length="10"></wc-char-counter>', // jshint ignore:line
                    data : function() {
                        return {
                            target : '0123456789'
                        };
                    }
                });

                vm = new ParentComponent().$mount();
            });

            it('triggers change event when the target is shorter than required', function(done) {
                expect(vm.$refs.counter.state.isBelowMinimum).to.equal(false);

                var onChange = sinon.spy();
                vm.$refs.counter.$on('change', function(payload) {
                    expect(vm.$refs.counter.state.isBelowMinimum).to.equal(true);
                    expect(typeof payload).to.equal('object');
                    expect(payload.state).to.equal('shorter');
                    onChange();
                });

                vm.target = '01234';

                vm.$nextTick(function() {
                    expect(onChange.callCount).to.equal(1);
                    done();
                });
            });

            it('triggers change event when the target is long enough again', function(done) {
                expect(vm.$refs.counter.state.isBelowMinimum).to.equal(false);
                // Making the target exceed the max length
                vm.target = '01234';

                // Waiting for the target to be invalid before changing its length again
                vm.$nextTick(function() {
                    expect(vm.$refs.counter.state.isBelowMinimum).to.equal(true);

                    vm.$refs.counter.$on('change', function(payload) {
                        // Checking that the target is actually compliant of the given length
                        expect(vm.$refs.counter.state.isBelowMinimum).to.equal(false);
                        expect(typeof payload).to.equal('object');
                        expect(payload.state).to.equal('compliant');
                        done();
                    });

                    // Making the target back to the allowed length
                    vm.target = '01234567891011';
                });
            });
        });
    });
});
