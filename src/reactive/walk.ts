import { ReactiveCell, StoreType } from "../store";

export interface ReactiveCbParams {
    cell: ReactiveCell<any>;
    store: StoreType<any>;
    newValue: any;
    accessPath: (string)[];
    key: string | number;
}
export type ReactiveCallback = (params: ReactiveCbParams) => void;

export function subscribeToEntireStore(
    store: any,
    callback: ReactiveCallback,
    accessPath: (string)[] = []
): void {
    for (const key in store) {
        const cell = store[key];
        if (!cell || cell?.isStore === undefined) continue;

        if (cell.isStore) {
            subscribeToEntireStore(cell as any, callback, [...accessPath, key]);
        } else {
            function call(newValue: any) {
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