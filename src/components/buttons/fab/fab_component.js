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
 * @file Fab component
 * @module web-components/buttons/fab/fab_component
 * @fires module:Fab#ON_OPEN
 * @fires module:Fab#ON_CLOSE
 * @see {@link https://web-components.hulilabs.xyz/components/fab} for demos and documentation
 */
define([
    'vue',
    'web-components/icons/icon_component',
    'web-components/tooltips/tooltip_component',
    'web-components/mixins/vue-refs_mixin',
    'text!web-components/buttons/fab/fab_template.html',
    'css-loader!web-components/buttons/fab/fab_styles.css'
],
function(
    Vue,
    Icon,
    Tooltip,
    VueRefsMixin,
    Template
) {
    'use strict';

    /**
     * List of Fab component events
     * @type {Object}
     */
    var EVENT = {
        ON_OPEN : 'open',
        ON_CLOSE : 'close'
    };

    /**
     * Modifiers for the size of the icon inside the button
     * @type {Object}
     */
    var ICON_SIZE = {
        MINI : 'wc-Icon--size-3x',
        NORMAL : 'wc-Icon--size-4x'
    };

    /**
     * Extra classes bound to the component depending on its state
     * @type {Object}
     */
    var MODIFIER = {
        MINI : 'is-mini',
        TOP_RIGHT : 'wc-Fab--topRight',
        BOTTOM_RIGHT : 'wc-Fab--bottomRight',
        BOTTOM_LEFT : 'wc-Fab--bottomLeft',
        TOP_LEFT : 'wc-Fab--topLeft'
    };

    /**
     * Possible values for the position prop of the FAB
     * @type {Object}
     */
    var POSITION = {
        TOP_RIGHT : 'top-right',
        BOTTOM_RIGHT : 'bottom-right',
        BOTTOM_LEFT : 'bottom-left',
        TOP_LEFT : 'top-left'
    };

    /**
     * Error messages exposed by the component
     * @type {Object}
     */
    var ERROR = {
        ACTIONS : 'FAB `actions` prop is invalid',
        POSITION : 'FAB `position` prop is invalid'
    };

    /**
     * Definition of the schema of the FAB actions
     * @typedef  {Object} FabAction
     * @property {string} name               - event's name that's going to be triggered when the action is clicked
     * @property {string} icon               - class that determines the icon displayed by the action
     * @property {string} tooltip            - text displayed by the tooltip when the action is hovered/focused
     * @property {string} [tooltipAlignment] - where the action's tooltip is displayed. Overwrites the default position
     * @property {Object} [classObject]      - optional classes that are injected to the actions. Can be used for giving
     *                                         custom styling to each action (e.g. changing the action's background color)
     */
    /**
     * Checks the compliance of the given `actions` property with the appropriate schema,
     * in order for the component to work properly.
     * @param  {FabAction[]} actions - array containing the definition of the actions to be used by the component
     * @return {boolean} whether or not every given action definition matches the appropriate structure
     */
    function _actionsValidator(actions) {
        var areActionsValid = Array.isArray(actions) && actions.reduce(function(result, action) {
            return result &&
                    action.hasOwnProperty('name') &&
                    action.hasOwnProperty('icon') &&
                    action.hasOwnProperty('tooltip');
        }, true);

        if (!areActionsValid) {
            throw new Error(ERROR.ACTIONS);
        }

        return areActionsValid;
    }

    /**
     * Ensures that the given `position` property is one of the component's supported fixed positions
     * @see web-components/buttons/fab/fab_component#POSITION
     * @param  {string} position - determines the component's aligment in the screen
     * @return {boolean} whether or not the given position corresponds to one that's supported
     */
    function _positionValidator(position) {
        var isPositionValid = position && Object.keys(POSITION).some(function(key) {
            return position === POSITION[key];
        });

        if (!isPositionValid) {
            throw new Error(ERROR.POSITION);
        }

        return isPositionValid;
    }

    var Fab = Vue.extend({
        name : 'FabComponent',

        mixins : [VueRefsMixin],

        template : Template,

        props : {
            /**
             * Definition of the actions for interaction with the component
             * @type {FabAction[]}
             */
            actions : {
                type : Array,
                required : true,
                validator : _actionsValidator
            },
            /**
             * Alignment of the main button and actions in the screen
             * @type {string}
             */
            position : {
                type : String,
                required : false,
                validator : _positionValidator,
                default : null
            },
            /**
             * Adds the modifier for displaying mini FAB styles
             * @type {boolean}
             */
            mini : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * If the component's behavior must match mobile devices requirements
             * @type {boolean}
             */
            isMobile : {
                type : Boolean,
                required : false,
                default : false
            },
            /**
             * Custom classes for having more control and customization over the component's styles
             * @type {Object}
             */
            classObject : {
                type : [Array, Object],
                required : false,
                default : null
            }
        },

        computed : {
            /**
             * Convenience value for knowing if the component's position is at the top of the
             * screen. Affects the alignment and order of the actions
             * @return {boolean}
             */
            isPositionTop : function() {
                return this.position === POSITION.TOP_RIGHT || this.position === POSITION.TOP_LEFT;
            },
            /**
             * Convenience value for knowing if the component's position is at the right side of the screen.
             * Affects the alignment of the tooltips
             * @return {boolean}
             */
            isPositionRight : function() {
                return this.position === POSITION.TOP_RIGHT || this.position === POSITION.BOTTOM_RIGHT;
            },
            /**
             * Determines if there are more actions that must be displayed other than the
             * main action. Those actions will appear on hover in desktop and when
             * the FAB is clicked in mobile devices
             * @return {boolean}
             */
            hasActions : function() {
                return this.actions && this.actions.length > 1;
            },
            /**
             * Convenience method for extracting the definition of the action that's going
             * to be triggered by the FAB. In desktop, it's represented by the FAB on hover
             * and it's triggered when it's clicked. This behavior is also present in mobile
             * devices when there are no more actions.
             * @return {FabAction}
             */
            mainAction : function() {
                return this.actions[0];
            },
            /**
             * Reverses the order of the given actions in order for displaying them appropriately
             * according to where the component is positioned in the screen
             * @return {FabAction[]}
             */
            orderedActions : function() {
                var actions = this.actions.slice();
                actions.splice(0, 1);
                return (!this.position || this.isPositionTop) ? actions : actions.reverse();
            },
            /**
             * Determines whether or not all the actions' tooltips must be "opened" when they appear
             * @return {boolean}
             */
            areTooltipsActive : function() {
                return this.isActive && this.isMobile;
            },
            /**
             * Builds the class object with the respective modifiers according to the
             * position and the mini properties for the component's appropriate styling
             * @return {Object}
             */
            fabClassObject : function() {
                var classObj = {},
                    positionModifier = this._getPositionModifier();

                classObj[MODIFIER.MINI] = this.mini;

                if (positionModifier) {
                    classObj[positionModifier] = true;
                }

                return classObj;
            },
            /**
             * Modifier for dealing with the actions' icon sizes
             * @return {string}
             */
            iconSizeModifier : function() {
                return this.mini ? ICON_SIZE.MINI : ICON_SIZE.NORMAL;
            },
            /**
             * Determines the actions' tooltips alignment according to the FAB's position
             * @return {string}
             */
            tooltipAlignment : function() {
                if (this.isPositionRight) {
                    return Tooltip.ALIGNMENT.LEFT;
                } else {
                    return Tooltip.ALIGNMENT.RIGHT;
                }
            }
        },

        data : function() {
            return {
                // Determines the component's active state (when it's hovered/clicked)
                isActive : false,
                // Flag used in mobile for matching the expected behavior when the FAB is clicked.
                // When there are many actions, the click will cause them to be displayed instead
                // of executing the main action.
                mainActionClicked : false
            };
        },

        methods : {
            /**
             * Displays the FAB extra actions (if any)
             * @fires module:Fab#ON_OPEN
             */
            open : function() {
                this.isActive = true;
                this._triggerEvent(EVENT.ON_OPEN);
            },
            /**
             * Hides the extra actions
             * @fires module:Fab#ON_CLOSE
             */
            close : function() {
                this.isActive = false;
                this.mainActionClicked = false;
                this._triggerEvent(EVENT.ON_CLOSE);
            },
            /**
             * Returns the appropriate modifier that determines the alignment of the FAB
             * in the screen. It's limited to a set of supported fixed positions
             * @return {string}
             * @private
             */
            _getPositionModifier : function() {
                switch (this.position) {
                    case POSITION.TOP_RIGHT :
                        return MODIFIER.TOP_RIGHT;
                    case POSITION.BOTTOM_RIGHT :
                        return MODIFIER.BOTTOM_RIGHT;
                    case POSITION.BOTTOM_LEFT :
                        return MODIFIER.BOTTOM_LEFT;
                    case POSITION.TOP_LEFT :
                        return MODIFIER.TOP_LEFT;
                }

                return null;
            },
            /**
             * Custom handler for the FAB's main action for the following scenarios:
             * 1. Mobile device & 1 action: the action must be executed when the button is clicked
             * 2. Mobile device & multiple actions: the click must display the extra actions.
             *                                      Double clicking the button will trigger the action
             * 3. Desktop: always triggers the main action when clicked
             * @private
             */
            _mainActionHandler : function() {
                if (!this.isMobile || this.mainActionClicked || !this.hasActions) {
                    this._triggerEvent(this.mainAction.name);
                } else {
                    this.mainActionClicked = true;
                }
            },
            /**
             * Triggers the given event for notifying the parent component that an action was executed
             * @param  {string} name - name of the action to be triggered
             * @private
             */
            _triggerEvent : function(name) {
                this.$emit(name);
            }
        },

        components : {
            'wc-icon' : Icon,
            'wc-tooltip' : Tooltip
        }
    });

    /**
     * Component-exposed events
     * @type {Object}
     */
    Fab.EVENT = EVENT;

    /**
     * Exposing allowed positions
     * @type {Object}
     */
    Fab.POSITION = POSITION;

    /**
     * Component-exposed errors
     * @type {Object}
     */
    Fab.ERROR = ERROR;

    /**
     * Component-exposed modifiers
     * @type {Object}
     */
    Fab.MODIFIER = MODIFIER;

    return Fab;
});
