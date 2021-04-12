import alwaysFk from './transforms/alwaysFk.js';
import { parseScript } from 'meriyah';
import { walk } from 'estree-walker';
import { generate } from 'astring';

export default function transform(source) {
    console.time('transforming');

    console.time('parsing');
    const ast = parseScript(source);
    console.timeEnd('parsing');

    console.time('walking');
    walk(ast, {
        enter(node) {
            alwaysFk(node, this);
        }
    });
    console.timeEnd('walking');

    console.time('writing');
    const transformed = generate(ast);
    console.timeEnd('writing');

    console.timeEnd('transforming');

    return transformed;
}
