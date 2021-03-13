import runOnPage from '../runOnPage.js';
import { eventHandlers } from '../react.js';

async function patch(maxButton) {
    if (maxButton.closest('.BatchBuy')) return;

    let betForm = maxButton.closest('.ModalForm-Form-Inputs-Amount');
    betForm.classList.add('HalfMax');

    const vote = betForm.querySelector('.ModalForm-Ticket-Wrapper') !== null;

    let betInput = betForm.querySelector('.form-control');

    const maxBet = Number(/ ([0-9]+)$/.exec(maxButton.textContent)[1]);
    const halfMax = Math.round(maxBet / 2);

    let betContainer = document.createElement('div');
    betContainer.classList.add('ModalForm-Form-Inputs-Amount-MaxContainer');
    betContainer.append(maxButton);

    let halfButton = document.createElement('a');
    halfButton.classList.add('ModalForm-Form-Inputs-Amount-Max');
    halfButton.addEventListener('click', event => {
        event.preventDefault();
        runOnPage((betInput, halfMax, eventHandlers) => {
            betInput.value = halfMax;
            eventHandlers(betInput).onChange({ target: betInput });
        })(betInput, halfMax, eventHandlers);
    });
    halfButton.textContent = `50% ${vote ? 'Vote' : 'Bet'}: ${halfMax}`;
    betContainer.append(halfButton);

    betForm.append(betContainer);
}

const halfMax = {
    name: 'halfMax',
    selector: '.ModalForm-Form-Inputs-Amount > .ModalForm-Form-Inputs-Amount-Max',
    path: /^\/bet\//,
    apply: patch
};

export default halfMax;
