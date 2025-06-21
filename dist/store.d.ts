type Schema = {
    [key: string]: any;
};
export type StoreType<T> = {
    [K in keyof T]: T[K] extends object ? T[K] extends Array<any> ? ReactiveCell<T[K]> : (StoreType<T[K]> & ReactiveCell<T[K]>) : ReactiveCell<T[K]>;
};
export interface ReactiveCell<T> {
    get(): T;
    set(val: T, propagate?: number): void;
    subscribe(listener: (value: T) => void): void;
    notify(propagate?: number): void;
    value: T;
    listeners: Array<(value: T) => void>;
}
export declare function createStore<T extends Schema>(schema: T, parent?: any): StoreType<T>;
export declare function createStoreValue<T>(parent: any, data: T): ReactiveCell<T>;
export {};
