const DATA_PATH = 'query.tsv';

// via MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min, maxExclusive) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(maxExclusive);
    return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil);
}

async function fetchData() {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.addEventListener('load', (e) => {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(`${req.status}:  ${req.responseText}`);
            }
        });
        req.open('GET', 'thirdparty/wikidata/monetPaintings.tsv');
        req.send();
    });
}

// TODO: maybe we should only send the image paths instead of the keys for the MVP.
function parseTsv(tsv) {
    const lines = tsv.split('\n');
    const header = lines[0].split('\t');
    if (header.length !== 2 ||
            header[0] !== 'item' ||
            header[1] !== 'image') {
        throw new Error(`unknown header fields: ${header}`);
    }

    const contents = lines.slice(1).map(line => {
        const fields = line.split('\t');
        if (fields.length !== header.length) {
            console.warn(`fields does not match header length. fields = '${fields}'`)
            return;
        }

        const result = {};
        for (let i = 0; i < fields.length; i++) {
            result[header[i]] = fields[i];
        }
        return result;
    }).filter(v => v); // remove undefined values.
    return contents;
}

const data = await fetchData();
const paintings = parseTsv(data);
const displayIndex = getRandomInt(0, paintings.length);
const paintingData = paintings[displayIndex];

const containerElement = document.getElementById('container');
const paintingElement = document.getElementById('painting');
paintingElement.src = `${paintingData.image}?height=${containerElement.clientHeight}`;
