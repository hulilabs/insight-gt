# General description
Adds Ripple effect to any DOM element. See references section for more details.

There are currently two ways of adding a ripple effect. There's work in progress to unify them, but in the meantime here are the differences:

* **Using a `v-wc-ripple` helper/directive**
Adds ripple effects that grows from any clicked point from inside a component. You can see the `<wc-raised-button>` and `<wc-flat-button>` components as examples.

* **Using the `<wc-ripple>` component**
Adds ripple with fixed point of origin, that grows from a component's center to outside. An example is the `checkbox` component.

# Ripple helper documentation (`RippleEffect.js`)

### Structure
This is based in `waves` vendor (@see references section), but a BEM block called `wc-Ripple` is added to the root element. In case you want to add additional colors, you can use a modifier to change the background color to be displayed, example:

```css
.wc-Ripple {
    &.is-blue {
        .waves-ripple {
            background-color: blue;
        }
    }
}
```

## API

### Methods

#### RippleEffect#bind
Main API method to add the effect to any DOM element, the following are the accepted arguments:

| Name | Type | Description
| --- | --- | ---
| element | Element | DOM element to add ripple to
| opts | Object | additional configuration for the ripple effect
| opts.modifier | String | modifier to add to `wc-Ripple` block. Modifiers `is-light` and `is-dark` are provided by default
| opts.duration | Number | allows overriding the default 300ms default ripple duration, use it wisely

#### Usage example
* Javascript

```javascript
// inside a component's `mounted` hook
RippleEffect.bind(this.$el, {modifier: 'is-dark'});
```

* Ripples effect directive

```html
<!-- Applies directive with is-light modifier -->
<wc-Component v-wc-ripple:is-light> </wc-Component>
```

# `<wc-ripple>` component documentation
You can add a fixed origin ripple effect that grows outside of a component, by adding a `<wc-ripple>` tag.

Currently, it doesn't takes any arguments and grows to a fixed 250% size of the parent's tag.

*Please consider the current constrains*

* You have to programatically show/hide this component using `Ripple#animate` when the user interacts with this component, and `show/hide` for focus (if needed).
* The parent element MUST have overflow: visible
* There must be a parent element with `relative` positioning or something that allows this component's `absolute` position.

## API

### Methods
#### Ripple#animate
Displays ripple effect that grows with an animation and then hides.

#### Ripple#show
Displays ripple effect without an animation.

#### Ripple#hide
Hides ripple effect previously shown using `Ripple#show`

### Examples
```html
<!-- assumes it's a part of a component that implements `showRipple` as `this.$refs.ripple.animate()` -->
<div v-bind:click="showRipple" style="position:relative; height:100px; width:100px; overflow: visible;">
    <wc-ripple ref="ripple" static></wc-ripple>
</div>
```

## References
* [Google's Material's ripple effect](https://material.google.com/motion/choreography.html#choreography-radial-reaction)
* [Waves library](https://github.com/fians/Waves)
* [Ripple effect directive](../../directives/ripple-effect)
