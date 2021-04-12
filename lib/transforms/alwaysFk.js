export default function({ types: t }) {
    return {
        visitor: {
            ConditionalExpression(path) {
                if (t.isLogicalExpression(path.node.test)) {
                    if (path.node.test.operator !== '&&') return;
                    if (!t.isBinaryExpression(path.node.test.left)) return;
                    if (!t.isMemberExpression(path.node.test.left.right)) return;
                    if (path.node.test.left.right.computed) return;
                    if (path.node.test.left.right.property.name !== 'Forbidden_Knowledge_Access') return;

                    if (t.isBinaryExpression(path.node.test.right) && t.isStringLiteral(path.node.test.right.left)) {
                        path.node.test = path.node.test.right;
                    } else {
                        path.replaceWith(path.node.consequent);
                    }
                } else if (t.isBinaryExpression(path.node.test)) {
                    if (!t.isMemberExpression(path.node.test.right)) return;
                    if (path.node.test.right.computed) return;
                    if (path.node.test.right.property.name !== 'Forbidden_Knowledge_Access') return;

                    path.replaceWith(path.node.consequent);
                }
            }
        }
    }
}
