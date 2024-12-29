import { shuffleArray } from "../../scripts/util.js";

describe('shuffleArray', () => {
    function getInputOneHundred() {
        const arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push(i);
        }
        return arr;
    }

    it('contains all of the given values', () => {
        const input = getInputOneHundred();
        const actual = shuffleArray(input);
        expect(actual).toEqual(jasmine.arrayWithExactContents(input));
    });
});
