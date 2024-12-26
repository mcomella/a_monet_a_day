import { parseTsv, IMAGE_URL_PREFIX, getIndexForToday } from './util.js';

const DATA_PATH = 'thirdparty/wikidata/monetPaintings.tsv';

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
        req.open('GET', DATA_PATH);
        req.send();
    });
}

const data = await fetchData();
const paintings = parseTsv(data).records;
const displayIndex = getIndexForToday(new Date(), paintings.length);
const paintingData = paintings[displayIndex];

const containerElement = document.getElementById('container');
const paintingElement = document.getElementById('painting');
paintingElement.src = `${IMAGE_URL_PREFIX + paintingData.image}?height=${containerElement.clientHeight}`;
