export default function theCrabs() {
    if (!window.wrappedJSObject) return;

    function wrappedForEach(cb, thisArg) {
        window.oldForEach.call(this, (e, i, a) => {
            cb.call(thisArg, e, i, a);
            if (a.length === 5 && e === '57ec08cc-0411-4643-b304-0e80dbc15ac7') {
                cb('8d87c468-699a-47a8-b40d-cfb73a5660ad');
            }
        });
    }

    if (window.wrappedJSObject) {
        window.wrappedJSObject.oldForEach = window.wrappedJSObject.Array.prototype.forEach;
        const functionBody = wrappedForEach.toString().replace(/^.*?{|}$/g, '');
        window.wrappedJSObject.Array.prototype.forEach = new window.wrappedJSObject.Function('cb', 'thisArg', functionBody);
    }
}
