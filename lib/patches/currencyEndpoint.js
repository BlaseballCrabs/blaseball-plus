import runOnPage from '../runOnPage.js';
import getOptions from '../options.js';
import { fiber, props, nth } from '../react.js';

let interval = null;

async function send(main, options) {
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
        clearInterval(interval);
        interval = null;
    }

    interval = setInterval(() => send(main, options), 5000);
    await send(main, options);
}

const currencyEndpoint = {
    name: 'currencyEndpoint',
    selector: '.Navigation-User-Top',
    apply: patch
};

export default currencyEndpoint;
