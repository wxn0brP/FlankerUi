import { storeKeys } from "./store.js";
import { debounce } from "./utils.js";
function flatten(store, prefix = "", out = new Map()) {
    for (const key in store) {
        if (storeKeys.includes(key))
            continue;
        if (!Object.hasOwn(store, key))
            continue;
        const value = store[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (value?.isStore) {
            flatten(value, path, out);
        }
        else if (typeof value?.set === "function") {
            out.set(path, value);
        }
    }
    return out;
}
function matches(path, pick) {
    if (!pick?.length)
        return true;
    return pick.some(item => path === item || path.startsWith(`${item}.`));
}
function toObject(cells) {
    const data = {};
    for (const [path, cell] of cells) {
        const parts = path.split(".");
        let target = data;
        for (let i = 0; i < parts.length - 1; i++) {
            target[parts[i]] ??= {};
            target = target[parts[i]];
        }
        target[parts[parts.length - 1]] = cell.get();
    }
    return data;
}
function apply(data, cells, prefix = "") {
    if (!data || typeof data !== "object")
        return;
    for (const key in data) {
        const path = prefix ? `${prefix}.${key}` : key;
        const value = data[key];
        const cell = cells.get(path);
        if (cell) {
            cell.set(value);
        }
        else if (value && typeof value === "object" && !Array.isArray(value)) {
            apply(value, cells, path);
        }
    }
}
export function persist(store, opts) {
    const storage = opts.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
    const cells = flatten(store);
    for (const path of [
        ...cells.keys(),
    ]) {
        if (!matches(path, opts.pick))
            cells.delete(path);
    }
    if (storage) {
        try {
            const raw = storage.getItem(opts.key);
            if (raw !== null) {
                const data = opts.deserialize ? opts.deserialize(raw) : JSON.parse(raw);
                apply(data, cells);
            }
        }
        catch (error) {
            console.error(`persist: cannot restore "${opts.key}"`, error);
        }
    }
    const save = () => {
        if (!storage)
            return;
        try {
            const data = toObject(cells);
            storage.setItem(opts.key, opts.serialize ? opts.serialize(data) : JSON.stringify(data));
        }
        catch (error) {
            console.error(`persist: cannot save "${opts.key}"`, error);
        }
    };
    const saveDebounced = debounce(save, opts.debounce ?? 100);
    for (const cell of cells.values())
        cell.subscribe(() => saveDebounced());
    return {
        save,
        clear: () => {
            try {
                storage?.removeItem(opts.key);
            }
            catch (error) {
                console.error(`persist: cannot clear "${opts.key}"`, error);
            }
        },
    };
}
//# sourceMappingURL=persist.js.map