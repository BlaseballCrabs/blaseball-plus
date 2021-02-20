export function fiber(node) {
    for (const key in node) {
        if (key.startsWith('__reactInternalInstance$')) {
            return node[key];
        }
    }
}

export function state(fiber) {
    if (fiber.memoizedState.memoizedState) {
        return fiber.memoizedState.memoizedState;
    } else {
        return fiber.memoizedState.baseQueue.eagerState;
    }
}

export function props(fiber) {
    return fiber.memoizedProps;
}

export function ctxProvider(fiber) {
    for (;;) {
        fiber = fiber.return;
        if (fiber.elementType && fiber.elementType.$$typeof === Symbol.for('react.provider')) {
            return fiber;
        }
    }
}

export function findContext(fiber, prop) {
    for (;;) {
        if (fiber.memoizedProps.value && prop in fiber.memoizedProps.value) {
            return fiber.memoizedProps.value[prop];
        }
        fiber = (this.ctxProvider || ctxProvider)(fiber);
    }
}

export function nth(fiber, n) {
    for (let i = 0; i < n; i++) {
        fiber = fiber.return;
    }

    return fiber;
}
