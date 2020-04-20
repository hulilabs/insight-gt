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
 * @file CardOrchestrator - allows unified management of events triggered by <wc-card> component
 * @requires vue
 * @requires web-components/cards/card/card_component
 * @module web-components/cards/card-collection/card-orchestrator
 * @extends Vue
 */
define([
    'web-components/cards/card/card_component'
],
function(
    Card
) {
    var CARD_COLLECTION_ELEMENT = 'wc-CardCollection__card';

    var CardOrchestrator = function(cardCollectionElement) {
        this.cardCollectionElement = cardCollectionElement;

        this.transaction = this._getNewtransaction();
    };

    CardOrchestrator.prototype = {
        /**
         * main API method, to attach a handler to the card change event
         * triggered by this.cardCollectionElement
         */
        bind : function() {
            this.cardCollectionElement.addEventListener(Card.EVENT.CLOSE, this._onCardClose.bind(this));

            this.cardCollectionElement.addEventListener(Card.EVENT.OPEN, this._onCardOpen.bind(this));

            this.cardCollectionElement.addEventListener(Card.EVENT.FOCUS, this._onCardFocus.bind(this));
        },

        /**
         * When a custom `card-close` event is detected, it will be commited if:
         * - The related element (i.e. the one causing the card to close) isn't a card
         * - The related element is a card, but it's not part of this collection
         *
         * If the related element is a card and it's part of the current collection,
         * we will wait until a `card-open` event appears to commit the transaction
         *
         * @param  {CustomEvent} e `card-close` event
         */
        _onCardClose : function(e) {
            this.transaction.closingCard = e.detail.targetCard;
            // adds the related target to the close event (if any)
            this.transaction.eventInfo.close = {
                relatedTarget : e.detail.relatedTarget
            };

            e.preventDefault();

            // if the blur isn't related to another card
            // we can trigger the change transaction right away
            //
            // otherwise, we'll wait for a card-open event and leave this one cancelled
            if (!e.detail.relatedTarget ||
                // close if the related targe isn't a card
                !this._isCardCollectionElement(e.detail.relatedTarget) ||
                // or if the related element is a card but not part of this collection
                (this._isCardCollectionElement(e.detail.relatedTarget) && !this.cardCollectionElement.contains(e.detail.relatedTarget))) {
                this._commitChange(CardOrchestrator.CHANGE.CLOSE);
            }
        },

        /**
         * When a custom `card-open` event is detected, we can commit the current transaction
         * @param  {CustomEvent} e `card-open` event
         */
        _onCardOpen : function(e) {
            this.transaction.openingCard = e.detail.targetCard;
            e.preventDefault();

            // dispatches change transaction
            this._commitChange(CardOrchestrator.CHANGE.OPEN);
        },

        /**
         * When a custom `card-focus` event is detected, we can commit the current transaction
         * if the focus isn't related to an open attempt
         * @param  {CustomEvent} e - `card-focus` event
         * @param  {Boolean} e.details.hasOpenAttempt - set to true if the focus is the result of an open attempt
         */
        _onCardFocus : function(e) {
            this.transaction.focusingCard = e.detail.targetCard;
            e.preventDefault();

            if (!e.detail.hasOpenAttempt) {
                // we commit the change only if we're sure that there's not
                // an open attempt
                //
                // because, if there's an open attempt
                // we need to leave the focus in the transaction, so it can be
                // handled later by an open attempt
                this._commitChange(CardOrchestrator.CHANGE.FOCUS);
            }
        },

        /**
         * Finishes a transaction by triggering a CustomEvent and executing all the pending
         * changes stored in `this.transaction` by calling `this._executeTransactionQueue` if
         * the change event isn't cancelled
         * @param  {String} type - a member of CardOrchestrator.CHANGE
         */
        _commitChange : function(type) {
            this.transaction.type = type;

            var cardChangeEvent = new CustomEvent(CardOrchestrator.EVENT.CHANGE, {
                cancelable : true,
                bubbles : true,
                detail : this.transaction
            });

            var cancelled = !this.cardCollectionElement.dispatchEvent(cardChangeEvent);
            if (!cancelled) {
                this._executeTransactionQueue();
            }

            this.transaction = this._getNewtransaction();
        },

        /**
         * Executes all the pending actions inside a transaction
         */
        _executeTransactionQueue : function() {

            if (this.transaction.closingCard) {
                this.transaction.closingCard.close();
            }

            if (this.transaction.focusingCard) {
                this.transaction.focusingCard.focus();
            }

            if (this.transaction.openingCard) {
                this.transaction.openingCard.open();
            }
        },

        /**
         * Sets the transaction object to its empty state
         */
        _getNewtransaction : function() {
            return {
                // event info contains more details about the event
                // currently, it's only being used to add more details about `close` event
                eventInfo : {},
                closingCard : null,
                focusingCard : null,
                openingCard : null,
                type : null
            };
        },

        /**
         * Returns true if a provided Element is a card collection item, false otherwise
         * @param  {Element}  element
         * @return {Boolean}
         */
        _isCardCollectionElement : function(element) {
            return element.classList.contains(CARD_COLLECTION_ELEMENT);
        }
    };

    CardOrchestrator.EVENT = {
        // event to be triggered when a card transaction commits
        CHANGE : 'cardorchestrator-card-change'
    };

    /**
     * When a CHANGE event is triggered, it must be one of types in this enum
     * @type {Object}
     */
    CardOrchestrator.CHANGE = {
        OPEN : 'open',
        CLOSE : 'close',
        FOCUS : 'focus'
    };

    return CardOrchestrator;
});
