export const ENTITY_URL_PREFIX = 'http://www.wikidata.org/entity/Q';
export const IMAGE_URL_PREFIX = 'http://commons.wikimedia.org/wiki/Special:FilePath/';

export function parseTsv(tsv) {
    const lines = tsv.split('\n');
    const header = lines[0].split('\t');
    const records = lines.slice(1)
            .filter(line => line.trim().length > 0)
            .map(line => {
                const fields = line.split('\t');
                if (fields.length === 0) {
                    throw new Error(`TSV has unexpected field length 0`);
                }

                const result = {};
                for (let i = 0; i < fields.length; i++) {
                    result[header[i]] = fields[i];
                }
                return result;
            });

    return {
        header,
        records,
    };
}

export function getStartDate() {
    return new Date(2024, 11, 26); // defensive copy.
}

export function getIndexForToday(now, len) {
    const startDate = getStartDate();

    // If someone's clock is inaccurate, we'll always return the first value.
    if (now < startDate) {
        return 0;
    }

    const millisInDay = 1000 * 60 * 60 * 24;
    const daysPassed = Math.floor((now - startDate) / millisInDay);
    return daysPassed % len;
}
