import browser from 'webextension-polyfill';

export default async function injectTransformed() {
    const mainScript = document.querySelector('body > script:last-of-type');
    const mainScriptUrl = mainScript.src;

    const mainScriptFilename = mainScriptUrl.split('/').pop();

    const transformedScript = await browser.runtime.sendMessage(mainScriptFilename);

    const scriptElem = document.createElement('script');
    scriptElem.text = transformedScript;
    document.documentElement.prepend(scriptElem);
}
