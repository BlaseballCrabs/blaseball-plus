import browser from 'webextension-polyfill';

class Options {
    constructor() {}

    async _init() {
        if (this._initialized) return;

        const options = await browser.storage.sync.get(['url']);

        if (options.url) {
            this._url = options.url;
        }

        this._initialized = true;

        browser.storage.onChanged.addListener(event => {
            if (event.areaName === 'sync' && event.changes.url) {
                this._url = event.changes.url.newValue;
            }
        });
    }

    getUrl() {
        return this._url;
    }

    async setUrl(url) {
        await browser.storage.sync.set({ url });
        this._url = url;
    }
}

let options = new Options();

export default async function getOptions() {
    await options._init();
    return options;
}
