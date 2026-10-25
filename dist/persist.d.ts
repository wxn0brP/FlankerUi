import { StoreType } from "./store.js";
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
export declare function persist<T extends Record<string, any>>(store: StoreType<T>, opts: PersistOptions): PersistHandle;
