# `<wc-onboarding>` documentation

The onboarding component is used for showcasing new app features. It corresponds to a dialog box that targets a specific element, highlighting it, so the user can focus on the description of that element.

## API

### Props

| Name | Type | Required | Default | Description
| --- | --- | ---  | ---  | ---
| `onboardingId` | String | true | - | identification of the onboarding process the step belongs to
| `target` | [HTMLElement, Object] | true | - | target element the onboarding step will be related to
| `numberOfSteps` | Number | false | 1 | number of steps in the onboarding process (for displaying in the breadcrumbs)
| `stepNumber` | Number | false | 1 | identification of the step related to the onboarding process it belongs to
| `active` | Boolean | false | false | if the step is the one currently active
| `skippable` | Boolean | false | false | if the user can interrupt the onboarding process by clicking outside or with the ESC key
| `previousBtnLabel` | String | false | null | text that will be set to the previous step action button
| `nextBtnLabel` | String | false | null | text that will be set for the next step action button
| `confirmBtnLabel` | String | false | null | text that will be set for the confirmation action button (when the onboarding can be completed)

Step positioning is done via [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/) props. `triggerOrigin` is **mandatory** and the alignment prop (usually using `floatingDirection`).

### Slots

| Name | Description |
| --- | --- |
| `default` | will contain the information related to the onboarding step. This could be plain text or custom content. |

### Events

The onboarding will trigger an `onboarding-change` event whenever it:
* Goes to a **previous step**: when the previous step button is clicked. Sends the `previous` action as the event's payload
* Goes to a **next step**: when the next step button is clicked. Sends the `next` action as the event's payload
* Is **completed**: when the onboarding is terminated by clicking the action button in the last step. Sends the `completed` action as the event's payload
* Is **skipped**: when the `isSkipplable` prop is given and the user cancels the onboarding. Sends the `skipped` action as the event's payload

#### Usage example:

``` html
<!-- Parent's template -->
<div ref="foo">Foo</div>

<!-- Onboarding definition -->
<wc-onboarding v-on:onboarding-change="onboardingChangedHandler"
    onboarding-id="test"
    v-bind:active="onboarding.current === 1"
    v-bind:target="{ 'local' : $refs, 'key' : 'foo'}"
    v-bind:is-skippable="false"
    confirm-btn-label="Ok"
    trigger-origin="middle-right"
    floating-direction="right">
    <!-- Content -->
    This is the onboarding's content
</wc-onboarding>
```

``` javascript
<!-- Parent component -->
/**
 * This is an example of an onboarding process definition.
 * It needs to track the state of the onboarding's current step for allowing to activate and deactivate
 * the different steps. Also, it should keep in track if it's completed or skipped.
 */
data : function() {
    return {
        onboarding : {
            current : 1
        }
    };
},
methods : {
    onboardingChangedHandler : function(payload) {
        if (payload.action === 'completed') {
            alert('Yay, you finished the onboarding!');
            // This will allow us to wait for the onboarding closing animation
            window.setTimeout(function() {
                this.onboarding.current = null;
            }.bind(this), 300);
        } else if (payload.action === 'skipped') {
            alert('You skipped the onboarding!');
            // This will allow us to wait for the onboarding closing animation
            window.setTimeout(function() {
                this.onboarding.current = null;
            }.bind(this), 300);
        } else {
            var offset = payload.action === 'previous' ? -1 : 1;
            alert('You went from step: ' + payload.step + ' to' + payload.action + ' step: ' + payload.step + offset);
        }
    }
}
```

#### Event payload

The `onboarding-change` event will send the following information as payload:

``` json
{
    id : {String},      // Value given in the required onboardingId prop
    step : {Number},    // Value given to the onboarding step.
    action : {String}   // Action that triggered the event. It could be: previous, next, completed OR skipped
}
```

## Behaviors

