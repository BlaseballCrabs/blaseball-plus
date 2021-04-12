import browser from 'webextension-polyfill';
import transform from './transform.js';

function jsHandler(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);

    let buf = '';
    let decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();

    filter.ondata = event => {
        buf += decoder.decode(event.data, { stream: true });
    };

    filter.onstop = async () => {
        const script = await transform(buf);
        filter.write(encoder.encode(script));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
    jsHandler,
    {
        urls: ["https://d35iw2jmbg6ut8.cloudfront.net/static/js/*.js"]
    },
    ["blocking"]
);
