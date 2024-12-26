import { parseTsv } from '../site/js/util.js';

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
