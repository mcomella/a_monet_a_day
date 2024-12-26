import { parseTsv, IMAGE_URL_PREFIX } from './util.js';

const DATA_PATH = 'thirdparty/wikidata/monetPaintings.tsv';

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
        req.open('GET', DATA_PATH);
        req.send();
    });
}

const data = await fetchData();
const paintings = parseTsv(data).records;
const displayIndex = getRandomInt(0, paintings.length);
const paintingData = paintings[displayIndex];

const containerElement = document.getElementById('container');
const paintingElement = document.getElementById('painting');
paintingElement.src = `${IMAGE_URL_PREFIX + paintingData.image}?height=${containerElement.clientHeight}`;
