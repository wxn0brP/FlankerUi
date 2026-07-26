import { ReactiveCell } from "./store.js";
export declare function toggleBoolean(cell: ReactiveCell<boolean>): ReactiveCell<boolean>;
export declare function updateCell<T>(cell: ReactiveCell<T>, fn: (val: T) => T): ReactiveCell<T>;
export declare function pushToCell<T>(cell: ReactiveCell<T[]>, item: T): ReactiveCell<T[]>;
export declare function toggleInSetCell<T>(cell: ReactiveCell<Set<T>>, item: T): ReactiveCell<Set<T>>;
export declare function incrementCell(cell: ReactiveCell<number>, by?: number): ReactiveCell<number>;
export declare function decrementCell(cell: ReactiveCell<number>, by?: number): ReactiveCell<number>;
