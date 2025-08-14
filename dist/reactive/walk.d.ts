import { ReactiveCell, StoreType } from "../store.js";
export interface ReactiveCbParams {
    cell: ReactiveCell<any>;
    store: StoreType<any>;
    newValue: any;
    accessPath: (string)[];
    key: string | number;
}
export type ReactiveCallback = (params: ReactiveCbParams) => void;
export declare function subscribeToEntireStore(store: StoreType<any>, callback: ReactiveCallback, accessPath?: (string)[]): void;
