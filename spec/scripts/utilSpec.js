import { shuffleArray } from "../../scripts/util.js";

fdescribe('shuffleArray', () => {
    function getInputOneHundred() {
        const arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push(i);
        }
        return arr;
    }

    it('contains all of the given values', () => {
        // TODO: we should also verify the counts of each value are the same.
        const input = getInputOneHundred();
        const inputSet = new Set(input);
        const actual = shuffleArray(input);
        const actualSet = new Set(actual);
        expect(actualSet).toEqual(inputSet);
    });
});
