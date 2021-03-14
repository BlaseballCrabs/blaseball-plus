import patches from './patches.js';
import markPatched from './markPatched.js';
import scanURL from './scanURL.js';

export default async function scanElement(elem) {
    if (!elem.classList || !elem.classList.contains) return;

    let applications = [];

    for (const patch of patches) {
        if (!patch.selector) continue;

        const descendants = elem.querySelectorAll(patch.selector);
        let matches;
        if (elem.matches(patch.selector)) {
            matches = [elem, ...descendants];
        } else {
            matches = descendants;
        }

        for (const match of matches) {
            if (patch.contains && !match.querySelector(patch.contains)) continue;

            if (!patch.applied) {
                if (match.patched?.[match.name]) continue;
                markPatched(match, patch.name);
            } else {
                if (patch.applied(match)) continue;
            }

            applications.push(patch.apply(match));
        }
    }

    await Promise.all(applications);

    if (elem.classList.contains('Header-Logo-Era')) {
        await scanURL(location.pathname);
    }
}
