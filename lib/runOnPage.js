import _ from 'lodash';

const makeIdent = () => _.times(20, () => _.random(35).toString(36)).join('');

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
                    return { id: x.id };
                } else {
                    x.id = makeIdent();
                    return { tempId: x.id };
                }
            } else if (typeof x === 'function') {
                return { func: x.toString() };
            } else {
                return { val: x };
            }
        });

        window.addEventListener('message', onMessage);

        const serialized = func.toString();

        const scriptContent = `
        (async () => {
            try {
                const serializedArgs = ${JSON.stringify(serializedArgs)};
                const args = serializedArgs.map(x => {
                    if ('id' in x) {
                        return document.getElementById(x.id);
                    } else if ('tempId' in x) {
                        const elem = document.getElementById(x.tempId);
                        elem.id = '';
                        return elem;
                    } else if ('func' in x) {
                        const generate = new Function('return ' + x.func);
                        return generate();
                    } else {
                        return x.val;
                    }
                });
                const ret = await (${serialized})(...args);
                window.postMessage({ ident: ${JSON.stringify(ident)}, ret });
            } catch (err) {
                console.error(err);
                window.postMessage({ ident: ${JSON.stringify(ident)}, err });
            }
        })();
        document.currentScript.parentElement.removeChild(document.currentScript);
        `;

        const script = document.createElement('script');
        script.innerHTML = scriptContent;
        document.documentElement.prepend(script);
    });
}
