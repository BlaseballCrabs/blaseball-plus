import runOnPage from '../runOnPage.js';
import { fiber, props, nth, findContext, ctxProvider } from '../react.js';

export default async function patch(bg) {
    const team = await runOnPage(async (bg, fiber, props, nth, findContext, ctxProvider) => {
        const id = props(nth(fiber(bg), 3)).value.match.params.nickname;
        const teams = findContext.call({ ctxProvider }, fiber(bg), 'teams');
        return teams.find(x => x.id === id);
    })(bg, fiber, props, nth, findContext, ctxProvider);
    const { shorthand } = team;

    if (shorthand !== 'BALC' || bg.querySelector('.Team-Header-NotInLeague')) return;

    bg.querySelector('.Team-Card').remove();

    let notInLeague = document.createElement('div');
    notInLeague.classList.add('Team-Header-NotInLeague');
    notInLeague.textContent = 'WARNING: ACCESS RESTRICTED';

    bg.querySelector('.ModalItem-Info').prepend(notInLeague);

    for (const line of bg.querySelectorAll('.Player-Info-Line')) {
        const header = line.querySelector('.Player-Info-Line-Header');
        if (header.textContent === 'Tarot Card') {
            line.remove();
        }
    }
}
