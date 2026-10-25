import { ReactiveCell, StoreType, storeKeys } from "./store";
import { debounce } from "./utils";

export interface PersistOptions {
	key: string;
	storage?: Storage;
	pick?: string[];
	debounce?: number;
	serialize?: (data: Record<string, any>) => string;
	deserialize?: (raw: string) => Record<string, any>;
}

export interface PersistHandle {
	save: () => void;
	clear: () => void;
}

function flatten(
	store: any,
	prefix = "",
	out: Map<string, ReactiveCell<any>> = new Map(),
): Map<string, ReactiveCell<any>> {
	for (const key in store) {
		if (storeKeys.includes(key)) continue;
		if (!Object.hasOwn(store, key)) continue;

		const value = store[key];
		const path = prefix ? `${prefix}.${key}` : key;

		if (value?.isStore) {
			flatten(value, path, out);
		} else if (typeof value?.set === "function") {
			out.set(path, value);
		}
	}

	return out;
}

function matches(path: string, pick?: string[]) {
	if (!pick?.length) return true;
	return pick.some(item => path === item || path.startsWith(`${item}.`));
}

function toObject(cells: Map<string, ReactiveCell<any>>) {
	const data: Record<string, any> = {};

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

function apply(data: any, cells: Map<string, ReactiveCell<any>>, prefix = "") {
	if (!data || typeof data !== "object") return;

	for (const key in data) {
		const path = prefix ? `${prefix}.${key}` : key;
		const value = data[key];
		const cell = cells.get(path);

		if (cell) {
			cell.set(value);
		} else if (value && typeof value === "object" && !Array.isArray(value)) {
			apply(value, cells, path);
		}
	}
}

export function persist<T extends Record<string, any>>(
	store: StoreType<T>,
	opts: PersistOptions,
): PersistHandle {
	const storage =
		opts.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
	const cells = flatten(store);

	for (const path of [
		...cells.keys(),
	]) {
		if (!matches(path, opts.pick)) cells.delete(path);
	}

	if (storage) {
		try {
			const raw = storage.getItem(opts.key);
			if (raw !== null) {
				const data = opts.deserialize ? opts.deserialize(raw) : JSON.parse(raw);
				apply(data, cells);
			}
		} catch (error) {
			console.error(`persist: cannot restore "${opts.key}"`, error);
		}
	}

	const save = () => {
		if (!storage) return;

		try {
			const data = toObject(cells);
			storage.setItem(
				opts.key,
				opts.serialize ? opts.serialize(data) : JSON.stringify(data),
			);
		} catch (error) {
			console.error(`persist: cannot save "${opts.key}"`, error);
		}
	};

	const saveDebounced = debounce<() => void>(save, opts.debounce ?? 100);
	for (const cell of cells.values()) cell.subscribe(() => saveDebounced());

	return {
		save,
		clear: () => {
			try {
				storage?.removeItem(opts.key);
			} catch (error) {
				console.error(`persist: cannot clear "${opts.key}"`, error);
			}
		},
	};
}
