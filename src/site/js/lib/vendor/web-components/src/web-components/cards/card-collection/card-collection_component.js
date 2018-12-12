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
 * @file CardCollection component
 * @requires vue
 * @requires web-components/utils/scroll/scroll
 * @requires web-components/utils/adaptive/adaptive
 * @requires web-components/cards/card/card_component
 * @requires web-components/cards/card-collection/card-orchestrator
 * @requires web-components/cards/card-collection/card-collection_template.html
 * @requires web-components/cards/card-collection/card-collection_styles.css
 * @module web-components/cards/card-collection/card-collection_component
 * @extends Vue
 * @see {@link https://web-components.hulilabs.xyz/components/card} for demos and documentation
 */
define([
    'vue',
    'web-components/utils/scroll/scroll',
    'web-components/utils/adaptive/adaptive',
    'web-components/cards/card/card_component',
    'web-components/cards/card-collection/card-orchestrator',
    'web-components/helper/vue-refs-helper',
    'text!web-components/cards/card-collection/card-collection_template.html',
    'css-loader!web-components/cards/card-collection/card-collection_styles.css'
],
function(
    Vue,
    ScrollUtil,
    AdaptiveUtil,
    Card,
    CardOrchestrator,
    VueRefsHelper,
    Template
) {

    var CardCollection = Vue.extend({
        template : Template,
        props : {
            /**
             * turns on card orchestration, for centralized state management
             * with event based transactions that can be cancelled
             *
             * see the card collection's readme file for more details and examples
             */
            orchestrate : {
                type : Boolean,
                default : true
            },

            /**
             * Should an overlay cover the resting cards when there's a raised one?
             */
            hasOverlay : {
                type : Boolean,
                default : true,
            },

            /**
             * Should scroll to card on interaction?
             */
            scrollToCard : {
                type : Boolean,
                default : true
            },

            /**
             * Card collection parent container, useful to manage scrolling
             * when the scroll isn't bound to a relative container instead of the window
             * @type {Object}
             */
            container : VueRefsHelper.prop(false)
        },

        mounted : function() {
            this._bindOrchestration(CardOrchestrator);
        },

        data : function() {
            return {
                state : {
                    hasOpenCard : false
                },
                // Scrolls to a just closed card if we're not opening another
                // and when not in mobile
                scrollToClosingCard : this.scrollToCard && !AdaptiveUtil.isMobile()
            };
        },

        methods : {
            /**
             * Adds orchestration to manage card change events in a smart way
             * @param  {CardOrchestrator} CardOrchestrator - orchestrator definition to bind
             */
            _bindOrchestration : function(CardOrchestrator) {
                if (this.orchestrate) {
                    // causes this.$el to trigger a transactional `card change event`
                    // everytime a change is made to the card group state
                    var cardOrchestrator = new CardOrchestrator(this.$el, {
                        scrollToActiveCard : this.scrollToCard
                    });

                    // listens for event triggered by the orchestrator
                    this.$el.addEventListener(CardOrchestrator.EVENT.CHANGE, this._onCardChange.bind(this));
                    cardOrchestrator.bind();
                }
            },

            /**
             * When the card collection state changes (i.e. a card was open/closed/etc.)
             * we will update the state to know if there's an open card
             * and to perform the proper side effects
             * @param  {CustomEvent} e - custom card change event
             */
            _onCardChange : function(e) {

                // there are no opening cards
                if (e.detail.type === CardOrchestrator.CHANGE.CLOSE || CardOrchestrator.CHANGE.FOCUS) {
                    this.state.hasOpenCard = false;
                }

                if (e.detail.type === CardOrchestrator.CHANGE.CLOSE) {
                    this._ensureClosingCardIsVisible(e);
                }

                // there's an opening card
                if (e.detail.type === CardOrchestrator.CHANGE.OPEN) {
                    this.state.hasOpenCard = true;
                    this._ensureOpeningCardIsVisible(e.detail.openingCard, e.detail.closingCard);
                }
            },

            /**
             * When a card is closed and other card won't be opened later in the same transaction
             * scrolls the page to the closed card
             * @param  {CustomEvent} closeEvent `CardOrchestrator.CHANGE.CLOSE` custom event
             */
            _ensureClosingCardIsVisible : function(closeEvent) {
                // when a card is closed (and no card will be opened later) ensures
                // that it remains in the visible section of the screen if either:
                // + it was closed due to a blur and there's a related target that isn't this card collection
                // + it was closed and there's no related target, which means the user isn't attempting to interact
                //   with another element; which usually happens because the user closed the card alone, doing
                //   something like cliking in the header
                if (this.scrollToClosingCard && !this._isCloseFocusingAnotherElement(closeEvent, this.$el)) {
                    this._scrollCardIntoView(closeEvent.detail.closingCard);
                }
            },

            /**
             * Checks if a close event is attempting to focus an element different than
             * this collection
             * @param  {CustomEvent} closeEvent `CardOrchestrator.CHANGE.CLOSE` custom event
             */
            _isCloseFocusingAnotherElement : function(closeEvent, currentCardCollectionElement) {
                return closeEvent.detail &&
                       closeEvent.detail.eventInfo &&
                       closeEvent.detail.eventInfo.close &&
                       closeEvent.detail.eventInfo.close.relatedTarget != currentCardCollectionElement;
            },

            /**
             * Ensures that a recently opened card is visible on the screen:
             * + If a card is opening after another one above is closing, we have to wait until
             *   the closing one finishes its transition, because the vertical offset of the opening card
             *   wil be shrinking and isn't safe to scroll to it until it's stable
             * + If not, we can scroll to the opening card with no worries
             * @param  {Card}  openingCard opening card component
             * @param  {?Card} closingCard closing card component
             */
            _ensureOpeningCardIsVisible : function(openingCard, closingCard) {
                if (this.scrollToCard) {

                    if (this._isClosingCardAboveOpeningCard(openingCard, closingCard)) {
                        closingCard.$once(Card.EVENT.TRANSITION_END, this._scrollCardIntoView.bind(this, openingCard));
                    } else {
                        openingCard.$once(Card.EVENT.TRANSITION_END, this._scrollCardIntoView.bind(this, openingCard));
                    }
                }
            },

            /**
             * Checks if a closing card (if any) is above an opening card
             * @param  {Card}  openingCard opening card component
             * @param  {?Card} closingCard closing card component
             */
            _isClosingCardAboveOpeningCard : function(openingCard, closingCard) {
                return closingCard && ScrollUtil.offsetY(openingCard.$el) > ScrollUtil.offsetY(closingCard.$el);
            },

            /**
             * Scrolls a card to center it on the screen
             * @param  {Element} card.$el a card component's root Element
             */
            _scrollCardIntoView : function(card) {
                if (card && card.$el) {
                    ScrollUtil.adjustVerticallyIntoView(card.$el, false, this._getContainer());
                }
            },

            /**
             * Resolves reference to container element
             * @return {?Element}
             */
            _getContainer : function() {
                return this.container ? VueRefsHelper.resolveVueRef(this.container) : null;
            }
        }
    });

    return CardCollection;
});
