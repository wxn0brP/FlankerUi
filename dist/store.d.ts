type Schema = {
    [key: string]: any;
};
export type StoreType<T> = {
    [K in keyof T]: T[K] extends object ? T[K] extends Array<any> ? ReactiveCell<T[K]> : StoreType<T[K]> & ReactiveCell<T[K]> : ReactiveCell<T[K]>;
} & ReactiveCell<T> & {
    getPointer(): StoreType<T>;
};
export interface ReactiveCell<T> {
    isStore: boolean;
    get(): T;
    set(val: T, propagate?: number): this;
    subscribe(listener: (value: T) => void): this;
    notify(propagate?: number): this;
    value: T;
    listeners: Array<(value: T) => void>;
}
export declare const storeKeys: string[];
export declare function createStore<T extends Schema>(schema: T, parent?: any): StoreType<T>;
export declare function createStoreValue<T>(parent: any, data: T): ReactiveCell<T>;
export declare class ReactiveCell<T> implements ReactiveCell<T> {
    value: T;
    parent?: ReactiveCell<any>;
    listeners: Array<(value: T) => void>;
    isStore: boolean;
    constructor(value: T, parent?: ReactiveCell<any>);
}
export {};
