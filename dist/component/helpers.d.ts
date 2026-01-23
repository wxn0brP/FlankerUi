import { ReactiveCell } from "../store.js";
export declare function storeHide(element: HTMLElement, storeValue: ReactiveCell<boolean | any>): void;
export declare function bindHandlers(root: HTMLElement, map: Record<string, () => void>, event?: string): void;
export declare function renderList<T = any>(container: HTMLElement, items: T[], renderItem: (item: T, index: number) => string, ifElse?: string): void;
export declare function renderListNodes<T = any>(container: HTMLElement, items: T[], renderItem: (item: T, index: number) => HTMLElement, ifElse?: string | HTMLElement): void;
export declare function watchInput(el: HTMLInputElement, store: ReactiveCell<string>, setFromElement?: boolean): void;
export declare function watchSelect(el: HTMLSelectElement, store: ReactiveCell<string>, setFromElement?: boolean): void;
export declare function watchCheckbox(el: HTMLInputElement, store: ReactiveCell<boolean>, setFromElement?: boolean): void;
export declare function htmlToElement<T = HTMLElement>(html: string): T;
