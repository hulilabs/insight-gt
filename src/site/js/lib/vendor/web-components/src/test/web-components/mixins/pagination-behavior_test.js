/*  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * |  _  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */
/* jshint mocha:true, expr:true *//* global expect */
define([
    'vue',
    'web-components/mixins/pagination/pagination_behavior'
],
function(
    Vue,
    PaginationBehavior
) {
    var vm;

    var ComponentDefinition = Vue.extend({
        mixins : [PaginationBehavior.mixin],
        template : '<div></div>'
    });

    describe('PaginationBehavior.mixin', function() {

        context('on instance creation', function() {

            it('sets state with default values', function() {
                vm = new ComponentDefinition().$mount();
                expect(vm.paginationMixin.state.itemsPerPage).to.equal(PaginationBehavior.DEFAULT.ITEMS_PER_PAGE);
                expect(vm.paginationMixin.state.page).to.equal(PaginationBehavior.DEFAULT.PAGE);
                expect(vm.paginationMixin.state.totalItems).to.equal(PaginationBehavior.DEFAULT.TOTAL_ITEMS);
            });
        });

        context('on state handling check', function() {

            beforeEach(function() {
                vm = new ComponentDefinition().$mount();
            });

            it('itemsPerPage', function() {
                var spy = sinon.spy();
                vm.$on(vm.paginationMixin.EVENT.SET_ITEMS_PER_PAGE, spy);
                vm.$_paginationMixin_setItemsPerPage(2);
                expect(vm.$_paginationMixin_getItemsPerPage()).to.equal(2);
                expect(spy.callCount).to.equal(1);
            });

            it('page', function() {
                var spy = sinon.spy();
                vm.$on(vm.paginationMixin.EVENT.SET_PAGE, spy);
                vm.$_paginationMixin_setTotalItems(20);
                vm.$_paginationMixin_setPage(3);
                expect(vm.$_paginationMixin_getPage()).to.equal(3);
                expect(spy.callCount).to.equal(1);
            });

            it('totalItems', function() {
                var spy = sinon.spy();
                vm.$on(vm.paginationMixin.EVENT.SET_TOTAL_ITEMS, spy);
                vm.$_paginationMixin_setTotalItems(20);
                expect(vm.$_paginationMixin_getTotalItems()).to.equal(20);
                expect(spy.callCount).to.equal(1);
            });

            it('current page', function() {
                vm.$_paginationMixin_setTotalItems(20);
                expect(vm.$_paginationMixin_getPage()).to.equal(1);
                // Go to next page
                vm.$_paginationMixin_onNextPageClickHandler();
                expect(vm.$_paginationMixin_getPage()).to.equal(2);
                // Go to previous page
                vm.$_paginationMixin_onPreviousPageClickHandler();
                expect(vm.$_paginationMixin_getPage()).to.equal(1);
            });
        });

        it('#$_paginationMixin_isValidPage', function() {
            vm = new ComponentDefinition().$mount();
            expect(vm.$_paginationMixin_isValidPage(2)).to.be.false;
        });
    });
});