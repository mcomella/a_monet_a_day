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
