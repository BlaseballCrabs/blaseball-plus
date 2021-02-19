import unroundedStars from './patches/unroundedStars.js';

export default async function scanElement(elem) {
    if (!elem.classList || !elem.classList.contains) return;

    if (elem.classList.contains('ModalItem-Content')) {
        await Promise.all(Array.from(elem.children, x => scanElement(x)));
    } else if (elem.classList.contains('Player-Info-Stats')) {
        await unroundedStars(elem);
    }
}
