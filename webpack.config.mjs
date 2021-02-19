import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import WebExtWebpackPlugin from '@leo60228/web-ext-webpack-plugin';

const cwd = dirname(fileURLToPath(import.meta.url));
const addonDir = resolve(cwd, 'addon');

const config = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        content_script: './lib/content.js',
    },
    output: {
        path: addonDir,
        filename: '[name].js'
    },
    plugins: [
        new WebExtWebpackPlugin(addonDir, {
            startUrl: ['www.blaseball.com'],
            firefoxProfile: resolve(cwd, '.ff-profile'),
            profileCreateIfMissing: true,
            keepProfileChanges: true
        })
    ]
};

export default config;
