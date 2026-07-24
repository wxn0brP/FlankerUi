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
export declare function prop(_target: any, context: ClassAccessorDecoratorContext): void;
export declare function query(selector: string): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function queryAll(selector: string): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function hide(storeCell: ReactiveCell<boolean>): (target: Function, context: ClassDecoratorContext) => Function;
export declare function listen(event: string, selector: string): (_target: any, context: ClassMethodDecoratorContext) => void;
