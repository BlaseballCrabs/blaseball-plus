import scanElement from './scanElement.js';
import './style.css';

async function observe(mutations) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            await scanElement(node);
        }
    }
}

const observer = new MutationObserver(observe);
observer.observe(document.body, {
    subtree: true,
    childList: true
});
