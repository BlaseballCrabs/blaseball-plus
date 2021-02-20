import abslveLink from './patches/abslveLink.js';

export default async function scanURL(path) {
    if (path.startsWith('/team/')) {
        await abslveLink(document.querySelector('.Modal-Background'));
    }
}
