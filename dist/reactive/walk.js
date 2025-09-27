import { storeKeys } from "../store.js";
export function subscribeToEntireStore(store, callback, accessPath = []) {
    if (!store)
        return;
    for (const key in store) {
        if (storeKeys.includes(key))
            continue;
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