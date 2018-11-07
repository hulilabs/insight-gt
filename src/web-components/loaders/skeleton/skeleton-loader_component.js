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
 * @file Skeleton Loader component
 * @module web-components/loaders/skeleton/skeleton-loader_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/loaders/skeleton} for demos and documentation
 */
define([
    'vue',
    'text!web-components/loaders/skeleton/skeleton-loader_template.html',
    'css-loader!web-components/loaders/skeleton/skeleton-loader_styles.css'
],
function(
    Vue,
    Template
) {
    var LAYOUTS = {
        CARD : 'card',
        DOCUMENT : 'document',
        ID_CARD : 'id-card',
        LIST : 'list',
        TABLE : 'table',
        TABLE_DOCUMENT : 'table-document'
    };

    var LAYOUT_HEIGHTS = {
        CARD : 192,
        DOCUMENT : 508,
        ID_CARD : 128,
        LIST : 72,
        TABLE : 80,
        TABLE_DOCUMENT : 80
    };

    var SkeletonLoader = Vue.extend({
        name : 'SkeletonLoaderComponent',
        template : Template,
        props : {
            /**
             * displays the loading animation
             */
            animated : {
                type : Boolean,
                default : false
            },
            /**
             * Fills the height of the component with items
             * when using this prop the length is discarded
             */
            autofill : {
                type : Boolean,
                default : false
            },
            /**
             * The loader supports 6 different layouts:
             * 'card', 'document', id-card', 'list', 'table' or 'table-document'
             *
             * Default value is 'list'
             */
            layout : {
                type : String,
                default : LAYOUTS.LIST,
                validator : function(value) {
                    return (value && (
                        value === LAYOUTS.CARD ||
                        value === LAYOUTS.DOCUMENT ||
                        value === LAYOUTS.ID_CARD ||
                        value === LAYOUTS.LIST ||
                        value === LAYOUTS.TABLE ||
                        value === LAYOUTS.TABLE_DOCUMENT
                    ));
                }
            },
            /**
             * Number of items to show
             */
            length : {
                type : Number,
                default : 1
            },
            /**
             * Adds a shadow to the item
             */
            shadow : {
                type : Boolean,
                default : false
            }
        },
        data : function() {
            return {
                state : {
                    length : this.length
                },
                /**
                 * Known layouts
                 */
                LAYOUTS : LAYOUTS
            };
        },
        mounted : function() {
            if (this.autofill) {
                var layoutHeight = 1;
                switch (this.layout) {
                    case LAYOUTS.CARD:
                        layoutHeight = LAYOUT_HEIGHTS.CARD;
                        break;
                    case LAYOUTS.DOCUMENT:
                        layoutHeight = LAYOUT_HEIGHTS.DOCUMENT;
                        break;
                    case LAYOUTS.ID_CARD:
                        layoutHeight = LAYOUT_HEIGHTS.ID_CARD;
                        break;
                    case LAYOUTS.LIST:
                        layoutHeight = LAYOUT_HEIGHTS.LIST;
                        break;
                    case LAYOUTS.TABLE:
                        layoutHeight = LAYOUT_HEIGHTS.TABLE;
                        break;
                    case LAYOUTS.TABLE_DOCUMENT:
                        layoutHeight = LAYOUT_HEIGHTS.TABLE_DOCUMENT;
                        break;
                }
                this.state.length = Math.floor(this.$el.offsetHeight / layoutHeight);
            }
        },
        computed : {
            styleClass : function() {
                return {
                    'is-animated' : this.animated,
                    'wc-SkeletonLoaderItem--shadow' : this.shadow,
                    'wc-SkeletonLoaderItem--card' : this.layout === LAYOUTS.CARD,
                    'wc-SkeletonLoaderItem--document' : this.layout === LAYOUTS.DOCUMENT,
                    'wc-SkeletonLoaderItem--idCard' : this.layout === LAYOUTS.ID_CARD,
                    'wc-SkeletonLoaderItem--table' : this.layout === LAYOUTS.TABLE,
                    'wc-SkeletonLoaderItem--tableDocument' : this.layout === LAYOUTS.TABLE_DOCUMENT
                };
            }
        },
        watch : {
            length : function(newLength) {
                this.state.length = newLength;
            }
        }
    });

    return SkeletonLoader;
});
