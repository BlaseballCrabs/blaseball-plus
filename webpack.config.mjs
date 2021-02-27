import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import WebExtWebpackPlugin from '@leo60228/web-ext-webpack-plugin';

const cwd = dirname(fileURLToPath(import.meta.url));
const addonDir = resolve(cwd, 'addon');

const config = env => ({
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval-source-map',
    entry: {
        content_script: './lib/content.js',
        early_content_script: './lib/earlyContent.js',
    },
    output: {
        path: addonDir,
        filename: '[name].js'
    },
    plugins: [
        new WebExtWebpackPlugin(addonDir, env.chromium ? {
            target: 'chromium',
            startUrl: ['www.blaseball.com']
        } : {
            target: 'firefox-desktop',
            startUrl: ['www.blaseball.com'],
            firefoxProfile: resolve(cwd, '.ff-profile'),
            profileCreateIfMissing: true,
            keepProfileChanges: true
        })
    ],
    node: {
        global: false
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/i,
                type: 'asset/source'
            }
        ]
    }
});

export default config;
