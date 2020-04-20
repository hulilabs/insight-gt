# Utils
A collection of libraries that perform specific tasks that are shared among various components. Here's a list of the available ones:

## random.js
Random and pseudo id generation

### RandomUtil#getPseudoId
Generates a random string, suitable for components that require an `id` field, like selection controls

## animation.js
Animation & transition related generic helpers

### AnimationUtil#getTransitionEndProperty
Obtains `transitionend` event with Safari 8 fallback

### AnimationUtil#getAnimationEndProperty
Obtains `animationend` event with Safari 8 fallback

## adaptive.js
Provides media-query based device detection, returns singleton instance

### AdaptiveUtil#detect
Sets the current media name into the `AdaptiveUtil` instance

### AdaptiveUtil#isDesktop
Returns true if the current media is desktop

### AdaptiveUtil#isMobile
Returns true if the current media is mobile

## dom.js

### DOMUtil#getDocumentOffsetLeft
Calculate absolute element left position at document (not viewport)

### DOMUtil#getDocumentOffsetTop
Calculate absolute element top position at document (not viewport)

### DOMUtil#sumBranchProp
By recursion, traverse from element-[parents...]-viewport calculating a prop sum

## scroll.js
Provides scroll and element position in page (like offset) utilities

### ScrollUtil#getBlockedOffsetX()
Get the number of x-axis scroll pixels. Useful for calculating lost pixels on screen blocking

### ScrollUtil#getBlockedOffsetY()
Get the number of y-axis scroll pixels. Useful for calculating lost pixels on screen blocking

### ScrollUtil#toggleBodyPositionLock(Boolean shouldLockPosition)
Locks current scroll position.  If you need this functionality, consider using the `<wc-overlay>` component first

### ScrollUtil#offsetY(Element element)
Calculates element's offset from the top of the page
i.e. the sum of the current page scroll and the element's offset in the viewport

### ScrollUtil#scrollTo(Element element, Number|Boolean animationDuration)
Sets the page's vertical scroll to `element`'s position. If you pass an `animationDuration` in milliseconds it will add an animation, if you pass `true` it will animate the scroll with a default duration.

The scroll animation is made using the [Jump](http://callmecavs.com/jump.js/) vendor