* [Floating Layer](https://github.com/hulilabs/web-components/tree/master/src/web-components/behaviors/floating-layer) : must be setup by props
* [Floating Layer Mixin](https://github.com/hulilabs/web-components/tree/master/src/web-components/mixins/floating-layer/)

## Examples

``` html
<!-- A simple definition of an onboarding with a single step -->
<button ref="example1">What does this button do?</button>

<wc-onboarding
    v-on:onboarding-change="onboardingChangedHandler"
    v-bind:active="onboarding1.current === 1"
    v-bind:target="composeVueRef('example1')"
    onboarding-id="onboarding1"
    confirm-btn-label="Understood"
    trigger-origin="middle-right"
    floating-direction="right">
    This button does nothing, it's just an example and i'm using the onboarding to explain this because
    what kind of magical things could that button do?
</wc-onboarding>

<!-- A definition of an onboarding with multiple steps, targeting different elements -->
<!-- You'll have to provide the previous-btn-label and the next-btn-label if there are multiple steps-->
<button ref="example2">Foo</button>
<button ref="example3">Bar</button>

<!-- Notice that this step doesn't need the previous and confirm label, so we don't define it  -->
<wc-onboarding
    v-on:onboarding-change="onboardingChangedHandler"
    v-bind:active="onboarding2.current === 1"
    v-bind:target="composeVueRef('example2')"
    v-bind:number-of-steps="2"
    v-bind:step-number="1"
    onboarding-id="onboarding2"
    next-btn-label="Next"
    trigger-origin="top-center"
    floating-direction="up">
    Foo
</wc-onboarding>
<wc-onboarding
    v-on:onboarding-change="onboardingChangedHandler"
    v-bind:active="onboarding2.current === 2"
    v-bind:target="composeVueRef('example3')"
    v-bind:number-of-steps="2"
    v-bind:step-number="2"
    trigger-origin="bottom-center"
    floating-direction="down"
    onboarding-id="onboarding2"
    previous-btn-label="Previous"
    confirm-btn-label="Ok">
    Bar
</wc-onboarding>
```

``` javascript
var Example = Vue.extend({
    data : function() {
        return {
            onboarding1 : { current : 1, completed : false, skipped : false },
            onboarding2 : { current : 1, completed : false, skipped : false }
        };
    },
    methods : {
        onboardingChangedHandler : function(payload) {
            if (payload.action === 'previous' || payload.action === 'next') {
                this[payload.id].current = payload.step + (payload.action === previous) ? -1 : 1;
            }
        }
    }
});
```

## Styles

### Configuration variables

In *resource/web-components/scss/settings/_components* you can configure the next variables for the component:

| Variable | Description | Default
| --- | --- | ---
| `$wc-onboarding-min-width` | min width in mobile and desktop | 288px
| `$wc-onboarding-max-width` | max width in mobile and desktop | 312px
| `$wc-onboarding-min-height` | min height in mobile and desktop | 112px
| `$wc-onboarding-max-height` | max height in mobile and desktop | 232px
| `$wc-onboarding-background-color` | background color of the onboarding dialog | `$wc-primary-color-dark`
| `$wc-onboarding-color` | color of the onboarding text | `$wc-primary-color-light`
| `$wc-onboarding-step-animation-duration` | animation of the information box when moved back and forth between steps | 0.75s
| `$wc-onboarding-closing-hiding-animation-duration` | opening and closing animation duration | 0.3s

## References

### Design references

* [Material guidelines](https://material.google.com/growth-communications/introduction.html) : a guide about an onboarding process
* https://zpl.io/1Y9onx

### Examples in other libraries

* There aren't examples of a component like this one

### Issues history

* Created on [HULI-1489](https://hulihealth.atlassian.net/browse/HULI-1489)
* Updated on [HULI-1748](https://hulihealth.atlassian.net/browse/HULI-1748): Merged `onboarding-step` functionalities int the `onboarding` component and removing `onboarding-step` component. Improved interaction between parent and onboarding (now it doesn't depend on having `onboarding-step` children). Added support for various overlay's background color and for skipping an onboarding. Also, adding animations
* Updated on [HULI-1859](https://hulihealth.atlassian.net/browse/HULI-1859): Changing onboarding background color and removing overlay color, now it's always transparent
