/// Takes the raw output from the Wikidata Query Service in TSV format and
/// converts it into the desired format for our site.

import assert from 'assert';
import fs from 'fs';
import { parseTsv, ENTITY_URL_PREFIX, IMAGE_URL_PREFIX } from '../site/js/util.js';

const USAGE = 'usage: node scripts/updateMonetPaintings.js PATH_TO_INPUT_TSV';
const OUTPUT_FILE = 'site/thirdparty/wikidata/monetPaintings.tsv';

function printUsageAndExit() {
    console.error(USAGE);
    process.exit(1);
}

// Ensure script is run from project root so OUTPUT_FILE path is valid.
if (fs.readdirSync('.')
        .filter(f => f === 'site')
        .length !== 1) {
    console.error('ERROR: expected script to be run from project root');
    printUsageAndExit();
}

if (process.argv.length !== 3) {
    printUsageAndExit();
}

// Read input TSV. For simplicity, we don't validate a TSV format.
let inputTsv;
{
    const inputTsvPath = process.argv[2];
    const rawInputTsv = fs.readFileSync(inputTsvPath, 'utf8');
    inputTsv = parseTsv(rawInputTsv);
    assert.deepStrictEqual(inputTsv.header, ['item', 'image']);
    assert.ok(inputTsv.records.length > 1);
}

// Process input TSV.
let outputTsv = `${inputTsv.header.join('\t')}\n`;
{
    const seenItems = new Set();
    for (const record of inputTsv.records) {
        if (seenItems.has(record.item)) {
            // If there are multiple items with the same key, we assume Wikidata returns the original images in the
            // order we'd most want to use because we have no additional data to make a better choice. Note: if I was
            // better at SPARQL, I could probably do this in the initial query.
            continue;
        }

        seenItems.add(record.item);

        assert.ok(record.item.startsWith(ENTITY_URL_PREFIX));
        const item = record.item.slice(ENTITY_URL_PREFIX.length);

        assert.ok(record.image.startsWith(IMAGE_URL_PREFIX));
        const image = record.image.slice(IMAGE_URL_PREFIX.length);

        outputTsv += `${item}\t${image}\n`;
    }
}

fs.writeFileSync(OUTPUT_FILE, outputTsv);
