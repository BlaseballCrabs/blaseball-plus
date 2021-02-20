import runOnPage from '../runOnPage.js';
import { fiber, props, nth, findContext, ctxProvider } from '../react.js';

export default async function patch(bg) {
    const team = await runOnPage(async (bg, fiber, props, nth, findContext, ctxProvider) => {
        const id = props(nth(fiber(bg), 3)).value.match.params.nickname;
        const teams = findContext.call({ ctxProvider }, fiber(bg), 'teams');
        return teams.find(x => x.id === id);
    })(bg, fiber, props, nth, findContext, ctxProvider);
    const { shorthand } = team;
    const abslveLink = `https://slavfox.space/abslve/?foreboding-kaleidoscope#${shorthand}`;

    let logoLine = bg.querySelector('.Team-LogoLine');

    let abslve = document.createElement('a');
    abslve.href = abslveLink;
    abslve.textContent = 'abslve';
    abslve.style.marginLeft = 0;
    abslve.classList.add('Team-Standing');
    logoLine.append(abslve);
}
