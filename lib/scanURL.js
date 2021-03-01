import abslveLink from './patches/abslveLink.js';
import crabsUp from './patches/crabsUp.js';

export default async function scanURL(path) {
    if (path.startsWith('/team/')) {
        await abslveLink(document.querySelector('.Modal-Background'));
        await crabsUp(document.querySelector('.Modal-Background'));
    }
}
