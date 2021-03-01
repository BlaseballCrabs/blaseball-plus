export default function markPatched(elem, patch) {
    if (!elem) return;
    if (!elem.patched) elem.patched = {};
    elem.patched[patch] = true;
}
