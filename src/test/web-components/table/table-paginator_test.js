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
 * @file TablePaginator unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/tables/table-paginator_component
 * @module test/web-components/paginators/table-paginator_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tables/table-paginator_component'
],
function(
    Vue,
    VueTestHelper,
    TablePaginator
) {
    describe('TablePaginator', function() {

        before(function() {
            Vue.component('wc-table-paginator', TablePaginator);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    rowsSelector : 5,
                    rowsSelectorLabel : null,
                    rowsSelectorMax : 10,
                    page : 1,
                    currentRowsLabel : null,
                    totalRows : 4
                };

                var vm = new TablePaginator({ propsData : { totalRows : 4 }}).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    rowsSelector : 3,
                    rowsSelectorLabel : 'Filas por página',
                    rowsSelectorMax : 6,
                    page : 1,
                    currentRowsLabel : 'de',
                    totalRows : 4
                };

                var vm = new TablePaginator({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('on using getters and setters', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-table-paginator ref="tablePaginator"' +
                            ' rowsSelectorLabel="Filas por página"' +
                            ' currentRowsLabel="de"' +
                            ' v-bind:rowsSelector="rowsSelector"' +
                            ' v-bind:totalRows="totalRows"></wc-table-paginator>',
                    data : function() {
                        return {
                            rowsSelector : 4,
                            totalRows : 4
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('set and get page', function() {
                var tablePaginator = vm.$refs.tablePaginator;

                tablePaginator.setPage(1);

                expect(tablePaginator.getPage()).to.be.equal(1);
            });

            it('get rowsSelector', function() {
                var tablePaginator = vm.$refs.tablePaginator;

                expect(tablePaginator.getRowsSelector()).to.be.equal(4);
            });

            it('get totalRows', function() {
                var tablePaginator = vm.$refs.tablePaginator;

                expect(tablePaginator.getTotalRows()).to.be.equal(4);
            });
        });

        context('on handling click events', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-table-paginator ref="tablePaginator"' +
                            ' rowsSelectorLabel="Filas por página"' +
                            ' currentRowsLabel="de"' +
                            ' v-bind:rowsSelector="rowsSelector"' +
                            ' v-bind:totalRows="totalRows"></wc-table-paginator>',
                    data : function() {
                        return {
                            rowsSelector : 4,
                            totalRows : 4
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('triggers previous page click handler', function() {
                var tablePaginator = vm.$refs.tablePaginator;

                tablePaginator._onPreviousPageClickHandler();

                expect(tablePaginator.getPage()).to.be.equal(1);
            });

            it('triggers next page click handler', function() {
                var tablePaginator = vm.$refs.tablePaginator;

                tablePaginator._onNextPageClickHandler();

                expect(tablePaginator.getPage()).to.be.equal(1);
            });
        });

        context('property watchers', function() {
            var vm;

            beforeEach(function() {
                vm = new TablePaginator({ propsData : {
                    page : 1,
                    rowsSelector : 1,
                    rowsSelectorMax : 2,
                    totalRows : 2
                }}).$mount();
            });

            it('rowsSelector', function(done) {
                var pageChangeSpy = sinon.spy(),
                    rowPerPageChangedSpy = sinon.spy();

                vm.$on(TablePaginator.EVENT.SET_PAGE, pageChangeSpy);
                vm.$on(TablePaginator.EVENT.ON_ROWS_PER_PAGE_CHANGED, rowPerPageChangedSpy);

                vm.rowsSelector = 2;

                vm.$nextTick(function() {
                    expect(vm.rowsSelector).to.be.equal(2);
                    expect(vm.state.rowsSelector).to.be.equal(2);
                    expect(pageChangeSpy).to.have.been.called;
                    expect(rowPerPageChangedSpy).to.have.been.called;
                    done();
                });
            });

            it('rowsSelectorMax', function(done) {
                vm.rowsSelectorMax = 4;

                vm.$nextTick(function() {
                    expect(vm.rowsSelectorMax).to.be.equal(4);
                    expect(vm.rowsSelectorRange.length).to.be.equal(4);
                    done();
                });
            });
        });
    });
});
