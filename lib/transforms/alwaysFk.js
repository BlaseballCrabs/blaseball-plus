export default function alwaysFk(node, ctx) {
    if (node.type !== 'ConditionalExpression') return;

    if (node.test.type === 'LogicalExpression') {
        if (node.test.operator !== '&&') return;
        if (node.test.left.type !== 'BinaryExpression') return;
        if (node.test.left.right.type !== 'MemberExpression') return;
        if (node.test.left.right.computed) return;
        if (node.test.left.right.property.name !== 'Forbidden_Knowledge_Access') return;

        if (node.test.right.type === 'BinaryExpression' && node.test.right.left.type === 'Literal') {
            node.test = node.test.right;
        } else {
            ctx.replace(node.consequent);
        }
    } else if (node.test.type === 'BinaryExpression') {
        if (node.test.right.type !== 'MemberExpression') return;
        if (node.test.right.computed) return;
        if (node.test.right.property.name !== 'Forbidden_Knowledge_Access') return;

        ctx.replace(node.consequent);
    }
}
