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

        function addKey(key, category, element) {
            let line = document.createElement('div');
            line.classList.add('Player-Info-Line');

            let header = document.createElement('div');
            header.textContent = key;
            header.classList.add('Player-Info-Line-Header');
            line.append(header);

            if (!element) {
                const value = player[key];
                element = document.createElement('div');
                if (typeof value === 'number' && !Number.isInteger(value)) {
                    element.textContent = value.toFixed(3);
                    element.title = value.toString();
                } else {
                    element.textContent = JSON.stringify(value);
                }
                element.classList.add('Player-Info-Line-Raw');
                if (key.endsWith('Id')) {
                    element.classList.add('Player-Info-Line-Id');
                }
            }

            line.append(element);

            if (category) {
                let categoryElem = document.createElement('div');
                categoryElem.textContent = category;
                categoryElem.classList.add('Player-Info-Line-Category');
                line.append(categoryElem);
                line.classList.add('Player-Info-Line-Triple');
            }

            stats.append(line);
        }

        let idElem = document.createElement('div');
        idElem.classList.add('Player-Info-Line-Raw');
        idElem.classList.add('Player-Info-Line-Id');
        let idLink = document.createElement('a');
        idLink.href = `https://www.blaseball.com/database/players?ids=${player.id}`;
        idLink.textContent = JSON.stringify(player.id);
        idLink.classList.add('Player-Info-Line-Link');
        idElem.append(idLink);
        addKey('id', null, idElem);

        const categories = [
            ['divinity', 'Batting'],
            ['martyrdom', 'Batting'],
            ['moxie', 'Batting'],
            ['musclitude', 'Batting'],
            ['patheticism', 'Batting'],
            ['thwackability', 'Batting'],
            ['tragicness', 'Batting'],
            ['coldness', 'Pitching'],
            ['overpowerment', 'Pitching'],
            ['ruthlessness', 'Pitching'],
            ['shakespearianism', 'Pitching'],
            ['suppression', 'Pitching?'],
            ['unthwackability', 'Pitching'],
            ['anticapitalism', 'Defense'],
            ['chasiness', 'Defense'],
            ['omniscience', 'Defense'],
            ['tenaciousness', 'Defense'],
            ['watchfulness', 'Defense'],
            ['baseThirst', 'Baserunning'],
            ['continuation', 'Baserunning'],
            ['groundFriction', 'Baserunning'],
            ['indulgence', 'Baserunning'],
            ['laserlikeness', 'Baserunning'],
            ['buoyancy', 'Vibes'],
            ['cinnamon', 'Vibes'],
            ['pressurization', 'Vibes'],
        ];

        for (const [key, category] of categories) {
            if (!Object.prototype.hasOwnProperty.call(player, key)) continue;
            addKey(key, category);
        }

        for (const key of Object.keys(player).sort()) {
            if (key === 'id') continue;
            if (!Object.prototype.hasOwnProperty.call(player, key)) continue;
            if (categories.some(cat => key === cat[0])) continue;
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
