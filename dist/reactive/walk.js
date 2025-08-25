export function subscribeToEntireStore(store, callback, accessPath = []) {
    for (const key in store) {
        const cell = store[key];
        if (!cell || cell?.isStore === undefined)
            continue;
        if (cell.isStore) {
            subscribeToEntireStore(cell, callback, [...accessPath, key]);
        }
        else {
            function call(newValue) {
                callback({
                    cell,
                    store,
                    newValue,
                    accessPath,
                    key,
                });
            }
            cell.subscribe(val => call(val));
            call(cell.get());
        }
    }
}
//# sourceMappingURL=walk.js.map