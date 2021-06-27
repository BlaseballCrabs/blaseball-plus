export default function noCinnamon(node, ctx) {
    if (node.type !== 'MemberExpression') return;
    if (node.computed) return;
    if (node.object.type !== 'MemberExpression') return;
    if (node.object.computed) return;
    if (node.object.property.name !== 'player') return;
    if (node.property.name !== 'cinnamon') return;

    ctx.replace({
        type: 'LogicalExpression',
        operator: '||',
        left: node,
        right: {
            type: 'Literal',
            value: 0,
        },
    });
    ctx.skip();
}
