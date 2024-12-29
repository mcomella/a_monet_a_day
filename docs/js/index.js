import { parseTsv, IMAGE_URL_PREFIX, getIndexForToday } from './util.js';
import { getCommonsUrl } from './wikimedia.js';

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
const painting = paintings[displayIndex];

const paintingLink = document.getElementById('painting-link');
const paintingElement = document.getElementById('painting');

paintingLink.href = getCommonsUrl(painting.image);
paintingElement.src = `${IMAGE_URL_PREFIX + painting.image}?width=${window.screen.availWidth}`;
