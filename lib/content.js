import scanElement from './scanElement.js';
import { removeAttributes } from './addAttribute.js';
import injectTransformed from './injectTransformed.js';
import './style.css';

async function observe(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
            const node = mutation.target.parentElement;
            if (node) {
                await scanElement(node);
            }
            continue;
        }

        for (const node of mutation.addedNodes) {
            await scanElement(node);
        }

        for (const node of mutation.removedNodes) {
            if (node.classList && node.classList.contains('ModalItem')) {
                removeAttributes();
            }
        }
    }
}

const observer = new MutationObserver(observe);
observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    characterDataOldValue: true
});

injectTransformed();
