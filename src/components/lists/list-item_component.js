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
 * @file ListItem component
 * @module web-components/lists/list-item_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/list} for demos and documentation
 * @fires module:ListItem#ON_EXPANDED_CHANGED
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'text!web-components/lists/list-item_template.html',
    'css-loader!web-components/lists/list-item_styles.css'
],
function(
    Vue,
    Icon,
    Template
) {

    /**
     * List of ListItem component events
     * @type {Object}
     */
    var EVENT = {
        ON_EXPANDED_CHANGED : 'list-item-expanded-changed'
    };

    var LAYOUTS = {
        SINGLE : 'single',
        DOUBLE : 'double',
        TRIPLE : 'triple'
    };

    var ListItem = Vue.extend({
        name : 'ListItemComponent',
        template : Template,
        props : {
            /**
             * Block custom classes
             */
            blockClass : {
                type : Array,
                default : function() {
                    return [];
                }
            },

            /**
             * Sets the expanded state for the expandable list items
             */
            expanded : {
                type : Boolean,
                default : false
            },
            /**
             * Disables the list item
             */
            disabled : {
                type : Boolean,
                required : false
            },
            /**
             * Defines the horizontal padding of an item
             */
            horizontalPadding : {
                type : [String, Number],
                default : 2
            },
            /**
             * Important : This prop only works when the layout is single
             * Allows multiline text.
             */
            multiline : {
                type : Boolean,
                default : false
            },
            /**
             * Material design provides three kind of list, single, double or triple line, this property sets
             * the desired layout
             * @param {String} [layout] - three kind options: 'single', 'double' or 'triple'
             */
            layout : {
                type : String,
                default : LAYOUTS.SINGLE,
                required : false,
                validator : function(value) {
                    return (value && (value === LAYOUTS.SINGLE || value === LAYOUTS.DOUBLE || value === LAYOUTS.TRIPLE));
                }
            },
            /**
             * Primary text classes
             */
            primaryTextClass : {
                type : [String, Object, Array]
            },
            /**
             * Secondary text classes
             */
            secondaryTextClass : {
                type : [String, Object, Array]
            },
            /**
             * Wrapper custom classes
             */
            wrapperClass : {
                type : Array,
                default : function() {
                    return [];
                }
            },
            /**
             * Value of the list item
             */
            value : {
                type : [String, Number],
                required : false,
                default : null
            }
        },
        computed : {
            /**
             * Computes the classes that will be added to the action
             * element according to the state of the component.
             * @return {Object} state's classes of the action element
             */
            actionClassObject : function() {
                return {
                    'wc-ListItem__action--rotated' : this.state.isExpanded
                };
            },
            /**
             * Computes the classes that will be added to the avatar
             * element according to the state of the component.
             * @return {Object} state's classes of the avatar element
             */
            avatarClassObject : function() {
                return {
                    'wc-ListItem__avatar--double' : this.isDouble,
                    'wc-ListItem__avatar--triple' : this.isTriple
                };
            },
            /**
             * Computes the classes that will be added to the list
             * item block according to the state of the component.
             * @return {Array} state's classes of the list item block
             */
            blockClassObject : function() {
                var classes = [];

                // Define horizontal padding
                classes.push('wc-ListItem--horizontalPadding' + this.horizontalPadding + 'x');

                // Define number of lines
                classes.push({
                    'wc-ListItem--double' : this.isDouble,
                    'wc-ListItem--triple' : this.isTriple
                });

                // Additional modifiers
                classes.push({
                    'is-expandable' : this.hasDescription,
                    'is-expanded' : this.state.isExpanded,
                    'is-multiple-expanded' : this.state.isExpanded && (this.isDouble || this.isTriple),
                    'wc-ListItem--multiline' : this.multiline
                });

                classes = classes.concat(this.blockClass);

                return classes;
            },
            /**
             * Computes the classes that will be added to the text wrapper
             * element according to the state of the component.
             * @return {Object} state's classes of the text wrapper element
             */
            textWrapperClassObject : function() {
                return {
                    'is-expanded' : this.state.isExpanded && !this.isDouble && !this.isTriple && !this.multiline
                };
            },
            /**
             * Computes the classes that will be added to the wrapper
             * element according to the state of the component.
             * @return {Object} state's classes of the wrapper element
             */
            wrapperClassObject : function() {
                var classes = {
                    'wc-ListItem__wrapper--clickable' : this.hasDescription,
                    'wc-ListItem__wrapper--singleExpandable' : this.hasDescription && !this.isDouble && !this.isTriple,
                    'is-expanded' : this.hasDescription && (this.isDouble || this.isTriple)
                };

                // merge the array of custom wrapper classes
                for (var i = 0; i < this.wrapperClass.length; i++) {
                    classes[this.wrapperClass[i]] = true;
                }

                return classes;
            }
        },
        data : function() {
            return {
                // those has*Options flags are used to indicate if the slot has content
                hasAvatar : false,
                hasIcon : false,
                hasPrimaryText : false,
                hasSecondaryText : false,
                hasAction : false,
                hasCheckbox : false,
                hasRadioButton : false,
                hasText : false,
                // flag used when the list item is expandable (has description)
                hasDescription : false,
                // flag used when the layout is double
                isDouble : this.layout === LAYOUTS.DOUBLE,
                // flag used when the layout is triple
                isTriple : this.layout === LAYOUTS.TRIPLE,
                state : {
                    isExpanded : this.expanded
                }
            };
        },
        mounted : function() {
            this._checkSlots();
            this._attachExpandListener();
        },
        updated : function() {
            this._checkSlots();
        },
        methods : {
            /**
             * Sets the isExpanded state
             * @param {Boolean} isExpanded
             * @fires module:ListItem#ON_EXPANDED_CHANGED
             */
            setExpanded : function(isExpanded) {
                /**
                 * @typedef {onExpandedChangedPayload}
                 * @property {Boolean} isExpanded isExpanded state
                 */
                var payload = {
                    isExpanded : isExpanded
                };

                this.state.isExpanded = isExpanded;

                this.$emit(EVENT.ON_EXPANDED_CHANGED, payload);
            },
            /**
             * Sets the state flags that indicate if the slots have content
             * @private
             */
            _checkSlots : function() {
                this.hasAvatar = this._hasContent('avatar');
                this.hasIcon = this._hasContent('icon');
                this.hasPrimaryText = this._hasContent('primaryText') || this._hasContent('default');
                this.hasSecondaryText = this._hasContent('secondaryText');
                this.hasAction = this._hasContent('action');
                this.hasCheckbox = this._hasContent('checkbox');
                this.hasRadioButton = this._hasContent('radioButton');
                this.hasDescription = this._hasContent('description');
                this.hasDefaultContent = this._hasContent('default');
                this.hasText = this.hasPrimaryText || this.hasSecondaryText;
            },
            /**
             * Checks if the slot(DOM) has content
             * @param {String} slot - slot name
             * @return {Boolean}
             * @private
             */
            _hasContent : function(slot) {
                return this.$slots[slot] && this.$slots[slot].length > 0;
            },
            /**
             * Attaches a click listener if the list item contains description
             * @private
             */
            _attachExpandListener : function() {
                if (this.hasDescription) {
                    this.$refs.listItemWrapper.addEventListener('click', this._toggleExpandedState.bind(this));
                }
            },
            /**
             * Toggles the isExpanded state prop
             * @private
             */
            _toggleExpandedState : function() {
                this.setExpanded(!this.state.isExpanded);
            }

        },
        watch : {
            /**
             * Updates the value of the isExpanded state when the expanded prop change
             * @param {Boolean} isExpanded
             */
            expanded : function(isExpanded) {
                this.state.isExpanded = isExpanded;
            }
        },
        components : {
            'wc-icon' : Icon
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    ListItem.EVENT = EVENT;

    return ListItem;
});
