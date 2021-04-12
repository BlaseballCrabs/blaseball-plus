import { transformAsync } from '@babel/core';
import alwaysFk from './transforms/alwaysFk.js';

const options = {
    plugins: [alwaysFk],
    generatorOpts: {
        compact: true
    }
};

export default async function transform(source) {
    console.time('transforming');
    const { code } = await transformAsync(source, options);
    console.timeEnd('transforming');
    return code;
}
