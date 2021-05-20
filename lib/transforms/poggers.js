export default function poggers(node, ctx) {
    if (node.type !== 'ConditionalExpression') return;

    if (node.test.type === 'BinaryExpression') {
        if (node.consequent.type !== 'Literal') return;
        if (node.consequent.value !== 'MAJOR') return;

        ctx.replace({
            type: 'ConditionalExpression',
            test: {
                type: 'BinaryExpression',
                operator: '>=',
                left: node.test.left,
                right: {
                    type: 'Literal',
                    value: 1.0,
                }
            },
            consequent: {
                type: 'Literal',
                value: 'POGGERS',
            },
            alternate: node,
        });
        ctx.skip();
    }
}
