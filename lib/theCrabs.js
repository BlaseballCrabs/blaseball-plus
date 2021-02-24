export default function theCrabs() {
    if (!window.wrappedJSObject) return;

    function apply() {
        const oldForEach = Array.prototype.forEach;
        Array.prototype.forEach = function(cb, thisArg) {
            oldForEach.call(this, (e, i, a) => {
                cb.call(thisArg, e, i, a);
                if (a.length === 5 && e === '57ec08cc-0411-4643-b304-0e80dbc15ac7') {
                    cb('8d87c468-699a-47a8-b40d-cfb73a5660ad');
                }
            });
        };
    }

    if (window.wrappedJSObject) {
        const functionBody = apply.toString().replace(/^.*?{|}$/g, '');
        const applyFunc = new window.wrappedJSObject.Function(functionBody);
        applyFunc();
    }
}
