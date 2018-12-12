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
/**
 * @file DateUtil unit tests
 * @requires web-components/utils/date
 * @module test/web-components/utils/date
 */
define([
    'web-components/utils/date'
],
function(
    DateUtil
) {
    describe('DateUtil', function() {
        context('#areEqual', function() {
            it('returns true for equal dates', function() {
                expect(DateUtil.areEqual(new Date(), new Date())).to.be.true;
            });

            it('returns false for different dates', function() {
                var date1 = new Date(),
                    date2 = new Date('1994-10-26');

                expect(DateUtil.areEqual(date1, date2)).to.be.false;
            });

            it('returns false for an invalid date1 param', function() {
                var date1 = 'Invalid Date',
                    date2 = new Date();

                expect(DateUtil.areEqual(date1, date2)).to.be.false;
            });

            it('returns false for an invalid date2 param', function() {
                var date1 = new Date(),
                    date2 = 'Invalid Date';

                expect(DateUtil.areEqual(date1, date2)).to.be.false;
            });

            it('returns false for null params', function() {
                expect(DateUtil.areEqual(null, null)).to.be.false;
            });
        });

        context('#isValidDate', function() {
            it('returns false for an invalid string representation of a date', function() {
                expect(DateUtil.isValidDate('invalid Date')).to.be.false;
            });

            it('returns true for a valid string representation of a date', function() {
                expect(DateUtil.isValidDate('2017-01-01')).to.be.true;
            });

            it('returns false for an invalid date object', function() {
                expect(DateUtil.isValidDate(new Date('Invalid Date'))).to.be.false;
            });

            it('returns true for a valid date object', function() {
                expect(DateUtil.isValidDate(new Date())).to.be.true;
            });
        });

        context('#getUTCValue', function() {
            it('successfully returns the respective UTC Date of the current date', function() {
                var normalDate = new Date(),
                    UTCDate = DateUtil.getUTCValue(new Date());

                expect(UTCDate.getDate()).to.equal(normalDate.getUTCDate());
            });

            it('returns null for an invalid date value', function() {
                expect(DateUtil.getUTCValue(new Date('Invalid Date'))).to.be.null;
            });

            it('returns null for a null date value', function() {
                expect(DateUtil.getUTCValue(null)).to.be.null;
            });
        });

        context('#getMonthDays', function() {
            it('returns 28 for february in a not leap year', function() {
                expect(DateUtil.getMonthDays(1, 2017)).to.equal(28);
            });

            it('returns 29 for february in a leap year', function() {
                expect(DateUtil.getMonthDays(1, 2016)).to.equal(29);
            });

            it('returns 30 for a month with 30 days', function() {
                expect(DateUtil.getMonthDays(3, 2017)).to.equal(30);
            });

            it('returns 31 for a month with 31 days', function() {
                expect(DateUtil.getMonthDays(0, 2017)).to.equal(31);
            });

            it('returns null for a non-numeric month param value', function() {
                expect(DateUtil.getMonthDays('three', 2017)).to.be.null;
            });

            it('returns null for a non-numeric year param value', function() {
                expect(DateUtil.getMonthDays(06, 'year')).to.be.null;
            });

            it('returns null for null params', function() {
                expect(DateUtil.getMonthDays(null, null)).to.be.null;
            });
        });

        context('#getISOFormatValue', function() {
            it('generates the appropriate ISO string for a string representation of a date', function() {
                var dateValue = '2017-01-01';

                expect(DateUtil.getISOFormatValue(DateUtil.getUTCValue(dateValue))).to.equal(dateValue);
            });

            it('returns null for an invalid date', function() {
                expect(DateUtil.getISOFormatValue(new Date('Invalid Date'))).to.be.null;
            });

            it('returns null for a null value of the date param', function() {
                expect(DateUtil.getISOFormatValue(null)).to.be.null;
            });
        });

        context('#toString', function() {
            it('successfully translates a date to the target format', function() {
                var testCases = [
                    {
                        format : 'yyyy.mm.dd',
                        target : '1994.10.26'
                    },
                    {
                        format : 'mm.dd.yyyy',
                        target : '10.26.1994'
                    },
                    {
                        format : 'dd.mm.yyyy',
                        target : '26.10.1994'
                    },
                    {
                        format : '(mm)(dd)(yyyy)',
                        target : '(10)(26)(1994)'
                    },
                    {
                        format : 'mm|dd|yyyy',
                        target : '10|26|1994'
                    },
                    {
                        format : 'mm_dd_yyyy',
                        target : '10_26_1994'
                    },
                    {
                        format : 'yyyymmddThhmi',
                        target : '19941026T1025'
                    }
                ];

                var testDate = '1994-10-26T10:25';

                testCases.forEach(function(testCase) {
                    expect(DateUtil.toString(DateUtil.getUTCValue(new Date(testDate)), testCase.format)).to.equal(testCase.target);
                });
            });

            it('returns null for an invalid string representation of a date', function() {
                expect(DateUtil.toString('Invalid Date', 'yyyy-mm-dd')).to.be.null;
            });

            it('returns null for an invalid date object', function() {
                expect(DateUtil.toString(new Date('Invalid Date', 'yyyy-mm-dd'))).to.be.null;
            });

            it('returns null for empty parameters', function() {
                expect(DateUtil.toString()).to.be.null;
            });

            it('returns null for an invalid target format', function() {
                expect(DateUtil.toString(new Date(), 'year/month/day')).to.be.null;
            });
        });

        context('#toDate', function() {
            it('generates a date object from a valid string date in the given format', function() {
                var date = '1994(-/-)10(-/-)26',
                    format = 'yyyy(-/-)mm(-/-)dd';

                expect(DateUtil.getISOFormatValue(DateUtil.toDate(date, format))).to.equal('1994-10-26');
            });

            it('generates a date object from a valid string date in the given format (including hours and minutes)', function() {
                var date = '19941026T1024',
                    format = 'yyyymmddThhmi';

                expect(DateUtil.toString(DateUtil.toDate(date, format), format)).to.equal(date);
            });

            it('doesn\'t generates a date object from a valid date in a different format', function() {
                expect(DateUtil.toDate('1994/26/10', 'mm/yyyy/dd')).to.be.null;
            });

            it('returns null for an invalid string representation of a date', function() {
                expect(DateUtil.toDate('Invalid Date', 'yyyy-mm-dd')).to.be.null;
            });

            it('returns null for empty parameters', function() {
                expect(DateUtil.toDate()).to.be.null;
            });

            it('returns null for an invalid target format', function() {
                expect(DateUtil.toDate('1994/10/26', 'year/month/day')).to.be.null;
            });
        });
    });
});
