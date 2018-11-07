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
/**
 * @file TableRow unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/table/table-row_component
 * @module test/web-components/tables/table-row_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tables/table-row_component'
],
function(
    Vue,
    VueTestHelper,
    TableRow
) {
    describe('TableRow', function() {
        before(function() {
            Vue.component('wc-table-row', TableRow);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    disabled : false,
                    header : false,
                    noFocus : false,
                    index : null,
                    selected : false,
                    multiline : false,
                    expanded : false
                };

                var vm = new TableRow().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    disabled : true,
                    header : true,
                    noFocus : true,
                    index : 0,
                    selected : true,
                    multiline : true,
                    expanded : true
                };

                var vm = new TableRow({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('on event handling', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template : '<wc-table-row ref="tableRow"></wc-table-row>'
                });

                vm = new Component().$mount();
            });

            it('listens click event', function() {
                var tableRow = vm.$refs.tableRow,
                    emitStub = sinon.stub(tableRow, '$emit');

                tableRow._onClickHandler();
                tableRow._onContextMenuHandler();
                tableRow._onDoubleClickHandler();

                expect(emitStub.callCount).to.be.equal(3);
            });
        });

        context('on index interaction', function() {
            var vm;

            before(function() {
                var Component = Vue.extend({
                    template : '<wc-table-row ref="tableRow"></wc-table-row>'
                });

                vm = new Component().$mount();
            });

            it('set and get index', function() {
                var tableRow = vm.$refs.tableRow;

                tableRow.setIndex(1);

                expect(tableRow.getIndex()).to.be.equal(1);
            });
        });
    });
});
