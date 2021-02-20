const makeIdent = () => Math.random().toString(36).substring(2, 10);

export default function runOnPage(func) {
    return (...args) => new Promise((resolve, reject) => {
        const ident = makeIdent();

        function onMessage(event) {
            if (event.source !== window) return;

            if (event.data.ident && event.data.ident === ident) {
                window.removeEventListener('message', onMessage);
                if ('ret' in event.data) {
                    resolve(event.data.ret);
                } else {
                    reject(event.data.err);
                }
            }
        }

        const serializedArgs = args.map(x => {
            if (x instanceof Element) {
                if (x.id) {
                    return `document.getElementById(${JSON.stringify(x.id)})`;
                } else {
                    x.id = makeIdent();
                    return `(() => { const elem = document.getElementById(${JSON.stringify(x.id)}); elem.id = ''; return elem; })()`;
                }
            } else if (typeof x === 'function') {
                return `(() => ${x.toString()})()`;
            } else {
                return JSON.stringify(x);
            }
        });

        window.addEventListener('message', onMessage);

        const serialized = func.toString();

        const scriptContent = `
        (async () => {
            try {
                const args = [${serializedArgs.join(',')}];
                const ret = await (${serialized})(...args);
                window.postMessage({ ident: ${JSON.stringify(ident)}, ret });
            } catch (err) {
                try {
                    window.postMessage({ ident: ${JSON.stringify(ident)}, err });
                } catch (postErr) {
                    console.error(postErr);
                }
                throw err;
            }
        })();
        document.currentScript.parentElement.removeChild(document.currentScript);
        `;

        const script = document.createElement('script');
        script.text = scriptContent;
        document.documentElement.prepend(script);
    });
}
