export default function bigDeal() {
    if (!window.wrappedJSObject) return;

    function wrappedEventSource() {
        const target = new window.oldEventSource(...arguments);

        const handler = {
            get(...args) {
                let val = Reflect.get(...args);
                if (typeof val === 'function') {
                    val = val.bind(target);
                }
                return val;
            },
            set(obj, prop, value) {
                if (prop === 'onmessage') {
                    const orig = value;
                    value = (event) => {
                        let data = JSON.parse(event.data);
                        let doc = data.value.temporal.doc;

                        if (doc.epsilon) {
                            doc.epsilon = false;
                            let newEvent = { ...event, data: JSON.stringify(data) };

                            const oldBigDeal = document.querySelector('.BigDeal-All');
                            if (oldBigDeal) oldBigDeal.remove();

                            orig(event);

                            window.noBigDeal = () => orig(newEvent);
                        } else {
                            return orig(event);
                        }
                    };
                }
                return Reflect.set(target, prop, value);
            }
        };

        const proxy = new Proxy(target, handler);
        window.evt = proxy;

        return proxy;
    }

    if (window.wrappedJSObject) {
        window.wrappedJSObject.oldEventSource = window.wrappedJSObject.EventSource;
        const functionBody = wrappedEventSource.toString().replace(/^.*?{|}$/g, '');
        window.wrappedJSObject.EventSource = new window.wrappedJSObject.Function(functionBody);
    }
}
