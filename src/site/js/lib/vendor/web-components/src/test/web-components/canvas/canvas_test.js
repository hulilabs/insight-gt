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
 * @file Canvas unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/canvas/canvas_component
 * @module test/web-components/canvas/canvas_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/canvas/canvas_component'
],
function(
    Vue,
    VueTestHelper,
    Canvas
) {
    describe('Canvas', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    backgroundColor : Canvas.DEFAULT.BACKGROUND_COLOR,
                    baseImage : '',
                    crossOrigin : null,
                    eraserThickness : 1,
                    height : 0,
                    outlineImage : '',
                    smooth : false,
                    strokeColor : Canvas.DEFAULT.LINE_COLOR,
                    strokeThickness : 1,
                    tool : Canvas.TOOL.PEN,
                    width : 0
                };

                var vm = new Canvas().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    backgroundColor : '#336699',
                    baseImage : 'https://practice.hulilabs.com/img/hh/mail/h.png',
                    crossOrigin : 'anonymous',
                    eraserThickness : 10,
                    height : 100,
                    outlineImage : 'https://practice.hulilabs.com/img/hh/mail/h.png',
                    smooth : true,
                    strokeColor : '#996633',
                    strokeThickness : 10,
                    tool : Canvas.TOOL.ERASER,
                    width : 100
                };

                var vm = new Canvas({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        /**
         * Generates an event object mockup
         * @param  {number}  p      - random value for x and y axis in page
         * @param  {boolean} mobile - touch mobile event
         * @return {Object}
         */
        function _event(p, mobile) {
            return mobile ? {
                changedTouches : [{
                    pageX : p,
                    pageY : p
                }],
                preventDefault : function() {}
            } : {
                pageX : p,
                pageY : p,
                preventDefault : function() {}
            };
        }

        /**
         * Simulate draw events cycle
         * @param  {Vue}     vm     - component instance
         * @param  {boolean} mobile - touch mobile event
         */
        function _draw(vm, mobile) {
            vm._onDrawStart(_event(0, mobile));
            vm._onDraw(_event(10, mobile));
            vm._onDrawEnd(_event(10, mobile));
        }

        context('on drawing', function() {
            it('runs the full cycle', function() {
                var vm = new Canvas().$mount();
                expect(vm.drawBuffer.length).to.equal(0);
                expect(vm.drawStack.length).to.equal(0);
                expect(vm.state.painting).to.be.false;
                vm._onDrawStart(_event(0));
                expect(vm.drawBuffer.length).to.equal(1);
                expect(vm.drawStack.length).to.equal(0);
                expect(vm.state.painting).to.be.true;
                vm._onDraw(_event(10));
                expect(vm.drawBuffer.length).to.equal(2);
                expect(vm.drawStack.length).to.equal(0);
                expect(vm.state.painting).to.be.true;
                vm._onDrawEnd(_event(10));
                expect(vm.drawBuffer.length).to.equal(0);
                expect(vm.drawStack.length).to.equal(1);
                expect(vm.state.painting).to.be.false;
            });
        });

        it('supports touch enable devices', function() {
            var vm = new Canvas().$mount();
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(0);
            _draw(vm, true);
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(1);
        });

        it('#areImagesReady', function() {
            var vm = new Canvas().$mount();
            expect(vm.areImagesReady()).to.be.true;
        });

        it('#clear', function() {
            var vm = new Canvas().$mount();
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(0);
            _draw(vm);
            _draw(vm);
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(2);
            vm.clear();
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(0);
        });

        it('#exportBlob', function(done) {
            var vm = new Canvas().$mount();
            _draw(vm);
            /**
             * Due to canvas.toBlob support, not all enviroments (including Codeship)
             * may be able to run this test equally and result on the same code coverage
             * The following line hacks the toBlob feature to avoid it
             */
            vm.$refs.canvas.toBlob = null;
            vm.exportBlob('jpeg').then(function(blob) {
                expect(blob instanceof Blob).to.be.true;
                done();
            });
        });

        // FileConstructor not supported at Codeship
        it('#exportFile');

        it('#exportImage', function() {
            var vm = new Canvas().$mount();
            _draw(vm);
            expect(vm.exportImage('jpeg') instanceof Image).to.be.true;
        });

        it('#getChanges', function() {
            var vm = new Canvas().$mount();
            _draw(vm);
            expect(vm.getChanges()).to.deep.equal(vm.drawStack);
        });

        it('#hasChanges', function() {
            var vm = new Canvas().$mount();
            _draw(vm);
            expect(vm.hasChanges()).to.be.true;
        });

        it('#setChanges', function() {
            var vm = new Canvas().$mount(),
                changes = [{ color : 'red', points : [] }];
            vm.setChanges(changes);
            expect(changes).to.deep.equal(vm.drawStack);
        });

        it('#undo', function() {
            var vm = new Canvas().$mount();
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(0);
            _draw(vm);
            _draw(vm);
            _draw(vm);
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(3);
            vm.undo();
            expect(vm.drawBuffer.length).to.equal(0);
            expect(vm.drawStack.length).to.equal(2);
        });
    });
});
