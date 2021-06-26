import camelCase from 'camelcase';
import runOnPage from '../runOnPage.js';
import { fiber, state, nth } from '../react.js';

function apply(stats, item, player) {
    let content = stats.closest('.ModalItem-Content');
    let fk = content.querySelector('.Player-Info-FK');

    if (fk) {
        for (const progressBar of fk.querySelectorAll('.progress-bar')) {
            const line = progressBar.closest('.Player-Info-Line');
            const header = line.querySelector('.Player-Info-Line-Header');
            const body = line.querySelector('.Player-Info-Line-Body');

            const name = header.textContent;
            let attr = camelCase(name);

            // TGB please
            switch (attr) {
                case 'bouyancy':
                    attr = 'buoyancy';
                    break;
                case 'suppresion':
                    attr = 'suppression';
                    break;
            }

            const val = player[attr];

            body.title = val.toString();
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

        let tabContent = stats.closest('.tab-content');
        let fkSubheader = content.querySelector('.Player-Info-FK-Subheader');

        if (fk) {
            content.removeChild(fkSubheader);
            content.removeChild(fk);
        }

        addButton('Hide Raw', event => {
            event.preventDefault();

            stats.innerHTML = '';
            for (const line of lines) {
                stats.append(line);
            }

            if (fk) {
                content.append(fkSubheader);
                content.append(fk);
            }

            tabContent.scroll(0, 0);
            content.scroll(0, 0);
        });

        tabContent.scroll(0, 0);
        content.scroll(0, 0);
    }

    addButton('Show Raw', showRaw);
}

async function patch(stats) {
    const bg = stats.closest('.Modal-Background');
    const item = stats.closest('.ModalItem');
    const player = await runOnPage((bg, item, fiber, state, nth) => new Promise(resolve => {
        const playerFiber = nth(fiber(bg || item), bg ? 2 : 3);
        if (state(playerFiber).player) {
            resolve(state(playerFiber).player);
        } else {
            let realState = undefined;
            let resolved = false;
            Object.defineProperty(playerFiber, 'memoizedState', {
                get() {
                    return realState;
                },

                set(val) {
                    realState = val;
                    if (!resolved && val.memoizedState && val.memoizedState.player) {
                        resolve(val.memoizedState.player);
                        resolved = true;
                    }
                }
            });
        }
    }))(bg, item, fiber, state, nth);
    apply(stats, item, player);
}

const playerStats = {
    name: 'playerStats',
    selector: '.Player-Info-Stats',
    contains: '.ModalItem-Ratings',
    applied: elem => elem.querySelector('.Player-Info-Line-Button'),
    apply: patch
};

export default playerStats;
