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
 * @file Floating layer documentation page
 * @requires vue
 * @requires web-components/behaviors/floating-layer/floating-layer_behavior
 * @requires web-components/mixins/floating-layer/floating-layer_mixin
 * @requires web-components/markdown/markdown_component
 * @requires text!pages/typography/typography-page_template.html
 * @requires text!web-components/behaviors/floating-layer/readme.md
 * @requires text!web-components/mixins/floating-layer/readme.md
 * @requires site/css/components/pages/floating-layer-page.css
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/behaviors/floating-layer} for demos and documentation
 */
define([
    'vue',
    'web-components/behaviors/floating-layer/floating-layer_behavior',
    'web-components/mixins/floating-layer/floating-layer_mixin',
    'web-components/markdown/markdown_component',
    'text!pages/behaviors/floating-layer/floating-layer-page_template.html',
    'text!web-components/behaviors/floating-layer/readme.md',
    'text!web-components/mixins/floating-layer/readme.md',
    'css-loader!site/css/components/pages/floating-layer-page.css'
], function(
    Vue,
    FloatingLayerBehavior,
    FloatingLayerMixin,
    Markdown,
    Template,
    FloatingLayerBehaviorReadme,
    FloatingLayerMixinReadme
) {

    var FloatingLayerPage = Vue.extend({
        name : 'FloatingLayerPage',
        mixins : [FloatingLayerMixin],
        template : Template,
        data : function() {
            return {
                // Model properties
                blockAlignment : 'top-left',
                blockHeight : 260,
                blockWidth : 340,
                connector : true,
                direction : null,
                offset : 0,
                smart : false,
                triggerAlignment : 'top-left',
                // Readme
                markdownSource : {
                    behaviorDocumentation : FloatingLayerBehaviorReadme,
                    mixinDocumentation : FloatingLayerMixinReadme
                }
            };
        },
        computed : {
            floatingLayerFloatingOrigin : function() {
                return this._transformFloatingOrigin(this.blockAlignment);
            },
            floatingLayerTriggerOrigin : function() {
                return this._transformFloatingOrigin(this.triggerAlignment);
            },
            /**
             * Required computed variable for floating layer binder setup
             * Bypasses isActive state for reactivity
             */
            floatingLayerState : {
                get : function() {
                    return this.state.isActive;
                },
                set : function(isActive) {
                    this.state.isActive = isActive;
                }
            }
        },
        mounted : function() {
            // Add class to html element
            document.documentElement.classList.add('is-floatingLayerPage');
            this._applyBehavior();
        },
        methods : {
            /**
             * Adds floating layer behavior on mounted
             * @private
             */
            _applyBehavior : function() {
                Vue.nextTick(function() {
                    this.bindFloatingLayerBehavior({
                        computedStateKey : 'floatingLayerState',
                        floatingConnector : this.connector,
                        floatingElementReferenceKey : 'block',
                        floatingOffset : this.offset,
                        floatingSmart : this.smart,
                        triggerElement : this.$refs.trigger,
                        triggerEvent : FloatingLayerBehavior.EVENT.CLICK
                    });
                }.bind(this));
            },
            /**
             * Triggers floating layer reposition
             * @private
             */
            _repositionBehavior : function() {
                if (this.isFloatingBehaviorBound()) {
                    // Vue.nextTick enables waiting for width/height updates before repositioning
                    Vue.nextTick(function() {
                        this.getFloatingBehavior().reposition();
                    }.bind(this));
                }
            },
            /**
             * Handles on drag start event of trigger block sandbox
             * @param  {Event} e
             * @private
             */
            _onDragStart : function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('innerX', e.offsetX);
                e.dataTransfer.setData('innerY', e.offsetY);
                e.dataTransfer.setData('text', '*');
            },
            /**
             * Handles on drag over event of trigger block sandbox
             * @param  {Event} e
             * @private
             */
            _onDragOver : function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this._repositionBehavior();
            },
            /**
             * Handles on drop event of trigger block sandbox
             * @param  {Event} e
             * @private
             */
            _onDrop : function(e) {
                e.preventDefault();
                e.stopPropagation();
                var top = (e.y - parseInt(e.dataTransfer.getData('innerY'))) + 'px',
                    left = (e.x - parseInt(e.dataTransfer.getData('innerX'))) + 'px';
                this.$refs.sandbox.style.top = top;
                this.$refs.sandbox.style.left = left;
                this._repositionBehavior();
            }
        },
        destroyed : function() {
            // Remove class from to html element
            document.documentElement.classList.remove('is-floatingLayerPage');
        },
        watch : {
            blockAlignment : function(newValue) {
                this.getFloatingBehavior().setBlockOrigin(this.floatingLayerFloatingOrigin);
                if (newValue !== null) {
                    this.direction = null;
                    this.smart = false;
                }
                this._repositionBehavior();
            },
            blockHeight : function() {
                // height is binded via inline styles
                // Vue.nextTick waits for update to happen before repositioning
                this._repositionBehavior();
            },
            blockWidth : function() {
                // width is binded via inline styles
                // Vue.nextTick waits for update to happen before repositioning
                this._repositionBehavior();
            },
            connector : function(newValue) {
                newValue = !!newValue;
                this.getFloatingBehavior().toggleConnector(newValue);
                this._repositionBehavior();
            },
            direction : function(newValue) {
                this.getFloatingBehavior().setDirection(newValue);
                if (newValue !== null) {
                    this.smart = null;
                    this.blockAlignment = null;
                }
                this._repositionBehavior();
            },
            offset : function(newValue) {
                this.getFloatingBehavior().setOffset(newValue);
                this._repositionBehavior();
            },
            smart : function(newValue) {
                newValue = !!newValue;
                this.getFloatingBehavior().setSmart(newValue);
                if (newValue === true) {
                    this.direction = null;
                    this.blockAlignment = null;
                }
                this._repositionBehavior();
            },
            triggerAlignment : function() {
                this.getFloatingBehavior().setTriggerOrigin(this.floatingLayerTriggerOrigin);
                this._repositionBehavior();
            }
        },
        components : {
            'wc-markdown' : Markdown
        }
    });

    return FloatingLayerPage;
});
