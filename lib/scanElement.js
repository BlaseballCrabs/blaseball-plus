import playerStats from './patches/playerStats.js';
import abslveLink from './patches/abslveLink.js';
import scanURL from './scanURL.js';

export default async function scanElement(elem) {
    if (!elem.classList || !elem.classList.contains) return;

    if (elem.classList.contains('ModalItem-Content')) {
        await Promise.all(Array.from(elem.children, x => scanElement(x)));
    } else if (elem.classList.contains('Player-Info-Stats')) {
        await playerStats(elem);
    } else if (elem.classList.contains('Modal-Background') && elem.querySelector('.Team-Header')) {
        await abslveLink(elem);
    } else if (elem.classList.contains('Main-Body')) {
        await scanURL(location.pathname);
    }
}
