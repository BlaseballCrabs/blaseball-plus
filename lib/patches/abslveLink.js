import runOnPage from '../runOnPage.js';
import markPatched from '../markPatched.js';
import { fiber, props, nth, findContext, ctxProvider } from '../react.js';

async function patch(bg) {
    let item = bg.querySelector('.ModalItem');

    if (bg.matches('.ModalItem')) {
        item = bg;
        bg = item.closest('.Modal-Background');
    }

    const team = await runOnPage(async (bg, item, fiber, props, nth, findContext, ctxProvider) => {
        const teamFiber = fiber(bg || item);
        const id = props(nth(teamFiber, bg ? 3 : 4)).value.match.params.nickname;
        const teams = findContext.call({ ctxProvider }, teamFiber, 'teams');
        return teams.find(x => x.id === id);
    })(bg, item, fiber, props, nth, findContext, ctxProvider);
    const { shorthand } = team;
    const abslveLink = `https://slavfox.space/abslve/?foreboding-kaleidoscope#${shorthand}`;

    let logoLine = item.querySelector('.Team-LogoLine-Wrapper');

    let abslve = document.createElement('a');
    abslve.href = abslveLink;
    abslve.textContent = 'abslve';
    abslve.classList.add('Team-Abslve');
    logoLine.after(abslve);

    markPatched(item, 'abslveLink');
    markPatched(bg, 'abslveLink');
}

const abslveLink = {
    name: 'abslveLink',
    selector: '.Modal-Background',
    contains: '.Team-Header',
    path: /^\/team\//,
    urlSelector: '.ModalItem',
    applied: elem => elem.querySelector('.Team-Abslve'),
    apply: patch
};

export default abslveLink;
