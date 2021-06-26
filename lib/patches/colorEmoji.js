const brokenEmoji = [
    '\u{1f3dd}', // fridays
    '\u{1f6e0}', // mechanics
    '\u{1f575}', // spies
    ['\u{1f5e3}', '\u2b24'], // moist talkers
    '\u{1f579}', // real game band
    '\u{1f5bc}', // artists
    '\u{1f43f}', // squirrels
];

async function patch(elem) {
    let text = elem.firstChild;

    if (text.nodeType !== Node.TEXT_NODE) return;

    for (const broken of brokenEmoji) {
        let match;
        let replacement;

        if (Array.isArray(broken)) {
            match = broken[0];
            replacement = broken[1];
        } else {
            match = broken;
            replacement = `${broken}\ufe0f`
        }

        if (text.data.includes(match) && !text.data.includes(replacement)) {
            text.data = text.data.replace(match, replacement);
        }
    }
}

const colorEmoji = {
    name: 'colorEmoji',
    selector: '.GameWidget-ScoreTeamColorBar, .Team-Logo, .Widget-PlayerLineName, .Standings-Team-Emoji, .Leaderboard-Team-Emoji, .Bulletin-Widget-ScoreTeamColorBar, .Navigation-FavoriteTeamEmoji, .BossFightWidget-ScoreTeamColorBar, .PlayoffSetup-MatchupTeam-Icon, div.Events-List-Row.Events-List-Minor, .Reorder-Spread-Card-Icon, .Account-Section-Item-Icon, .Recap-Earlsiesta-Card-Icon, .Recap-Blessing-Team, .TeamLogo, .Account-Spread-Card-Icon, .Events-List-Row-Group, .Events-List-Minor, .Events-List-Row > span:first-child, .DepthChart-Team',
    applied: () => false,
    apply: patch
};

export default colorEmoji;
