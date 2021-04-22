import browser from 'webextension-polyfill';
import transform from './transform.js';

function jsHandler() {
    return { cancel: true };
}

function requestCacheHandler(event) {
    return {
        requestHeaders: event.requestHeaders.filter(x => !['if-none-match', 'if-modified-since'].includes(x.name.toLowerCase()))
    };
}

async function transformRequestHandler(mainScriptFilename) {
    const mainScriptUrl = `https://d35iw2jmbg6ut8.cloudfront.net/static/js/${mainScriptFilename}`;

    const req = await fetch(mainScriptUrl);
    const origScript = await req.text();

    const transformedScript = transform(origScript);

    return transformedScript;
}

const urls = ['https://d35iw2jmbg6ut8.cloudfront.net/static/js/main.*.chunk.js']

browser.webRequest.onBeforeRequest.addListener(jsHandler, {
    urls,
    types: ['script']
}, ['blocking']);
browser.webRequest.onBeforeSendHeaders.addListener(requestCacheHandler, { urls }, ['blocking', 'requestHeaders']);

browser.webRequest.handlerBehaviorChanged();

browser.runtime.onMessage.addListener(transformRequestHandler);
