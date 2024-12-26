/// A spec for the Monet Paintings sent to the client.

import fs from 'fs';
import { parseTsv } from '../site/js/util.js';

describe('The processed Monet Paintings input data', () => {
    const getData = (() => {
        const originalData = fs.readFileSync('site/thirdparty/wikidata/monetPaintings.tsv', 'utf8');
        return () => structuredClone(originalData);
    })();

    function getParsedData() {
        return parseTsv(getData());
    }

    // Including the header means we're sending the user unnecessary bytes but it improves readability and correctness.
    it('has the expected header', () => {
        expect(getParsedData().header).toEqual(['item', 'image']);
    });

    it('contains a non-trivial number of entries', () => {
        expect(getParsedData().records.length).toBeGreaterThanOrEqual(10);
    });

    it('has no duplicate keys', () => {
        const seenKeys = new Set();
        const records = getParsedData().records;
        for (const record of records) {
            expect(seenKeys).not.toContain(record.item);
            seenKeys.add(record.item);
        }

        expect(seenKeys).toHaveSize(records.length); // safety check: are we correctly adding values to knownKeys?
    });

    it('contains records with valid data', () => {
        function isImageish(url) {
            url = url.toLowerCase();
            return url.endsWith('.gif') ||
                    url.endsWith('.jpg') ||
                    url.endsWith('.jpeg') ||
                    url.endsWith('.png') ||
                    url.endsWith('.tif');
        }

        const records = getParsedData().records;
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            expect(record.item).withContext(`index ${i}: ${record.item}`).toMatch('^\\d+$');
            expect(record.image.startsWith('http')).withContext(`index ${i}: ${record.image}`).toBeFalse();
            expect(isImageish(record.image)).withContext(`index ${i}: ${record.image}`).toBeTrue();
        }
    });
});
