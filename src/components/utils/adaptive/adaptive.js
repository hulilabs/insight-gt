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
 * @file AdaptiveUtil - detects device using mediaqueries
 * @requires components/utils/adaptive/adaptive_styles.css
 * @see https://davidwalsh.name/device-state-detection-css-media-queries-javascript
 * @module components/utils/adaptive/adaptive
 */
define([
    'css-loader!components/utils/adaptive/adaptive_styles.css'
],
function(
) {

    // available media types enum
    var MEDIA = {
        PHONE : 'phone',
        DESKTOP : 'desktop'
    };

    var MEDIA_STATUS_BLOCK = 'wc-MediaStatus';

    var MediaStatus = function() {
        // a member of MEDIA enum, defaults to phone
        this.media = MEDIA.PHONE;
        this._wasMediaDetected = false;
    };

    MediaStatus.prototype = {
        /**
         * Detects current media and stores it into this.media
         * @return {MediaStatus} this
         */
        detect : function() {
            if (!this._wasMediaDetected) {
                var dummyElement = this._generateDummyElementForDetection();

                // adds the element to the body, so we can detect the media using CSS
                document.body.appendChild(dummyElement);

                // reads the media name from the :before content
                this.media = this._getMediaValueFromElement(dummyElement);
                this._wasMediaDetected = (this.media !== '');

                // removes dummy element leftovers
                dummyElement.remove();
            }

            return this;
        },

        /**
         * Creates a dummy element like this <div class="wc-MediaStatus"></div>
         * used for media detection
         * @return {Element}
         */
        _generateDummyElementForDetection : function() {
            var dummyElement = document.createElement('div');
            dummyElement.classList.add(MEDIA_STATUS_BLOCK);

            return dummyElement;
        },

        /**
         * Obtains media value from a generated dummy element
         * @param  {Element} element a result of _generateDummyElementForDetection
         * @return {String}          a member of MEDIA enum
         */
        _getMediaValueFromElement : function(element) {
            return window.getComputedStyle(element, ':before').getPropertyValue('content');
        },

        /**
         * Returns true if currently on desktop media
         * @return {Boolean}
         */
        isDesktop : function() {
            this.detect();
            // we need to check both content with and without quotes, as some browsers handle it
            // in different manners
            return this.media === MEDIA.DESKTOP || this.media === ('\"' + MEDIA.DESKTOP + '\"');
        },

        /**
         * Returns true if currently on mobile media
         * @return {Boolean}
         */
        isMobile : function() {
            this.detect();
            // we need to check both content with and without quotes, as some browsers handle it
            // in different manners
            return this.media === MEDIA.PHONE || this.media === ('\"' + MEDIA.PHONE + '\"');
        }
    };

    return (new MediaStatus()).detect();
});
