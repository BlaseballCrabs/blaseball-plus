import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import WebExtWebpackPlugin from '@leo60228/web-ext-webpack-plugin';
import { createRequire } from 'module';
import webpack from 'webpack';

const require = createRequire(import.meta.url);

const cwd = dirname(fileURLToPath(import.meta.url));
const addonDir = resolve(cwd, 'addon');

const config = env => ({
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'cheap-source-map',
    entry: {
        content_script: './lib/content.js',
        background_script: './lib/background.js',
        options_page: './lib/optionsPage.js',
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
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: 'buffer/'
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
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            assert: require.resolve('assert/'),
            fs: false
        }
    }
});

export default config;
