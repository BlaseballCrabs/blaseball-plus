import runOnPage from '../runOnPage.js';
import getOptions from '../options.js';
import { fiber, props, nth } from '../react.js';

let interval = null;

function getTimeout() {
    const average = 30 * 1000;
    const noiseRange = 10 * 1000;

    const noise = (Math.random() - 0.5) * noiseRange;
    console.log(average + noise);
    return average + noise;
}

async function send(main, options) {
    interval = setTimeout(() => send(main, options), getTimeout());

    const url = options.getUrl();
    if (!url) return;

    const user = await runOnPage((main, fiber, props, nth) => {
        return props(nth(fiber(main), 2)).value.user;
    })(main, fiber, props, nth);

    const coins = user.coins || 0;
    const votes = user.snacks?.Votes || 0;

    const body = new URLSearchParams({ coins, votes });

    await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
}

async function patch(user) {
    const main = user.closest('.Main');

    const options = await getOptions();

    if (interval !== null) {
        clearTimeout(interval);
        interval = null;
    }

    await send(main, options);
}

const currencyEndpoint = {
    name: 'currencyEndpoint',
    selector: '.Navigation-User-Top',
    apply: patch
};

export default currencyEndpoint;
