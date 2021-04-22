import browser from 'webextension-polyfill';
import transform from './transform.js';

function jsHandler() {
    return { cancel: true };
}

async function transformRequestHandler(mainScriptFilename) {
    const mainScriptUrl = `https://d35iw2jmbg6ut8.cloudfront.net/static/js/${mainScriptFilename}`;

    const req = await fetch(mainScriptUrl);
    const origScript = await req.text();

    const transformedScript = transform(origScript);

    return transformedScript;
}

browser.webRequest.onBeforeRequest.addListener(jsHandler, {
    urls: ['https://d35iw2jmbg6ut8.cloudfront.net/static/js/main.*.chunk.js'],
    types: ['script']
}, ['blocking']);

browser.webRequest.handlerBehaviorChanged();

browser.runtime.onMessage.addListener(transformRequestHandler);
