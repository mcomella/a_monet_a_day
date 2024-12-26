import { getIndexForToday, getStartDate, parseTsv } from '../site/js/util.js';

describe('parseTsv', () => {
    const inputSharedHeader = `item\timage`;
    const expectedSharedHeader = ['item', 'image'];

    function newRecord(item, image) {
        return {item, image};
    }

    function expectSharedHeader(actual) {
        expect(actual.header).toEqual(expectedSharedHeader);
    }

    it('should ignore a trailing newline', () => {
        const input = inputSharedHeader + `
foo\tbar
`;
        const actual = parseTsv(input);
        expectSharedHeader(actual);
        expect(actual.records).toEqual([newRecord('foo', 'bar')]);
    });

    it('should skip empty lines', () => {
        const input = `item\timage
foo\tbar

sudo\troot`;
        const actual = parseTsv(input);
        expectSharedHeader(actual);
        expect(actual.records).toEqual([newRecord('foo', 'bar'), newRecord('sudo', 'root')]);
    });
});

describe('getIndexForToday', () => {
    function addDays(date, count) {
        const resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() + count);
        return resultDate;
    }

    it('returns 0 for a date before start', () => {
        const earlyDate = getStartDate();
        earlyDate.setFullYear(earlyDate.getFullYear() - 1);

        expect(getIndexForToday(earlyDate, 100)).toEqual(0);
    });

    it('returns the expected value less than len', () => {
        expect(getIndexForToday(getStartDate(), 100)).toEqual(0);

        const plusTen = addDays(getStartDate(), 10);
        plusTen.setHours(12); // there are issues if we do 12am - 12am so we offset hours.
        expect(getIndexForToday(plusTen, 100)).toEqual(10);

        const plusFifty = addDays(plusTen, 40);
        expect(getIndexForToday(plusFifty, 100)).toEqual(50);

        const plusNinetyNine = addDays(plusTen, 89);
        expect(getIndexForToday(plusNinetyNine, 100)).toEqual(99);
    });

    it('returns the expected value equal or greater than len', () => {
        const plusOneHundred = addDays(getStartDate(), 100);
        plusOneHundred.setHours(12); // there are issues if we do 12am - 12am so we offset hours.
        expect(getIndexForToday(plusOneHundred, 100)).toEqual(0);

        const plusOneHundredFifty = addDays(plusOneHundred, 50);
        expect(getIndexForToday(plusOneHundredFifty, 100)).toEqual(50);

        const twoHundredFifty = addDays(plusOneHundred, 150);
        expect(getIndexForToday(twoHundredFifty, 100)).toEqual(50);
    });
});
