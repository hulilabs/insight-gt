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
 * @file
 * @requires vue
 * @requires web-components/utils/animation
 * @requires web-components/effects/ripple/ripple_template.html
 * @requires web-components/effects/ripple/static-ripple_styles.css
 * @module web-components/effects/ripple/ripple_component
 */
define([
    'vue',
    'web-components/utils/animation',
    'text!web-components/effects/ripple/ripple_template.html',
    'css-loader!web-components/effects/ripple/static-ripple_styles.css',
],
function(
    Vue,
    AnimationUtil,
    Template
) {

    // animated ripple class added when visible
    var RIPPLE_ANIMATED_STATE_CLASS = 'has-ripple',
        RIPPLE_STATIC_VISIBLE_STATE_CLASS = 'is-visible';

    var Ripple = Vue.extend({
        name : 'RippleComponent',
        template : Template,
        props : {
            // TODO
            // add `inset` property and support for current ripple effect
            // might be addressed as part of HULI-1647
        },

        methods : {
            /**
             * displays ripple animation
             */
            animate : function() {
                var animationEndEvent = AnimationUtil.getAnimationEndProperty();

                var rippleElement = this.$el;
                var listener = function() {
                    rippleElement.classList.remove(RIPPLE_ANIMATED_STATE_CLASS);
                    rippleElement.removeEventListener(animationEndEvent, listener);
                };

                // checks first if the element isn't on visible ripple state
                // to prevent duplicated binding
                if (!this.hasAnimatedRipple()) {
                    rippleElement.addEventListener(animationEndEvent, listener);
                    rippleElement.classList.add(RIPPLE_ANIMATED_STATE_CLASS);
                }
            },

            /**
             * Shows ripple, no animation
             */
            show : function() {
                this.$el.classList.add(RIPPLE_STATIC_VISIBLE_STATE_CLASS);
            },

            /**
             * Hides ripple only if shown using `show`, without animation
             */
            hide : function() {
                this.$el.classList.remove(RIPPLE_STATIC_VISIBLE_STATE_CLASS);
            },

            /**
             * Is the component currently displaying an animated ripple effect?
             * @return {Boolean}
             */
            hasAnimatedRipple : function() {
                return this.$el.classList.contains(RIPPLE_ANIMATED_STATE_CLASS);
            },

            /**
             * Is the component currently displaying a static ripple effect?
             * @return {Boolean} [description]
             */
            hasStaticRipple : function() {
                return this.$el.classList.contains(RIPPLE_STATIC_VISIBLE_STATE_CLASS);
            }
        }
    });

    return Ripple;
});
