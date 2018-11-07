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
 * @file AddPhoto unit test
 * @requires vue
 * @requires test/helpers/vue-components
 * @requires web-components/uploaders/add-photo/add-photo_component
 * @module test/web-components/uploaders/add-photo_test
 */
define([
    'vue',
    'test/helpers/vue-components',
    'web-components/uploaders/add-photo/add-photo_component'
],
function(
    Vue,
    VueTestHelper,
    AddPhoto
) {
    describe('AddPhoto', function() {

        context('on instance creation', function() {
            it('sets props with default values', function() {
                var props = {
                    deletable : false,
                    error : null,
                    imagePath : null,
                    progress : 0,
                    text : null,
                    retry : false,
                    size : 9,
                    uploadable : true
                };

                var vm = new AddPhoto().$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });

            it('sets props with custom values', function() {
                var props = {
                    deletable : true,
                    error : 'test',
                    imagePath : 'test',
                    progress : 10,
                    text : 'test',
                    retry : true,
                    size : 7,
                    uploadable : false
                };

                var vm = new AddPhoto({ propsData : props }).$mount();
                VueTestHelper.checkDefinedProps(props, vm);
            });
        });

        it('#_upload', function(done) {
            var vm = new AddPhoto().$mount(),
                uploadSpy = sinon.spy();

            vm.$on(AddPhoto.EVENT.ON_UPLOAD, function() {
                uploadSpy();
            });

            vm._upload();

            vm.$nextTick(function() {
                expect(uploadSpy.callCount).to.equal(1);
                done();
            });
        });

        it('#_delete', function(done) {
            var vm = new AddPhoto().$mount(),
                deleteSpy = sinon.spy();

            vm.$on(AddPhoto.EVENT.ON_DELETE, function() {
                deleteSpy();
            });

            vm._delete();

            vm.$nextTick(function() {
                expect(deleteSpy.callCount).to.equal(1);
                done();
            });
        });
    });
});
