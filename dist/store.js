export const storeKeys = ["listeners", "value", "notify", "get", "set", "subscribe", "parent", "isStore"];
export function createStore(schema, parent) {
    const store = {};
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const isStore = typeof schema[key] === "object" &&
                !Array.isArray(schema[key]) &&
                schema[key] !== null;
            if (isStore) {
                store[key] = createStore(schema[key], store);
            }
            else {
                store[key] = new ReactiveCell(schema[key], store);
            }
        }
    }
    store.isStore = true;
    store.listeners = [];
    store.value = undefined;
    store.parent = parent;
    store.notify = (propagate = 0) => {
        store.listeners.forEach(listener => listener(store));
        if (propagate > 0 && parent && typeof parent.notify === "function") {
            parent.notify(propagate - 1);
        }
        return store;
    };
    store.get = () => {
        const obj = {};
        for (const key in store) {
            if (storeKeys.includes(key))
                continue;
            if (store.hasOwnProperty(key)) {
                obj[key] = store[key];
            }
        }
        return obj;
    };
    store.set = (data, propagate = 0) => {
        for (const key in data) {
            if (storeKeys.includes(key)) {
                throw new Error(`Reserved key: ${key}`);
            }
            if (!store.hasOwnProperty(key)) {
                throw new Error(`Unknown key: ${key}`);
            }
            const target = store[key];
            if (target.isStore) {
                throw new Error(`Cannot set nested store: ${key}`);
            }
            const value = data[key];
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                throw new Error(`Invalid value for key: ${key}`);
            }
        }
        for (const key in data) {
            store[key].set(data[key], propagate);
        }
        return store;
    };
    store.subscribe = (listener) => {
        store.listeners.push(listener);
        return store;
    };
    return store;
}
export function createStoreValue(parent, data) {
    return new ReactiveCell(data, parent);
}
export class ReactiveCell {
    value;
    parent;
    listeners = [];
    isStore = false;
    constructor(value, parent) {
        this.value = value;
        this.parent = parent;
    }
    get() {
        return this.value;
    }
    set(newVal, propagation = 0) {
        this.value = newVal;
        this.notify(propagation);
        return this;
    }
    notify(propagation = 0) {
        this.listeners.forEach(listener => listener(this.value));
        if (propagation > 0 && this.parent && typeof this.parent.notify === "function") {
            this.parent.notify(propagation - 1);
        }
        return this;
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return this;
    }
}
//# sourceMappingURL=store.js.map