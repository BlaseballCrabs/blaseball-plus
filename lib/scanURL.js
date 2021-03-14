import patches from './patches.js';
import markPatched from './markPatched.js';

export default async function scanURL(path) {
    let applications = [];

    for (const patch of patches) {
        if (patch.path && patch.path.test(path)) {
            const selector = document.querySelectorAll(patch.selector);
            const urlSelector = patch.urlSelector ? document.querySelectorAll(patch.urlSelector) : [];

            for (const match of [...selector, ...urlSelector]) {
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
    }

    await Promise.all(applications);
}
