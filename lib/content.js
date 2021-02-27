import scanElement from './scanElement.js';
import { removeAttributes } from './addAttribute.js';
import './style.css';

async function observe(mutations) {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            await scanElement(node);
        }

        for (const node of mutation.removedNodes) {
            if (node.classList.contains('ModalItem')) {
                removeAttributes();
            }
        }
    }
}

const observer = new MutationObserver(observe);
observer.observe(document.body, {
    subtree: true,
    childList: true
});
