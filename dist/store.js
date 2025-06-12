export function createStore(schema, parent) {
    const store = {};
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const isStore = typeof schema[key] === "object" &&
                !Array.isArray(schema[key]) &&
                schema[key] !== null;
            if (isStore) {
                store[key] = createStore(schema[key], parent);
            }
            else {
                store[key] = createStoreValue(store, schema[key]);
            }
        }
    }
    store.listeners = [];
    store.value = undefined;
    store.notify = (propagate = 0) => {
        store.listeners.forEach(listener => listener(store));
        if (propagate > 0 && parent && typeof parent.notify === "function") {
            parent.notify(propagate - 1);
        }
    };
    store.get = () => {
        const obj = {};
        for (const key in store) {
            if (key === "listeners" ||
                key === "value" ||
                key === "notify" ||
                key === "get" ||
                key === "set" ||
                key === "subscribe")
                continue;
            if (store.hasOwnProperty(key)) {
                obj[key] = store[key];
            }
        }
        return obj;
    };
    store.set = () => {
        throw new Error("You can't set the entire store");
    };
    store.subscribe = (listener) => {
        store.listeners.push(listener);
    };
    return store;
}
export function createStoreValue(parent, data) {
    const cell = {
        value: data,
        listeners: [],
        get: () => cell.value,
        set: (newVal, propagation = 0) => {
            cell.value = newVal;
            cell.notify(propagation);
        },
        notify: (propagation = 0) => {
            cell.listeners.forEach(listener => listener(cell.value));
            if (propagation > 0 && parent && typeof parent.notify === "function") {
                parent.notify(propagation - 1);
            }
        },
        subscribe: (listener) => {
            cell.listeners.push(listener);
        },
    };
    return cell;
}
//# sourceMappingURL=store.js.map