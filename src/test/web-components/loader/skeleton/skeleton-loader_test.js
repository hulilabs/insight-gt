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
/* global expect, describe, it, context, before, sinon, console */
/**
 * @file SkeletonLoader unit test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/loaders/skeleton/skeleton-loader_component'
],
function(
    Vue,
    VueTestHelper,
    SkeletonLoader
) {
    describe('SkeletonLoader', function() {

        context('on instance creation', function() {

            var spy;
            before(function() {
                spy = sinon.spy();
                console.error = spy;
            });

            it('sets props with default values', function() {
                var props = {
                    animated : false,
                    autofill : false,
                    layout : 'list',
                    length : 1,
                    shadow : false
                };

                var vm = new SkeletonLoader().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    animated : true,
                    autofill : true,
                    layout : 'card',
                    length : 10,
                    shadow : false
                };

                var vm = new SkeletonLoader({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('warms the user when set props with invalid values', function() {
                var props = {
                    animated : true,
                    autofill : true,
                    layout : 'wrong-layout',
                    length : 10,
                    shadow : false
                };
                VueTestHelper.checkDefinedProps(props, new SkeletonLoader({ propsData : props }).$mount());
                expect(spy.callCount).to.equal(1);
            });

            it('adds `shadow` modifier', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" shadow>test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('wc-SkeletonLoaderItem--shadow')).to.equal(true);
            });

            it('adds `is-animated` state', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" animated>test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('is-animated')).to.equal(true);
            });

            it('adds `card` modifier', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" layout="card">test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('wc-SkeletonLoaderItem--card')).to.equal(true);
            });

            it('adds `document` modifier', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" layout="document" autofill>test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('wc-SkeletonLoaderItem--document')).to.equal(true);
            });

            it('adds `table` modifier', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" layout="table" autofill>test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('wc-SkeletonLoaderItem--table')).to.equal(true);
            });

            it('adds `idCard` modifier', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" layout="id-card" autofill>test</wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.children[0].classList.contains('wc-SkeletonLoaderItem--idCard')).to.equal(true);
            });

            it('generates the number of items', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="skeletonLoader" v-bind:length="7" ></wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.skeletonLoader.$el.childElementCount).to.equal(7);
            });

            it('autofills the parent container', function() {
                var ParentComponent = Vue.extend({
                    template : '<wc-skeleton-loader ref="loader" autofill></wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });

                var vm = new ParentComponent().$mount();
                expect(vm.$refs.loader.$el.childElementCount).to.equal(1);
            });

            it('is watching the length prop and updating the state', function(done) {
                var ParentComponent = Vue.extend({
                    data : function() {
                        return {
                            length : 10
                        };
                    },
                    methods : {
                        updateLength : function(value) {
                            this.length = value;
                        }
                    },
                    template : '<wc-skeleton-loader ref="loader" v-bind:length="length"></wc-skeleton-loader>',
                    components : {
                        'wc-skeleton-loader' : SkeletonLoader
                    }
                });
                var vm = new ParentComponent().$mount();
                vm.updateLength(3);
                vm.$nextTick(function() {
                    expect(vm.$refs.loader.state.length).to.equal(3);
                    done();
                }.bind(this));
            });
        });
    });
});
