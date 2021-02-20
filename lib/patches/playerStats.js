import runOnPage from '../runOnPage.js';
import { fiber, state, nth } from '../react.js';

export default async function patch(stats) {
    const bg = stats.closest('.Modal-Background');
    const item = stats.closest('.ModalItem');
    const { player } = await runOnPage(async (bg, item, fiber, state, nth) => {
        return state(nth(fiber(bg || item), bg ? 2 : 3));
    })(bg, item, fiber, state, nth);
    for (const line of stats.querySelectorAll('.Player-Info-Line')) {
        const header = line.querySelector('.Player-Info-Line-Header').textContent;

        const addRating = rating => {
            const stars = rating * 5;
            const rawStars = document.createElement('div');
            rawStars.textContent = stars.toFixed(2);
            rawStars.title = stars.toString();
            line.style.gridTemplateColumns = '180px auto min-content';
            line.append(rawStars);
        };

        switch (header) {
            case 'Batting':
                addRating(player.hittingRating);
                break;
            case 'Pitching':
                addRating(player.pitchingRating);
                break;
            case 'Baserunning':
                addRating(player.baserunningRating);
                break;
            case 'Defense':
                addRating(player.defenseRating);
                break;
        }
    }
}
