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
/**
 * @file SampleComponent
 * @description sample component used to fake loading scenarios
 * @module test/sample-component
 * @extends Vue
 */
define(['vue'], function(Vue) {
    return Vue.extend({
        name : 'ChipComponent',
        template : '<div>SampleComponent</div>',
    });
});
