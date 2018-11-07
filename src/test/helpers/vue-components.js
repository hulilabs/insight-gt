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
/* global expect */
/**
 * @file Library of test helpers for vue components
 * @requires vue
 * @module test/helpers/vue-components
 */
define([
    'vue'
], function(
    Vue
) {
    /**
     * Creates a component, add all the slot information and validates if the generated HTML is ok
     * @param {String} component         component setup
     * @param {String} [component.tag]   tag name of the component to add in the template
     * @param {String} [component.attr]  custom attributes to be added for the template
     * @param {Object} slot              slot setup
     * @param {String} [slot.name]       slot name, can be nullable or falsy to use default slot
     * @param {String} [slot.content]    slot HTML content
     * @param {Object} [slot.styleClass] class where the slot will be inserted, to check if it was generated correctly
     **/
    function checkSlotContentGeneration(component, slot) {
        var content = !slot.name ? '<div>' + slot.content + '</div>' :
                                   '<div slot="' + slot.name + '">' + slot.content + '</div>';

        var generatedContent = '<div>' + slot.content + '</div>';
        var ParentComponent = Vue.extend({
            template : '<' + component.tag + ' ref="childComponent" ' + component.attr + '>' + content + '</' + component.tag + '>'
        });
        var vm = new ParentComponent().$mount();
        var generatedSlotContent = vm.$refs.childComponent.$el.getElementsByClassName(slot.styleClass)[0].innerHTML;
        expect(generatedContent).to.equal(generatedSlotContent);
    }

    /**
     * Checks if the props have the same values and checks if all the props are being tested
     * @param {Object} props      key/value pair
     * @param {Vue}    components component to test
     */
    function checkDefinedProps(props, component) {
        // checks the number of properties
        var definedProps = Object.keys(component.$props);
        expect(definedProps.length).to.equal(Object.keys(props).length);
        // checks if the values are equal
        definedProps.forEach(function(prop) {
            if (typeof component[prop] === 'object') {
                try {
                    expect(component[prop]).to.deep.equal(props[prop]);
                } catch (e) {
                    console.error('Property "' + prop + '" of value "' + component[prop] + '" expected to deeply equal "' + props[prop] + '"', e);
                }
            } else {
                try {
                    expect(component[prop]).to.equal(props[prop]);
                } catch (e) {
                    console.error('Property "' + prop + '" of value "' + component[prop] + '" expected to equal "' + props[prop] + '"', e);
                }
            }
        });
    }

    /**
     * Checks that the events exposed by a component via its class definition are
     * equal to the expected sample.
     * @param  {Object} events              key/value pair
     * @param  {Vue}    componentDefinition component definition to test
     */
    function checkExposedEvents(events, componentDefinition) {
        // checks that the component exposed events
        expect(componentDefinition.EVENT).to.not.be.undefined;
        expect(componentDefinition.EVENT).to.be.object;
        // extracts the keys of the component's exposed events
        var definedEvents = Object.keys(componentDefinition.EVENT);
        expect(definedEvents.length).to.equal(Object.keys(events).length);
        // checks for matches of the component's events with the given sample
        definedEvents.forEach(function(ev) {
            expect(componentDefinition.EVENT[ev]).to.equal(events[ev]);
        });
    }

    return {
        checkSlotContentGeneration : checkSlotContentGeneration,
        checkDefinedProps : checkDefinedProps,
        checkExposedEvents : checkExposedEvents
    };
});
