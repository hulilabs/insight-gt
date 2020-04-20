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
 * @file Saver component
 * @requires vue
 * @requires web-components/savers/saver_template.html
 * @requires web-components/savers/saver_styles.css
 * @module web-components/savers/saver_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/saver} for demos and documentation
 */
define([
    'vue',
    'web-components/utils/animation',
    'text!web-components/savers/saver_template.html',
    'css-loader!web-components/savers/saver_styles.css'
],
function(
    Vue,
    AnimationUtil,
    Template
) {
    /**
     * List of saver component events
     * @type {Object}
     */
    var EVENT = {
        ON_CLOSE : 'saver-close'
    };

    var FADE_OUT_ANIMATION_NAME = 'fadeOut',
        CHECK_MARK_ANIMATION = 'checkMaker';

    /**
     * Default values for the circle's dimensions according to design guidelines
     * @type {Object}
     */
    var DEFAULT_VALUES = {
        CX : '12px',
        CY : '12px',
        R : '10px'
    };

    var Saver = Vue.extend({
        name : 'SaverComponent',
        template : Template,

        props : {
            /**
             * Shows the animation of the circle and the checker and keeps it
             * vissible once it has finished.
             */
            keepVisible : {
                type : Boolean,
                required : false,
                default : false
            }
        },

        data : function() {
            return {
                defaultValues : DEFAULT_VALUES,
                preventAnimations : false
            };
        },
        mounted : function() {
            this._addAnimationListener();
        },
        methods : {
            /**
             * Adds a listener for the animationend event
             */
            _addAnimationListener : function() {
                this.$el.addEventListener(AnimationUtil.getAnimationEndProperty(), this.close.bind(this));
            },
            /**
             * Used to trigger the ON_CLOSE event
             * @fires module:Saver#ON_CLOSE
             */
            close : function(event) {
                /**
                 * This condition is used because the component listen when the last animation ends
                 * In this case is the fade out animation
                 */
                if (event.animationName === FADE_OUT_ANIMATION_NAME) {
                    this.$emit(EVENT.ON_CLOSE);
                }

                if (event.animationName === CHECK_MARK_ANIMATION && this.keepVisible) {
                    this.$emit(EVENT.ON_CLOSE);
                    this.preventAnimations = this.keepVisible;
                }
            }
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Saver.EVENT = EVENT;

    return Saver;
});
