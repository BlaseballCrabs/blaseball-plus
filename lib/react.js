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

export function nth(fiber, n) {
    for (let i = 0; i < n; i++) {
        fiber = fiber.return;
    }

    return fiber;
}
