type Schema = {
    [key: string]: any;
};

export type StoreType<T> = {
    [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
    ? ReactiveCell<T[K]>
    : (StoreType<T[K]> & ReactiveCell<T[K]>)
    : ReactiveCell<T[K]>;
} & ReactiveCell<T>;

export interface ReactiveCell<T> {
    isStore: boolean;
    get(): T;
    set(val: T, propagate?: number): this;
    subscribe(listener: (value: T) => void): this;
    notify(propagate?: number): this;
    value: T;
    listeners: Array<(value: T) => void>;
}

export function createStore<T extends Schema>(schema: T, parent?: any): StoreType<T> {
    const store: any = {};
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const isStore =
                typeof schema[key] === "object" &&
                !Array.isArray(schema[key]) &&
                schema[key] !== null;

            if (isStore) {
                store[key] = createStore(schema[key], store);
            } else {
                store[key] = new ReactiveCell(schema[key], store);
            }
        }
    }
    store.isStore = true;
    store.listeners = [];
    store.value = undefined;
    store.parent = parent;

    store.notify = (propagate: number = 0) => {
        store.listeners.forEach(listener => listener(store));
        if (propagate > 0 && parent && typeof parent.notify === "function") {
            parent.notify(propagate - 1);
        }
        return store;
    }

    store.get = () => {
        const obj: any = {};
        for (const key in store) {
            if (
                key === "listeners" ||
                key === "value" ||
                key === "notify" ||
                key === "get" ||
                key === "set" ||
                key === "subscribe" ||
                key === "parent" ||
                key === "isStore"
            ) continue;
            if (store.hasOwnProperty(key)) {
                obj[key] = store[key];
            }
        }
        return obj;
    }

    store.set = () => {
        throw new Error("You can't set the entire store");
    }

    store.subscribe = (listener: (value: T) => void) => {
        store.listeners.push(listener);
        return store;
    }

    return store as StoreType<T>;
}

export function createStoreValue<T>(parent: any, data: T): ReactiveCell<T> {
    return new ReactiveCell(data, parent);
}

export class ReactiveCell<T> implements ReactiveCell<T> {
    listeners: Array<(value: T) => void> = [];
    isStore = false;

    constructor(public value: T, public parent?: ReactiveCell<any>) { }

    get(): T {
        return this.value;
    }

    set(newVal: T, propagation: number = 0): this {
        this.value = newVal;
        this.notify(propagation);
        return this;
    }

    notify(propagation: number = 0): this {
        this.listeners.forEach(listener => listener(this.value));
        if (propagation > 0 && this.parent && typeof this.parent.notify === "function") {
            this.parent.notify(propagation - 1);
        }
        return this;
    }

    subscribe(listener: (value: T) => void): this {
        this.listeners.push(listener);
        return this;
    }
}
