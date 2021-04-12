import browser from 'webextension-polyfill';
import transform from './transform.js';

function jsHandler(event) {
    let filter = browser.webRequest.filterResponseData(event.requestId);

    let buf = '';
    let decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();

    filter.ondata = event => {
        buf += decoder.decode(event.data, { stream: true });
    };

    filter.onstop = () => {
        const script = transform(buf);
        filter.write(encoder.encode(script));
        filter.disconnect();
    };

    return {};
}

function requestCacheHandler(event) {
    return {
        requestHeaders: event.requestHeaders.filter(x => !['if-none-match', 'if-modified-since'].includes(x.name.toLowerCase()))
    };
}

const filter = {
    urls: ['https://d35iw2jmbg6ut8.cloudfront.net/static/js/main.*.chunk.js']
};

browser.webRequest.onBeforeRequest.addListener(jsHandler, filter, ['blocking']);
browser.webRequest.onBeforeSendHeaders.addListener(requestCacheHandler, filter, ['blocking', 'requestHeaders']);

browser.webRequest.handlerBehaviorChanged();
