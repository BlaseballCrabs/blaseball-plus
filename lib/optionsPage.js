import getOptions from './options.js';

async function main() {
    const options = await getOptions();

    const form = document.querySelector('#options');
    const url = document.querySelector('#url');
    const saved = document.querySelector('#saved');

    if (options.getUrl()) {
        url.value = options.getUrl();
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await options.setUrl(url.value);

        saved.style.display = 'inline';
        setTimeout(() => saved.style.display = 'none', 1000);
    });
}

main();
