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

    function addButton(text, func) {
        let buttonLine = document.createElement('div');
        buttonLine.classList.add('Player-Info-Line');
        buttonLine.style.display = 'block';
        let buttonHeader = document.createElement('a');
        buttonHeader.textContent = text;
        buttonHeader.href = '#';
        buttonHeader.classList.add('Player-Info-Line-Header');
        buttonHeader.classList.add('Player-Info-Line-Button');
        buttonHeader.addEventListener('click', func);
        buttonLine.append(buttonHeader);
        stats.append(buttonLine);
    }

    function showRaw(event) {
        event.preventDefault();

        let lines = [];

        for (const child of stats.children) {
            lines.push(child);
        }

        stats.innerHTML = '';

        function addKey(key, element) {
            let line = document.createElement('div');
            line.classList.add('Player-Info-Line');

            let header = document.createElement('div');
            header.textContent = key;
            header.classList.add('Player-Info-Line-Header');
            line.append(header);

            if (!element) {
                const value = player[key];
                element = document.createElement('div');
                element.textContent = JSON.stringify(value);
            }

            line.append(element);
            stats.append(line);
        }

        let idElem = document.createElement('div');
        let idLink = document.createElement('a');
        idLink.href = `https://www.blaseball.com/database/players?ids=${player.id}`;
        idLink.textContent = JSON.stringify(player.id);
        idLink.classList.add('Player-Info-Line-Link');
        idElem.append(idLink);
        addKey('id', idElem);

        for (const key in player) {
            if (key === 'id' || !Object.prototype.hasOwnProperty.call(player, key)) continue;
            addKey(key);
        }

        let content = stats.closest('.ModalItem-Content');
        let items = content.querySelector('.Player-Info-Items');
        let bio = content.querySelector('.Player-Info-Bio');
        content.removeChild(items);
        content.removeChild(bio);

        addButton('Hide Raw', event => {
            event.preventDefault();

            stats.innerHTML = '';
            for (const line of lines) {
                stats.append(line);
            }

            content.append(items);
            content.append(bio);

            content.scroll(0, 0);
        });

        content.scroll(0, 0);
    }

    addButton('Show Raw', showRaw);
}
