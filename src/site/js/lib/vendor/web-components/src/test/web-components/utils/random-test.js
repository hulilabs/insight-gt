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
/* jshint mocha:true, expr:true *//* global expect */
define([
    'web-components/utils/random'
],
function(
    RandomUtil
) {
    describe('RandomUtil', function() {
        it('generates pseudo id random string', function() {
            var string1 = RandomUtil.getPseudoId();
            expect(string1.length).to.equal(38);

            // prefix check
            expect(string1[0]).to.equal('_');
            expect(string1[1]).to.equal('_');
            // randomness check
            expect(RandomUtil.getPseudoId()).to.not.equal(string1);
        });


        it('returns true if the string is a pseudo id', function() {
            var string1 = RandomUtil.getPseudoId();
            expect(RandomUtil.isPseudoId(string1)).to.equal(true);
        });

        it('returns false if the string is NOT a pseudo id', function() {
            var string1 = 'notAPseudoKey';
            expect(RandomUtil.isPseudoId(string1)).to.equal(false);
        });

    });
});
