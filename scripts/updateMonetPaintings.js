/// Takes the raw output from the Wikidata Query Service in TSV format and
/// converts it into the desired format for our site.

import assert from 'assert';
import fs from 'fs';
import { shuffleArray } from './util.js';
import { parseTsv, ENTITY_URL_PREFIX, IMAGE_URL_PREFIX } from '../docs/js/util.js';

const USAGE = 'usage: node scripts/updateMonetPaintings.js PATH_TO_INPUT_TSV';

const OUTPUT_FILE = 'docs/thirdparty/wikidata/monetPaintings.tsv';
const SORT_ORDER_FILE = 'monetPaintingsSortOrder.json';

function printUsageAndExit() {
    console.error(USAGE);
    process.exit(1);
}

// Ensure script is run from project root so OUTPUT_FILE path is valid.
if (fs.readdirSync('.')
        .filter(f => f === 'docs')
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
    // Clean up and validate each record.
    const seenItems = new Set();
    const processedRecords = [];
    const itemToRecord = new Map();
    for (const record of inputTsv.records) {
        if (seenItems.has(record.item)) {
            // If there are multiple items with the same key, we assume Wikidata returns the original images in the
            // order we'd most want to use because we have no additional data to make a better choice. Note: if I was
            // better at SPARQL, I could probably do this in the initial query.
            continue;
        }

        seenItems.add(record.item);

        // Remove redundancy to reduce bandwidth when clients fetch the data.
        assert.ok(record.item.startsWith(ENTITY_URL_PREFIX));
        assert.ok(record.image.startsWith(IMAGE_URL_PREFIX));

        const processedRecord = {
            item: record.item.slice(ENTITY_URL_PREFIX.length),
            image: record.image.slice(IMAGE_URL_PREFIX.length),
        };

        processedRecords.push(processedRecord);
        itemToRecord.set(processedRecord.item, processedRecord);
    }

    // Sort the items in the order defined by the given file. We want to display the images in a random order but one
    // consistent for every user and even when the painting list is updated so we save a sort order and reference that
    // on each update.
    if (!fs.existsSync(SORT_ORDER_FILE)) {
        // We have no saved sort order: make and save a new one.
        const shuffledItems = shuffleArray(processedRecords).map(r => r.item);
        fs.writeFileSync(SORT_ORDER_FILE, JSON.stringify(shuffledItems));
    }

    // Verify new items were not added in an update. If this fails, we need to write new code to handle new items being added to the list.
    const shuffledItems = JSON.parse(fs.readFileSync(SORT_ORDER_FILE));
    assert.deepStrictEqual(new Set(shuffledItems), new Set(processedRecords.map(r => r.item)));

    for (const item of shuffledItems) {
        const curRecord = itemToRecord.get(item);

        // Transform to output format.
        outputTsv += `${curRecord.item}\t${curRecord.image}\n`;
    }
}

fs.writeFileSync(OUTPUT_FILE, outputTsv);
