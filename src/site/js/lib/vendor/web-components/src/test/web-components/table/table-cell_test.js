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
 * @file TableCell unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/table/table-cell_component
 * @requires web-components/table/table-row_component
 * @module test/web-components/tables/table-cell_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/tables/table-cell_component',
    'web-components/tables/table-row_component'
],
function(
    Vue,
    VueTestHelper,
    TableCell,
    TableRow
) {
    describe('TableCell', function() {
        before(function() {
            Vue.component('wc-table-cell', TableCell);
            Vue.component('wc-table-row', TableRow);
        });

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    action : false,
                    compact : false,
                    disabled : false,
                    clickable : false,
                    header : false,
                    index : null,
                    noBorder : false,
                    truncate : false
                };

                var vm = new TableCell().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    action : true,
                    compact : true,
                    disabled : true,
                    clickable : true,
                    header : true,
                    index : 1,
                    noBorder : true,
                    truncate : true
                };

                var vm = new TableCell({
                    propsData : props
                }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        context('on using getters and setters', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template : '<wc-table-cell ref="tableCell" header v-bind:index="index"></wc-table-cell>',
                    data : function() {
                        return {
                            index : 1
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('set and get index', function() {
                var tableCell = vm.$refs.tableCell;

                expect(tableCell.getIndex()).to.be.equal(1);
            });
        });
    });

    context('on handling events', function() {
            var vm;

            beforeEach(function() {
                var Component = Vue.extend({
                    template :
                        '<wc-table-row v-bind:index="index">' +
                            '<wc-table-cell ref="tableCell" clickable v-bind:index="index"></wc-table-cell>' +
                        '</wc-table-row>',
                    data : function() {
                        return {
                            index : 1
                        };
                    }
                });

                vm = new Component().$mount();
            });

            it('calls the click handler', function() {
                var tableCell = vm.$refs.tableCell,
                    emitStub = sinon.stub(tableCell, '$emit');

                tableCell._clickHandler();

                expect(emitStub.callCount).to.be.equal(1);
            });
        });
});
