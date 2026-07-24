import type { ReactiveCell } from "../store.js";
export interface PropOptions {
    attribute?: boolean | string;
    type?: Function;
}
export interface QueryOptions {
    selector: string;
    type: "querySelector" | "querySelectorAll";
}
export interface EventOptions {
    event: string;
    selector?: string;
}
export declare function prop(_target: any, name: string): void;
export declare function query(selector: string): (proto: any, name: string) => void;
export declare function qi(selector: string): (proto: any, name: string) => void;
export declare function queryAll(selector: string): (proto: any, name: string) => void;
export declare function hide(storeCell: ReactiveCell<boolean>): (Ctor: any) => any;
export declare function on(event: string, selector?: string): (proto: any, name: string) => void;
